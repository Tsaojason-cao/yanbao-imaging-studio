package com.yanbaoai

import android.app.Application
import com.facebook.soloader.SoLoader

/**
 * yanbao AI - 主应用类
 * 纯 Android 实现
 */
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
    }
}
