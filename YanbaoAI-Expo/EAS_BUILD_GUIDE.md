# yanbao AI - EAS Build 云端打包指南

**版本**: 1.0.0  
**创建日期**: 2026年1月17日  
**适用对象**: 需要构建真实 APK 的用户

---

## 📋 概述

由于沙盒环境缺少 Android SDK，我们使用 Expo 的 EAS Build 云端打包服务来构建真实的 APK 文件。

---

## 🚀 快速开始

### 1. 登录 Expo 账号

```bash
cd /home/ubuntu/yanbao-imaging-studio/YanbaoAI-Expo
eas login
```

**如果没有账号**:
- 访问 https://expo.dev/signup
- 注册免费账号
- 返回终端登录

---

### 2. 配置项目

```bash
# 初始化 EAS Build
eas build:configure
```

这将创建 `eas.json` 配置文件（已创建）。

---

### 3. 构建 APK

```bash
# 构建 Preview APK（推荐，快速）
eas build --platform android --profile preview

# 或构建 Production APK（完整优化）
eas build --platform android --profile production
```

**构建过程**:
1. 上传项目代码到 Expo 云端
2. 在云端服务器上构建 APK
3. 构建完成后提供下载链接

**预计时间**: 10-20 分钟

---

### 4. 下载 APK

构建完成后，EAS 会提供下载链接：

```
✅ Build finished!

Download URL: https://expo.dev/accounts/[username]/projects/yanbao-ai/builds/[build-id]
```

点击链接下载 APK 文件。

---

## 📦 构建配置

### eas.json 配置说明

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"  // 构建 APK 而非 AAB
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**配置说明**:
- `preview`: 预览版本，快速构建
- `production`: 生产版本，完整优化
- `buildType: "apk"`: 构建 APK 文件（而非 AAB）

---

## 🔐 签名配置

### 自动签名（推荐）

EAS Build 会自动生成签名密钥：

```bash
eas build --platform android --profile production
```

### 手动签名

如果需要使用自己的签名密钥：

1. 创建密钥库：
```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore yanbao-ai-release.keystore \
  -alias yanbao-ai \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

2. 上传到 EAS：
```bash
eas credentials
```

3. 选择 "Use existing keystore"

---

## 📊 构建状态

### 查看构建状态

```bash
# 查看所有构建
eas build:list

# 查看特定构建
eas build:view [build-id]
```

### 构建日志

```bash
# 查看构建日志
eas build:view [build-id] --logs
```

---

## 🧪 测试 APK

### 下载并安装

```bash
# 下载 APK
wget [download-url] -O yanbao-ai-v1.0.0.apk

# 安装到设备
adb install yanbao-ai-v1.0.0.apk
```

### 启动应用

```bash
# 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 查看日志
adb logcat | grep yanbao
```

---

## 💡 常见问题

### Q1: 构建失败怎么办？

**A**: 查看构建日志：
```bash
eas build:view [build-id] --logs
```

常见原因：
- 依赖版本冲突
- 配置错误
- 网络问题

### Q2: 构建时间太长？

**A**: 使用 `preview` 配置：
```bash
eas build --platform android --profile preview
```

### Q3: 如何获取构建 ID？

**A**: 构建开始后会显示：
```
Build ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

或使用：
```bash
eas build:list
```

### Q4: 免费账号有限制吗？

**A**: Expo 免费账号限制：
- 每月 30 次构建
- 构建队列优先级较低
- 无法使用自定义构建服务器

---

## 🎯 推荐流程

### 第一次构建

1. ✅ 登录 Expo 账号
2. ✅ 使用 `preview` 配置快速构建
3. ✅ 下载并测试 APK
4. ✅ 如果满意，使用 `production` 配置构建最终版本

### 命令示例

```bash
# 1. 登录
cd /home/ubuntu/yanbao-imaging-studio/YanbaoAI-Expo
eas login

# 2. 构建 Preview APK
eas build --platform android --profile preview

# 3. 等待构建完成（10-20 分钟）
# 4. 下载 APK
# 5. 测试 APK

# 6. 构建 Production APK
eas build --platform android --profile production

# 7. 下载最终 APK
```

---

## 📱 APK 信息

构建完成后的 APK 信息：

| 项目 | 值 |
|------|-----|
| **应用名称** | yanbao AI |
| **包名** | com.yanbaoai |
| **版本号** | 1.0.0 |
| **版本代码** | 1 |
| **最小 SDK** | 21 (Android 5.0) |
| **目标 SDK** | 34 (Android 14) |
| **APK 大小** | ~20-30 MB |
| **签名状态** | 已签名 |

---

## 🎉 总结

### ✅ EAS Build 优势

1. ✅ 无需本地 Android SDK
2. ✅ 云端自动构建
3. ✅ 自动签名
4. ✅ 构建日志完整
5. ✅ 支持多平台（Android + iOS）

### 📝 注意事项

1. ⚠️ 需要 Expo 账号
2. ⚠️ 构建需要 10-20 分钟
3. ⚠️ 免费账号每月 30 次构建限制
4. ⚠️ 需要网络连接

---

**使用 EAS Build 构建真实的 yanbao AI APK！** 🚀

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
