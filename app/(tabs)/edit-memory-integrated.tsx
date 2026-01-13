/**
 * 編輯頁面 - 集成記憶系統
 * Edit Page - Integrated Memory System
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { ArrowLeft, Undo2, Redo2, Save, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';
import { SaveMemoryRequest, SaveMemoryResult } from '../lib/types/memory';

interface EditMemoryIntegratedProps {
  userId?: string;
  onBack?: () => void;
}

/**
 * 快速工具按鈕
 */
interface ToolButtonProps {
  name: string;
  icon: string;
  onPress: () => void;
  isActive?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  name,
  icon,
  onPress,
  isActive,
}) => (
  <TouchableOpacity
    style={[styles.toolButton, isActive && styles.toolButtonActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.toolIcon}>{icon}</Text>
    <Text style={[styles.toolName, isActive && styles.toolNameActive]}>
      {name}
    </Text>
  </TouchableOpacity>
);

/**
 * 編輯頁面 - 集成記憶系統
 */
export const EditMemoryIntegrated: React.FC<EditMemoryIntegratedProps> = ({
  userId = 'user123',
  onBack,
}) => {
  const { saveMemory } = useMemoryLibrary(userId);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState<'ai_remove' | 'ai_expand' | 'beautify' | 'filter'>(
    'ai_remove'
  );
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const progressAnim = new Animated.Value(0);

  const [currentParameters] = useState({
    optical: {
      iso: 400,
      shutterSpeed: 125,
      whiteBalance: 5500,
    },
    beauty: {
      skinSmoothing: 75,
      whitening: 60,
      faceThinning: 50,
      eyeEnlarging: 65,
      exposure: 0,
      contrast: 10,
      saturation: 15,
    },
    filter: {
      filterId: 'filter_vintage',
      filterName: '復古',
      intensity: 80,
    },
    arPose: {
      templateId: 'kuromi_cute',
      templateName: '庫洛米甜酷風',
      poseType: 'face' as const,
      confidence: 95,
    },
    environment: {
      location: '杭州',
      lighting: 'indoor' as const,
      season: 'winter' as const,
      mood: '復古咖啡館',
      temperature: 18,
    },
  });

  const handleSaveMemory = useCallback(
    async (request: SaveMemoryRequest): Promise<SaveMemoryResult> => {
      return await saveMemory(request);
    },
    [saveMemory]
  );

  const handleToolSelect = useCallback(
    (tool: 'ai_remove' | 'ai_expand' | 'beautify' | 'filter') => {
      setActiveMode(tool);
      setIsProcessing(true);
      setProcessingProgress(0);

      // 模擬處理進度
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    []
  );

  const handleUndo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('撤銷', '上一步操作已撤銷');
  }, []);

  const handleRedo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('重做', '操作已重做');
  }, []);

  const handleSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('✓ 已保存', '編輯後的照片已保存到相冊');
  }, []);

  const handleShare = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('📤 分享', '照片已分享到社交媒體');
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 頭部 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>yanbao AI 編輯</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 圖片預覽區域 */}
      <View style={styles.imagePreview}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>
            {showBeforeAfter ? '編輯後 ✨' : '原圖'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.beforeAfterToggle}
          onPress={() => {
            setShowBeforeAfter(!showBeforeAfter);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.beforeAfterText}>
            {showBeforeAfter ? 'Before/After' : 'Before/After'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 處理進度 */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <Text style={styles.processingLabel}>
            {activeMode === 'ai_remove' && 'AI 消除中...'}
            {activeMode === 'ai_expand' && 'AI 擴圖中...'}
            {activeMode === 'beautify' && '美顏處理中...'}
            {activeMode === 'filter' && '濾鏡應用中...'}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(processingProgress, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(Math.min(processingProgress, 100))}%
          </Text>
        </View>
      )}

      {/* 快速工具欄 */}
      <View style={styles.toolsSection}>
        <Text style={styles.sectionTitle}>快速工具</Text>
        <View style={styles.toolsContainer}>
          <ToolButton
            name="AI 消除"
            icon="🗑️"
            onPress={() => handleToolSelect('ai_remove')}
            isActive={activeMode === 'ai_remove'}
          />
          <ToolButton
            name="AI 擴圖"
            icon="📐"
            onPress={() => handleToolSelect('ai_expand')}
            isActive={activeMode === 'ai_expand'}
          />
          <ToolButton
            name="美顏"
            icon="✨"
            onPress={() => handleToolSelect('beautify')}
            isActive={activeMode === 'beautify'}
          />
          <ToolButton
            name="濾鏡"
            icon="🎨"
            onPress={() => handleToolSelect('filter')}
            isActive={activeMode === 'filter'}
          />
        </View>
      </View>

      {/* 編輯參數 */}
      <View style={styles.parametersSection}>
        <Text style={styles.sectionTitle}>編輯參數</Text>

        {/* 曝光 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>曝光</Text>
            <Text style={styles.parameterValue}>0 EV</Text>
          </View>
          <View style={styles.parameterSlider}>
            <View style={[styles.sliderFill, { width: '50%' }]} />
          </View>
        </View>

        {/* 對比度 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>對比度</Text>
            <Text style={styles.parameterValue}>+10</Text>
          </View>
          <View style={styles.parameterSlider}>
            <View style={[styles.sliderFill, { width: '55%' }]} />
          </View>
        </View>

        {/* 飽和度 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>飽和度</Text>
            <Text style={styles.parameterValue}>+15</Text>
          </View>
          <View style={styles.parameterSlider}>
            <View style={[styles.sliderFill, { width: '57.5%' }]} />
          </View>
        </View>
      </View>

      {/* 記憶按鈕 */}
      <View style={styles.memorySection}>
        <Text style={styles.sectionTitle}>保存為記憶</Text>
        <View style={styles.memoryButtonContainer}>
          <YanBaoMemoryButton
            onSaveMemory={handleSaveMemory}
            currentParameters={currentParameters}
            mode="edit"
            onSuccess={(memory) => {
              Alert.alert(
                '✨ 記憶已保存',
                `『${memory.name}』已成功存入雁寶記憶庫！`
              );
            }}
            onError={(error) => {
              Alert.alert('❌ 保存失敗', error.message);
            }}
          />
        </View>
      </View>

      {/* 操作按鈕 */}
      <View style={styles.actionBar}>
        {/* 撤銷/重做 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleUndo}
          activeOpacity={0.7}
        >
          <Undo2 size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRedo}
          activeOpacity={0.7}
        >
          <Redo2 size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        {/* 保存 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Save size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>

        {/* 分享 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.shareButtonText}>分享</Text>
        </TouchableOpacity>
      </View>

      {/* 底部間距 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // 容器
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  contentContainer: {
    paddingBottom: 32,
  },

  // 頭部
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B9D',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // 圖片預覽
  imagePreview: {
    marginHorizontal: 16,
    marginVertical: 16,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
  },
  imageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  beforeAfterToggle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  beforeAfterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  // 處理進度
  processingContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    padding: 12,
  },
  processingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'right',
  },

  // 工具欄
  toolsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  toolsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toolButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolButtonActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  toolName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  toolNameActive: {
    color: '#FFFFFF',
  },

  // 參數
  parametersSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  parameterItem: {
    marginBottom: 12,
  },
  parameterLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  parameterName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  parameterValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  parameterSlider: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },

  // 記憶部分
  memorySection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  memoryButtonContainer: {
    alignItems: 'center',
  },

  // 操作欄
  actionBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
    flexDirection: 'row',
    gap: 8,
  },
  shareButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 底部間距
  bottomSpacer: {
    height: 16,
  },
});
