import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../config/theme';
import { BeautyPreset, DEFAULT_BEAUTY_PARAMS } from '../types/beauty';

const { width } = Dimensions.get('window');

interface PresetsScreenProps {
  navigation: any;
}

// 模拟预设数据
const MOCK_PRESETS: BeautyPreset[] = [
  {
    id: 'preset-1',
    name: '自然清透',
    params: { ...DEFAULT_BEAUTY_PARAMS, smoothing: 30, whitening: 20 },
    createdAt: new Date(),
    isFavorite: true,
  },
  {
    id: 'preset-2',
    name: '甜美少女',
    params: { ...DEFAULT_BEAUTY_PARAMS, smoothing: 60, whitening: 40, eyeEnlarge: 30 },
    createdAt: new Date(),
    isFavorite: false,
  },
  {
    id: 'preset-3',
    name: '高级感',
    params: { ...DEFAULT_BEAUTY_PARAMS, contrast: 60, saturation: 40 },
    createdAt: new Date(),
    isFavorite: true,
  },
];

export default function PresetsScreen({ navigation }: PresetsScreenProps) {
  const [presets, setPresets] = useState<BeautyPreset[]>(MOCK_PRESETS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const toggleFavorite = (presetId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPresets(prev =>
      prev.map(p =>
        p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const deletePreset = (presetId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const createPreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: BeautyPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName,
      params: DEFAULT_BEAUTY_PARAMS,
      createdAt: new Date(),
      isFavorite: false,
    };

    setPresets(prev => [newPreset, ...prev]);
    setNewPresetName('');
    setShowCreateModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const applyPreset = (preset: BeautyPreset) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: 应用预设到当前照片
    alert(`已应用预设：${preset.name}`);
    navigation.goBack();
  };

  const renderPreset = ({ item }: { item: BeautyPreset }) => (
    <TouchableOpacity
      style={styles.presetCard}
      onPress={() => applyPreset(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={styles.presetGradient}
      >
        {/* 预设缩略图区域 */}
        <View style={styles.presetThumbnail}>
          <Text style={styles.thumbnailIcon}>✨</Text>
        </View>

        {/* 预设信息 */}
        <View style={styles.presetInfo}>
          <View style={styles.presetHeader}>
            <Text style={styles.presetName}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.favoriteIcon}>
                {item.isFavorite ? '💜' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 参数预览 */}
          <View style={styles.paramsPreview}>
            <View style={styles.paramTag}>
              <Text style={styles.paramTagText}>
                磨皮 {item.params.smoothing}
              </Text>
            </View>
            <View style={styles.paramTag}>
              <Text style={styles.paramTagText}>
                美白 {item.params.whitening}
              </Text>
            </View>
            <View style={styles.paramTag}>
              <Text style={styles.paramTagText}>
                瘦脸 {item.params.faceSlim}
              </Text>
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.presetActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => alert('编辑功能开发中...')}
            >
              <Text style={styles.actionButtonText}>编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePreset(item.id)}
            >
              <Text style={styles.actionButtonText}>删除</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

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
        
        <Text style={styles.title}>雁宝记忆</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 预设列表 */}
      <FlatList
        data={presets}
        renderItem={renderPreset}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💜</Text>
            <Text style={styles.emptyText}>还没有预设</Text>
            <Text style={styles.emptySubtext}>
              创建你的专属美颜配方吧！
            </Text>
          </View>
        }
      />

      {/* 创建预设弹窗 */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>创建新预设</Text>
            
            <TextInput
              style={styles.input}
              placeholder="输入预设名称"
              placeholderTextColor={theme.colors.textSecondary}
              value={newPresetName}
              onChangeText={setNewPresetName}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPresetName('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={createPreset}
              >
                <Text style={styles.confirmButtonText}>创建</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  presetCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  presetGradient: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
  },
  presetThumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  thumbnailIcon: {
    fontSize: 32,
  },
  presetInfo: {
    flex: 1,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  presetName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  paramsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  paramTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.sm,
  },
  paramTagText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  presetActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.error + '20',
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width - theme.spacing.xl * 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
