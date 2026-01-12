/**
 * 灵感推荐服务
 * 从外部平台（小红书、抖音等）获取拍照机位、姿势、风格等内容
 */

import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ContentCategory = "all" | "spots" | "poses" | "styles";

export interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  location?: string;
  category: ContentCategory;
  views?: number;
  author?: string;
  sourceUrl?: string;
  sourcePlatform?: "xiaohongshu" | "douyin" | "web";
}

export interface SpotDetail {
  id: string;
  title: string;
  images: string[];
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  views: number;
  description: string;
  recommendedStyles: string[];
  shootingTips: {
    bestTime: string;
    filter: string;
    beautyIntensity: number;
    exposure: string;
  };
  poseReferences: string[];
  sourceUrl?: string;
}

const CACHE_KEY_PREFIX = "inspiration_cache_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

/**
 * 获取用户当前位置
 */
async function getCurrentLocation(): Promise<{ city: string; latitude: number; longitude: number } | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("位置权限未授予");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (geocode.length > 0) {
      const city = geocode[0].city || geocode[0].region || "未知";
      return {
        city,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    }
  } catch (error) {
    console.error("获取位置失败:", error);
  }
  return null;
}

/**
 * 从缓存中获取数据
 */
async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_PREFIX + key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.error("读取缓存失败:", error);
  }
  return null;
}

/**
 * 保存数据到缓存
 */
async function saveToCache<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY_PREFIX + key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("保存缓存失败:", error);
  }
}

/**
 * 使用搜索引擎API搜索内容
 * 注意：这里使用的是模拟实现，实际应用中需要接入真实的搜索API
 */
async function searchContent(query: string, category: ContentCategory): Promise<InspirationItem[]> {
  // 尝试从缓存获取
  const cacheKey = `search_${category}_${query}`;
  const cached = await getFromCache<InspirationItem[]>(cacheKey);
  if (cached) {
    console.log("从缓存加载:", cacheKey);
    return cached;
  }

  // 实际应用中，这里应该调用搜索API
  // 例如：使用 SerpAPI、Google Custom Search API 等
  // const response = await fetch(`https://api.search.com/search?q=${encodeURIComponent(query)}`);
  // const data = await response.json();

  // 模拟数据（实际应该从API获取）
  const mockResults: InspirationItem[] = generateMockData(query, category);

  // 保存到缓存
  await saveToCache(cacheKey, mockResults);

  return mockResults;
}

/**
 * 生成模拟数据（仅用于演示）
 * 实际应用中应该从真实的API获取数据
 */
function generateMockData(query: string, category: ContentCategory): InspirationItem[] {
  const cities = ["杭州", "北京", "上海", "成都", "重庆"];
  const spots = ["西湖", "故宫", "外滩", "宽窄巷子", "洪崖洞"];
  const styles = ["日系", "复古", "清新", "港风", "韩系"];

  const results: InspirationItem[] = [];

  for (let i = 0; i < 10; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const spot = spots[Math.floor(Math.random() * spots.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    let title = "";
    let itemCategory: ContentCategory = category === "all" ? "spots" : category;

    if (category === "all" || category === "spots") {
      title = `${city}·${spot}拍照机位`;
      itemCategory = "spots";
    } else if (category === "poses") {
      title = `${style}风格拍照姿势教程`;
      itemCategory = "poses";
    } else if (category === "styles") {
      title = `${style}穿搭妆造指南`;
      itemCategory = "styles";
    }

    results.push({
      id: `${category}_${i}_${Date.now()}`,
      title,
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=400`,
      location: category === "spots" ? `${city}·${spot}` : "通用",
      category: itemCategory,
      views: Math.floor(Math.random() * 10000) + 100,
      author: Math.random() > 0.5 ? "小红书用户" : "抖音用户",
      sourcePlatform: Math.random() > 0.5 ? "xiaohongshu" : "douyin",
    });
  }

  return results;
}

/**
 * 获取灵感推荐内容
 */
export async function getInspirationContent(
  category: ContentCategory = "all",
  searchQuery?: string
): Promise<InspirationItem[]> {
  try {
    // 获取用户位置
    const location = await getCurrentLocation();
    const city = location?.city || "杭州"; // 默认杭州

    // 构建搜索关键词
    let query = searchQuery || "";
    if (!query) {
      if (category === "spots") {
        query = `${city} 拍照机位 推荐`;
      } else if (category === "poses") {
        query = `拍照姿势 教程`;
      } else if (category === "styles") {
        query = `拍照 穿搭 妆容`;
      } else {
        query = `${city} 拍照 攻略`;
      }
    }

    // 搜索内容
    const results = await searchContent(query, category);

    return results;
  } catch (error) {
    console.error("获取灵感内容失败:", error);
    return [];
  }
}

/**
 * 获取详情
 */
export async function getInspirationDetail(id: string): Promise<SpotDetail | null> {
  try {
    // 尝试从缓存获取
    const cacheKey = `detail_${id}`;
    const cached = await getFromCache<SpotDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    // 实际应用中，这里应该调用API获取详情
    // const response = await fetch(`https://api.example.com/detail/${id}`);
    // const data = await response.json();

    // 模拟数据
    const mockDetail: SpotDetail = {
      id,
      title: "西湖断桥·白娘子同款",
      images: [
        "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800",
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
      ],
      location: "杭州·西湖",
      address: "浙江省杭州市西湖区断桥",
      latitude: 30.2599,
      longitude: 120.1508,
      views: 12345,
      description:
        "西湖断桥是杭州最经典的拍照机位之一，春天桃花盛开时尤其美丽。推荐穿着浅色系服装，可以拍出清新脱俗的感觉。最佳拍摄时间是清晨或傍晚，光线柔和，人也相对较少。",
      recommendedStyles: ["日系", "复古", "清新"],
      shootingTips: {
        bestTime: "黄金时刻（日出后1小时 / 日落前1小时）",
        filter: "暖调滤镜",
        beautyIntensity: 60,
        exposure: "+0.5 EV",
      },
      poseReferences: [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400",
      ],
    };

    // 保存到缓存
    await saveToCache(cacheKey, mockDetail);

    return mockDetail;
  } catch (error) {
    console.error("获取详情失败:", error);
    return null;
  }
}

/**
 * 搜索内容
 */
export async function searchInspirationContent(query: string): Promise<InspirationItem[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const results = await searchContent(query, "all");
    return results;
  } catch (error) {
    console.error("搜索失败:", error);
    return [];
  }
}

/**
 * 清除缓存
 */
export async function clearInspirationCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    console.log("缓存已清除");
  } catch (error) {
    console.error("清除缓存失败:", error);
  }
}
