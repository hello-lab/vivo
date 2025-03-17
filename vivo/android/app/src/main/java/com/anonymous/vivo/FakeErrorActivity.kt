package com.anonymous.vivo

import android.app.Activity
import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.LinearLayout
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.util.Log

class FakeErrorActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val restrictedApps = listOf("com.instagram.android", "com.facebook.katana")

        // Force stop restricted apps
        val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        for (packageName in restrictedApps) {
            try {
                activityManager.killBackgroundProcesses(packageName)
                Log.d("FakeErrorActivity", "Killed app: $packageName")
            } catch (e: Exception) {
                Log.e("FakeErrorActivity", "Failed to kill app: $packageName", e)
            }
        }

        // Create fake error UI
        val layout = LinearLayout(this)
        layout.setBackgroundColor(Color.BLACK)
        layout.orientation = LinearLayout.VERTICAL
        layout.setPadding(50, 200, 50, 200)
        layout.gravity = Gravity.CENTER

        val errorText = TextView(this)
        errorText.text = "HEY BUDDY WE BELIEVE IN YOU"
        errorText.setTextColor(Color.parseColor("#9bcf93"))
        errorText.textSize = 42f
        errorText.typeface = Typeface.DEFAULT_BOLD
        errorText.gravity = Gravity.CENTER
        errorText.setPadding(20, 50, 20, 50)
        layout.addView(errorText)

        val closeButton = TextView(this)
        closeButton.text = "Dismiss"
        closeButton.setTextColor(Color.WHITE)
        closeButton.textSize = 18f
        closeButton.typeface = Typeface.DEFAULT_BOLD
        closeButton.setBackgroundColor(Color.DKGRAY)
        closeButton.setPadding(30, 20, 30, 20)
        closeButton.gravity = Gravity.CENTER
        closeButton.setOnClickListener {
            val homeIntent = Intent(Intent.ACTION_MAIN)
            homeIntent.addCategory(Intent.CATEGORY_HOME)
            homeIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(homeIntent) // Takes the user to the home screen
        }

        layout.addView(closeButton)
            setContentView(layout)
        }
    }