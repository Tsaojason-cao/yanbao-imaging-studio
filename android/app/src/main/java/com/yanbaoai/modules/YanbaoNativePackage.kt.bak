package com.yanbaoai.modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * YanbaoNativePackage - 原生模块包
 * 注册所有自定义原生模块
 * 
 * 已注册模块:
 * - MasterModule (Day 2)
 * - CameraModule (Day 4-5)
 * - BeautyModule (Day 4-5)
 * - MemoryModule (Day 3)
 * - ImageModule (Day 4-5)
 */
class YanbaoNativePackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = mutableListOf<NativeModule>()
        
        // Day 2: 大师模块
        modules.add(MasterModule(reactContext))
        
        // Day 3: 记忆模块
        modules.add(MemoryModule(reactContext))
        
        // Day 4-5: 相机模块（待实现）
        // modules.add(CameraModule(reactContext))
        
        // Day 4-5: 美颜模块（待实现）
        // modules.add(BeautyModule(reactContext))
        
        // Day 4-5: 图片模块（待实现）
        // modules.add(ImageModule(reactContext))
        
        println("✅ YanbaoNativePackage: 已注册 ${modules.size} 个原生模块")
        
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
