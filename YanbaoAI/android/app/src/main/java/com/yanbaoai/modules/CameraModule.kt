package com.yanbaoai.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

/**
 * CameraModule - 原生相机模块
 * 使用 Camera2 API + NPU 加速
 * 
 * 实现计划: Day 4-5
 * 功能:
 * - 打开相机 (Camera2 API)
 * - 实时美颜 (NPU 加速)
 * - 拍照保存
 * - Leica 风格渲染
 */
class CameraModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "CameraModule"

    /**
     * 打开相机
     * @param options 相机配置 { facing: 'front'|'back', beautyLevel: 0-100, whitenLevel: 0-100 }
     * @param promise Promise 回调
     */
    @ReactMethod
    fun openCamera(options: ReadableMap, promise: Promise) {
        try {
            // TODO: Day 4-5 实现
            // 1. 检查相机权限
            // 2. 使用 Camera2 API 打开相机
            // 3. 配置预览 Surface
            // 4. 启用 NPU 美颜加速
            
            promise.resolve("Camera opened successfully")
        } catch (error: Exception) {
            promise.reject("CAMERA_ERROR", error.message, error)
        }
    }

    /**
     * 拍照
     * @param promise Promise 回调，返回照片路径
     */
    @ReactMethod
    fun capturePhoto(promise: Promise) {
        try {
            // TODO: Day 4-5 实现
            // 1. 捕获图像
            // 2. 应用美颜效果
            // 3. 保存到相册
            // 4. 返回文件路径
            
            promise.resolve("/storage/emulated/0/DCIM/yanbao/photo_001.jpg")
        } catch (error: Exception) {
            promise.reject("CAPTURE_ERROR", error.message, error)
        }
    }

    /**
     * 切换相机
     * @param promise Promise 回调
     */
    @ReactMethod
    fun switchCamera(promise: Promise) {
        try {
            // TODO: Day 4-5 实现
            promise.resolve("Camera switched")
        } catch (error: Exception) {
            promise.reject("SWITCH_ERROR", error.message, error)
        }
    }

    /**
     * 关闭相机
     * @param promise Promise 回调
     */
    @ReactMethod
    fun closeCamera(promise: Promise) {
        try {
            // TODO: Day 4-5 实现
            promise.resolve("Camera closed")
        } catch (error: Exception) {
            promise.reject("CLOSE_ERROR", error.message, error)
        }
    }
}
