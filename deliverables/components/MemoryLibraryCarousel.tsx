/**
 * 記憶庫輪播卡片組件
 * Memory Library Carousel Component
 * 
 * 功能：
 * - 在相冊首屏展示記憶庫
 * - 水平滑動瀏覽記憶
 * - 點擊卡片應用記憶
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Heart, Trash2, Edit2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { YanBaoMemory } from '../types/memory';

interface MemoryLibraryCarouselProps {
  memories: YanBaoMemory[];
  onApplyMemory: (memoryId: string) => Promise<void>;
  onDeleteMemory: (memoryId: string) => Promise<void>;
  onToggleFavorite: (memoryId: string) => Promise<void>;
  onRenameMemory?: (memoryId: string, newName: string) => Promise<void>;
}

interface MemoryCardProps {
  memory: YanBaoMemory;
  onApply: () => Promise<void>;
  onDelete: () => Promise<void>;
  onToggleFavorite: () => Promise<void>;
}

/**
 * 記憶卡片組件
 */
const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onApply,
  onDelete,
  onToggleFavorite,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePress = useCallback(async () => {
    setIsLoading(true);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onApply();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [onApply, scaleAnim]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      '確認刪除',
      `確定要刪除『${memory.name}』嗎？`,
      [
        { text: '取消', onPress: () => {} },
        {
          text: '刪除',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              await onDelete();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [memory.name, onDelete]);

  const handleToggleFavorite = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await onToggleFavorite();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [onToggleFavorite]);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {/* 背景漸變 */}
        <View style={styles.cardBackground} />

        {/* 記憶信息 */}
        <View style={styles.cardContent}>
          {/* 標題 */}
          <Text style={styles.cardTitle} numberOfLines={2}>
            {memory.name}
          </Text>

          {/* 統計信息 */}
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              使用 {memory.usageCount} 次
            </Text>
            <Text style={styles.statText}>
              {memory.environment?.lighting || '自定義'}
            </Text>
          </View>

          {/* 標籤 */}
          {memory.tags && memory.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {memory.tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 操作按鈕 */}
        <View style={styles.cardActions}>
          {/* 收藏按鈕 */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleFavorite}
          >
            <Heart
              size={18}
              color={memory.favorited ? '#FF6B9D' : '#CCCCCC'}
              fill={memory.favorited ? '#FF6B9D' : 'none'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* 刪除按鈕 */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Trash2 size={18} color="#CCCCCC" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 應用提示 */}
        <View style={styles.applyHint}>
          <Text style={styles.applyHintText}>點擊應用</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * 記憶庫輪播組件
 */
export const MemoryLibraryCarousel: React.FC<MemoryLibraryCarouselProps> = ({
  memories,
  onApplyMemory,
  onDeleteMemory,
  onToggleFavorite,
  onRenameMemory,
}) => {
  if (memories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={48} color="#FF6B9D" strokeWidth={1.5} />
        <Text style={styles.emptyText}>還沒有保存任何記憶</Text>
        <Text style={styles.emptySubtext}>
          在拍照或編輯時點擊記憶按鈕保存您喜歡的風格
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 標題 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ 雁寶記憶</Text>
        <Text style={styles.headerSubtitle}>
          {memories.length} 個已保存的風格
        </Text>
      </View>

      {/* 輪播卡片 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContent}
      >
        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onApply={() => onApplyMemory(memory.id)}
            onDelete={() => onDeleteMemory(memory.id)}
            onToggleFavorite={() => onToggleFavorite(memory.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // 容器
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#CCCCCC',
  },

  // 輪播
  carouselContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  carouselContent: {
    gap: 12,
    paddingRight: 16,
  },

  // 卡片
  cardContainer: {
    width: 280,
    height: 160,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FF6B9D',
    backgroundColor: '#1A1A1A',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
  },

  // 卡片內容
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statText: {
    fontSize: 11,
    color: '#CCCCCC',
  },

  // 標籤
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  // 操作按鈕
  cardActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 應用提示
  applyHint: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  applyHintText: {
    fontSize: 10,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  // 空狀態
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
