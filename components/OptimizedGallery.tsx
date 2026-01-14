import React, { useCallback } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { usePerformanceOptimizer } from './PerformanceOptimizer';

interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
}

interface OptimizedGalleryProps {
  photos: Photo[];
  onPhotoPress?: (photo: Photo) => void;
}

/**
 * 优化的相册组件
 * 使用 FlashList 实现 1000+ 张照片的流畅滚动
 */
export function OptimizedGallery({ photos, onPhotoPress }: OptimizedGalleryProps) {
  const { bufferSize, imageQuality } = usePerformanceOptimizer();
  const screenWidth = Dimensions.get('window').width;

  // 2.5 列布局计算
  const columnWidth = screenWidth / 2.5;

  const renderItem = useCallback(
    ({ item, index }: { item: Photo; index: number }) => {
      // 2.5 列非对称布局
      const isLarge = index % 3 === 0;
      const itemWidth = isLarge ? columnWidth * 1.5 : columnWidth;
      const itemHeight = isLarge ? itemWidth * 1.2 : itemWidth;

      return (
        <View style={[styles.photoContainer, { width: itemWidth, height: itemHeight }]}>
          <Image
            source={{ uri: item.uri }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      );
    },
    [columnWidth]
  );

  const getItemType = useCallback((item: Photo, index: number) => {
    return index % 3 === 0 ? 'large' : 'small';
  }, []);

  return (
    <FlashList
      data={photos}
      renderItem={renderItem}
      getItemType={getItemType}
      estimatedItemSize={columnWidth}
      numColumns={2}
      estimatedListSize={{ height: 800, width: screenWidth }}
      drawDistance={bufferSize * columnWidth}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    padding: 2,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
