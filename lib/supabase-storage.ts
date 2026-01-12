import { supabase } from "./supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

/**
 * Supabase Storage云端备份服务
 * 实现照片自动上传到云端
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 上传照片到Supabase Storage
 * @param localUri 本地照片URI
 * @param userId 用户ID
 * @returns 上传结果
 */
export async function uploadPhotoToCloud(
  localUri: string,
  userId: string
): Promise<UploadResult> {
  try {
    // 1. 读取本地文件为base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. 生成唯一文件名
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}.jpg`;

    // 3. 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from("photos")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // 4. 获取公开URL
    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Upload exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 异步上传照片（后台任务）
 * @param localUri 本地照片URI
 * @param userId 用户ID
 */
export async function uploadPhotoAsync(
  localUri: string,
  userId: string
): Promise<void> {
  // 使用setTimeout模拟后台异步上传
  setTimeout(async () => {
    const result = await uploadPhotoToCloud(localUri, userId);
    if (result.success) {
      console.log("Photo uploaded successfully:", result.url);
    } else {
      console.error("Photo upload failed:", result.error);
    }
  }, 0);
}

/**
 * 批量上传照片
 * @param localUris 本地照片URI数组
 * @param userId 用户ID
 * @param onProgress 进度回调
 */
export async function uploadPhotosInBatch(
  localUris: string[],
  userId: string,
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < localUris.length; i++) {
    const result = await uploadPhotoToCloud(localUris[i], userId);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, localUris.length);
    }
  }

  return results;
}

/**
 * 获取用户的所有云端照片
 * @param userId 用户ID
 */
export async function getUserCloudPhotos(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from("photos")
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("List photos error:", error);
      return [];
    }

    // 获取所有照片的公开URL
    const urls = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`${userId}/${file.name}`);
      return urlData.publicUrl;
    });

    return urls;
  } catch (error) {
    console.error("Get photos exception:", error);
    return [];
  }
}

/**
 * 删除云端照片
 * @param userId 用户ID
 * @param fileName 文件名
 */
export async function deleteCloudPhoto(
  userId: string,
  fileName: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from("photos")
      .remove([`${userId}/${fileName}`]);

    if (error) {
      console.error("Delete photo error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete photo exception:", error);
    return false;
  }
}
