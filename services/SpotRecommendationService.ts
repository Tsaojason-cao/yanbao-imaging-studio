import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

/**
 * 机位推荐数据结构
 */
export interface PhotoSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: 'landscape' | 'portrait' | 'architecture' | 'street';
  // 摄影参数建议
  photographyTips: {
    filter: string;           // 推荐滤镜
    exposureCompensation: number; // 曝光补偿 (-2.0 to 2.0)
    iso: number;              // ISO 值
    whiteBalance: string;     // 白平衡
    bestTime: string;         // 最佳拍摄时间
    composition: string;      // 构图建议
  };
  description: string;
  rating: number;
  distance?: number; // 距离当前位置（米）
}

/**
 * 机位推荐服务
 * 提供智能机位推荐和摄影参数建议
 */
export class SpotRecommendationService {
  private static instance: SpotRecommendationService;
  private currentLocation: Location.LocationObject | null = null;

  // 预设机位数据库
  private spots: PhotoSpot[] = [
    {
      id: 'spot_001',
      name: '西湖断桥',
      latitude: 30.2599,
      longitude: 120.1484,
      category: 'landscape',
      photographyTips: {
        filter: '日系滤镜',
        exposureCompensation: -0.3,
        iso: 100,
        whiteBalance: '日光',
        bestTime: '清晨 6:00-8:00 或 傍晚 17:00-19:00',
        composition: '使用三分法，将断桥放在画面右侧三分之一处',
      },
      description: '杭州西湖最佳拍摄点，适合拍摄日出和雾气',
      rating: 4.9,
    },
    {
      id: 'spot_002',
      name: '故宫角楼',
      latitude: 39.9163,
      longitude: 116.3972,
      category: 'architecture',
      photographyTips: {
        filter: '复古胶片',
        exposureCompensation: 0.0,
        iso: 200,
        whiteBalance: '阴天',
        bestTime: '日落前 1 小时（金色时刻）',
        composition: '使用对称构图，将角楼倒影纳入画面',
      },
      description: '北京故宫经典机位，适合拍摄建筑对称美',
      rating: 5.0,
    },
    {
      id: 'spot_003',
      name: '颐和园十七孔桥',
      latitude: 39.9987,
      longitude: 116.2714,
      category: 'landscape',
      photographyTips: {
        filter: '暖阳滤镜',
        exposureCompensation: +0.7,
        iso: 100,
        whiteBalance: '日光',
        bestTime: '冬至前后日落时分（金光穿洞）',
        composition: '低角度拍摄，捕捉阳光穿过桥洞的瞬间',
      },
      description: '颐和园最佳拍摄点，冬至金光穿洞奇观',
      rating: 4.8,
    },
    {
      id: 'spot_004',
      name: '天坛祈年殿',
      latitude: 39.8826,
      longitude: 116.4074,
      category: 'architecture',
      photographyTips: {
        filter: '库洛米甜酷风',
        exposureCompensation: -0.5,
        iso: 100,
        whiteBalance: '自动',
        bestTime: '上午 9:00-11:00（侧光）',
        composition: '使用广角镜头，从低角度仰拍突出建筑气势',
      },
      description: '北京天坛经典机位，适合拍摄古建筑',
      rating: 4.7,
    },
  ];

  private constructor() {}

  static getInstance(): SpotRecommendationService {
    if (!SpotRecommendationService.instance) {
      SpotRecommendationService.instance = new SpotRecommendationService();
    }
    return SpotRecommendationService.instance;
  }

  /**
   * 获取当前位置
   */
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('[SpotRecommendation] Location permission denied');
        return null;
      }

      this.currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return this.currentLocation;
    } catch (error) {
      console.error('[SpotRecommendation] Error getting location:', error);
      return null;
    }
  }

  /**
   * 计算两点之间的距离（米）
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // 地球半径（米）
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
   * 获取附近的机位推荐
   */
  async getNearbySpots(radiusKm: number = 50): Promise<PhotoSpot[]> {
    const location = await this.getCurrentLocation();
    if (!location) {
      return this.spots; // 如果无法获取位置，返回所有机位
    }

    const { latitude, longitude } = location.coords;

    // 计算距离并过滤
    const spotsWithDistance = this.spots
      .map((spot) => ({
        ...spot,
        distance: this.calculateDistance(
          latitude,
          longitude,
          spot.latitude,
          spot.longitude
        ),
      }))
      .filter((spot) => spot.distance! <= radiusKm * 1000)
      .sort((a, b) => a.distance! - b.distance!);

    return spotsWithDistance;
  }

  /**
   * 根据类别获取机位推荐
   */
  getSpotsByCategory(category: PhotoSpot['category']): PhotoSpot[] {
    return this.spots.filter((spot) => spot.category === category);
  }

  /**
   * 获取机位详情
   */
  getSpotById(id: string): PhotoSpot | undefined {
    return this.spots.find((spot) => spot.id === id);
  }

  /**
   * 打开原生地图导航
   * 支持高德/百度/Google 地图
   */
  async openMapNavigation(spot: PhotoSpot): Promise<boolean> {
    const { latitude, longitude, name } = spot;

    try {
      if (Platform.OS === 'ios') {
        // iOS 优先使用高德地图
        const amapUrl = `iosamap://path?sourceApplication=yanbao&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
        const canOpenAmap = await Linking.canOpenURL(amapUrl);

        if (canOpenAmap) {
          await Linking.openURL(amapUrl);
          return true;
        }

        // 备选：Apple 地图
        const appleMapUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
        await Linking.openURL(appleMapUrl);
        return true;
      } else {
        // Android 优先使用高德地图
        const amapUrl = `androidamap://route?sourceApplication=yanbao&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
        const canOpenAmap = await Linking.canOpenURL(amapUrl);

        if (canOpenAmap) {
          await Linking.openURL(amapUrl);
          return true;
        }

        // 备选：百度地图
        const baiduUrl = `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving`;
        const canOpenBaidu = await Linking.canOpenURL(baiduUrl);

        if (canOpenBaidu) {
          await Linking.openURL(baiduUrl);
          return true;
        }

        // 最终备选：Google 地图
        const googleUrl = `google.navigation:q=${latitude},${longitude}`;
        await Linking.openURL(googleUrl);
        return true;
      }
    } catch (error) {
      console.error('[SpotRecommendation] Error opening map:', error);
      return false;
    }
  }

  /**
   * 获取机位的摄影参数建议
   */
  getPhotographyTips(spotId: string): PhotoSpot['photographyTips'] | null {
    const spot = this.getSpotById(spotId);
    return spot ? spot.photographyTips : null;
  }
}
