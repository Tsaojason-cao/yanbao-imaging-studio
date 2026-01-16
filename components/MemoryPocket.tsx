/**
 * 记忆口袋组件
 * 
 * 功能：在相机页面快速访问和应用雁宝记忆中的参数
 * 
 * by Jason Tsao ❤️
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { sanmuEngine, type ParamsSnapshot } from '@/lib/sanmu-engine';

const { width, height } = Dimensions.get('window');

interface MemoryPocketProps {
  visible: boolean;
  onClose: () => void;
  onApply: (snapshot: ParamsSnapshot) => void;
}

export default function MemoryPocket({
  visible,
  onClose,
  onApply,
}: MemoryPocketProps) {
  const [memories, setMemories] = useState<ParamsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadMemories();
    }
  }, [visible]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const favoriteSnapshots = await sanmuEngine.getFavoriteSnapshots();
      setMemories(favoriteSnapshots);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMemory = (snapshot: ParamsSnapshot) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onApply(snapshot);
    onClose();
  };

  const renderMemoryItem = (snapshot: ParamsSnapshot) => (
    <TouchableOpacity
      key={snapshot.id}
      onPress={() => handleApplyMemory(snapshot)}
      style={styles.memoryItem}
    >
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.2)', 'rgba(236, 72, 153, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.memoryItemGradient}
      >
        {/* 记忆名称 */}
        <Text style={styles.memoryItemName}>{snapshot.name}</Text>

        {/* 大师风格 */}
        <Text style={styles.memoryItemMaster}>
          ✨ {snapshot.masterPreset.name}
        </Text>

        {/* 参数预览 */}
        <View style={styles.paramsPreview}>
          <View style={styles.paramTag}>
            <Text style={styles.paramTagText}>
              大眼 {snapshot.beautyParams.eyes}
            </Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramTagText}>
              瘦脸 {snapshot.beautyParams.face}
            </Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramTagText}>
              强度 {snapshot.intensity}%
            </Text>
          </View>
        </View>

        {/* 应用按钮 */}
        <View style={styles.applyButton}>
          <Text style={styles.applyButtonText}>点击应用</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 顶部标题栏 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💕 记忆口袋</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 记忆列表 */}
          <ScrollView style={styles.scrollView}>
            {loading ? (
              <Text style={styles.loadingText}>加载中...</Text>
            ) : memories.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📸</Text>
                <Text style={styles.emptyText}>还没有珍藏的记忆</Text>
                <Text style={styles.emptyHint}>
                  去"雁宝记忆"添加第一个记忆吧
                </Text>
              </View>
            ) : (
              memories.map(renderMemoryItem)
            )}
          </ScrollView>

          {/* 底部提示 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              长按记忆可查看完整参数 🐰
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.7,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  memoryItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  memoryItemGradient: {
    padding: 16,
  },
  memoryItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  memoryItemMaster: {
    fontSize: 14,
    color: '#EC4899',
    marginBottom: 12,
  },
  paramsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  paramTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paramTagText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});
