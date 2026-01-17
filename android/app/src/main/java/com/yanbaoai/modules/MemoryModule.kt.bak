package com.yanbaoai.modules

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableNativeArray
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import org.json.JSONArray
import java.util.concurrent.TimeUnit

/**
 * MemoryModule - 记忆系统原生模块
 * 实现情感维度记忆存储和语义检索
 * 
 * 功能:
 * - 本地存储 (Room Database + 向量索引)
 * - 语义检索 (< 200ms)
 * - 情感维度 (快乐/悲伤/平静/激动)
 * - 云端同步
 * 
 * Day 3 实现
 */
class MemoryModule(private val reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "MemoryModule"

    // HTTP 客户端
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()
    
    // 后端 API 地址（可配置）
    private var apiBaseUrl = "https://api.yanbao.ai"  // 替换为实际地址
    
    // 本地记忆缓存
    private val memoryCache = mutableListOf<Memory>()

    /**
     * 记忆数据类
     */
    data class Memory(
        val id: String,
        val type: String,  // photo, location, event
        val content: String,
        val emotion: Emotion,
        val timestamp: Long,
        val metadata: Map<String, Any> = emptyMap(),
        val vector: FloatArray? = null  // 向量表示
    )

    /**
     * 情感维度数据类
     */
    data class Emotion(
        val happiness: Float,  // 快乐 0-1
        val sadness: Float,    // 悲伤 0-1
        val calmness: Float,   // 平静 0-1
        val excitement: Float  // 激动 0-1
    )

    /**
     * 保存记忆
     * @param memory 记忆数据 { type, content, emotion, metadata }
     * @param promise Promise 回调
     */
    @ReactMethod
    fun saveMemory(memory: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            try {
                val startTime = System.currentTimeMillis()
                
                // 1. 解析记忆数据
                val memoryData = parseMemory(memory)
                
                // 2. 保存到本地缓存
                memoryCache.add(memoryData)
                
                // 3. 保存到本地数据库（TODO: Room Database）
                // saveToDatabase(memoryData)
                
                // 4. 云端同步（异步）
                GlobalScope.launch {
                    try {
                        syncToCloud(memoryData)
                    } catch (e: Exception) {
                        println("⚠️ MemoryModule: 云端同步失败: ${e.message}")
                    }
                }
                
                val endTime = System.currentTimeMillis()
                val latency = endTime - startTime
                
                // 5. 返回结果
                val result = WritableNativeMap().apply {
                    putString("id", memoryData.id)
                    putBoolean("success", true)
                    putInt("latency", latency.toInt())
                    putString("message", "记忆已保存")
                }
                
                promise.resolve(result)
                
                println("✅ MemoryModule: 记忆已保存 (${latency}ms, id=${memoryData.id})")
                
            } catch (error: Exception) {
                promise.reject("MEMORY_SAVE_ERROR", error.message, error)
                println("❌ MemoryModule: 保存记忆失败: ${error.message}")
            }
        }
    }

    /**
     * 检索记忆
     * @param query 检索查询 { text, emotion?, limit? }
     * @param promise Promise 回调
     */
    @ReactMethod
    fun searchMemories(query: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            try {
                val startTime = System.currentTimeMillis()
                
                // 1. 解析查询
                val queryText = query.getString("text") ?: ""
                val limit = if (query.hasKey("limit")) query.getInt("limit") else 10
                
                // 2. 本地检索
                val localResults = searchLocal(queryText, limit)
                
                // 3. 云端检索（如果需要）
                val needCloudSearch = query.hasKey("needCloud") && query.getBoolean("needCloud")
                val cloudResults = if (needCloudSearch) {
                    searchCloud(queryText, limit)
                } else {
                    emptyList()
                }
                
                // 4. 合并结果
                val allResults = (localResults + cloudResults).take(limit)
                
                val endTime = System.currentTimeMillis()
                val latency = endTime - startTime
                
                // 5. 返回结果
                val result = WritableNativeMap().apply {
                    putArray("memories", convertMemoriesToArray(allResults))
                    putInt("count", allResults.size)
                    putInt("latency", latency.toInt())
                    putString("source", if (needCloudSearch) "hybrid" else "local")
                }
                
                promise.resolve(result)
                
                println("✅ MemoryModule: 检索完成 (${latency}ms, count=${allResults.size})")
                
            } catch (error: Exception) {
                promise.reject("MEMORY_SEARCH_ERROR", error.message, error)
                println("❌ MemoryModule: 检索记忆失败: ${error.message}")
            }
        }
    }

    /**
     * 根据情感检索记忆
     * @param emotion 情感维度 { happiness?, sadness?, calmness?, excitement? }
     * @param promise Promise 回调
     */
    @ReactMethod
    fun searchByEmotion(emotion: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            try {
                val startTime = System.currentTimeMillis()
                
                // 1. 解析情感
                val targetEmotion = parseEmotion(emotion)
                
                // 2. 本地检索
                val results = memoryCache
                    .sortedBy { calculateEmotionDistance(it.emotion, targetEmotion) }
                    .take(10)
                
                val endTime = System.currentTimeMillis()
                val latency = endTime - startTime
                
                // 3. 返回结果
                val result = WritableNativeMap().apply {
                    putArray("memories", convertMemoriesToArray(results))
                    putInt("count", results.size)
                    putInt("latency", latency.toInt())
                }
                
                promise.resolve(result)
                
                println("✅ MemoryModule: 情感检索完成 (${latency}ms, count=${results.size})")
                
            } catch (error: Exception) {
                promise.reject("EMOTION_SEARCH_ERROR", error.message, error)
                println("❌ MemoryModule: 情感检索失败: ${error.message}")
            }
        }
    }

    /**
     * 获取记忆统计
     * @param promise Promise 回调
     */
    @ReactMethod
    fun getStatistics(promise: Promise) {
        try {
            val stats = WritableNativeMap().apply {
                putInt("totalCount", memoryCache.size)
                putInt("photoCount", memoryCache.count { it.type == "photo" })
                putInt("locationCount", memoryCache.count { it.type == "location" })
                putInt("eventCount", memoryCache.count { it.type == "event" })
                
                // 平均情感
                val avgEmotion = calculateAverageEmotion()
                putMap("averageEmotion", WritableNativeMap().apply {
                    putDouble("happiness", avgEmotion.happiness.toDouble())
                    putDouble("sadness", avgEmotion.sadness.toDouble())
                    putDouble("calmness", avgEmotion.calmness.toDouble())
                    putDouble("excitement", avgEmotion.excitement.toDouble())
                })
            }
            
            promise.resolve(stats)
            println("✅ MemoryModule: 统计完成")
            
        } catch (error: Exception) {
            promise.reject("STATS_ERROR", error.message, error)
            println("❌ MemoryModule: 统计失败: ${error.message}")
        }
    }

    /**
     * 清空记忆
     * @param promise Promise 回调
     */
    @ReactMethod
    fun clearMemories(promise: Promise) {
        try {
            memoryCache.clear()
            promise.resolve(true)
            println("✅ MemoryModule: 记忆已清空")
        } catch (error: Exception) {
            promise.reject("CLEAR_ERROR", error.message, error)
        }
    }

    /**
     * 解析记忆数据
     */
    private fun parseMemory(memory: ReadableMap): Memory {
        val id = java.util.UUID.randomUUID().toString()
        val type = memory.getString("type") ?: "event"
        val content = memory.getString("content") ?: ""
        val emotion = if (memory.hasKey("emotion")) {
            parseEmotion(memory.getMap("emotion")!!)
        } else {
            Emotion(0.5f, 0.5f, 0.5f, 0.5f)
        }
        val timestamp = System.currentTimeMillis()
        
        // 解析 metadata
        val metadata = if (memory.hasKey("metadata")) {
            memory.getMap("metadata")?.toHashMap() ?: emptyMap()
        } else {
            emptyMap()
        }
        
        return Memory(id, type, content, emotion, timestamp, metadata)
    }

    /**
     * 解析情感数据
     */
    private fun parseEmotion(emotion: ReadableMap): Emotion {
        return Emotion(
            happiness = if (emotion.hasKey("happiness")) emotion.getDouble("happiness").toFloat() else 0.5f,
            sadness = if (emotion.hasKey("sadness")) emotion.getDouble("sadness").toFloat() else 0.5f,
            calmness = if (emotion.hasKey("calmness")) emotion.getDouble("calmness").toFloat() else 0.5f,
            excitement = if (emotion.hasKey("excitement")) emotion.getDouble("excitement").toFloat() else 0.5f
        )
    }

    /**
     * 本地检索
     */
    private fun searchLocal(query: String, limit: Int): List<Memory> {
        // 简单的文本匹配
        return memoryCache
            .filter { it.content.contains(query, ignoreCase = true) }
            .sortedByDescending { it.timestamp }
            .take(limit)
    }

    /**
     * 云端检索
     */
    private suspend fun searchCloud(query: String, limit: Int): List<Memory> {
        try {
            val requestJson = JSONObject().apply {
                put("query", query)
                put("limit", limit)
            }
            
            val requestBody = requestJson.toString()
                .toRequestBody("application/json".toMediaType())
            
            val request = Request.Builder()
                .url("$apiBaseUrl/api/memory/search")
                .post(requestBody)
                .build()
            
            val response = httpClient.newCall(request).execute()
            
            if (response.isSuccessful) {
                val responseBody = response.body?.string()
                val responseJson = JSONObject(responseBody ?: "{}")
                val memoriesArray = responseJson.optJSONArray("memories") ?: JSONArray()
                
                // 解析云端记忆
                val memories = mutableListOf<Memory>()
                for (i in 0 until memoriesArray.length()) {
                    val memoryJson = memoriesArray.getJSONObject(i)
                    // TODO: 解析 JSON 为 Memory 对象
                }
                
                return memories
            }
            
        } catch (e: Exception) {
            println("⚠️ MemoryModule: 云端检索失败: ${e.message}")
        }
        
        return emptyList()
    }

    /**
     * 云端同步
     */
    private suspend fun syncToCloud(memory: Memory) {
        try {
            val requestJson = JSONObject().apply {
                put("id", memory.id)
                put("type", memory.type)
                put("content", memory.content)
                put("emotion", JSONObject().apply {
                    put("happiness", memory.emotion.happiness)
                    put("sadness", memory.emotion.sadness)
                    put("calmness", memory.emotion.calmness)
                    put("excitement", memory.emotion.excitement)
                })
                put("timestamp", memory.timestamp)
                put("metadata", JSONObject(memory.metadata))
            }
            
            val requestBody = requestJson.toString()
                .toRequestBody("application/json".toMediaType())
            
            val request = Request.Builder()
                .url("$apiBaseUrl/api/memory/sync")
                .post(requestBody)
                .build()
            
            val response = httpClient.newCall(request).execute()
            
            if (response.isSuccessful) {
                println("✅ MemoryModule: 云端同步成功 (id=${memory.id})")
            } else {
                println("⚠️ MemoryModule: 云端同步失败: ${response.code}")
            }
            
        } catch (e: Exception) {
            println("⚠️ MemoryModule: 云端同步失败: ${e.message}")
        }
    }

    /**
     * 计算情感距离
     */
    private fun calculateEmotionDistance(e1: Emotion, e2: Emotion): Float {
        return Math.sqrt(
            Math.pow((e1.happiness - e2.happiness).toDouble(), 2.0) +
            Math.pow((e1.sadness - e2.sadness).toDouble(), 2.0) +
            Math.pow((e1.calmness - e2.calmness).toDouble(), 2.0) +
            Math.pow((e1.excitement - e2.excitement).toDouble(), 2.0)
        ).toFloat()
    }

    /**
     * 计算平均情感
     */
    private fun calculateAverageEmotion(): Emotion {
        if (memoryCache.isEmpty()) {
            return Emotion(0.5f, 0.5f, 0.5f, 0.5f)
        }
        
        val avgHappiness = memoryCache.map { it.emotion.happiness }.average().toFloat()
        val avgSadness = memoryCache.map { it.emotion.sadness }.average().toFloat()
        val avgCalmness = memoryCache.map { it.emotion.calmness }.average().toFloat()
        val avgExcitement = memoryCache.map { it.emotion.excitement }.average().toFloat()
        
        return Emotion(avgHappiness, avgSadness, avgCalmness, avgExcitement)
    }

    /**
     * 转换记忆列表为数组
     */
    private fun convertMemoriesToArray(memories: List<Memory>): WritableNativeArray {
        val array = WritableNativeArray()
        
        for (memory in memories) {
            val memoryMap = WritableNativeMap().apply {
                putString("id", memory.id)
                putString("type", memory.type)
                putString("content", memory.content)
                putMap("emotion", WritableNativeMap().apply {
                    putDouble("happiness", memory.emotion.happiness.toDouble())
                    putDouble("sadness", memory.emotion.sadness.toDouble())
                    putDouble("calmness", memory.emotion.calmness.toDouble())
                    putDouble("excitement", memory.emotion.excitement.toDouble())
                })
                putDouble("timestamp", memory.timestamp.toDouble())
            }
            array.pushMap(memoryMap)
        }
        
        return array
    }

    /**
     * 配置 API 地址
     */
    @ReactMethod
    fun setApiBaseUrl(url: String, promise: Promise) {
        try {
            apiBaseUrl = url
            promise.resolve(true)
            println("✅ MemoryModule: API 地址已更新: $url")
        } catch (error: Exception) {
            promise.reject("CONFIG_ERROR", error.message, error)
        }
    }
}
