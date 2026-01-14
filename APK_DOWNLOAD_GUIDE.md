# yanbao AI v2.2.0 - 一键下载 APK 指南

## 🎉 构建成功！

您的 yanbao AI APK 已经在 EAS Build 上成功构建完成！

---

## 📦 构建信息

| 项目 | 详情 |
|------|------|
| **构建 ID** | 1dcee137-c50e-4e89-992a-83671faf5274 |
| **构建类型** | Android internal distribution build |
| **版本** | 2.1.1 (1) |
| **配置** | preview |
| **SDK 版本** | 54.0.0 |
| **分支** | main (7420fbf) |
| **提交信息** | 🎉 APK生产就绪：4张实机截图+7大模块验证+完整构建指南 |
| **构建状态** | ✅ Finished |
| **构建时间** | 11m 2s |
| **可用期限** | 13 days |

---

## 🚀 方法 1: 在电脑上下载 APK（推荐）

### 步骤 1: 访问构建页面

在浏览器中打开以下链接：

```
https://expo.dev/accounts/tsao-jason/projects/yanbao-eas-build/builds/1dcee137-c50e-4e89-992a-83671faf5274
```

---

### 步骤 2: 点击「Install」按钮

在页面中找到 **「Install」** 按钮（蓝色按钮），点击下载 APK。

**APK 文件名**: `build-1dcee137-c50e-4e89-992a-83671faf5274.apk`

**文件大小**: 约 50-80 MB

---

### 步骤 3: 传输到手机

**方法 A: 通过微信/QQ**
1. 在电脑上打开微信/QQ
2. 将 APK 文件发送给自己（文件传输助手）
3. 在手机上打开微信/QQ，下载 APK

**方法 B: 通过邮件**
1. 将 APK 文件作为附件发送到自己的邮箱
2. 在手机上打开邮件，下载 APK

**方法 C: 通过 USB**
1. 用 USB 线连接手机到电脑
2. 将 APK 文件复制到手机存储
3. 在手机上找到 APK 文件

---

### 步骤 4: 在手机上安装

1. 在手机上找到 APK 文件
2. 点击 APK 文件
3. 如果提示「无法安装未知应用」：
   - 点击「设置」
   - 允许从此来源安装应用
   - 返回并重新点击 APK 文件
4. 点击「安装」
5. 等待安装完成（约 10-30 秒）
6. 点击「打开」启动 App

---

## 📱 方法 2: 直接在手机上下载 APK

### 步骤 1: 在手机浏览器中打开链接

在手机的浏览器（Chrome / Safari）中输入或扫描二维码：

```
https://expo.dev/accounts/tsao-jason/projects/yanbao-eas-build/builds/1dcee137-c50e-4e89-992a-83671faf5274
```

---

### 步骤 2: 点击「Install」按钮

在页面中找到 **「Install」** 按钮，点击下载 APK。

---

### 步骤 3: 安装 APK

1. 下载完成后，点击通知栏中的「下载完成」
2. 或在「下载」文件夹中找到 APK 文件
3. 点击 APK 文件
4. 允许安装未知应用（如果提示）
5. 点击「安装」
6. 点击「打开」启动 App

---

## 🔗 方法 3: 使用 Orbit（最快）

### 什么是 Orbit？

Orbit 是 Expo 官方的桌面应用，可以快速安装 EAS Build 构建的 APK。

---

### 步骤 1: 下载 Orbit

访问 https://expo.dev/orbit 下载 Orbit（支持 Windows / Mac）。

---

### 步骤 2: 打开构建页面

在浏览器中打开：

```
https://expo.dev/accounts/tsao-jason/projects/yanbao-eas-build/builds/1dcee137-c50e-4e89-992a-83671faf5274
```

---

### 步骤 3: 点击「Open with Orbit」

在页面中找到 **「Open with Orbit」** 按钮，点击。

---

### 步骤 4: 在 Orbit 中安装

1. Orbit 会自动打开并显示构建信息
2. 连接手机到电脑（USB）
3. 在 Orbit 中点击「Install on device」
4. 等待安装完成

---

## 🎯 快速命令（使用 adb）

如果您已经安装了 Android SDK，可以使用 adb 命令直接安装：

### 步骤 1: 下载 APK

在浏览器中下载 APK 到电脑。

---

### 步骤 2: 连接手机

用 USB 线连接手机到电脑，并启用 USB 调试。

---

### 步骤 3: 安装 APK

```bash
adb install build-1dcee137-c50e-4e89-992a-83671faf5274.apk
```

---

## ⚠️ 注意事项

### 1. APK 可用期限

**13 天**后，此 APK 下载链接将失效。如需长期使用，请：
- 下载并保存 APK 到本地
- 或重新构建新的 APK

---

### 2. 安装未知应用

Android 系统默认不允许安装非 Google Play 的应用，首次安装时需要：
1. 允许从此来源安装应用
2. 这是正常的安全提示，不影响使用

---

### 3. 版本更新

如果您修改了代码并重新构建，需要：
1. 卸载旧版本 APK
2. 安装新版本 APK
3. 或确保新版本的 `versionCode` 更高

---

## ✅ 安装后测试清单

安装完成后，请测试以下功能：

- [ ] App 启动正常，显示库洛米紫色启动页
- [ ] 首页显示 7 大模块入口
- [ ] 底部导航栏切换流畅
- [ ] 相机模块可以打开取景框
- [ ] 点击紫色心形按钮可以保存雁宝记忆
- [ ] 相册模块显示 2.5 列照片网格
- [ ] 编辑模块可以裁剪照片（9:16 比例）
- [ ] 设定模块显示 KuromiQueen 用户卡
- [ ] 所有页面主题颜色一致（#1A0B2E + #E879F9）

---

## 🔄 重新构建 APK

如果需要重新构建（例如修改了代码），运行：

### 预览版本（测试用）

```bash
eas build --platform android --profile preview
```

---

### 生产版本（发布用）

```bash
eas build --platform android --profile production
```

---

## 📞 获取帮助

如果遇到问题：

1. **下载失败**: 检查网络连接，或使用 VPN
2. **安装失败**: 确保允许安装未知应用
3. **App 闪退**: 查看 Logcat 日志，或重新构建
4. **功能异常**: 检查代码，或查看 EAS Build 日志

---

## 🎉 恭喜！

您现在可以直接下载并安装 yanbao AI APK 了！

**一键下载链接**:
```
https://expo.dev/accounts/tsao-jason/projects/yanbao-eas-build/builds/1dcee137-c50e-4e89-992a-83671faf5274
```

点击页面中的 **「Install」** 按钮，即可下载 APK！

---

**制作者**: Jason Tsao  
**版本**: 2.1.1 (1)  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

祝您使用愉快！💜
