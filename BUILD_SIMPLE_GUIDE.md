# yanbao AI v2.2.0 - 簡單 3 步構建指令

## 前置要求
- Node.js v16+
- pnpm
- Expo 賬戶（免費）

---

## 3 步快速構建

### 第 1 步：登錄 Expo
```bash
cd yanbao-imaging-studio
eas login
```

### 第 2 步：開始生產環境構建
```bash
export NODE_ENV=production
eas build --platform android --profile production --clear-cache
```

### 第 3 步：等待並下載 APK
- 等待 30-60 分鐘
- 構建完成後會提供下載 URL
- 複製 URL 到瀏覽器下載 APK

---

## 配置確認

✅ **SDK 版本**：35（已修復 androidx.camera 衝突）
✅ **簽名所有者**：Jason Tsao
✅ **版本號**：2.2.0
✅ **應用名稱**：YanBao AI

---

## 常見問題

**Q：構建失敗？**
```bash
eas build --platform android --profile production --clear-cache --log
```

**Q：需要查看構建狀態？**
```bash
eas builds --limit 1
```

**Q：下載已生成的 APK？**
```bash
eas builds --limit 1 --json | jq '.builds[0].artifacts.buildUrl'
```

---

## 安裝到設備

```bash
# 檢查設備連接
adb devices

# 安裝 APK
adb install yanbao-ai-production.apk

# 啟動應用
adb shell am start -n space.manus.yanbao.eas.build.t20260111214759/.MainActivity
```

---

**祝您構建順利！** 🚀
