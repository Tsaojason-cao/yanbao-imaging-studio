/**
 * 导航服务
 * 提供跨平台地图导航功能
 */

import { Platform, Linking, Alert } from "react-native";

export interface NavigationOptions {
  latitude: number;
  longitude: number;
  name: string;
}

interface MapScheme {
  name: string;
  url: string;
  storeUrl?: string | null;
}

/**
 * 打开系统地图应用进行导航
 */
export async function openNavigation(options: NavigationOptions): Promise<void> {
  const { latitude, longitude, name } = options;

  // iOS: 优先使用高德，备选 Apple Maps
  if (Platform.OS === "ios") {
    const schemes: MapScheme[] = [
      {
        name: "高德地图",
        url: `iosamap://path?sourceApplication=雁宝AI&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`,
        storeUrl: "https://apps.apple.com/cn/app/id461703208",
      },
      {
        name: "百度地图",
        url: `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving`,
        storeUrl: "https://apps.apple.com/cn/app/id452186370",
      },
      {
        name: "Apple 地图",
        url: `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(name)}`,
        storeUrl: null,
      },
    ];

    await tryOpenNavigation(schemes);
  }
  // Android: 优先使用高德，备选 Google Maps
  else if (Platform.OS === "android") {
    const schemes: MapScheme[] = [
      {
        name: "高德地图",
        url: `amapuri://route/plan/?dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`,
        storeUrl: "https://play.google.com/store/apps/details?id=com.autonavi.minimap",
      },
      {
        name: "百度地图",
        url: `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving`,
        storeUrl: "https://play.google.com/store/apps/details?id=com.baidu.BaiduMap",
      },
      {
        name: "Google 地图",
        url: `google.navigation:q=${latitude},${longitude}`,
        storeUrl: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
      },
    ];

    await tryOpenNavigation(schemes);
  } else {
    // Web 平台：打开 Google Maps 网页版
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    await Linking.openURL(url);
  }
}

/**
 * 尝试打开导航应用
 */
async function tryOpenNavigation(schemes: MapScheme[]): Promise<void> {
  // 首先尝试已安装的应用
  for (const scheme of schemes) {
    try {
      const canOpen = await Linking.canOpenURL(scheme.url);
      
      if (canOpen) {
        await Linking.openURL(scheme.url);
        return;
      }
    } catch (error) {
      console.error(`检查地图应用失败: ${scheme.name}`, error);
    }
  }

  // 所有应用都未安装，显示选择对话框
  Alert.alert(
    "选择地图应用",
    "未检测到已安装的地图应用，请选择要下载的应用",
    schemes.map((scheme) => ({
      text: scheme.name,
      onPress: () => {
        if (scheme.storeUrl) {
          Linking.openURL(scheme.storeUrl);
        } else {
          Linking.openURL(scheme.url).catch(() => {
            Alert.alert("错误", "无法打开地图应用");
          });
        }
      },
    })).concat([{ text: "取消", onPress: () => {} }])
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
    try {
      const canOpen = await Linking.canOpenURL(scheme);
      if (canOpen) return true;
    } catch (error) {
      console.error("检查地图应用失败", error);
    }
  }

  return false;
}

/**
 * 在地图上显示位置（不导航）
 */
export async function showOnMap(options: NavigationOptions): Promise<void> {
  const { latitude, longitude, name } = options;

  if (Platform.OS === "ios") {
    const url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`;
    await Linking.openURL(url);
  } else if (Platform.OS === "android") {
    const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
    await Linking.openURL(url);
  } else {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    await Linking.openURL(url);
  }
}
