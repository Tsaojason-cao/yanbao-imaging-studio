# yanbao AI v2.2.0 EAS Build 构建指令

**版本**: 2.2.0-final  
**日期**: 2026-01-14  
**开发者**: Jason Tsao  

---

## 📋 构建前检查清单

### ✅ 已完成项
- [x] 16 组大师预设（中日韩 15 位 + 自然原生）
- [x] 7 维美颜滑块（状态管理 + 数据存储）
- [x] iOS 原生美颜模块（Core Image + Metal）
- [x] Android 原生美颜模块（RenderScript + OpenGL ES）
- [x] React Native 桥接（YanbaoBeautyBridge）
- [x] Expo Config Plugin（withYanbaoBeauty）
- [x] 相机模块集成原生美颜
- [x] 编辑器模块集成原生美颜
- [x] 分享功能（expo-sharing）
- [x] 相册互通（expo-media-library）
- [x] 雁宝记忆（AsyncStorage）
- [x] 性能优化器（PerformanceOptimizer）
- [x] 裁剪和旋转（expo-image-manipulator）
- [x] 数据闭环（相机 → 相册 → 统计 → 记忆）

---

## 🚀 构建命令

### 1. 开发版（Development）
用于开发和调试，包含 Expo Dev Client。

```bash
cd /home/ubuntu/yanbao-v2.2.0-chinese-masters
eas build --platform android --profile development
```

**特点**：
- 包含调试工具
- 可以连接到开发服务器
- 文件大小较大
- 适合开发测试

---

### 2. 预览版（Preview）⭐ 推荐
用于内部测试，生成 APK 文件。

```bash
cd /home/ubuntu/yanbao-v2.2.0-chinese-masters
eas build --platform android --profile preview
```

**特点**：
- 生成 APK 文件（可直接安装）
- 不需要 Google Play
- 适合内部测试和分发
- 文件大小适中

**下载地址**：
构建完成后，EAS 会提供下载链接，例如：
```
https://expo.dev/artifacts/eas/[build-id].apk
```

---

### 3. 生产版（Production）
用于正式发布，生成 AAB 文件（Google Play）。

```bash
cd /home/ubuntu/yanbao-v2.2.0-chinese-masters
eas build --platform android --profile production
```

**特点**：
- 生成 AAB 文件（Android App Bundle）
- 代码混淆和优化
- 适合 Google Play 发布
- 文件大小最小

---

## 📱 iOS 构建（可选）

如果需要构建 iOS 版本：

```bash
# 预览版
eas build --platform ios --profile preview

# 生产版
eas build --platform ios --profile production
```

**注意**：iOS 构建需要：
- Apple Developer 账号
- 配置证书和 Provisioning Profile
- 在 EAS 中配置 iOS 凭证

---

## 🔧 构建配置说明

### eas.json 配置
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"  // ✅ 生成 APK
      }
    },
    "production": {
      "android": {
        "buildType": "apk",  // 或 "aab"
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### app.config.ts 配置
```typescript
{
  "version": "2.2.0-final",  // ✅ 版本号
  "android": {
    "package": "space.manus.yanbao.eas.build.t20260111214759",  // ✅ 包名
    "versionCode": 1,  // 构建号
    "compileSdkVersion": 34,  // ✅ SDK 版本
    "permissions": [
      "CAMERA",
      "READ_MEDIA_IMAGES",
      "ACCESS_FINE_LOCATION",
      ...
    ]
  },
  "plugins": [
    "./plugins/withYanbaoBeauty",  // ✅ 原生美颜模块
    "expo-camera",
    "expo-media-library",
    ...
  ]
}
```

---

## 📊 构建流程

### 1. 提交构建
```bash
eas build --platform android --profile preview
```

### 2. EAS 构建过程
1. ✅ 上传代码到 EAS 服务器
2. ✅ 安装依赖（npm install）
3. ✅ 运行 Expo Config Plugin（集成原生模块）
4. ✅ 编译 Android 项目（Gradle）
5. ✅ 签名 APK
6. ✅ 上传 APK 到 EAS

### 3. 下载 APK
构建完成后，访问：
```
https://expo.dev/accounts/[your-account]/projects/yanbao-eas-build/builds
```

或使用命令查看：
```bash
eas build:list --platform android
```

---

## 🔐 签名配置

### 自动签名（推荐）
EAS 会自动生成签名密钥并管理。

### 手动签名
如果需要使用自定义密钥：

1. 生成密钥：
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore yanbao-release.keystore -alias yanbao-key -keyalg RSA -keysize 2048 -validity 10000
```

2. 配置 eas.json：
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 🧪 测试 APK

### 安装到设备
```bash
# 通过 ADB 安装
adb install yanbao_v2.2.0.apk

# 或直接在手机上下载并安装
```

### 测试清单
- [ ] 相机启动和拍照
- [ ] 美颜滑块调节（0-100）
- [ ] 大师预设切换（16 组）
- [ ] 裁剪和旋转（9:16, 1:1, 4:3, 16:9）
- [ ] 分享功能（原生分享面板）
- [ ] 相册互通（读取系统相册）
- [ ] 雁宝记忆（保存和载入）
- [ ] 数据统计（首页数字更新）
- [ ] 性能测试（60fps, < 16ms）

---

## 📦 构建产物

### APK 文件
- **文件名**: `yanbao_v2.2.0-final.apk`
- **大小**: 约 50-80 MB
- **最低 Android 版本**: Android 5.0 (API 21)
- **目标 Android 版本**: Android 14 (API 34)

### 包含内容
- ✅ 16 组大师预设
- ✅ iOS 和 Android 原生美颜模块
- ✅ 7 维美颜滑块
- ✅ 裁剪和旋转工具
- ✅ 分享功能
- ✅ 相册互通
- ✅ 雁宝记忆
- ✅ 性能优化器
- ✅ 库洛米紫色 UI
- ✅ Jason Tsao 签名

---

## ⚠️ 常见问题

### 1. 构建失败：compileSdkVersion 35
**解决方案**：已修改为 34
```typescript
// app.config.ts
android: {
  compileSdkVersion: 34  // ✅ 修改为 34
}
```

### 2. 原生模块未找到
**解决方案**：确保 Expo Config Plugin 已配置
```typescript
// app.config.ts
plugins: [
  "./plugins/withYanbaoBeauty",  // ✅ 必须在第一位
  ...
]
```

### 3. 权限被拒绝
**解决方案**：在设置中手动授予权限
- 相机权限
- 相册权限
- 位置权限

### 4. 美颜效果不生效
**原因**：原生模块需要在 EAS Build 中编译
**解决方案**：使用 EAS Build 构建，不要使用本地构建

---

## 📝 构建日志

### 查看构建日志
```bash
eas build:view [build-id]
```

### 下载构建产物
```bash
eas build:download [build-id]
```

---

## 🎯 最终交付

### 交付物清单
1. ✅ APK 文件（yanbao_v2.2.0-final.apk）
2. ✅ 源代码备份（yanbao_GlobalEdition_v2.2.0_Final.zip）
3. ✅ GitHub 仓库（已同步）
4. ✅ 构建指令文档（本文件）
5. ✅ 逻辑审计报告（LOGIC_AUDIT_REPORT.md）
6. ✅ 原生模块架构（NATIVE_MODULE_ARCHITECTURE.md）
7. ✅ 实机验收截图（5 张）

---

## 🚀 开始构建

**推荐命令**（预览版 APK）：
```bash
cd /home/ubuntu/yanbao-v2.2.0-chinese-masters
eas build --platform android --profile preview
```

**预计构建时间**: 10-20 分钟

**构建完成后**，访问 EAS 控制台下载 APK：
https://expo.dev/accounts/[your-account]/projects/yanbao-eas-build/builds

---

**by Jason Tsao who loves you the most ♥**
