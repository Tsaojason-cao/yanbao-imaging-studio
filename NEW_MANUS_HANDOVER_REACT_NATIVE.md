# yanbao AI - 新 Manus 账号交接指南 (React Native 版本)

**文档版本**: v3.0  
**创建时间**: 2026年1月17日  
**架构类型**: React Native + 原生 Android 模块混合架构  
**当前进度**: Day 1 已完成 (1/7)

---

## 📋 项目概述

### 项目信息

| 项目名称 | yanbao AI |
|---------|-----------|
| 项目类型 | 原生安卓智能摄影应用 |
| 架构 | React Native + 原生模块混合架构 |
| 开发语言 | TypeScript + Kotlin |
| UI 框架 | React Native + Android Native |
| 开发周期 | 7 天冲刺 |
| 当前进度 | Day 1 完成 (14%) |

### 核心特性

1. **React Native 层** (UI + 业务逻辑)
   - 5 个核心屏幕组件
   - Leica 极简主题
   - 深色/浅色模式
   - React Navigation 导航

2. **原生模块层** (硬件加速 + AI)
   - CameraModule (Camera2 API + NPU)
   - BeautyModule (GPUImage + TFLite)
   - MemoryModule (Room + 向量数据库)
   - MasterModule (JNI + LLM API)
   - ImageModule (GPUImage + OpenCV)

3. **智能化中枢**
   - 大师推理引擎 (Chain of Thought)
   - 记忆系统 (情感维度)
   - 双轨制接口 (智能 + 降级)
   - 本地模型 (TensorFlow Lite)

---

## 🚀 快速开始（3 步）

### 方案 1: 从 GitHub 克隆（推荐）

```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 2. 进入 React Native 项目
cd YanbaoAI

# 3. 安装依赖
npm install

# 4. 运行 Android 应用
npm run android
```

### 方案 2: 使用备份包恢复

```bash
# 1. 下载备份包
# 从 GitHub Releases 下载最新备份

# 2. 解压
tar -xzf yanbao-ai-react-native-day1.tar.gz

# 3. 进入项目
cd yanbao-imaging-studio/YanbaoAI

# 4. 安装依赖
npm install

# 5. 运行应用
npm run android
```

---

## 📚 必读文档清单

### 优先级 1 ⭐⭐⭐（必读）

1. **REACT_NATIVE_HYBRID_ARCHITECTURE.md**
   - 完整的混合架构设计
   - 7 天冲刺计划
   - 原生模块接口设计

2. **YanbaoAI/DAY1_COMPLETION_REPORT.md**
   - Day 1 完成报告
   - 项目结构说明
   - 下一步计划

3. **NEW_MANUS_HANDOVER_REACT_NATIVE.md** (本文档)
   - 快速开始指南
   - Git 同步流程
   - 衔接方案

### 优先级 2 ⭐⭐（推荐）

4. **ENHANCED_EXECUTION_PLAN.md**
   - 智能化升级方案
   - 四大关键加强

5. **INTELLIGENCE_UPGRADE.md**
   - 从"死功能"到"活智能"
   - 详细实现步骤

6. **UI_AUDIT_REPORT.md**
   - UI 审计结果
   - 功能完成度

### 优先级 3 ⭐（参考）

7. **NATIVE_ANDROID_ARCHITECTURE.md**
   - 纯原生 Android 架构设计（参考）

8. **ARCHITECTURE.md**
   - 云端架构设计

9. **MASTER_AND_MEMORY.md**
   - 大师功能和记忆系统

---

## 🏗️ 项目结构

### 目录结构

```
yanbao-imaging-studio/
├── YanbaoAI/                         # React Native 项目（新）
│   ├── android/                      # Android 原生代码
│   │   ├── app/
│   │   │   ├── src/main/
│   │   │   │   ├── java/com/yanbaoai/
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   ├── MainApplication.kt
│   │   │   │   │   └── modules/      # 原生模块
│   │   │   │   │       ├── CameraModule.kt (Day 4-5)
│   │   │   │   │       ├── BeautyModule.kt (Day 4-5)
│   │   │   │   │       ├── MemoryModule.kt (Day 3)
│   │   │   │   │       ├── MasterModule.kt (Day 2)
│   │   │   │   │       └── ImageModule.kt (Day 4-5)
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── build.gradle
│   │   └── build.gradle
│   ├── src/                          # React Native 代码
│   │   ├── screens/                  # 屏幕组件
│   │   │   ├── HomeScreen.tsx        # ✅ Day 1 完成
│   │   │   ├── CameraScreen.tsx      # ✅ Day 1 完成
│   │   │   ├── EditorScreen.tsx      # ✅ Day 1 完成
│   │   │   ├── GalleryScreen.tsx     # ✅ Day 1 完成
│   │   │   └── MapScreen.tsx         # ✅ Day 1 完成
│   │   ├── components/               # 通用组件 (Day 6)
│   │   ├── services/                 # 服务层 (Day 2-5)
│   │   ├── utils/                    # 工具函数 (Day 2-5)
│   │   ├── types/                    # TypeScript 类型 (Day 2-5)
│   │   └── App.tsx                   # ✅ Day 1 完成
│   ├── index.js                      # ✅ Day 1 完成
│   ├── package.json                  # ✅ Day 1 完成
│   ├── tsconfig.json                 # ✅ Day 1 完成
│   └── DAY1_COMPLETION_REPORT.md     # ✅ Day 1 完成
├── REACT_NATIVE_HYBRID_ARCHITECTURE.md  # ✅ 架构设计
├── NEW_MANUS_HANDOVER_REACT_NATIVE.md   # ✅ 本文档
├── QUICKSTART_REACT_NATIVE.sh           # ✅ 快速启动脚本
└── ... (其他文档)
```

### 关键文件说明

| 文件路径 | 用途 | 状态 |
|---------|------|------|
| `YanbaoAI/src/App.tsx` | 主应用组件 + 导航 | ✅ 完成 |
| `YanbaoAI/src/screens/CameraScreen.tsx` | 相机页面（原生模块调用示例） | ✅ 完成 |
| `YanbaoAI/android/app/build.gradle` | Android 依赖配置 | ✅ 完成 |
| `YanbaoAI/android/app/src/main/java/com/yanbaoai/modules/CameraModule.kt` | 相机原生模块 | ⏳ 骨架完成，Day 4-5 实现 |
| `YanbaoAI/package.json` | npm 依赖 | ✅ 完成 |

---

## 🔄 Git 同步流程

### 每日工作流程

```bash
# 1. 开始工作前 - 拉取最新代码
cd /home/ubuntu/yanbao-imaging-studio
git pull origin main

# 2. 查看当前进度
cat YanbaoAI/DAY1_COMPLETION_REPORT.md  # 或 DAY2, DAY3...

# 3. 开发工作
cd YanbaoAI
# 按照 REACT_NATIVE_HYBRID_ARCHITECTURE.md 的计划执行

# 4. 测试
npm run android

# 5. 提交代码
git add .
git commit -m "Day X: 完成 XXX 功能"
git push origin main

# 6. 创建每日备份（可选）
cd /home/ubuntu
tar -czf yanbao-ai-react-native-dayX.tar.gz yanbao-imaging-studio/YanbaoAI/
gh release create "backup-dayX" yanbao-ai-react-native-dayX.tar.gz \
  --title "Day X Backup" \
  --notes "Day X 开发备份"
```

### Git 分支策略

```bash
# 主分支
main                    # 稳定版本，每日合并

# 功能分支（可选）
feature/day2-master     # Day 2: 大师模块
feature/day3-memory     # Day 3: 记忆模块
feature/day4-camera     # Day 4-5: 相机模块
feature/day6-ui         # Day 6: UI 优化
feature/day7-release    # Day 7: 发布准备

# 创建功能分支
git checkout -b feature/day2-master

# 开发完成后合并
git checkout main
git merge feature/day2-master
git push origin main
```

---

## 📅 7 天冲刺计划

### Day 1: 原生环境搭建与 React Native 迁移 ✅

**状态**: ✅ 已完成  
**完成度**: 100%

**已完成**:
- ✅ React Native 项目框架
- ✅ 5 个核心屏幕组件
- ✅ Android 原生配置
- ✅ 原生模块骨架
- ✅ Leica 极简主题

**交付物**:
- YanbaoAI/ 项目目录
- DAY1_COMPLETION_REPORT.md

---

### Day 2: 大师脑接驳与 JNI 接口实现 ⏳

**状态**: ⏳ 待开始  
**完成度**: 0%

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

**开始步骤**:
```bash
# 1. 阅读架构文档
cat REACT_NATIVE_HYBRID_ARCHITECTURE.md  # Day 2 部分

# 2. 创建 MasterModule.kt
# 文件路径: YanbaoAI/android/app/src/main/java/com/yanbaoai/modules/MasterModule.kt

# 3. 下载 TFLite 模型
# 放置到: YanbaoAI/android/app/src/main/assets/master_model.tflite

# 4. 实现 JNI 接口（如需要）
# 创建 C++ 代码: YanbaoAI/android/app/src/main/cpp/

# 5. 测试
npm run android
```

---

### Day 3: 原生记忆存储与本地向量数据库 ⏳

**状态**: ⏳ 待开始  
**完成度**: 0%

**任务清单**:
- [ ] 创建 MemoryModule 原生模块
- [ ] 配置 Room Database
- [ ] 实现本地向量存储（SQLite + 向量索引）
- [ ] 实现情感维度记忆
- [ ] 实现云端同步机制
- [ ] 性能测试（检索延迟 < 200ms）

**技术要点**:
```kotlin
// MemoryModule.kt
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
```

---

### Day 4-5: 原生硬件加速与 Camera2 API 集成 ⏳

**状态**: ⏳ 待开始  
**完成度**: 0%

**任务清单**:
- [ ] 实现 CameraModule (Camera2 API + NPU)
- [ ] 实现 BeautyModule (GPUImage + TFLite)
- [ ] 实现 ImageModule (GPUImage + OpenCV)
- [ ] 实现 12 种滤镜预设
- [ ] 实现 Leica 风格渲染
- [ ] 性能测试（实时预览 60 FPS）

**技术要点**:
```kotlin
// CameraModule.kt
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
```

---

### Day 6: UI 适配、汉化与原生 Activity 优化 ⏳

**状态**: ⏳ 待开始  
**完成度**: 0%

**任务清单**:
- [ ] 所有 UI 文本汉化（除 "yanbao AI"）
- [ ] 优化原生 Activity 跳转动效
- [ ] 实现 Fragment 组件化
- [ ] 优化 Leica 极简风格
- [ ] 实现预测性交互
- [ ] 性能优化（启动速度 < 1 秒）

---

### Day 7: APK 签名打包与性能评估报告 ⏳

**状态**: ⏳ 待开始  
**完成度**: 0%

**任务清单**:
- [ ] 配置 ProGuard 混淆
- [ ] 生成签名密钥
- [ ] 执行 Gradle 打包
- [ ] 生成 release APK
- [ ] 实机性能测试
- [ ] 生成《原生安卓 APK 性能与智能评估报告》

**打包步骤**:
```bash
# 1. 生成签名密钥
keytool -genkeypair -v -storetype PKCS12 -keystore yanbao-release.keystore \
  -alias yanbao-key -keyalg RSA -keysize 2048 -validity 10000

# 2. 配置签名（已在 build.gradle 中配置）

# 3. 打包
cd YanbaoAI/android
./gradlew assembleRelease

# 4. 输出位置
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 性能指标

### 目标值

| 指标 | 目标值 | 测试方法 |
|------|--------|----------|
| APK 包体积 | < 30 MB | 查看文件大小 |
| 启动速度 | < 1 秒 | 实机测试 |
| CPU 占用率 | < 30% | Android Profiler |
| 内存占用 | < 200 MB | Android Profiler |
| 记忆检索延迟 | < 200ms | 日志记录 |
| 美颜处理延迟 | < 16ms | 日志记录 |
| 实时预览帧率 | 60 FPS | 日志记录 |

---

## 💡 开发建议

### 1. 先阅读文档

**必读**:
1. REACT_NATIVE_HYBRID_ARCHITECTURE.md
2. YanbaoAI/DAY1_COMPLETION_REPORT.md
3. 本文档

### 2. 按天推进

**不要跳跃**:
- Day 1 → Day 2 → Day 3 → Day 4-5 → Day 6 → Day 7
- 每天完成后创建 DAYX_COMPLETION_REPORT.md

### 3. 持续测试

**测试命令**:
```bash
cd YanbaoAI
npm run android  # 运行 Android 应用
npm test         # 运行单元测试
npm run lint     # 代码检查
```

### 4. 及时提交

**每天至少提交一次**:
```bash
git add .
git commit -m "Day X: 完成 XXX"
git push origin main
```

---

## 🔧 常见问题

### Q1: 如何安装依赖？

```bash
cd YanbaoAI
npm install
```

### Q2: 如何运行应用？

```bash
cd YanbaoAI
npm run android
```

### Q3: 如何查看日志？

```bash
# React Native 日志
npx react-native log-android

# Android 原生日志
adb logcat | grep YanbaoAI
```

### Q4: 如何调试原生模块？

```bash
# 1. 在 Android Studio 中打开 YanbaoAI/android/
# 2. 设置断点
# 3. 运行 Debug 模式
```

### Q5: 如何更新依赖？

```bash
cd YanbaoAI
npm update
```

---

## 📦 备份策略

### 自动备份脚本

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
  yanbao-imaging-studio/YanbaoAI/

# 2. 上传到 GitHub Release
gh release create "backup-${DAY}" ${BACKUP_NAME} \
  --title "Day ${DAY} Backup" \
  --notes "Automatic daily backup"

# 3. 推送到 Git
cd yanbao-imaging-studio
git add .
git commit -m "Day ${DAY}: Daily backup"
git push origin main

echo "✅ Backup completed: ${BACKUP_NAME}"
```

### 手动备份

```bash
# 1. 打包项目
cd /home/ubuntu
tar -czf yanbao-ai-react-native-dayX.tar.gz \
  --exclude=node_modules \
  --exclude=android/build \
  yanbao-imaging-studio/YanbaoAI/

# 2. 下载备份
# 通过文件管理器下载 yanbao-ai-react-native-dayX.tar.gz
```

---

## 🎉 总结

### 已完成 ✅

- ✅ Day 1: 原生环境搭建与 React Native 迁移
- ✅ React Native 项目框架
- ✅ 5 个核心屏幕组件
- ✅ Android 原生配置
- ✅ 原生模块骨架
- ✅ Git 同步方案

### 待完成 ⏳

- ⏳ Day 2: 大师脑接驳
- ⏳ Day 3: 记忆存储
- ⏳ Day 4-5: 硬件加速
- ⏳ Day 6: UI 优化
- ⏳ Day 7: APK 打包

### 预期成果 🎯

- **开发周期**: 7 天
- **包体积**: < 30 MB
- **启动速度**: < 1 秒
- **性能**: 60 FPS
- **功能完整度**: 100%

---

**新的 Manus 账号可以立即继续开发！** 🚀

**下一步**: 开始 Day 2 - 大师脑接驳与 JNI 接口实现

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
