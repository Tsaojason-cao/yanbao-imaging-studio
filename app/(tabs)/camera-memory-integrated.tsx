/**
 * 拍照頁面 - 集成記憶系統
 * Camera Page - Integrated Memory System
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Camera, Zap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';
import { SaveMemoryRequest, SaveMemoryResult } from '../lib/types/memory';

interface CameraMemoryIntegratedProps {
  userId?: string;
}

/**
 * 快速預設按鈕
 */
interface PresetButtonProps {
  name: string;
  icon: string;
  onPress: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({ name, icon, onPress }) => (
  <TouchableOpacity style={styles.presetButton} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.presetIcon}>{icon}</Text>
    <Text style={styles.presetName}>{name}</Text>
  </TouchableOpacity>
);

/**
 * 拍照頁面 - 集成記憶系統
 */
export const CameraMemoryIntegrated: React.FC<CameraMemoryIntegratedProps> = ({
  userId = 'user123',
}) => {
  const { saveMemory } = useMemoryLibrary(userId);
  const [currentParameters, setCurrentParameters] = useState({
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
      filterId: 'preset_natural',
      filterName: '自然',
      intensity: 100,
    },
    arPose: {
      templateId: 'kuromi_cute',
      templateName: '庫洛米甜酷風',
      poseType: 'face' as const,
      confidence: 95,
    },
    environment: {
      location: '北京',
      lighting: 'daylight' as const,
      season: 'winter' as const,
      mood: '冬日暖陽',
      temperature: 12,
    },
  });

  const handleSaveMemory = useCallback(
    async (request: SaveMemoryRequest): Promise<SaveMemoryResult> => {
      return await saveMemory(request);
    },
    [saveMemory]
  );

  const handlePresetSelect = useCallback((presetName: string) => {
    Alert.alert('✨ 預設已應用', `『${presetName}』預設已應用到當前拍照`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleCapture = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('📷 拍照成功', '照片已保存到相冊');
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 頭部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>yanbao AI</Text>
        <Text style={styles.headerSubtitle}>v2.2.0</Text>
      </View>

      {/* 相機預覽區域 */}
      <View style={styles.cameraPreview}>
        <View style={styles.cameraPlaceholder}>
          <Camera size={64} color="#FF6B9D" strokeWidth={1.5} />
          <Text style={styles.cameraText}>相機預覽</Text>
        </View>
      </View>

      {/* AR 相似度指示 */}
      <View style={styles.arIndicator}>
        <View style={styles.arIndicatorContent}>
          <Text style={styles.arLabel}>AR 相似度</Text>
          <Text style={styles.arValue}>95%</Text>
        </View>
        <View style={styles.arBar}>
          <View style={[styles.arProgress, { width: '95%' }]} />
        </View>
      </View>

      {/* 快速預設欄 */}
      <View style={styles.presetsSection}>
        <Text style={styles.sectionTitle}>快速預設</Text>
        <View style={styles.presetsContainer}>
          <PresetButton
            name="自然"
            icon="🌿"
            onPress={() => handlePresetSelect('自然')}
          />
          <PresetButton
            name="精致"
            icon="💎"
            onPress={() => handlePresetSelect('精致')}
          />
          <PresetButton
            name="明星"
            icon="⭐"
            onPress={() => handlePresetSelect('明星')}
          />
          <PresetButton
            name="高級"
            icon="👑"
            onPress={() => handlePresetSelect('高級')}
          />
        </View>
      </View>

      {/* 美顏參數 */}
      <View style={styles.beautySection}>
        <Text style={styles.sectionTitle}>專業美顏參數</Text>

        {/* 磨皮 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>磨皮</Text>
            <Text style={styles.parameterValue}>
              {currentParameters.beauty.skinSmoothing}
            </Text>
          </View>
          <View style={styles.parameterSlider}>
            <View
              style={[
                styles.sliderFill,
                { width: `${currentParameters.beauty.skinSmoothing}%` },
              ]}
            />
          </View>
        </View>

        {/* 美白 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>美白</Text>
            <Text style={styles.parameterValue}>
              {currentParameters.beauty.whitening}
            </Text>
          </View>
          <View style={styles.parameterSlider}>
            <View
              style={[
                styles.sliderFill,
                { width: `${currentParameters.beauty.whitening}%` },
              ]}
            />
          </View>
        </View>

        {/* 瘦臉 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>瘦臉</Text>
            <Text style={styles.parameterValue}>
              {currentParameters.beauty.faceThinning}
            </Text>
          </View>
          <View style={styles.parameterSlider}>
            <View
              style={[
                styles.sliderFill,
                { width: `${currentParameters.beauty.faceThinning}%` },
              ]}
            />
          </View>
        </View>

        {/* 大眼 */}
        <View style={styles.parameterItem}>
          <View style={styles.parameterLabel}>
            <Text style={styles.parameterName}>大眼</Text>
            <Text style={styles.parameterValue}>
              {currentParameters.beauty.eyeEnlarging}
            </Text>
          </View>
          <View style={styles.parameterSlider}>
            <View
              style={[
                styles.sliderFill,
                { width: `${currentParameters.beauty.eyeEnlarging}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 記憶按鈕和拍攝按鈕 */}
      <View style={styles.actionBar}>
        <YanBaoMemoryButton
          onSaveMemory={handleSaveMemory}
          currentParameters={currentParameters}
          mode="camera"
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

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          activeOpacity={0.8}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <View style={styles.spacer} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: '#FF6B9D',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },

  // 相機預覽
  cameraPreview: {
    marginHorizontal: 16,
    marginVertical: 16,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF6B9D',
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
  },
  cameraText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
  },

  // AR 指示器
  arIndicator: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    padding: 12,
  },
  arIndicatorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  arLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  arValue: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '700',
  },
  arBar: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  arProgress: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },

  // 快速預設
  presetsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  presetsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  presetName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 美顏參數
  beautySection: {
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

  // 操作欄
  actionBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  captureButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  spacer: {
    width: 60,
  },

  // 底部間距
  bottomSpacer: {
    height: 16,
  },
});
