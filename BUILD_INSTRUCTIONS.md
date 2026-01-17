# 雁宝 AI APK 构建说明

## 📦 当前提供的 APK

**文件名**: `yanbao-ai-complete.apk`  
**大小**: 54 MB  
**版本**: 1.0.0  
**包名**: com.yanbao.ai.pro

### 功能说明

这个 APK 包含了雁宝 AI 移动应用的完整功能框架：

#### ✅ 已实现功能
1. **首页导航** - 四大功能模块入口（相机、相册、编辑、地区推荐）
2. **数据统计** - 编辑次数、存储使用、配方数量、收藏照片统计
3. **底部导航栏** - 快速切换功能模块
4. **权限管理** - 相机和相册权限请求
5. **图片选择** - 从相册选择照片
6. **UI 设计** - 库洛米主题，赛博朋克风格

#### 🚧 待完善功能
1. **相机功能** - 实时美颜、滤镜预览
2. **照片编辑** - 滤镜应用、参数调节、配方保存
3. **地图推荐** - 上海拍摄地点地图展示
4. **数据持久化** - 本地存储和云同步

## 🔨 本地重新构建 APK

### 前置要求

1. **安装 Node.js 22+**
   ```bash
   # 下载并安装 Node.js
   https://nodejs.org/
   ```

2. **安装 pnpm**
   ```bash
   npm install -g pnpm
   ```

3. **安装 Java 17**
   ```bash
   # Windows: 下载并安装 OpenJDK 17
   https://adoptium.net/
   
   # 设置环境变量 JAVA_HOME
   ```

4. **安装 Android Studio**
   ```bash
   # 下载并安装 Android Studio
   https://developer.android.com/studio
   
   # 安装 Android SDK
   # 设置环境变量 ANDROID_HOME
   ```

### 构建步骤

#### 方法一：使用 Expo EAS Build（推荐，云端构建）

```bash
# 1. 克隆项目
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio

# 2. 安装依赖
pnpm install

# 3. 安装 EAS CLI
npm install -g eas-cli

# 4. 登录 Expo 账号（需要注册 expo.dev 账号）
eas login

# 5. 构建 APK
eas build --platform android --profile production

# 6. 等待云端构建完成，下载 APK
```

**优点**：
- 无需本地配置 Android 环境
- 构建速度快
- 自动处理依赖和签名

#### 方法二：本地构建

```bash
# 1. 克隆项目
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio

# 2. 安装依赖
pnpm install

# 3. 生成 Android 原生项目
npx expo prebuild --platform android

# 4. 进入 Android 目录
cd android

# 5. 构建 Release APK
# Windows:
gradlew assembleRelease

# macOS/Linux:
./gradlew assembleRelease

# 6. APK 输出路径
# android/app/build/outputs/apk/release/app-release.apk
```

**优点**：
- 完全本地控制
- 可以自定义签名配置
- 适合持续集成

## 🐛 常见问题

### 1. 构建失败：SDK location not found

**解决方案**：
```bash
# 在 android/local.properties 文件中添加：
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
# 或 macOS/Linux:
sdk.dir=/Users/YourName/Library/Android/sdk
```

### 2. 构建失败：Java version 错误

**解决方案**：
```bash
# 确保使用 Java 17
java -version

# 设置 JAVA_HOME
# Windows:
set JAVA_HOME=C:\\Program Files\\Java\\jdk-17

# macOS/Linux:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### 3. 依赖安装失败

**解决方案**：
```bash
# 清理缓存
pnpm store prune

# 重新安装
rm -rf node_modules
pnpm install
```

### 4. Expo EAS Build 上传失败

**解决方案**：
```bash
# 使用代理或 VPN
# 或者使用本地构建方法
```

## 📱 安装 APK

1. 将 APK 传输到 Android 设备
2. 在设置中允许"未知来源"安装
3. 点击 APK 文件进行安装
4. 首次打开时授予相机和相册权限

## 🔐 签名配置（可选）

如果需要发布到应用商店，需要配置签名：

```bash
# 1. 生成密钥库
keytool -genkey -v -keystore yanbao-release-key.keystore -alias yanbao-key -keyalg RSA -keysize 2048 -validity 10000

# 2. 在 android/gradle.properties 中添加：
MYAPP_RELEASE_STORE_FILE=yanbao-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=yanbao-key
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password

# 3. 修改 android/app/build.gradle 添加签名配置
```

## 📞 技术支持

如有问题，请联系：
- GitHub: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- 提交 Issue: https://github.com/Tsaojason-cao/yanbao-imaging-studio/issues

---

Made with ❤️ by Jason Tsao for Yanbao
