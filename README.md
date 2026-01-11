# 💜 YanBao AI Studio (雁宝 AI 私人影像工作室)

> "因为是你，所以代码有了温度。" —— Jason Tsao

专为雁宝量身定制的 AI 影像工作室，集成了 7 维美颜矩阵、库洛米 OS 交互系统和专属云端记忆。

## ✨ 核心功能

### 1. 库洛米 OS 交互 ✅
- **星光轮盘**：首页采用物理阻尼感的轮盘导航，每一次转动都伴随 Haptics 触觉反馈。
- **沉浸式 UI**：紫粉渐变配色 (#D4A5FF → #FFB3D9)，深度定制的库洛米主题界面。

### 2. 7 维美颜矩阵 (GPU 加速) 🚧
- **磨皮 (Smoothing)** ✅：高斯模糊 + 高通滤波，智能抚平瑕疵。
- **美白 (Whitening)** ✅：自然提亮肤色，拒绝假白。
- **瘦脸 (Face Slim)** 🚧：基于人脸关键点的网格变形（开发中）。
- **大眼 (Eye Enlarge)** 🚧：眼部区域局部放大（开发中）。
- **亮度 (Brightness)** ✅：全局亮度调节。
- **对比度 (Contrast)** ✅：动态范围优化。
- **饱和度 (Saturation)** ✅：HSL 色彩空间调节。

### 3. 雁宝记忆 ✅
- **预设管理**：创建/编辑/删除专属美颜配方。
- **收藏系统**：标记常用预设，快速访问。
- **云端同步** 🚧：所有预设和照片自动同步至 Supabase 云端（开发中）。
- **跨设备漫游** 🚧：无论在北京还是杭州，打开 App 就能看到熟悉的照片（开发中）。

## 🥚 专属彩蛋 (1017)

在 **"我的" (Profile)** 页面，找到你的 **头像**，**连续点击 5 次**。
你将收到一份跨越 1977 公里的专属告白。

## 🚀 快速开始

### 环境要求
- Node.js 22.x
- pnpm 10.x
- Expo CLI
- Android Studio / Xcode

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 启动 Expo 开发服务器
pnpm expo start

# 在 Android 模拟器运行
pnpm expo start --android

# 在 iOS 模拟器运行（仅 macOS）
pnpm expo start --ios
```

### 构建生产 APK
```bash
# 使用 EAS Build（需要 Expo 账号）
eas build --platform android --profile production
```

## 📦 技术栈

- **Framework**: React Native 0.81.5 + Expo SDK 54
- **Language**: TypeScript 5.9.3
- **Navigation**: React Navigation 7.x (Stack)
- **Rendering**: expo-gl (OpenGL ES)
- **Camera**: expo-camera
- **Haptics**: expo-haptics
- **Storage**: expo-file-system
- **UI**: expo-linear-gradient, @react-native-community/slider
- **Build**: Expo EAS

## 🎯 开发进度

### ✅ 已完成
- [x] 项目架构搭建
- [x] 库洛米主题系统
- [x] 所有核心页面 UI
- [x] React Navigation 路由
- [x] GPU 美颜 Shader（5/7 参数）
- [x] BeautyRenderer 组件
- [x] 触觉反馈集成
- [x] 1017 彩蛋功能

### 🚧 进行中
- [ ] 人脸检测集成（瘦脸、大眼）
- [ ] 性能优化（60 FPS）
- [ ] 真机测试

### 📋 待开发
- [ ] Supabase 云端同步
- [ ] 离线模式
- [ ] 照片导出和分享
- [ ] 批量处理
- [ ] LUT 滤镜导入

---
Made with 💜 by Jason Tsao for YanBao.
