// 雁宝记忆数据存储服务 v2.4.0
// 实现跨模块联动：相机存储 → 相册管理 → 编辑器套用
// 支持 AsyncStorage 持久化 + 12 维美颜引擎

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@yanbao_memories';

export interface YanbaoMemory {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: string;  // 改为 string 以便 JSON 序列化
  
  // 12 维美颜参数（v2.3.0 升级）
  beautyParams: {
    // 原有 7 维
    smooth: number;      // 磨皮 (0-100)
    slim: number;        // 瘦脸 (0-100)
    eye: number;         // 大眼 (0-100)
    bright: number;      // 亮眼 (0-100)
    teeth: number;       // 白牙 (0-100)
    nose: number;        // 隆鼻 (0-100)
    blush: number;       // 红润 (0-100)
    
    // v2.3.0 新增 5 维
    sculpting3D: number;          // 骨相立体 (0-100)
    textureRetention: number;     // 原生膚質保护 (0-100)
    teethWhiteningPro: number;    // 牙齿美白增强版 (0-100)
    darkCircleRemoval: number;    // 黑眼圈淡化 (0-100)
    hairlineAdjustment: number;   // 发际线修饰 (0-100)
  };
  
  // 编辑参数
  editParams: {
    exposure: number;    // 曝光 -100 to 100
    contrast: number;    // 对比度 -100 to 100
    saturation: number;  // 饱和度 -100 to 100
    rotation: number;    // 旋转角度 -180 to 180
    cropRatio: string;   // 裁剪比例 "9:16" | "1:1" | "4:3" | "16:9" | "free"
  };
  
  // 风格参数
  styleParams: {
    filterName: string;  // 滤镜名称
    filterIntensity: number; // 滤镜强度 0-100
  };
}

class MemoryServiceClass {
  private memories: YanbaoMemory[] = [];
  private isInitialized: boolean = false;

  // 初始化：从 AsyncStorage 加载数据
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memories = JSON.parse(stored);
      } else {
        // 首次使用，加载默认记忆
        this.memories = this.getDefaultMemories();
        await this.persistToStorage();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to load memories from AsyncStorage:', error);
      this.memories = this.getDefaultMemories();
    }
  }

  // 获取默认记忆
  private getDefaultMemories(): YanbaoMemory[] {
    return [
      {
        id: '1',
        name: '北京冬日暖阳',
        thumbnail: '🌅',
        createdAt: new Date('2026-01-10').toISOString(),
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
        editParams: {
          exposure: 10,
          contrast: 15,
          saturation: 20,
          rotation: 0,
          cropRatio: '9:16',
        },
        styleParams: {
          filterName: '暖阳',
          filterIntensity: 70,
        },
      },
      {
        id: '2',
        name: '杭州复古咖啡馆',
        thumbnail: '☕',
        createdAt: new Date('2026-01-08').toISOString(),
        beautyParams: {
          smooth: 18,
          slim: 10,
          eye: 5,
          bright: 12,
          teeth: 8,
          nose: 3,
          blush: 10,
          sculpting3D: 0,
          textureRetention: 50,
          teethWhiteningPro: 0,
          darkCircleRemoval: 0,
          hairlineAdjustment: 0,
        },
        editParams: {
          exposure: -5,
          contrast: 20,
          saturation: -10,
          rotation: 0,
          cropRatio: '1:1',
        },
        styleParams: {
          filterName: '复古',
          filterIntensity: 80,
        },
      },
      {
        id: '3',
        name: '库洛米甜酷风',
        thumbnail: '💜',
        createdAt: new Date('2026-01-05').toISOString(),
        beautyParams: {
          smooth: 30,
          slim: 15,
          eye: 12,
          bright: 20,
          teeth: 15,
          nose: 8,
          blush: 18,
          sculpting3D: 25,
          textureRetention: 20,
          teethWhiteningPro: 20,
          darkCircleRemoval: 30,
          hairlineAdjustment: 0,
        },
        editParams: {
          exposure: 5,
          contrast: 10,
          saturation: 30,
          rotation: 0,
          cropRatio: '9:16',
        },
        styleParams: {
          filterName: '库洛米',
          filterIntensity: 90,
        },
      },
    ];
  }

  // 持久化到 AsyncStorage
  private async persistToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.memories));
    } catch (error) {
      console.error('Failed to persist memories to AsyncStorage:', error);
    }
  }

  // 获取所有记忆
  async getAllMemories(): Promise<YanbaoMemory[]> {
    await this.initialize();
    return this.memories;
  }

  // 根据 ID 获取记忆
  async getMemoryById(id: string): Promise<YanbaoMemory | undefined> {
    await this.initialize();
    return this.memories.find(m => m.id === id);
  }

  // 保存新记忆（相机存储）
  async saveMemory(memory: Omit<YanbaoMemory, 'id' | 'createdAt'>): Promise<YanbaoMemory> {
    await this.initialize();
    
    const newMemory: YanbaoMemory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    this.memories.unshift(newMemory);
    await this.persistToStorage();
    
    return newMemory;
  }

  // 删除记忆
  async deleteMemory(id: string): Promise<boolean> {
    await this.initialize();
    
    const index = this.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.memories.splice(index, 1);
      await this.persistToStorage();
      return true;
    }
    return false;
  }

  // 更新记忆
  async updateMemory(id: string, updates: Partial<YanbaoMemory>): Promise<YanbaoMemory | undefined> {
    await this.initialize();
    
    const memory = this.memories.find(m => m.id === id);
    if (memory) {
      Object.assign(memory, updates);
      await this.persistToStorage();
      return memory;
    }
    return undefined;
  }

  // 清空所有记忆（调试用）
  async clearAllMemories(): Promise<void> {
    this.memories = [];
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

// 导出单例
export const MemoryService = new MemoryServiceClass();
