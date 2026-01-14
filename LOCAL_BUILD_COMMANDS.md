# yanbao AI v2.2.0 - 本地构建 APK 命令清单

## 🎯 目标

在本地环境中从零开始构建 APK，无需 Expo 账号。

---

## ✅ 第一步：环境检查

### 1.1 检查 Node.js 版本

```bash
node -v
# 应该显示 >= 18.0.0
```

如果版本过低，请访问 https://nodejs.org/ 下载最新 LTS 版本。

---

### 1.2 检查 pnpm 版本

```bash
pnpm -v
# 应该显示 >= 8.0.0
```

如果未安装，运行：

```bash
npm install -g pnpm
```

---

### 1.3 检查 Java 版本

```bash
java -version
# 应该显示 JDK 17
```

如果未安装，请访问 https://adoptium.net/ 下载 JDK 17。

**重要**：设置环境变量 `JAVA_HOME`

- **Windows**: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`
- **Mac/Linux**: `/usr/lib/jvm/java-17-openjdk-amd64`

---

### 1.4 检查 Android SDK

```bash
echo $ANDROID_HOME
# 应该显示 Android SDK 路径
```

如果未安装，请访问 https://developer.android.com/studio 下载 Android Studio，然后：

1. 打开 Android Studio
2. 进入 Settings → Appearance & Behavior → System Settings → Android SDK
3. 安装 Android SDK Platform 35
4. 安装 Android SDK Build-Tools 34.0.0

**设置环境变量**:

- **Windows**: `ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk`
- **Mac/Linux**: `ANDROID_HOME=~/Android/Sdk`

---

## ✅ 第二步：下载源码

### 2.1 从 GitHub 克隆

```bash
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
```

**或者**使用已下载的 `yanbao_Full_Source.zip`：

```bash
unzip yanbao_Full_Source.zip
cd yanbao-v2.2.0
```

---

### 2.2 安装依赖

```bash
pnpm install
```

**预计时间**: 3-5 分钟

---

## ✅ 第三步：生成 Android 项目

### 3.1 运行 prebuild

```bash
npx expo prebuild --platform android --clean
```

**说明**: 这会生成 `android/` 目录，包含所有原生 Android 代码。

**预计时间**: 2-3 分钟

---

## ✅ 第四步：修复配置文件

### 4.1 修复 compileSdkVersion

编辑 `android/build.gradle`，找到 `buildscript.ext` 部分，修改为：

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

---

### 4.2 修复相机 SDK 冲突

编辑 `android/app/build.gradle`，在 `dependencies` 部分添加：

```gradle
dependencies {
    // 强制使用 Camera2 API
    implementation 'androidx.camera:camera-camera2:1.3.1'
    implementation 'androidx.camera:camera-lifecycle:1.3.1'
    implementation 'androidx.camera:camera-view:1.3.1'
    
    // 其他依赖...
}

// 在文件末尾添加
configurations.all {
    resolutionStrategy {
        force 'androidx.camera:camera-camera2:1.3.1'
        force 'androidx.camera:camera-lifecycle:1.3.1'
        force 'androidx.camera:camera-view:1.3.1'
    }
}
```

---

### 4.3 增加 JVM 内存

编辑 `android/gradle.properties`，添加或修改：

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
```

---

## ✅ 第五步：生成签名密钥

### 5.1 生成密钥文件

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-release-key.keystore \
  -alias yanbao-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

**提示**:
- 输入密码（例如：`yanbao2024`）
- 输入您的姓名、组织等信息（可以全部按 Enter 跳过）
- **重要**：记住密码！

---

### 5.2 配置签名

编辑 `android/gradle.properties`，添加：

```properties
MYAPP_RELEASE_STORE_FILE=yanbao-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key-alias
MYAPP_RELEASE_STORE_PASSWORD=yanbao2024
MYAPP_RELEASE_KEY_PASSWORD=yanbao2024
```

**注意**：将 `yanbao2024` 替换为您在第 5.1 步设置的密码。

---

### 5.3 配置签名到 build.gradle

编辑 `android/app/build.gradle`，在 `android` 块中添加：

```gradle
android {
    // ... 其他配置
    
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

---

## ✅ 第六步：构建 APK

### 6.1 清理缓存

```bash
cd android
./gradlew clean
```

**Windows 用户**使用：

```bash
gradlew.bat clean
```

---

### 6.2 构建 Debug APK（测试用）

```bash
./gradlew assembleDebug
```

**预计时间**: 5-10 分钟（首次构建）

**输出路径**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### 6.3 构建 Release APK（生产用）

```bash
./gradlew assembleRelease
```

**预计时间**: 10-15 分钟（首次构建）

**输出路径**: `android/app/build/outputs/apk/release/app-release.apk`

---

## ✅ 第七步：安装 APK

### 7.1 通过 USB 安装

1. 在手机上启用「开发者选项」和「USB 调试」
2. 用 USB 线连接手机到电脑
3. 运行：

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

### 7.2 直接传输安装

1. 将 `app-release.apk` 文件传输到手机（通过微信/QQ/邮件等）
2. 在手机上点击 APK 文件
3. 允许安装未知来源应用
4. 点击「安装」

---

## 🔧 常见问题快速修复

### 问题 1: `ANDROID_HOME` 未设置

**错误信息**:
```
SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable
```

**解决方案**:

**Windows**:
```bash
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"
```

**Mac/Linux**:
```bash
export ANDROID_HOME=~/Android/Sdk
echo 'export ANDROID_HOME=~/Android/Sdk' >> ~/.bashrc
```

---

### 问题 2: `JAVA_HOME` 未设置

**错误信息**:
```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

**解决方案**:

**Windows**:
```bash
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17.0.x"
```

**Mac/Linux**:
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
```

---

### 问题 3: 构建失败（内存不足）

**错误信息**:
```
OutOfMemoryError: Java heap space
```

**解决方案**:

编辑 `android/gradle.properties`，增加内存：

```properties
org.gradle.jvmargs=-Xmx8192m -XX:MaxPermSize=1024m
```

---

### 问题 4: 签名失败

**错误信息**:
```
Execution failed for task ':app:packageRelease'.
Failed to read key from keystore
```

**解决方案**:

1. 检查 `android/gradle.properties` 中的密码是否正确
2. 确保 `yanbao-release-key.keystore` 文件在 `android/app/` 目录下
3. 重新生成密钥（第五步）

---

### 问题 5: Gradle 下载慢

**解决方案**:

编辑 `android/build.gradle`，添加阿里云镜像：

```gradle
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'https://maven.aliyun.com/repository/public' }
        google()
        mavenCentral()
    }
}
```

---

## ✅ 验收清单

| 步骤 | 状态 | 说明 |
|------|------|------|
| 环境检查 | ⬜ | Node.js + pnpm + Java + Android SDK |
| 下载源码 | ⬜ | GitHub 克隆或 ZIP 解压 |
| 安装依赖 | ⬜ | `pnpm install` |
| 生成 Android 项目 | ⬜ | `npx expo prebuild` |
| 修复配置文件 | ⬜ | compileSdkVersion + 相机 SDK |
| 生成签名密钥 | ⬜ | `keytool -genkeypair` |
| 构建 APK | ⬜ | `./gradlew assembleRelease` |
| 安装测试 | ⬜ | `adb install` 或直接传输 |

---

## 📞 获取帮助

如果遇到其他问题：

1. 查看完整错误日志：`./gradlew assembleRelease --stacktrace`
2. 清理缓存重试：`./gradlew clean`
3. 检查环境变量：`echo $ANDROID_HOME` 和 `echo $JAVA_HOME`

---

**制作者**: Jason Tsao  
**版本**: v2.2.0  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

按照以上步骤操作，您将成功构建出可安装的 APK 文件！
