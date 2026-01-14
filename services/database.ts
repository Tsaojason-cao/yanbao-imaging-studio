/**
 * yanbao AI 本地数据库服务
 * 使用 AsyncStorage 实现数据持久化
 * 
 * 功能：
 * 1. 雁宝记忆存储/读取
 * 2. 照片计数统计
 * 3. 编辑记录统计
 * 4. 活跃天数统计
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// 数据键定义
const KEYS = {
  YANBAO_MEMORIES: '@yanbao_memories',
  PHOTO_COUNT: '@photo_count',
  EDIT_COUNT: '@edit_count',
  ACTIVE_DAYS: '@active_days',
  FIRST_LAUNCH_DATE: '@first_launch_date',
};

// 雁宝记忆数据结构
export interface YanbaoMemory {
  id: string;
  presetName: string;
  photographer: string;
  beautyParams: {
    smooth: number;
    slim: number;
    eye: number;
    bright: number;
    teeth: number;
    nose: number;
    blush: number;
  };
  filterParams: {
    contrast: number;
    saturation: number;
    brightness: number;
    grain: number;
    temperature: number;
  };
  timestamp: number;
  deviceId: string;
}

// 统计数据结构
export interface Stats {
  photoCount: number;
  editCount: number;
  activeDays: number;
}

/**
 * 雁宝记忆服务
 */
export class YanbaoMemoryService {
  /**
   * 保存雁宝记忆
   */
  static async saveMemory(memory: Omit<YanbaoMemory, 'id' | 'timestamp' | 'deviceId'>): Promise<void> {
    try {
      const memories = await this.getAllMemories();
      const newMemory: YanbaoMemory = {
        ...memory,
        id: `memory_${Date.now()}`,
        timestamp: Date.now(),
        deviceId: 'device_001', // TODO: 获取真实设备 ID
      };
      
      memories.push(newMemory);
      await AsyncStorage.setItem(KEYS.YANBAO_MEMORIES, JSON.stringify(memories));
      
      console.log('✅ 雁宝记忆已存入:', newMemory.presetName);
      console.log('📊 当前记忆总数:', memories.length);
    } catch (error) {
      console.error('❌ 保存雁宝记忆失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有雁宝记忆
   */
  static async getAllMemories(): Promise<YanbaoMemory[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.YANBAO_MEMORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ 读取雁宝记忆失败:', error);
      return [];
    }
  }

  /**
   * 获取最近的雁宝记忆
   */
  static async getLatestMemory(): Promise<YanbaoMemory | null> {
    try {
      const memories = await this.getAllMemories();
      if (memories.length === 0) return null;
      
      // 按时间戳降序排序，返回最新的
      memories.sort((a, b) => b.timestamp - a.timestamp);
      return memories[0];
    } catch (error) {
      console.error('❌ 读取最新记忆失败:', error);
      return null;
    }
  }

  /**
   * 删除雁宝记忆
   */
  static async deleteMemory(id: string): Promise<void> {
    try {
      const memories = await this.getAllMemories();
      const filtered = memories.filter(m => m.id !== id);
      await AsyncStorage.setItem(KEYS.YANBAO_MEMORIES, JSON.stringify(filtered));
      
      console.log('✅ 雁宝记忆已删除:', id);
    } catch (error) {
      console.error('❌ 删除雁宝记忆失败:', error);
      throw error;
    }
  }

  /**
   * 清空所有雁宝记忆
   */
  static async clearAllMemories(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.YANBAO_MEMORIES);
      console.log('✅ 所有雁宝记忆已清空');
    } catch (error) {
      console.error('❌ 清空雁宝记忆失败:', error);
      throw error;
    }
  }
}

/**
 * 统计服务
 */
export class StatsService {
  /**
   * 增加照片计数
   */
  static async incrementPhotoCount(): Promise<void> {
    try {
      const count = await this.getPhotoCount();
      await AsyncStorage.setItem(KEYS.PHOTO_COUNT, String(count + 1));
      console.log('✅ 照片计数已更新:', count + 1);
    } catch (error) {
      console.error('❌ 更新照片计数失败:', error);
      throw error;
    }
  }

  /**
   * 获取照片计数
   */
  static async getPhotoCount(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PHOTO_COUNT);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('❌ 读取照片计数失败:', error);
      return 0;
    }
  }

  /**
   * 增加编辑计数
   */
  static async incrementEditCount(): Promise<void> {
    try {
      const count = await this.getEditCount();
      await AsyncStorage.setItem(KEYS.EDIT_COUNT, String(count + 1));
      console.log('✅ 编辑计数已更新:', count + 1);
    } catch (error) {
      console.error('❌ 更新编辑计数失败:', error);
      throw error;
    }
  }

  /**
   * 获取编辑计数
   */
  static async getEditCount(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.EDIT_COUNT);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('❌ 读取编辑计数失败:', error);
      return 0;
    }
  }

  /**
   * 更新活跃天数
   */
  static async updateActiveDays(): Promise<void> {
    try {
      const firstLaunchDate = await this.getFirstLaunchDate();
      const now = Date.now();
      
      if (!firstLaunchDate) {
        // 首次启动，记录启动日期
        await AsyncStorage.setItem(KEYS.FIRST_LAUNCH_DATE, String(now));
        await AsyncStorage.setItem(KEYS.ACTIVE_DAYS, '1');
        console.log('✅ 首次启动，活跃天数: 1');
        return;
      }
      
      // 计算天数差
      const daysDiff = Math.floor((now - firstLaunchDate) / (1000 * 60 * 60 * 24));
      await AsyncStorage.setItem(KEYS.ACTIVE_DAYS, String(daysDiff + 1));
      console.log('✅ 活跃天数已更新:', daysDiff + 1);
    } catch (error) {
      console.error('❌ 更新活跃天数失败:', error);
      throw error;
    }
  }

  /**
   * 获取活跃天数
   */
  static async getActiveDays(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACTIVE_DAYS);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('❌ 读取活跃天数失败:', error);
      return 0;
    }
  }

  /**
   * 获取首次启动日期
   */
  static async getFirstLaunchDate(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH_DATE);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('❌ 读取首次启动日期失败:', error);
      return null;
    }
  }

  /**
   * 获取所有统计数据
   */
  static async getAllStats(): Promise<Stats> {
    try {
      const [photoCount, editCount, activeDays] = await Promise.all([
        this.getPhotoCount(),
        this.getEditCount(),
        this.getActiveDays(),
      ]);
      
      return {
        photoCount,
        editCount,
        activeDays,
      };
    } catch (error) {
      console.error('❌ 读取统计数据失败:', error);
      return {
        photoCount: 0,
        editCount: 0,
        activeDays: 0,
      };
    }
  }

  /**
   * 清空所有统计数据
   */
  static async clearAllStats(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(KEYS.PHOTO_COUNT),
        AsyncStorage.removeItem(KEYS.EDIT_COUNT),
        AsyncStorage.removeItem(KEYS.ACTIVE_DAYS),
        AsyncStorage.removeItem(KEYS.FIRST_LAUNCH_DATE),
      ]);
      console.log('✅ 所有统计数据已清空');
    } catch (error) {
      console.error('❌ 清空统计数据失败:', error);
      throw error;
    }
  }
}

/**
 * 数据库初始化
 */
export class DatabaseService {
  /**
   * 初始化数据库
   */
  static async initialize(): Promise<void> {
    try {
      console.log('🔄 正在初始化数据库...');
      
      // 更新活跃天数
      await StatsService.updateActiveDays();
      
      // 检查是否有数据
      const stats = await StatsService.getAllStats();
      const memories = await YanbaoMemoryService.getAllMemories();
      
      console.log('✅ 数据库初始化完成');
      console.log('📊 当前统计:', stats);
      console.log('💜 雁宝记忆数量:', memories.length);
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 清空所有数据
   */
  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        YanbaoMemoryService.clearAllMemories(),
        StatsService.clearAllStats(),
      ]);
      console.log('✅ 所有数据已清空');
    } catch (error) {
      console.error('❌ 清空数据失败:', error);
      throw error;
    }
  }
}
