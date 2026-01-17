package com.yanbaoai

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

/**
 * yanbao AI - 主 Activity
 * React Native + 原生模块混合架构
 */
class MainActivity : ReactActivity() {

    /**
     * 返回应用的主组件名称
     */
    override fun getMainComponentName(): String = "YanbaoAI"

    /**
     * 创建 React Activity Delegate
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
