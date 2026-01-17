import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

// 上海热门拍摄地点
const SHANGHAI_SPOTS = [
  {
    id: '1',
    name: '外滩',
    description: '上海最具代表性的地标，黄浦江畔的万国建筑群',
    coordinate: { latitude: 31.2397, longitude: 121.4912 },
    category: '城市风光',
    rating: 4.8,
    bestTime: '傍晚',
    tips: '建议在日落时分拍摄，可以捕捉到浦江两岸的美丽景色',
  },
  {
    id: '2',
    name: '东方明珠',
    description: '上海的标志性建筑，现代化都市的象征',
    coordinate: { latitude: 31.2397, longitude: 121.4997 },
    category: '地标建筑',
    rating: 4.7,
    bestTime: '夜晚',
    tips: '夜景最佳，灯光璀璨夺目',
  },
  {
    id: '3',
    name: '田子坊',
    description: '充满艺术气息的石库门建筑群',
    coordinate: { latitude: 31.2108, longitude: 121.4644 },
    category: '文艺街区',
    rating: 4.6,
    bestTime: '下午',
    tips: '适合拍摄文艺照片，有很多特色小店和咖啡馆',
  },
  {
    id: '4',
    name: '豫园',
    description: '明代私家园林，古典中式建筑',
    coordinate: { latitude: 31.2276, longitude: 121.4922 },
    category: '古典园林',
    rating: 4.5,
    bestTime: '上午',
    tips: '避开人流高峰，可以拍到更纯净的古典美',
  },
  {
    id: '5',
    name: '新天地',
    description: '融合传统与现代的时尚街区',
    coordinate: { latitude: 31.2194, longitude: 121.4778 },
    category: '时尚街区',
    rating: 4.6,
    bestTime: '全天',
    tips: '白天和夜晚各有特色，适合街拍',
  },
  {
    id: '6',
    name: '武康路',
    description: '充满法式风情的梧桐树街道',
    coordinate: { latitude: 31.2058, longitude: 121.4378 },
    category: '文艺街道',
    rating: 4.7,
    bestTime: '下午',
    tips: '秋季梧桐叶最美，适合拍摄复古风格照片',
  },
];

export default function MapScreen({ onClose }: any) {
  const [location, setLocation] = useState<any>(null);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [permission, requestPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        const { status } = await requestPermission();
        if (status !== 'granted') {
          Alert.alert('权限被拒绝', '需要位置权限才能显示您的当前位置');
          return;
        }
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, [permission]);

  const navigateToSpot = (spot: any) => {
    Alert.alert(
      '导航',
      `是否要导航到 ${spot.name}？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => Alert.alert('提示', '导航功能开发中...') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📍 拍摄地推荐</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>筛选</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: 31.2304,
            longitude: 121.4737,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {SHANGHAI_SPOTS.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={spot.coordinate}
              title={spot.name}
              description={spot.description}
              onPress={() => setSelectedSpot(spot)}
            >
              <View style={styles.markerContainer}>
                <Text style={styles.markerText}>📷</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Spots List */}
      <View style={styles.spotsContainer}>
        <Text style={styles.sectionTitle}>🌟 热门拍摄地</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.spotsList}
        >
          {SHANGHAI_SPOTS.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.spotCard,
                selectedSpot?.id === spot.id && styles.spotCardActive,
              ]}
              onPress={() => setSelectedSpot(spot)}
            >
              <View style={styles.spotHeader}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStar}>⭐</Text>
                  <Text style={styles.ratingText}>{spot.rating}</Text>
                </View>
              </View>
              
              <Text style={styles.spotCategory}>{spot.category}</Text>
              <Text style={styles.spotDescription} numberOfLines={2}>
                {spot.description}
              </Text>
              
              <View style={styles.spotFooter}>
                <View style={styles.bestTimeTag}>
                  <Text style={styles.bestTimeText}>🕐 {spot.bestTime}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.navigateButton}
                  onPress={() => navigateToSpot(spot)}
                >
                  <Text style={styles.navigateButtonText}>导航</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Spot Details */}
      {selectedSpot && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <View>
              <Text style={styles.detailsName}>{selectedSpot.name}</Text>
              <Text style={styles.detailsCategory}>{selectedSpot.category}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedSpot(null)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.detailsDescription}>{selectedSpot.description}</Text>
          
          <View style={styles.detailsInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>最佳时间</Text>
              <Text style={styles.infoValue}>{selectedSpot.bestTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>评分</Text>
              <Text style={styles.infoValue}>⭐ {selectedSpot.rating}</Text>
            </View>
          </View>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsLabel}>💡 拍摄建议</Text>
            <Text style={styles.tipsText}>{selectedSpot.tips}</Text>
          </View>
          
          <View style={styles.detailsActions}>
            <TouchableOpacity 
              style={styles.actionButtonPrimary}
              onPress={() => navigateToSpot(selectedSpot)}
            >
              <Text style={styles.actionButtonPrimaryText}>🧭 开始导航</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButtonSecondary}>
              <Text style={styles.actionButtonSecondaryText}>❤️ 收藏</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    color: '#A33BFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#A33BFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    fontSize: 20,
  },
  spotsContainer: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  spotsList: {
    paddingHorizontal: 15,
  },
  spotCard: {
    width: 280,
    backgroundColor: '#0a0a1e',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  spotCardActive: {
    borderColor: '#A33BFF',
    borderWidth: 2,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    fontSize: 14,
  },
  ratingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  spotCategory: {
    color: '#A33BFF',
    fontSize: 12,
    marginBottom: 8,
  },
  spotDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  spotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestTimeTag: {
    backgroundColor: 'rgba(163, 59, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  bestTimeText: {
    color: '#A33BFF',
    fontSize: 12,
    fontWeight: '500',
  },
  navigateButton: {
    backgroundColor: '#A33BFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailsName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  detailsCategory: {
    color: '#A33BFF',
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    color: '#666',
    fontSize: 24,
  },
  detailsDescription: {
    color: '#aaa',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  detailsInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: 'rgba(163, 59, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  tipsLabel: {
    color: '#A33BFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipsText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  detailsActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButtonPrimary: {
    flex: 2,
    backgroundColor: '#A33BFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF69B4',
  },
  actionButtonSecondaryText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '600',
  },
});
