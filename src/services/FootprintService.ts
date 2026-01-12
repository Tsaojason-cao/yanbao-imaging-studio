/**
 * 足迹服务
 * 记录和管理用户访问过的机位
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Footprint {
  spotId: string;
  spotName: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  firstVisitTime: number; // Unix timestamp
  lastVisitTime: number; // Unix timestamp
  photosTaken: number;
}

const FOOTPRINTS_KEY = "@yanbao_footprints";

/**
 * 足迹服务类
 */
export class FootprintService {
  /**
   * 记录一次机位访问
   */
  static async recordVisit(
    spotId: string,
    spotName: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      const footprints = await this.getAllFootprints();
      const existingIndex = footprints.findIndex((f) => f.spotId === spotId);

      if (existingIndex >= 0) {
        // 更新现有足迹
        footprints[existingIndex].visitCount += 1;
        footprints[existingIndex].lastVisitTime = Date.now();
      } else {
        // 创建新足迹
        const newFootprint: Footprint = {
          spotId,
          spotName,
          latitude,
          longitude,
          visitCount: 1,
          firstVisitTime: Date.now(),
          lastVisitTime: Date.now(),
          photosTaken: 0,
        };
        footprints.push(newFootprint);
      }

      await AsyncStorage.setItem(FOOTPRINTS_KEY, JSON.stringify(footprints));
    } catch (error) {
      console.error("记录足迹失败:", error);
    }
  }

  /**
   * 增加机位拍照计数
   */
  static async incrementPhotoCount(spotId: string): Promise<void> {
    try {
      const footprints = await this.getAllFootprints();
      const footprint = footprints.find((f) => f.spotId === spotId);

      if (footprint) {
        footprint.photosTaken += 1;
        await AsyncStorage.setItem(FOOTPRINTS_KEY, JSON.stringify(footprints));
      }
    } catch (error) {
      console.error("更新拍照计数失败:", error);
    }
  }

  /**
   * 获取所有足迹
   */
  static async getAllFootprints(): Promise<Footprint[]> {
    try {
      const data = await AsyncStorage.getItem(FOOTPRINTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("获取足迹失败:", error);
      return [];
    }
  }

  /**
   * 获取足迹统计数据
   */
  static async getStatistics(): Promise<{
    totalSpots: number;
    totalVisits: number;
    totalPhotos: number;
    mostVisitedSpot: Footprint | null;
  }> {
    const footprints = await this.getAllFootprints();

    const totalSpots = footprints.length;
    const totalVisits = footprints.reduce((sum, f) => sum + f.visitCount, 0);
    const totalPhotos = footprints.reduce((sum, f) => sum + f.photosTaken, 0);

    let mostVisitedSpot: Footprint | null = null;
    if (footprints.length > 0) {
      mostVisitedSpot = footprints.reduce((max, f) =>
        f.visitCount > max.visitCount ? f : max
      );
    }

    return {
      totalSpots,
      totalVisits,
      totalPhotos,
      mostVisitedSpot,
    };
  }

  /**
   * 清空所有足迹
   */
  static async clearAllFootprints(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FOOTPRINTS_KEY);
    } catch (error) {
      console.error("清空足迹失败:", error);
    }
  }
}
