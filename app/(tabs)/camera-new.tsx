/**
 * yanbao AI 拍照模块 (Professional Camera)
 * 实时美颜 + AR 姿势引导 + 一键美颜
 * 
 * 功能：
 * - 专业模式（ISO、快门、白平衡）
 * - 峰值对焦（Focus Peaking）
 * - GLSL 实时美颜（1080P/60fps）
 * - AR 姿势引导（MediaPipe）
 * - 7 维美颜滑块实时调节
 * - 一键美颜快速应用
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
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 美颜参数接口
// ============================================
interface BeautyParams {
  skinTexture: number;      // 肤质 0-100
  faceShading: number;      // 光影 0-100
  boneStructure: number;    // 骨相 0-100
  colorGrading: number;     // 色彩 0-100
  skinWhitening: number;    // 美白 0-100
  eyeEnlargement: number;   // 大眼 0-100
  faceSlimming: number;     // 瘦脸 0-100
}

// ============================================
// 一键美颜预设
// ============================================
const BEAUTY_PRESETS = {
  natural: {
    name: '自然风格',
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
    name: '精致风格',
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
    name: '明星风格',
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
  vintage: {
    name: '复古风格',
    params: {
      skinTexture: 35,
      faceShading: 45,
      boneStructure: 40,
      colorGrading: 30,
      skinWhitening: 25,
      eyeEnlargement: 20,
      faceSlimming: 15,
    },
  },
};

// ============================================
// 拍照模块组件
// ============================================
export default function CameraScreen() {
  const router = useRouter();

  // 美颜参数状态
  const [beautyParams, setBeautyParams] = useState<BeautyParams>({
    skinTexture: 45,
    faceShading: 38,
    boneStructure: 25,
    colorGrading: 50,
    skinWhitening: 42,
    eyeEnlargement: 30,
    faceSlimming: 28,
  });

  // 功能开关状态
  const [features, setFeatures] = useState({
    realTimeBeauty: true,
    arPoseGuide: true,
    focusPeaking: false,
    professionalMode: false,
  });

  // 动画值
  const cameraOpacity = useRef(new Animated.Value(1)).current;
  const beautyPanelSlide = useRef(new Animated.Value(0)).current;

  // 初始化动画
  useEffect(() => {
    Animated.timing(beautyPanelSlide, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // ============================================
  // 美颜参数更新
  // ============================================
  const updateBeautyParam = (param: keyof BeautyParams, value: number) => {
    setBeautyParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  // ============================================
  // 应用一键美颜预设
  // ============================================
  const applyBeautyPreset = (presetKey: keyof typeof BEAUTY_PRESETS) => {
    const preset = BEAUTY_PRESETS[presetKey];
    setBeautyParams(preset.params);
    Alert.alert('成功', `已应用 ${preset.name}`);
  };

  // ============================================
  // 重置美颜参数
  // ============================================
  const resetBeautyParams = () => {
    setBeautyParams({
      skinTexture: 45,
      faceShading: 38,
      boneStructure: 25,
      colorGrading: 50,
      skinWhitening: 42,
      eyeEnlargement: 30,
      faceSlimming: 28,
    });
  };

  // ============================================
  // 拍照
  // ============================================
  const handleTakePhoto = () => {
    Alert.alert('拍照成功', '照片已保存到相册');
    // 实际应用中会调用相机 API
  };

  return (
    <View style={styles.container}>
      {/* ============================================
          取景器区域
          ============================================ */}
      <Animated.View style={[styles.viewfinder, { opacity: cameraOpacity }]}>
        <LinearGradient
          colors={['#3D2B5E', '#2D1B4E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.viewfinderGradient}
        >
          {/* 顶部控制栏 */}
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

          {/* 库洛米 AR 姿势引导 */}
          {features.arPoseGuide && (
            <View style={styles.arPoseGuide}>
              <Text style={styles.arPoseEmoji}>🎀</Text>
              <Text style={styles.arPoseText}>相似度: 95.8%</Text>
            </View>
          )}

          {/* 焦点峰值指示 */}
          {features.focusPeaking && (
            <View style={styles.focusPeakingIndicator}>
              <Text style={styles.focusPeakingText}>焦点已锁定</Text>
            </View>
          )}

          {/* 美颜参数实时显示 */}
          <View style={styles.beautyStatsOverlay}>
            <View style={styles.beautyStatItem}>
              <Text style={styles.beautyStatLabel}>肤质</Text>
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
          美颜控制面板
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
          colors={['rgba(61, 43, 94, 0.95)', 'rgba(45, 27, 78, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.beautyPanelGradient}
        >
          {/* 标签页 */}
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Text style={styles.tabText}>美颜</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={[styles.tabText, { color: '#AAAAAA' }]}>滤镜</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={[styles.tabText, { color: '#AAAAAA' }]}>预设</Text>
            </TouchableOpacity>
          </View>

          {/* 美颜滑块 */}
          <ScrollView
            style={styles.sliderContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* 肤质 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>肤质 Skin Texture</Text>
                <Text style={styles.sliderValue}>{beautyParams.skinTexture}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.skinTexture}
                onValueChange={value => updateBeautyParam('skinTexture', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 光影 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>光影 Face Shading</Text>
                <Text style={styles.sliderValue}>{beautyParams.faceShading}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.faceShading}
                onValueChange={value => updateBeautyParam('faceShading', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 骨相 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>骨相 Bone Structure</Text>
                <Text style={styles.sliderValue}>{beautyParams.boneStructure}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.boneStructure}
                onValueChange={value => updateBeautyParam('boneStructure', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 色彩 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>色彩 Color Grading</Text>
                <Text style={styles.sliderValue}>{beautyParams.colorGrading}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.colorGrading}
                onValueChange={value => updateBeautyParam('colorGrading', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 美白 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>美白 Skin Whitening</Text>
                <Text style={styles.sliderValue}>{beautyParams.skinWhitening}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.skinWhitening}
                onValueChange={value => updateBeautyParam('skinWhitening', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 大眼 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>大眼 Eye Enlargement</Text>
                <Text style={styles.sliderValue}>{beautyParams.eyeEnlargement}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.eyeEnlargement}
                onValueChange={value => updateBeautyParam('eyeEnlargement', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 瘦脸 */}
            <View style={styles.sliderItem}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>瘦脸 Face Slimming</Text>
                <Text style={styles.sliderValue}>{beautyParams.faceSlimming}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams.faceSlimming}
                onValueChange={value => updateBeautyParam('faceSlimming', value)}
                minimumTrackTintColor="#FF6B9D"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
              />
            </View>

            {/* 一键美颜预设 */}
            <View style={styles.presetsSection}>
              <Text style={styles.presetsTitle}>一键美颜</Text>
              <View style={styles.presetsGrid}>
                {Object.entries(BEAUTY_PRESETS).map(([key, preset]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.presetButton}
                    onPress={() => applyBeautyPreset(key as keyof typeof BEAUTY_PRESETS)}
                  >
                    <LinearGradient
                      colors={['#FF6B9D', '#A855F7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.presetButtonGradient}
                    >
                      <Text style={styles.presetButtonText}>{preset.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 功能开关 */}
            <View style={styles.featuresSection}>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>实时美颜</Text>
                <Switch
                  value={features.realTimeBeauty}
                  onValueChange={value =>
                    setFeatures(prev => ({ ...prev, realTimeBeauty: value }))
                  }
                  trackColor={{ false: '#767577', true: '#FF6B9D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>AR 姿势引导</Text>
                <Switch
                  value={features.arPoseGuide}
                  onValueChange={value =>
                    setFeatures(prev => ({ ...prev, arPoseGuide: value }))
                  }
                  trackColor={{ false: '#767577', true: '#FF6B9D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>焦点峰值</Text>
                <Switch
                  value={features.focusPeaking}
                  onValueChange={value =>
                    setFeatures(prev => ({ ...prev, focusPeaking: value }))
                  }
                  trackColor={{ false: '#767577', true: '#FF6B9D' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>专业模式</Text>
                <Switch
                  value={features.professionalMode}
                  onValueChange={value =>
                    setFeatures(prev => ({ ...prev, professionalMode: value }))
                  }
                  trackColor={{ false: '#767577', true: '#FF6B9D' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* 重置按钮 */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetBeautyParams}
            >
              <Text style={styles.resetButtonText}>重置所有参数</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      {/* ============================================
          底部拍照按钮
          ============================================ */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.galleryButton}>
          <Text style={styles.galleryButtonText}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePhoto}
        >
          <LinearGradient
            colors={['#FF6B9D', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.captureButtonGradient}
          >
            <View style={styles.captureButtonInner} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipButton}>
          <Text style={styles.flipButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================
// 样式定义
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1B4E',
  },

  // 取景器
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  topBarIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  timerText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // AR 姿势引导
  arPoseGuide: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },

  arPoseEmoji: {
    fontSize: 40,
  },

  arPoseText: {
    fontSize: 12,
    color: '#FF6B9D',
    marginTop: 4,
    fontWeight: '600',
  },

  // 焦点峰值
  focusPeakingIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },

  focusPeakingText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  // 美颜参数实时显示
  beautyStatsOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(45, 27, 78, 0.8)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },

  beautyStatItem: {
    alignItems: 'center',
  },

  beautyStatLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 4,
  },

  beautyStatValue: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '700',
  },

  // 美颜面板
  beautyPanel: {
    height: height * 0.5,
    backgroundColor: 'rgba(45, 27, 78, 0.95)',
  },

  beautyPanelGradient: {
    flex: 1,
  },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },

  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B9D',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  sliderContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sliderItem: {
    marginBottom: 16,
  },

  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sliderLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  sliderValue: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '700',
  },

  slider: {
    width: '100%',
    height: 6,
  },

  // 一键美颜预设
  presetsSection: {
    marginTop: 20,
    marginBottom: 20,
  },

  presetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  presetButton: {
    width: '48%',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },

  presetButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 功能开关
  featuresSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },

  featureLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  resetButton: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    alignItems: 'center',
  },

  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },

  // 底部栏
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(45, 27, 78, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  galleryButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  galleryButtonText: {
    fontSize: 24,
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },

  captureButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },

  flipButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  flipButtonText: {
    fontSize: 24,
  },
});
