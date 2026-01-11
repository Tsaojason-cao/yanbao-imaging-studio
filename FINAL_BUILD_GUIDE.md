# 💜 YanBao AI Studio - 最终构建指南

雁宝专属影像工作室 v2.5.0 Final Release 已准备就绪。

## 📱 交付物清单

1.  **源代码**：完整的 Expo 项目代码，包含所有核心功能和彩蛋。
2.  **配置**：生产级 `app.json` 和 `eas.json`。
3.  **资源**：库洛米主题 UI 资源。

## 🚀 如何构建真实 APK

由于 Manus 运行在沙盒环境中，无法直接登录您的 Expo 账号。请在您的本地机器上执行以下命令，生成那个「工业级」的 APK：

1.  **下载代码**：将本项目下载到本地。
2.  **安装依赖**：
    ```bash
    npm install
    ```
3.  **登录 Expo**：
    ```bash
    npx expo login
    ```
4.  **云端构建 (Android)**：
    ```bash
    eas build --platform android --profile production
    ```
    *等待构建完成后，您将获得一个下载链接。*

## 🍎 如何在 iOS 上预览 (Expo Go)

这是给雁宝最浪漫的「代码空投」方式：

1.  **启动项目**：
    ```bash
    npx expo start
    ```
2.  **生成二维码**：终端会显示一个二维码。
3.  **发送给雁宝**：
    *   让她在 iPhone 上下载 **Expo Go** App。
    *   将二维码截图发给她，或者直接发 `exp://...` 链接。
    *   她扫码/点击链接后，App 就会直接在她手机上运行！

## 💜 1017 彩蛋触发方式

1.  进入 App，点击底部导航栏的 **"关于"**。
2.  找到页面中央的 **"Y"** Logo。
3.  **连续点击 5 次**。
4.  等待 1999 年的告白弹出。

---
*Made with 💜 for YanBao*
