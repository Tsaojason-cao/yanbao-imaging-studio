import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../config/theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = (width - theme.spacing.lg * 2 - theme.spacing.sm * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface GalleryScreenProps {
  navigation: any;
}

// 模拟照片数据
const MOCK_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: `photo-${i}`,
  uri: `https://picsum.photos/400/600?random=${i}`,
  createdAt: new Date(Date.now() - i * 86400000),
  syncedToCloud: i % 3 === 0,
}));

export default function GalleryScreen({ navigation }: GalleryScreenProps) {
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handlePhotoPress = (photoId: string) => {
    if (isSelectionMode) {
      toggleSelection(photoId);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // TODO: 打开照片详情
      alert('打开照片详情');
    }
  };

  const handlePhotoLongPress = (photoId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSelectionMode(true);
    setSelectedIds([photoId]);
  };

  const toggleSelection = (photoId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhotos(prev => prev.filter(p => !selectedIds.includes(p.id)));
    exitSelectionMode();
  };

  const renderPhoto = ({ item }: { item: typeof MOCK_PHOTOS[0] }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.photoItem,
          isSelected && styles.photoItemSelected,
        ]}
        onPress={() => handlePhotoPress(item.id)}
        onLongPress={() => handlePhotoLongPress(item.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photoImage}
        />
        
        {item.syncedToCloud && (
          <View style={styles.cloudBadge}>
            <Text style={styles.cloudIcon}>☁️</Text>
          </View>
        )}
        
        {isSelectionMode && (
          <View style={styles.selectionOverlay}>
            <View style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected,
            ]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部工具栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>
          {isSelectionMode ? `已选择 ${selectedIds.length} 张` : '相册'}
        </Text>
        
        {isSelectionMode ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={exitSelectionMode}
          >
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 照片网格 */}
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyText}>还没有照片</Text>
            <Text style={styles.emptySubtext}>
              去拍摄你的第一张美照吧！
            </Text>
          </View>
        }
      />

      {/* 底部操作栏（选择模式） */}
      {isSelectionMode && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => alert('分享功能开发中...')}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => alert('导出功能开发中...')}
          >
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionText}>导出</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={deleteSelected}
            disabled={selectedIds.length === 0}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionText}>删除</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 20,
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  gridContainer: {
    padding: theme.spacing.lg,
  },
  row: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  photoItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  photoItemSelected: {
    opacity: 0.8,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  cloudBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudIcon: {
    fontSize: 12,
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.text,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '20',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  deleteButton: {
    opacity: 1,
  },
});
