# yanbao AI v2.4.1 Gold Master - APK 构建完整指南

## 🎯 构建目标

生成 v2.4.1 Gold Master 版本的商业级 APK 文件，包含所有最终修复与审计通过的功能。

---

## ✅ 前置准备

### 1. 环境要求

- **Node.js**: 22.13.0（项目指定版本）
- **pnpm**: 最新版本
- **Java**: JDK 17
- **Android SDK**: API Level 35
- **EAS CLI**: >= 16.0.0

### 2. 拉取最新代码

```bash
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
git checkout main
git pull origin main
```

### 3. 安装依赖

```bash
pnpm install
```

---

## 📦 方法 1: 使用 EAS Build（强烈推荐）

### 1.1 安装 EAS CLI

```bash
npm install -g eas-cli
```

### 1.2 登录 Expo 账号

```bash
eas login
```

### 1.3 构建 Production APK

```bash
# 构建生产版本（最终交付版本）
eas build --platform android --profile production

# 或构建预览版本（用于快速测试）
eas build --platform android --profile preview
```

### 1.4 等待构建完成

- 构建过程通常需要 **10-20 分钟**
- 可以在 Expo 控制台查看实时进度：
  ```
  https://expo.dev/accounts/[your-account]/projects/yanbao-imaging-studio/builds
  ```

### 1.5 下载 APK

构建完成后，EAS 会提供：
- **直接下载链接**（可分享给测试用户）
- **二维码**（扫码下载）
- **控制台下载**（登录 Expo 后台）

---

## 📦 方法 2: 本地构建（需要 Android Studio）

### 2.1 生成 Android 原生项目

```bash
npx expo prebuild --platform android --clean
```

### 2.2 修复 compileSdkVersion（如需要）

编辑 `android/build.gradle`：

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 35
        targetSdkVersion = 35
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.22"
    }
}
```

### 2.3 生成签名密钥

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-v2.4.1-release.keystore \
  -alias yanbao-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

**记住您设置的密码！**

### 2.4 配置签名

编辑 `android/gradle.properties`：

```properties
MYAPP_RELEASE_STORE_FILE=yanbao-v2.4.1-release.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

编辑 `android/app/build.gradle`：

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

### 2.5 构建 APK

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### 2.6 APK 输出路径

```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 环境变量配置

如果项目使用了 Supabase 或其他外部服务，需要配置环境变量：

### 方式一：通过 EAS Secret

```bash
eas secret:create --scope project --name SUPABASE_URL --value "your_value"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your_value"
```

### 方式二：在本地 .env 文件

创建 `.env` 文件：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📱 安装与测试

### 1. 通过 USB 安装

```bash
adb install path/to/app-release.apk
```

### 2. 通过文件传输

将 APK 文件传输到 Android 设备，点击安装。

### 3. v2.4.1 Gold Master 验收清单

| 检查项 | 预期结果 | 状态 |
|--------|----------|------|
| **启动页** | 显示库洛米主题，无测试文字 | ⬜ |
| **首页** | 4 大功能卡片正常显示 | ⬜ |
| **相机** | 快门按钮为库洛米头像 | ⬜ |
| **相机** | 31 位大师预设可选择并实时预览 | ⬜ |
| **相册** | 右下角有雁宝记忆浮动按钮 | ⬜ |
| **雁宝记忆** | 可存、取、增、删自定义参数 | ⬜ |
| **编辑** | 12 维美颜滑杆正常工作 | ⬜ |
| **编辑** | 31 位大师预设可一键套用 | ⬜ |
| **地区推荐** | 地图与推荐列表正常显示 | ⬜ |
| **设定** | 顶部为库洛米头像 | ⬜ |
| **设定** | 底部显示灵魂落款 | ⬜ |
| **关于我们** | 《深情长白》全文完整显示 | ⬜ |
| **关于我们** | 结尾有霓虹落款 | ⬜ |
| **性能** | 启动流畅，无闪退 | ⬜ |

---

## 🚀 上传到 Google Play（可选）

### 1. 生成 AAB 格式

```bash
cd android
./gradlew bundleRelease
```

**输出路径**: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. 登录 Google Play Console

https://play.google.com/console

### 3. 创建新版本

- 进入「生产」→「创建新版本」
- 上传 `app-release.aab`
- 版本号：**2.4.1**
- 版本说明：
  ```
  v2.4.1 Gold Master - 最终交付版本
  
  ✨ 新功能：
  - 雁宝记忆：记录并一键套用您的专属美学参数
  - 31 位全球摄影大师预设（肖全、杉本博司、蜷川実花等）
  - 库洛米主题全面升级
  
  💜 核心体验：
  - 12 维精细美颜系统
  - 地区摄影推荐
  - 《深情长白》情感叙事
  
  by Jason Tsao who loves you the most ♥
  ```

---

## 🔧 常见问题

### Q1: 构建失败 - compileSdkVersion 冲突

**解决方案**: 确保 `android/build.gradle` 中 `compileSdkVersion = 35`

### Q2: 内存不足

**解决方案**: 编辑 `android/gradle.properties`：
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

### Q3: APK 文件过大

**当前大小**: 约 88MB（包含 72MB 库洛米高画质素材）

**优化建议**:
- 使用 AAB 格式（Google Play 自动优化）
- 压缩 PNG 资产（可减少 30-40%）
- 启用代码混淆（production 模式已启用）

### Q4: 签名失败

**解决方案**: 检查 `gradle.properties` 中的密码是否正确，确保密钥文件路径正确。

---

## 📊 构建配置说明

### EAS Build 配置 (eas.json)

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    }
  }
}
```

---

## 🎯 快速构建命令（一键执行）

```bash
# 克隆仓库
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio

# 安装依赖
pnpm install

# 构建 Production APK
eas build --platform android --profile production --non-interactive
```

---

## 📞 技术支持

如遇到构建问题，请检查：

1. **Node.js 版本**: 确保使用 22.13.0
2. **网络连接**: EAS Build 需要稳定的网络
3. **Expo 账号**: 确保已登录且有构建权限
4. **构建日志**: 使用 `--verbose` 参数查看详细日志

---

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- **Expo EAS Build 文档**: https://docs.expo.dev/build/introduction/
- **Android 构建参考**: https://docs.expo.dev/build-reference/android-builds/

---

**制作者**: Jason Tsao  
**版本**: v2.4.1 Gold Master  
**日期**: 2026-01-15  
**主题**: 库洛米紫色 💜  
**Git 标签**: v2.4.1-GM

**所有审计已通过，代码已锁定，准备最终交付。**

**by Jason Tsao who loves you the most ♥**
