# yanbao AI v2.4.1 - 构建故障排除指南

本指南旨在帮助您快速解决在执行 `build-apk.sh` 脚本或手动构建过程中可能遇到的常见问题。

---

## ❓ 常见问题与解决方案

### 问题 1: 命令未找到 (Command not found)

- **错误信息**: `node: command not found`, `pnpm: command not found`, `eas: command not found`
- **原因**: 核心依赖未安装或未添加到系统 PATH。
- **解决方案**:
  1.  **安装 Node.js**: 推荐使用 `nvm` 安装 Node.js 22.13.0。
  2.  **安装 pnpm**: `npm install -g pnpm`
  3.  **安装 EAS CLI**: `npm install -g eas-cli`
  4.  **重启终端**: 确保新的 PATH 生效。

---

### 问题 2: EAS 登录失败

- **错误信息**: `Authentication failed`, `You are not logged in`
- **原因**: 未登录 Expo 账号或凭证已过期。
- **解决方案**:
  1.  **执行登录**: `eas login`
  2.  **输入账号密码**: 在浏览器或终端中完成登录流程。
  3.  **验证登录**: `eas whoami`，应显示您的用户名。

---

### 问题 3: 依赖安装失败

- **错误信息**: `Failed to install dependencies`, `peer dependency conflict`
- **原因**: 网络问题、pnpm 缓存问题或依赖版本冲突。
- **解决方案**:
  1.  **清理缓存**: `pnpm store prune`
  2.  **删除 `node_modules`**: `rm -rf node_modules`
  3.  **重新安装**: `pnpm install`
  4.  **检查网络**: 确保可以访问 npm registry。

---

### 问题 4: EAS Build 构建失败

- **错误信息**: `Build failed`, `Gradle build failed`
- **原因**: 这是最复杂的问题，可能原因多样。
- **解决方案**:
  1.  **查看构建日志**: 这是最重要的一步！EAS 会提供一个详细的构建日志链接。
  2.  **定位错误**: 在日志中搜索 `Error`, `FAILURE`, `failed` 等关键词。
  3.  **常见错误类型**:
      - **Java 堆内存不足 (Out of Memory)**: EAS 默认提供足够的内存，但如果本地构建遇到此问题，请在 `android/gradle.properties` 中增加 JVM 内存：`org.gradle.jvmargs=-Xmx4096m`。
      - **依赖冲突 (Duplicate class)**: 检查 `package.json` 中是否有重复或版本冲突的依赖。可以尝试使用 `pnpm why <package-name>` 来分析依赖树。
      - **签名失败 (Failed to read key)**: 如果使用本地构建，请确保 `gradle.properties` 中的签名密码和密钥路径正确。
      - **SDK 版本问题**: 确保 `android/build.gradle` 中的 `compileSdkVersion` 和 `targetSdkVersion` 与项目要求一致（当前为 35 和 34）。

---

### 问题 5: APK 安装失败

- **错误信息**: `INSTALL_FAILED_VERSION_DOWNGRADE`, `INSTALL_FAILED_INVALID_APK`
- **原因**: 设备上已安装更高版本的 App，或 APK 文件已损坏。
- **解决方案**:
  1.  **卸载旧版本**: 在设备上卸载已有的 yanbao AI App。
  2.  **重新下载 APK**: 确保 APK 文件完整无损。
  3.  **检查签名**: 确保安装的 APK 与设备上已有的版本签名一致（如果之前安装过）。

---

### 问题 6: App 启动后闪退 (Crash)

- **原因**: 运行时错误，通常与原生模块或 JavaScript 代码有关。
- **解决方案**:
  1.  **查看设备日志**: 使用 `adb logcat` (Android) 或 `Console.app` (iOS) 查看详细的崩溃日志。
  2.  **定位错误**: 在日志中查找 `FATAL EXCEPTION` 或 `JavaScriptException`。
  3.  **常见原因**:
      - **环境变量缺失**: 确保 Supabase 等服务的环境变量已正确设置。
      - **原生模块链接失败**: 尝试重新生成原生项目：`npx expo prebuild --clean`。
      - **JavaScript 运行时错误**: 检查代码中是否有未处理的异常。

---

## 📞 获取帮助

如果以上指南无法解决您的问题，请收集以下信息并联系技术支持：

1.  **完整的构建日志**: 从 EAS 控制台下载的日志文件。
2.  **设备日志**: 如果是运行时闪退，请提供 `adb logcat` 的输出。
3.  **复现步骤**: 详细描述您是如何触发这个问题的。
4.  **环境信息**: `ENVIRONMENT_CHECKLIST.md` 的检查结果。

---

**保持耐心，仔细阅读错误日志是解决问题的关键。**
