// 雁宝记忆数据存储服务
// 实现跨模块联动：相机存储 → 相册管理 → 编辑器套用

export interface YanbaoMemory {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: Date;
  // 相机参数
  cameraParams: {
    beauty: number;      // 美颜 0-100
    whitening: number;   // 美白 0-100
    eyeEnlarge: number;  // 大眼 0-100
    similarity: number;  // 相似度 0-100
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

  // 初始化默认记忆
  constructor() {
    this.memories = [
      {
        id: '1',
        name: '北京冬日暖阳',
        thumbnail: '🌅',
        createdAt: new Date('2026-01-10'),
        cameraParams: {
          beauty: 60,
          whitening: 40,
          eyeEnlarge: 30,
          similarity: 95,
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
        createdAt: new Date('2026-01-08'),
        cameraParams: {
          beauty: 50,
          whitening: 30,
          eyeEnlarge: 20,
          similarity: 88,
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
        createdAt: new Date('2026-01-05'),
        cameraParams: {
          beauty: 70,
          whitening: 50,
          eyeEnlarge: 40,
          similarity: 92,
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

  // 获取所有记忆
  getAllMemories(): YanbaoMemory[] {
    return this.memories;
  }

  // 根据 ID 获取记忆
  getMemoryById(id: string): YanbaoMemory | undefined {
    return this.memories.find(m => m.id === id);
  }

  // 保存新记忆（相机存储）
  saveMemory(memory: Omit<YanbaoMemory, 'id' | 'createdAt'>): YanbaoMemory {
    const newMemory: YanbaoMemory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.memories.unshift(newMemory);
    return newMemory;
  }

  // 删除记忆
  deleteMemory(id: string): boolean {
    const index = this.memories.findIndex(m => m.id === id);
    if (index !== -1) {
      this.memories.splice(index, 1);
      return true;
    }
    return false;
  }

  // 更新记忆
  updateMemory(id: string, updates: Partial<YanbaoMemory>): YanbaoMemory | undefined {
    const memory = this.getMemoryById(id);
    if (memory) {
      Object.assign(memory, updates);
      return memory;
    }
    return undefined;
  }
}

// 导出单例
export const MemoryService = new MemoryServiceClass();
