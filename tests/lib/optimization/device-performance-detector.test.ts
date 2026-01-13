/**
 * 设备性能检测器单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DevicePerformanceDetector, DevicePerformanceTier } from '@/lib/optimization/device-performance-detector';

describe('DevicePerformanceDetector', () => {
  let detector: DevicePerformanceDetector;

  beforeEach(() => {
    detector = new DevicePerformanceDetector();
  });

  describe('detectDevicePerformance', () => {
    it('should detect device performance profile', async () => {
      const profile = await detector.detectDevicePerformance();
      
      expect(profile).toBeDefined();
      expect(profile.tier).toMatch(/^(FLAGSHIP|HIGH_END|MID_RANGE|LOW_END|ULTRA_LOW_END)$/);
      expect(profile.ram).toBeGreaterThan(0);
      expect(profile.cpuCores).toBeGreaterThan(0);
      expect(profile.hasGPU).toEqual(expect.any(Boolean));
    });

    it('should classify device tier correctly', async () => {
      const profile = await detector.detectDevicePerformance();
      
      // 验证分类逻辑
      if (profile.ram >= 8 && profile.cpuCores >= 8) {
        expect([DevicePerformanceTier.FLAGSHIP, DevicePerformanceTier.HIGH_END]).toContain(profile.tier);
      } else if (profile.ram >= 4 && profile.cpuCores >= 4) {
        expect([DevicePerformanceTier.MID_RANGE, DevicePerformanceTier.HIGH_END]).toContain(profile.tier);
      }
    });

    it('should detect RAM correctly', async () => {
      const profile = await detector.detectDevicePerformance();
      
      expect(profile.ram).toBeGreaterThan(0);
      expect(profile.ram).toBeLessThanOrEqual(16);
    });

    it('should detect CPU cores correctly', async () => {
      const profile = await detector.detectDevicePerformance();
      
      expect(profile.cpuCores).toBeGreaterThan(0);
      expect(profile.cpuCores).toBeLessThanOrEqual(16);
    });
  });

  describe('getRecommendedSettings', () => {
    it('should return appropriate settings for low-end devices', async () => {
      const profile = await detector.detectDevicePerformance();
      const settings = detector.getRecommendedSettings(profile);
      
      expect(settings).toBeDefined();
      expect(settings.videoFps).toBeGreaterThan(0);
      expect(settings.videoFps).toBeLessThanOrEqual(60);
      expect(settings.samplingRate).toBeGreaterThan(0);
      expect(settings.samplingRate).toBeLessThanOrEqual(1);
      
      if (profile.tier === DevicePerformanceTier.LOW_END) {
        expect(settings.videoFps).toBeLessThanOrEqual(30);
        expect(settings.samplingRate).toBeLessThanOrEqual(0.5);
      }
    });

    it('should return high performance settings for flagship devices', async () => {
      const profile = await detector.detectDevicePerformance();
      const settings = detector.getRecommendedSettings(profile);
      
      if (profile.tier === DevicePerformanceTier.FLAGSHIP) {
        expect(settings.videoFps).toBeGreaterThanOrEqual(60);
        expect(settings.samplingRate).toBeGreaterThanOrEqual(0.8);
      }
    });
  });

  describe('monitorRuntime', () => {
    it('should monitor runtime performance', async () => {
      detector.startMonitoring();
      
      // 模拟一些处理
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const metrics = detector.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.cpuUsage).toBeLessThanOrEqual(100);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeLessThanOrEqual(100);
      
      detector.stopMonitoring();
    });

    it('should track memory usage over time', async () => {
      detector.startMonitoring();
      
      const initialMetrics = detector.getMetrics();
      
      // 模拟内存分配
      const arr = new Array(1000000).fill(0);
      
      const laterMetrics = detector.getMetrics();
      
      // 内存使用应该增加
      expect(laterMetrics.memoryUsage).toBeGreaterThanOrEqual(initialMetrics.memoryUsage);
      
      detector.stopMonitoring();
    });
  });

  describe('getDeviceProfile', () => {
    it('should return cached device profile', async () => {
      await detector.detectDevicePerformance();
      const profile = detector.getDeviceProfile();
      
      expect(profile).toBeDefined();
      expect(profile.tier).toBeDefined();
    });
  });

  describe('shouldUsePerformanceMode', () => {
    it('should recommend performance mode for low-end devices', async () => {
      await detector.detectDevicePerformance();
      const profile = detector.getDeviceProfile();
      
      if (profile.tier === DevicePerformanceTier.LOW_END) {
        expect(detector.shouldUsePerformanceMode()).toBe(true);
      }
    });

    it('should not recommend performance mode for flagship devices', async () => {
      await detector.detectDevicePerformance();
      const profile = detector.getDeviceProfile();
      
      if (profile.tier === DevicePerformanceTier.FLAGSHIP) {
        expect(detector.shouldUsePerformanceMode()).toBe(false);
      }
    });
  });
});
