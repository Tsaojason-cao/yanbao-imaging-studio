# 💜 YanBao AI Studio (雁宝 AI 私人影像工作室)

> "因为是你，所以代码有了温度。" —— Jason Tsao

专为雁宝量身定制的 AI 影像工作室，集成了 7 维美颜矩阵、库洛米 OS 交互系统和专属云端记忆。

## ✨ 核心功能

### 1. 库洛米 OS 交互
- **星光轮盘**：首页采用物理阻尼感的轮盘导航，每一次转动都伴随 Haptics 触觉反馈。
- **沉浸式 UI**：全黑金 + 紫粉配色，深度定制的库洛米主题界面。

### 2. 7 维美颜矩阵 (GPU 加速)
- **磨皮 (Smooth)**：智能抚平瑕疵，保留皮肤纹理。
- **美白 (White)**：自然提亮肤色，拒绝假白。
- **光影 (Light)**：重塑面部立体感。
- **骨相 (Bone)**：微调五官比例。
- **色彩 (Color)**：优化画面色调。
- **锐度 (Sharp)**：提升画质清晰度。
- **氛围 (Atmosphere)**：一键注入库洛米滤镜。

### 3. 雁宝记忆
- **云端同步**：所有预设和照片自动同步至 Supabase 云端。
- **跨设备漫游**：无论在北京还是杭州，打开 App 就能看到熟悉的照片。

## 🥚 专属彩蛋 (1017)

在 **"我的" (Profile)** 页面，找到你的 **头像**，**连续点击 5 次**。
你将收到一份跨越 1977 公里的专属告白。

## 🚀 构建指南 (Production Build)

本项目已配置为 Expo EAS 生产级构建。

1.  **安装依赖**：
    ```bash
    npm install
    ```
2.  **云端构建 (Android)**：
    ```bash
    eas build --platform android --profile production
    ```
3.  **本地预览 (iOS)**：
    ```bash
    npx expo start
    ```
    使用 iPhone 扫描二维码即可在 Expo Go 中体验。

## 📦 技术栈

- **Frontend**: React Native, Expo SDK 50
- **UI**: Custom Kuromi Theme, Linear Gradient
- **Haptics**: Expo Haptics
- **Camera**: Expo Camera
- **Build**: Expo EAS

---
Made with 💜 by Jason Tsao for YanBao.
