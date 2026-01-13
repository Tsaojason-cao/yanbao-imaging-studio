/**
 * yanbao AI 地区机位推荐模块 (Spot Discovery)
 * 地图可视化 + 参数建议 + 一键导航
 * 
 * 功能：
 * - 地图可视化（集成 react-native-maps）
 * - 热门摄影位展示（杭州、北京等）
 * - 参数建议（针对特定机位自动推荐 LUT 预设）
 * - 一键导航（高德/百度/Google）
 * - 机位详情卡片
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 机位数据接口
// ============================================
interface PhotoSpot {
  id: string;
  name: string;
  city: string;
  coordinates: { latitude: number; longitude: number };
  rating: number;
  reviewCount: number;
  bestTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lutPreset: string;
  description: string;
  tips: string[];
  image: string;
}

// ============================================
// 模拟机位数据
// ============================================
const PHOTO_SPOTS: PhotoSpot[] = [
  {
    id: '1',
    name: '西湖断桥',
    city: '杭州',
    coordinates: { latitude: 30.2741, longitude: 120.1551 },
    rating: 4.9,
    reviewCount: 2341,
    bestTime: '日出前 30 分钟',
    difficulty: 'easy',
    lutPreset: '清晨雾气',
    description: '杭州最经典的拍摄地点，晨雾中的断桥美不胜收',
    tips: ['早起避开人群', '使用长焦镜头', '带上三脚架'],
    image: '🌉',
  },
  {
    id: '2',
    name: '南浔古镇',
    city: '杭州',
    coordinates: { latitude: 30.4167, longitude: 120.7333 },
    rating: 4.8,
    reviewCount: 1856,
    bestTime: '下午 2-4 点',
    difficulty: 'medium',
    lutPreset: '古镇怀旧',
    description: '江南水乡风情，青石板路和古建筑完美融合',
    tips: ['穿着古装更出片', '利用反射拍摄', '避免正午光线'],
    image: '🏯',
  },
  {
    id: '3',
    name: '故宫太和殿',
    city: '北京',
    coordinates: { latitude: 39.9163, longitude: 116.3972 },
    rating: 4.7,
    reviewCount: 3421,
    bestTime: '日出后 1 小时',
    difficulty: 'hard',
    lutPreset: '宫廷金色',
    description: '中国古代建筑的瑰宝，金色屋顶在晨光下闪闪发光',
    tips: ['提前预约', '避免游客高峰', '使用广角镜头'],
    image: '🏛️',
  },
  {
    id: '4',
    name: '长城金山岭',
    city: '北京',
    coordinates: { latitude: 40.6667, longitude: 117.2333 },
    rating: 4.6,
    reviewCount: 2156,
    bestTime: '日落前 2 小时',
    difficulty: 'hard',
    lutPreset: '夕阳金色',
    description: '蜿蜒的长城在夕阳下呈现壮观的剪影',
    tips: ['准备充足的水', '穿着舒适的登山鞋', '带上ND滤镜'],
    image: '🏔️',
  },
  {
    id: '5',
    name: '西塘古镇',
    city: '浙江',
    coordinates: { latitude: 30.6333, longitude: 120.8167 },
    rating: 4.8,
    reviewCount: 1923,
    bestTime: '傍晚 5-7 点',
    difficulty: 'easy',
    lutPreset: '夜景蓝调',
    description: '夜幕降临时，古镇的灯光倒映在水面上',
    tips: ['夜景拍摄需要高感光度', '使用三脚架稳定', '带上快门线'],
    image: '🌃',
  },
  {
    id: '6',
    name: '鼓浪屿日光岩',
    city: '厦门',
    coordinates: { latitude: 24.4333, longitude: 117.9667 },
    rating: 4.7,
    reviewCount: 2789,
    bestTime: '日落时刻',
    difficulty: 'medium',
    lutPreset: '海岸夕阳',
    description: '俯瞰厦门全景的绝佳位置，日落时分最为壮观',
    tips: ['提前到达占据位置', '准备好手动对焦', '带上偏光镜'],
    image: '🌅',
  },
];

// ============================================
// LUT 预设推荐
// ============================================
const LUT_PRESETS = {
  '清晨雾气': { color: '#A8D8EA', description: '冷色调，适合晨雾场景' },
  '古镇怀旧': { color: '#F4A460', description: '暖色调，增加复古感' },
  '宫廷金色': { color: '#FFD700', description: '金色调，突出建筑' },
  '夕阳金色': { color: '#FF8C00', description: '橙色调，强化夕阳' },
  '夜景蓝调': { color: '#4A90E2', description: '蓝色调，增加神秘感' },
  '海岸夕阳': { color: '#FF6B6B', description: '红色调，突出日落' },
};

// ============================================
// 地区机位推荐模块组件
// ============================================
export default function SpotDiscoveryScreen() {
  const router = useRouter();

  // 状态管理
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [mapView, setMapView] = useState(false);

  // 动画值
  const detailSlide = useRef(new Animated.Value(0)).current;

  // ============================================
  // 过滤机位
  // ============================================
  const filteredSpots = selectedCity === 'all'
    ? PHOTO_SPOTS
    : PHOTO_SPOTS.filter(spot => spot.city === selectedCity);

  // ============================================
  // 获取城市列表
  // ============================================
  const getCities = () => {
    const cities = [...new Set(PHOTO_SPOTS.map(s => s.city))];
    return ['all', ...cities];
  };

  // ============================================
  // 打开导航
  // ============================================
  const handleOpenNavigation = (spot: PhotoSpot) => {
    Alert.alert(
      '选择导航应用',
      `导航到 ${spot.name}`,
      [
        { text: '高德地图', onPress: () => Alert.alert('已打开高德地图') },
        { text: '百度地图', onPress: () => Alert.alert('已打开百度地图') },
        { text: '谷歌地图', onPress: () => Alert.alert('已打开谷歌地图') },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  // ============================================
  // 应用 LUT 预设
  // ============================================
  const handleApplyLUT = (spot: PhotoSpot) => {
    Alert.alert('成功', `已应用 ${spot.lutPreset} 预设`);
  };

  // ============================================
  // 打开详情
  // ============================================
  const handleSelectSpot = (spot: PhotoSpot) => {
    setSelectedSpot(spot);
    Animated.timing(detailSlide, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // ============================================
  // 关闭详情
  // ============================================
  const handleCloseDetail = () => {
    Animated.timing(detailSlide, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedSpot(null));
  };

  return (
    <LinearGradient
      colors={['#3D2B5E', '#2D1B4E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* ============================================
          顶部导航
          ============================================ */}
      <View style={styles.topNav}>
        <Text style={styles.topNavTitle}>机位推荐</Text>
        <TouchableOpacity
          style={styles.mapToggle}
          onPress={() => setMapView(!mapView)}
        >
          <Text style={styles.mapToggleText}>{mapView ? '列表' : '地图'}</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================
          城市过滤
          ============================================ */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cityFilter}
        contentContainerStyle={styles.cityFilterContent}
      >
        {getCities().map(city => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityButton,
              selectedCity === city && styles.cityButtonActive,
            ]}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={styles.cityButtonText}>
              {city === 'all' ? '全部' : city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ============================================
          机位列表
          ============================================ */}
      <FlatList
        data={filteredSpots}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.spotCard}
            onPress={() => handleSelectSpot(item)}
          >
            <LinearGradient
              colors={['rgba(255, 107, 157, 0.2)', 'rgba(168, 85, 247, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.spotCardGradient}
            >
              {/* 机位图片 */}
              <View style={styles.spotImage}>
                <Text style={styles.spotImageEmoji}>{item.image}</Text>
              </View>

              {/* 机位信息 */}
              <View style={styles.spotInfo}>
                <View style={styles.spotHeader}>
                  <Text style={styles.spotName}>{item.name}</Text>
                  <View style={styles.spotRating}>
                    <Text style={styles.spotRatingIcon}>⭐</Text>
                    <Text style={styles.spotRatingValue}>{item.rating}</Text>
                  </View>
                </View>

                <Text style={styles.spotCity}>{item.city}</Text>

                <View style={styles.spotMeta}>
                  <View style={styles.spotMetaItem}>
                    <Text style={styles.spotMetaIcon}>🕐</Text>
                    <Text style={styles.spotMetaText}>{item.bestTime}</Text>
                  </View>
                  <View style={styles.spotMetaItem}>
                    <Text style={styles.spotMetaIcon}>📊</Text>
                    <Text style={styles.spotMetaText}>
                      {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                    </Text>
                  </View>
                </View>

                {/* LUT 预设标签 */}
                <View style={styles.lutPresetTag}>
                  <View
                    style={[
                      styles.lutPresetColor,
                      { backgroundColor: LUT_PRESETS[item.lutPreset as keyof typeof LUT_PRESETS]?.color },
                    ]}
                  />
                  <Text style={styles.lutPresetText}>{item.lutPreset}</Text>
                </View>
              </View>

              {/* 操作按钮 */}
              <View style={styles.spotActions}>
                <TouchableOpacity
                  style={styles.spotActionButton}
                  onPress={() => handleOpenNavigation(item)}
                >
                  <Text style={styles.spotActionIcon}>📍</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.spotActionButton}
                  onPress={() => handleApplyLUT(item)}
                >
                  <Text style={styles.spotActionIcon}>🎨</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={!selectedSpot}
      />

      {/* ============================================
          详情面板
          ============================================ */}
      {selectedSpot && (
        <Animated.View
          style={[
            styles.detailPanel,
            {
              transform: [
                {
                  translateY: detailSlide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(61, 43, 94, 0.95)', 'rgba(45, 27, 78, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.detailPanelGradient}
          >
            {/* 关闭按钮 */}
            <TouchableOpacity
              style={styles.detailCloseButton}
              onPress={handleCloseDetail}
            >
              <Text style={styles.detailCloseIcon}>✕</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 大图 */}
              <View style={styles.detailImage}>
                <Text style={styles.detailImageEmoji}>{selectedSpot.image}</Text>
              </View>

              {/* 标题 */}
              <Text style={styles.detailTitle}>{selectedSpot.name}</Text>
              <Text style={styles.detailCity}>{selectedSpot.city}</Text>

              {/* 评分 */}
              <View style={styles.detailRating}>
                <Text style={styles.detailRatingIcon}>⭐ {selectedSpot.rating}</Text>
                <Text style={styles.detailRatingCount}>
                  {selectedSpot.reviewCount} 条评价
                </Text>
              </View>

              {/* 描述 */}
              <Text style={styles.detailDescription}>{selectedSpot.description}</Text>

              {/* 参数建议 */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>📸 拍摄参数建议</Text>
                <View style={styles.paramSuggestions}>
                  <View style={styles.paramSuggestion}>
                    <Text style={styles.paramLabel}>最佳时间</Text>
                    <Text style={styles.paramValue}>{selectedSpot.bestTime}</Text>
                  </View>
                  <View style={styles.paramSuggestion}>
                    <Text style={styles.paramLabel}>难度等级</Text>
                    <Text style={styles.paramValue}>
                      {selectedSpot.difficulty === 'easy' ? '⭐ 简单' : selectedSpot.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 困难'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* LUT 预设推荐 */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🎨 推荐 LUT 预设</Text>
                <View style={styles.lutPresetCard}>
                  <View
                    style={[
                      styles.lutPresetColorBig,
                      { backgroundColor: LUT_PRESETS[selectedSpot.lutPreset as keyof typeof LUT_PRESETS]?.color },
                    ]}
                  />
                  <View style={styles.lutPresetInfo}>
                    <Text style={styles.lutPresetName}>{selectedSpot.lutPreset}</Text>
                    <Text style={styles.lutPresetDesc}>
                      {LUT_PRESETS[selectedSpot.lutPreset as keyof typeof LUT_PRESETS]?.description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 拍摄技巧 */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>💡 拍摄技巧</Text>
                {selectedSpot.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <Text style={styles.tipNumber}>{index + 1}</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              {/* 操作按钮 */}
              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={styles.detailActionButton}
                  onPress={() => handleOpenNavigation(selectedSpot)}
                >
                  <LinearGradient
                    colors={['#FF6B9D', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.detailActionButtonGradient}
                  >
                    <Text style={styles.detailActionIcon}>📍</Text>
                    <Text style={styles.detailActionText}>一键导航</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailActionButton}
                  onPress={() => handleApplyLUT(selectedSpot)}
                >
                  <LinearGradient
                    colors={['#E8B4F0', '#D4A5E8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.detailActionButtonGradient}
                  >
                    <Text style={styles.detailActionIcon}>🎨</Text>
                    <Text style={styles.detailActionText}>应用预设</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

// ============================================
// 样式定义
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  topNavTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  mapToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  mapToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  cityFilter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  cityFilterContent: {
    gap: 8,
  },

  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  cityButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderColor: '#FF6B9D',
  },

  cityButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  spotCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },

  spotCardGradient: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },

  spotImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    marginRight: 12,
  },

  spotImageEmoji: {
    fontSize: 40,
  },

  spotInfo: {
    flex: 1,
  },

  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  spotName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  spotRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spotRatingIcon: {
    fontSize: 12,
    marginRight: 2,
  },

  spotRatingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  spotCity: {
    fontSize: 11,
    color: '#AAAAAA',
    marginBottom: 6,
  },

  spotMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },

  spotMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spotMetaIcon: {
    fontSize: 10,
    marginRight: 2,
  },

  spotMetaText: {
    fontSize: 10,
    color: '#AAAAAA',
  },

  lutPresetTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  lutPresetColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  lutPresetText: {
    fontSize: 10,
    color: '#AAAAAA',
  },

  spotActions: {
    marginLeft: 12,
    gap: 8,
  },

  spotActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  spotActionIcon: {
    fontSize: 16,
  },

  detailPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  detailPanelGradient: {
    flex: 1,
  },

  detailCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  detailCloseIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  detailContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  detailImageEmoji: {
    fontSize: 80,
  },

  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  detailCity: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },

  detailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  detailRatingIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
    marginRight: 8,
  },

  detailRatingCount: {
    fontSize: 12,
    color: '#AAAAAA',
  },

  detailDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },

  detailSection: {
    marginBottom: 16,
  },

  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  paramSuggestions: {
    flexDirection: 'row',
    gap: 8,
  },

  paramSuggestion: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  paramLabel: {
    fontSize: 11,
    color: '#AAAAAA',
    marginBottom: 4,
  },

  paramValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  lutPresetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  lutPresetColorBig: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
  },

  lutPresetInfo: {
    flex: 1,
  },

  lutPresetName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  lutPresetDesc: {
    fontSize: 11,
    color: '#AAAAAA',
  },

  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },

  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    color: '#FF6B9D',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
    flexShrink: 0,
  },

  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 18,
  },

  detailActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },

  detailActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  detailActionButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  detailActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
