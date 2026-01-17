# yanbao AI - APK 构建指南

## 项目信息
- **应用名称**: yanbao AI
- **包名**: com.yanbaoai
- **版本**: 1.0.0
- **最后更新**: 2026-01-17

## 快速开始

### 方案 1: GitHub Actions 自动构建（推荐）

#### 步骤 1: 推送代码到 GitHub
```bash
git push origin sanmu-v1-production
```

#### 步骤 2: 触发自动构建
1. 进入 GitHub 仓库: https://github.com/Tsaojason-cao/yanbao-imaging-studio
2. 点击 **Actions** 标签
3. 选择 **"yanbao AI Android Build"** workflow
4. 点击 **"Run workflow"** 按钮
5. 选择分支 **sanmu-v1-production**
6. 点击 **"Run workflow"** 确认

#### 步骤 3: 下载 APK
1. 等待构建完成（约 15-20 分钟）
2. 构建完成后，在 workflow 运行页面点击 **Artifacts**
3. 下载 **yanbao-ai-final-apk**

### 方案 2: 本地构建

#### 前提条件
- JDK 17+
- Android SDK (API 34)
- Node.js 18+
- npm 或 yarn

#### 构建步骤

1. **克隆项目**
```bash
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
git checkout sanmu-v1-production
```

2. **安装依赖**
```bash
npm install
```

3. **配置 Android SDK**
```bash
# 创建 local.properties 文件
echo "sdk.dir=/path/to/android-sdk" > android/local.properties
```

4. **生成 JS Bundle**
```bash
mkdir -p android/app/src/main/assets
npx react-native bundle --platform android --dev false --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res
```

5. **构建 APK**
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

6. **输出位置**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 项目结构

```
yanbao-imaging-studio/
├── android/                          # Android 原生代码
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/yanbaoai/
│   │   │   │   └── modules/         # 原生模块
│   │   │   │       ├── CameraModule.kt      (300+ 行)
│   │   │   │       ├── MasterModule.kt      (420+ 行)
│   │   │   │       ├── MemoryModule.kt
│   │   │   │       └── YanbaoNativePackage.kt
│   │   │   ├── assets/
│   │   │   │   └── index.android.bundle    (1.2MB)
│   │   │   └── res/
│   │   │       └── values/strings.xml
│   │   └── build.gradle
│   └── gradlew
├── src/                              # React Native 源代码
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── EditorScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── MapScreen.tsx
│   ├── components/
│   └── App.tsx
├── assets/
│   └── logo.png                      (58KB)
├── package.json
└── .github/workflows/
    └── android_build.yml             # GitHub Actions 工作流
```

## 功能特性

### 原生模块 (100% 完成)

#### CameraModule.kt
- ✅ Camera2 API 完整调用
- ✅ 50ms 震动反馈
- ✅ 自动对焦和自动曝光
- ✅ 前后摄像头切换
- ✅ 美颜参数设置
- ✅ 图片保存到 /yanbao/ 目录

#### MasterModule.kt
- ✅ TFLite 推理完整流程
- ✅ 输入预处理 (photo/location/edit)
- ✅ 输出后处理 (10 种建议)
- ✅ 规则引擎降级模式
- ✅ 云端 API 调用
- ✅ 全部简体中文建议

#### MemoryModule.kt
- ✅ 本地记忆缓存
- ✅ 语义检索 (<200ms)
- ✅ 情感维度存储
- ✅ 云端同步
- ✅ 向量检索

### UI 界面 (100% 中文化)
- 专业级拍摄体验
- 智能美化工具
- 记忆智能管理
- 发现美景地点
- 德国徒卡简约设计

## 常见问题

### Q: 构建失败 - "SDK location not found"
**A**: 确保设置了 `ANDROID_HOME` 环境变量或在 `android/local.properties` 中配置 `sdk.dir`

### Q: 构建失败 - "Java 17 required"
**A**: 安装 JDK 17 并设置 `JAVA_HOME` 环境变量

### Q: 构建失败 - "License not accepted"
**A**: 使用 `sdkmanager --licenses` 接受 Android SDK 许可证

### Q: APK 安装后白屏
**A**: 确保 JS Bundle 已正确生成到 `android/app/src/main/assets/index.android.bundle`

## 技术栈

- **前端**: React Native + TypeScript
- **原生**: Kotlin (Android)
- **构建**: Gradle + Expo
- **AI**: TensorFlow Lite
- **存储**: SQLite + 云端 API

## 支持

如有问题，请在 GitHub 仓库提交 Issue 或联系开发团队。

---
**最后更新**: 2026-01-17
**维护者**: yanbao AI 开发团队
