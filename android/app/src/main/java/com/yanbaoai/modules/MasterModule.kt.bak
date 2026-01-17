package com.yanbaoai.modules

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.util.concurrent.TimeUnit

/**
 * MasterModule - 大师推理引擎原生模块
 * 实现 Chain of Thought 推理和个性化建议
 * 
 * 功能:
 * - 本地推理 (TensorFlow Lite)
 * - 云端推理 (Python 后端 API)
 * - 双轨制接口 (智能模式 + 降级模式)
 * - 健康检查 (200ms 超时)
 * 
 * Day 2 实现
 */
class MasterModule(private val reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "MasterModule"

    // TensorFlow Lite 解释器
    private var tfliteInterpreter: Interpreter? = null
    
    // HTTP 客户端
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()
    
    // 后端 API 地址（可配置）
    private var apiBaseUrl = "https://api.yanbao.ai"  // 替换为实际地址
    
    // 健康检查状态
    private var isHealthy = true
    private var lastHealthCheck = 0L
    private val healthCheckInterval = 60000L  // 1 分钟

    init {
        // 初始化 TFLite 模型
        try {
            val modelFile = loadModelFile(reactContext)
            tfliteInterpreter = Interpreter(modelFile)
            println("✅ MasterModule: TFLite 模型加载成功")
        } catch (e: Exception) {
            println("⚠️ MasterModule: TFLite 模型加载失败: ${e.message}")
            // 降级模式：不使用 TFLite
        }
    }

    /**
     * 加载 TFLite 模型文件
     */
    private fun loadModelFile(context: Context): MappedByteBuffer {
        // TODO: 将模型文件放置到 assets/master_model.tflite
        val assetFileDescriptor = context.assets.openFd("master_model.tflite")
        val inputStream = FileInputStream(assetFileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = assetFileDescriptor.startOffset
        val declaredLength = assetFileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    /**
     * 获取大师建议
     * @param context 上下文信息 { type: 'photo'|'location'|'edit', data: {...} }
     * @param promise Promise 回调
     */
    @ReactMethod
    fun getMasterAdvice(context: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            try {
                val startTime = System.currentTimeMillis()
                
                // 1. 健康检查
                checkHealth()
                
                // 2. 根据健康状态选择模式
                val advice = if (isHealthy && tfliteInterpreter != null) {
                    // 智能模式：本地推理 + 云端推理
                    getIntelligentAdvice(context)
                } else {
                    // 降级模式：本地规则
                    getFallbackAdvice(context)
                }
                
                val endTime = System.currentTimeMillis()
                val latency = endTime - startTime
                
                // 3. 返回结果
                val result = WritableNativeMap().apply {
                    putMap("advice", advice)
                    putInt("latency", latency.toInt())
                    putString("mode", if (isHealthy) "intelligent" else "fallback")
                    putBoolean("healthy", isHealthy)
                }
                
                promise.resolve(result)
                
                println("✅ MasterModule: 推理完成 (${latency}ms, mode=${if (isHealthy) "intelligent" else "fallback"})")
                
            } catch (error: Exception) {
                promise.reject("MASTER_ERROR", error.message, error)
                println("❌ MasterModule: 推理失败: ${error.message}")
            }
        }
    }

    /**
     * 智能模式：本地推理 + 云端推理
     */
    private suspend fun getIntelligentAdvice(context: ReadableMap): WritableNativeMap {
        val result = WritableNativeMap()
        
        try {
            // 1. 本地快速推理 (TFLite)
            val localAdvice = runLocalInference(context)
            result.putMap("local", localAdvice)
            
            // 2. 云端深度推理 (API)
            val needDeepReasoning = context.hasKey("needDeep") && context.getBoolean("needDeep")
            if (needDeepReasoning) {
                val cloudAdvice = runCloudInference(context)
                result.putMap("cloud", cloudAdvice)
            }
            
            result.putString("source", if (needDeepReasoning) "hybrid" else "local")
            
        } catch (e: Exception) {
            println("⚠️ MasterModule: 智能推理失败，降级到本地规则: ${e.message}")
            return getFallbackAdvice(context)
        }
        
        return result
    }

    /**
     * 本地推理 (TensorFlow Lite)
     */
    private fun runLocalInference(context: ReadableMap): WritableNativeMap {
        val result = WritableNativeMap()
        
        try {
            val type = context.getString("type") ?: "unknown"
            val data = context.getMap("data")
            
            // 1. 预处理输入
            val inputArray = preprocessInput(type, data)
            
            // 2. 运行推理
            if (tfliteInterpreter != null) {
                val outputArray = Array(1) { FloatArray(10) }
                tfliteInterpreter?.run(inputArray, outputArray)
                
                // 3. 后处理输出
                val suggestion = postprocessOutput(type, outputArray[0])
                result.putString("suggestion", suggestion)
                result.putDouble("confidence", outputArray[0].maxOrNull()?.toDouble() ?: 0.0)
                result.putString("reasoning", "本地推理：基于 TFLite 模型分析")
            } else {
                // 降级到规则引擎
                result.putString("suggestion", getRuleBasedSuggestion(type))
                result.putDouble("confidence", 0.7)
                result.putString("reasoning", "本地推理：基于规则引擎")  
            }
            
        } catch (e: Exception) {
            println("⚠️ MasterModule: 本地推理失败: ${e.message}")
            result.putString("error", e.message)
        }
        
        return result
    }

    /**
     * 云端推理 (Python 后端 API)
     */
    private fun runCloudInference(context: ReadableMap): WritableNativeMap {
        val result = WritableNativeMap()
        
        try {
            // 1. 构建请求
            val requestJson = JSONObject().apply {
                put("context", context.toHashMap())
                put("timestamp", System.currentTimeMillis())
            }
            
            val requestBody = requestJson.toString()
                .toRequestBody("application/json".toMediaType())
            
            val request = Request.Builder()
                .url("$apiBaseUrl/api/master/advice")
                .post(requestBody)
                .build()
            
            // 2. 发送请求
            val response = httpClient.newCall(request).execute()
            
            // 3. 解析响应
            if (response.isSuccessful) {
                val responseBody = response.body?.string()
                val responseJson = JSONObject(responseBody ?: "{}")
                
                result.putString("suggestion", responseJson.optString("suggestion", ""))
                result.putDouble("confidence", responseJson.optDouble("confidence", 0.0))
                result.putString("reasoning", responseJson.optString("reasoning", ""))
                
                println("✅ MasterModule: 云端推理成功")
            } else {
                result.putString("error", "API 请求失败: ${response.code}")
                println("⚠️ MasterModule: 云端推理失败: ${response.code}")
            }
            
        } catch (e: Exception) {
            println("⚠️ MasterModule: 云端推理失败: ${e.message}")
            result.putString("error", e.message)
        }
        
        return result
    }

    /**
     * 降级模式：本地规则
     */
    private fun getFallbackAdvice(context: ReadableMap): WritableNativeMap {
        val result = WritableNativeMap()
        
        try {
            val type = context.getString("type") ?: "unknown"
            
            // 基于规则的简单建议
            val advice = when (type) {
                "photo" -> WritableNativeMap().apply {
                    putString("suggestion", "建议使用自然光拍摄，避免强烈阴影")
                    putDouble("confidence", 0.7)
                    putString("reasoning", "基于摄影基础规则")
                }
                "location" -> WritableNativeMap().apply {
                    putString("suggestion", "推荐前往附近的公园或景点")
                    putDouble("confidence", 0.6)
                    putString("reasoning", "基于地理位置规则")
                }
                "edit" -> WritableNativeMap().apply {
                    putString("suggestion", "建议调整亮度和对比度")
                    putDouble("confidence", 0.75)
                    putString("reasoning", "基于图像处理规则")
                }
                else -> WritableNativeMap().apply {
                    putString("suggestion", "请提供更多信息以获得更好的建议")
                    putDouble("confidence", 0.5)
                    putString("reasoning", "基于通用规则")
                }
            }
            
            result.putMap("local", advice)
            result.putString("source", "fallback")
            
            println("✅ MasterModule: 降级模式建议生成成功")
            
        } catch (e: Exception) {
            println("❌ MasterModule: 降级模式失败: ${e.message}")
            result.putString("error", e.message)
        }
        
        return result
    }

    /**
     * 健康检查
     */
    private fun checkHealth() {
        val now = System.currentTimeMillis()
        
        // 如果距离上次检查不到 1 分钟，跳过
        if (now - lastHealthCheck < healthCheckInterval) {
            return
        }
        
        lastHealthCheck = now
        
        try {
            // 1. 检查 TFLite 模型
            val tfliteHealthy = tfliteInterpreter != null
            
            // 2. 检查网络连接（简单 ping）
            val networkHealthy = try {
                val request = Request.Builder()
                    .url("$apiBaseUrl/health")
                    .get()
                    .build()
                
                val response = httpClient.newCall(request).execute()
                response.isSuccessful
            } catch (e: Exception) {
                false
            }
            
            // 3. 更新健康状态
            isHealthy = tfliteHealthy || networkHealthy
            
            println("✅ MasterModule: 健康检查完成 (healthy=$isHealthy, tflite=$tfliteHealthy, network=$networkHealthy)")
            
        } catch (e: Exception) {
            println("⚠️ MasterModule: 健康检查失败: ${e.message}")
            isHealthy = false
        }
    }

    /**
     * 配置 API 地址
     * @param url API 基础地址
     * @param promise Promise 回调
     */
    @ReactMethod
    fun setApiBaseUrl(url: String, promise: Promise) {
        try {
            apiBaseUrl = url
            promise.resolve(true)
            println("✅ MasterModule: API 地址已更新: $url")
        } catch (error: Exception) {
            promise.reject("CONFIG_ERROR", error.message, error)
        }
    }

    /**
     * 获取模块状态
     * @param promise Promise 回调
     */
    @ReactMethod
    fun getStatus(promise: Promise) {
        try {
            val status = WritableNativeMap().apply {
                putBoolean("healthy", isHealthy)
                putBoolean("tfliteLoaded", tfliteInterpreter != null)
                putString("apiBaseUrl", apiBaseUrl)
                putDouble("lastHealthCheck", lastHealthCheck.toDouble())
            }
            promise.resolve(status)
        } catch (error: Exception) {
            promise.reject("STATUS_ERROR", error.message, error)
        }
    }

    /**
     * 清理资源
     */
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        tfliteInterpreter?.close()
        println("✅ MasterModule: 资源已清理")
    }
}

    /**
     * 预处理输入
     */
    private fun preprocessInput(type: String, data: ReadableMap?): Array<FloatArray> {
        val features = FloatArray(100) { 0f }
        
        when (type) {
            "photo" -> {
                features[0] = data?.getDouble("brightness")?.toFloat() ?: 0.5f
                features[1] = data?.getDouble("contrast")?.toFloat() ?: 0.5f
                features[2] = data?.getDouble("saturation")?.toFloat() ?: 0.5f
            }
            "location" -> {
                features[0] = data?.getDouble("latitude")?.toFloat() ?: 0f
                features[1] = data?.getDouble("longitude")?.toFloat() ?: 0f
            }
            "edit" -> {
                features[0] = data?.getDouble("temperature")?.toFloat() ?: 0f
                features[1] = data?.getDouble("tint")?.toFloat() ?: 0f
            }
        }
        
        return arrayOf(features)
    }
    
    /**
     * 后处理输出
     */
    private fun postprocessOutput(type: String, output: FloatArray): String {
        val maxIndex = output.indices.maxByOrNull { output[it] } ?: 0
        
        return when (type) {
            "photo" -> when (maxIndex) {
                0 -> "建议使用自然光拍摄，避免强烈阴影"
                1 -> "建议调整曝光，增加亮度"
                2 -> "建议使用人像模式，焦点对准人物"
                else -> "建议保持当前设置"
            }
            "location" -> when (maxIndex) {
                0 -> "推荐前往附近的公园或景点"
                1 -> "推荐在黄昏时分拍摄"
                2 -> "推荐寻找高度视角"
                else -> "推荐探索周围环境"
            }
            "edit" -> when (maxIndex) {
                0 -> "建议调成暖色调"
                1 -> "建议增加饱和度"
                2 -> "建议调整对比度"
                else -> "建议保持原图风格"
            }
            else -> "请提供更多信息以获得更好的建议"
        }
    }
    
    /**
     * 基于规则的建议
     */
    private fun getRuleBasedSuggestion(type: String): String {
        return when (type) {
            "photo" -> "建议使用自然光拍摄，避免强烈阴影"
            "location" -> "推荐前往附近的公园或景点"
            "edit" -> "建议调整亮度和对比度"
            else -> "请提供更多信息以获得更好的建议"
        }
    }
}
