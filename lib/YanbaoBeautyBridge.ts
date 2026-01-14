/**
 * yanbao AI 美颜模块 React Native 桥接
 * 
 * 连接 TypeScript 和原生模块（iOS/Android）
 * 
 * @author Jason Tsao
 * @version 2.3.0
 * @since 2026-01-14
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { YanbaoBeautyModule } = NativeModules;

// 创建事件发射器
const beautyEmitter = YanbaoBeautyModule 
  ? new NativeEventEmitter(YanbaoBeautyModule)
  : null;

/**
 * 美颜参数接口 (v2.3.0 - 12维专业美学引擎)
 */
export interface BeautyParams {
  // 原有 7 维美颜引擎
  smooth: number;   // 磨皮 (0-100)
  slim: number;     // 瘦脸 (0-100)
  eye: number;      // 大眼 (0-100)
  bright: number;   // 亮眼 (0-100)
  teeth: number;    // 白牙 (0-100)
  nose: number;     // 隆鼻 (0-100)
  blush: number;    // 红润 (0-100)
  
  // v2.3.0 新增 5 维专业美学引擎
  sculpting3D: number;          // 骨相立体 (0-100)
  textureRetention: number;     // 原生膚质保护 (0-100)
  teethWhiteningPro: number;    // 牙齿美白增强版 (0-100)
  darkCircleRemoval: number;    // 黑眼圈淡化 (0-100)
  hairlineAdjustment: number;   // 发际线修饰 (0-100)
}

/**
 * 滤镜参数接口
 */
export interface FilterParams {
  contrast: number;              // 对比度 (-100 to 100)
  saturation: number;            // 饱和度 (-100 to 100)
  brightness: number;            // 亮度 (-100 to 100)
  grain: number;                 // 颗粒感 (0-100)
  temperature: number;           // 色温 (-100 to 100)
  highlightSuppression: number;  // 高光抑制 (0-100)
  shadowCompensation: number;    // 阴影补偿 (0-100)
  vignette: number;              // 暗角 (0-100)
  hueShift: number;              // 色相偏移 (-100 to 100)
  sharpness: number;             // 锐度 (0-100)
  fade: number;                  // 褪色 (0-100)
}

/**
 * 相机参数接口
 */
export interface CameraParams {
  iso: number;
  shutter: string;
  aperture: string;
  whiteBalance: string;
  exposureCompensation: string;
}

/**
 * 大师预设参数接口
 */
export interface MasterPresetParams {
  beautyParams: BeautyParams;
  filterParams: FilterParams;
  cameraParams: CameraParams;
}

/**
 * 处理结果接口
 */
export interface ProcessResult {
  uri: string;
  width?: number;
  height?: number;
}

/**
 * yanbao AI 美颜桥接类
 */
export class YanbaoBeautyBridge {
  /**
   * 检查原生模块是否可用
   */
  static isAvailable(): boolean {
    return YanbaoBeautyModule !== null && YanbaoBeautyModule !== undefined;
  }

  /**
   * 获取模块信息
   */
  static getModuleInfo(): { version: string; platform: string } | null {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available');
      return null;
    }
    
    return {
      version: YanbaoBeautyModule.VERSION || '2.2.0',
      platform: YanbaoBeautyModule.PLATFORM || Platform.OS,
    };
  }

  /**
   * 设置美颜参数
   * 
   * @param params 美颜参数
   * @returns Promise<void>
   */
  static async setBeautyParams(params: BeautyParams): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, skipping setBeautyParams');
      return;
    }

    try {
      await YanbaoBeautyModule.setBeautyParams(params);
    } catch (error) {
      console.error('[YanbaoBeauty] setBeautyParams error:', error);
      throw error;
    }
  }

  /**
   * 应用大师预设
   * 
   * @param presetId 预设 ID
   * @param params 预设参数
   * @returns Promise<void>
   */
  static async applyMasterPreset(
    presetId: string,
    params: MasterPresetParams
  ): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, skipping applyMasterPreset');
      return;
    }

    try {
      await YanbaoBeautyModule.applyMasterPreset(presetId, params);
    } catch (error) {
      console.error('[YanbaoBeauty] applyMasterPreset error:', error);
      throw error;
    }
  }

  /**
   * 处理单帧图像
   * 
   * @param imageUri 图像 URI
   * @returns Promise<ProcessResult>
   */
  static async processFrame(imageUri: string): Promise<ProcessResult> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, returning original image');
      return { uri: imageUri };
    }

    try {
      const result = await YanbaoBeautyModule.processFrame(imageUri);
      return result;
    } catch (error) {
      console.error('[YanbaoBeauty] processFrame error:', error);
      throw error;
    }
  }

  /**
   * 批量处理图像
   * 
   * @param imageUris 图像 URI 数组
   * @returns Promise<ProcessResult[]>
   */
  static async processBatch(imageUris: string[]): Promise<ProcessResult[]> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, returning original images');
      return imageUris.map(uri => ({ uri }));
    }

    try {
      const result = await YanbaoBeautyModule.processBatch(imageUris);
      return result.results;
    } catch (error) {
      console.error('[YanbaoBeauty] processBatch error:', error);
      throw error;
    }
  }

  /**
   * 获取当前美颜参数
   * 
   * @returns Promise<{ beautyParams: BeautyParams; filterParams: FilterParams; presetId: string }>
   */
  static async getBeautyParams(): Promise<{
    beautyParams: BeautyParams;
    filterParams: FilterParams;
    presetId: string;
  }> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, returning default params');
      return {
        beautyParams: {
          smooth: 22,
          slim: 12,
          eye: 8,
          bright: 15,
          teeth: 10,
          nose: 5,
          blush: 12,
          // v2.3.0 新增
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
        presetId: 'preset_0_default',
      };
    }

    try {
      const result = await YanbaoBeautyModule.getBeautyParams();
      return result;
    } catch (error) {
      console.error('[YanbaoBeauty] getBeautyParams error:', error);
      throw error;
    }
  }

  /**
   * 重置美颜参数到默认值
   * 
   * @returns Promise<void>
   */
  static async resetBeautyParams(): Promise<void> {
    if (!this.isAvailable()) {
      console.warn('[YanbaoBeauty] Native module not available, skipping resetBeautyParams');
      return;
    }

    try {
      await YanbaoBeautyModule.resetBeautyParams();
    } catch (error) {
      console.error('[YanbaoBeauty] resetBeautyParams error:', error);
      throw error;
    }
  }

  /**
   * 监听帧处理完成事件
   * 
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  static onFrameProcessed(callback: (data: ProcessResult) => void): () => void {
    if (!beautyEmitter) {
      console.warn('[YanbaoBeauty] Event emitter not available');
      return () => {};
    }

    const subscription = beautyEmitter.addListener('onFrameProcessed', callback);
    return () => subscription.remove();
  }

  /**
   * 监听美颜参数变化事件
   * 
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  static onBeautyParamsChanged(callback: (params: BeautyParams) => void): () => void {
    if (!beautyEmitter) {
      console.warn('[YanbaoBeauty] Event emitter not available');
      return () => {};
    }

    const subscription = beautyEmitter.addListener('onBeautyParamsChanged', callback);
    return () => subscription.remove();
  }
}

/**
 * 默认导出
 */
export default YanbaoBeautyBridge;
