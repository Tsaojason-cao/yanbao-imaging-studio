/**
 * Yanbao AI Ultimate Edition - Beauty Engine
 * 超越工业标准的影像算法引擎
 * 
 * 核心特性：
 * 1. 质感保留磨皮算法（Texture-Preserving Smoothing）
 * 2. 动态范围优化（HDR Enhancement）
 * 3. 场景自适应参数（Scene-Aware Parameters）
 */

export interface BeautyParams {
  skin: number;      // 肤质 (0-100)
  light: number;     // 光影 (0-100)
  bone: number;      // 骨相 (0-100)
  color: number;     // 色彩 (0-100)
  whitening: number; // 美白 (0-100)
  eye: number;       // 大眼 (0-100)
  face: number;      // 瘦脸 (0-100)
}

export interface AdvancedBeautyParams extends BeautyParams {
  texturePreservation: number; // 质感保留强度 (0-100)
  hdrIntensity: number;        // HDR强度 (0-100)
  highlightSuppression: number; // 高光抑制 (0-100)
  shadowDetail: number;         // 暗部细节 (0-100)
}

/**
 * 场景类型枚举
 */
export enum SceneType {
  OUTDOOR_BRIGHT = 'outdoor_bright',     // 户外强光（北京/杭州夏日）
  OUTDOOR_CLOUDY = 'outdoor_cloudy',     // 户外阴天
  INDOOR_CAFE = 'indoor_cafe',           // 室内咖啡馆
  INDOOR_DARK = 'indoor_dark',           // 室内暗光
  GOLDEN_HOUR = 'golden_hour',           // 黄金时刻
  NIGHT = 'night',                       // 夜景
}

/**
 * 场景识别结果
 */
export interface SceneAnalysis {
  type: SceneType;
  brightness: number;      // 亮度 (0-100)
  contrast: number;        // 对比度 (0-100)
  colorTemperature: number; // 色温 (K)
  confidence: number;      // 识别置信度 (0-1)
}

/**
 * 质感保留磨皮算法
 * 
 * 原理：使用双边滤波（Bilateral Filter）+ 高频细节保留
 * - 在平滑皮肤的同时，保留毛孔、纹理等高频细节
 * - 避免"塑料感"假脸效果
 * 
 * @param intensity 磨皮强度 (0-100)
 * @param texturePreservation 质感保留强度 (0-100)
 * @returns 优化后的参数配置
 */
export function calculateTexturePreservingSmoothness(
  intensity: number,
  texturePreservation: number
): {
  spatialSigma: number;
  rangeSigma: number;
  detailBoost: number;
} {
  // 空间域标准差：控制平滑范围
  const spatialSigma = (intensity / 100) * 10 + 5;
  
  // 值域标准差：控制边缘保留
  const rangeSigma = (texturePreservation / 100) * 50 + 10;
  
  // 细节增强：补偿过度平滑
  const detailBoost = (texturePreservation / 100) * 0.3;
  
  return { spatialSigma, rangeSigma, detailBoost };
}

/**
 * HDR动态范围优化
 * 
 * 针对北京/杭州常见的户外光影场景：
 * - 高光抑制：防止天空过曝
 * - 暗部提升：保留阴影细节
 * - 局部对比度增强：营造电影质感
 * 
 * @param scene 场景分析结果
 * @returns HDR优化参数
 */
export function calculateHDRParameters(scene: SceneAnalysis): {
  highlightCompression: number;
  shadowLift: number;
  localContrast: number;
  toneCurve: 'linear' | 'film' | 'vivid';
} {
  let highlightCompression = 0;
  let shadowLift = 0;
  let localContrast = 0;
  let toneCurve: 'linear' | 'film' | 'vivid' = 'linear';
  
  switch (scene.type) {
    case SceneType.OUTDOOR_BRIGHT:
      // 北京/杭州夏日强光：强力高光抑制
      highlightCompression = 0.7;
      shadowLift = 0.3;
      localContrast = 0.6;
      toneCurve = 'film'; // 电影质感
      break;
      
    case SceneType.OUTDOOR_CLOUDY:
      // 阴天：轻微提升对比度
      highlightCompression = 0.3;
      shadowLift = 0.4;
      localContrast = 0.5;
      toneCurve = 'vivid';
      break;
      
    case SceneType.INDOOR_CAFE:
      // 咖啡馆：保留温暖氛围，提升暗部
      highlightCompression = 0.2;
      shadowLift = 0.6;
      localContrast = 0.4;
      toneCurve = 'film';
      break;
      
    case SceneType.INDOOR_DARK:
      // 暗光：最大化暗部细节
      highlightCompression = 0.1;
      shadowLift = 0.8;
      localContrast = 0.7;
      toneCurve = 'vivid';
      break;
      
    case SceneType.GOLDEN_HOUR:
      // 黄金时刻：保留自然光影
      highlightCompression = 0.4;
      shadowLift = 0.2;
      localContrast = 0.5;
      toneCurve = 'film';
      break;
      
    case SceneType.NIGHT:
      // 夜景：降噪 + 暗部提升
      highlightCompression = 0.5;
      shadowLift = 0.7;
      localContrast = 0.6;
      toneCurve = 'vivid';
      break;
  }
  
  return { highlightCompression, shadowLift, localContrast, toneCurve };
}

/**
 * 场景智能识别
 * 
 * 基于环境光传感器数据和图像分析
 * 
 * @param brightness 环境亮度 (lux)
 * @param colorTemp 色温 (K)
 * @returns 场景分析结果
 */
export function analyzeScene(
  brightness: number,
  colorTemp: number = 5500
): SceneAnalysis {
  let type: SceneType;
  let contrast = 50;
  let confidence = 0.8;
  
  // 基于亮度判断场景
  if (brightness > 10000) {
    type = SceneType.OUTDOOR_BRIGHT;
    contrast = 70;
  } else if (brightness > 5000) {
    type = SceneType.OUTDOOR_CLOUDY;
    contrast = 50;
  } else if (brightness > 500) {
    // 根据色温细分室内场景
    if (colorTemp > 4000) {
      type = SceneType.INDOOR_CAFE; // 暖光
    } else {
      type = SceneType.INDOOR_DARK;
    }
    contrast = 40;
  } else if (brightness > 50) {
    type = SceneType.GOLDEN_HOUR;
    contrast = 60;
  } else {
    type = SceneType.NIGHT;
    contrast = 30;
  }
  
  return {
    type,
    brightness: Math.min(brightness / 100, 100),
    contrast,
    colorTemperature: colorTemp,
    confidence,
  };
}

/**
 * 机位场景自适应参数推荐
 * 
 * 根据机位类型和当前场景，推荐最佳拍摄参数
 * 
 * @param spotType 机位类型（如"咖啡馆"、"江景"）
 * @param scene 当前场景分析
 * @returns 推荐的美颜和拍摄参数
 */
export function recommendParametersForSpot(
  spotType: string,
  scene: SceneAnalysis
): {
  beautyParams: Partial<AdvancedBeautyParams>;
  cameraSettings: {
    exposureCompensation: number; // 曝光补偿 (-2.0 ~ +2.0)
    iso: number;
    filter: string; // 滤镜名称
  };
} {
  // 默认参数
  let beautyParams: Partial<AdvancedBeautyParams> = {
    skin: 50,
    texturePreservation: 70, // 默认保留70%质感
    hdrIntensity: 60,
  };
  
  let cameraSettings = {
    exposureCompensation: 0,
    iso: 400,
    filter: '自然',
  };
  
  // 根据机位类型定制
  if (spotType.includes('咖啡') || spotType.includes('cafe')) {
    beautyParams = {
      ...beautyParams,
      skin: 55,
      whitening: 40,
      texturePreservation: 75,
    };
    cameraSettings = {
      exposureCompensation: -0.3, // 降低0.3曝光，保留氛围
      iso: 800,
      filter: '富士复古', // 温暖复古感
    };
  } else if (spotType.includes('江') || spotType.includes('湖') || spotType.includes('river')) {
    beautyParams = {
      ...beautyParams,
      color: 60,
      hdrIntensity: 80, // 强HDR处理水面反光
    };
    cameraSettings = {
      exposureCompensation: 0,
      iso: 200,
      filter: '清新',
    };
  } else if (spotType.includes('夜') || spotType.includes('night')) {
    beautyParams = {
      ...beautyParams,
      skin: 60,
      light: 50,
      shadowDetail: 80,
    };
    cameraSettings = {
      exposureCompensation: 0.7,
      iso: 3200,
      filter: '电影',
    };
  }
  
  return { beautyParams, cameraSettings };
}

/**
 * 峰值对焦（Focus Peaking）参数计算
 * 
 * 根据环境光线自动调节高亮边缘的灵敏度
 * 
 * @param brightness 环境亮度
 * @returns 对焦辅助参数
 */
export function calculateFocusPeakingParams(brightness: number): {
  threshold: number;      // 边缘检测阈值
  highlightColor: string; // 高亮颜色
  opacity: number;        // 不透明度
} {
  let threshold = 0.3;
  let opacity = 0.6;
  
  // 根据亮度调节灵敏度
  if (brightness < 100) {
    // 暗光：降低阈值，提高灵敏度
    threshold = 0.2;
    opacity = 0.8;
  } else if (brightness > 5000) {
    // 强光：提高阈值，避免误判
    threshold = 0.4;
    opacity = 0.5;
  }
  
  return {
    threshold,
    highlightColor: '#00FF00', // 绿色高亮（专业相机标准）
    opacity,
  };
}
