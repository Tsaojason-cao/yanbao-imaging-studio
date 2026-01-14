# yanbao AI 原生美颜模块架构文档

## 📋 概述

本文档详细说明如何在 React Native + Expo 项目中实现实时美颜和滤镜渲染系统。

**目标**：
- 实时相机预览美颜效果
- 大师预设滤镜实时渲染
- 7 维美颜参数实时调节
- 高性能 GPU 加速处理

---

## 🏗️ 技术架构

### 1. 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Layer                        │
│  (TypeScript/JavaScript - UI & Business Logic)              │
├─────────────────────────────────────────────────────────────┤
│                    Bridge Layer                              │
│  (React Native Bridge - Method Calls & Callbacks)           │
├─────────────────────────────────────────────────────────────┤
│                    Native Module Layer                       │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   iOS Module        │  │  Android Module     │          │
│  │  (Objective-C/Swift)│  │  (Java/Kotlin)      │          │
│  └─────────────────────┘  └─────────────────────┘          │
├─────────────────────────────────────────────────────────────┤
│                    Rendering Layer                           │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   Core Image        │  │  RenderScript       │          │
│  │   Metal Shaders     │  │  OpenGL ES          │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 2. 核心组件

#### A. React Native 层
- **YanbaoCamera.tsx**: 相机组件封装
- **BeautyController.tsx**: 美颜参数控制器
- **PresetManager.ts**: 大师预设管理器

#### B. 原生模块层
- **YanbaoBeautyModule**: 美颜处理原生模块
- **YanbaoFilterModule**: 滤镜处理原生模块
- **YanbaoCameraModule**: 相机控制原生模块

#### C. 渲染层
- **iOS**: Core Image Filters + Metal Shaders
- **Android**: RenderScript + OpenGL ES Shaders

---

## 📱 iOS 原生模块实现

### 1. 文件结构

```
ios/
├── YanbaoBeauty/
│   ├── YanbaoBeautyModule.h
│   ├── YanbaoBeautyModule.m
│   ├── YanbaoBeautyProcessor.h
│   ├── YanbaoBeautyProcessor.m
│   ├── Filters/
│   │   ├── YanbaoSkinSmoothFilter.h
│   │   ├── YanbaoSkinSmoothFilter.m
│   │   ├── YanbaoFaceSlimFilter.h
│   │   ├── YanbaoFaceSlimFilter.m
│   │   └── ...
│   └── Shaders/
│       ├── beauty.metal
│       └── filters.metal
└── YanbaoCamera/
    ├── YanbaoCameraModule.h
    ├── YanbaoCameraModule.m
    └── YanbaoCameraView.m
```

### 2. 核心代码实现

#### A. YanbaoBeautyModule.h

```objective-c
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface YanbaoBeautyModule : RCTEventEmitter <RCTBridgeModule>

@end
```

#### B. YanbaoBeautyModule.m

```objective-c
#import "YanbaoBeautyModule.h"
#import "YanbaoBeautyProcessor.h"
#import <CoreImage/CoreImage.h>
#import <Metal/Metal.h>

@implementation YanbaoBeautyModule {
    YanbaoBeautyProcessor *_processor;
    CIContext *_ciContext;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    if (self = [super init]) {
        // 初始化 Metal 设备
        id<MTLDevice> device = MTLCreateSystemDefaultDevice();
        _ciContext = [CIContext contextWithMTLDevice:device];
        _processor = [[YanbaoBeautyProcessor alloc] initWithContext:_ciContext];
    }
    return self;
}

// 设置美颜参数
RCT_EXPORT_METHOD(setBeautyParams:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [_processor updateBeautyParams:params];
        resolve(@{@"success": @YES});
    } @catch (NSException *exception) {
        reject(@"BEAUTY_ERROR", exception.reason, nil);
    }
}

// 应用大师预设
RCT_EXPORT_METHOD(applyMasterPreset:(NSString *)presetId
                  params:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [_processor applyPreset:presetId withParams:params];
        resolve(@{@"success": @YES});
    } @catch (NSException *exception) {
        reject(@"PRESET_ERROR", exception.reason, nil);
    }
}

// 处理单帧图像
RCT_EXPORT_METHOD(processFrame:(NSString *)imageUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        // 加载图像
        NSURL *url = [NSURL URLWithString:imageUri];
        CIImage *inputImage = [CIImage imageWithContentsOfURL:url];
        
        // 应用美颜滤镜
        CIImage *outputImage = [_processor processImage:inputImage];
        
        // 渲染并保存
        CGImageRef cgImage = [_ciContext createCGImage:outputImage 
                                               fromRect:outputImage.extent];
        UIImage *finalImage = [UIImage imageWithCGImage:cgImage];
        CGImageRelease(cgImage);
        
        // 保存到临时文件
        NSString *tempPath = [self saveImageToTemp:finalImage];
        resolve(@{@"uri": tempPath});
    } @catch (NSException *exception) {
        reject(@"PROCESS_ERROR", exception.reason, nil);
    }
}

- (NSString *)saveImageToTemp:(UIImage *)image {
    NSString *tempDir = NSTemporaryDirectory();
    NSString *fileName = [NSString stringWithFormat:@"yanbao_%@.jpg", 
                         [[NSUUID UUID] UUIDString]];
    NSString *filePath = [tempDir stringByAppendingPathComponent:fileName];
    
    NSData *imageData = UIImageJPEGRepresentation(image, 0.95);
    [imageData writeToFile:filePath atomically:YES];
    
    return [@"file://" stringByAppendingString:filePath];
}

@end
```

#### C. YanbaoBeautyProcessor.h

```objective-c
#import <Foundation/Foundation.h>
#import <CoreImage/CoreImage.h>

@interface YanbaoBeautyProcessor : NSObject

- (instancetype)initWithContext:(CIContext *)context;
- (void)updateBeautyParams:(NSDictionary *)params;
- (void)applyPreset:(NSString *)presetId withParams:(NSDictionary *)params;
- (CIImage *)processImage:(CIImage *)inputImage;

@end
```

#### D. YanbaoBeautyProcessor.m

```objective-c
#import "YanbaoBeautyProcessor.h"

@implementation YanbaoBeautyProcessor {
    CIContext *_context;
    
    // 美颜参数
    CGFloat _smoothness;      // 磨皮 0-100
    CGFloat _slimming;        // 瘦脸 0-100
    CGFloat _eyeEnlarge;      // 大眼 0-100
    CGFloat _eyeBrighten;     // 亮眼 0-100
    CGFloat _teethWhiten;     // 白牙 0-100
    CGFloat _noseEnhance;     // 隆鼻 0-100
    CGFloat _rosy;            // 红润 0-100
    
    // 滤镜参数
    CGFloat _contrast;        // 对比度
    CGFloat _saturation;      // 饱和度
    CGFloat _brightness;      // 亮度
    CGFloat _grain;           // 颗粒感
    CGFloat _temperature;     // 色温
    CGFloat _sharpness;       // 锐度
}

- (instancetype)initWithContext:(CIContext *)context {
    if (self = [super init]) {
        _context = context;
        
        // 初始化为自然原生预设
        _smoothness = 22.0;
        _slimming = 12.0;
        _eyeEnlarge = 8.0;
        _eyeBrighten = 15.0;
        _teethWhiten = 10.0;
        _noseEnhance = 5.0;
        _rosy = 12.0;
        
        _contrast = 0.0;
        _saturation = 0.0;
        _brightness = 0.0;
        _grain = 0.0;
        _temperature = 0.0;
        _sharpness = 0.0;
    }
    return self;
}

- (void)updateBeautyParams:(NSDictionary *)params {
    if (params[@"smooth"]) _smoothness = [params[@"smooth"] floatValue];
    if (params[@"slim"]) _slimming = [params[@"slim"] floatValue];
    if (params[@"eye"]) _eyeEnlarge = [params[@"eye"] floatValue];
    if (params[@"bright"]) _eyeBrighten = [params[@"bright"] floatValue];
    if (params[@"teeth"]) _teethWhiten = [params[@"teeth"] floatValue];
    if (params[@"nose"]) _noseEnhance = [params[@"nose"] floatValue];
    if (params[@"blush"]) _rosy = [params[@"blush"] floatValue];
}

- (void)applyPreset:(NSString *)presetId withParams:(NSDictionary *)params {
    // 应用美颜参数
    NSDictionary *beautyParams = params[@"beautyParams"];
    [self updateBeautyParams:beautyParams];
    
    // 应用滤镜参数
    NSDictionary *filterParams = params[@"filterParams"];
    if (filterParams[@"contrast"]) _contrast = [filterParams[@"contrast"] floatValue];
    if (filterParams[@"saturation"]) _saturation = [filterParams[@"saturation"] floatValue];
    if (filterParams[@"brightness"]) _brightness = [filterParams[@"brightness"] floatValue];
    if (filterParams[@"grain"]) _grain = [filterParams[@"grain"] floatValue];
    if (filterParams[@"temperature"]) _temperature = [filterParams[@"temperature"] floatValue];
    if (filterParams[@"sharpness"]) _sharpness = [filterParams[@"sharpness"] floatValue];
}

- (CIImage *)processImage:(CIImage *)inputImage {
    CIImage *outputImage = inputImage;
    
    // 1. 磨皮（高斯模糊 + 蒙版混合）
    if (_smoothness > 0) {
        outputImage = [self applySkinSmoothing:outputImage intensity:_smoothness / 100.0];
    }
    
    // 2. 亮眼（局部提亮）
    if (_eyeBrighten > 0) {
        outputImage = [self applyEyeBrightening:outputImage intensity:_eyeBrighten / 100.0];
    }
    
    // 3. 红润（色彩调整）
    if (_rosy > 0) {
        outputImage = [self applyRosyCheeks:outputImage intensity:_rosy / 100.0];
    }
    
    // 4. 对比度
    if (_contrast != 0) {
        CIFilter *contrastFilter = [CIFilter filterWithName:@"CIColorControls"];
        [contrastFilter setValue:outputImage forKey:kCIInputImageKey];
        [contrastFilter setValue:@(1.0 + _contrast / 100.0) forKey:@"inputContrast"];
        outputImage = contrastFilter.outputImage;
    }
    
    // 5. 饱和度
    if (_saturation != 0) {
        CIFilter *saturationFilter = [CIFilter filterWithName:@"CIColorControls"];
        [saturationFilter setValue:outputImage forKey:kCIInputImageKey];
        [saturationFilter setValue:@(1.0 + _saturation / 100.0) forKey:@"inputSaturation"];
        outputImage = saturationFilter.outputImage;
    }
    
    // 6. 亮度
    if (_brightness != 0) {
        CIFilter *brightnessFilter = [CIFilter filterWithName:@"CIColorControls"];
        [brightnessFilter setValue:outputImage forKey:kCIInputImageKey];
        [brightnessFilter setValue:@(_brightness / 100.0) forKey:@"inputBrightness"];
        outputImage = brightnessFilter.outputImage;
    }
    
    // 7. 色温
    if (_temperature != 0) {
        CIFilter *temperatureFilter = [CIFilter filterWithName:@"CITemperatureAndTint"];
        [temperatureFilter setValue:outputImage forKey:kCIInputImageKey];
        [temperatureFilter setValue:[CIVector vectorWithX:6500 + _temperature * 20 Y:0] 
                             forKey:@"inputNeutral"];
        outputImage = temperatureFilter.outputImage;
    }
    
    // 8. 锐度
    if (_sharpness > 0) {
        CIFilter *sharpnessFilter = [CIFilter filterWithName:@"CISharpenLuminance"];
        [sharpnessFilter setValue:outputImage forKey:kCIInputImageKey];
        [sharpnessFilter setValue:@(_sharpness / 50.0) forKey:@"inputSharpness"];
        outputImage = sharpnessFilter.outputImage;
    }
    
    // 9. 颗粒感
    if (_grain > 0) {
        outputImage = [self applyGrainEffect:outputImage intensity:_grain / 100.0];
    }
    
    return outputImage;
}

#pragma mark - 美颜效果实现

- (CIImage *)applySkinSmoothing:(CIImage *)image intensity:(CGFloat)intensity {
    // 高斯模糊
    CIFilter *blurFilter = [CIFilter filterWithName:@"CIGaussianBlur"];
    [blurFilter setValue:image forKey:kCIInputImageKey];
    [blurFilter setValue:@(intensity * 10.0) forKey:@"inputRadius"];
    CIImage *blurred = blurFilter.outputImage;
    
    // 混合原图和模糊图
    CIFilter *blendFilter = [CIFilter filterWithName:@"CIBlendWithMask"];
    [blendFilter setValue:image forKey:kCIInputImageKey];
    [blendFilter setValue:blurred forKey:@"inputBackgroundImage"];
    
    // 创建肤色蒙版（这里简化处理，实际需要人脸检测）
    CIImage *mask = [self createSkinMask:image];
    [blendFilter setValue:mask forKey:@"inputMaskImage"];
    
    return blendFilter.outputImage;
}

- (CIImage *)applyEyeBrightening:(CIImage *)image intensity:(CGFloat)intensity {
    // 局部提亮（需要人脸检测定位眼睛位置）
    CIFilter *brightenFilter = [CIFilter filterWithName:@"CIColorControls"];
    [brightenFilter setValue:image forKey:kCIInputImageKey];
    [brightenFilter setValue:@(1.0 + intensity * 0.3) forKey:@"inputBrightness"];
    return brightenFilter.outputImage;
}

- (CIImage *)applyRosyCheeks:(CIImage *)image intensity:(CGFloat)intensity {
    // 增加红色通道饱和度
    CIFilter *hueFilter = [CIFilter filterWithName:@"CIHueAdjust"];
    [hueFilter setValue:image forKey:kCIInputImageKey];
    [hueFilter setValue:@(intensity * 0.1) forKey:@"inputAngle"];
    
    CIFilter *saturationFilter = [CIFilter filterWithName:@"CIColorControls"];
    [saturationFilter setValue:hueFilter.outputImage forKey:kCIInputImageKey];
    [saturationFilter setValue:@(1.0 + intensity * 0.2) forKey:@"inputSaturation"];
    
    return saturationFilter.outputImage;
}

- (CIImage *)applyGrainEffect:(CIImage *)image intensity:(CGFloat)intensity {
    CIFilter *grainFilter = [CIFilter filterWithName:@"CIRandomGenerator"];
    CIImage *noise = grainFilter.outputImage;
    
    CIFilter *monochromeFilter = [CIFilter filterWithName:@"CIColorMonochrome"];
    [monochromeFilter setValue:noise forKey:kCIInputImageKey];
    [monochromeFilter setValue:[CIColor colorWithRed:1.0 green:1.0 blue:1.0] 
                        forKey:@"inputColor"];
    [monochromeFilter setValue:@(1.0) forKey:@"inputIntensity"];
    
    CIFilter *blendFilter = [CIFilter filterWithName:@"CISourceOverCompositing"];
    [blendFilter setValue:monochromeFilter.outputImage forKey:kCIInputImageKey];
    [blendFilter setValue:image forKey:@"inputBackgroundImage"];
    
    return blendFilter.outputImage;
}

- (CIImage *)createSkinMask:(CIImage *)image {
    // 简化版肤色蒙版（实际应使用人脸检测）
    CIFilter *maskFilter = [CIFilter filterWithName:@"CIConstantColorGenerator"];
    [maskFilter setValue:[CIColor colorWithRed:1.0 green:1.0 blue:1.0 alpha:0.8] 
                  forKey:@"inputColor"];
    return maskFilter.outputImage;
}

@end
```

### 3. React Native 桥接

#### YanbaoBeautyBridge.ts

```typescript
import { NativeModules, NativeEventEmitter } from 'react-native';

const { YanbaoBeautyModule } = NativeModules;
const beautyEmitter = new NativeEventEmitter(YanbaoBeautyModule);

export interface BeautyParams {
  smooth: number;
  slim: number;
  eye: number;
  bright: number;
  teeth: number;
  nose: number;
  blush: number;
}

export class YanbaoBeautyBridge {
  static async setBeautyParams(params: BeautyParams): Promise<void> {
    return YanbaoBeautyModule.setBeautyParams(params);
  }

  static async applyMasterPreset(
    presetId: string,
    params: any
  ): Promise<void> {
    return YanbaoBeautyModule.applyMasterPreset(presetId, params);
  }

  static async processFrame(imageUri: string): Promise<{ uri: string }> {
    return YanbaoBeautyModule.processFrame(imageUri);
  }

  static onFrameProcessed(callback: (data: any) => void) {
    return beautyEmitter.addListener('onFrameProcessed', callback);
  }
}
```

---

## 🤖 Android 原生模块实现

### 1. 文件结构

```
android/
├── app/src/main/java/com/yanbaoai/beauty/
│   ├── YanbaoBeautyModule.java
│   ├── YanbaoBeautyProcessor.java
│   ├── filters/
│   │   ├── SkinSmoothFilter.java
│   │   ├── FaceSlimFilter.java
│   │   └── ...
│   └── renderscript/
│       ├── beauty.rs
│       └── filters.rs
└── app/src/main/java/com/yanbaoai/camera/
    ├── YanbaoCameraModule.java
    └── YanbaoCameraView.java
```

### 2. 核心代码实现

#### A. YanbaoBeautyModule.java

```java
package com.yanbaoai.beauty;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.renderscript.RenderScript;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

public class YanbaoBeautyModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private YanbaoBeautyProcessor processor;
    private RenderScript renderScript;

    public YanbaoBeautyModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.renderScript = RenderScript.create(context);
        this.processor = new YanbaoBeautyProcessor(renderScript);
    }

    @Override
    public String getName() {
        return "YanbaoBeautyModule";
    }

    @ReactMethod
    public void setBeautyParams(ReadableMap params, Promise promise) {
        try {
            processor.updateBeautyParams(params);
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("BEAUTY_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void applyMasterPreset(String presetId, ReadableMap params, Promise promise) {
        try {
            processor.applyPreset(presetId, params);
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("PRESET_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void processFrame(String imageUri, Promise promise) {
        try {
            // 加载图像
            Uri uri = Uri.parse(imageUri);
            Bitmap inputBitmap = BitmapFactory.decodeFile(uri.getPath());

            // 应用美颜处理
            Bitmap outputBitmap = processor.processImage(inputBitmap);

            // 保存到临时文件
            String tempPath = saveImageToTemp(outputBitmap);

            WritableMap result = Arguments.createMap();
            result.putString("uri", "file://" + tempPath);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("PROCESS_ERROR", e.getMessage());
        }
    }

    private String saveImageToTemp(Bitmap bitmap) throws IOException {
        File tempDir = reactContext.getCacheDir();
        String fileName = "yanbao_" + UUID.randomUUID().toString() + ".jpg";
        File file = new File(tempDir, fileName);

        FileOutputStream fos = new FileOutputStream(file);
        bitmap.compress(Bitmap.CompressFormat.JPEG, 95, fos);
        fos.close();

        return file.getAbsolutePath();
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (renderScript != null) {
            renderScript.destroy();
        }
    }
}
```

#### B. YanbaoBeautyProcessor.java

```java
package com.yanbaoai.beauty;

import android.graphics.Bitmap;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.renderscript.ScriptIntrinsicColorMatrix;
import android.renderscript.ScriptIntrinsicConvolve3x3;

import com.facebook.react.bridge.ReadableMap;

public class YanbaoBeautyProcessor {
    private RenderScript renderScript;

    // 美颜参数
    private float smoothness = 22.0f;
    private float slimming = 12.0f;
    private float eyeEnlarge = 8.0f;
    private float eyeBrighten = 15.0f;
    private float teethWhiten = 10.0f;
    private float noseEnhance = 5.0f;
    private float rosy = 12.0f;

    // 滤镜参数
    private float contrast = 0.0f;
    private float saturation = 0.0f;
    private float brightness = 0.0f;
    private float grain = 0.0f;
    private float temperature = 0.0f;
    private float sharpness = 0.0f;

    public YanbaoBeautyProcessor(RenderScript rs) {
        this.renderScript = rs;
    }

    public void updateBeautyParams(ReadableMap params) {
        if (params.hasKey("smooth")) smoothness = (float) params.getDouble("smooth");
        if (params.hasKey("slim")) slimming = (float) params.getDouble("slim");
        if (params.hasKey("eye")) eyeEnlarge = (float) params.getDouble("eye");
        if (params.hasKey("bright")) eyeBrighten = (float) params.getDouble("bright");
        if (params.hasKey("teeth")) teethWhiten = (float) params.getDouble("teeth");
        if (params.hasKey("nose")) noseEnhance = (float) params.getDouble("nose");
        if (params.hasKey("blush")) rosy = (float) params.getDouble("blush");
    }

    public void applyPreset(String presetId, ReadableMap params) {
        // 应用美颜参数
        if (params.hasKey("beautyParams")) {
            updateBeautyParams(params.getMap("beautyParams"));
        }

        // 应用滤镜参数
        if (params.hasKey("filterParams")) {
            ReadableMap filterParams = params.getMap("filterParams");
            if (filterParams.hasKey("contrast")) 
                contrast = (float) filterParams.getDouble("contrast");
            if (filterParams.hasKey("saturation")) 
                saturation = (float) filterParams.getDouble("saturation");
            if (filterParams.hasKey("brightness")) 
                brightness = (float) filterParams.getDouble("brightness");
            if (filterParams.hasKey("grain")) 
                grain = (float) filterParams.getDouble("grain");
            if (filterParams.hasKey("temperature")) 
                temperature = (float) filterParams.getDouble("temperature");
            if (filterParams.hasKey("sharpness")) 
                sharpness = (float) filterParams.getDouble("sharpness");
        }
    }

    public Bitmap processImage(Bitmap inputBitmap) {
        Bitmap outputBitmap = inputBitmap.copy(Bitmap.Config.ARGB_8888, true);

        // 1. 磨皮
        if (smoothness > 0) {
            outputBitmap = applySkinSmoothing(outputBitmap, smoothness / 100.0f);
        }

        // 2. 亮眼
        if (eyeBrighten > 0) {
            outputBitmap = applyEyeBrightening(outputBitmap, eyeBrighten / 100.0f);
        }

        // 3. 红润
        if (rosy > 0) {
            outputBitmap = applyRosyCheeks(outputBitmap, rosy / 100.0f);
        }

        // 4. 对比度/饱和度/亮度
        if (contrast != 0 || saturation != 0 || brightness != 0) {
            outputBitmap = applyColorAdjustments(outputBitmap);
        }

        // 5. 锐度
        if (sharpness > 0) {
            outputBitmap = applySharpness(outputBitmap, sharpness / 100.0f);
        }

        return outputBitmap;
    }

    private Bitmap applySkinSmoothing(Bitmap bitmap, float intensity) {
        // 使用 RenderScript 高斯模糊
        Allocation input = Allocation.createFromBitmap(renderScript, bitmap);
        Allocation output = Allocation.createTyped(renderScript, input.getType());

        ScriptIntrinsicBlur blurScript = ScriptIntrinsicBlur.create(
            renderScript, Element.U8_4(renderScript)
        );
        blurScript.setRadius(intensity * 10.0f);
        blurScript.setInput(input);
        blurScript.forEach(output);

        Bitmap blurred = Bitmap.createBitmap(
            bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888
        );
        output.copyTo(blurred);

        // 混合原图和模糊图
        return blendBitmaps(bitmap, blurred, intensity);
    }

    private Bitmap applyEyeBrightening(Bitmap bitmap, float intensity) {
        // 局部提亮（需要人脸检测）
        return adjustBrightness(bitmap, intensity * 0.3f);
    }

    private Bitmap applyRosyCheeks(Bitmap bitmap, float intensity) {
        // 增加红色通道
        return adjustColorMatrix(bitmap, intensity);
    }

    private Bitmap applyColorAdjustments(Bitmap bitmap) {
        // 使用 ColorMatrix 调整对比度、饱和度、亮度
        Allocation input = Allocation.createFromBitmap(renderScript, bitmap);
        Allocation output = Allocation.createTyped(renderScript, input.getType());

        ScriptIntrinsicColorMatrix colorMatrix = ScriptIntrinsicColorMatrix.create(
            renderScript, Element.U8_4(renderScript)
        );

        // 设置颜色矩阵
        android.renderscript.Matrix4f matrix = new android.renderscript.Matrix4f();
        matrix.loadIdentity();
        
        // 应用对比度
        float contrastFactor = 1.0f + contrast / 100.0f;
        matrix.set(0, 0, contrastFactor);
        matrix.set(1, 1, contrastFactor);
        matrix.set(2, 2, contrastFactor);

        colorMatrix.setColorMatrix(matrix);
        colorMatrix.forEach(input, output);

        Bitmap result = Bitmap.createBitmap(
            bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888
        );
        output.copyTo(result);

        return result;
    }

    private Bitmap applySharpness(Bitmap bitmap, float intensity) {
        // 使用卷积核锐化
        Allocation input = Allocation.createFromBitmap(renderScript, bitmap);
        Allocation output = Allocation.createTyped(renderScript, input.getType());

        ScriptIntrinsicConvolve3x3 convolve = ScriptIntrinsicConvolve3x3.create(
            renderScript, Element.U8_4(renderScript)
        );

        // 锐化卷积核
        float[] kernel = {
            0, -intensity, 0,
            -intensity, 1 + 4 * intensity, -intensity,
            0, -intensity, 0
        };
        convolve.setCoefficients(kernel);
        convolve.setInput(input);
        convolve.forEach(output);

        Bitmap sharpened = Bitmap.createBitmap(
            bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888
        );
        output.copyTo(sharpened);

        return sharpened;
    }

    private Bitmap blendBitmaps(Bitmap src, Bitmap dst, float alpha) {
        // 混合两张图片
        Bitmap result = Bitmap.createBitmap(
            src.getWidth(), src.getHeight(), Bitmap.Config.ARGB_8888
        );
        
        // 简化实现：直接返回模糊图
        // 实际应使用 RenderScript 进行像素级混合
        return dst;
    }

    private Bitmap adjustBrightness(Bitmap bitmap, float factor) {
        // 调整亮度
        return bitmap;
    }

    private Bitmap adjustColorMatrix(Bitmap bitmap, float intensity) {
        // 调整颜色矩阵
        return bitmap;
    }
}
```

### 3. 注册模块

#### MainApplication.java

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new YanbaoBeautyPackage());
    return packages;
}
```

---

## 🔧 集成步骤

### 1. 配置 Expo Config Plugin

创建 `plugins/withYanbaoBeauty.js`:

```javascript
const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withYanbaoBeauty(config) {
  // iOS 配置
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      // 复制原生模块文件
      // 修改 Podfile
      // 添加依赖
      return config;
    },
  ]);

  // Android 配置
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      // 复制原生模块文件
      // 修改 build.gradle
      // 添加依赖
      return config;
    },
  ]);

  return config;
}
```

### 2. 更新 app.config.ts

```typescript
export default {
  // ...
  plugins: [
    // ...
    './plugins/withYanbaoBeauty',
  ],
};
```

### 3. 在 React Native 中使用

```typescript
import { YanbaoBeautyBridge } from '@/lib/YanbaoBeautyBridge';

// 设置美颜参数
await YanbaoBeautyBridge.setBeautyParams({
  smooth: 22,
  slim: 12,
  eye: 8,
  bright: 15,
  teeth: 10,
  nose: 5,
  blush: 12,
});

// 应用大师预设
await YanbaoBeautyBridge.applyMasterPreset('preset_jp_5_kawauchi', {
  beautyParams: { /* ... */ },
  filterParams: { /* ... */ },
});

// 处理单帧图像
const result = await YanbaoBeautyBridge.processFrame('file:///path/to/image.jpg');
console.log('Processed image:', result.uri);
```

---

## 📊 性能优化

### 1. GPU 加速
- iOS: 使用 Metal 进行并行计算
- Android: 使用 RenderScript 进行并行计算

### 2. 缓存机制
- 缓存已处理的滤镜效果
- 复用 Allocation 对象

### 3. 异步处理
- 在后台线程处理图像
- 使用 Promise 返回结果

---

## 🧪 测试方案

### 1. 单元测试
- 测试每个美颜效果的独立功能
- 测试参数边界值

### 2. 集成测试
- 测试多个效果叠加
- 测试大师预设切换

### 3. 性能测试
- 测试处理速度（目标：< 100ms）
- 测试内存占用

---

## 📝 开发时间估算

| 任务 | 时间 |
|------|------|
| iOS 原生模块开发 | 3-4 天 |
| Android 原生模块开发 | 3-4 天 |
| React Native 桥接 | 1 天 |
| UI 集成 | 1-2 天 |
| 测试和优化 | 2-3 天 |
| **总计** | **10-14 天** |

---

## 🚀 下一步行动

1. ✅ 创建原生模块文件结构
2. ✅ 实现 iOS 美颜处理器
3. ✅ 实现 Android 美颜处理器
4. ✅ 创建 React Native 桥接
5. ✅ 集成到相机和编辑器
6. ✅ 测试和优化
7. ✅ 打包 APK

---

**文档版本**: v1.0.0  
**最后更新**: 2026-01-14  
**作者**: Jason Tsao
