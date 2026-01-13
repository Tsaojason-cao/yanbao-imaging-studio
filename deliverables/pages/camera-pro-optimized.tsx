/**
 * yanbao AI 專業相機模塊 (Professional Camera) - 第二階段優化
 * 高級相機設置 + 色彩分級 + 參數精細調整
 * 
 * 優化內容：
 * - ISO、快門、白平衡精細調整
 * - 細膩的數值刻度顯示
 * - 色彩分級工具（陰影、中間調、高光）
 * - 參數預設和快速調整
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
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';
import { QuickToolBar } from '@/lib/components/QuickAccessBar';
import {
  ProfessionalParameterControl,
  ColorGradingTool,
} from '@/lib/components/ProfessionalParameterControl';

const { width, height } = Dimensions.get('window');

// ============================================
// 相機參數接口
// ============================================
interface CameraParams {
  iso: number;
  shutterSpeed: number;
  whiteBalance: number;
  exposure: number;
  contrast: number;
  saturation: number;
  shadows: number;
  midtones: number;
  highlights: number;
}

// ============================================
// 專業相機模塊組件
// ============================================
export default function CameraProOptimized() {
  const router = useRouter();

  // 相機參數狀態
  const [cameraParams, setCameraParams] = useState<CameraParams>({
    iso: 100,
    shutterSpeed: 125,
    whiteBalance: 5500,
    exposure: 0,
    contrast: 0,
    saturation: 0,
    shadows: 0,
    midtones: 0,
    highlights: 0,
  });

  // 模式切換
  const [mode, setMode] = useState<'beauty' | 'professional'>('beauty');

  // 功能開關
  const [features, setFeatures] = useState({
    realTimeBeauty: true,
    arPoseGuide: true,
    focusPeaking: false,
    professionalMode: false,
    colorGrading: false,
  });

  // 動畫值
  const modeTransition = useRef(new Animated.Value(0)).current;

  // ============================================
  // 更新相機參數
  // ============================================
  const updateCameraParam = (param: keyof CameraParams, value: number) => {
    setCameraParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  // ============================================
  // 切換模式
  // ============================================
  const handleModeChange = async (newMode: 'beauty' | 'professional') => {
    setMode(newMode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(modeTransition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modeTransition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ============================================
  // 應用預設
  // ============================================
  const applyPreset = async (presetName: string) => {
    let presetParams: Partial<CameraParams> = {};

    switch (presetName) {
      case 'daylight':
        presetParams = {
          iso: 100,
          shutterSpeed: 250,
          whiteBalance: 5500,
          exposure: 0,
          contrast: 10,
          saturation: 15,
        };
        break;
      case 'portrait':
        presetParams = {
          iso: 200,
          shutterSpeed: 125,
          whiteBalance: 6500,
          exposure: 0.5,
          contrast: 5,
          saturation: 20,
          shadows: 10,
          highlights: -10,
        };
        break;
      case 'landscape':
        presetParams = {
          iso: 100,
          shutterSpeed: 500,
          whiteBalance: 5500,
          exposure: 0,
          contrast: 20,
          saturation: 25,
          shadows: 5,
          highlights: -5,
        };
        break;
      case 'night':
        presetParams = {
          iso: 3200,
          shutterSpeed: 30,
          whiteBalance: 3500,
          exposure: 1,
          contrast: 15,
          saturation: 10,
          shadows: 20,
          highlights: -15,
        };
        break;
    }

    setCameraParams(prev => ({ ...prev, ...presetParams }));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('預設已應用', `已應用 ${presetName} 預設`);
  };

  // ============================================
  // 重置參數
  // ============================================
  const resetParams = async () => {
    setCameraParams({
      iso: 100,
      shutterSpeed: 125,
      whiteBalance: 5500,
      exposure: 0,
      contrast: 0,
      saturation: 0,
      shadows: 0,
      midtones: 0,
      highlights: 0,
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <LinearGradient
      colors={['#3D2B5E', '#2D1B4E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

          <Text style={styles.topNavTitle}>專業相機</Text>

          <TouchableOpacity style={styles.topNavButton}>
            <Text style={styles.topNavButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            模式切換
            ============================================ */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'beauty' && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange('beauty')}
          >
            <Text style={styles.modeButtonIcon}>✨</Text>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'beauty' && styles.modeButtonTextActive,
              ]}
            >
              美顏模式
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'professional' && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange('professional')}
          >
            <Text style={styles.modeButtonIcon}>📷</Text>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'professional' && styles.modeButtonTextActive,
              ]}
            >
              專業模式
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            取景器預覽
            ============================================ */}
        <View style={styles.viewfinderContainer}>
          <LinearGradient
            colors={['#4D3B6E', '#3D2B5E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.viewfinder}
          >
            {/* AR 姿勢引導 */}
            {features.arPoseGuide && (
              <View style={styles.arPoseGuide}>
                <Text style={styles.arPoseEmoji}>🎀</Text>
                <Text style={styles.arPoseText}>相似度: 95.8%</Text>
              </View>
            )}

            {/* 參數實時顯示 */}
            <View style={styles.parameterOverlay}>
              <View style={styles.parameterOverlayItem}>
                <Text style={styles.parameterOverlayLabel}>ISO</Text>
                <Text style={styles.parameterOverlayValue}>
                  {cameraParams.iso}
                </Text>
              </View>
              <View style={styles.parameterOverlayDivider} />
              <View style={styles.parameterOverlayItem}>
                <Text style={styles.parameterOverlayLabel}>快門</Text>
                <Text style={styles.parameterOverlayValue}>
                  1/{cameraParams.shutterSpeed}
                </Text>
              </View>
              <View style={styles.parameterOverlayDivider} />
              <View style={styles.parameterOverlayItem}>
                <Text style={styles.parameterOverlayLabel}>色溫</Text>
                <Text style={styles.parameterOverlayValue}>
                  {cameraParams.whiteBalance}K
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ============================================
            專業參數控制面板
            ============================================ */}
        {mode === 'professional' && (
          <View style={styles.parametersPanel}>
            <Text style={styles.panelTitle}>相機設置</Text>

            {/* ISO 控制 */}
            <ProfessionalParameterControl
              label="ISO 感光度"
              value={cameraParams.iso}
              minValue={100}
              maxValue={3200}
              step={100}
              unit="ISO"
              presets={[
                { label: '低 (100)', value: 100 },
                { label: '中 (400)', value: 400 },
                { label: '高 (1600)', value: 1600 },
                { label: '超高 (3200)', value: 3200 },
              ]}
              onChange={(value) => updateCameraParam('iso', value)}
              onPresetSelect={(value) => updateCameraParam('iso', value)}
            />

            {/* 快門速度控制 */}
            <ProfessionalParameterControl
              label="快門速度"
              value={cameraParams.shutterSpeed}
              minValue={30}
              maxValue={2000}
              step={10}
              unit="1/s"
              presets={[
                { label: '慢 (30)', value: 30 },
                { label: '標準 (125)', value: 125 },
                { label: '快 (500)', value: 500 },
                { label: '超快 (2000)', value: 2000 },
              ]}
              onChange={(value) => updateCameraParam('shutterSpeed', value)}
              onPresetSelect={(value) => updateCameraParam('shutterSpeed', value)}
            />

            {/* 白平衡控制 */}
            <ProfessionalParameterControl
              label="白平衡"
              value={cameraParams.whiteBalance}
              minValue={2500}
              maxValue={8000}
              step={100}
              unit="K"
              presets={[
                { label: '暖光 (3500K)', value: 3500 },
                { label: '日光 (5500K)', value: 5500 },
                { label: '冷光 (7000K)', value: 7000 },
                { label: '極冷 (8000K)', value: 8000 },
              ]}
              onChange={(value) => updateCameraParam('whiteBalance', value)}
              onPresetSelect={(value) => updateCameraParam('whiteBalance', value)}
            />

            {/* 曝光補償 */}
            <ProfessionalParameterControl
              label="曝光補償"
              value={cameraParams.exposure}
              minValue={-2}
              maxValue={2}
              step={0.1}
              unit="EV"
              onChange={(value) => updateCameraParam('exposure', value)}
            />

            {/* 對比度 */}
            <ProfessionalParameterControl
              label="對比度"
              value={cameraParams.contrast}
              minValue={-100}
              maxValue={100}
              step={5}
              unit=""
              onChange={(value) => updateCameraParam('contrast', value)}
            />

            {/* 飽和度 */}
            <ProfessionalParameterControl
              label="飽和度"
              value={cameraParams.saturation}
              minValue={-100}
              maxValue={100}
              step={5}
              unit=""
              onChange={(value) => updateCameraParam('saturation', value)}
            />

            {/* 色彩分級 */}
            <View style={styles.colorGradingToggle}>
              <Text style={styles.colorGradingToggleLabel}>色彩分級</Text>
              <Switch
                value={features.colorGrading}
                onValueChange={(value) =>
                  setFeatures(prev => ({ ...prev, colorGrading: value }))
                }
                trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#FF6B9D' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {features.colorGrading && (
              <ColorGradingTool
                shadows={cameraParams.shadows}
                midtones={cameraParams.midtones}
                highlights={cameraParams.highlights}
                onShadowsChange={(value) =>
                  updateCameraParam('shadows', value)
                }
                onMidtonesChange={(value) =>
                  updateCameraParam('midtones', value)
                }
                onHighlightsChange={(value) =>
                  updateCameraParam('highlights', value)
                }
              />
            )}
          </View>
        )}

        {/* ============================================
            快速預設
            ============================================ */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetsSectionTitle}>快速預設</Text>
          <View style={styles.presetsGrid}>
            {[
              { name: 'daylight', label: '日光', icon: '☀️' },
              { name: 'portrait', label: '人像', icon: '👤' },
              { name: 'landscape', label: '風景', icon: '🏔️' },
              { name: 'night', label: '夜景', icon: '🌙' },
            ].map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={styles.presetItem}
                onPress={() => applyPreset(preset.name)}
              >
                <Text style={styles.presetItemIcon}>{preset.icon}</Text>
                <Text style={styles.presetItemLabel}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ============================================
            操作按鈕
            ============================================ */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetParams}
          >
            <Text style={styles.resetButtonText}>重置參數</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => Alert.alert('拍照', '已應用所有設置')}
          >
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmButtonGradient}
            >
              <Text style={styles.confirmButtonText}>開始拍攝</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderColor: 'rgba(255, 107, 157, 0.6)',
  },
  modeButtonIcon: {
    fontSize: 16,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewfinderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewfinder: {
    height: 280,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    overflow: 'hidden',
  },
  arPoseGuide: {
    alignItems: 'center',
    gap: 8,
  },
  arPoseEmoji: {
    fontSize: 48,
  },
  arPoseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  parameterOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  parameterOverlayItem: {
    alignItems: 'center',
    gap: 2,
  },
  parameterOverlayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  parameterOverlayValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  parameterOverlayDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  parametersPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  colorGradingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorGradingToggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  presetsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  presetsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  presetItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    alignItems: 'center',
    gap: 4,
  },
  presetItemIcon: {
    fontSize: 20,
  },
  presetItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CameraProOptimized;
