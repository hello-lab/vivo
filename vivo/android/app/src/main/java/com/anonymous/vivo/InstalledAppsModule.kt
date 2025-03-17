package com.anonymous.vivo

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class InstalledAppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledAppsModule"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            
            // Filter out system apps & format data
            val appList = packages
                .filter { it.flags and ApplicationInfo.FLAG_SYSTEM == 0 } 
                .map {
                    mapOf(
                        "appName" to pm.getApplicationLabel(it).toString(),
                        "packageName" to it.packageName
                    )
                }

            promise.resolve(appList)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to fetch apps", e)
        }
    }
}
