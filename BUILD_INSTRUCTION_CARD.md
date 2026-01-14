# 🚀 yanbao AI v2.2.0 生產環境構建指令卡

## ⚡ 一鍵構建（推薦）

### 在您的本地電腦上執行此命令：

```bash
cd yanbao-imaging-studio && export NODE_ENV=production && eas build --platform android --profile production --clear-cache
```

**按 Enter 執行！** ✅

---

## 📋 分步構建指令

### 第 1 步：進入項目目錄

```bash
cd yanbao-imaging-studio
```

### 第 2 步：設置環境變量

```bash
export NODE_ENV=production
```

### 第 3 步：驗證環境

```bash
# 檢查 Node.js
node --version

# 檢查 pnpm
pnpm --version

# 檢查 EAS CLI
eas --version

# 檢查 Expo 登錄
eas whoami
```

### 第 4 步：開始構建

```bash
eas build --platform android --profile production --clear-cache
```

**耗時**：30-60 分鐘

---

## 🎯 構建過程中會發生什麼

### 第 1-5 分鐘：環境準備
```
✓ Read package.json
✓ Install dependencies
✓ Read app config
✓ Resolve build configuration
✓ Run expo doctor
```

### 第 6-15 分鐘：預編譯
```
✓ Prebuild
✓ Restore cache
✓ Prepare credentials
✓ Bundle JavaScript
```

### 第 16-60 分鐘：Gradle 構建
```
✓ Run gradlew
  - 配置 Gradle
  - 編譯 Kotlin/Java
  - 編譯 C/C++（native modules）
  - 打包 APK
```

---

## ✅ 構建完成後

### 您會看到：

```
✓ Build completed successfully!

Build #12345678
  Platform: Android
  Profile: production
  Status: completed

Download URL:
https://storage.googleapis.com/expo-builds/...

APK 文件信息：
- 文件名：yanbao-ai-production.apk
- 大小：約 65-75 MB
- 版本：2.2.0
- 簽名所有者：Jason Tsao
- 支持：Android 7.0+
```

---

## 📥 下載 APK

### 方式 1：使用瀏覽器（推薦）

1. 複製提供的下載 URL
2. 在瀏覽器中打開
3. 點擊下載

### 方式 2：使用命令行

```bash
# 查看最新構建
eas builds --limit 1

# 提取下載 URL
eas builds --limit 1 --json | jq '.builds[0].artifacts.buildUrl'

# 自動下載 APK
curl -O $(eas builds --limit 1 --json | jq -r '.builds[0].artifacts.buildUrl')
```

---

## 📱 安裝到 Android 設備

### 前置條件

- ✅ Android 設備已連接
- ✅ USB 調試已啟用
- ✅ ADB 已安裝

### 安裝步驟

```bash
# 1. 檢查設備連接
adb devices

# 2. 安裝 APK
adb install yanbao-ai-production.apk

# 3. 強制覆蓋安裝（如果已安裝）
adb install -r yanbao-ai-production.apk

# 4. 啟動應用
adb shell am start -n space.manus.yanbao.eas.build.t20260111214759/.MainActivity

# 5. 查看應用日誌
adb logcat | grep yanbao
```

---

## 🔧 常見問題快速解決

### Q1：未登錄 Expo？

```bash
eas login
```

### Q2：構建失敗？

```bash
# 查看詳細日誌
eas build --platform android --profile production --log

# 清除所有緩存並重新構建
eas build --platform android --profile production --clear-cache
```

### Q3：設備無法識別？

```bash
# 重啟 ADB
adb kill-server && adb start-server

# 檢查設備連接
adb devices

# 檢查 USB 調試是否啟用
# 設置 > 開發者選項 > USB 調試
```

### Q4：安裝失敗？

```bash
# 卸載舊版本
adb uninstall space.manus.yanbao.eas.build.t20260111214759

# 重新安裝
adb install yanbao-ai-production.apk
```

### Q5：應用無法啟動？

```bash
# 查看詳細錯誤日誌
adb logcat | grep -i error

# 清除應用數據
adb shell pm clear space.manus.yanbao.eas.build.t20260111214759

# 重新啟動應用
adb shell am start -n space.manus.yanbao.eas.build.t20260111214759/.MainActivity
```

---

## 📊 應用信息

| 項目 | 值 |
|------|-----|
| **應用名稱** | 雁宝 AI 私人影像工作室 |
| **包名** | space.manus.yanbao.eas.build.t20260111214759 |
| **版本** | 2.2.0 |
| **構建類型** | Production（正式版） |
| **簽名所有者** | Jason Tsao |
| **APK 大小** | 約 65-75 MB |
| **最低 SDK** | Android 7.0 (API 24) |
| **目標 SDK** | Android 15 (API 35) |
| **編譯 SDK** | Android 15 (API 35) |
| **支持架構** | arm64-v8a, armeabi-v7a |

---

## 🎯 構建配置詳解

### 已升級的配置

```typescript
// app.config.ts
android: {
  buildArchs: ["armeabi-v7a", "arm64-v8a"],
  enableProguardInReleaseBuilds: true,      // 啟用代碼混淆
  enableShrinkResourcesInReleaseBuilds: true, // 啟用資源優化
  usesCleartextTraffic: false,              // 禁止明文 HTTP
  minSdkVersion: 24,                        // Android 7.0+
  targetSdkVersion: 35,                     // Android 15
  compileSdkVersion: 35,                    // Android 15
}
```

### 已清理的緩存

- ✅ Node 模塊緩存
- ✅ Expo 緩存
- ✅ Metro Bundler 緩存
- ✅ Gradle 構建緩存

---

## 💡 最佳實踐

### ✅ 構建前

- [ ] 確認所有代碼已提交
- [ ] 驗證 NODE_ENV 已設置
- [ ] 檢查網絡連接
- [ ] 確認 Expo 已登錄

### ✅ 構建中

- [ ] 監控構建進度
- [ ] 記錄構建 ID
- [ ] 保持網絡連接

### ✅ 構建後

- [ ] 驗證 APK 文件大小（65-75 MB）
- [ ] 檢查簽名信息
- [ ] 測試應用功能
- [ ] 記錄構建時間

---

## 📞 需要幫助？

- 📖 查看完整的 EAS 文檔：https://docs.expo.dev/build/introduction
- 🔍 查看故障排除指南：EAS_TROUBLESHOOTING.md
- ✅ 使用檢查清單：BUILD_DEPLOYMENT_CHECKLIST.md

---

## 🚀 立即開始

### 複製此命令到您的終端

```bash
cd yanbao-imaging-studio && export NODE_ENV=production && eas build --platform android --profile production --clear-cache
```

**按 Enter 執行！** 🎉

---

**祝您構建順利！** 🚀

**預計耗時**：1-2 小時（包括下載和安裝）

**成功標誌**：✅ APK 已下載 ✅ 應用已安裝 ✅ 功能已驗證
