package com.chargeguardrnapp.modules

import android.app.AppOpsManager
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.os.Process
import android.provider.Settings
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

class BatteryStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "BatteryStatsModule"

    @ReactMethod
    fun getAppUsageStats(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            val packageManager = reactApplicationContext.packageManager

            if (usageStatsManager == null) {
                promise.reject("ERROR", "Usage Stats Manager is not available")
                return
            }

            val endTime = System.currentTimeMillis()
            val startTime = endTime - (24 * 60 * 60 * 1000) // Last 24 hours

            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val filteredStats = stats
                .filter { it.totalTimeInForeground > 0 }
                .mapNotNull { stat ->
                    try {
                        val appInfo = packageManager.getApplicationInfo(stat.packageName, 0)
                        // Include only non-system apps
                        if (appInfo.flags and ApplicationInfo.FLAG_SYSTEM == 0) {
                            stat to appInfo
                        } else null
                    } catch (e: PackageManager.NameNotFoundException) {
                        null
                    }
                }
                .sortedByDescending { it.first.totalTimeInForeground }

            val appStats = Arguments.createArray()

            filteredStats.forEach { (stat, appInfo) ->
                Arguments.createMap().apply {
                    putString("packageName", stat.packageName)
                    putString("appName", packageManager.getApplicationLabel(appInfo).toString())
                    putDouble("usageTime", stat.totalTimeInForeground.toDouble())
                    putDouble("lastTimeUsed", stat.lastTimeUsed.toDouble())

                    // Get app icon
                    val icon = packageManager.getApplicationIcon(appInfo)
                    putString("icon", convertDrawableToBase64(icon))

                    // Get power usage estimation
                    val powerUsage = estimateAppPowerUsage(stat, appInfo)
                    putDouble("powerUsage", powerUsage)

                    appStats.pushMap(this)
                }
            }

            promise.resolve(appStats)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getDetailedAppStats(packageName: String, promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

            val endTime = System.currentTimeMillis()
            val startTime = endTime - (24 * 60 * 60 * 1000)

            val statsList = usageStatsManager?.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val stats = statsList?.find { it.packageName == packageName }
                ?: throw Exception("No usage stats found for package")

            Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("appName", packageManager.getApplicationLabel(appInfo).toString())
                putString("icon", convertDrawableToBase64(packageManager.getApplicationIcon(appInfo)))

                // Usage times
                putDouble("usageTime", stats.totalTimeInForeground.toDouble())
                putDouble("lastTimeUsed", stats.lastTimeUsed.toDouble())

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    putDouble("lastTimeForegroundServiceUsed", stats.lastTimeForegroundServiceUsed.toDouble())
                    putDouble("totalTimeForegroundServiceUsed", stats.totalTimeForegroundServiceUsed.toDouble())
                }

                // Power usage estimates
                val totalPower = estimateAppPowerUsage(stats, appInfo)
                putDouble("powerUsage", totalPower)

                // Estimate background vs foreground power usage
                val foregroundPower = totalPower * 0.7 // Assuming 70% power used in foreground
                val backgroundPower = totalPower * 0.3 // Assuming 30% power used in background
                putDouble("foregroundPowerUsage", foregroundPower)
                putDouble("backgroundPowerUsage", backgroundPower)

                // Additional stats
                putDouble("averagePowerDraw", totalPower / (stats.totalTimeInForeground / 3600000.0)) // mAh per hour
                putDouble("cpuTimeMs", stats.totalTimeInForeground * 0.3) // Rough CPU time estimate
                putInt("wakelocksCount", (stats.totalTimeInForeground / 300000).toInt()) // Rough estimate

                promise.resolve(this)
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun checkUsageStatsPermission(promise: Promise) {
        try {
            val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                reactApplicationContext.packageName
            )
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openUsageSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactApplicationContext.startActivity(intent)
    }

    private fun convertDrawableToBase64(drawable: Drawable): String {
        return try {
            val bitmap = when (drawable) {
                is BitmapDrawable -> drawable.bitmap
                else -> {
                    val bitmap = Bitmap.createBitmap(
                        drawable.intrinsicWidth,
                        drawable.intrinsicHeight,
                        Bitmap.Config.ARGB_8888
                    )
                    val canvas = Canvas(bitmap)
                    drawable.setBounds(0, 0, canvas.width, canvas.height)
                    drawable.draw(canvas)
                    bitmap
                }
            }

            ByteArrayOutputStream().use { stream ->
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
                Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT)
            }
        } catch (e: Exception) {
            ""
        }
    }

    private fun estimateAppPowerUsage(stats: UsageStats, appInfo: ApplicationInfo): Double {
        // Base power usage per hour of active use (in mAh)
        val basePowerPerHour = 100.0

        // Calculate hours of usage
        val hoursOfUsage = stats.totalTimeInForeground / 3600000.0

        // Adjust based on app category
        var multiplier = 1.0

        // Adjust multiplier based on app category
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            when (appInfo.category) {
                ApplicationInfo.CATEGORY_GAME -> multiplier = 2.0
                ApplicationInfo.CATEGORY_VIDEO,
                ApplicationInfo.CATEGORY_AUDIO -> multiplier = 1.5 
            }
        }

        return basePowerPerHour * hoursOfUsage * multiplier
    }
}