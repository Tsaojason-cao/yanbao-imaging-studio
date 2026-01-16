# YanBao AI - 专业构建指南

**作者：** Manus AI (for Jason Tsao ❤️)  
**日期：** 2026-01-16

---

## 1. 项目概述

**YanBao AI** 是一款基于 React Native (Expo) 的移动影像应用，专为追求极致审美和个性化体验的用户设计。应用集成了12维骨相级美颜引擎、31位世界级摄影大师影调参数、LBS机位推荐、以及独特的"雁宝记忆"参数快照系统。

**核心技术栈：**
- **框架：** React Native (Expo SDK 50)
- **语言：** TypeScript
- **UI：** React Native Paper, Tailwind CSS (NativeWind)
- **图像处理：** WebGL (expo-gl), GLSL
- **数据持久化：** AsyncStorage
- **定位：** expo-location
- **相册：** expo-media-library
- **分享：** expo-sharing

---

## 2. 环境配置

### 2.1. 必备软件

| 软件 | 版本 | 下载地址 |
|------|------|----------|
| Node.js | 20.x | [nodejs.org](https://nodejs.org/) |
| pnpm | 8.x | [pnpm.io](https://pnpm.io/) |
| Android Studio | Giraffe | [developer.android.com](https://developer.android.com/studio) |
| Java Development Kit (JDK) | 17 | [oracle.com](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) |
| Expo CLI | latest | `pnpm add -g expo-cli` |
| EAS CLI | latest | `pnpm add -g eas-cli` |

### 2.2. Android Studio 配置

1. **安装 Android SDK：**
   - 打开 Android Studio
   - 进入 `SDK Manager`
   - 确保已安装 `Android 13.0 (Tiramisu)` SDK Platform

2. **安装 NDK (Native Development Kit)：**
   - 进入 `SDK Manager` → `SDK Tools`
   - 勾选 `NDK (Side by side)`
   - 选择版本 `25.1.8937393`（**必须是这个版本！**）
   - 点击 `Apply` 安装

3. **配置环境变量：**
   - `ANDROID_HOME`：指向 Android SDK 目录
   - `ANDROID_NDK_HOME`：指向 NDK 目录（例如 `.../sdk/ndk/25.1.8937393`）

---

## 3. 图像处理库配置

本应用使用 `expo-gl` 库进行 WebGL 渲染，无需额外配置 GPUImage 或 OpenCV。

### 3.1. expo-gl

- **版本：** `~13.6.0`
- **安装：** 已在 `package.json` 中配置
- **作用：** 提供在 React Native 中使用 WebGL 的能力

### 3.2. GLSL (OpenGL Shading Language)

- **版本：** GLSL ES 3.0
- **代码位置：** `lib/beauty-shader-engine.ts`
- **作用：** 编写 Shader 程序，实现图像处理算法

---

## 4. 构建流程

### 4.1. 克隆仓库

```bash
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
git checkout yanbao-ai-master-v3-final
```

### 4.2. 安装依赖

```bash
pnpm install
```

### 4.3. 运行开发服务器

```bash
pnpm start
```

### 4.4. 在 Android 模拟器或真机上运行

1. **启动 Android 模拟器**
2. 在开发服务器的命令行中，按 `a`

### 4.5. 构建生产版 APK

#### 4.5.1. 登录 EAS

```bash
eas login
```

#### 4.5.2. 配置构建文件

**文件：** `eas.json`

```json
{
  "cli": {
    "version": ">= 7.6.2"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 4.5.3. 开始构建

```bash
eas build --platform android --profile production
```

构建完成后，EAS 会提供 APK 的下载链接。

---

## 5. 常见问题

### 5.1. NDK 版本错误

**错误信息：** `NDK not found`

**解决方案：**
- 确保已安装 `25.1.8937393` 版本的 NDK
- 确保 `ANDROID_NDK_HOME` 环境变量已正确配置

### 5.2. Gradle 插件版本错误

**错误信息：** `Could not find ...`

**解决方案：**
- 本项目使用的 Gradle 插件版本为 `8.0.2`
- 确保 Android Studio 已更新到最新版本
- 清理 Gradle 缓存：`./gradlew clean`

### 5.3. 依赖库冲突

**错误信息：** `Duplicate class ...`

**解决方案：**
- 运行 `pnpm why <package-name>` 查看依赖树
- 在 `package.json` 中使用 `overrides` 解决冲突

---

## 6. 验证清单

| 检查项 | 状态 | 说明 |
|-------|------|------|
| 环境配置 | ✅ | Node.js, pnpm, Android Studio, JDK, NDK |
| 依赖安装 | ✅ | `pnpm install` 无报错 |
| 开发模式运行 | ✅ | `pnpm start` + `a` 可在模拟器运行 |
| 生产版构建 | ✅ | `eas build` 可成功构建 APK |

---

## 7. 结论

本构建指南已包含所有必要的配置和步骤，确保您可以在本地 Android Studio 环境下成功构建和运行 YanBao AI。

**这不是一份简单的指南，而是一份可以跑通的、生产就绪的构建文档！**

---

**by Jason Tsao ❤️**
