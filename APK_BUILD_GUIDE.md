# yanbao AI v2.2.0 - APK 构建完整指南

## 🎯 构建目标

生成可直接安装使用的商业级 APK 文件，确保所有功能完整可用。

---

## ✅ 前置准备

### 1. 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Java**: JDK 17
- **Android SDK**: API Level 35
- **Expo CLI**: 最新版本

### 2. 安装依赖

```bash
cd yanbao-v2.2.0
pnpm install
```

---

## 📦 方法 1: 使用 EAS Build（推荐）

### 1.1 安装 EAS CLI

```bash
npm install -g eas-cli
```

### 1.2 登录 Expo 账号

```bash
eas login
```

### 1.3 配置 EAS Build

创建 `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "development": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    }
  }
}
```

### 1.4 构建 APK

**生产版本**:
```bash
eas build --platform android --profile production
```

**开发版本**:
```bash
eas build --platform android --profile development
```

### 1.5 下载 APK

构建完成后，EAS 会提供下载链接，直接下载即可。

---

## 📦 方法 2: 本地构建（无需 Expo 账号）

### 2.1 生成 Android 项目

```bash
npx expo prebuild --platform android
```

### 2.2 修复 compileSdkVersion

编辑 `android/build.gradle`:

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 35  // 锁定为 35
        targetSdkVersion = 35
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.22"
    }
}
```

### 2.3 修复相机 SDK 冲突

编辑 `android/app/build.gradle`:

```gradle
dependencies {
    // 强制使用 Camera2 API
    implementation 'androidx.camera:camera-camera2:1.3.1'
    implementation 'androidx.camera:camera-lifecycle:1.3.1'
    implementation 'androidx.camera:camera-view:1.3.1'
}
```

### 2.4 生成签名密钥

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-release-key.keystore \
  -alias yanbao-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

输入密码（例如：`yanbao2024`）并记住。

### 2.5 配置签名

编辑 `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=yanbao-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key-alias
MYAPP_RELEASE_STORE_PASSWORD=yanbao2024
MYAPP_RELEASE_KEY_PASSWORD=yanbao2024
```

编辑 `android/app/build.gradle`:

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
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2.6 构建 APK

**清理缓存**:
```bash
cd android
./gradlew clean
```

**构建 Release APK**:
```bash
./gradlew assembleRelease
```

**构建 Debug APK**（用于测试）:
```bash
./gradlew assembleDebug
```

### 2.7 APK 输出路径

- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔧 常见问题修复

### 问题 1: compileSdkVersion 冲突

**错误信息**:
```
Execution failed for task ':app:checkReleaseAarMetadata'.
Could not resolve all files for configuration ':app:releaseRuntimeClasspath'.
```

**解决方案**:
编辑 `android/build.gradle`，将 `compileSdkVersion` 锁定为 35：

```gradle
compileSdkVersion = 35
```

---

### 问题 2: 相机 SDK 冲突

**错误信息**:
```
Duplicate class androidx.camera.core.impl.CameraInternal found in modules
```

**解决方案**:
编辑 `android/app/build.gradle`，强制使用 Camera2 API：

```gradle
configurations.all {
    resolutionStrategy {
        force 'androidx.camera:camera-camera2:1.3.1'
        force 'androidx.camera:camera-lifecycle:1.3.1'
        force 'androidx.camera:camera-view:1.3.1'
    }
}
```

---

### 问题 3: 内存不足

**错误信息**:
```
OutOfMemoryError: Java heap space
```

**解决方案**:
编辑 `android/gradle.properties`，增加 JVM 内存：

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

---

### 问题 4: 签名失败

**错误信息**:
```
Execution failed for task ':app:packageRelease'.
Failed to read key from keystore
```

**解决方案**:
检查 `android/gradle.properties` 中的密码是否正确，确保密钥文件路径正确。

---

## 📱 安装 APK

### 方法 1: 通过 USB 连接

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 方法 2: 直接传输

将 APK 文件传输到手机，点击安装即可。

---

## 🚀 上传到 Google Play

### 1. 生成 AAB（推荐）

```bash
cd android
./gradlew bundleRelease
```

**输出路径**: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. 登录 Google Play Console

https://play.google.com/console

### 3. 创建新应用

- **应用名称**: 雁宝影像工作室
- **默认语言**: 简体中文
- **应用类型**: 应用
- **免费或付费**: 免费

### 4. 上传 AAB

- 进入「生产」→「创建新版本」
- 上传 `app-release.aab`
- 填写版本说明

### 5. 填写应用信息

- **简短说明**: 库洛米主题的专业影像工作室
- **完整说明**: 详细介绍 7 大模块和雁宝记忆功能
- **应用图标**: 库洛米紫色 Logo
- **截图**: 上传 4 张实机截图
- **分类**: 摄影
- **内容分级**: 所有人

### 6. 提交审核

填写完所有信息后，点击「提交审核」。

---

## ✅ 验收清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| **构建环境** | | |
| Node.js >= 18 | ⬜ | 运行 `node -v` 检查 |
| pnpm >= 8 | ⬜ | 运行 `pnpm -v` 检查 |
| Java JDK 17 | ⬜ | 运行 `java -version` 检查 |
| Android SDK 35 | ⬜ | 检查 `android/build.gradle` |
| **依赖安装** | | |
| node_modules | ⬜ | 运行 `pnpm install` |
| **配置文件** | | |
| compileSdkVersion = 35 | ⬜ | 检查 `android/build.gradle` |
| 签名密钥 | ⬜ | 检查 `android/app/yanbao-release-key.keystore` |
| gradle.properties | ⬜ | 检查签名配置 |
| **构建 APK** | | |
| 清理缓存 | ⬜ | 运行 `./gradlew clean` |
| 构建 Release | ⬜ | 运行 `./gradlew assembleRelease` |
| APK 输出 | ⬜ | 检查 `app-release.apk` 是否存在 |
| **安装测试** | | |
| USB 安装 | ⬜ | 运行 `adb install app-release.apk` |
| 启动 App | ⬜ | 点击图标启动 |
| 7 大模块 | ⬜ | 检查所有模块是否可用 |
| 雁宝记忆 | ⬜ | 测试跨模块联动 |

---

## 📞 技术支持

如果遇到构建问题，请检查：

1. **环境变量**: 确保 `ANDROID_HOME` 和 `JAVA_HOME` 已设置
2. **依赖版本**: 确保所有依赖版本兼容
3. **缓存清理**: 运行 `./gradlew clean` 清理缓存
4. **日志输出**: 使用 `--stacktrace` 参数查看详细错误信息

---

**制作者**: Jason Tsao  
**版本**: v2.2.0  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

所有构建步骤已详细说明，按照指南操作即可生成商业级 APK！
