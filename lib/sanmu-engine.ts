/**
 * SANMU-Engine (三目引擎)
 * 
 * 核心功能：实现参数在「相机-编辑-相册」三位一体的存取与联动
 * 
 * 三目：
 * - 相机（Camera）：实时预览与拍照
 * - 编辑（Editor）：后期调整与参数修改
 * - 相册（Gallery）：参数存储与提取
 * 
 * by Jason Tsao ❤️
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
 * 完整参数快照（用于存储和恢复）
 */
export interface ParamsSnapshot {
  id: string;                    // 快照ID
  name: string;                  // 快照名称
  timestamp: number;             // 创建时间
  masterPreset: {
    id: number;
    name: string;
    params: MasterPreset['params'];
  };
  beautyParams: BeautyParams;
  intensity: number;             // 强度 (0-100)
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photoUri?: string;             // 关联照片URI
  isFavorite: boolean;           // 是否收藏
}

/**
 * 照片元数据（与照片文件关联）
 */
export interface PhotoMetadata {
  photoId: string;
  photoUri: string;
  timestamp: number;
  paramsSnapshot: ParamsSnapshot;
}

/**
 * SANMU-Engine 类
 */
class SANMUEngine {
  private static instance: SANMUEngine;
  private cache: Map<string, ParamsSnapshot> = new Map();
  private currentParams: ParamsSnapshot | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): SANMUEngine {
    if (!SANMUEngine.instance) {
      SANMUEngine.instance = new SANMUEngine();
    }
    return SANMUEngine.instance;
  }

  // ==================== 参数快照管理 ====================

  /**
   * 创建参数快照
   */
  async createSnapshot(
    name: string,
    masterPresetId: number,
    beautyParams: BeautyParams,
    intensity: number,
    options?: {
      location?: ParamsSnapshot['location'];
      photoUri?: string;
      isFavorite?: boolean;
    }
  ): Promise<ParamsSnapshot> {
    const masterPreset = MASTER_PRESETS.find(p => p.id === masterPresetId);
    if (!masterPreset) {
      throw new Error(`Master preset ${masterPresetId} not found`);
    }

    const snapshot: ParamsSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      timestamp: Date.now(),
      masterPreset: {
        id: masterPreset.id,
        name: masterPreset.name,
        params: masterPreset.params,
      },
      beautyParams: { ...beautyParams },
      intensity,
      location: options?.location,
      photoUri: options?.photoUri,
      isFavorite: options?.isFavorite || false,
    };

    // 保存到缓存
    this.cache.set(snapshot.id, snapshot);

    // 保存到持久化存储
    await this.saveSnapshotToDB(snapshot);

    return snapshot;
  }

  /**
   * 获取参数快照
   */
  async getSnapshot(snapshotId: string): Promise<ParamsSnapshot | null> {
    // 先从缓存获取
    if (this.cache.has(snapshotId)) {
      return this.cache.get(snapshotId)!;
    }

    // 从持久化存储获取
    try {
      const data = await AsyncStorage.getItem(`snapshot_${snapshotId}`);
      if (data) {
        const snapshot = JSON.parse(data) as ParamsSnapshot;
        this.cache.set(snapshotId, snapshot);
        return snapshot;
      }
    } catch (error) {
      console.error('Failed to get snapshot:', error);
    }

    return null;
  }

  /**
   * 更新参数快照
   */
  async updateSnapshot(
    snapshotId: string,
    updates: Partial<ParamsSnapshot>
  ): Promise<ParamsSnapshot | null> {
    const snapshot = await this.getSnapshot(snapshotId);
    if (!snapshot) {
      return null;
    }

    const updatedSnapshot = { ...snapshot, ...updates };
    this.cache.set(snapshotId, updatedSnapshot);
    await this.saveSnapshotToDB(updatedSnapshot);

    return updatedSnapshot;
  }

  /**
   * 删除参数快照
   */
  async deleteSnapshot(snapshotId: string): Promise<boolean> {
    try {
      this.cache.delete(snapshotId);
      await AsyncStorage.removeItem(`snapshot_${snapshotId}`);
      await this.removeFromIndex(snapshotId);
      return true;
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
      return false;
    }
  }

  /**
   * 获取所有参数快照
   */
  async getAllSnapshots(): Promise<ParamsSnapshot[]> {
    try {
      const indexData = await AsyncStorage.getItem('snapshots_index');
      if (!indexData) {
        return [];
      }

      const snapshotIds = JSON.parse(indexData) as string[];
      const snapshots: ParamsSnapshot[] = [];

      for (const id of snapshotIds) {
        const snapshot = await this.getSnapshot(id);
        if (snapshot) {
          snapshots.push(snapshot);
        }
      }

      // 按时间倒序排列
      return snapshots.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get all snapshots:', error);
      return [];
    }
  }

  /**
   * 获取收藏的参数快照（雁宝记忆）
   */
  async getFavoriteSnapshots(): Promise<ParamsSnapshot[]> {
    const allSnapshots = await this.getAllSnapshots();
    return allSnapshots.filter(s => s.isFavorite);
  }

  // ==================== 相机模块接口 ====================

  /**
   * 相机：应用参数快照到实时预览
   */
  applySnapshotToCamera(snapshot: ParamsSnapshot): void {
    this.currentParams = snapshot;
    
    // 触发相机参数更新事件
    this.emitEvent('camera:params:update', snapshot);
    
    console.log(`[SANMU-Engine] Applied snapshot "${snapshot.name}" to camera`);
  }

  /**
   * 相机：拍照并保存元数据
   */
  async capturePhotoWithParams(
    photoUri: string,
    masterPresetId: number,
    beautyParams: BeautyParams,
    intensity: number,
    location?: ParamsSnapshot['location']
  ): Promise<PhotoMetadata> {
    // 创建参数快照
    const snapshot = await this.createSnapshot(
      `Photo ${new Date().toLocaleString()}`,
      masterPresetId,
      beautyParams,
      intensity,
      { location, photoUri, isFavorite: false }
    );

    // 创建照片元数据
    const metadata: PhotoMetadata = {
      photoId: `photo_${Date.now()}`,
      photoUri,
      timestamp: Date.now(),
      paramsSnapshot: snapshot,
    };

    // 保存照片元数据
    await this.savePhotoMetadata(metadata);

    console.log(`[SANMU-Engine] Photo captured with params: ${snapshot.id}`);

    return metadata;
  }

  /**
   * 相机：从记忆口袋提取参数
   */
  async loadSnapshotToCamera(snapshotId: string): Promise<boolean> {
    const snapshot = await this.getSnapshot(snapshotId);
    if (!snapshot) {
      return false;
    }

    this.applySnapshotToCamera(snapshot);
    return true;
  }

  // ==================== 编辑模块接口 ====================

  /**
   * 编辑：读取照片的原始参数
   */
  async loadPhotoParams(photoId: string): Promise<ParamsSnapshot | null> {
    try {
      const metadata = await this.getPhotoMetadata(photoId);
      if (!metadata) {
        return null;
      }

      this.currentParams = metadata.paramsSnapshot;
      
      // 触发编辑器参数更新事件
      this.emitEvent('editor:params:load', metadata.paramsSnapshot);

      console.log(`[SANMU-Engine] Loaded params for photo: ${photoId}`);

      return metadata.paramsSnapshot;
    } catch (error) {
      console.error('Failed to load photo params:', error);
      return null;
    }
  }

  /**
   * 编辑：覆盖保存（更新原照片的参数）
   */
  async overwritePhotoParams(
    photoId: string,
    masterPresetId: number,
    beautyParams: BeautyParams,
    intensity: number
  ): Promise<boolean> {
    try {
      const metadata = await this.getPhotoMetadata(photoId);
      if (!metadata) {
        return false;
      }

      // 更新参数快照
      const masterPreset = MASTER_PRESETS.find(p => p.id === masterPresetId);
      if (!masterPreset) {
        return false;
      }

      metadata.paramsSnapshot.masterPreset = {
        id: masterPreset.id,
        name: masterPreset.name,
        params: masterPreset.params,
      };
      metadata.paramsSnapshot.beautyParams = { ...beautyParams };
      metadata.paramsSnapshot.intensity = intensity;
      metadata.paramsSnapshot.timestamp = Date.now();

      // 保存更新后的元数据
      await this.savePhotoMetadata(metadata);
      await this.saveSnapshotToDB(metadata.paramsSnapshot);

      console.log(`[SANMU-Engine] Overwritten params for photo: ${photoId}`);

      return true;
    } catch (error) {
      console.error('Failed to overwrite photo params:', error);
      return false;
    }
  }

  /**
   * 编辑：另存为新的记忆
   */
  async saveAsNewMemory(
    name: string,
    masterPresetId: number,
    beautyParams: BeautyParams,
    intensity: number,
    photoUri?: string
  ): Promise<ParamsSnapshot> {
    const snapshot = await this.createSnapshot(
      name,
      masterPresetId,
      beautyParams,
      intensity,
      { photoUri, isFavorite: true }
    );

    console.log(`[SANMU-Engine] Saved as new memory: ${snapshot.name}`);

    return snapshot;
  }

  // ==================== 相册模块接口 ====================

  /**
   * 相册：获取照片元数据
   */
  async getPhotoMetadata(photoId: string): Promise<PhotoMetadata | null> {
    try {
      const data = await AsyncStorage.getItem(`photo_metadata_${photoId}`);
      if (data) {
        return JSON.parse(data) as PhotoMetadata;
      }
    } catch (error) {
      console.error('Failed to get photo metadata:', error);
    }
    return null;
  }

  /**
   * 相册：获取所有照片元数据
   */
  async getAllPhotoMetadata(): Promise<PhotoMetadata[]> {
    try {
      const indexData = await AsyncStorage.getItem('photos_index');
      if (!indexData) {
        return [];
      }

      const photoIds = JSON.parse(indexData) as string[];
      const metadata: PhotoMetadata[] = [];

      for (const id of photoIds) {
        const meta = await this.getPhotoMetadata(id);
        if (meta) {
          metadata.push(meta);
        }
      }

      // 按时间倒序排列
      return metadata.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get all photo metadata:', error);
      return [];
    }
  }

  /**
   * 相册：提取照片参数到记忆口袋
   */
  async extractPhotoToMemory(photoId: string, name: string): Promise<ParamsSnapshot | null> {
    const metadata = await this.getPhotoMetadata(photoId);
    if (!metadata) {
      return null;
    }

    // 创建新的收藏快照
    const snapshot = await this.createSnapshot(
      name,
      metadata.paramsSnapshot.masterPreset.id,
      metadata.paramsSnapshot.beautyParams,
      metadata.paramsSnapshot.intensity,
      {
        location: metadata.paramsSnapshot.location,
        photoUri: metadata.photoUri,
        isFavorite: true,
      }
    );

    console.log(`[SANMU-Engine] Extracted photo to memory: ${name}`);

    return snapshot;
  }

  // ==================== 雁宝记忆接口 ====================

  /**
   * 雁宝记忆：收藏参数快照
   */
  async favoriteSnapshot(snapshotId: string): Promise<boolean> {
    return !!(await this.updateSnapshot(snapshotId, { isFavorite: true }));
  }

  /**
   * 雁宝记忆：取消收藏
   */
  async unfavoriteSnapshot(snapshotId: string): Promise<boolean> {
    return !!(await this.updateSnapshot(snapshotId, { isFavorite: false }));
  }

  /**
   * 雁宝记忆：获取统计信息
   */
  async getMemoryStats(): Promise<{
    totalPhotos: number;
    totalMemories: number;
    topMasters: Array<{ master: MasterPreset; count: number }>;
  }> {
    const allPhotos = await this.getAllPhotoMetadata();
    const allMemories = await this.getFavoriteSnapshots();

    // 统计最常用的大师
    const masterCounts = new Map<number, number>();
    allPhotos.forEach(photo => {
      const masterId = photo.paramsSnapshot.masterPreset.id;
      masterCounts.set(masterId, (masterCounts.get(masterId) || 0) + 1);
    });

    const topMasters = Array.from(masterCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([masterId, count]) => ({
        master: MASTER_PRESETS.find(p => p.id === masterId)!,
        count,
      }))
      .filter(item => item.master !== undefined);

    return {
      totalPhotos: allPhotos.length,
      totalMemories: allMemories.length,
      topMasters,
    };
  }

  // ==================== 数据持久化 ====================

  /**
   * 保存参数快照到数据库
   */
  private async saveSnapshotToDB(snapshot: ParamsSnapshot): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `snapshot_${snapshot.id}`,
        JSON.stringify(snapshot)
      );
      await this.addToIndex('snapshots_index', snapshot.id);
    } catch (error) {
      console.error('Failed to save snapshot to DB:', error);
      throw error;
    }
  }

  /**
   * 保存照片元数据到数据库
   */
  private async savePhotoMetadata(metadata: PhotoMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `photo_metadata_${metadata.photoId}`,
        JSON.stringify(metadata)
      );
      await this.addToIndex('photos_index', metadata.photoId);
    } catch (error) {
      console.error('Failed to save photo metadata:', error);
      throw error;
    }
  }

  /**
   * 添加到索引
   */
  private async addToIndex(indexKey: string, id: string): Promise<void> {
    try {
      const indexData = await AsyncStorage.getItem(indexKey);
      const ids = indexData ? JSON.parse(indexData) : [];
      
      if (!ids.includes(id)) {
        ids.push(id);
        await AsyncStorage.setItem(indexKey, JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Failed to add to index:', error);
    }
  }

  /**
   * 从索引中移除
   */
  private async removeFromIndex(snapshotId: string): Promise<void> {
    try {
      const indexData = await AsyncStorage.getItem('snapshots_index');
      if (indexData) {
        const ids = JSON.parse(indexData) as string[];
        const newIds = ids.filter(id => id !== snapshotId);
        await AsyncStorage.setItem('snapshots_index', JSON.stringify(newIds));
      }
    } catch (error) {
      console.error('Failed to remove from index:', error);
    }
  }

  // ==================== 事件系统 ====================

  /**
   * 触发事件（简化版，实际应使用 EventEmitter）
   */
  private emitEvent(eventName: string, data: any): void {
    console.log(`[SANMU-Engine] Event: ${eventName}`, data);
    // 实际应使用 EventEmitter 或 React Context
  }

  // ==================== 数据导出与导入 ====================

  /**
   * 导出所有数据
   */
  async exportAllData(): Promise<{
    snapshots: ParamsSnapshot[];
    photos: PhotoMetadata[];
  }> {
    const snapshots = await this.getAllSnapshots();
    const photos = await this.getAllPhotoMetadata();

    return { snapshots, photos };
  }

  /**
   * 导入数据
   */
  async importData(data: {
    snapshots: ParamsSnapshot[];
    photos: PhotoMetadata[];
  }): Promise<void> {
    // 导入快照
    for (const snapshot of data.snapshots) {
      await this.saveSnapshotToDB(snapshot);
      this.cache.set(snapshot.id, snapshot);
    }

    // 导入照片元数据
    for (const photo of data.photos) {
      await this.savePhotoMetadata(photo);
    }

    console.log('[SANMU-Engine] Data imported successfully');
  }

  /**
   * 清除所有数据
   */
  async clearAllData(): Promise<void> {
    this.cache.clear();
    this.currentParams = null;
    await AsyncStorage.multiRemove([
      'snapshots_index',
      'photos_index',
    ]);
    console.log('[SANMU-Engine] All data cleared');
  }
}

// 导出单例实例
export const sanmuEngine = SANMUEngine.getInstance();

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
