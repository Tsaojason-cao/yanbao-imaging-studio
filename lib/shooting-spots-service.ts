// import { supabase } from "./supabase-client";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 机位推荐服务
 * 提供基于地理位置的拍摄机位推荐功能
 */

// 机位数据类型
export interface ShootingSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  distance?: number; // 距离用户的距离（米）
  filterPresetId: string; // 推荐的滤镜预设id
  sampleImageUrl: string; // 实拍样张URL
  tags: string[]; // 标签（如：日落、人像、风景）
  rating: number; // 评分（1-5）
  visitCount: number; // 访问次数
  // 新增：建议参数（Ultimate Edition）
  recommendedParams?: {
    filter: string;           // 推荐滤镜名称（如“富士复古”）
    exposureCompensation: number; // 曝光补偿 (-2.0 ~ +2.0)
    iso?: number;             // ISO值
    beautyLevel?: number;     // 美颜强度 (0-100)
    hdrEnabled?: boolean;     // 是否启用HDR
    tips?: string;            // 拍摄提示
  };
}

// 用户位置类型
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// 缓存键
const CACHE_KEY_PREFIX = "shooting_spots_cache_";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24小时

/**
 * 获取用户当前位置
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("定位权限未授予");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
    };
  } catch (error) {
    console.error("获取用户位置失败:", error);
    return null;
  }
}

/**
 * 计算两点之间的距离（米）
 * 使用Haversine公式
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // 地球半径（米）
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 从Supabase获取附近的机位
 */
export async function fetchNearbySpots(
  userLocation: UserLocation,
  radiusKm: number = 5
): Promise<ShootingSpot[]> {
  try {
    // TODO: 集成Supabase后实现
    // const { data, error } = await supabase
    //   .from("shooting_spots")
    //   .select("*")
    //   .gte("latitude", userLocation.latitude - radiusKm / 111)
    //   .lte("latitude", userLocation.latitude + radiusKm / 111)
    //   .gte("longitude", userLocation.longitude - radiusKm / (111 * Math.cos(toRad(userLocation.latitude))))
    //   .lte("longitude", userLocation.longitude + radiusKm / (111 * Math.cos(toRad(userLocation.latitude))));

    // if (error) {
    //   console.error("获取机位失败:", error);
    //   return [];
    // }

    // 临时使用示例数据（Ultimate Edition 增强版）
    const sampleSpots: ShootingSpot[] = [
      {
        id: "1",
        name: "西湖断桥",
        description: "经典的杭州地标，适合拍摄日落和人像",
        latitude: 30.2599,
        longitude: 120.1484,
        filterPresetId: "1", // 雁宝专属
        sampleImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        tags: ["日落", "人像", "风景"],
        rating: 4.8,
        visitCount: 1523,
        recommendedParams: {
          filter: "清新",
          exposureCompensation: 0,
          iso: 200,
          beautyLevel: 60,
          hdrEnabled: true,
          tips: "黄昏时分拍摄效果最佳，建议使用HDR模式捕捉湖面反光。",
        },
      },
      {
        id: "2",
        name: "钱塘江大桥",
        description: "现代都市风光，适合拍摄建筑和夜景",
        latitude: 30.2108,
        longitude: 120.1363,
        filterPresetId: "3", // 冰壳模式
        sampleImageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400",
        tags: ["建筑", "夜景", "都市"],
        rating: 4.6,
        visitCount: 892,
        recommendedParams: {
          filter: "电影",
          exposureCompensation: 0.7,
          iso: 1600,
          beautyLevel: 50,
          hdrEnabled: false,
          tips: "夜景拍摄建议提高ISO和曝光补偿，使用三脚架更佳。",
        },
      },
      {
        id: "3",
        name: "灵隐寺",
        description: "古典禅意，适合拍摄人文和古建筑",
        latitude: 30.2416,
        longitude: 120.0973,
        filterPresetId: "2", // 日常自然
        sampleImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
        tags: ["人文", "古建筑", "禅意"],
        rating: 4.9,
        visitCount: 2134,
        recommendedParams: {
          filter: "富士复古",
          exposureCompensation: -0.3,
          iso: 400,
          beautyLevel: 55,
          hdrEnabled: false,
          tips: "适当降低曝光补偿，保留古建筑的沉稳氛围。",
        },
      },
      {
        id: "4",
        name: "北京798艺术区",
        description: "工业风与艺术结合，适合拍摄创意人像",
        latitude: 39.9847,
        longitude: 116.4964,
        filterPresetId: "3",
        sampleImageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400",
        tags: ["艺术", "人像", "创意"],
        rating: 4.7,
        visitCount: 1876,
        recommendedParams: {
          filter: "冰壳模式",
          exposureCompensation: 0,
          iso: 400,
          beautyLevel: 65,
          hdrEnabled: false,
          tips: "利用工业风背景增强对比，建议使用冰壳模式打造冷色调。",
        },
      },
      {
        id: "5",
        name: "杭州老店咖啡馆",
        description: "温馨文艺氛围，适合拍摄日常人像",
        latitude: 30.2741,
        longitude: 120.1551,
        filterPresetId: "1",
        sampleImageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
        tags: ["咖啡", "人像", "文艺"],
        rating: 4.5,
        visitCount: 743,
        recommendedParams: {
          filter: "富士复古",
          exposureCompensation: -0.3,
          iso: 800,
          beautyLevel: 70,
          hdrEnabled: false,
          tips: "咖啡馆内光线较暖，降低0.3曝光保留氛围，使用富士复古滤镜增强温暖感。",
        },
      },
    ];

    // 计算距离并排序
    const spotsWithDistance = sampleSpots.map((spot) => ({
      ...spot,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      ),
    }));

    // 过滤出指定半径内的机位并按距离排序
    const nearbySpots = spotsWithDistance
      .filter((spot) => spot.distance! <= radiusKm * 1000)
      .sort((a, b) => a.distance! - b.distance!);

    return nearbySpots;
  } catch (error) {
    console.error("获取附近机位失败:", error);
    return [];
  }
}

/**
 * 缓存机位数据到本地
 */
export async function cacheSpots(
  userLocation: UserLocation,
  spots: ShootingSpot[]
): Promise<void> {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userLocation.latitude.toFixed(2)}_${userLocation.longitude.toFixed(2)}`;
    const cacheData = {
      timestamp: Date.now(),
      spots,
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error("缓存机位数据失败:", error);
  }
}

/**
 * 从本地缓存读取机位数据
 */
export async function getCachedSpots(
  userLocation: UserLocation
): Promise<ShootingSpot[] | null> {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userLocation.latitude.toFixed(2)}_${userLocation.longitude.toFixed(2)}`;
    const cacheDataStr = await AsyncStorage.getItem(cacheKey);

    if (!cacheDataStr) {
      return null;
    }

    const cacheData = JSON.parse(cacheDataStr);

    // 检查缓存是否过期
    if (Date.now() - cacheData.timestamp > CACHE_EXPIRY_MS) {
      // 缓存过期，删除
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cacheData.spots;
  } catch (error) {
    console.error("读取缓存机位数据失败:", error);
    return null;
  }
}

/**
 * 获取附近机位（优先使用缓存）
 */
export async function getNearbySpots(
  radiusKm: number = 5
): Promise<ShootingSpot[]> {
  try {
    // 获取用户位置
    const userLocation = await getUserLocation();
    if (!userLocation) {
      console.log("无法获取用户位置");
      return [];
    }

    // 尝试从缓存读取
    const cachedSpots = await getCachedSpots(userLocation);
    if (cachedSpots) {
      console.log("使用缓存的机位数据");
      return cachedSpots;
    }

    // 从服务器获取
    const spots = await fetchNearbySpots(userLocation, radiusKm);

    // 缓存到本地
    await cacheSpots(userLocation, spots);

    return spots;
  } catch (error) {
    console.error("获取附近机位失败:", error);
    return [];
  }
}

/**
 * 格式化距离显示
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * 记录机位访问
 */
export async function recordSpotVisit(spotId: string): Promise<void> {
  try {
    // TODO: 集成Supabase后实现
    // await supabase
    //   .from("shooting_spots")
    //   .update({ visit_count: supabase.raw("visit_count + 1") })
    //   .eq("id", spotId);

    console.log(`记录机位访问: ${spotId}`);
  } catch (error) {
    console.error("记录机位访问失败:", error);
  }
}
