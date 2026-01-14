# 大师参数阵列转化文档

**文档版本**: v1.0  
**创建时间**: 2026-01-15  
**目的**: 将全球大师的摄影风格量化为数值阵列，便于在编辑器中一键应用  

---

## 核心概念

### 影调矩阵 (Tone Matrix)

影调矩阵控制照片的整体色调和氛围，包括：
- **曝光 (Exposure)**: 整体亮度调整 (-100 to +100)
- **对比度 (Contrast)**: 明暗对比强度 (-100 to +100)
- **饱和度 (Saturation)**: 色彩鲜艳程度 (-100 to +100)
- **颗粒度 (Grain)**: 胶片颗粒感 (0 to 100)
- **色温 (Temperature)**: 冷暖色调 (-100 to +100)

### 美颜参数 (Beauty Stats)

美颜参数控制人像的细节修饰，包括：
- **磨皮 (Smoothing)**: 皮肤平滑度 (0 to 100)
- **瘦脸 (Face Slim)**: 面部塑形 (0 to 100)
- **大眼 (Eye Enlarge)**: 眼部放大 (0 to 100)
- **亮眼 (Brighten)**: 眼部提亮 (0 to 100)
- **白牙 (Whiten)**: 牙齿美白 (0 to 100)
- **隆鼻 (Nose)**: 鼻梁增强 (0 to 100)
- **红润 (Rosy)**: 面部红润 (0 to 100)
- **骨相立体 (Sculpting 3D)**: 立体塑形 (0 to 100)
- **纹理保留 (Texture Retention)**: 皮肤纹理保留 (0 to 100)
- **牙齿美白增强 (Teeth Whitening Pro)**: 专业美白 (0 to 100)
- **眼周淡化 (Dark Circle Removal)**: 黑眼圈淡化 (0 to 100)
- **发际线调整 (Hairline Adjustment)**: 发际线修饰 (0 to 100)

---

## 大师参数阵列

### 1. 中国：肖全 - 时代的记录者

**核心逻辑**: 极致黑白，保留岁月刻痕

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | -10 | 轻微压暗，增强纪实感 |
| 对比度 | +40 | 高对比，强化明暗对比 |
| 饱和度 | -100 | 完全去色，纯黑白 |
| 颗粒度 | +20 | 胶片颗粒感 |
| 色温 | 0 | 中性 |
| **美颜参数** |
| 磨皮 | 22% | 保留皮肤纹理 |
| 瘦脸 | 12% | 微调下颌线 |
| 大眼 | 8% | 轻微提升神采 |
| 亮眼 | 15% | 瞳孔高光 |
| 白牙 | 10% | 自然去黄 |
| 隆鼻 | 5% | 山根阴影 |
| 红润 | 12% | 健康血色 |
| 骨相立体 | 0% | 不修饰 |
| 纹理保留 | 30% | 保留真实感 |
| 牙齿美白增强 | 0% | 不使用 |
| 眼周淡化 | 0% | 保留岁月痕迹 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_XIAO_QUAN: MasterPreset = {
  id: 'preset_cn_1_xiao_quan',
  name: '时代的记录者',
  photographer: '肖全',
  region: 'CN',
  description: '极致黑白，保留岁月刻痕',
  beautyParams: {
    smooth: 22,
    slim: 12,
    eye: 8,
    bright: 15,
    teeth: 10,
    nose: 5,
    blush: 12,
    sculpting3D: 0,
    textureRetention: 30,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 40,
    saturation: -100,
    brightness: -10,
    grain: 20,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 0,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
};
```

---

### 2. 中国：孙郡 - 工笔画诗人

**核心逻辑**: 仿工笔画，低反差暖色调

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | +20 | 提亮，营造柔和氛围 |
| 对比度 | -20 | 低对比，柔和过渡 |
| 饱和度 | -30 | 降低饱和度，淡雅色调 |
| 颗粒度 | 0 | 无颗粒，细腻质感 |
| 色温 | +10 | 暖色调 |
| **美颜参数** |
| 磨皮 | 25% | 适度修饰 |
| 瘦脸 | 10% | 轻微调整 |
| 大眼 | 5% | 保持自然 |
| 亮眼 | 12% | 轻微提亮 |
| 白牙 | 8% | 自然美白 |
| 隆鼻 | 3% | 轻微立体 |
| 红润 | 10% | 健康肤色 |
| 骨相立体 | 0% | 不修饰 |
| 纹理保留 | 40% | 保留质感 |
| 牙齿美白增强 | 0% | 不使用 |
| 眼周淡化 | 0% | 不修饰 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_SUN_JUN: MasterPreset = {
  id: 'preset_cn_2_sun_jun',
  name: '工笔画诗人',
  photographer: '孙郡',
  region: 'CN',
  description: '仿工笔画，低反差暖色调',
  beautyParams: {
    smooth: 25,
    slim: 10,
    eye: 5,
    bright: 12,
    teeth: 8,
    nose: 3,
    blush: 10,
    sculpting3D: 0,
    textureRetention: 40,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -20,
    saturation: -30,
    brightness: 20,
    grain: 0,
    temperature: 10,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 0,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
};
```

---

### 3. 中国：陈漫 - 视觉艺术家

**核心逻辑**: 商业高保真，高锐度

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | +10 | 轻微提亮 |
| 对比度 | +30 | 高对比，视觉冲击力 |
| 饱和度 | +20 | 色彩极其饱和 |
| 颗粒度 | 0 | 无颗粒，商业级 |
| 色温 | 0 | 中性 |
| **美颜参数** |
| 磨皮 | 40% | 完美皮肤修饰 |
| 瘦脸 | 15% | 时尚感 |
| 大眼 | 15% | 增强神采 |
| 亮眼 | 25% | 高亮度 |
| 白牙 | 20% | 商业级美白 |
| 隆鼻 | 10% | 立体五官 |
| 红润 | 15% | 健康肤色 |
| 骨相立体 | 45% | 强烈立体感 |
| 纹理保留 | 20% | 低保留（高修饰） |
| 牙齿美白增强 | 30% | 专业美白 |
| 眼周淡化 | 40% | 完美眼周 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_CHEN_MAN: MasterPreset = {
  id: 'preset_cn_3_chen_man',
  name: '视觉艺术家',
  photographer: '陈漫',
  region: 'CN',
  description: '色彩极其饱和、时尚感强烈、皮肤修饰完美、极具视觉冲击力',
  beautyParams: {
    smooth: 40,
    slim: 15,
    eye: 15,
    bright: 25,
    teeth: 20,
    nose: 10,
    blush: 15,
    sculpting3D: 45,
    textureRetention: 20,
    teethWhiteningPro: 30,
    darkCircleRemoval: 40,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 15,
    saturation: 20,
    brightness: 10,
    grain: 0,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 10,
    vignette: 10,
    hueShift: 5,
    sharpness: 20,
    fade: 0,
  },
};
```

---

### 4. 日本：杉本博司 - 禅意长曝

**核心逻辑**: 极致长曝与禅意，灰度滤镜，模拟银盐相纸质感

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | +35 | 高亮度，银盐质感 |
| 对比度 | -20 | 低对比，柔和过渡 |
| 饱和度 | -80 | 灰度滤镜 |
| 颗粒度 | +8 | 胶片质感 |
| 色温 | 0 | 中性 |
| **美颜参数** |
| 磨皮 | 0% | 完全保留原貌 |
| 瘦脸 | 0% | 不修饰 |
| 大眼 | 0% | 不修饰 |
| 亮眼 | 10% | 轻微提亮 |
| 白牙 | 0% | 不修饰 |
| 隆鼻 | 0% | 不修饰 |
| 红润 | 0% | 不修饰 |
| 骨相立体 | 0% | 不修饰 |
| 纹理保留 | 100% | 完全保留 |
| 牙齿美白增强 | 0% | 不使用 |
| 眼周淡化 | 0% | 不修饰 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_SUGIMOTO_HIROSHI: MasterPreset = {
  id: 'preset_jp_1_sugimoto',
  name: '禅意长曝',
  photographer: '杉本博司',
  region: 'JP',
  description: '极致长曝与禅意，灰度滤镜，模拟银盐相纸质感',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 10,
    teeth: 0,
    nose: 0,
    blush: 0,
    sculpting3D: 0,
    textureRetention: 100,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -20,
    saturation: -80,
    brightness: 35,
    grain: 8,
    temperature: 0,
    highlightSuppression: 25,
    shadowCompensation: 30,
    vignette: 0,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
};
```

---

### 5. 美国：Annie Leibovitz - 史诗肖像

**核心逻辑**: 史诗感、冷暖对比、油画质感

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | 0 | 中性 |
| 对比度 | +30 | 戏剧性光影 |
| 饱和度 | 0 | 中性 |
| 颗粒度 | +5 | 胶片质感 |
| 色温 | -15 | 冷色调 |
| **美颜参数** |
| 磨皮 | 20% | 适度修饰 |
| 瘦脸 | 8% | 轻微调整 |
| 大眼 | 10% | 增强神采 |
| 亮眼 | 25% | 高亮度 |
| 白牙 | 15% | 商业级 |
| 隆鼻 | 5% | 轻微立体 |
| 红润 | 10% | 健康肤色 |
| 骨相立体 | 40% | 强烈立体感 |
| 纹理保留 | 60% | 保留质感 |
| 牙齿美白增强 | 20% | 专业美白 |
| 眼周淡化 | 30% | 淡化眼周 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_US_1_ANNIE: MasterPreset = {
  id: 'preset_us_1_annie',
  name: '史诗肖像',
  photographer: 'Annie Leibovitz',
  region: 'US',
  description: '史诗感、冷暖对比、油画质感',
  beautyParams: {
    smooth: 20,
    slim: 8,
    eye: 10,
    bright: 25,
    teeth: 15,
    nose: 5,
    blush: 10,
    sculpting3D: 40,
    textureRetention: 60,
    teethWhiteningPro: 20,
    darkCircleRemoval: 30,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 30,
    saturation: 0,
    brightness: 0,
    grain: 5,
    temperature: -15,
    highlightSuppression: 20,
    shadowCompensation: 20,
    vignette: 10,
    hueShift: 5,
    sharpness: 15,
    fade: 0,
  },
};
```

---

### 6. 雁宝经典 - 原生质感

**核心逻辑**: 看起来像原相机直出，但细节已经过滤

| 参数 | 数值 | 说明 |
| :--- | :--- | :--- |
| **影调矩阵** |
| 曝光 | 0 | 中性 |
| 对比度 | 0 | 中性 |
| 饱和度 | 0 | 中性 |
| 颗粒度 | 0 | 无颗粒 |
| 色温 | 0 | 中性 |
| **美颜参数** |
| 磨皮 | 22% | 保留皮肤纹理 |
| 瘦脸 | 12% | 微调下颌线 |
| 大眼 | 8% | 提升神采 |
| 亮眼 | 15% | 瞳孔高光 |
| 白牙 | 10% | 自然去黄 |
| 隆鼻 | 5% | 山根阴影 |
| 红润 | 12% | 健康血色 |
| 骨相立体 | 0% | 不修饰 |
| 纹理保留 | 30% | 保留真实感 |
| 牙齿美白增强 | 0% | 不使用 |
| 眼周淡化 | 0% | 不修饰 |
| 发际线调整 | 0% | 不修饰 |

**代码实现**:
```typescript
export const PRESET_YANBAO_CLASSIC: MasterPreset = {
  id: 'preset_0_5_yanbao_classic',
  name: '雁宝经典',
  photographer: 'Yanbao Classic',
  region: 'CN',
  description: '原生质感，看起来像原相机直出，但细节已经过滤',
  beautyParams: {
    smooth: 22,
    slim: 12,
    eye: 8,
    bright: 15,
    teeth: 10,
    nose: 5,
    blush: 12,
    sculpting3D: 0,
    textureRetention: 30,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 0,
    saturation: 0,
    brightness: 0,
    grain: 0,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 0,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
};
```

---

## 如何在编辑器中应用

### 1. 使用 expo-image-manipulator（短期方案）

```typescript
import * as ImageManipulator from 'expo-image-manipulator';

async function applyMasterPreset(imageUri: string, preset: MasterPreset) {
  const actions: ImageManipulator.Action[] = [];
  
  // 应用影调矩阵
  if (preset.filterParams.brightness !== 0) {
    actions.push({
      brightness: preset.filterParams.brightness / 100,
    });
  }
  
  if (preset.filterParams.contrast !== 0) {
    actions.push({
      contrast: preset.filterParams.contrast / 100,
    });
  }
  
  if (preset.filterParams.saturation !== 0) {
    actions.push({
      saturation: preset.filterParams.saturation / 100,
    });
  }
  
  // 执行处理
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    actions,
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  return result.uri;
}
```

**限制**:
- ❌ 无法实现美颜参数（磨皮、瘦脸等）
- ✅ 可以实现基础滤镜调整（亮度、对比度、饱和度）

---

### 2. 使用第三方美颜 SDK（中期方案）

**推荐 SDK**:
1. **FaceUnity**: 国内领先的美颜 SDK
2. **Agora**: 提供实时美颜功能
3. **TuSDK**: 图虫美颜 SDK

**集成步骤**:
1. 注册账号并获取 SDK
2. 按照 SDK 文档集成到项目中
3. 修改 `YanbaoBeautyBridge.ts`，调用 SDK 的 API
4. 将大师预设的参数映射到 SDK 的参数

---

### 3. 自研原生模块（长期方案）

**iOS 实现**:
```swift
// YanbaoBeautyModule.swift
import CoreImage

@objc(YanbaoBeautyModule)
class YanbaoBeautyModule: NSObject {
  @objc
  func processFrame(_ imageUri: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    // 加载图像
    guard let image = CIImage(contentsOf: URL(string: imageUri)!) else {
      rejecter("ERROR", "Failed to load image", nil)
      return
    }
    
    // 应用滤镜
    let filter = CIFilter(name: "CIColorControls")!
    filter.setValue(image, forKey: kCIInputImageKey)
    filter.setValue(1.2, forKey: kCIInputContrastKey)
    filter.setValue(1.1, forKey: kCIInputSaturationKey)
    
    // 输出结果
    let context = CIContext()
    let outputImage = filter.outputImage!
    let cgImage = context.createCGImage(outputImage, from: outputImage.extent)!
    
    // 保存到临时文件
    let tempUrl = FileManager.default.temporaryDirectory.appendingPathComponent("processed.jpg")
    try! UIImage(cgImage: cgImage).jpegData(compressionQuality: 0.9)!.write(to: tempUrl)
    
    resolver(["uri": tempUrl.absoluteString])
  }
}
```

**Android 实现**:
```kotlin
// YanbaoBeautyModule.kt
import android.renderscript.*

class YanbaoBeautyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "YanbaoBeautyModule"
  
  @ReactMethod
  fun processFrame(imageUri: String, promise: Promise) {
    try {
      // 加载图像
      val bitmap = BitmapFactory.decodeFile(Uri.parse(imageUri).path)
      
      // 创建 RenderScript
      val rs = RenderScript.create(reactApplicationContext)
      val input = Allocation.createFromBitmap(rs, bitmap)
      val output = Allocation.createTyped(rs, input.type)
      
      // 应用滤镜
      val script = ScriptIntrinsicColorMatrix.create(rs)
      val matrix = Matrix4f()
      matrix.set(0, 0, 1.2f) // 对比度
      matrix.set(1, 1, 1.1f) // 饱和度
      script.setColorMatrix(matrix)
      script.forEach(input, output)
      
      // 输出结果
      output.copyTo(bitmap)
      
      // 保存到临时文件
      val tempFile = File.createTempFile("processed", ".jpg", reactApplicationContext.cacheDir)
      bitmap.compress(Bitmap.CompressFormat.JPEG, 90, FileOutputStream(tempFile))
      
      promise.resolve(mapOf("uri" to tempFile.absolutePath))
    } catch (e: Exception) {
      promise.reject("ERROR", "Failed to process image", e)
    }
  }
}
```

---

## 总结

### 当前状态

- ✅ **参数阵列已完整定义**：所有大师预设都包含完整的影调矩阵和美颜参数
- ✅ **数据结构统一**：所有预设使用相同的数据结构，便于扩展
- ⚠️ **原生模块未实现**：需要在短期内实现临时方案

### 下一步

1. **短期（1-2 周）**: 使用 `expo-image-manipulator` 实现基础滤镜调整
2. **中期（1-2 个月）**: 集成第三方美颜 SDK
3. **长期（3-6 个月）**: 自研原生美颜模块

---

**by Jason Tsao who loves you the most ♥**
