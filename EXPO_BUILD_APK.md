# yanbao AI v2.2.0 - Expo 生成 APK 完整指南

## 🎯 目标

使用 Expo 快速生成可安装的 APK 文件，无需复杂的 Android Studio 配置。

---

## 📋 两种构建方式对比

| 特性 | EAS Build（云端） | 本地构建 |
|------|------------------|----------|
| **难度** | ⭐ 简单 | ⭐⭐⭐ 复杂 |
| **速度** | ⭐⭐⭐ 快速（10-15 分钟） | ⭐⭐ 较慢（首次 20-30 分钟） |
| **环境要求** | 无需 Android SDK | 需要完整 Android 环境 |
| **网络要求** | 需要上传代码 | 完全本地 |
| **免费额度** | 每月 30 次构建 | 无限制 |
| **推荐场景** | 快速测试、发布 | 完全控制、离线构建 |

---

## 方法 1: EAS Build 云端构建（推荐）⭐

### ✅ 优势

- ✅ **简单快速**: 一条命令即可构建
- ✅ **无需环境**: 不需要安装 Android SDK
- ✅ **自动签名**: 自动生成签名密钥
- ✅ **云端构建**: 不占用本地资源

### 📋 前置准备

1. **Expo 账号**（免费注册）
2. **Node.js** >= 18.0.0
3. **pnpm** >= 8.0.0

---

### 第一步：安装 EAS CLI

```bash
npm install -g eas-cli
```

验证安装：

```bash
eas --version
# 应该显示 eas-cli/x.x.x
```

---

### 第二步：登录 Expo 账号

```bash
eas login
```

**如果没有账号**，访问 https://expo.dev/signup 注册（免费）。

输入邮箱和密码登录。

---

### 第三步：配置 EAS Build

#### 3.1 初始化 EAS 配置

```bash
cd yanbao-v2.2.0
eas build:configure
```

这会创建 `eas.json` 配置文件。

---

#### 3.2 编辑 eas.json

确保 `eas.json` 内容如下：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
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

---

### 第四步：构建 APK

#### 4.1 构建生产版本（推荐）

```bash
eas build --platform android --profile production
```

---

#### 4.2 构建预览版本（测试用）

```bash
eas build --platform android --profile preview
```

---

#### 4.3 构建开发版本（调试用）

```bash
eas build --platform android --profile development
```

---

### 第五步：等待构建完成

构建过程：

1. **上传代码** (1-2 分钟)
2. **安装依赖** (3-5 分钟)
3. **编译 APK** (5-10 分钟)
4. **上传 APK** (1-2 分钟)

**总时间**: 10-20 分钟

您可以：
- 关闭终端，构建会在云端继续
- 访问 https://expo.dev/accounts/[your-username]/projects/yanbao-imaging-studio/builds 查看进度

---

### 第六步：下载 APK

构建完成后：

1. 终端会显示下载链接
2. 点击链接下载 APK
3. 或访问 https://expo.dev 查看所有构建

**APK 文件名**: `build-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.apk`

---

### 第七步：安装 APK

**方法 1: 直接在手机上下载**

1. 在手机浏览器中打开下载链接
2. 下载 APK
3. 点击安装

**方法 2: 传输到手机**

1. 在电脑上下载 APK
2. 通过微信/QQ/邮件发送到手机
3. 在手机上点击安装

**方法 3: 通过 USB 安装**

```bash
adb install build-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.apk
```

---

## 方法 2: Expo 本地构建

### ✅ 优势

- ✅ **完全控制**: 所有构建过程在本地
- ✅ **无限构建**: 不受云端额度限制
- ✅ **离线构建**: 不需要上传代码
- ✅ **自定义配置**: 可以修改所有原生配置

### 📋 前置准备

1. **Node.js** >= 18.0.0
2. **pnpm** >= 8.0.0
3. **Java JDK 17**
4. **Android SDK** (API Level 35)

---

### 第一步：生成 Android 项目

```bash
cd yanbao-v2.2.0
npx expo prebuild --platform android --clean
```

这会生成 `android/` 目录。

---

### 第二步：应用配置文件

```bash
# 复制配置文件模板
cp build_configs/build.gradle.template android/build.gradle
cp build_configs/gradle.properties.template android/gradle.properties
cp build_configs/app_build.gradle.template android/app/build.gradle
cp build_configs/proguard-rules.pro android/app/proguard-rules.pro
```

---

### 第三步：生成签名密钥

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-release-key.keystore \
  -alias yanbao-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

输入密码（例如：`yanbao2024`）并记住。

---

### 第四步：配置签名

编辑 `android/gradle.properties`，修改签名配置：

```properties
MYAPP_RELEASE_STORE_FILE=yanbao-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key-alias
MYAPP_RELEASE_STORE_PASSWORD=yanbao2024
MYAPP_RELEASE_KEY_PASSWORD=yanbao2024
```

---

### 第五步：构建 APK

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**Windows 用户**使用：

```bash
gradlew.bat clean
gradlew.bat assembleRelease
```

**预计时间**: 10-20 分钟（首次构建）

---

### 第六步：找到 APK

**输出路径**: `android/app/build/outputs/apk/release/app-release.apk`

---

### 第七步：安装 APK

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 常见问题

### 问题 1: EAS Build 失败（云端构建）

**错误**: `Build failed with error: ...`

**解决方案**:

1. 检查 `app.json` 配置是否正确
2. 确保所有依赖都在 `package.json` 中
3. 查看构建日志：https://expo.dev/accounts/[your-username]/projects/yanbao-imaging-studio/builds
4. 重新构建：
   ```bash
   eas build --platform android --profile production --clear-cache
   ```

---

### 问题 2: 本地构建失败

**错误**: `Execution failed for task ':app:checkReleaseAarMetadata'`

**解决方案**:

1. 确保 `compileSdkVersion = 35` 在 `android/build.gradle` 中
2. 清理缓存：
   ```bash
   cd android
   ./gradlew clean
   ```
3. 重新构建

---

### 问题 3: 签名失败

**错误**: `Failed to read key from keystore`

**解决方案**:

1. 检查 `android/gradle.properties` 中的密码
2. 确保 `yanbao-release-key.keystore` 在 `android/app/` 目录
3. 重新生成密钥（第三步）

---

### 问题 4: EAS Build 额度用完

**错误**: `You've reached your monthly build limit`

**解决方案**:

1. **升级到付费计划**（$29/月，无限构建）
2. **使用本地构建**（方法 2）
3. **等待下个月**（免费额度每月重置）

---

## 📊 构建方式选择建议

### 选择 EAS Build（云端）如果：

- ✅ 您没有 Android 开发环境
- ✅ 您需要快速测试
- ✅ 您每月构建次数 < 30 次
- ✅ 您可以上传代码到云端

### 选择本地构建如果：

- ✅ 您已有 Android 开发环境
- ✅ 您需要完全控制构建过程
- ✅ 您需要频繁构建（> 30 次/月）
- ✅ 您不想上传代码到云端

---

## ✅ 快速命令参考

### EAS Build（云端）

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录
eas login

# 配置
eas build:configure

# 构建生产版本
eas build --platform android --profile production

# 构建预览版本
eas build --platform android --profile preview

# 查看构建历史
eas build:list
```

---

### 本地构建

```bash
# 生成 Android 项目
npx expo prebuild --platform android --clean

# 应用配置文件
cp build_configs/*.template android/

# 生成签名密钥
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-release-key.keystore \
  -alias yanbao-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# 构建 APK
cd android
./gradlew clean
./gradlew assembleRelease

# 安装 APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎉 恭喜！

您现在可以使用 Expo 快速生成 APK 了！

**推荐流程**:
1. **开发阶段**: 使用 `pnpm start` + Expo Go 实时预览
2. **测试阶段**: 使用 EAS Build 生成预览版 APK
3. **发布阶段**: 使用 EAS Build 或本地构建生成生产版 APK

---

**制作者**: Jason Tsao  
**版本**: v2.2.0  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

如需更多帮助，请参考 `LOCAL_BUILD_COMMANDS.md` 和 `APK_BUILD_GUIDE.md`。
