# yanbao AI - APK 构建说明

**版本**: 1.0.0  
**创建日期**: 2026年1月17日  
**状态**: 📦 Expo 项目已准备，等待云端构建

---

## 📋 重要说明

由于 Manus 沙盒环境**缺少 Android SDK**，无法直接使用 `./gradlew assembleRelease` 命令进行本地构建。

我已为您准备了两种解决方案：

---

## 🚀 方案 1: 使用 Expo EAS Build 云端打包（推荐）

### ✅ 优势
- ✅ 无需本地 Android SDK
- ✅ 云端自动构建
- ✅ 自动签名
- ✅ 10-20 分钟完成
- ✅ 提供下载链接

### 📦 已准备内容

1. ✅ **Expo 项目**: `YanbaoAI-Expo/`
2. ✅ **EAS 配置**: `eas.json`
3. ✅ **应用代码**: `App.js`（简体中文界面）
4. ✅ **应用配置**: `app.json`（包名: com.yanbaoai）
5. ✅ **构建指南**: `EAS_BUILD_GUIDE.md`

### 🎯 构建步骤

#### 在新 Manus 账号或本地环境中执行：

```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio/YanbaoAI-Expo

# 2. 安装依赖
npm install
npm install -g eas-cli

# 3. 登录 Expo 账号
eas login
# 如果没有账号，访问 https://expo.dev/signup 注册

# 4. 构建 APK
eas build --platform android --profile preview

# 5. 等待构建完成（10-20 分钟）
# 构建完成后会显示下载链接

# 6. 下载 APK
# 点击下载链接或使用 wget 下载
```

### 📱 预期结果

构建完成后，您将获得：
- ✅ **APK 文件**: yanbao-ai-v1.0.0.apk
- ✅ **包名**: com.yanbaoai
- ✅ **应用名称**: yanbao AI
- ✅ **版本号**: 1.0.0
- ✅ **签名状态**: 已签名
- ✅ **APK 大小**: ~20-30 MB

---

## 🛠️ 方案 2: 在配置了 Android SDK 的环境中构建

### 环境要求

- ✅ Android SDK (API 21-34)
- ✅ Java 17+
- ✅ Gradle 8.0+
- ✅ Node.js 22+

### 构建步骤

```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio/YanbaoAI

# 2. 安装依赖
npm install

# 3. 生成签名密钥
cd android/app
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore yanbao-ai-release.keystore \
  -alias yanbao-ai \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 4. 配置签名
# 编辑 android/gradle.properties
# 添加签名配置

# 5. 构建 APK
cd ..
./gradlew assembleRelease

# 6. 查找 APK
ls -lh app/build/outputs/apk/release/app-release.apk
```

---

## 📊 两种方案对比

| 特性 | EAS Build（方案 1） | 本地构建（方案 2） |
|------|---------------------|-------------------|
| **环境要求** | 只需 Node.js | Android SDK + Java + Gradle |
| **构建时间** | 10-20 分钟 | 2-5 分钟 |
| **签名** | 自动 | 手动配置 |
| **难度** | 简单 | 中等 |
| **成本** | 免费（30 次/月） | 免费 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 推荐流程

### 对于新 Manus 账号

1. ✅ 克隆 GitHub 仓库
2. ✅ 进入 `YanbaoAI-Expo/` 目录
3. ✅ 按照 `EAS_BUILD_GUIDE.md` 执行构建
4. ✅ 下载 APK 并测试

### 对于本地开发环境

1. ✅ 克隆 GitHub 仓库
2. ✅ 进入 `YanbaoAI/` 目录
3. ✅ 配置 Android SDK
4. ✅ 执行 `./gradlew assembleRelease`
5. ✅ 测试 APK

---

## 📦 项目文件结构

```
yanbao-imaging-studio/
├── YanbaoAI/                    # React Native 项目（需要 Android SDK）
│   ├── android/
│   │   ├── app/
│   │   │   ├── build.gradle
│   │   │   └── src/main/
│   │   └── build.gradle
│   ├── src/
│   └── package.json
│
├── YanbaoAI-Expo/               # Expo 项目（用于 EAS Build）
│   ├── App.js                   # 应用代码
│   ├── app.json                 # 应用配置
│   ├── eas.json                 # EAS Build 配置
│   ├── EAS_BUILD_GUIDE.md       # 构建指南
│   └── package.json
│
└── APK_BUILD_INSTRUCTIONS.md    # 本文档
```

---

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- **Expo 官网**: https://expo.dev
- **EAS Build 文档**: https://docs.expo.dev/build/introduction/
- **Expo 注册**: https://expo.dev/signup

---

## 💡 常见问题

### Q1: 为什么不能直接构建 APK？

**A**: Manus 沙盒环境缺少 Android SDK，无法执行 `./gradlew assembleRelease`。

### Q2: EAS Build 需要付费吗？

**A**: Expo 免费账号每月提供 30 次构建，足够个人使用。

### Q3: 构建的 APK 可以发布吗？

**A**: 可以！EAS Build 构建的 APK 已签名，可以直接安装和发布。

### Q4: 如何获取下载链接？

**A**: 构建完成后，EAS 会在终端显示下载链接，也可以访问 https://expo.dev 查看。

### Q5: 可以在手机上安装吗？

**A**: 可以！下载 APK 后，在手机上启用"未知来源"安装即可。

---

## 🎉 总结

### ✅ 已完成

1. ✅ Expo 项目创建
2. ✅ 应用配置完成（简体中文 + yanbao AI）
3. ✅ EAS Build 配置完成
4. ✅ 构建指南完成
5. ✅ Git 同步完成
6. ✅ 备份创建完成

### 🚀 下一步

1. 在新 Manus 账号或本地环境中执行 EAS Build
2. 下载 APK
3. 测试 APK
4. 发布应用

---

**使用 Expo EAS Build 构建真实的 yanbao AI APK！** 🚀

**推荐命令**:
```bash
cd yanbao-imaging-studio/YanbaoAI-Expo
eas login
eas build --platform android --profile preview
```

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
