import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 本地高清缓存服务
 * 支持离线查看相册和非破坏性编辑
 */

const CACHE_DIR = `${FileSystem.documentDirectory}yanbao_cache/`;
const ORIGINAL_DIR = `${CACHE_DIR}original/`;
const EDITED_DIR = `${CACHE_DIR}edited/`;
const CACHE_INDEX_KEY = "@yanbao_cache_index";

export interface CachedPhoto {
  id: string;
  originalUri: string;
  editedUri?: string;
  timestamp: number;
  metadata: {
    width: number;
    height: number;
    size: number;
  };
  editHistory?: EditOperation[];
}

export interface EditOperation {
  type: "beauty" | "filter" | "crop" | "rotate";
  params: any;
  timestamp: number;
}

/**
 * 初始化缓存目录
 */
export async function initCacheDirectory(): Promise<void> {
  try {
    const cacheDirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!cacheDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }

    const originalDirInfo = await FileSystem.getInfoAsync(ORIGINAL_DIR);
    if (!originalDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(ORIGINAL_DIR, { intermediates: true });
    }

    const editedDirInfo = await FileSystem.getInfoAsync(EDITED_DIR);
    if (!editedDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(EDITED_DIR, { intermediates: true });
    }

    console.log("Cache directories initialized");
  } catch (error) {
    console.error("Failed to initialize cache directories:", error);
  }
}

/**
 * 缓存照片到本地
 * @param photoUri 照片URI（可以是网络URL或本地URI）
 * @param photoId 照片ID
 * @returns 缓存的本地URI
 */
export async function cachePhoto(
  photoUri: string,
  photoId: string
): Promise<string> {
  try {
    await initCacheDirectory();

    const localUri = `${ORIGINAL_DIR}${photoId}.jpg`;

    // 如果是网络URL，下载到本地
    if (photoUri.startsWith("http")) {
      const downloadResult = await FileSystem.downloadAsync(photoUri, localUri);
      console.log("Photo downloaded to:", downloadResult.uri);
      return downloadResult.uri;
    }

    // 如果是本地URI，复制到缓存目录
    await FileSystem.copyAsync({
      from: photoUri,
      to: localUri,
    });

    console.log("Photo cached to:", localUri);
    return localUri;
  } catch (error) {
    console.error("Failed to cache photo:", error);
    throw error;
  }
}

/**
 * 保存编辑后的照片
 * @param photoId 照片ID
 * @param editedUri 编辑后的URI
 * @param editOperation 编辑操作
 */
export async function saveEditedPhoto(
  photoId: string,
  editedUri: string,
  editOperation: EditOperation
): Promise<string> {
  try {
    await initCacheDirectory();

    const localUri = `${EDITED_DIR}${photoId}_${Date.now()}.jpg`;

    await FileSystem.copyAsync({
      from: editedUri,
      to: localUri,
    });

    // 更新缓存索引
    const cached = await getCachedPhoto(photoId);
    const editHistory = cached?.editHistory || [];
    editHistory.push(editOperation);
    
    await updateCacheIndex(photoId, {
      editedUri: localUri,
      editHistory,
    });

    console.log("Edited photo saved to:", localUri);
    return localUri;
  } catch (error) {
    console.error("Failed to save edited photo:", error);
    throw error;
  }
}

/**
 * 获取缓存的照片
 * @param photoId 照片ID
 * @returns 缓存的照片信息
 */
export async function getCachedPhoto(
  photoId: string
): Promise<CachedPhoto | null> {
  try {
    const index = await getCacheIndex();
    return index[photoId] || null;
  } catch (error) {
    console.error("Failed to get cached photo:", error);
    return null;
  }
}

/**
 * 获取所有缓存的照片
 */
export async function getAllCachedPhotos(): Promise<CachedPhoto[]> {
  try {
    const index = await getCacheIndex();
    return Object.values(index);
  } catch (error) {
    console.error("Failed to get all cached photos:", error);
    return [];
  }
}

/**
 * 撤销编辑（恢复原图）
 * @param photoId 照片ID
 */
export async function undoEdit(photoId: string): Promise<string | null> {
  try {
    const cached = await getCachedPhoto(photoId);
    if (!cached) {
      return null;
    }

    // 删除编辑后的照片
    if (cached.editedUri) {
      const editedInfo = await FileSystem.getInfoAsync(cached.editedUri);
      if (editedInfo.exists) {
        await FileSystem.deleteAsync(cached.editedUri);
      }
    }

    // 更新缓存索引
    await updateCacheIndex(photoId, {
      editedUri: undefined,
      editHistory: [],
    });

    console.log("Edit undone for photo:", photoId);
    return cached.originalUri;
  } catch (error) {
    console.error("Failed to undo edit:", error);
    return null;
  }
}

/**
 * 删除缓存的照片
 * @param photoId 照片ID
 */
export async function deleteCachedPhoto(photoId: string): Promise<void> {
  try {
    const cached = await getCachedPhoto(photoId);
    if (!cached) {
      return;
    }

    // 删除原图
    const originalInfo = await FileSystem.getInfoAsync(cached.originalUri);
    if (originalInfo.exists) {
      await FileSystem.deleteAsync(cached.originalUri);
    }

    // 删除编辑后的照片
    if (cached.editedUri) {
      const editedInfo = await FileSystem.getInfoAsync(cached.editedUri);
      if (editedInfo.exists) {
        await FileSystem.deleteAsync(cached.editedUri);
      }
    }

    // 从索引中删除
    const index = await getCacheIndex();
    delete index[photoId];
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));

    console.log("Cached photo deleted:", photoId);
  } catch (error) {
    console.error("Failed to delete cached photo:", error);
  }
}

/**
 * 获取缓存索引
 */
async function getCacheIndex(): Promise<Record<string, CachedPhoto>> {
  try {
    const indexJson = await AsyncStorage.getItem(CACHE_INDEX_KEY);
    return indexJson ? JSON.parse(indexJson) : {};
  } catch (error) {
    console.error("Failed to get cache index:", error);
    return {};
  }
}

/**
 * 更新缓存索引
 */
async function updateCacheIndex(
  photoId: string,
  updates: Partial<CachedPhoto>
): Promise<void> {
  try {
    const index = await getCacheIndex();
    index[photoId] = {
      ...index[photoId],
      ...updates,
    } as CachedPhoto;
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error("Failed to update cache index:", error);
  }
}

/**
 * 获取缓存大小
 */
export async function getCacheSize(): Promise<number> {
  try {
    const cacheDirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!cacheDirInfo.exists) {
      return 0;
    }

    let totalSize = 0;
    const files = await FileSystem.readDirectoryAsync(CACHE_DIR);

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${CACHE_DIR}${file}`);
      if (fileInfo.exists && !fileInfo.isDirectory) {
        totalSize += fileInfo.size || 0;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Failed to get cache size:", error);
    return 0;
  }
}

/**
 * 清空缓存
 */
export async function clearCache(): Promise<void> {
  try {
    const cacheDirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (cacheDirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
    }

    await AsyncStorage.removeItem(CACHE_INDEX_KEY);
    await initCacheDirectory();

    console.log("Cache cleared");
  } catch (error) {
    console.error("Failed to clear cache:", error);
  }
}
