# yanbao AI v2.2.0 - Expo 快速启动指南

## 🎯 目标

使用 Expo 快速启动和预览 yanbao AI，无需构建 APK，实时查看效果。

**预计时间**: 5-10 分钟

---

## ✅ 为什么选择 Expo？

### 优势

- ✅ **快速预览**: 无需构建 APK，扫码即可在手机上查看
- ✅ **实时刷新**: 代码修改后自动刷新，立即看到效果
- ✅ **跨平台**: 同时支持 Android 和 iOS
- ✅ **简单易用**: 无需配置 Android Studio 或 Xcode
- ✅ **调试方便**: 内置调试工具和错误提示

### 适用场景

- 🔧 **开发阶段**: 快速迭代和测试
- 👀 **UI 预览**: 查看界面效果
- 🐛 **调试**: 快速定位和修复问题
- 📱 **演示**: 向他人展示 App 效果

---

## 📋 前置准备

### 1. 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **手机**: Android 或 iOS 设备
- **网络**: 电脑和手机在同一 WiFi 网络

### 2. 检查环境

```bash
node -v
# 应该显示 >= 18.0.0

pnpm -v
# 应该显示 >= 8.0.0
```

---

## 🚀 第一步：安装 Expo Go（手机端）

### Android 用户

1. 打开 Google Play 商店
2. 搜索 "Expo Go"
3. 下载并安装

**或者**直接访问：https://play.google.com/store/apps/details?id=host.exp.exponent

---

### iOS 用户

1. 打开 App Store
2. 搜索 "Expo Go"
3. 下载并安装

**或者**直接访问：https://apps.apple.com/app/expo-go/id982107779

---

## 🚀 第二步：启动开发服务器（电脑端）

### 2.1 解压源码（如果尚未解压）

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

### 2.3 启动 Expo 开发服务器

```bash
pnpm start
```

**或者**:

```bash
npx expo start
```

**预计时间**: 30 秒

---

### 2.4 查看二维码

启动成功后，终端会显示：

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
```

---

## 🚀 第三步：在手机上预览（手机端）

### Android 用户

1. 打开 Expo Go App
2. 点击「Scan QR Code」
3. 扫描电脑终端显示的二维码
4. 等待加载（首次加载需要 30-60 秒）
5. App 启动成功！

---

### iOS 用户

**方法 1: 使用 Expo Go**

1. 打开 Expo Go App
2. 点击「Scan QR Code」
3. 扫描电脑终端显示的二维码
4. 等待加载
5. App 启动成功！

**方法 2: 使用相机 App**

1. 打开相机 App
2. 对准二维码
3. 点击弹出的通知
4. 在 Expo Go 中打开
5. App 启动成功！

---

## 🎨 第四步：实时预览和调试

### 4.1 实时刷新

修改代码后，App 会自动刷新：

1. 在电脑上修改代码（例如修改 `app/(tabs)/index.tsx`）
2. 保存文件
3. 手机上的 App 自动刷新，立即看到效果

---

### 4.2 手动刷新

如果自动刷新未生效：

- **Android**: 摇晃手机，点击「Reload」
- **iOS**: 摇晃手机，点击「Reload」

**或者**在电脑终端按 `r` 键。

---

### 4.3 打开调试菜单

- **Android**: 摇晃手机
- **iOS**: 摇晃手机

调试菜单选项：

- **Reload**: 重新加载 App
- **Go Home**: 返回 Expo Go 首页
- **Toggle Performance Monitor**: 显示性能监控
- **Toggle Element Inspector**: 显示元素检查器
- **Debug Remote JS**: 远程调试 JavaScript

---

### 4.4 查看日志

在电脑终端可以看到所有日志输出：

```
LOG  [yanbao] App started
LOG  [yanbao] Memory saved: Memory_1234567890
LOG  [yanbao] Navigation to Gallery
```

---

## 🔧 常用命令

### 在电脑终端按键

| 按键 | 功能 |
|------|------|
| `a` | 在 Android 模拟器中打开 |
| `i` | 在 iOS 模拟器中打开 |
| `w` | 在浏览器中打开 |
| `r` | 重新加载 App |
| `j` | 打开调试器 |
| `m` | 切换菜单 |
| `o` | 在编辑器中打开代码 |
| `c` | 清除终端 |
| `?` | 显示所有命令 |
| `Ctrl+C` | 停止服务器 |

---

## 🐛 常见问题

### 问题 1: 扫码后无法连接

**原因**: 电脑和手机不在同一 WiFi 网络

**解决方案**:
1. 确保电脑和手机连接到同一个 WiFi
2. 重启 Expo 开发服务器：
   ```bash
   # 按 Ctrl+C 停止
   pnpm start
   ```

---

### 问题 2: App 加载失败

**原因**: 网络问题或依赖未安装

**解决方案**:
1. 检查网络连接
2. 重新安装依赖：
   ```bash
   rm -rf node_modules
   pnpm install
   ```
3. 重启服务器：
   ```bash
   pnpm start
   ```

---

### 问题 3: 修改代码后未自动刷新

**原因**: Fast Refresh 未启用或代码有错误

**解决方案**:
1. 手动刷新：在手机上摇晃设备，点击「Reload」
2. 或在电脑终端按 `r` 键
3. 检查终端是否有错误日志

---

### 问题 4: 相机功能无法使用

**原因**: Expo Go 对某些原生功能有限制

**解决方案**:
1. 使用 Expo 开发客户端（Development Build）
2. 或构建 APK 进行测试（参考 `LOCAL_BUILD_COMMANDS.md`）

---

## 📱 测试功能清单

在 Expo Go 中测试以下功能：

- [ ] App 启动，显示库洛米紫色启动页
- [ ] 首页显示 7 大模块入口
- [ ] 底部导航栏切换流畅
- [ ] 相册页面显示 2.5 列照片网格
- [ ] 编辑页面显示裁剪工具
- [ ] 设定页面显示用户卡片
- [ ] 所有页面主题颜色一致（#1A0B2E + #E879F9）

**注意**: 相机功能在 Expo Go 中可能无法完全测试，需要构建 APK 或使用开发客户端。

---

## 🚀 进阶：使用开发客户端

如果需要测试相机等原生功能：

### 1. 构建开发客户端

```bash
npx expo install expo-dev-client
eas build --profile development --platform android
```

### 2. 安装开发客户端

下载并安装 EAS 构建的开发客户端 APK。

### 3. 启动开发服务器

```bash
pnpm start --dev-client
```

### 4. 在开发客户端中打开

扫描二维码或输入 URL。

---

## ✅ 快速启动流程总结

1. **安装 Expo Go**（手机端）
2. **安装依赖**：`pnpm install`（电脑端）
3. **启动服务器**：`pnpm start`（电脑端）
4. **扫描二维码**（手机端）
5. **开始预览**！

**总时间**: 5-10 分钟

---

## 🎉 恭喜！

您现在可以在手机上实时预览 yanbao AI 了！

修改代码，保存文件，立即看到效果，开发效率大幅提升！

---

**制作者**: Jason Tsao  
**版本**: v2.2.0  
**日期**: 2026-01-14  
**主题**: 库洛米紫色 💜

如需更多帮助，请参考 `EXPO_GO_PREVIEW.md` 和 `EXPO_DEBUG_GUIDE.md`。
