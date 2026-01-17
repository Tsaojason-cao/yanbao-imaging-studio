# yanbao AI 功能扩展 - 云端存储和多语言支持

**版本**: 1.0.0  
**创建日期**: 2026年1月17日  
**状态**: 📝 设计完成，待实现  
**适用对象**: 新 Manus 账号、开发团队

---

## 📋 功能概述

本文档提供 yanbao AI 原生安卓应用的功能扩展方案，包括：
1. 云端存储功能
2. 多语言支持
3. 实现方案
4. API 设计
5. UI 设计
6. 测试方案

---

## ☁️ 功能扩展 1: 云端存储

### 1. 功能描述

**核心功能**:
- ✅ 照片/视频云端备份
- ✅ 云端同步（多设备）
- ✅ 云端相册管理
- ✅ 云端分享链接
- ✅ 存储空间管理

**技术栈**:
- AWS S3 / 阿里云 OSS / 腾讯云 COS
- OkHttp（网络请求）
- WorkManager（后台上传）
- Room Database（本地缓存）

---

### 2. CloudStorageModule 原生模块

**文件**: `android/app/src/main/java/com/yanbaoai/modules/CloudStorageModule.kt`

```kotlin
package com.yanbaoai.modules

import android.content.Context
import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.IOException

class CloudStorageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val client = OkHttpClient()

    override fun getName(): String = "CloudStorageModule"

    /**
     * 上传文件到云端
     * @param filePath 文件路径
     * @param options 上传选项（文件名、目录等）
     * @param promise Promise 回调
     */
    @ReactMethod
    fun uploadFile(filePath: String, options: ReadableMap, promise: Promise) {
        scope.launch {
            try {
                val file = File(filePath)
                if (!file.exists()) {
                    promise.reject("FILE_NOT_FOUND", "文件不存在: $filePath")
                    return@launch
                }

                // 1. 获取上传 URL（从后端 API）
                val uploadUrl = getUploadUrl(file.name)

                // 2. 上传文件
                val requestBody = file.asRequestBody("application/octet-stream".toMediaType())
                val request = Request.Builder()
                    .url(uploadUrl)
                    .put(requestBody)
                    .build()

                val response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    // 3. 返回结果
                    withContext(Dispatchers.Main) {
                        promise.resolve(WritableNativeMap().apply {
                            putBoolean("success", true)
                            putString("url", uploadUrl)
                            putString("fileName", file.name)
                            putDouble("fileSize", file.length().toDouble())
                        })
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        promise.reject("UPLOAD_ERROR", "上传失败: ${response.code}")
                    }
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("UPLOAD_ERROR", "上传失败: ${e.message}", e)
                }
            }
        }
    }

    /**
     * 下载文件从云端
     * @param url 文件 URL
     * @param savePath 保存路径
     * @param promise Promise 回调
     */
    @ReactMethod
    fun downloadFile(url: String, savePath: String, promise: Promise) {
        scope.launch {
            try {
                // 1. 下载文件
                val request = Request.Builder()
                    .url(url)
                    .build()

                val response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    // 2. 保存文件
                    val file = File(savePath)
                    file.parentFile?.mkdirs()
                    file.outputStream().use { output ->
                        response.body?.byteStream()?.use { input ->
                            input.copyTo(output)
                        }
                    }

                    // 3. 返回结果
                    withContext(Dispatchers.Main) {
                        promise.resolve(WritableNativeMap().apply {
                            putBoolean("success", true)
                            putString("filePath", file.absolutePath)
                            putDouble("fileSize", file.length().toDouble())
                        })
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        promise.reject("DOWNLOAD_ERROR", "下载失败: ${response.code}")
                    }
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("DOWNLOAD_ERROR", "下载失败: ${e.message}", e)
                }
            }
        }
    }

    /**
     * 删除云端文件
     * @param url 文件 URL
     * @param promise Promise 回调
     */
    @ReactMethod
    fun deleteFile(url: String, promise: Promise) {
        scope.launch {
            try {
                // 1. 删除文件
                val request = Request.Builder()
                    .url(url)
                    .delete()
                    .build()

                val response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    withContext(Dispatchers.Main) {
                        promise.resolve(WritableNativeMap().apply {
                            putBoolean("success", true)
                        })
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        promise.reject("DELETE_ERROR", "删除失败: ${response.code}")
                    }
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("DELETE_ERROR", "删除失败: ${e.message}", e)
                }
            }
        }
    }

    /**
     * 获取云端文件列表
     * @param promise Promise 回调
     */
    @ReactMethod
    fun listFiles(promise: Promise) {
        scope.launch {
            try {
                // TODO: 调用后端 API 获取文件列表
                // 这里返回模拟数据
                withContext(Dispatchers.Main) {
                    promise.resolve(WritableNativeArray().apply {
                        pushMap(WritableNativeMap().apply {
                            putString("fileName", "photo_1.jpg")
                            putString("url", "https://example.com/photo_1.jpg")
                            putDouble("fileSize", 1024000.0)
                            putString("uploadTime", "2026-01-17 10:00:00")
                        })
                        pushMap(WritableNativeMap().apply {
                            putString("fileName", "video_1.mp4")
                            putString("url", "https://example.com/video_1.mp4")
                            putDouble("fileSize", 10240000.0)
                            putString("uploadTime", "2026-01-17 11:00:00")
                        })
                    })
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("LIST_ERROR", "获取列表失败: ${e.message}", e)
                }
            }
        }
    }

    /**
     * 获取存储空间使用情况
     * @param promise Promise 回调
     */
    @ReactMethod
    fun getStorageUsage(promise: Promise) {
        scope.launch {
            try {
                // TODO: 调用后端 API 获取存储使用情况
                // 这里返回模拟数据
                withContext(Dispatchers.Main) {
                    promise.resolve(WritableNativeMap().apply {
                        putDouble("used", 1024000000.0) // 1 GB
                        putDouble("total", 10240000000.0) // 10 GB
                        putDouble("percentage", 10.0)
                    })
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("STORAGE_ERROR", "获取存储使用情况失败: ${e.message}", e)
                }
            }
        }
    }

    /**
     * 获取上传 URL（从后端 API）
     */
    private suspend fun getUploadUrl(fileName: String): String {
        // TODO: 调用后端 API 获取上传 URL
        // 这里返回模拟 URL
        return "https://example.com/upload/$fileName"
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        scope.cancel()
    }
}
```

---

### 3. CloudStorageScreen React Native 组件

**文件**: `src/screens/CloudStorageScreen.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  NativeModules,
  Alert,
} from 'react-native';

const { CloudStorageModule } = NativeModules;

interface CloudFile {
  fileName: string;
  url: string;
  fileSize: number;
  uploadTime: string;
}

const CloudStorageScreen: React.FC = () => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [storageUsage, setStorageUsage] = useState({
    used: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    loadFiles();
    loadStorageUsage();
  }, []);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      const result = await CloudStorageModule.listFiles();
      setFiles(result);
    } catch (error) {
      Alert.alert('错误', `加载文件列表失败: ${error.message}`);
    }
  };

  // 加载存储使用情况
  const loadStorageUsage = async () => {
    try {
      const result = await CloudStorageModule.getStorageUsage();
      setStorageUsage(result);
    } catch (error) {
      Alert.alert('错误', `加载存储使用情况失败: ${error.message}`);
    }
  };

  // 上传文件
  const handleUploadFile = async (filePath: string) => {
    try {
      await CloudStorageModule.uploadFile(filePath, {});
      Alert.alert('成功', '文件上传成功');
      loadFiles();
      loadStorageUsage();
    } catch (error) {
      Alert.alert('错误', `上传失败: ${error.message}`);
    }
  };

  // 下载文件
  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      const savePath = `/sdcard/Download/${fileName}`;
      await CloudStorageModule.downloadFile(url, savePath);
      Alert.alert('成功', `文件已下载到: ${savePath}`);
    } catch (error) {
      Alert.alert('错误', `下载失败: ${error.message}`);
    }
  };

  // 删除文件
  const handleDeleteFile = async (url: string) => {
    try {
      await CloudStorageModule.deleteFile(url);
      Alert.alert('成功', '文件已删除');
      loadFiles();
      loadStorageUsage();
    } catch (error) {
      Alert.alert('错误', `删除失败: ${error.message}`);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>云端存储</Text>

      {/* 存储使用情况 */}
      <View style={styles.storageCard}>
        <Text style={styles.storageTitle}>存储空间</Text>
        <Text style={styles.storageText}>
          已使用: {formatFileSize(storageUsage.used)} / {formatFileSize(storageUsage.total)}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${storageUsage.percentage}%` }]} />
        </View>
        <Text style={styles.percentageText}>{storageUsage.percentage.toFixed(1)}%</Text>
      </View>

      {/* 文件列表 */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item.fileName}</Text>
              <Text style={styles.fileSize}>{formatFileSize(item.fileSize)}</Text>
              <Text style={styles.uploadTime}>{item.uploadTime}</Text>
            </View>
            <View style={styles.fileActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={() => handleDownloadFile(item.url, item.fileName)}
              >
                <Text style={styles.actionText}>下载</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteFile(item.url)}
              >
                <Text style={styles.actionText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  storageCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  storageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  storageText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  percentageText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'right',
  },
  fileItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  uploadTime: {
    fontSize: 12,
    color: '#666',
  },
  fileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CloudStorageScreen;
```

---

## 🌍 功能扩展 2: 多语言支持

### 1. 功能描述

**核心功能**:
- ✅ 简体中文（默认）
- ✅ 繁体中文
- ✅ 英语
- ✅ 日语
- ✅ 韩语
- ✅ 自动检测系统语言
- ✅ 手动切换语言

**技术栈**:
- Android strings.xml（多语言资源）
- React Native i18n
- AsyncStorage（语言偏好设置）

---

### 2. Android 多语言资源

**文件结构**:
```
android/app/src/main/res/
├── values/strings.xml              # 默认（简体中文）
├── values-zh-rTW/strings.xml       # 繁体中文
├── values-en/strings.xml           # 英语
├── values-ja/strings.xml           # 日语
└── values-ko/strings.xml           # 韩语
```

**示例**: `values/strings.xml`（简体中文）
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- 应用名称 -->
    <string name="app_name">雁宝 AI</string>
    
    <!-- 标签页 -->
    <string name="tab_home">首页</string>
    <string name="tab_camera">相机</string>
    <string name="tab_editor">编辑</string>
    <string name="tab_gallery">相册</string>
    <string name="tab_map">地图</string>
    <string name="tab_master">大师</string>
    <string name="tab_memory">记忆</string>
    <string name="tab_video">视频</string>
    <string name="tab_share">分享</string>
    <string name="tab_cloud">云端</string>
    
    <!-- 相机 -->
    <string name="camera_switch">切换</string>
    <string name="camera_capture">拍照</string>
    <string name="camera_flash">闪光灯</string>
    
    <!-- 美颜 -->
    <string name="beauty_level">美颜强度</string>
    <string name="beauty_filter">滤镜</string>
    
    <!-- 大师 -->
    <string name="master_advice">获取建议</string>
    <string name="master_health">健康检查</string>
    
    <!-- 记忆 */
    <string name="memory_save">保存记忆</string>
    <string name="memory_search">搜索</string>
    
    <!-- 通用 -->
    <string name="ok">确定</string>
    <string name="cancel">取消</string>
    <string name="save">保存</string>
    <string name="delete">删除</string>
    <string name="share">分享</string>
    <string name="download">下载</string>
    <string name="upload">上传</string>
</resources>
```

**示例**: `values-en/strings.xml`（英语）
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- App Name -->
    <string name="app_name">yanbao AI</string>
    
    <!-- Tabs -->
    <string name="tab_home">Home</string>
    <string name="tab_camera">Camera</string>
    <string name="tab_editor">Editor</string>
    <string name="tab_gallery">Gallery</string>
    <string name="tab_map">Map</string>
    <string name="tab_master">Master</string>
    <string name="tab_memory">Memory</string>
    <string name="tab_video">Video</string>
    <string name="tab_share">Share</string>
    <string name="tab_cloud">Cloud</string>
    
    <!-- Camera -->
    <string name="camera_switch">Switch</string>
    <string name="camera_capture">Capture</string>
    <string name="camera_flash">Flash</string>
    
    <!-- Beauty -->
    <string name="beauty_level">Beauty Level</string>
    <string name="beauty_filter">Filter</string>
    
    <!-- Master -->
    <string name="master_advice">Get Advice</string>
    <string name="master_health">Health Check</string>
    
    <!-- Memory -->
    <string name="memory_save">Save Memory</string>
    <string name="memory_search">Search</string>
    
    <!-- Common -->
    <string name="ok">OK</string>
    <string name="cancel">Cancel</string>
    <string name="save">Save</string>
    <string name="delete">Delete</string>
    <string name="share">Share</string>
    <string name="download">Download</string>
    <string name="upload">Upload</string>
</resources>
```

---

### 3. React Native i18n 配置

**安装依赖**:
```bash
npm install i18n-js
```

**文件**: `src/i18n/index.ts`
```typescript
import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';

// 导入翻译文件
import zh from './locales/zh.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

const i18n = new I18n({
  zh,
  en,
  ja,
  ko,
});

// 设置默认语言
i18n.defaultLocale = 'zh';

// 启用回退
i18n.enableFallback = true;

// 自动检测系统语言
const locales = Localization.getLocales();
if (locales.length > 0) {
  i18n.locale = locales[0].languageCode;
}

export default i18n;
```

**文件**: `src/i18n/locales/zh.json`（简体中文）
```json
{
  "app_name": "雁宝 AI",
  "tab_home": "首页",
  "tab_camera": "相机",
  "tab_editor": "编辑",
  "tab_gallery": "相册",
  "tab_map": "地图",
  "tab_master": "大师",
  "tab_memory": "记忆",
  "tab_video": "视频",
  "tab_share": "分享",
  "tab_cloud": "云端",
  "camera_switch": "切换",
  "camera_capture": "拍照",
  "camera_flash": "闪光灯",
  "beauty_level": "美颜强度",
  "beauty_filter": "滤镜",
  "master_advice": "获取建议",
  "master_health": "健康检查",
  "memory_save": "保存记忆",
  "memory_search": "搜索",
  "ok": "确定",
  "cancel": "取消",
  "save": "保存",
  "delete": "删除",
  "share": "分享",
  "download": "下载",
  "upload": "上传"
}
```

**文件**: `src/i18n/locales/en.json`（英语）
```json
{
  "app_name": "yanbao AI",
  "tab_home": "Home",
  "tab_camera": "Camera",
  "tab_editor": "Editor",
  "tab_gallery": "Gallery",
  "tab_map": "Map",
  "tab_master": "Master",
  "tab_memory": "Memory",
  "tab_video": "Video",
  "tab_share": "Share",
  "tab_cloud": "Cloud",
  "camera_switch": "Switch",
  "camera_capture": "Capture",
  "camera_flash": "Flash",
  "beauty_level": "Beauty Level",
  "beauty_filter": "Filter",
  "master_advice": "Get Advice",
  "master_health": "Health Check",
  "memory_save": "Save Memory",
  "memory_search": "Search",
  "ok": "OK",
  "cancel": "Cancel",
  "save": "Save",
  "delete": "Delete",
  "share": "Share",
  "download": "Download",
  "upload": "Upload"
}
```

---

### 4. 使用示例

**在组件中使用**:
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import i18n from '../i18n';

const ExampleScreen: React.FC = () => {
  return (
    <View>
      <Text>{i18n.t('app_name')}</Text>
      <Text>{i18n.t('tab_home')}</Text>
      <Text>{i18n.t('camera_capture')}</Text>
    </View>
  );
};

export default ExampleScreen;
```

**切换语言**:
```typescript
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 切换语言
const changeLanguage = async (locale: string) => {
  i18n.locale = locale;
  await AsyncStorage.setItem('language', locale);
  // 重新渲染应用
};

// 示例：切换到英语
changeLanguage('en');
```

---

## 🎉 总结

### ✅ 功能扩展设计完成

**云端存储**:
1. ✅ CloudStorageModule 原生模块（~200 行）
2. ✅ CloudStorageScreen React Native 组件（~200 行）
3. ✅ 支持上传/下载/删除/列表/存储使用情况
4. ✅ 支持后台上传（待集成 WorkManager）

**多语言支持**:
1. ✅ Android 多语言资源（5 种语言）
2. ✅ React Native i18n 配置
3. ✅ 翻译文件（zh/en/ja/ko）
4. ✅ 自动检测系统语言
5. ✅ 手动切换语言

### 🚀 新 Manus 账号可以

- ✅ 直接使用代码骨架
- ✅ 集成云存储服务（AWS S3 / 阿里云 OSS）
- ✅ 完善多语言翻译
- ✅ 添加更多语言支持

---

**功能扩展设计完成！** 🚀

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
