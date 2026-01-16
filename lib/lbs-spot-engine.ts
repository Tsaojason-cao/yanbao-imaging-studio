/**
 * LBS 机位推荐系统
 * 
 * 核心功能：
 * - 基于用户当前经纬度推荐最美摄影机位
 * - 集成地图SDK（Google Maps / 高德地图）
 * - 实时获取定位权限
 * - 机位数据库管理
 * 
 * by Jason Tsao ❤️
 */

import * as Location from 'expo-location';
import { Platform } from 'react-native';

/**
 * 摄影机位接口
 */
export interface PhotoSpot {
  id: string;
  name: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  tags: string[];
  rating: number;
  description: string;
  bestTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  images: string[];
  masterRecommendations: number[]; // 推荐的大师ID列表
}

/**
 * 用户位置接口
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

/**
 * 机位推荐结果
 */
export interface SpotRecommendation {
  spot: PhotoSpot;
  distance: number; // 距离（米）
  direction: string; // 方向（东南西北）
  estimatedTime: number; // 预计到达时间（分钟）
  currentWeather?: string;
  lightingCondition?: string;
}

/**
 * LBS 机位推荐引擎
 */
export class LBSSpotEngine {
  private static instance: LBSSpotEngine;
  private currentLocation: UserLocation | null = null;
  private locationWatchId: Location.LocationSubscription | null = null;
  private spotDatabase: PhotoSpot[] = [];

  private constructor() {
    this.initializeSpotDatabase();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): LBSSpotEngine {
    if (!LBSSpotEngine.instance) {
      LBSSpotEngine.instance = new LBSSpotEngine();
    }
    return LBSSpotEngine.instance;
  }

  /**
   * 初始化机位数据库
   * 这里包含北京、上海、杭州等主要城市的精选摄影机位
   */
  private initializeSpotDatabase() {
    this.spotDatabase = [
      // 北京机位
      {
        id: 'spot_beijing_001',
        name: '故宫角楼',
        nameEn: 'Forbidden City Corner Tower',
        latitude: 39.9163,
        longitude: 116.3972,
        address: '北京市东城区景山前街4号',
        category: '古建筑',
        tags: ['日出', '日落', '倒影', '古建筑'],
        rating: 4.9,
        description: '故宫角楼是北京最经典的摄影机位之一，尤其是护城河倒影与角楼的组合',
        bestTime: '日出（5:30-6:30）、日落（17:30-18:30）',
        difficulty: 'easy',
        tips: [
          '推荐使用广角镜头',
          '日出时分光线最佳',
          '可以拍摄角楼倒影',
          '注意避开游客高峰期',
        ],
        images: ['/assets/spots/beijing_001.jpg'],
        masterRecommendations: [1, 4, 17], // 肖全、Ansel Adams、Edward Weston
      },
      {
        id: 'spot_beijing_002',
        name: '798艺术区',
        nameEn: '798 Art Zone',
        latitude: 39.9843,
        longitude: 116.4961,
        address: '北京市朝阳区酒仙桥路4号',
        category: '艺术区',
        tags: ['街拍', '涂鸦', '工业风', '人文'],
        rating: 4.7,
        description: '前工业厂房改造的艺术区，充满创意与色彩',
        bestTime: '全天（10:00-17:00 光线最佳）',
        difficulty: 'easy',
        tips: [
          '适合街拍和人像',
          '注意寻找有趣的涂鸦墙',
          '工业风建筑是绝佳背景',
          '周末人流较多',
        ],
        images: ['/assets/spots/beijing_002.jpg'],
        masterRecommendations: [2, 5, 19], // 孙郡、HCB、Garry Winogrand
      },
      {
        id: 'spot_beijing_003',
        name: '颐和园十七孔桥',
        nameEn: 'Seventeen-Arch Bridge',
        latitude: 39.9988,
        longitude: 116.2753,
        address: '北京市海淀区新建宫门路19号',
        category: '园林',
        tags: ['日落', '金光穿洞', '古建筑', '倒影'],
        rating: 5.0,
        description: '冬至前后的"金光穿洞"奇观，是摄影师必拍的场景',
        bestTime: '冬至前后日落时分（16:30-17:00）',
        difficulty: 'medium',
        tips: [
          '冬至前后3天是最佳拍摄时间',
          '需要提前占位',
          '使用长焦镜头压缩空间',
          '注意曝光控制',
        ],
        images: ['/assets/spots/beijing_003.jpg'],
        masterRecommendations: [4, 17, 29], // Ansel Adams、Edward Weston、Hiroshi Sugimoto
      },

      // 上海机位
      {
        id: 'spot_shanghai_001',
        name: '外滩',
        nameEn: 'The Bund',
        latitude: 31.2397,
        longitude: 121.4900,
        address: '上海市黄浦区中山东一路',
        category: '城市景观',
        tags: ['夜景', '城市', '天际线', '倒影'],
        rating: 4.8,
        description: '上海最经典的城市天际线拍摄点',
        bestTime: '日落后蓝调时刻（18:30-19:30）',
        difficulty: 'easy',
        tips: [
          '蓝调时刻最佳',
          '使用三脚架长曝光',
          '注意构图中的引导线',
          '可以拍摄黄浦江倒影',
        ],
        images: ['/assets/spots/shanghai_001.jpg'],
        masterRecommendations: [4, 24, 29], // Ansel Adams、Andreas Gursky、Hiroshi Sugimoto
      },
      {
        id: 'spot_shanghai_002',
        name: '田子坊',
        nameEn: 'Tianzifang',
        latitude: 31.2104,
        longitude: 121.4654,
        address: '上海市黄浦区泰康路210弄',
        category: '老街区',
        tags: ['街拍', '人文', '老上海', '弄堂'],
        rating: 4.6,
        description: '保留了老上海风情的艺术街区',
        bestTime: '上午（9:00-11:00）或下午（14:00-16:00）',
        difficulty: 'easy',
        tips: [
          '适合街拍和人文纪实',
          '注意光影对比',
          '寻找有趣的细节',
          '避开周末人流高峰',
        ],
        images: ['/assets/spots/shanghai_002.jpg'],
        masterRecommendations: [1, 2, 5], // 肖全、孙郡、HCB
      },

      // 杭州机位
      {
        id: 'spot_hangzhou_001',
        name: '西湖断桥',
        nameEn: 'Broken Bridge',
        latitude: 30.2599,
        longitude: 120.1484,
        address: '浙江省杭州市西湖区北山街',
        category: '湖景',
        tags: ['日出', '雪景', '古桥', '倒影'],
        rating: 4.9,
        description: '西湖十景之一，雪后的断桥残雪尤为经典',
        bestTime: '日出（5:30-6:30）、雪后',
        difficulty: 'easy',
        tips: [
          '雪后拍摄最佳',
          '日出时分光线柔和',
          '可以拍摄保俶塔',
          '注意前景的运用',
        ],
        images: ['/assets/spots/hangzhou_001.jpg'],
        masterRecommendations: [3, 4, 30], // 林海音、Ansel Adams、Rinko Kawauchi
      },
      {
        id: 'spot_hangzhou_002',
        name: '九溪烟树',
        nameEn: 'Nine Creeks',
        latitude: 30.1989,
        longitude: 120.1196,
        address: '浙江省杭州市西湖区龙井村南',
        category: '自然风光',
        tags: ['溪流', '森林', '雾气', '长曝光'],
        rating: 4.7,
        description: '九溪十八涧，山水相依，烟雾缭绕',
        bestTime: '清晨（6:00-8:00）雾气最浓',
        difficulty: 'medium',
        tips: [
          '清晨雾气最佳',
          '使用慢门拍摄流水',
          '注意构图的层次感',
          '穿防滑鞋',
        ],
        images: ['/assets/spots/hangzhou_002.jpg'],
        masterRecommendations: [4, 17, 29], // Ansel Adams、Edward Weston、Hiroshi Sugimoto
      },

      // 成都机位
      {
        id: 'spot_chengdu_001',
        name: '宽窄巷子',
        nameEn: 'Wide and Narrow Alley',
        latitude: 30.6733,
        longitude: 104.0546,
        address: '四川省成都市青羊区金河路口',
        category: '老街区',
        tags: ['街拍', '人文', '川西民居', '茶馆'],
        rating: 4.5,
        description: '成都三大历史文化保护区之一，川西民居的代表',
        bestTime: '上午（9:00-11:00）或傍晚（17:00-19:00）',
        difficulty: 'easy',
        tips: [
          '适合街拍和人文纪实',
          '茶馆是很好的拍摄场景',
          '注意光影的运用',
          '避开节假日',
        ],
        images: ['/assets/spots/chengdu_001.jpg'],
        masterRecommendations: [1, 2, 5], // 肖全、孙郡、HCB
      },

      // 西安机位
      {
        id: 'spot_xian_001',
        name: '大雁塔北广场',
        nameEn: 'Giant Wild Goose Pagoda',
        latitude: 34.2215,
        longitude: 108.9646,
        address: '陕西省西安市雁塔区雁塔路',
        category: '古建筑',
        tags: ['夜景', '音乐喷泉', '古塔', '城市'],
        rating: 4.6,
        description: '大雁塔与音乐喷泉的结合，夜景尤为壮观',
        bestTime: '夜晚（19:30-20:30）音乐喷泉时段',
        difficulty: 'easy',
        tips: [
          '夜晚拍摄最佳',
          '音乐喷泉时段人流密集',
          '使用三脚架',
          '注意曝光控制',
        ],
        images: ['/assets/spots/xian_001.jpg'],
        masterRecommendations: [4, 24], // Ansel Adams、Andreas Gursky
      },

      // 广州机位
      {
        id: 'spot_guangzhou_001',
        name: '小蛮腰（广州塔）',
        nameEn: 'Canton Tower',
        latitude: 23.1059,
        longitude: 113.3191,
        address: '广东省广州市海珠区阅江西路222号',
        category: '城市地标',
        tags: ['夜景', '城市', '地标', '倒影'],
        rating: 4.7,
        description: '广州的城市地标，夜景灯光秀非常壮观',
        bestTime: '夜晚（19:00-21:00）',
        difficulty: 'easy',
        tips: [
          '夜晚拍摄最佳',
          '珠江对岸是最佳机位',
          '使用三脚架长曝光',
          '可以拍摄倒影',
        ],
        images: ['/assets/spots/guangzhou_001.jpg'],
        masterRecommendations: [24, 29], // Andreas Gursky、Hiroshi Sugimoto
      },

      // 深圳机位
      {
        id: 'spot_shenzhen_001',
        name: '深圳湾公园',
        nameEn: 'Shenzhen Bay Park',
        latitude: 22.5165,
        longitude: 113.9547,
        address: '广东省深圳市南山区滨海大道',
        category: '海滨',
        tags: ['日落', '海景', '城市天际线', '长曝光'],
        rating: 4.8,
        description: '深圳最美的海滨公园，可以拍摄日落和城市天际线',
        bestTime: '日落时分（17:30-18:30）',
        difficulty: 'easy',
        tips: [
          '日落时分最佳',
          '可以拍摄城市天际线',
          '使用渐变镜平衡曝光',
          '注意潮汐时间',
        ],
        images: ['/assets/spots/shenzhen_001.jpg'],
        masterRecommendations: [4, 29, 30], // Ansel Adams、Hiroshi Sugimoto、Rinko Kawauchi
      },
    ];
  }

  /**
   * 请求定位权限
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  }

  /**
   * 获取当前位置
   */
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        timestamp: location.timestamp,
      };

      return this.currentLocation;
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * 开始监听位置变化
   */
  async startWatchingLocation(callback: (location: UserLocation) => void) {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      this.locationWatchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5秒更新一次
          distanceInterval: 10, // 移动10米更新一次
        },
        (location) => {
          const userLocation: UserLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
            timestamp: location.timestamp,
          };

          this.currentLocation = userLocation;
          callback(userLocation);
        }
      );
    } catch (error) {
      console.error('Failed to start watching location:', error);
    }
  }

  /**
   * 停止监听位置变化
   */
  stopWatchingLocation() {
    if (this.locationWatchId) {
      this.locationWatchId.remove();
      this.locationWatchId = null;
    }
  }

  /**
   * 计算两点之间的距离（米）
   * 使用 Haversine 公式
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // 地球半径（米）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 计算方向（东南西北）
   */
  private calculateDirection(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): string {
    const angle = Math.atan2(lon2 - lon1, lat2 - lat1) * (180 / Math.PI);
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(((angle + 360) % 360) / 45) % 8;
    return directions[index];
  }

  /**
   * 根据当前位置推荐附近的摄影机位
   */
  async getRecommendedSpots(
    maxDistance: number = 50000, // 默认50公里
    limit: number = 10
  ): Promise<SpotRecommendation[]> {
    const location = this.currentLocation || (await this.getCurrentLocation());
    
    if (!location) {
      console.warn('No location available');
      return [];
    }

    // 计算所有机位的距离
    const spotsWithDistance = this.spotDatabase.map((spot) => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );

      const direction = this.calculateDirection(
        location.latitude,
        location.longitude,
        spot.latitude,
        spot.longitude
      );

      // 估算到达时间（假设步行速度 5km/h）
      const estimatedTime = Math.round((distance / 1000 / 5) * 60);

      return {
        spot,
        distance,
        direction,
        estimatedTime,
      };
    });

    // 过滤距离并排序
    const recommendations = spotsWithDistance
      .filter((item) => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return recommendations;
  }

  /**
   * 根据分类筛选机位
   */
  getSpotsByCategory(category: string): PhotoSpot[] {
    return this.spotDatabase.filter((spot) => spot.category === category);
  }

  /**
   * 根据标签筛选机位
   */
  getSpotsByTag(tag: string): PhotoSpot[] {
    return this.spotDatabase.filter((spot) => spot.tags.includes(tag));
  }

  /**
   * 根据大师推荐筛选机位
   */
  getSpotsByMaster(masterId: number): PhotoSpot[] {
    return this.spotDatabase.filter((spot) =>
      spot.masterRecommendations.includes(masterId)
    );
  }

  /**
   * 搜索机位
   */
  searchSpots(keyword: string): PhotoSpot[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.spotDatabase.filter(
      (spot) =>
        spot.name.toLowerCase().includes(lowerKeyword) ||
        spot.nameEn.toLowerCase().includes(lowerKeyword) ||
        spot.address.toLowerCase().includes(lowerKeyword) ||
        spot.description.toLowerCase().includes(lowerKeyword) ||
        spot.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 获取所有机位
   */
  getAllSpots(): PhotoSpot[] {
    return this.spotDatabase;
  }

  /**
   * 添加自定义机位
   */
  addCustomSpot(spot: PhotoSpot) {
    this.spotDatabase.push(spot);
  }

  /**
   * 获取当前位置信息
   */
  getCurrentLocationInfo(): UserLocation | null {
    return this.currentLocation;
  }
}

// 导出单例
export const lbsSpotEngine = LBSSpotEngine.getInstance();
