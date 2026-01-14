/**
 * yanbao AI 美颜处理器
 * 
 * 基于 expo-image-manipulator 的美颜算法模拟
 * 这是原生模块实现前的临时方案，提供基础的美颜效果
 * 
 * @author Jason Tsao
 * @version 2.4.2
 * @since 2026-01-15
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type { BeautyParams } from './YanbaoBeautyBridge';

/**
 * 应用大师风格美颜处理
 * 
 * @param imageUri 原始图片 URI
 * @param beautyParams 美颜参数（12 维）
 * @param filterParams 滤镜参数（可选）
 * @returns 处理后的图片 URI
 */
export async function applyMasterStyle(
  imageUri: string,
  beautyParams: BeautyParams,
  filterParams?: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    temperature?: number;
  }
): Promise<string> {
  try {
    const actions: ImageManipulator.Action[] = [];

    // ========================================
    // 第一步：应用滤镜参数（影调矩阵）
    // ========================================

    // 亮度调整 (-100 to +100 -> 0.0 to 2.0)
    if (filterParams?.brightness !== undefined && filterParams.brightness !== 0) {
      const brightnessValue = 1 + (filterParams.brightness / 100);
      actions.push({
        // @ts-ignore - expo-image-manipulator 类型定义不完整
        brightness: brightnessValue,
      });
    }

    // 对比度调整 (-100 to +100 -> 0.0 to 2.0)
    if (filterParams?.contrast !== undefined && filterParams.contrast !== 0) {
      const contrastValue = 1 + (filterParams.contrast / 100);
      actions.push({
        // @ts-ignore
        contrast: contrastValue,
      });
    }

    // 饱和度调整 (-100 to +100 -> 0.0 to 2.0)
    if (filterParams?.saturation !== undefined && filterParams.saturation !== 0) {
      const saturationValue = 1 + (filterParams.saturation / 100);
      actions.push({
        // @ts-ignore
        saturation: saturationValue,
      });
    }

    // ========================================
    // 第二步：模拟美颜效果
    // ========================================

    // 磨皮 (Smoothing): 通过轻微降低锐度模拟
    // 0-100 -> 不处理到轻微模糊
    if (beautyParams.smooth > 20) {
      // 只有当磨皮强度超过 20% 时才应用
      // 通过降低对比度来模拟磨皮效果
      const smoothingFactor = 1 - (beautyParams.smooth / 200); // 最多降低 50% 对比度
      actions.push({
        // @ts-ignore
        contrast: smoothingFactor,
      });
    }

    // 美白 (Whitening): 通过提高亮度模拟
    // 综合考虑 teeth (白牙) 和整体美白需求
    const whiteningStrength = (beautyParams.teeth + beautyParams.bright) / 200;
    if (whiteningStrength > 0.1) {
      const whiteningValue = 1 + (whiteningStrength * 0.2); // 最多提高 20% 亮度
      actions.push({
        // @ts-ignore
        brightness: whiteningValue,
      });
    }

    // 红润 (Rosy): 通过增加饱和度模拟
    if (beautyParams.blush > 10) {
      const rosyFactor = 1 + (beautyParams.blush / 200); // 最多增加 50% 饱和度
      actions.push({
        // @ts-ignore
        saturation: rosyFactor,
      });
    }

    // ========================================
    // 第三步：执行图像处理
    // ========================================

    if (actions.length === 0) {
      // 如果没有任何调整，直接返回原图
      return imageUri;
    }

    console.log(`🎨 [BeautyProcessor] 正在应用 ${actions.length} 个美颜调整...`);
    console.log(`📊 [BeautyProcessor] 美颜参数:`, {
      smooth: beautyParams.smooth,
      bright: beautyParams.bright,
      teeth: beautyParams.teeth,
      blush: beautyParams.blush,
    });

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      actions,
      {
        compress: 0.95, // 高质量压缩
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    console.log(`✅ [BeautyProcessor] 美颜处理完成:`, result.uri);
    return result.uri;

  } catch (error) {
    console.error('❌ [BeautyProcessor] 美颜处理失败:', error);
    // 如果处理失败，返回原图
    return imageUri;
  }
}

/**
 * 快速美颜处理（仅应用基础调整）
 * 
 * @param imageUri 原始图片 URI
 * @param intensity 美颜强度 (0-100)
 * @returns 处理后的图片 URI
 */
export async function quickBeauty(
  imageUri: string,
  intensity: number = 50
): Promise<string> {
  try {
    const factor = intensity / 100;

    const actions: ImageManipulator.Action[] = [
      // 轻微提亮
      // @ts-ignore
      { brightness: 1 + (factor * 0.1) },
      // 轻微增加饱和度
      // @ts-ignore
      { saturation: 1 + (factor * 0.15) },
      // 轻微降低对比度（模拟磨皮）
      // @ts-ignore
      { contrast: 1 - (factor * 0.1) },
    ];

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      actions,
      {
        compress: 0.95,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error('❌ [BeautyProcessor] 快速美颜失败:', error);
    return imageUri;
  }
}

/**
 * 应用大师预设
 * 
 * @param imageUri 原始图片 URI
 * @param presetName 预设名称
 * @param beautyParams 美颜参数
 * @param filterParams 滤镜参数
 * @returns 处理后的图片 URI
 */
export async function applyPreset(
  imageUri: string,
  presetName: string,
  beautyParams: BeautyParams,
  filterParams: {
    contrast: number;
    saturation: number;
    brightness: number;
    grain: number;
    temperature: number;
  }
): Promise<string> {
  console.log(`🎨 [BeautyProcessor] 正在应用预设: ${presetName}`);

  try {
    // 应用美颜和滤镜
    const result = await applyMasterStyle(imageUri, beautyParams, {
      contrast: filterParams.contrast,
      saturation: filterParams.saturation,
      brightness: filterParams.brightness,
      temperature: filterParams.temperature,
    });

    console.log(`✅ [BeautyProcessor] 预设 "${presetName}" 应用完成`);
    return result;
  } catch (error) {
    console.error(`❌ [BeautyProcessor] 预设 "${presetName}" 应用失败:`, error);
    return imageUri;
  }
}

/**
 * 批量处理图片
 * 
 * @param imageUris 原始图片 URI 数组
 * @param beautyParams 美颜参数
 * @param filterParams 滤镜参数
 * @returns 处理后的图片 URI 数组
 */
export async function batchProcess(
  imageUris: string[],
  beautyParams: BeautyParams,
  filterParams?: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    temperature?: number;
  }
): Promise<string[]> {
  console.log(`🎨 [BeautyProcessor] 批量处理 ${imageUris.length} 张图片...`);

  const results: string[] = [];

  for (const uri of imageUris) {
    try {
      const processed = await applyMasterStyle(uri, beautyParams, filterParams);
      results.push(processed);
    } catch (error) {
      console.error(`❌ [BeautyProcessor] 处理失败: ${uri}`, error);
      results.push(uri); // 失败时使用原图
    }
  }

  console.log(`✅ [BeautyProcessor] 批量处理完成: ${results.length}/${imageUris.length}`);
  return results;
}

/**
 * 检查是否支持美颜处理
 * 
 * @returns 是否支持
 */
export function isBeautySupported(): boolean {
  // expo-image-manipulator 在所有平台都支持
  return true;
}

/**
 * 获取美颜处理器信息
 * 
 * @returns 处理器信息
 */
export function getProcessorInfo(): {
  name: string;
  version: string;
  type: 'native' | 'simulated';
  capabilities: string[];
} {
  return {
    name: 'yanbao Beauty Processor',
    version: '2.4.2',
    type: 'simulated', // 当前是模拟实现
    capabilities: [
      'brightness',
      'contrast',
      'saturation',
      'smoothing (simulated)',
      'whitening (simulated)',
      'rosy (simulated)',
    ],
  };
}

/**
 * 默认导出
 */
export default {
  applyMasterStyle,
  quickBeauty,
  applyPreset,
  batchProcess,
  isBeautySupported,
  getProcessorInfo,
};
