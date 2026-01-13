/**
 * 記憶庫管理 Hook
 * Memory Library Management Hook
 * 
 * 功能：
 * - 保存、讀取、刪除記憶
 * - 應用記憶參數
 * - 管理記憶統計
 */

import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  YanBaoMemory,
  YanBaoMemoryLibrary,
  SaveMemoryRequest,
  SaveMemoryResult,
  ApplyMemoryRequest,
  ApplyMemoryResult,
  DeleteMemoryRequest,
  DeleteMemoryResult,
  RenameMemoryRequest,
  RenameMemoryResult,
  MemoryStatistics,
} from '../types/memory';
import { v4 as uuidv4 } from 'uuid';

const MEMORY_STORAGE_KEY = '@yanbao_memory_library';
const MEMORY_STATS_KEY = '@yanbao_memory_stats';

interface UseMemoryLibraryReturn {
  memories: YanBaoMemory[];
  isLoading: boolean;
  error: Error | null;
  statistics: MemoryStatistics | null;
  saveMemory: (request: SaveMemoryRequest) => Promise<SaveMemoryResult>;
  applyMemory: (request: ApplyMemoryRequest) => Promise<ApplyMemoryResult>;
  deleteMemory: (request: DeleteMemoryRequest) => Promise<DeleteMemoryResult>;
  renameMemory: (request: RenameMemoryRequest) => Promise<RenameMemoryResult>;
  toggleFavorite: (memoryId: string) => Promise<void>;
  loadMemories: () => Promise<void>;
  clearAllMemories: () => Promise<void>;
}

/**
 * AI 自動命名函數
 * Auto-naming function based on environment
 */
function generateMemoryName(environment: any): string {
  const { location, lighting, mood, season } = environment;
  
  if (location && mood) {
    return `${location} - ${mood}`;
  }
  
  if (location && season) {
    const seasonMap: Record<string, string> = {
      spring: '春日',
      summer: '夏日',
      autumn: '秋日',
      winter: '冬日',
    };
    return `${location} ${seasonMap[season] || ''}`;
  }
  
  if (mood) {
    return mood;
  }
  
  const lightingMap: Record<string, string> = {
    daylight: '日光',
    indoor: '室內',
    sunset: '日落',
    night: '夜景',
  };
  
  return `${lightingMap[lighting] || '自定義'}風格`;
}

/**
 * 計算存儲大小
 * Calculate storage size
 */
function calculateStorageSize(memory: YanBaoMemory): number {
  return JSON.stringify(memory).length;
}

/**
 * 記憶庫管理 Hook
 */
export const useMemoryLibrary = (userId: string): UseMemoryLibraryReturn => {
  const [memories, setMemories] = useState<YanBaoMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [statistics, setStatistics] = useState<MemoryStatistics | null>(null);

  // 加載記憶列表
  const loadMemories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
      const library: YanBaoMemoryLibrary = stored
        ? JSON.parse(stored)
        : { userId, memories: [], totalCount: 0, storageUsed: 0, lastSyncAt: new Date().toISOString() };

      setMemories(library.memories || []);

      // 計算統計信息
      const stats = calculateStatistics(library.memories || []);
      setStatistics(stats);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('加載記憶失敗');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 保存記憶
  const saveMemory = useCallback(
    async (request: SaveMemoryRequest): Promise<SaveMemoryResult> => {
      try {
        // 生成唯一 ID
        const id = uuidv4();
        const now = new Date().toISOString();

        // 生成記憶名稱
        const name = request.customName || generateMemoryName(request.environment);

        // 構建記憶對象
        const memory: YanBaoMemory = {
          id,
          userId,
          createdAt: now,
          updatedAt: now,
          name,
          description: undefined,
          tags: [],
          optical: request.optical,
          beauty: request.beauty,
          filter: request.filter,
          arPose: request.arPose,
          environment: request.environment,
          usageCount: 0,
          lastUsedAt: undefined,
          favorited: false,
          syncStatus: 'local',
          cloudId: undefined,
        };

        // 讀取現有記憶庫
        const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        const library: YanBaoMemoryLibrary = stored
          ? JSON.parse(stored)
          : {
              userId,
              memories: [],
              totalCount: 0,
              storageUsed: 0,
              lastSyncAt: now,
            };

        // 添加新記憶
        library.memories.push(memory);
        library.totalCount = library.memories.length;
        library.storageUsed = library.memories.reduce(
          (sum, m) => sum + calculateStorageSize(m),
          0
        );
        library.lastSyncAt = now;

        // 保存到本地存儲
        await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(library));

        // 更新狀態
        setMemories(library.memories);
        setStatistics(calculateStatistics(library.memories));

        return {
          success: true,
          memory,
          message: `『${name}』已成功保存到雁寶記憶庫！`,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('保存記憶失敗');
        setError(error);
        return {
          success: false,
          memory: {} as YanBaoMemory,
          message: error.message,
        };
      }
    },
    [userId]
  );

  // 應用記憶
  const applyMemory = useCallback(
    async (request: ApplyMemoryRequest): Promise<ApplyMemoryResult> => {
      try {
        // 查找記憶
        const memory = memories.find((m) => m.id === request.memoryId);
        if (!memory) {
          throw new Error('記憶不存在');
        }

        // 更新使用次數和最後使用時間
        const updatedMemory = {
          ...memory,
          usageCount: memory.usageCount + 1,
          lastUsedAt: new Date().toISOString(),
        };

        // 更新本地存儲
        const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        const library: YanBaoMemoryLibrary = stored ? JSON.parse(stored) : { memories: [] };
        const index = library.memories.findIndex((m) => m.id === request.memoryId);
        if (index >= 0) {
          library.memories[index] = updatedMemory;
          await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(library));
        }

        // 更新狀態
        setMemories(library.memories);

        return {
          success: true,
          memoryId: request.memoryId,
          appliedAt: new Date().toISOString(),
          message: `『${memory.name}』已應用！`,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('應用記憶失敗');
        setError(error);
        return {
          success: false,
          memoryId: request.memoryId,
          appliedAt: new Date().toISOString(),
          message: error.message,
        };
      }
    },
    [memories]
  );

  // 刪除記憶
  const deleteMemory = useCallback(
    async (request: DeleteMemoryRequest): Promise<DeleteMemoryResult> => {
      try {
        // 讀取現有記憶庫
        const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        const library: YanBaoMemoryLibrary = stored ? JSON.parse(stored) : { memories: [] };

        // 刪除記憶
        const index = library.memories.findIndex((m) => m.id === request.memoryId);
        if (index < 0) {
          throw new Error('記憶不存在');
        }

        const deletedMemory = library.memories[index];
        library.memories.splice(index, 1);
        library.totalCount = library.memories.length;
        library.storageUsed = library.memories.reduce(
          (sum, m) => sum + calculateStorageSize(m),
          0
        );

        // 保存到本地存儲
        await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(library));

        // 更新狀態
        setMemories(library.memories);
        setStatistics(calculateStatistics(library.memories));

        return {
          success: true,
          memoryId: request.memoryId,
          message: `『${deletedMemory.name}』已刪除`,
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('刪除記憶失敗');
        setError(error);
        return {
          success: false,
          memoryId: request.memoryId,
          message: error.message,
        };
      }
    },
    []
  );

  // 重命名記憶
  const renameMemory = useCallback(
    async (request: RenameMemoryRequest): Promise<RenameMemoryResult> => {
      try {
        // 讀取現有記憶庫
        const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        const library: YanBaoMemoryLibrary = stored ? JSON.parse(stored) : { memories: [] };

        // 查找並更新記憶
        const index = library.memories.findIndex((m) => m.id === request.memoryId);
        if (index < 0) {
          throw new Error('記憶不存在');
        }

        library.memories[index].name = request.newName;
        library.memories[index].updatedAt = new Date().toISOString();

        // 保存到本地存儲
        await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(library));

        // 更新狀態
        setMemories(library.memories);

        return {
          success: true,
          memoryId: request.memoryId,
          newName: request.newName,
          message: '記憶已重命名',
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('重命名失敗');
        setError(error);
        return {
          success: false,
          memoryId: request.memoryId,
          newName: request.newName,
          message: error.message,
        };
      }
    },
    []
  );

  // 切換收藏
  const toggleFavorite = useCallback(async (memoryId: string) => {
    try {
      const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
      const library: YanBaoMemoryLibrary = stored ? JSON.parse(stored) : { memories: [] };

      const index = library.memories.findIndex((m) => m.id === memoryId);
      if (index >= 0) {
        library.memories[index].favorited = !library.memories[index].favorited;
        await AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(library));
        setMemories(library.memories);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('切換收藏失敗');
      setError(error);
    }
  }, []);

  // 清除所有記憶
  const clearAllMemories = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(MEMORY_STORAGE_KEY);
      setMemories([]);
      setStatistics(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('清除記憶失敗');
      setError(error);
    }
  }, []);

  // 初始化加載
  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  return {
    memories,
    isLoading,
    error,
    statistics,
    saveMemory,
    applyMemory,
    deleteMemory,
    renameMemory,
    toggleFavorite,
    loadMemories,
    clearAllMemories,
  };
};

/**
 * 計算統計信息
 */
function calculateStatistics(memories: YanBaoMemory[]): MemoryStatistics {
  const totalUsage = memories.reduce((sum, m) => sum + m.usageCount, 0);
  const mostUsedMemory = memories.reduce(
    (max, m) => (m.usageCount > (max?.usageCount || 0) ? m : max),
    null as YanBaoMemory | null
  );
  const favoriteCount = memories.filter((m) => m.favorited).length;
  const storageUsed = memories.reduce((sum, m) => sum + calculateStorageSize(m), 0);

  return {
    totalMemories: memories.length,
    totalUsage,
    mostUsedMemory: mostUsedMemory || undefined,
    favoriteCount,
    storageUsed,
    storageQuota: 50 * 1024 * 1024, // 50 MB
    lastSyncAt: new Date().toISOString(),
  };
}
