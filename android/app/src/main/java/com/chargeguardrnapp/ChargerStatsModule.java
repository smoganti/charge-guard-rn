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

import java.util.Timer;
import java.util.TimerTask;

public class ChargerStatsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public ChargerStatsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ChargerStats";
    }

    private WritableMap getCurrentBatteryStats() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = reactContext.registerReceiver(null, ifilter);

        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        float batteryPct = level * 100 / (float)scale;

        int temperature = batteryStatus.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1);
        int voltage = batteryStatus.getIntExtra(BatteryManager.EXTRA_VOLTAGE, -1);
        int current = batteryStatus.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
        boolean isCharging = current == BatteryManager.BATTERY_PLUGGED_AC ||
                             current == BatteryManager.BATTERY_PLUGGED_USB ||
                             current == BatteryManager.BATTERY_PLUGGED_WIRELESS;

        BatteryManager bm = (BatteryManager) reactContext.getSystemService(Context.BATTERY_SERVICE);
        long currentNow = bm.getLongProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW);
        long power = currentNow * voltage / 1000; // in mW

        WritableMap stats = Arguments.createMap();
        stats.putDouble("batteryLevel", batteryPct);
        stats.putBoolean("isCharging", isCharging);
        stats.putDouble("temperature", temperature / 10.0); // in Celsius
        stats.putDouble("power", power); // in mW
        stats.putDouble("voltage", voltage);
        stats.putDouble("current", currentNow);

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
    public void startListening() {
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                try {
                    WritableMap stats = getCurrentBatteryStats();
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onBatteryStatsChanged", stats);
                } catch (Exception e) {
                    // Handle exception
                }
            }
        }, 0, 5000); // every 5 seconds
    }
}