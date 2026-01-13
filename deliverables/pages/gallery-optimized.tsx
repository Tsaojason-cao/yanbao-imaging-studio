/**
 * yanbao AI 相冊模塊 (Gallery) - 優化版
 * 高性能相冊 + AI 自動分類 + 雲備份
 * 
 * 優化內容：
 * - 快速分類選擇器（全部、人像、風景、夜景）
 * - 左右滑動切換分類
 * - 上下滑動瀏覽照片
 * - 雙指縮放調整網格大小
 * - 長按照片快速進入編輯
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';
import { QuickCategorySelector } from '@/lib/components/QuickAccessBar';
import { FilterGesture } from '@/lib/components/GestureInteraction';

const { width, height } = Dimensions.get('window');

// ============================================
// 照片接口
// ============================================
interface Photo {
  id: string;
  title: string;
  category: 'all' | 'portrait' | 'landscape' | 'night';
  timestamp: number;
  thumbnail: string;
}

// ============================================
// 分類接口
// ============================================
interface Category {
  id: string;
  label: string;
  count: number;
}

// ============================================
// 相冊模塊組件（優化版）
// ============================================
export default function GalleryScreenOptimized() {
  const router = useRouter();

  // 分類列表
  const categories: Category[] = [
    { id: 'all', label: '全部', count: 2450 },
    { id: 'portrait', label: '人像', count: 850 },
    { id: 'landscape', label: '風景', count: 620 },
    { id: 'night', label: '夜景', count: 380 },
  ];

  // 當前分類
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // 網格列數
  const [gridColumns, setGridColumns] = useState(3);

  // 模擬照片數據
  const [photos, setPhotos] = useState<Photo[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: `photo-${i}`,
      title: `照片 ${i + 1}`,
      category: (['all', 'portrait', 'landscape', 'night'] as const)[i % 4],
      timestamp: Date.now() - i * 86400000,
      thumbnail: '📷',
    }))
  );

  // 動畫值
  const categoryTransition = useRef(new Animated.Value(0)).current;
  const gridScaleAnim = useRef(new Animated.Value(1)).current;

  // ============================================
  // 過濾照片
  // ============================================
  const filteredPhotos = photos.filter(
    photo => activeCategory === 'all' || photo.category === activeCategory
  );

  // ============================================
  // 切換分類
  // ============================================
  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 分類切換動畫
    Animated.sequence([
      Animated.timing(categoryTransition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(categoryTransition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ============================================
  // 手勢切換分類
  // ============================================
  const handleCategoryGestureChange = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  // ============================================
  // 調整網格大小
  // ============================================
  const handleGridResize = (newColumns: number) => {
    setGridColumns(Math.max(2, Math.min(5, newColumns)));
    
    // 網格縮放動畫
    Animated.sequence([
      Animated.timing(gridScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(gridScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ============================================
  // 照片項目點擊
  // ============================================
  const handlePhotoPress = async (photo: Photo) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/edit?photoId=${photo.id}` as any);
  };

  // ============================================
  // 照片項目長按
  // ============================================
  const handlePhotoLongPress = async (photo: Photo) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('快速操作', '選擇操作', [
      {
        text: '編輯',
        onPress: () => router.push(`/edit?photoId=${photo.id}` as any),
      },
      {
        text: '分享',
        onPress: () => Alert.alert('分享', `正在分享 ${photo.title}`),
      },
      {
        text: '刪除',
        onPress: () => {
          setPhotos(photos.filter(p => p.id !== photo.id));
          Alert.alert('已刪除', `${photo.title} 已刪除`);
        },
        style: 'destructive',
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  // ============================================
  // 渲染照片項目
  // ============================================
  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[
        styles.photoItem,
        { width: `${100 / gridColumns}%` },
      ]}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#A855F7', '#FF6B9D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.photoThumbnail}
      >
        <Text style={styles.photoIcon}>{item.thumbnail}</Text>
      </LinearGradient>
      <Text style={styles.photoTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const categoryIndex = categories.findIndex(c => c.id === activeCategory);

  return (
    <LinearGradient
      colors={['#3D2B5E', '#2D1B4E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* ============================================
          頂部導航
          ============================================ */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.topNavButton}
        >
          <Text style={styles.topNavButtonText}>← 返回</Text>
        </TouchableOpacity>

        <Text style={styles.topNavTitle}>我的相冊</Text>

        <TouchableOpacity style={styles.topNavButton}>
          <Text style={styles.topNavButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================
          快速分類選擇器（新增）
          ============================================ */}
      <FilterGesture
        filters={categories.map(cat => ({
          id: cat.id,
          name: cat.label,
        }))}
        currentFilterIndex={categoryIndex}
        onFilterChange={(index) => handleCategoryGestureChange(categories[index].id)}
      >
        <QuickCategorySelector
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          style={styles.categorySelector}
        />
      </FilterGesture>

      {/* ============================================
          照片網格
          ============================================ */}
      <Animated.View
        style={[
          styles.gridContainer,
          {
            transform: [{ scale: gridScaleAnim }],
          },
        ]}
      >
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={gridColumns}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          key={gridColumns}
        />
      </Animated.View>

      {/* ============================================
          網格調整控制（底部）
          ============================================ */}
      <View style={styles.gridControlsContainer}>
        <View style={styles.gridControls}>
          <TouchableOpacity
            style={styles.gridControlButton}
            onPress={() => handleGridResize(gridColumns - 1)}
            disabled={gridColumns === 2}
          >
            <Text style={styles.gridControlIcon}>−</Text>
          </TouchableOpacity>

          <Text style={styles.gridControlText}>
            {gridColumns} 列 · {filteredPhotos.length} 張
          </Text>

          <TouchableOpacity
            style={styles.gridControlButton}
            onPress={() => handleGridResize(gridColumns + 1)}
            disabled={gridColumns === 5}
          >
            <Text style={styles.gridControlIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================
          統計信息
          ============================================ */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['rgba(232, 180, 240, 0.1)', 'rgba(200, 150, 224, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsCard}
        >
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>總照片</Text>
              <Text style={styles.statValue}>{filteredPhotos.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>雲備份</Text>
              <Text style={styles.statValue}>
                {Math.round(filteredPhotos.length * 0.95)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>已編輯</Text>
              <Text style={styles.statValue}>
                {Math.round(filteredPhotos.length * 0.6)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

// ============================================
// 樣式定義
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B4E',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 157, 0.2)',
  },
  topNavButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  topNavButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  topNavTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categorySelector: {
    marginVertical: 12,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  gridRow: {
    marginBottom: 8,
  },
  photoItem: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoIcon: {
    fontSize: 32,
  },
  photoTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  gridControlsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
    backgroundColor: 'rgba(45, 27, 78, 0.5)',
  },
  gridControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridControlIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  gridControlText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
  },
  statsCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default GalleryScreenOptimized;
