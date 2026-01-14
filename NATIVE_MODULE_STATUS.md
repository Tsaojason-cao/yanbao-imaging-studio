# 原生美颜模块实现状态说明

**更新时间**: 2026-01-15  
**当前版本**: v2.4.1-final-gold  

---

## 📋 当前状态

**架构类型**: Expo Managed Workflow  
**原生模块状态**: ❌ **未实现**  

---

## 🔍 问题说明

当前项目是标准的 **Expo Managed Workflow**，这意味着：

1. **不包含原生代码目录**：项目中没有 `ios/` 和 `android/` 文件夹
2. **美颜处理在 Web 端模拟**：`YanbaoBeautyBridge` 在检测到原生模块不可用时，会直接返回原图
3. **真机上无美颜效果**：在 iOS 和 Android 设备上，美颜功能实际上不会生效

---

## 🛠️ 解决方案

### 方案 1：使用 Expo Prebuild（推荐）

**步骤**：

1. 执行 `npx expo prebuild` 生成原生目录
2. 按照 `NATIVE_MODULE_ARCHITECTURE.md` 的指导，手动添加原生美颜代码
3. 使用 `npx expo run:ios` 和 `npx expo run:android` 在本地构建和测试

**优点**：
- 完全控制原生代码
- 可以实现高性能的 GPU 加速美颜

**缺点**：
- 需要原生开发经验（Objective-C/Swift 和 Java/Kotlin）
- 维护成本较高

### 方案 2：使用 Expo Config Plugin

**步骤**：

1. 创建一个 Expo Config Plugin（`plugins/withYanbaoBeauty.js`）
2. 在 Plugin 中自动注入原生代码或使用第三方美颜 SDK
3. 在 `app.config.ts` 中启用该 Plugin

**优点**：
- 自动化程度高
- 可以在 EAS Build 中直接使用

**缺点**：
- 仍需编写原生代码或集成第三方 SDK
- Plugin 配置较复杂

### 方案 3：使用第三方美颜 SDK（最快）

**推荐 SDK**：
- **FaceUnity**（相芯科技）：国内领先的美颜 SDK，支持 React Native
- **Agora Video SDK**：提供实时美颜功能
- **TuSDK**（涂图）：专业的图像美化 SDK

**步骤**：

1. 选择一个美颜 SDK 并注册账号
2. 按照 SDK 文档集成到 React Native 项目中
3. 修改 `YanbaoBeautyBridge.ts`，调用 SDK 的 API

**优点**：
- 快速实现，无需从零开发
- SDK 已优化性能和兼容性

**缺点**：
- 需要付费（通常按调用次数或设备数计费）
- 依赖第三方服务

### 方案 4：使用 React Native 图像处理库（临时方案）

**推荐库**：
- **expo-image-manipulator**：Expo 官方图像处理库（已安装）
- **react-native-image-filter-kit**：提供多种滤镜效果

**步骤**：

1. 使用 `expo-image-manipulator` 的 `manipulateAsync` API
2. 实现基础的亮度、对比度、饱和度调整
3. 无法实现高级美颜（如磨皮、瘦脸），但可以作为临时方案

**优点**：
- 无需原生开发
- 快速上线

**缺点**：
- 功能有限，无法实现真正的美颜
- 性能较差（CPU 处理，非 GPU）

---

## 🚀 推荐实施路径

**短期（1-2 周）**：
1. 使用 **方案 4**（expo-image-manipulator）实现基础滤镜调整
2. 确保 App 可以正常构建和发布
3. 在 UI 中明确标注"美颜功能开发中"

**中期（1-2 个月）**：
1. 评估并选择一个第三方美颜 SDK（**方案 3**）
2. 集成 SDK 并完成测试
3. 发布正式版本

**长期（3-6 个月）**：
1. 如果预算允许，自研原生美颜模块（**方案 1**）
2. 实现完全定制化的美颜算法
3. 优化性能和用户体验

---

## 📝 当前代码的处理方式

在 `lib/YanbaoBeautyBridge.ts` 中，当原生模块不可用时：

```typescript
static async processImage(imageUri: string, beautyParams: BeautyParams): Promise<string> {
  if (!this.isAvailable()) {
    console.warn('[YanbaoBeauty] Native module not available, returning original image');
    return imageUri;  // 直接返回原图
  }
  // ...
}
```

**建议修改**：

```typescript
static async processImage(imageUri: string, beautyParams: BeautyParams): Promise<string> {
  if (!this.isAvailable()) {
    console.warn('[YanbaoBeauty] Native module not available, using fallback processing');
    // 使用 expo-image-manipulator 进行基础处理
    return await this.fallbackProcessImage(imageUri, beautyParams);
  }
  // ...
}

private static async fallbackProcessImage(
  imageUri: string, 
  beautyParams: BeautyParams
): Promise<string> {
  const { manipulateAsync, SaveFormat } = await import('expo-image-manipulator');
  
  // 基础调整：亮度、对比度、饱和度
  const result = await manipulateAsync(
    imageUri,
    [
      { brightness: beautyParams.bright / 100 },
      { contrast: 1 + beautyParams.smooth / 200 },
      { saturate: 1 + beautyParams.blush / 100 },
    ],
    { compress: 0.95, format: SaveFormat.JPEG }
  );
  
  return result.uri;
}
```

---

## ✅ 结论

**原生美颜模块的缺失是一个已知问题，但不应阻止 App 的发布。**

建议：
1. 短期内使用 **expo-image-manipulator** 实现基础功能
2. 在 UI 中明确告知用户"美颜功能持续优化中"
3. 中期内集成第三方 SDK 或自研原生模块

**当前版本可以发布，但需要在 App Store / Google Play 的描述中说明美颜功能的限制。**
