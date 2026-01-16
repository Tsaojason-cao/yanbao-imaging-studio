/**
 * Master Matrix Engine - 大师参数数据库引擎
 * 
 * 核心功能：
 * - 存储31位大师的完整参数矩阵
 * - 跨模块调用（相机、编辑、相册）
 * - 参数同步与存取
 * - 12维美颜数据集成
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MASTER_PRESETS, type MasterPreset } from '@/constants/master-presets';

/**
 * 12维美颜参数接口
 */
export interface BeautyParams {
  eyes: number;           // 大眼 (0-100)
  face: number;           // 瘦脸 (0-100)
  narrow: number;         // 窄脸 (0-100)
  chin: number;           // 下巴 (0-100)
  forehead: number;       // 额头 (0-100)
  philtrum: number;       // 人中 (0-100)
  nose: number;           // 瘦鼻 (0-100)
  noseLength: number;     // 鼻长 (0-100)
  mouth: number;          // 嘴型 (0-100)
  eyeCorner: number;      // 眼角 (0-100)
  eyeDistance: number;    // 眼距 (0-100)
  skinBrightness: number; // 肤色亮度 (0-100)
}

/**
 * 照片元数据接口
 */
export interface PhotoMetadata {
  id: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  masterPreset: {
    id: number;
    name: string;
    params: MasterPreset['params'];
  };
  beautyParams: BeautyParams;
  intensity: number;
}

/**
 * 大师参数数据库引擎类
 */
class MasterMatrixEngine {
  private static instance: MasterMatrixEngine;
  private cache: Map<string, PhotoMetadata> = new Map();

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): MasterMatrixEngine {
    if (!MasterMatrixEngine.instance) {
      MasterMatrixEngine.instance = new MasterMatrixEngine();
    }
    return MasterMatrixEngine.instance;
  }

  /**
   * 获取所有大师预设
   */
  getAllMasterPresets(): MasterPreset[] {
    return MASTER_PRESETS;
  }

  /**
   * 根据ID获取大师预设
   */
  getMasterPresetById(id: number): MasterPreset | undefined {
    return MASTER_PRESETS.find(preset => preset.id === id);
  }

  /**
   * 根据名称搜索大师预设
   */
  searchMasterPresets(query: string): MasterPreset[] {
    const lowerQuery = query.toLowerCase();
    return MASTER_PRESETS.filter(
      preset =>
        preset.name.toLowerCase().includes(lowerQuery) ||
        preset.nameEn.toLowerCase().includes(lowerQuery) ||
        preset.style.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 保存照片元数据
   */
  async savePhotoMetadata(photoId: string, metadata: PhotoMetadata): Promise<void> {
    try {
      // 保存到缓存
      this.cache.set(photoId, metadata);
      
      // 保存到持久化存储
      await AsyncStorage.setItem(
        `photo_metadata_${photoId}`,
        JSON.stringify(metadata)
      );

      // 更新照片索引
      await this.updatePhotoIndex(photoId, metadata);
    } catch (error) {
      console.error('Failed to save photo metadata:', error);
      throw error;
    }
  }

  /**
   * 获取照片元数据
   */
  async getPhotoMetadata(photoId: string): Promise<PhotoMetadata | null> {
    try {
      // 先从缓存获取
      if (this.cache.has(photoId)) {
        return this.cache.get(photoId)!;
      }

      // 从持久化存储获取
      const data = await AsyncStorage.getItem(`photo_metadata_${photoId}`);
      if (data) {
        const metadata = JSON.parse(data) as PhotoMetadata;
        this.cache.set(photoId, metadata);
        return metadata;
      }

      return null;
    } catch (error) {
      console.error('Failed to get photo metadata:', error);
      return null;
    }
  }

  /**
   * 提取照片参数（反向编辑功能）
   */
  async extractPhotoParams(photoId: string): Promise<{
    masterPreset: MasterPreset;
    beautyParams: BeautyParams;
    intensity: number;
  } | null> {
    try {
      const metadata = await this.getPhotoMetadata(photoId);
      if (!metadata) {
        return null;
      }

      const masterPreset = this.getMasterPresetById(metadata.masterPreset.id);
      if (!masterPreset) {
        return null;
      }

      return {
        masterPreset,
        beautyParams: metadata.beautyParams,
        intensity: metadata.intensity,
      };
    } catch (error) {
      console.error('Failed to extract photo params:', error);
      return null;
    }
  }

  /**
   * 应用大师参数到相机预览
   */
  applyMasterToCamera(masterId: number): MasterPreset | null {
    const preset = this.getMasterPresetById(masterId);
    if (!preset) {
      return null;
    }

    // 触发相机参数更新事件
    this.emitCameraParamsUpdate(preset);
    
    return preset;
  }

  /**
   * 应用大师参数到编辑模式
   */
  applyMasterToEditor(masterId: number, photoId: string): MasterPreset | null {
    const preset = this.getMasterPresetById(masterId);
    if (!preset) {
      return null;
    }

    // 触发编辑器参数更新事件
    this.emitEditorParamsUpdate(preset, photoId);
    
    return preset;
  }

  /**
   * 获取雁宝记忆时间轴数据
   */
  async getMemoryTimeline(): Promise<PhotoMetadata[]> {
    try {
      const indexData = await AsyncStorage.getItem('photo_index');
      if (!indexData) {
        return [];
      }

      const photoIds = JSON.parse(indexData) as string[];
      const memories: PhotoMetadata[] = [];

      for (const photoId of photoIds) {
        const metadata = await this.getPhotoMetadata(photoId);
        if (metadata) {
          memories.push(metadata);
        }
      }

      // 按时间倒序排列
      return memories.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get memory timeline:', error);
      return [];
    }
  }

  /**
   * 获取最常用的大师风格（Top 3）
   */
  async getTopMasterStyles(): Promise<{ master: MasterPreset; count: number }[]> {
    try {
      const timeline = await this.getMemoryTimeline();
      const masterCounts = new Map<number, number>();

      timeline.forEach(photo => {
        const masterId = photo.masterPreset.id;
        masterCounts.set(masterId, (masterCounts.get(masterId) || 0) + 1);
      });

      const topMasters = Array.from(masterCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([masterId, count]) => ({
          master: this.getMasterPresetById(masterId)!,
          count,
        }))
        .filter(item => item.master !== undefined);

      return topMasters;
    } catch (error) {
      console.error('Failed to get top master styles:', error);
      return [];
    }
  }

  /**
   * 创建自定义预设（从照片提取）
   */
  async createCustomPreset(
    photoId: string,
    name: string
  ): Promise<MasterPreset | null> {
    try {
      const params = await this.extractPhotoParams(photoId);
      if (!params) {
        return null;
      }

      const customPreset: MasterPreset = {
        id: 1000 + Date.now(), // 自定义预设ID从1000开始
        name,
        nameEn: name,
        style: '自定义',
        color: '#EC4899',
        icon: '⭐',
        params: params.masterPreset.params,
        description: `从照片 ${photoId} 提取的自定义预设`,
      };

      // 保存自定义预设
      await this.saveCustomPreset(customPreset);

      return customPreset;
    } catch (error) {
      console.error('Failed to create custom preset:', error);
      return null;
    }
  }

  /**
   * 保存自定义预设
   */
  private async saveCustomPreset(preset: MasterPreset): Promise<void> {
    try {
      const customPresetsData = await AsyncStorage.getItem('custom_presets');
      const customPresets = customPresetsData
        ? JSON.parse(customPresetsData)
        : [];

      customPresets.push(preset);

      await AsyncStorage.setItem(
        'custom_presets',
        JSON.stringify(customPresets)
      );
    } catch (error) {
      console.error('Failed to save custom preset:', error);
      throw error;
    }
  }

  /**
   * 获取所有自定义预设
   */
  async getCustomPresets(): Promise<MasterPreset[]> {
    try {
      const data = await AsyncStorage.getItem('custom_presets');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get custom presets:', error);
      return [];
    }
  }

  /**
   * 更新照片索引
   */
  private async updatePhotoIndex(
    photoId: string,
    metadata: PhotoMetadata
  ): Promise<void> {
    try {
      const indexData = await AsyncStorage.getItem('photo_index');
      const photoIds = indexData ? JSON.parse(indexData) : [];

      if (!photoIds.includes(photoId)) {
        photoIds.push(photoId);
        await AsyncStorage.setItem('photo_index', JSON.stringify(photoIds));
      }
    } catch (error) {
      console.error('Failed to update photo index:', error);
    }
  }

  /**
   * 触发相机参数更新事件
   */
  private emitCameraParamsUpdate(preset: MasterPreset): void {
    // 实现事件发射逻辑（可使用 EventEmitter 或 React Context）
    console.log('Camera params updated:', preset.name);
  }

  /**
   * 触发编辑器参数更新事件
   */
  private emitEditorParamsUpdate(preset: MasterPreset, photoId: string): void {
    // 实现事件发射逻辑
    console.log('Editor params updated:', preset.name, photoId);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 导出所有数据（备份功能）
   */
  async exportAllData(): Promise<{
    photos: PhotoMetadata[];
    customPresets: MasterPreset[];
  }> {
    try {
      const timeline = await this.getMemoryTimeline();
      const customPresets = await this.getCustomPresets();

      return {
        photos: timeline,
        customPresets,
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * 导入数据（恢复功能）
   */
  async importData(data: {
    photos: PhotoMetadata[];
    customPresets: MasterPreset[];
  }): Promise<void> {
    try {
      // 导入照片元数据
      for (const photo of data.photos) {
        await this.savePhotoMetadata(photo.id, photo);
      }

      // 导入自定义预设
      await AsyncStorage.setItem(
        'custom_presets',
        JSON.stringify(data.customPresets)
      );

      // 清除缓存以重新加载
      this.clearCache();
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const masterMatrixEngine = MasterMatrixEngine.getInstance();

// 导出默认12维美颜参数
export const DEFAULT_BEAUTY_PARAMS: BeautyParams = {
  eyes: 50,
  face: 50,
  narrow: 50,
  chin: 50,
  forehead: 50,
  philtrum: 50,
  nose: 50,
  noseLength: 50,
  mouth: 50,
  eyeCorner: 50,
  eyeDistance: 50,
  skinBrightness: 50,
};
