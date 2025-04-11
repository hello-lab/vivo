package com.anonymous.vivo

import android.content.Intent
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppBlockServiceStarter(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppBlockServiceStarter"
    }

    @ReactMethod
    fun startService() {
        val intent = Intent(reactApplicationContext, AppBlockService::class.java)
        reactApplicationContext.startService(intent)
    }
}
