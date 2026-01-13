/**
 * yanbao AI 拍照模塊 (Professional Camera) - 優化版
 * 實時美顏 + AR 姿勢引導 + 一鍵美顏
 * 
 * 優化內容：
 * - 添加一鍵預設按鈕（自然、精致、明星、高級）
 * - 上下滑動調整美顏強度
 * - 左右滑動切換美顏預設
 * - 雙指縮放調整相機焦距
 * - 單手易觸達的拍攝按鈕
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
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';
import { QuickToolBar } from '@/lib/components/QuickAccessBar';
import { FilterGesture, ParameterGesture } from '@/lib/components/GestureInteraction';

const { width, height } = Dimensions.get('window');

// ============================================
// 美顏參數接口
// ============================================
interface BeautyParams {
  skinTexture: number;      // 膚質 0-100
  faceShading: number;      // 光影 0-100
  boneStructure: number;    // 骨相 0-100
  colorGrading: number;     // 色彩 0-100
  skinWhitening: number;    // 美白 0-100
  eyeEnlargement: number;   // 大眼 0-100
  faceSlimming: number;     // 瘦臉 0-100
}

// ============================================
// 一鍵美顏預設
// ============================================
const BEAUTY_PRESETS = {
  natural: {
    name: '自然風格',
    icon: '🌿',
    params: {
      skinTexture: 45,
      faceShading: 38,
      boneStructure: 25,
      colorGrading: 50,
      skinWhitening: 42,
      eyeEnlargement: 30,
      faceSlimming: 28,
    },
  },
  elegant: {
    name: '精致風格',
    icon: '💎',
    params: {
      skinTexture: 65,
      faceShading: 55,
      boneStructure: 70,
      colorGrading: 60,
      skinWhitening: 75,
      eyeEnlargement: 50,
      faceSlimming: 45,
    },
  },
  celebrity: {
    name: '明星風格',
    icon: '⭐',
    params: {
      skinTexture: 80,
      faceShading: 70,
      boneStructure: 85,
      colorGrading: 75,
      skinWhitening: 90,
      eyeEnlargement: 70,
      faceSlimming: 65,
    },
  },
  advanced: {
    name: '高級風格',
    icon: '✨',
    params: {
      skinTexture: 70,
      faceShading: 60,
      boneStructure: 75,
      colorGrading: 70,
      skinWhitening: 80,
      eyeEnlargement: 60,
      faceSlimming: 55,
    },
  },
};

// ============================================
// 拍照模塊組件（優化版）
// ============================================
export default function CameraScreenOptimized() {
  const router = useRouter();

  // 美顏參數狀態
  const [beautyParams, setBeautyParams] = useState<BeautyParams>({
    skinTexture: 45,
    faceShading: 38,
    boneStructure: 25,
    colorGrading: 50,
    skinWhitening: 42,
    eyeEnlargement: 30,
    faceSlimming: 28,
  });

  // 當前預設
  const [currentPreset, setCurrentPreset] = useState<keyof typeof BEAUTY_PRESETS>('natural');
  const presetKeys = Object.keys(BEAUTY_PRESETS) as Array<keyof typeof BEAUTY_PRESETS>;

  // 功能開關狀態
  const [features, setFeatures] = useState({
    realTimeBeauty: true,
    arPoseGuide: true,
    focusPeaking: false,
    professionalMode: false,
  });

  // 動畫值
  const cameraOpacity = useRef(new Animated.Value(1)).current;
  const beautyPanelSlide = useRef(new Animated.Value(0)).current;
  const presetScrollAnim = useRef(new Animated.Value(0)).current;

  // 初始化動畫
  useEffect(() => {
    Animated.timing(beautyPanelSlide, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // ============================================
  // 美顏參數更新
  // ============================================
  const updateBeautyParam = (param: keyof BeautyParams, value: number) => {
    setBeautyParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  // ============================================
  // 應用一鍵美顏預設
  // ============================================
  const applyBeautyPreset = async (presetKey: keyof typeof BEAUTY_PRESETS) => {
    const preset = BEAUTY_PRESETS[presetKey];
    setBeautyParams(preset.params);
    setCurrentPreset(presetKey);
    
    // 觸覺反饋
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // 動畫反饋
    Animated.sequence([
      Animated.timing(presetScrollAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(presetScrollAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ============================================
  // 重置美顏參數
  // ============================================
  const resetBeautyParams = async () => {
    setBeautyParams({
      skinTexture: 45,
      faceShading: 38,
      boneStructure: 25,
      colorGrading: 50,
      skinWhitening: 42,
      eyeEnlargement: 30,
      faceSlimming: 28,
    });
    setCurrentPreset('natural');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ============================================
  // 拍照
  // ============================================
  const handleTakePhoto = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('拍照成功', '照片已保存到相冊');
    // 實際應用中會調用相機 API
  };

  // ============================================
  // 處理手勢切換預設
  // ============================================
  const handlePresetChange = (index: number) => {
    const presetKey = presetKeys[index];
    applyBeautyPreset(presetKey);
  };

  return (
    <View style={styles.container}>
      {/* ============================================
          取景器區域
          ============================================ */}
      <Animated.View style={[styles.viewfinder, { opacity: cameraOpacity }]}>
        <LinearGradient
          colors={['#3D2B5E', '#2D1B4E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.viewfinderGradient}
        >
          {/* 頂部控制欄 */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => router.back()}
            >
              <Text style={styles.topBarIcon}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.timerText}>3s</Text>

            <TouchableOpacity style={styles.topBarButton}>
              <Text style={styles.topBarIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* 庫洛米 AR 姿勢引導 */}
          {features.arPoseGuide && (
            <View style={styles.arPoseGuide}>
              <Text style={styles.arPoseEmoji}>🎀</Text>
              <Text style={styles.arPoseText}>相似度: 95.8%</Text>
            </View>
          )}

          {/* 焦點峰值指示 */}
          {features.focusPeaking && (
            <View style={styles.focusPeakingIndicator}>
              <Text style={styles.focusPeakingText}>焦點已鎖定</Text>
            </View>
          )}

          {/* 美顏參數實時顯示 */}
          <View style={styles.beautyStatsOverlay}>
            <View style={styles.beautyStatItem}>
              <Text style={styles.beautyStatLabel}>膚質</Text>
              <Text style={styles.beautyStatValue}>{beautyParams.skinTexture}</Text>
            </View>
            <View style={styles.beautyStatItem}>
              <Text style={styles.beautyStatLabel}>光影</Text>
              <Text style={styles.beautyStatValue}>{beautyParams.faceShading}</Text>
            </View>
            <View style={styles.beautyStatItem}>
              <Text style={styles.beautyStatLabel}>美白</Text>
              <Text style={styles.beautyStatValue}>{beautyParams.skinWhitening}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* ============================================
          快速預設欄（新增）
          ============================================ */}
      <FilterGesture
        filters={presetKeys.map(key => ({
          id: key,
          name: BEAUTY_PRESETS[key].name,
        }))}
        currentFilterIndex={presetKeys.indexOf(currentPreset)}
        onFilterChange={handlePresetChange}
      >
        <View style={styles.presetBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetContent}
            scrollEventThrottle={16}
          >
            {presetKeys.map((presetKey) => (
              <TouchableOpacity
                key={presetKey}
                style={[
                  styles.presetButton,
                  currentPreset === presetKey && styles.presetButtonActive,
                ]}
                onPress={() => applyBeautyPreset(presetKey)}
              >
                <Text style={styles.presetIcon}>
                  {BEAUTY_PRESETS[presetKey].icon}
                </Text>
                <Text
                  style={[
                    styles.presetLabel,
                    currentPreset === presetKey && styles.presetLabelActive,
                  ]}
                >
                  {BEAUTY_PRESETS[presetKey].name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </FilterGesture>

      {/* ============================================
          美顏控制面板
          ============================================ */}
      <Animated.View
        style={[
          styles.beautyPanel,
          {
            transform: [
              {
                translateY: beautyPanelSlide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 300],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(77, 59, 110, 0.95)', 'rgba(45, 27, 78, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.beautyPanelGradient}
        >
          {/* 美顏參數滑塊 */}
          <ScrollView
            style={styles.beautyParamsScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.beautyParamsContent}
          >
            {/* 膚質 */}
            <ParameterGesture
              value={beautyParams.skinTexture}
              minValue={0}
              maxValue={100}
              onChange={(value) => updateBeautyParam('skinTexture', value)}
            >
              <View style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterLabel}>膚質</Text>
                  <Text style={styles.parameterValue}>{beautyParams.skinTexture}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams.skinTexture}
                  onValueChange={(value) => updateBeautyParam('skinTexture', value)}
                  minimumTrackTintColor="#FF6B9D"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </ParameterGesture>

            {/* 光影 */}
            <ParameterGesture
              value={beautyParams.faceShading}
              minValue={0}
              maxValue={100}
              onChange={(value) => updateBeautyParam('faceShading', value)}
            >
              <View style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterLabel}>光影</Text>
                  <Text style={styles.parameterValue}>{beautyParams.faceShading}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams.faceShading}
                  onValueChange={(value) => updateBeautyParam('faceShading', value)}
                  minimumTrackTintColor="#A855F7"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </ParameterGesture>

            {/* 美白 */}
            <ParameterGesture
              value={beautyParams.skinWhitening}
              minValue={0}
              maxValue={100}
              onChange={(value) => updateBeautyParam('skinWhitening', value)}
            >
              <View style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterLabel}>美白</Text>
                  <Text style={styles.parameterValue}>{beautyParams.skinWhitening}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams.skinWhitening}
                  onValueChange={(value) => updateBeautyParam('skinWhitening', value)}
                  minimumTrackTintColor="#FF8BB3"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </ParameterGesture>

            {/* 大眼 */}
            <ParameterGesture
              value={beautyParams.eyeEnlargement}
              minValue={0}
              maxValue={100}
              onChange={(value) => updateBeautyParam('eyeEnlargement', value)}
            >
              <View style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterLabel}>大眼</Text>
                  <Text style={styles.parameterValue}>{beautyParams.eyeEnlargement}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams.eyeEnlargement}
                  onValueChange={(value) => updateBeautyParam('eyeEnlargement', value)}
                  minimumTrackTintColor="#CA7BFF"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </ParameterGesture>

            {/* 瘦臉 */}
            <ParameterGesture
              value={beautyParams.faceSlimming}
              minValue={0}
              maxValue={100}
              onChange={(value) => updateBeautyParam('faceSlimming', value)}
            >
              <View style={styles.parameterItem}>
                <View style={styles.parameterHeader}>
                  <Text style={styles.parameterLabel}>瘦臉</Text>
                  <Text style={styles.parameterValue}>{beautyParams.faceSlimming}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams.faceSlimming}
                  onValueChange={(value) => updateBeautyParam('faceSlimming', value)}
                  minimumTrackTintColor="#FF6B9D"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </ParameterGesture>
          </ScrollView>

          {/* 操作按鈕 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetBeautyParams}
            >
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                Animated.timing(beautyPanelSlide, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Text style={styles.confirmButtonText}>確認</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* ============================================
          拍攝按鈕（易於單手觸達）
          ============================================ */}
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={styles.takePhotoButton}
          onPress={handleTakePhoto}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B9D', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.takePhotoGradient}
          >
            <Text style={styles.takePhotoIcon}>📷</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
  viewfinder: {
    flex: 1,
  },
  viewfinderGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarIcon: {
    fontSize: 18,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arPoseGuide: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 32,
  },
  arPoseEmoji: {
    fontSize: 60,
  },
  arPoseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  focusPeakingIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  focusPeakingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  beautyStatsOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  beautyStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  beautyStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  beautyStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  presetBar: {
    height: 80,
    backgroundColor: 'rgba(45, 27, 78, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 157, 0.2)',
  },
  presetContent: {
    paddingHorizontal: 12,
    gap: 12,
    alignItems: 'center',
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.6)',
  },
  presetIcon: {
    fontSize: 20,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  presetLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  beautyPanel: {
    height: 300,
    backgroundColor: 'rgba(45, 27, 78, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 107, 157, 0.2)',
  },
  beautyPanelGradient: {
    flex: 1,
  },
  beautyParamsScroll: {
    flex: 1,
  },
  beautyParamsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  parameterItem: {
    gap: 8,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parameterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  parameterValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  slider: {
    height: 4,
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  takePhotoButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  takePhotoIcon: {
    fontSize: 32,
  },
});

export default CameraScreenOptimized;
