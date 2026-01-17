# yanbao AI - React Native + 原生模块混合架构设计

**文档版本**: v2.0  
**创建时间**: 2026年1月17日  
**架构类型**: React Native + 原生 Android 模块混合架构  
**开发周期**: 7 天冲刺

---

## 📋 架构调整说明

### 为什么选择 React Native + 原生模块混合架构？

| 对比项 | 纯原生 Kotlin | React Native 混合 | 选择理由 |
|--------|--------------|------------------|----------|
| **开发速度** | 20 天 | 7 天 | ✅ 复用现有 React 代码 |
| **UI 逻辑复用** | 需重写 | 100% 复用 | ✅ 已有 React 组件可用 |
| **原生性能** | 100% | 95% (原生模块) | ✅ 关键功能原生实现 |
| **硬件加速** | 完整支持 | 完整支持 (通过原生模块) | ✅ NDK/GPU/NPU 可调用 |
| **维护成本** | 低 | 中 | ⚠️ 需维护两套代码 |
| **智能化集成** | 完整 | 完整 | ✅ 原生模块支持 TFLite |

### 核心优势

1. **快速开发** ✅
   - 复用现有 React Native 代码（UI + 业务逻辑）
   - 只需开发关键的原生模块
   - 7 天内完成开发和打包

2. **原生性能** ✅
   - 美颜功能：原生 NDK + GPU 加速
   - 相机功能：Camera2 API + NPU 处理
   - 图片处理：GPUImage 原生库
   - 记忆检索：本地向量数据库（Room + SQLite）

3. **智能化集成** ✅
   - Python 后端：通过 API 调用
   - 本地模型：TensorFlow Lite 嵌入
   - 大师推理：JNI 接口高效调用
   - 记忆系统：本地缓存 + 云端同步

---

## 🏗️ 混合架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Layer                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Home    │  Camera  │  Editor  │  Gallery │   Map    │  │
│  │  Screen  │  Screen  │  Screen  │  Screen  │  Screen  │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
│       │          │          │          │          │         │
│       ▼          ▼          ▼          ▼          ▼         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Native Bridge (JSI)                   │  │
│  └────────────────────────┬─────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Native Android Layer                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Camera  │  Beauty  │  Image   │  Memory  │  Master  │  │
│  │  Module  │  Module  │  Module  │  Module  │  Module  │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
│       │          │          │          │          │         │
│       ▼          ▼          ▼          ▼          ▼         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Android Native APIs & Hardware               │  │
│  │  Camera2 │ NDK │ GPU │ NPU │ Room │ TFLite │ JNI    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Backend & Cloud Layer                     │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Python  │  Vector  │  LLM     │  Image   │  Redis   │  │
│  │  Backend │  DB API  │  API     │  API     │  Cache   │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 核心模块设计

### 1. Camera Module (原生模块)

**技术栈**:
- Camera2 API (原生相机控制)
- NDK (C++ 图像处理)
- GPU 加速 (OpenGL ES)
- NPU 加速 (Neural Network API)

**功能**:
- ✅ 实时预览 (60 FPS)
- ✅ 美颜效果 (NPU 加速)
- ✅ 美白效果 (GPU 加速)
- ✅ Leica 风格渲染
- ✅ 前后摄像头切换

**原生模块接口**:
```kotlin
// CameraModule.kt
class CameraModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    @ReactMethod
    fun openCamera(options: ReadableMap, promise: Promise) {
        // 使用 Camera2 API 打开相机
    }
    
    @ReactMethod
    fun applyBeautyFilter(level: Int, promise: Promise) {
        // 使用 NPU 应用美颜效果
    }
    
    @ReactMethod
    fun capturePhoto(promise: Promise) {
        // 拍照并保存
    }
}
```

**React Native 调用**:
```typescript
// CameraScreen.tsx
import { NativeModules } from 'react-native';
const { CameraModule } = NativeModules;

const openCamera = async () => {
  try {
    const result = await CameraModule.openCamera({
      facing: 'front',
      beautyLevel: 80
    });
    console.log('Camera opened:', result);
  } catch (error) {
    console.error('Camera error:', error);
  }
};
```

---

### 2. Beauty Module (原生模块)

**技术栈**:
- GPUImage (GPU 加速图像处理)
- GLSL Shader (自定义滤镜)
- NPU (神经网络处理器)
- TensorFlow Lite (本地 AI 模型)

**功能**:
- ✅ 实时美颜 (< 16ms 延迟)
- ✅ 智能美白
- ✅ 肤色检测
- ✅ 面部识别
- ✅ 大师级修图建议

**原生模块接口**:
```kotlin
// BeautyModule.kt
class BeautyModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val gpuImage = GPUImage(reactContext)
    private val tflite = Interpreter(loadModelFile())
    
    @ReactMethod
    fun applyBeauty(imagePath: String, level: Int, promise: Promise) {
        // 使用 GPU 加速处理
        gpuImage.setFilter(GPUImageBeautyFilter(level))
        val result = gpuImage.getBitmapWithFilterApplied(bitmap)
        promise.resolve(saveBitmap(result))
    }
    
    @ReactMethod
    fun getMasterSuggestion(imagePath: String, promise: Promise) {
        // 使用 TFLite 本地模型分析
        val suggestion = tflite.run(preprocessImage(imagePath))
        promise.resolve(suggestion)
    }
}
```

---

### 3. Memory Module (原生模块)

**技术栈**:
- Room Database (本地数据库)
- SQLite (向量存储)
- Retrofit (API 调用)
- Kotlin Coroutines (异步处理)

**功能**:
- ✅ 本地记忆缓存
- ✅ 向量检索 (< 200ms)
- ✅ 情感维度存储
- ✅ 云端同步

**原生模块接口**:
```kotlin
// MemoryModule.kt
class MemoryModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val database = MemoryDatabase.getInstance(reactContext)
    private val api = RetrofitClient.memoryApi
    
    @ReactMethod
    fun storeMemory(memory: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            // 本地存储
            database.memoryDao().insert(memory.toEntity())
            
            // 云端同步
            api.storeMemory(memory.toJson())
            
            promise.resolve(true)
        }
    }
    
    @ReactMethod
    fun searchMemory(query: String, promise: Promise) {
        GlobalScope.launch {
            val startTime = System.currentTimeMillis()
            
            // 本地检索
            val localResults = database.memoryDao().search(query)
            
            // 云端检索（如果本地结果不足）
            val cloudResults = if (localResults.size < 5) {
                api.searchMemory(query)
            } else emptyList()
            
            val endTime = System.currentTimeMillis()
            val latency = endTime - startTime
            
            promise.resolve(WritableNativeMap().apply {
                putArray("results", localResults + cloudResults)
                putInt("latency", latency.toInt())
            })
        }
    }
}
```

---

### 4. Master Module (原生模块)

**技术栈**:
- OkHttp (高效 HTTP 客户端)
- Kotlin Coroutines (异步处理)
- TensorFlow Lite (本地推理)
- JNI (C++ 高性能计算)

**功能**:
- ✅ Chain of Thought 推理
- ✅ 个性化建议
- ✅ 地点推荐
- ✅ 拍摄指导

**原生模块接口**:
```kotlin
// MasterModule.kt
class MasterModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val api = RetrofitClient.masterApi
    private val tflite = Interpreter(loadMasterModel())
    
    @ReactMethod
    fun getMasterAdvice(context: ReadableMap, promise: Promise) {
        GlobalScope.launch {
            try {
                // 1. 本地快速推理（TFLite）
                val localAdvice = tflite.run(context.toTensor())
                
                // 2. 云端深度推理（如果需要）
                val cloudAdvice = if (context.getBoolean("needDeep")) {
                    api.getMasterAdvice(context.toJson())
                } else null
                
                promise.resolve(WritableNativeMap().apply {
                    putMap("local", localAdvice)
                    putMap("cloud", cloudAdvice)
                })
            } catch (error: Exception) {
                promise.reject("MASTER_ERROR", error.message)
            }
        }
    }
}
```

---

### 5. Image Module (原生模块)

**技术栈**:
- GPUImage (GPU 加速)
- OpenCV (图像处理)
- NDK (C++ 高性能)
- GLSL Shader (自定义效果)

**功能**:
- ✅ 12 种滤镜预设
- ✅ 亮度/对比度/饱和度调节
- ✅ 配方保存和加载
- ✅ 撤销/重做

**原生模块接口**:
```kotlin
// ImageModule.kt
class ImageModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {
    
    private val gpuImage = GPUImage(reactContext)
    
    @ReactMethod
    fun applyFilter(imagePath: String, filterName: String, promise: Promise) {
        val filter = when (filterName) {
            "leica_classic" -> GPUImageLeicaClassicFilter()
            "leica_vivid" -> GPUImageLeicaVividFilter()
            // ... 其他 10 种滤镜
            else -> GPUImageFilter()
        }
        
        gpuImage.setFilter(filter)
        val result = gpuImage.getBitmapWithFilterApplied(loadBitmap(imagePath))
        promise.resolve(saveBitmap(result))
    }
    
    @ReactMethod
    fun adjustBrightness(imagePath: String, level: Int, promise: Promise) {
        // 使用 GPU 加速调节亮度
    }
}
```

---

## 🚀 7 天冲刺计划

### Day 1: 原生环境搭建与 React Native 迁移

**目标**: 配置 Android Studio 环境，将 Web 代码迁移至原生容器

**任务清单**:
- [x] 安装 Android Studio Hedgehog
- [x] 配置 JDK 17 + Android SDK 34
- [ ] 创建 React Native 项目
- [ ] 配置 Gradle 多模块
- [ ] 集成现有 React 代码
- [ ] 配置原生模块桥接
- [ ] 测试基础导航

**技术要点**:
```bash
# 1. 创建 React Native 项目
npx react-native@latest init YanbaoAI --template react-native-template-typescript

# 2. 配置原生模块
cd YanbaoAI/android
mkdir -p app/src/main/java/com/yanbao/modules

# 3. 集成现有代码
cp -r ../yanbao-imaging-studio/src/* ./src/
```

**交付物**:
- ✅ React Native 项目框架
- ✅ 原生模块桥接配置
- ✅ 基础导航可运行

---

### Day 2: 大师脑接驳与 JNI 接口实现

**目标**: 通过 JNI 接口或高效 API 调用，确保原生端能快速响应 CoT 推理

**任务清单**:
- [ ] 创建 MasterModule 原生模块
- [ ] 实现 JNI 接口（C++ 高性能计算）
- [ ] 集成 TensorFlow Lite 本地模型
- [ ] 实现 Chain of Thought 推理
- [ ] 连接 Python 后端 API
- [ ] 实现双轨制接口（智能模式 + 降级模式）
- [ ] 性能测试（推理延迟 < 200ms）

**技术要点**:
```kotlin
// MasterModule.kt
@ReactMethod
fun getMasterAdvice(context: ReadableMap, promise: Promise) {
    // 1. 检查健康状态
    if (healthChecker.isHealthy()) {
        // 智能模式：TFLite + API
        val advice = tflite.run(context) + api.getAdvice(context)
    } else {
        // 降级模式：本地规则
        val advice = localRules.getAdvice(context)
    }
    promise.resolve(advice)
}
```

**交付物**:
- ✅ MasterModule 原生模块
- ✅ JNI 接口实现
- ✅ TFLite 本地模型集成
- ✅ 推理延迟 < 200ms

---

### Day 3: 原生记忆存储与本地向量数据库

**目标**: 部署本地向量数据库或 Room 数据库缓存，提升记忆检索速度

**任务清单**:
- [ ] 创建 MemoryModule 原生模块
- [ ] 配置 Room Database
- [ ] 实现本地向量存储（SQLite + 向量索引）
- [ ] 实现情感维度记忆
- [ ] 实现云端同步机制
- [ ] 性能测试（检索延迟 < 200ms）

**技术要点**:
```kotlin
// MemoryDatabase.kt
@Database(entities = [Memory::class], version = 1)
abstract class MemoryDatabase : RoomDatabase() {
    abstract fun memoryDao(): MemoryDao
}

@Dao
interface MemoryDao {
    @Query("SELECT * FROM memories WHERE embedding MATCH :query ORDER BY similarity DESC LIMIT 10")
    suspend fun search(query: String): List<Memory>
    
    @Insert
    suspend fun insert(memory: Memory)
}
```

**交付物**:
- ✅ MemoryModule 原生模块
- ✅ Room Database 配置
- ✅ 本地向量存储
- ✅ 检索延迟 < 200ms

---

### Day 4-5: 原生硬件加速与 Camera2 API 集成

**目标**: 使用安卓 Camera2 API 实现真正的 Leica 风格渲染与意图推荐

**任务清单**:
- [ ] 创建 CameraModule 原生模块
- [ ] 集成 Camera2 API
- [ ] 实现 NPU 美颜加速
- [ ] 实现 GPU 图像处理（GPUImage）
- [ ] 实现 Leica 风格渲染（GLSL Shader）
- [ ] 创建 BeautyModule 原生模块
- [ ] 创建 ImageModule 原生模块
- [ ] 实现 12 种滤镜预设
- [ ] 性能测试（实时预览 60 FPS）

**技术要点**:
```kotlin
// CameraModule.kt
class CameraModule : ReactContextBaseJavaModule {
    private val cameraManager = context.getSystemService(CameraManager::class.java)
    private val neuralNetworksApi = NeuralNetworksApi()
    
    @ReactMethod
    fun openCamera(options: ReadableMap, promise: Promise) {
        val cameraId = cameraManager.cameraIdList[0]
        cameraManager.openCamera(cameraId, object : CameraDevice.StateCallback() {
            override fun onOpened(camera: CameraDevice) {
                // 配置预览 + 美颜
                val previewRequest = camera.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW)
                
                // 使用 NPU 加速美颜
                neuralNetworksApi.applyBeauty(previewRequest, beautyLevel)
                
                promise.resolve(true)
            }
        }, null)
    }
}
```

**交付物**:
- ✅ CameraModule 原生模块
- ✅ Camera2 API 集成
- ✅ NPU 美颜加速
- ✅ GPU 图像处理
- ✅ 12 种滤镜预设
- ✅ 实时预览 60 FPS

---

### Day 6: UI 适配、汉化与原生 Activity 优化

**目标**: 按照 Simplified Chinese 规范，优化原生 Activity 的跳转动效

**任务清单**:
- [ ] 所有 UI 文本汉化（除 "yanbao AI"）
- [ ] 优化原生 Activity 跳转动效
- [ ] 实现 Fragment 组件化（8 大核心模块）
- [ ] 优化 Leica 极简风格
- [ ] 优化 Kuromi 主题（Neon Purple + Pink）
- [ ] 实现预测性交互
- [ ] 性能优化（启动速度 < 1 秒）

**技术要点**:
```kotlin
// MainActivity.kt
class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 优化启动动画
        window.setBackgroundDrawableResource(R.drawable.splash_screen)
        
        // 配置主题
        setTheme(R.style.Theme_YanbaoAI_Leica)
    }
    
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle {
                return Bundle().apply {
                    putString("theme", "leica_minimalist")
                    putString("language", "zh-CN")
                }
            }
        }
    }
}
```

**交付物**:
- ✅ 全中文 UI（除品牌名）
- ✅ 原生 Activity 跳转动效
- ✅ Fragment 组件化
- ✅ Leica 极简风格
- ✅ 启动速度 < 1 秒

---

### Day 7: APK 签名打包与性能评估报告

**目标**: 执行 Gradle 打包任务，生成 release 版 APK，并输出性能评估报告

**任务清单**:
- [ ] 配置 ProGuard 混淆
- [ ] 生成签名密钥
- [ ] 执行 Gradle 打包
- [ ] 生成 release APK
- [ ] 实机性能测试
- [ ] 生成《原生安卓 APK 性能与智能评估报告》
- [ ] 验证 CPU 占用率
- [ ] 验证记忆检索延迟 < 200ms

**技术要点**:
```bash
# 1. 生成签名密钥
keytool -genkeypair -v -storetype PKCS12 -keystore yanbao-release.keystore \
  -alias yanbao-key -keyalg RSA -keysize 2048 -validity 10000

# 2. 配置 Gradle
# android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('yanbao-release.keystore')
            storePassword 'yanbao2026'
            keyAlias 'yanbao-key'
            keyPassword 'yanbao2026'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

# 3. 打包
cd android
./gradlew assembleRelease

# 4. 输出位置
# android/app/build/outputs/apk/release/app-release.apk
```

**性能评估指标**:
| 指标 | 目标值 | 测试方法 |
|------|--------|----------|
| APK 包体积 | < 30 MB | 查看文件大小 |
| 启动速度 | < 1 秒 | 实机测试 |
| CPU 占用率 | < 30% | Android Profiler |
| 内存占用 | < 200 MB | Android Profiler |
| 记忆检索延迟 | < 200ms | 日志记录 |
| 美颜处理延迟 | < 16ms | 日志记录 |
| 实时预览帧率 | 60 FPS | 日志记录 |

**交付物**:
- ✅ release APK (已签名)
- ✅ 《原生安卓 APK 性能与智能评估报告》
- ✅ 性能测试数据
- ✅ 优化建议

---

## 🔄 新 Manus 账号交接方案

### 方案 1: Git 同步（推荐）

**步骤**:
```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 2. 查看最新进度
git log --oneline -10

# 3. 阅读关键文档
cat REACT_NATIVE_HYBRID_ARCHITECTURE.md
cat NATIVE_ANDROID_PERFORMANCE_REPORT.md

# 4. 继续开发
# 按照当前 Day 的任务清单执行

# 5. 每天同步
git pull origin main  # 开始前
git add .
git commit -m "Day X: 完成 XXX"
git push origin main  # 结束后
```

### 方案 2: 备份包恢复

**步骤**:
```bash
# 1. 下载备份包
# 从 GitHub Releases 下载最新备份

# 2. 解压
tar -xzf yanbao-ai-react-native-backup-dayX.tar.gz

# 3. 恢复项目
cd yanbao-ai-react-native

# 4. 安装依赖
npm install
cd android && ./gradlew build

# 5. 继续开发
```

### 每日备份策略

**自动备份脚本**:
```bash
#!/bin/bash
# daily-backup.sh

DAY=$(date +%Y%m%d)
BACKUP_NAME="yanbao-ai-react-native-backup-day${DAY}.tar.gz"

# 1. 打包项目
tar -czf ${BACKUP_NAME} \
  --exclude=node_modules \
  --exclude=android/build \
  --exclude=android/.gradle \
  yanbao-ai-react-native/

# 2. 上传到 GitHub Release
gh release create "backup-${DAY}" ${BACKUP_NAME} \
  --title "Day ${DAY} Backup" \
  --notes "Automatic daily backup"

# 3. 推送到 Git
cd yanbao-ai-react-native
git add .
git commit -m "Day ${DAY}: Daily backup"
git push origin main

echo "✅ Backup completed: ${BACKUP_NAME}"
```

---

## 📊 项目里程碑

### Milestone 1: Day 1 ✅
- [ ] React Native 项目创建
- [ ] 原生模块桥接配置
- [ ] 基础导航可运行

### Milestone 2: Day 2 ⏳
- [ ] MasterModule 实现
- [ ] JNI 接口实现
- [ ] TFLite 集成

### Milestone 3: Day 3 ⏳
- [ ] MemoryModule 实现
- [ ] Room Database 配置
- [ ] 本地向量存储

### Milestone 4: Day 4-5 ⏳
- [ ] CameraModule 实现
- [ ] Camera2 API 集成
- [ ] NPU/GPU 加速

### Milestone 5: Day 6 ⏳
- [ ] UI 汉化
- [ ] Activity 优化
- [ ] 性能优化

### Milestone 6: Day 7 ⏳
- [ ] APK 打包
- [ ] 性能评估报告
- [ ] 最终交付

---

## 🎯 成功标准

### 功能完整性
- ✅ 8 大核心模块全部实现
- ✅ 原生权限调用（Camera2/NDK/GPU/NPU）
- ✅ 智能化功能集成（大师推理 + 记忆系统）

### 性能指标
- ✅ APK 包体积 < 30 MB
- ✅ 启动速度 < 1 秒
- ✅ CPU 占用率 < 30%
- ✅ 记忆检索延迟 < 200ms
- ✅ 美颜处理延迟 < 16ms
- ✅ 实时预览 60 FPS

### 用户体验
- ✅ 全中文 UI（除品牌名）
- ✅ Leica 极简风格
- ✅ Kuromi 主题
- ✅ 流畅的原生动效

---

**React Native + 原生模块混合架构设计完成！**

**立即开始 Day 1 开发！** 🚀

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
