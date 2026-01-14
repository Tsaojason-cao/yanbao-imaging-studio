import { useEffect, useState } from 'react';
import { Platform, PixelRatio } from 'react-native';
import * as Device from 'expo-device';

/**
 * 性能优化器
 * 根据设备性能自动调整渲染策略
 */
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private deviceTier: 'low' | 'mid' | 'high' = 'mid';
  private gpuAcceleration: boolean = true;

  private constructor() {
    this.detectDeviceTier();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * 检测设备性能等级
   */
  private detectDeviceTier() {
    const pixelRatio = PixelRatio.get();
    const deviceYear = Device.deviceYearClass || 2020;

    // 低端机型判断
    if (deviceYear < 2018 || pixelRatio < 2) {
      this.deviceTier = 'low';
      this.gpuAcceleration = false;
    }
    // 高端机型判断
    else if (deviceYear >= 2021 && pixelRatio >= 3) {
      this.deviceTier = 'high';
      this.gpuAcceleration = true;
    }
    // 中端机型
    else {
      this.deviceTier = 'mid';
      this.gpuAcceleration = true;
    }

    console.log(`[PerformanceOptimizer] Device Tier: ${this.deviceTier}, GPU Acceleration: ${this.gpuAcceleration}`);
  }

  /**
   * 获取设备性能等级
   */
  getDeviceTier(): 'low' | 'mid' | 'high' {
    return this.deviceTier;
  }

  /**
   * 是否启用 GPU 加速
   */
  isGPUAccelerationEnabled(): boolean {
    return this.gpuAcceleration;
  }

  /**
   * 获取推荐的图片质量
   */
  getRecommendedImageQuality(): number {
    switch (this.deviceTier) {
      case 'low':
        return 0.6; // 60% 质量
      case 'mid':
        return 0.8; // 80% 质量
      case 'high':
        return 1.0; // 100% 质量
    }
  }

  /**
   * 获取推荐的滤镜复杂度
   */
  getRecommendedFilterComplexity(): 'simple' | 'standard' | 'advanced' {
    switch (this.deviceTier) {
      case 'low':
        return 'simple'; // 简单滤镜（无 LUT）
      case 'mid':
        return 'standard'; // 标准滤镜（基础 LUT）
      case 'high':
        return 'advanced'; // 高级滤镜（完整 LUT + Shader）
    }
  }

  /**
   * 获取推荐的 FlashList 缓冲区大小
   */
  getRecommendedBufferSize(): number {
    switch (this.deviceTier) {
      case 'low':
        return 5; // 5 张图片缓冲
      case 'mid':
        return 10; // 10 张图片缓冲
      case 'high':
        return 20; // 20 张图片缓冲
    }
  }
}

/**
 * 使用性能优化器的 Hook
 */
export function usePerformanceOptimizer() {
  const [optimizer] = useState(() => PerformanceOptimizer.getInstance());
  const [deviceTier, setDeviceTier] = useState(optimizer.getDeviceTier());

  useEffect(() => {
    setDeviceTier(optimizer.getDeviceTier());
  }, [optimizer]);

  return {
    deviceTier,
    isGPUEnabled: optimizer.isGPUAccelerationEnabled(),
    imageQuality: optimizer.getRecommendedImageQuality(),
    filterComplexity: optimizer.getRecommendedFilterComplexity(),
    bufferSize: optimizer.getRecommendedBufferSize(),
  };
}
