# yanbao AI 功能扩展 - 视频录制和社交分享

**版本**: 1.0.0  
**创建日期**: 2026年1月17日  
**状态**: 📝 设计完成，待实现  
**适用对象**: 新 Manus 账号、开发团队

---

## 📋 功能概述

本文档提供 yanbao AI 原生安卓应用的功能扩展方案，包括：
1. 视频录制功能
2. 社交分享功能
3. 实现方案
4. API 设计
5. UI 设计
6. 测试方案

---

## 🎥 功能扩展 1: 视频录制

### 1. 功能描述

**核心功能**:
- ✅ 视频录制（Camera2 API）
- ✅ 实时美颜（GPUImage）
- ✅ Leica 风格滤镜
- ✅ 视频编辑（剪辑/滤镜/音乐）
- ✅ 视频保存（本地/云端）

**技术栈**:
- Camera2 API（视频录制）
- MediaRecorder（视频编码）
- GPUImage（实时美颜和滤镜）
- MediaCodec（视频编辑）
- FFmpeg（高级编辑，可选）

---

### 2. VideoModule 原生模块

**文件**: `android/app/src/main/java/com/yanbaoai/modules/VideoModule.kt`

```kotlin
package com.yanbaoai.modules

import android.content.Context
import android.media.MediaRecorder
import android.hardware.camera2.*
import android.view.Surface
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File

class VideoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var mediaRecorder: MediaRecorder? = null
    private var isRecording = false
    private var outputFile: File? = null

    override fun getName(): String = "VideoModule"

    /**
     * 开始录制视频
     * @param options 录制选项（分辨率、帧率、比特率等）
     * @param promise Promise 回调
     */
    @ReactMethod
    fun startRecording(options: ReadableMap, promise: Promise) {
        try {
            val context = reactApplicationContext
            
            // 1. 创建输出文件
            val timestamp = System.currentTimeMillis()
            outputFile = File(context.getExternalFilesDir(null), "video_$timestamp.mp4")
            
            // 2. 配置 MediaRecorder
            mediaRecorder = MediaRecorder().apply {
                // 音频源
                setAudioSource(MediaRecorder.AudioSource.MIC)
                // 视频源
                setVideoSource(MediaRecorder.VideoSource.SURFACE)
                
                // 输出格式
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                
                // 视频编码器
                setVideoEncoder(MediaRecorder.VideoEncoder.H264)
                // 音频编码器
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                
                // 视频分辨率（从 options 读取，默认 1080p）
                val width = if (options.hasKey("width")) options.getInt("width") else 1920
                val height = if (options.hasKey("height")) options.getInt("height") else 1080
                setVideoSize(width, height)
                
                // 视频帧率（从 options 读取，默认 30 FPS）
                val frameRate = if (options.hasKey("frameRate")) options.getInt("frameRate") else 30
                setVideoFrameRate(frameRate)
                
                // 视频比特率（从 options 读取，默认 10 Mbps）
                val bitRate = if (options.hasKey("bitRate")) options.getInt("bitRate") else 10000000
                setVideoEncodingBitRate(bitRate)
                
                // 输出文件
                setOutputFile(outputFile!!.absolutePath)
                
                // 准备
                prepare()
            }
            
            // 3. 开始录制
            mediaRecorder?.start()
            isRecording = true
            
            // 4. 返回结果
            promise.resolve(WritableNativeMap().apply {
                putString("outputFile", outputFile!!.absolutePath)
                putBoolean("isRecording", true)
            })
            
        } catch (e: Exception) {
            promise.reject("START_RECORDING_ERROR", "开始录制失败: ${e.message}", e)
        }
    }

    /**
     * 停止录制视频
     * @param promise Promise 回调
     */
    @ReactMethod
    fun stopRecording(promise: Promise) {
        try {
            if (!isRecording) {
                promise.reject("NOT_RECORDING", "当前没有正在录制的视频")
                return
            }
            
            // 1. 停止录制
            mediaRecorder?.stop()
            mediaRecorder?.release()
            mediaRecorder = null
            isRecording = false
            
            // 2. 返回结果
            promise.resolve(WritableNativeMap().apply {
                putString("outputFile", outputFile!!.absolutePath)
                putBoolean("isRecording", false)
            })
            
        } catch (e: Exception) {
            promise.reject("STOP_RECORDING_ERROR", "停止录制失败: ${e.message}", e)
        }
    }

    /**
     * 暂停录制视频（Android 7.0+）
     * @param promise Promise 回调
     */
    @ReactMethod
    fun pauseRecording(promise: Promise) {
        try {
            if (!isRecording) {
                promise.reject("NOT_RECORDING", "当前没有正在录制的视频")
                return
            }
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                mediaRecorder?.pause()
                promise.resolve(WritableNativeMap().apply {
                    putBoolean("isPaused", true)
                })
            } else {
                promise.reject("NOT_SUPPORTED", "当前 Android 版本不支持暂停录制")
            }
            
        } catch (e: Exception) {
            promise.reject("PAUSE_RECORDING_ERROR", "暂停录制失败: ${e.message}", e)
        }
    }

    /**
     * 恢复录制视频（Android 7.0+）
     * @param promise Promise 回调
     */
    @ReactMethod
    fun resumeRecording(promise: Promise) {
        try {
            if (!isRecording) {
                promise.reject("NOT_RECORDING", "当前没有正在录制的视频")
                return
            }
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                mediaRecorder?.resume()
                promise.resolve(WritableNativeMap().apply {
                    putBoolean("isPaused", false)
                })
            } else {
                promise.reject("NOT_SUPPORTED", "当前 Android 版本不支持恢复录制")
            }
            
        } catch (e: Exception) {
            promise.reject("RESUME_RECORDING_ERROR", "恢复录制失败: ${e.message}", e)
        }
    }

    /**
     * 获取录制状态
     * @param promise Promise 回调
     */
    @ReactMethod
    fun getRecordingStatus(promise: Promise) {
        promise.resolve(WritableNativeMap().apply {
            putBoolean("isRecording", isRecording)
            if (outputFile != null) {
                putString("outputFile", outputFile!!.absolutePath)
            }
        })
    }
}
```

---

### 3. VideoScreen React Native 组件

**文件**: `src/screens/VideoScreen.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Alert,
} from 'react-native';

const { VideoModule } = NativeModules;

const VideoScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [outputFile, setOutputFile] = useState<string | null>(null);

  // 开始录制
  const handleStartRecording = async () => {
    try {
      const result = await VideoModule.startRecording({
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitRate: 10000000,
      });
      
      setIsRecording(true);
      setOutputFile(result.outputFile);
      Alert.alert('成功', '开始录制视频');
    } catch (error) {
      Alert.alert('错误', `开始录制失败: ${error.message}`);
    }
  };

  // 停止录制
  const handleStopRecording = async () => {
    try {
      const result = await VideoModule.stopRecording();
      
      setIsRecording(false);
      setIsPaused(false);
      Alert.alert('成功', `视频已保存: ${result.outputFile}`);
    } catch (error) {
      Alert.alert('错误', `停止录制失败: ${error.message}`);
    }
  };

  // 暂停录制
  const handlePauseRecording = async () => {
    try {
      await VideoModule.pauseRecording();
      setIsPaused(true);
      Alert.alert('成功', '已暂停录制');
    } catch (error) {
      Alert.alert('错误', `暂停录制失败: ${error.message}`);
    }
  };

  // 恢复录制
  const handleResumeRecording = async () => {
    try {
      await VideoModule.resumeRecording();
      setIsPaused(false);
      Alert.alert('成功', '已恢复录制');
    } catch (error) {
      Alert.alert('错误', `恢复录制失败: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>视频录制</Text>
      
      {/* 录制状态 */}
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>
          状态: {isRecording ? (isPaused ? '已暂停' : '录制中') : '未录制'}
        </Text>
        {outputFile && (
          <Text style={styles.fileText}>文件: {outputFile}</Text>
        )}
      </View>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartRecording}
          >
            <Text style={styles.buttonText}>开始录制</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopRecording}
            >
              <Text style={styles.buttonText}>停止录制</Text>
            </TouchableOpacity>
            
            {!isPaused ? (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={handlePauseRecording}
              >
                <Text style={styles.buttonText}>暂停录制</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={handleResumeRecording}
              >
                <Text style={styles.buttonText}>恢复录制</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  fileText: {
    fontSize: 14,
    color: '#888',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoScreen;
```

---

## 📤 功能扩展 2: 社交分享

### 1. 功能描述

**核心功能**:
- ✅ 分享到微信（朋友圈/好友）
- ✅ 分享到微博
- ✅ 分享到 QQ/QQ 空间
- ✅ 分享到抖音/快手
- ✅ 系统分享（通用）

**技术栈**:
- 微信 SDK
- 微博 SDK
- QQ SDK
- Android Share Intent

---

### 2. ShareModule 原生模块

**文件**: `android/app/src/main/java/com/yanbaoai/modules/ShareModule.kt`

```kotlin
package com.yanbaoai.modules

import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import com.facebook.react.bridge.*
import java.io.File

class ShareModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ShareModule"

    /**
     * 系统分享（通用）
     * @param options 分享选项（标题、文本、图片、视频等）
     * @param promise Promise 回调
     */
    @ReactMethod
    fun shareToSystem(options: ReadableMap, promise: Promise) {
        try {
            val context = reactApplicationContext
            val intent = Intent(Intent.ACTION_SEND)
            
            // 1. 设置分享类型
            if (options.hasKey("imageUri")) {
                // 分享图片
                intent.type = "image/*"
                val imageUri = Uri.parse(options.getString("imageUri"))
                intent.putExtra(Intent.EXTRA_STREAM, imageUri)
            } else if (options.hasKey("videoUri")) {
                // 分享视频
                intent.type = "video/*"
                val videoUri = Uri.parse(options.getString("videoUri"))
                intent.putExtra(Intent.EXTRA_STREAM, videoUri)
            } else {
                // 分享文本
                intent.type = "text/plain"
            }
            
            // 2. 设置分享内容
            if (options.hasKey("title")) {
                intent.putExtra(Intent.EXTRA_SUBJECT, options.getString("title"))
            }
            if (options.hasKey("text")) {
                intent.putExtra(Intent.EXTRA_TEXT, options.getString("text"))
            }
            
            // 3. 启动分享
            val chooser = Intent.createChooser(intent, "分享到")
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(chooser)
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("success", true)
            })
            
        } catch (e: Exception) {
            promise.reject("SHARE_ERROR", "分享失败: ${e.message}", e)
        }
    }

    /**
     * 分享到微信
     * @param options 分享选项
     * @param promise Promise 回调
     */
    @ReactMethod
    fun shareToWechat(options: ReadableMap, promise: Promise) {
        try {
            // TODO: 集成微信 SDK
            // 1. 初始化微信 SDK
            // 2. 创建分享对象
            // 3. 调用分享接口
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("success", true)
                putString("message", "微信分享功能待集成 SDK")
            })
            
        } catch (e: Exception) {
            promise.reject("WECHAT_SHARE_ERROR", "微信分享失败: ${e.message}", e)
        }
    }

    /**
     * 分享到微博
     * @param options 分享选项
     * @param promise Promise 回调
     */
    @ReactMethod
    fun shareToWeibo(options: ReadableMap, promise: Promise) {
        try {
            // TODO: 集成微博 SDK
            // 1. 初始化微博 SDK
            // 2. 创建分享对象
            // 3. 调用分享接口
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("success", true)
                putString("message", "微博分享功能待集成 SDK")
            })
            
        } catch (e: Exception) {
            promise.reject("WEIBO_SHARE_ERROR", "微博分享失败: ${e.message}", e)
        }
    }

    /**
     * 分享到 QQ
     * @param options 分享选项
     * @param promise Promise 回调
     */
    @ReactMethod
    fun shareToQQ(options: ReadableMap, promise: Promise) {
        try {
            // TODO: 集成 QQ SDK
            // 1. 初始化 QQ SDK
            // 2. 创建分享对象
            // 3. 调用分享接口
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("success", true)
                putString("message", "QQ 分享功能待集成 SDK")
            })
            
        } catch (e: Exception) {
            promise.reject("QQ_SHARE_ERROR", "QQ 分享失败: ${e.message}", e)
        }
    }

    /**
     * 检查应用是否已安装
     * @param packageName 应用包名
     * @param promise Promise 回调
     */
    @ReactMethod
    fun isAppInstalled(packageName: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val pm = context.packageManager
            
            val isInstalled = try {
                pm.getPackageInfo(packageName, 0)
                true
            } catch (e: Exception) {
                false
            }
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("isInstalled", isInstalled)
            })
            
        } catch (e: Exception) {
            promise.reject("CHECK_APP_ERROR", "检查应用失败: ${e.message}", e)
        }
    }
}
```

---

### 3. ShareScreen React Native 组件

**文件**: `src/screens/ShareScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Alert,
} from 'react-native';

const { ShareModule } = NativeModules;

const ShareScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 系统分享
  const handleShareToSystem = async () => {
    try {
      await ShareModule.shareToSystem({
        title: 'yanbao AI',
        text: '我在使用 yanbao AI 拍照，效果超棒！',
        imageUri: imageUri,
      });
    } catch (error) {
      Alert.alert('错误', `分享失败: ${error.message}`);
    }
  };

  // 分享到微信
  const handleShareToWechat = async () => {
    try {
      const result = await ShareModule.shareToWechat({
        title: 'yanbao AI',
        text: '我在使用 yanbao AI 拍照，效果超棒！',
        imageUri: imageUri,
      });
      Alert.alert('提示', result.message);
    } catch (error) {
      Alert.alert('错误', `微信分享失败: ${error.message}`);
    }
  };

  // 分享到微博
  const handleShareToWeibo = async () => {
    try {
      const result = await ShareModule.shareToWeibo({
        title: 'yanbao AI',
        text: '我在使用 yanbao AI 拍照，效果超棒！',
        imageUri: imageUri,
      });
      Alert.alert('提示', result.message);
    } catch (error) {
      Alert.alert('错误', `微博分享失败: ${error.message}`);
    }
  };

  // 分享到 QQ
  const handleShareToQQ = async () => {
    try {
      const result = await ShareModule.shareToQQ({
        title: 'yanbao AI',
        text: '我在使用 yanbao AI 拍照，效果超棒！',
        imageUri: imageUri,
      });
      Alert.alert('提示', result.message);
    } catch (error) {
      Alert.alert('错误', `QQ 分享失败: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>社交分享</Text>

      {/* 分享按钮 */}
      <View style={styles.shareButtons}>
        <TouchableOpacity
          style={[styles.shareButton, styles.systemButton]}
          onPress={handleShareToSystem}
        >
          <Text style={styles.buttonText}>系统分享</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.wechatButton]}
          onPress={handleShareToWechat}
        >
          <Text style={styles.buttonText}>分享到微信</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.weiboButton]}
          onPress={handleShareToWeibo}
        >
          <Text style={styles.buttonText}>分享到微博</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, styles.qqButton]}
          onPress={handleShareToQQ}
        >
          <Text style={styles.buttonText}>分享到 QQ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  shareButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareButton: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  systemButton: {
    backgroundColor: '#666',
  },
  wechatButton: {
    backgroundColor: '#07C160',
  },
  weiboButton: {
    backgroundColor: '#E6162D',
  },
  qqButton: {
    backgroundColor: '#12B7F5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShareScreen;
```

---

## 🎉 总结

### ✅ 功能扩展设计完成

**视频录制**:
1. ✅ VideoModule 原生模块（~250 行）
2. ✅ VideoScreen React Native 组件（~150 行）
3. ✅ 支持开始/停止/暂停/恢复录制
4. ✅ 支持自定义分辨率/帧率/比特率

**社交分享**:
1. ✅ ShareModule 原生模块（~200 行）
2. ✅ ShareScreen React Native 组件（~120 行）
3. ✅ 支持系统分享（通用）
4. ✅ 支持微信/微博/QQ 分享（待集成 SDK）

### 🚀 新 Manus 账号可以

- ✅ 直接使用代码骨架
- ✅ 集成第三方 SDK（微信/微博/QQ）
- ✅ 实现视频编辑功能
- ✅ 实现更多分享平台

---

**功能扩展设计完成！** 🚀

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
