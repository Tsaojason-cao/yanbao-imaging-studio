/**
 * yanbao AI 批量處理模塊 (Batch Processing) - 第三階段優化
 * 批量選擇 + 批量編輯 + 批量導出
 * 
 * 優化內容：
 * - 批量選擇照片（多選模式）
 * - 批量應用濾鏡和效果
 * - 批量 AI 消除和擴圖
 * - 批量導出和分享
 * - 進度管理和取消操作
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 照片接口
// ============================================
interface Photo {
  id: string;
  title: string;
  thumbnail: string;
  selected: boolean;
}

// ============================================
// 批量任務接口
// ============================================
interface BatchTask {
  id: string;
  type: 'filter' | 'removal' | 'outpainting' | 'export';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  selectedPhotos: string[];
}

// ============================================
// 批量處理模塊組件
// ============================================
export default function BatchOptimized() {
  const router = useRouter();

  // 照片列表
  const [photos, setPhotos] = useState<Photo[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: `photo-${i}`,
      title: `照片 ${i + 1}`,
      thumbnail: '📷',
      selected: false,
    }))
  );

  // 選擇模式
  const [selectionMode, setSelectionMode] = useState(false);

  // 批量任務
  const [batchTasks, setBatchTasks] = useState<BatchTask[]>([]);
  const [currentTask, setCurrentTask] = useState<BatchTask | null>(null);

  // 動畫值
  const selectionModeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ============================================
  // 計算選中的照片數量
  // ============================================
  const selectedCount = photos.filter(p => p.selected).length;
  const selectedPhotos = photos.filter(p => p.selected);

  // ============================================
  // 切換選擇模式
  // ============================================
  const toggleSelectionMode = async () => {
    const newMode = !selectionMode;
    setSelectionMode(newMode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.timing(selectionModeAnim, {
      toValue: newMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 退出選擇模式時清除選擇
    if (!newMode) {
      setPhotos(photos.map(p => ({ ...p, selected: false })));
    }
  };

  // ============================================
  // 切換照片選擇
  // ============================================
  const togglePhotoSelection = async (photoId: string) => {
    setPhotos(photos.map(p =>
      p.id === photoId ? { ...p, selected: !p.selected } : p
    ));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ============================================
  // 全選/取消全選
  // ============================================
  const toggleSelectAll = async () => {
    const allSelected = selectedCount === photos.length;
    setPhotos(photos.map(p => ({ ...p, selected: !allSelected })));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // ============================================
  // 開始批量任務
  // ============================================
  const startBatchTask = async (taskType: 'filter' | 'removal' | 'outpainting' | 'export') => {
    if (selectedPhotos.length === 0) {
      Alert.alert('提示', '請先選擇至少一張照片');
      return;
    }

    const task: BatchTask = {
      id: `task-${Date.now()}`,
      type: taskType,
      status: 'processing',
      progress: 0,
      selectedPhotos: selectedPhotos.map(p => p.id),
    };

    setCurrentTask(task);
    setBatchTasks([...batchTasks, task]);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // 模擬處理進度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setCurrentTask(prev => prev ? { ...prev, status: 'completed', progress: 100 } : null);
        setBatchTasks(tasks =>
          tasks.map(t =>
            t.id === task.id ? { ...t, status: 'completed', progress: 100 } : t
          )
        );

        // 2 秒後自動關閉
        setTimeout(() => {
          setCurrentTask(null);
          Alert.alert('完成', `已成功處理 ${selectedPhotos.length} 張照片`);
        }, 2000);
      } else {
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 200,
          useNativeDriver: false,
        }).start();

        setCurrentTask(prev => prev ? { ...prev, progress } : null);
        setBatchTasks(tasks =>
          tasks.map(t =>
            t.id === task.id ? { ...t, progress } : t
          )
        );
      }
    }, 300);
  };

  // ============================================
  // 取消任務
  // ============================================
  const cancelTask = async () => {
    if (currentTask) {
      setCurrentTask(null);
      setBatchTasks(tasks =>
        tasks.map(t =>
          t.id === currentTask.id ? { ...t, status: 'failed' } : t
        )
      );
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert('已取消', '批量處理已取消');
    }
  };

  // ============================================
  // 渲染照片項目
  // ============================================
  const renderPhotoItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[
        styles.photoItem,
        item.selected && styles.photoItemSelected,
      ]}
      onPress={() => {
        if (selectionMode) {
          togglePhotoSelection(item.id);
        } else {
          router.push(`/edit?photoId=${item.id}` as any);
        }
      }}
      onLongPress={() => {
        if (!selectionMode) {
          toggleSelectionMode();
          togglePhotoSelection(item.id);
        }
      }}
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

      {/* 選擇勾選 */}
      {selectionMode && (
        <View
          style={[
            styles.photoCheckbox,
            item.selected && styles.photoCheckboxSelected,
          ]}
        >
          {item.selected && <Text style={styles.photoCheckboxIcon}>✓</Text>}
        </View>
      )}
    </TouchableOpacity>
  );

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

        <Text style={styles.topNavTitle}>
          {selectionMode ? `已選擇 ${selectedCount} 張` : '批量處理'}
        </Text>

        {selectionMode ? (
          <TouchableOpacity
            onPress={toggleSelectionMode}
            style={styles.topNavButton}
          >
            <Text style={styles.topNavButtonText}>完成</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={toggleSelectionMode}
            style={styles.topNavButton}
          >
            <Text style={styles.topNavButtonText}>選擇</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ============================================
          照片網格
          ============================================ */}
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
      />

      {/* ============================================
          批量操作面板（選擇模式）
          ============================================ */}
      {selectionMode && selectedCount > 0 && (
        <Animated.View
          style={[
            styles.batchActionsPanel,
            {
              transform: [
                {
                  translateY: selectionModeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* 全選/取消全選 */}
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={toggleSelectAll}
          >
            <Text style={styles.selectAllButtonText}>
              {selectedCount === photos.length ? '取消全選' : '全選'}
            </Text>
          </TouchableOpacity>

          {/* 批量操作按鈕 */}
          <View style={styles.batchOperationsGrid}>
            <TouchableOpacity
              style={styles.batchOperationButton}
              onPress={() => startBatchTask('filter')}
            >
              <Text style={styles.batchOperationIcon}>🎨</Text>
              <Text style={styles.batchOperationLabel}>批量濾鏡</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.batchOperationButton}
              onPress={() => startBatchTask('removal')}
            >
              <Text style={styles.batchOperationIcon}>🗑️</Text>
              <Text style={styles.batchOperationLabel}>批量消除</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.batchOperationButton}
              onPress={() => startBatchTask('outpainting')}
            >
              <Text style={styles.batchOperationIcon}>🖼️</Text>
              <Text style={styles.batchOperationLabel}>批量擴圖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.batchOperationButton}
              onPress={() => startBatchTask('export')}
            >
              <Text style={styles.batchOperationIcon}>📤</Text>
              <Text style={styles.batchOperationLabel}>批量導出</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* ============================================
          處理進度面板
          ============================================ */}
      {currentTask && (
        <View style={styles.processingPanel}>
          <LinearGradient
            colors={['rgba(77, 59, 110, 0.95)', 'rgba(45, 27, 78, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.processingPanelGradient}
          >
            <View style={styles.processingHeader}>
              <Text style={styles.processingTitle}>
                {currentTask.type === 'filter' && '批量應用濾鏡中...'}
                {currentTask.type === 'removal' && 'AI 批量消除中...'}
                {currentTask.type === 'outpainting' && 'AI 批量擴圖中...'}
                {currentTask.type === 'export' && '批量導出中...'}
              </Text>
              <TouchableOpacity
                onPress={cancelTask}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 進度條 */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(currentTask.progress)}%
              </Text>
            </View>

            {/* 統計信息 */}
            <View style={styles.processingStats}>
              <View style={styles.processingStatItem}>
                <Text style={styles.processingStatLabel}>總數</Text>
                <Text style={styles.processingStatValue}>
                  {currentTask.selectedPhotos.length}
                </Text>
              </View>
              <View style={styles.processingStatDivider} />
              <View style={styles.processingStatItem}>
                <Text style={styles.processingStatLabel}>已完成</Text>
                <Text style={styles.processingStatValue}>
                  {Math.round((currentTask.progress / 100) * currentTask.selectedPhotos.length)}
                </Text>
              </View>
              <View style={styles.processingStatDivider} />
              <View style={styles.processingStatItem}>
                <Text style={styles.processingStatLabel}>剩餘</Text>
                <Text style={styles.processingStatValue}>
                  {Math.round(((100 - currentTask.progress) / 100) * currentTask.selectedPhotos.length)}
                </Text>
              </View>
            </View>

            {/* 狀態指示 */}
            {currentTask.status === 'processing' && (
              <View style={styles.processingIndicator}>
                <ActivityIndicator size="small" color="#FF6B9D" />
                <Text style={styles.processingIndicatorText}>
                  正在處理，請勿關閉...
                </Text>
              </View>
            )}

            {currentTask.status === 'completed' && (
              <View style={styles.processingIndicator}>
                <Text style={styles.completedIcon}>✓</Text>
                <Text style={styles.processingIndicatorText}>
                  處理完成！
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      )}

      {/* ============================================
          任務歷史
          ============================================ */}
      {batchTasks.length > 0 && !currentTask && (
        <View style={styles.taskHistoryPanel}>
          <Text style={styles.taskHistoryTitle}>最近任務</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.taskHistoryContent}
          >
            {batchTasks.slice(-5).map((task) => (
              <View key={task.id} style={styles.taskHistoryItem}>
                <Text style={styles.taskHistoryItemIcon}>
                  {task.type === 'filter' && '🎨'}
                  {task.type === 'removal' && '🗑️'}
                  {task.type === 'outpainting' && '🖼️'}
                  {task.type === 'export' && '📤'}
                </Text>
                <Text style={styles.taskHistoryItemLabel}>
                  {task.status === 'completed' && '✓'}
                  {task.status === 'failed' && '✕'}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
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
  gridContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  gridRow: {
    marginBottom: 8,
  },
  photoItem: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: 8,
    aspectRatio: 1,
  },
  photoItemSelected: {
    opacity: 0.8,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  photoIcon: {
    fontSize: 28,
  },
  photoCheckbox: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCheckboxSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  photoCheckboxIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  batchActionsPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
    backgroundColor: 'rgba(45, 27, 78, 0.9)',
  },
  selectAllButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectAllButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  batchOperationsGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  batchOperationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.15)',
    alignItems: 'center',
    gap: 4,
  },
  batchOperationIcon: {
    fontSize: 20,
  },
  batchOperationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  processingPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
  },
  processingPanelGradient: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  processingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B9D',
    textAlign: 'right',
  },
  processingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  processingStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  processingStatLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  processingStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  processingStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  completedIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  processingIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  taskHistoryPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
    backgroundColor: 'rgba(45, 27, 78, 0.5)',
  },
  taskHistoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  taskHistoryContent: {
    gap: 8,
  },
  taskHistoryItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  taskHistoryItemIcon: {
    fontSize: 20,
  },
  taskHistoryItemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
});

export default BatchOptimized;
