import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
// import { supabase } from "./supabase-client";

/**
 * 统计服务
 * 提供真实的本地空间统计和云端数据同步
 */

export interface AppStats {
  localStorageUsed: number; // 本地占用空间（字节）
  cloudStorageUsed: number; // 云端占用空间（字节）
  editedPhotosCount: number; // 已编辑照片数
  totalPhotosCount: number; // 总照片数
  backupProgress: number; // 备份进度（0-100）
}

/**
 * 获取本地存储占用空间
 */
export async function getLocalStorageUsed(): Promise<number> {
  try {
    const appDir = FileSystem.documentDirectory!;
    const totalSize = await calculateDirectorySize(appDir);
    return totalSize;
  } catch (error) {
    console.error("获取本地存储失败:", error);
    return 0;
  }
}

/**
 * 递归计算目录大小
 */
async function calculateDirectorySize(dirPath: string): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    
    if (!dirInfo.exists) {
      return 0;
    }

    // 如果是文件，直接返回大小
    if (!dirInfo.isDirectory) {
      return dirInfo.size || 0;
    }

    // 如果是目录，递归计算所有文件大小
    const files = await FileSystem.readDirectoryAsync(dirPath);
    let totalSize = 0;

    for (const file of files) {
      const filePath = `${dirPath}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        if (fileInfo.isDirectory) {
          // 递归计算子目录
          totalSize += await calculateDirectorySize(`${filePath}/`);
        } else {
          // 累加文件大小
          totalSize += fileInfo.size || 0;
        }
      }
    }

    return totalSize;
  } catch (error) {
    console.error(`计算目录大小失败 (${dirPath}):`, error);
    return 0;
  }
}

/**
 * 获取云端存储占用空间
 */
export async function getCloudStorageUsed(): Promise<number> {
  try {
    // TODO: 集成Supabase后实现
    // const { data, error } = await supabase
    //   .from("user_files")
    //   .select("size")
    //   .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
    // const totalSize = data?.reduce((sum: number, file: any) => sum + (file.size || 0), 0) || 0;
    return 0;
  } catch (error) {
    console.error("获取云端存储失败:", error);
    return 0;
  }
}

/**
 * 获取已编辑照片数
 */
export async function getEditedPhotosCount(): Promise<number> {
  try {
    const editedDir = `${FileSystem.documentDirectory!}edited/`;
    const dirInfo = await FileSystem.getInfoAsync(editedDir);

    if (!dirInfo.exists || !dirInfo.isDirectory) {
      return 0;
    }

    const files = await FileSystem.readDirectoryAsync(editedDir);
    // 只统计图片文件
    const imageFiles = files.filter(file => 
      file.endsWith(".jpg") || 
      file.endsWith(".jpeg") || 
      file.endsWith(".png")
    );

    return imageFiles.length;
  } catch (error) {
    console.error("获取已编辑照片数失败:", error);
    return 0;
  }
}

/**
 * 获取总照片数
 */
export async function getTotalPhotosCount(): Promise<number> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      return 0;
    }

    const { totalCount } = await MediaLibrary.getAssetsAsync({
      first: 1,
      mediaType: "photo",
    });

    return totalCount;
  } catch (error) {
    console.error("获取总照片数失败:", error);
    return 0;
  }
}

/**
 * 获取备份进度
 */
export async function getBackupProgress(): Promise<number> {
  try {
    const totalPhotos = await getTotalPhotosCount();
    if (totalPhotos === 0) {
      return 100;
    }

    // TODO: 集成Supabase后实现
    // const { data, error } = await supabase
    //   .from("user_files")
    //   .select("id", { count: "exact" })
    //   .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    //   .eq("type", "photo");
    // const backedUpCount = data?.length || 0;
    // const progress = Math.min(100, Math.round((backedUpCount / totalPhotos) * 100));
    return 0;
  } catch (error) {
    console.error("获取备份进度失败:", error);
    return 0;
  }
}

/**
 * 获取完整的应用统计数据
 */
export async function getAppStats(): Promise<AppStats> {
  try {
    const [
      localStorageUsed,
      cloudStorageUsed,
      editedPhotosCount,
      totalPhotosCount,
      backupProgress,
    ] = await Promise.all([
      getLocalStorageUsed(),
      getCloudStorageUsed(),
      getEditedPhotosCount(),
      getTotalPhotosCount(),
      getBackupProgress(),
    ]);

    return {
      localStorageUsed,
      cloudStorageUsed,
      editedPhotosCount,
      totalPhotosCount,
      backupProgress,
    };
  } catch (error) {
    console.error("获取应用统计失败:", error);
    return {
      localStorageUsed: 0,
      cloudStorageUsed: 0,
      editedPhotosCount: 0,
      totalPhotosCount: 0,
      backupProgress: 0,
    };
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
