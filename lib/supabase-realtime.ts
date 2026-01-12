import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Supabase Realtime实时同步服务
 * 实现北京↔杭州<500ms的多端同步
 */

export interface PhotoSyncEvent {
  id: string;
  userId: string;
  photoUrl: string;
  timestamp: number;
  action: "upload" | "delete" | "update";
}

let realtimeChannel: RealtimeChannel | null = null;

/**
 * 初始化Realtime连接
 * @param userId 用户ID
 * @param onPhotoSync 照片同步回调
 */
export function initRealtimeSync(
  userId: string,
  onPhotoSync: (event: PhotoSyncEvent) => void
): void {
  // 如果已有连接，先断开
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
  }

  // 创建Realtime频道
  realtimeChannel = supabase.channel(`photos:${userId}`);

  // 监听照片上传事件
  realtimeChannel
    .on(
      "broadcast",
      { event: "photo_sync" },
      (payload: { payload: PhotoSyncEvent }) => {
        console.log("Received photo sync event:", payload.payload);
        onPhotoSync(payload.payload);
      }
    )
    .subscribe((status) => {
      console.log("Realtime subscription status:", status);
    });
}

/**
 * 广播照片同步事件
 * @param userId 用户ID
 * @param event 同步事件
 */
export async function broadcastPhotoSync(
  userId: string,
  event: PhotoSyncEvent
): Promise<void> {
  if (!realtimeChannel) {
    console.error("Realtime channel not initialized");
    return;
  }

  try {
    await realtimeChannel.send({
      type: "broadcast",
      event: "photo_sync",
      payload: event,
    });
    console.log("Broadcasted photo sync event:", event);
  } catch (error) {
    console.error("Failed to broadcast photo sync:", error);
  }
}

/**
 * 断开Realtime连接
 */
export function disconnectRealtimeSync(): void {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
    realtimeChannel = null;
    console.log("Realtime sync disconnected");
  }
}

/**
 * 测试Realtime延迟
 * @param userId 用户ID
 * @returns 延迟时间（毫秒）
 */
export async function testRealtimeLatency(userId: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testChannel = supabase.channel(`latency_test:${userId}`);

    testChannel
      .on(
        "broadcast",
        { event: "ping" },
        () => {
          const latency = Date.now() - startTime;
          console.log(`Realtime latency: ${latency}ms`);
          testChannel.unsubscribe();
          resolve(latency);
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await testChannel.send({
            type: "broadcast",
            event: "ping",
            payload: { timestamp: startTime },
          });
        }
      });

    // 超时处理
    setTimeout(() => {
      testChannel.unsubscribe();
      resolve(-1); // 返回-1表示超时
    }, 5000);
  });
}

/**
 * 监听照片表的数据库变化（Postgres Changes）
 * @param userId 用户ID
 * @param onInsert 插入回调
 * @param onDelete 删除回调
 */
export function subscribeToPhotoChanges(
  userId: string,
  onInsert: (photo: any) => void,
  onDelete: (photoId: string) => void
): void {
  // 监听INSERT事件
  supabase
    .channel(`db_photos:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "photos",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Photo inserted:", payload.new);
        onInsert(payload.new);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "photos",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Photo deleted:", payload.old);
        onDelete((payload.old as any).id);
      }
    )
    .subscribe();
}

/**
 * 获取Realtime连接状态
 */
export function getRealtimeStatus(): string {
  if (!realtimeChannel) {
    return "disconnected";
  }
  return realtimeChannel.state;
}
