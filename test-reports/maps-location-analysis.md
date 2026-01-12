# 导航与机位推荐测试分析报告

## 测试模块：Maps & Location

### 1. 地图加载测试

#### 1.1 地图组件集成
**问题发现**: ❌ **未找到 react-native-maps 的实际使用**

**代码搜索结果**:
```bash
grep -r "react-native-maps\|MapView" --include="*.tsx" --include="*.ts" app/ components/
# 无结果
```

**分析**:
- package.json 中没有 `react-native-maps` 依赖
- 没有找到 MapView 组件的使用
- 机位推荐使用的是抽屉式列表展示，而非地图视图

**优化建议**:
需要添加地图功能：

```typescript
// 1. 安装依赖
// pnpm add react-native-maps

// 2. 创建地图组件
// components/spots-map-view.tsx
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export function SpotsMapView() {
  const [region, setRegion] = useState({
    latitude: 30.2741,
    longitude: 120.1551,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [spots, setSpots] = useState<ShootingSpot[]>([]);

  useEffect(() => {
    loadUserLocationAndSpots();
  }, []);

  const loadUserLocationAndSpots = async () => {
    const location = await getUserLocation();
    if (location) {
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    const nearbySpots = await getNearbySpots(10);
    setSpots(nearbySpots);
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={setRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          title={spot.name}
          description={spot.description}
        />
      ))}
    </MapView>
  );
}
```

#### 1.2 地图权限处理
**代码位置**: `lib/shooting-spots-service.ts:39-60`

```typescript
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
```

**测试结果**:
- ✅ **权限请求**: 正确使用 expo-location 请求权限
- ✅ **高精度定位**: 使用 Location.Accuracy.High
- ✅ **错误处理**: 包含 try-catch 错误处理
- ⚠️ **用户反馈**: 权限被拒绝时缺少用户提示

**优化建议**:

```typescript
import { Alert, Linking } from "react-native";

export async function getUserLocation(): Promise<UserLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "需要定位权限",
        "为了推荐附近的拍摄机位，需要访问您的位置信息",
        [
          { text: "取消", style: "cancel" },
          {
            text: "去设置",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000, // 10秒超时
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
    };
  } catch (error) {
    console.error("获取用户位置失败:", error);
    
    if (error.code === "E_LOCATION_TIMEOUT") {
      Alert.alert("定位超时", "请检查GPS是否开启");
    } else {
      Alert.alert("定位失败", "无法获取当前位置，请稍后重试");
    }
    
    return null;
  }
}
```

### 2. 数据匹配测试

#### 2.1 机位数据结构
**代码位置**: `lib/shooting-spots-service.ts:11-23`

```typescript
export interface ShootingSpot {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  distance?: number;
  filterPresetId: string;
  sampleImageUrl: string;
  tags: string[];
  rating: number;
  visitCount: number;
}
```

**测试结果**:
- ✅ **数据结构完整**: 包含所有必要字段
- ✅ **距离计算**: 支持动态计算距离
- ✅ **滤镜关联**: 每个机位关联推荐滤镜

#### 2.2 示例数据
**代码位置**: `lib/shooting-spots-service.ts:116-153`

```typescript
const sampleSpots: ShootingSpot[] = [
  {
    id: "1",
    name: "西湖断桥",
    description: "经典的杭州地标，适合拍摄日落和人像",
    latitude: 30.2599,
    longitude: 120.1484,
    filterPresetId: "1",
    sampleImageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    tags: ["日落", "人像", "风景"],
    rating: 4.8,
    visitCount: 1523,
  },
  // ...
];
```

**测试结果**:
- ✅ **杭州地标**: 包含西湖断桥、钱塘江大桥、灵隐寺
- ✅ **真实坐标**: 使用实际的经纬度坐标
- ✅ **样张图片**: 使用 Unsplash 图片
- ⚠️ **数据有限**: 仅 3 个示例机位
- ❌ **缺少北京数据**: 没有北京地区的机位

**优化建议**:

```typescript
// 添加更多城市的机位数据
const CITY_SPOTS: Record<string, ShootingSpot[]> = {
  hangzhou: [
    // 西湖断桥、钱塘江大桥、灵隐寺...
  ],
  beijing: [
    {
      id: "bj1",
      name: "故宫角楼",
      description: "经典的北京地标，适合拍摄古建筑和日出",
      latitude: 39.9163,
      longitude: 116.3972,
      filterPresetId: "2",
      sampleImageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400",
      tags: ["古建筑", "日出", "人文"],
      rating: 4.9,
      visitCount: 3421,
    },
    {
      id: "bj2",
      name: "798艺术区",
      description: "现代艺术氛围，适合拍摄人像和创意照片",
      latitude: 39.9842,
      longitude: 116.4967,
      filterPresetId: "3",
      sampleImageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400",
      tags: ["艺术", "人像", "创意"],
      rating: 4.7,
      visitCount: 2156,
    },
    {
      id: "bj3",
      name: "颐和园十七孔桥",
      description: "皇家园林，适合拍摄风景和建筑",
      latitude: 39.9991,
      longitude: 116.2752,
      filterPresetId: "1",
      sampleImageUrl: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400",
      tags: ["风景", "建筑", "园林"],
      rating: 4.8,
      visitCount: 2834,
    },
  ],
  shanghai: [
    // 外滩、东方明珠、田子坊...
  ],
};

// 根据用户位置自动选择城市
function detectCity(latitude: number, longitude: number): string {
  // 杭州范围
  if (latitude >= 29.5 && latitude <= 30.5 && longitude >= 119.5 && longitude <= 120.5) {
    return "hangzhou";
  }
  // 北京范围
  if (latitude >= 39.4 && latitude <= 41.0 && longitude >= 115.7 && longitude <= 117.4) {
    return "beijing";
  }
  // 上海范围
  if (latitude >= 30.7 && latitude <= 31.5 && longitude >= 121.0 && longitude <= 122.0) {
    return "shanghai";
  }
  return "hangzhou"; // 默认
}
```

#### 2.3 距离计算
**代码位置**: `lib/shooting-spots-service.ts:66-87`

```typescript
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
```

**测试结果**:
- ✅ **Haversine 公式**: 使用标准的地理距离计算公式
- ✅ **精度**: 米级精度
- ✅ **性能**: 纯数学计算，性能优秀

**验证测试**:
```typescript
// 测试：杭州西湖断桥到钱塘江大桥的距离
const distance = calculateDistance(
  30.2599, 120.1484, // 西湖断桥
  30.2108, 120.1363  // 钱塘江大桥
);
console.log(distance); // 约 5500 米

// 预期结果：5-6公里（符合实际）
```

#### 2.4 机位过滤和排序
**代码位置**: `lib/shooting-spots-service.ts:156-171`

```typescript
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
```

**测试结果**:
- ✅ **半径过滤**: 正确过滤指定半径内的机位
- ✅ **距离排序**: 按距离从近到远排序
- ✅ **性能**: 使用数组方法，性能良好

### 3. 一键导航测试

#### 3.1 导航功能实现
**问题发现**: ❌ **未实现一键导航功能**

**代码搜索结果**:
```bash
grep -r "navigation\|导航\|openMaps\|高德\|百德\|Google Maps" --include="*.tsx" --include="*.ts"
# 未找到导航相关代码
```

**优化建议**:
实现跨平台导航功能：

```typescript
// lib/navigation-service.ts
import { Platform, Linking, Alert } from "react-native";
import * as Location from "expo-location";

export interface NavigationOptions {
  latitude: number;
  longitude: number;
  name: string;
}

/**
 * 打开系统地图应用进行导航
 */
export async function openNavigation(options: NavigationOptions): Promise<void> {
  const { latitude, longitude, name } = options;

  // iOS: 优先使用高德，备选 Apple Maps
  if (Platform.OS === "ios") {
    const schemes = [
      {
        name: "高德地图",
        url: `iosamap://path?sourceApplication=雁宝AI&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`,
        appStoreUrl: "https://apps.apple.com/cn/app/id461703208",
      },
      {
        name: "百度地图",
        url: `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving`,
        appStoreUrl: "https://apps.apple.com/cn/app/id452186370",
      },
      {
        name: "Apple 地图",
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`,
        appStoreUrl: null,
      },
    ];

    await tryOpenNavigation(schemes);
  }
  // Android: 优先使用高德，备选 Google Maps
  else if (Platform.OS === "android") {
    const schemes = [
      {
        name: "高德地图",
        url: `amapuri://route/plan/?dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`,
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.autonavi.minimap",
      },
      {
        name: "百度地图",
        url: `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving`,
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.baidu.BaiduMap",
      },
      {
        name: "Google 地图",
        url: `google.navigation:q=${latitude},${longitude}`,
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
      },
    ];

    await tryOpenNavigation(schemes);
  }
}

/**
 * 尝试打开导航应用
 */
async function tryOpenNavigation(
  schemes: Array<{ name: string; url: string; appStoreUrl?: string | null; playStoreUrl?: string | null }>
): Promise<void> {
  for (const scheme of schemes) {
    const canOpen = await Linking.canOpenURL(scheme.url);
    
    if (canOpen) {
      await Linking.openURL(scheme.url);
      return;
    }
  }

  // 所有应用都未安装，显示选择对话框
  Alert.alert(
    "选择地图应用",
    "请选择要使用的地图应用",
    schemes.map((scheme) => ({
      text: scheme.name,
      onPress: () => {
        const storeUrl = Platform.OS === "ios" ? scheme.appStoreUrl : scheme.playStoreUrl;
        if (storeUrl) {
          Linking.openURL(storeUrl);
        } else {
          Linking.openURL(scheme.url);
        }
      },
    })).concat([{ text: "取消", style: "cancel" }])
  );
}

/**
 * 检查是否安装了地图应用
 */
export async function hasMapApps(): Promise<boolean> {
  const schemes = Platform.OS === "ios"
    ? ["iosamap://", "baidumap://", "http://maps.apple.com/"]
    : ["amapuri://", "baidumap://", "google.navigation:"];

  for (const scheme of schemes) {
    const canOpen = await Linking.canOpenURL(scheme);
    if (canOpen) return true;
  }

  return false;
}
```

**在机位卡片中集成导航**:

```typescript
// components/spot-discovery-drawer.tsx
import { openNavigation } from "@/lib/navigation-service";

const handleNavigate = async (spot: ShootingSpot) => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
  try {
    await openNavigation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
    });
  } catch (error) {
    console.error("打开导航失败:", error);
    Alert.alert("错误", "无法打开地图应用");
  }
};

// 在机位卡片中添加导航按钮
<Pressable
  style={styles.navigateButton}
  onPress={() => handleNavigate(spot)}
>
  <Ionicons name="navigate" size={20} color="#FFFFFF" />
  <Text style={styles.navigateText}>导航</Text>
</Pressable>
```

### 4. 缓存机制测试

#### 4.1 缓存策略
**代码位置**: `lib/shooting-spots-service.ts:181-226`

```typescript
const CACHE_KEY_PREFIX = "shooting_spots_cache_";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24小时

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
```

**测试结果**:
- ✅ **本地缓存**: 使用 AsyncStorage 存储
- ✅ **过期机制**: 24 小时自动过期
- ✅ **位置粒度**: 保留 2 位小数（约 1km 精度）
- ⚠️ **缓存键冲突**: 不同位置可能生成相同的缓存键

**优化建议**:

```typescript
// 使用 geohash 生成更精确的缓存键
import ngeohash from "ngeohash";

export async function cacheSpots(
  userLocation: UserLocation,
  spots: ShootingSpot[]
): Promise<void> {
  try {
    // 使用 geohash 精度 6（约 1.2km）
    const geohash = ngeohash.encode(
      userLocation.latitude,
      userLocation.longitude,
      6
    );
    const cacheKey = `${CACHE_KEY_PREFIX}${geohash}`;
    
    const cacheData = {
      timestamp: Date.now(),
      location: userLocation,
      spots,
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error("缓存机位数据失败:", error);
  }
}
```

### 5. 足迹记录测试

#### 5.1 足迹服务
**代码位置**: `src/services/FootprintService.ts`

**测试结果**:
- ✅ **访问记录**: 记录机位访问次数和时间
- ✅ **拍照计数**: 记录在每个机位拍摄的照片数
- ✅ **统计功能**: 提供总览统计数据
- ✅ **数据持久化**: 使用 AsyncStorage 存储

#### 5.2 足迹展示
**代码位置**: `app/(tabs)/footprints.tsx`

**测试结果**:
- ✅ **UI 完整**: 统计卡片和足迹列表
- ✅ **时间格式化**: 友好的时间显示（今天、昨天、X天前）
- ✅ **清空功能**: 支持清空所有足迹
- ✅ **空状态**: 提供友好的空状态提示

## 测试总结

### ✅ 已实现功能
1. 定位权限请求
2. 用户位置获取
3. 距离计算（Haversine 公式）
4. 机位数据结构
5. 机位过滤和排序
6. 本地缓存机制
7. 足迹记录和统计

### ⚠️ 需要优化
1. 定位权限被拒绝时的用户引导
2. 定位超时处理
3. 缓存键生成策略
4. 添加更多城市的机位数据
5. 自动城市检测

### ❌ 缺少实现
1. react-native-maps 地图视图
2. 地图标记和交互
3. 一键导航功能
4. 地图应用检测和跳转
5. 路线规划弹窗

### 硬件依赖风险
1. **GPS 定位**: 室内或信号弱时定位失败
2. **网络连接**: 加载地图和图片需要网络
3. **地图应用**: 依赖第三方地图应用

### 容错机制建议
1. 定位失败时使用默认城市（杭州）
2. 缓存机位数据，离线可用
3. 图片加载失败时显示占位图
4. 提供手动选择城市功能

```typescript
// 定位失败降级方案
export async function getUserLocationWithFallback(): Promise<UserLocation> {
  const location = await getUserLocation();
  
  if (location) {
    return location;
  }

  // 降级：使用默认位置（杭州西湖）
  Alert.alert(
    "定位失败",
    "将为您推荐杭州地区的机位",
    [{ text: "确定" }]
  );

  return {
    latitude: 30.2741,
    longitude: 120.1551,
  };
}
```

## 下一步行动
1. 集成 react-native-maps
2. 实现地图标记和交互
3. 实现一键导航功能
4. 添加更多城市的机位数据
5. 优化缓存策略
6. 添加手动选择城市功能
