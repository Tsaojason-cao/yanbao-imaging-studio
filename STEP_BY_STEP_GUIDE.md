# yanbao AI v2.2.0 - 逐步操作指南（从零到 APK）

## 🎯 目标

从零开始，在本地环境中构建出可安装的 APK 文件。

**预计总时间**: 30-45 分钟（首次构建）

---

## 📋 准备工作

### ✅ 检查清单

在开始之前，请确保您已准备好：

- [ ] 一台 Windows/Mac/Linux 电脑
- [ ] 稳定的网络连接
- [ ] 至少 10 GB 可用磁盘空间
- [ ] 已下载 `yanbao_Full_Source.zip` 文件

---

## 第一步：安装环境（15-20 分钟）

### 1.1 安装 Node.js

**Windows/Mac**:
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或 20.x）
3. 运行安装程序，一路点击「下一步」
4. 安装完成后，打开命令行/终端，运行：

```bash
node -v
# 应该显示 v18.x.x 或 v20.x.x
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

### 1.2 安装 pnpm

```bash
npm install -g pnpm
```

验证安装：

```bash
pnpm -v
# 应该显示 8.x.x 或更高
```

---

### 1.3 安装 Java JDK 17

**Windows**:
1. 访问 https://adoptium.net/
2. 下载 JDK 17 (LTS)
3. 运行安装程序
4. 安装完成后，设置环境变量：
   - 右键「此电脑」→「属性」→「高级系统设置」→「环境变量」
   - 新建系统变量 `JAVA_HOME`，值为 `C:\Program Files\Eclipse Adoptium\jdk-17.0.x`
   - 编辑 `Path` 变量，添加 `%JAVA_HOME%\bin`

**Mac**:
```bash
brew install openjdk@17
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install openjdk-17-jdk
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

验证安装：

```bash
java -version
# 应该显示 openjdk version "17.x.x"
```

---

### 1.4 安装 Android Studio 和 Android SDK

**所有平台**:

1. 访问 https://developer.android.com/studio
2. 下载 Android Studio
3. 运行安装程序
4. 首次启动时，选择「Custom」安装
5. 确保勾选：
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
6. 安装完成后，打开 Android Studio
7. 进入 `Settings` (Windows/Linux) 或 `Preferences` (Mac)
8. 导航到 `Appearance & Behavior` → `System Settings` → `Android SDK`
9. 在 `SDK Platforms` 标签页中，勾选：
   - Android 14.0 (API Level 35)
10. 在 `SDK Tools` 标签页中，勾选：
    - Android SDK Build-Tools 34.0.0
    - Android SDK Command-line Tools
    - Android Emulator
    - Android SDK Platform-Tools
11. 点击「Apply」开始下载和安装

---

### 1.5 设置 ANDROID_HOME 环境变量

**Windows**:
1. 右键「此电脑」→「属性」→「高级系统设置」→「环境变量」
2. 新建系统变量 `ANDROID_HOME`，值为：
   ```
   C:\Users\YourName\AppData\Local\Android\Sdk
   ```
3. 编辑 `Path` 变量，添加：
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

**Mac**:
```bash
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

**Linux**:
```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

验证安装：

```bash
echo $ANDROID_HOME
# 应该显示 Android SDK 路径

adb version
# 应该显示 Android Debug Bridge version
```

---

## 第二步：解压源码（1 分钟）

### 2.1 解压 ZIP 文件

**Windows**:
1. 右键 `yanbao_Full_Source.zip`
2. 选择「解压到 yanbao-v2.2.0\」
3. 解压完成后，进入目录

**Mac/Linux**:
```bash
unzip yanbao_Full_Source.zip
cd yanbao-v2.2.0
```

---

## 第三步：安装依赖（3-5 分钟）

### 3.1 安装 Node.js 依赖

```bash
cd yanbao-v2.2.0
pnpm install
```

**说明**: 这会下载所有 React Native 和 Expo 依赖包。

**预计时间**: 3-5 分钟（取决于网络速度）

---

## 第四步：生成 Android 项目（2-3 分钟）

### 4.1 运行 prebuild

```bash
npx expo prebuild --platform android --clean
```

**说明**: 这会生成 `android/` 目录，包含所有原生 Android 代码。

**预计时间**: 2-3 分钟

---

## 第五步：应用配置文件（2 分钟）

### 5.1 复制配置文件

**方法 1: 手动复制**

1. 将 `build_configs/build.gradle.template` 复制到 `android/build.gradle`
2. 将 `build_configs/gradle.properties.template` 复制到 `android/gradle.properties`
3. 将 `build_configs/app_build.gradle.template` 复制到 `android/app/build.gradle`
4. 将 `build_configs/proguard-rules.pro` 复制到 `android/app/proguard-rules.pro`

**方法 2: 使用命令行**

**Windows (PowerShell)**:
```powershell
Copy-Item build_configs\build.gradle.template android\build.gradle
Copy-Item build_configs\gradle.properties.template android\gradle.properties
Copy-Item build_configs\app_build.gradle.template android\app\build.gradle
Copy-Item build_configs\proguard-rules.pro android\app\proguard-rules.pro
```

**Mac/Linux**:
```bash
cp build_configs/build.gradle.template android/build.gradle
cp build_configs/gradle.properties.template android/gradle.properties
cp build_configs/app_build.gradle.template android/app/build.gradle
cp build_configs/proguard-rules.pro android/app/proguard-rules.pro
```

---

## 第六步：生成签名密钥（2 分钟）

### 6.1 生成密钥文件

**所有平台**:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore yanbao-release-key.keystore \
  -alias yanbao-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

**提示**:
1. 输入密钥库口令（例如：`yanbao2024`）
2. 再次输入以确认
3. 输入您的姓名（可以按 Enter 跳过）
4. 输入您的组织单位（可以按 Enter 跳过）
5. 输入您的组织名称（可以按 Enter 跳过）
6. 输入您所在的城市（可以按 Enter 跳过）
7. 输入您所在的省份（可以按 Enter 跳过）
8. 输入两字母国家代码（例如：CN，可以按 Enter 跳过）
9. 确认信息正确（输入 `yes`）

**重要**: 记住您设置的密码！

---

### 6.2 修改签名配置

编辑 `android/gradle.properties`，找到签名配置部分，修改密码：

```properties
MYAPP_RELEASE_STORE_FILE=yanbao-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key-alias
MYAPP_RELEASE_STORE_PASSWORD=yanbao2024  # 修改为您的密码
MYAPP_RELEASE_KEY_PASSWORD=yanbao2024    # 修改为您的密码
```

---

## 第七步：构建 APK（10-15 分钟）

### 7.1 清理缓存

```bash
cd android
./gradlew clean
```

**Windows 用户**使用：

```bash
gradlew.bat clean
```

**预计时间**: 1 分钟

---

### 7.2 构建 Debug APK（测试用）

```bash
./gradlew assembleDebug
```

**Windows 用户**使用：

```bash
gradlew.bat assembleDebug
```

**预计时间**: 5-10 分钟（首次构建）

**输出路径**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

### 7.3 构建 Release APK（生产用）

```bash
./gradlew assembleRelease
```

**Windows 用户**使用：

```bash
gradlew.bat assembleRelease
```

**预计时间**: 10-15 分钟（首次构建）

**输出路径**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 第八步：安装 APK（2 分钟）

### 8.1 通过 USB 安装

**准备工作**:
1. 在手机上启用「开发者选项」
   - 进入「设置」→「关于手机」
   - 连续点击「版本号」7 次
2. 启用「USB 调试」
   - 进入「设置」→「开发者选项」
   - 打开「USB 调试」
3. 用 USB 线连接手机到电脑
4. 在手机上允许 USB 调试

**安装命令**:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

**预计时间**: 30 秒

---

### 8.2 直接传输安装

**步骤**:
1. 将 `app-release.apk` 文件传输到手机
   - 通过微信/QQ 发送给自己
   - 通过邮件发送
   - 通过 USB 复制到手机存储
2. 在手机上找到 APK 文件
3. 点击 APK 文件
4. 允许安装未知来源应用（如果提示）
5. 点击「安装」

**预计时间**: 1-2 分钟

---

## ✅ 验收测试

### 测试清单

安装完成后，请测试以下功能：

- [ ] App 启动正常，显示库洛米紫色启动页
- [ ] 首页显示 7 大模块入口和 Jason Tsao 签名
- [ ] 相机模块可以正常打开取景框
- [ ] 点击紫色心形按钮可以保存雁宝记忆
- [ ] 相册模块显示 2.5 列照片网格
- [ ] 编辑模块可以裁剪照片（9:16 比例）
- [ ] 设定模块显示 KuromiQueen 用户卡
- [ ] 所有模块切换流畅，无崩溃

---

## 🔧 常见问题

### 问题 1: `ANDROID_HOME` 未设置

**症状**: 运行 `./gradlew` 时提示找不到 Android SDK

**解决方案**: 按照第一步 1.5 设置 `ANDROID_HOME` 环境变量

---

### 问题 2: 构建失败（内存不足）

**症状**: 构建过程中提示 `OutOfMemoryError`

**解决方案**: 
1. 编辑 `android/gradle.properties`
2. 增加内存：
   ```properties
   org.gradle.jvmargs=-Xmx8192m -XX:MaxPermSize=1024m
   ```

---

### 问题 3: 签名失败

**症状**: 构建 Release APK 时提示签名错误

**解决方案**:
1. 检查 `android/gradle.properties` 中的密码是否正确
2. 确保 `yanbao-release-key.keystore` 文件在 `android/app/` 目录下
3. 如果仍然失败，重新生成密钥（第六步）

---

### 问题 4: ADB 找不到设备

**症状**: 运行 `adb install` 时提示 `no devices/emulators found`

**解决方案**:
1. 检查 USB 线是否连接正常
2. 在手机上重新允许 USB 调试
3. 运行 `adb devices` 查看设备列表
4. 如果设备显示为 `unauthorized`，在手机上点击「允许」

---

## 🎉 恭喜！

如果您成功完成所有步骤，您现在拥有一个可以安装使用的 yanbao AI APK 文件！

---

**制作者**: Jason Tsao  
**版本**: v2.2.0  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

如有任何问题，请参考 `LOCAL_BUILD_COMMANDS.md` 和 `APK_BUILD_GUIDE.md` 获取更多帮助。
