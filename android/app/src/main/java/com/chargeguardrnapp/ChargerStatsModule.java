package com.chargeguardrnapp;

import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.content.Context;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.app.ActivityManager;
import android.util.Log;
import android.app.KeyguardManager;
import android.os.PowerManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import java.util.List;

public class ChargerStatsModule extends ReactContextBaseJavaModule {
    private static final String TAG = "ChargerStatsModule";
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver batteryReceiver;
    private boolean debugMode = false;

    public ChargerStatsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.batteryReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (Intent.ACTION_BATTERY_CHANGED.equals(action)
                    || Intent.ACTION_POWER_CONNECTED.equals(action)
                    || Intent.ACTION_POWER_DISCONNECTED.equals(action)) {
                    WritableMap stats = getCurrentBatteryStats();
                    boolean showPopup = Intent.ACTION_POWER_CONNECTED.equals(action);

                    if (debugMode) {
                        Log.d(TAG, "Battery Event: " + action);
                        Log.d(TAG, "Battery Stats: " + stats.toString());
                    }

                    WritableMap eventData = Arguments.createMap();
                    eventData.putMap("data", stats);
                    eventData.putBoolean("showPopup", showPopup);

                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onChargerStatusChanged", eventData);
                }
            }
        };
    }

    @ReactMethod
    public void setDebugMode(boolean enabled) {
        debugMode = enabled;
        if (debugMode) Log.d(TAG, "Debug mode enabled from JS");
    }

    @NonNull
    @Override
    public String getName() {
        return "ChargerStats";
    }

    // Function to calculate charge score
    private int calculateChargeScore(double power, double temperature) {
        int score = 100;

        // Temperature checks (in Celsius)
        if (temperature > 45.0) {
            score -= 40; // High temp is bad
        } else if (temperature > 35.0) {
            score -= 20; // Warm temp is okay but not ideal
        } else if (temperature < 10.0) {
            score -= 10; // Very cold can also be suboptimal
        }

        // Power checks (in mW)
        if (power < 5000) { // Less than 5W
            score -= 30; // Slow charging
        } else if (power < 10000) { // Less than 10W
            score -= 15; // Average charging
        }
        // Assumes >10W is good charging

        return Math.max(0, score); // Ensure score doesn't go below 0
    }


    private WritableMap getCurrentBatteryStats() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = reactContext.registerReceiver(null, ifilter);

        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        float batteryPct = level * 100 / (float)scale;

        int temperature = batteryStatus.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1);
        double tempCelsius = temperature / 10.0;
        int voltage = batteryStatus.getIntExtra(BatteryManager.EXTRA_VOLTAGE, -1);
        int pluggedStatus = batteryStatus.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
        boolean isCharging = pluggedStatus == BatteryManager.BATTERY_PLUGGED_AC ||
                             pluggedStatus == BatteryManager.BATTERY_PLUGGED_USB ||
                             pluggedStatus == BatteryManager.BATTERY_PLUGGED_WIRELESS;

        BatteryManager bm = (BatteryManager) reactContext.getSystemService(Context.BATTERY_SERVICE);
        long currentNow = bm.getLongProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW);
        double power = (currentNow / 1000.0) * (voltage / 1000.0); // in Watts

        long timeToFullMillis = -1;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) { // P for API 28
             timeToFullMillis = bm.computeChargeTimeRemaining();
        }

        // Calculate score
        int score = calculateChargeScore(power * 1000, tempCelsius); // power in mW for calculation

        WritableMap stats = Arguments.createMap();
        stats.putDouble("batteryLevel", batteryPct);
        stats.putBoolean("isCharging", isCharging);
        stats.putDouble("temperature", tempCelsius);
        stats.putDouble("power", power); // in Watts
        stats.putDouble("voltage", voltage);
        stats.putDouble("current", currentNow);
        stats.putDouble("eta", timeToFullMillis != -1 ? timeToFullMillis / 60000.0 : -1); // in minutes
        stats.putInt("score", score); // Add the score

        return stats;
    }

    @ReactMethod
    public void getBatteryStats(Promise promise) {
        try {
            promise.resolve(getCurrentBatteryStats());
        } catch (Exception e) {
            promise.reject("Error getting battery stats", e);
        }
    }

    @ReactMethod
    public void startBatteryMonitoring() {
        IntentFilter ifilter = new IntentFilter();
        ifilter.addAction(Intent.ACTION_POWER_CONNECTED);
        ifilter.addAction(Intent.ACTION_POWER_DISCONNECTED);
        reactContext.registerReceiver(batteryReceiver, ifilter);
    }

    @ReactMethod
    public void stopBatteryMonitoring() {
        try {
            reactContext.unregisterReceiver(batteryReceiver);
        } catch (IllegalArgumentException e) {
            // Receiver not registered, ignore
        }
    }

    private boolean isAppInForeground() {
        ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = reactContext.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND && appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    private boolean isScreenOnAndUnlocked() {
        PowerManager powerManager = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
        boolean isScreenOn = powerManager.isInteractive();
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
        boolean isDeviceLocked = keyguardManager.isKeyguardLocked();
        return isScreenOn && !isDeviceLocked;
    }
}