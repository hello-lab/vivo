package com.anonymous.vivo

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.app.usage.UsageStatsManager

object PermissionHelper {
    fun hasUsageAccessPermission(context: Context): Boolean {
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, 0, System.currentTimeMillis())
        return appList.isNotEmpty()
    }

    fun requestUsageAccess(activity: Activity) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        activity.startActivity(intent)
    }
}
