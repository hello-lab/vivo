package com.anonymous.vivo

import android.app.*
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import android.content.SharedPreferences
import org.json.JSONArray
import android.database.sqlite.SQLiteDatabase

class AppBlockService : Service() {

    private val handler = Handler()
    private val checkInterval = 2000L // Check every 2 seconds

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForegroundService()
        handler.post(checkAppRunnable)
        return START_STICKY
    }

    private val checkAppRunnable = object : Runnable {
        override fun run() {
            val restrictedApps = getRestrictedAppsFromStorage() // Get latest blocked apps
            val currentApp = getForegroundApp()
            Log.d("APP_BLOCK", "Current App: $currentApp")

            if (currentApp in restrictedApps) {
                Log.d("APP_BLOCK", "Blocked app detected: $currentApp")
                showFakeErrorScreen()
            }
            handler.postDelayed(this, checkInterval)
        }
    }

    private fun getForegroundApp(): String? {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val time = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            time - 5000,
            time
        )
        return stats?.maxByOrNull { it.lastTimeUsed }?.packageName
    }

    private fun getRestrictedAppsFromStorage(): List<String> {
        val dbPath = "/data/data/com.anonymous.vivo/databases/RKStorage"
        val restrictedApps = mutableListOf<String>()
    
        try {
            val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
            val cursor = db.rawQuery("SELECT value FROM catalystLocalStorage WHERE key='restrictedApps'", null)
    
            if (cursor.moveToFirst()) {
                val jsonString = cursor.getString(0) // Get stored JSON
                Log.d("APP_BLOCK", "Raw JSON from storage: $jsonString")
                val jsonArray = JSONArray(jsonString)
    
                for (i in 0 until jsonArray.length()) {
                    restrictedApps.add(jsonArray.getString(i))
                }
            }
    
            cursor.close()
            db.close()
        } catch (e: Exception) {
            Log.e("APP_BLOCK", "Error reading restricted apps from storage", e)
        }
    
        return restrictedApps
    }
    private fun showFakeErrorScreen() {
        val fakeErrorIntent = Intent(this, FakeErrorActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            fakeErrorIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        startActivity(fakeErrorIntent)
    }

    private fun startForegroundService() {
        val notificationChannelId = "AppBlockServiceChannel"
        val channel = NotificationChannel(
            notificationChannelId,
            "App Block Service",
            NotificationManager.IMPORTANCE_LOW
        )
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)

        val notification = NotificationCompat.Builder(this, notificationChannelId)
            .setContentTitle("App Block Service Running")
            .setContentText("Monitoring blocked apps.")
            .build()

        startForeground(1, notification)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        handler.removeCallbacks(checkAppRunnable)
        super.onDestroy()
    }
}
