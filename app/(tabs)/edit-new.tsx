/**
 * yanbao AI 编辑模块 (AI Lab)
 * AI 消除 + AI 扩图 + 7 维美颜 + 批量处理
 * 
 * 功能：
 * - AI 消除（LAMA Inpainting）
 * - AI 扩图（Stable Diffusion Outpainting）
 * - 7 维美颜调节
 * - Before/After 对比
 * - 批量处理引擎
 * - 一键出片
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import YanbaoTheme from '@/lib/theme-config';

const { width, height } = Dimensions.get('window');

// ============================================
// 编辑模式
// ============================================
type EditMode = 'removal' | 'outpainting' | 'beauty' | 'batch';

// ============================================
// 编辑参数接口
// ============================================
interface EditParams {
  mode: EditMode;
  quality: number;
  intensity: number;
  processing: boolean;
  progress: number;
}

// ============================================
// 编辑模块组件
// ============================================
export default function EditScreen() {
  const router = useRouter();

  // 编辑状态
  const [editParams, setEditParams] = useState<EditParams>({
    mode: 'removal',
    quality: 80,
    intensity: 50,
    processing: false,
    progress: 0,
  });

  // 对比模式
  const [comparisonMode, setComparisonMode] = useState(false);
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(0.5);

  // 动画值
  const processingOpacity = useRef(new Animated.Value(0)).current;
  const comparisonSlide = useRef(new Animated.Value(0.5)).current;

  // ============================================
  // 处理图像
  // ============================================
  const handleProcessImage = async () => {
    setEditParams(prev => ({ ...prev, processing: true, progress: 0 }));

    // 模拟处理进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setEditParams(prev => ({ ...prev, progress: i }));
    }

    setEditParams(prev => ({ ...prev, processing: false, progress: 100 }));
    Alert.alert('处理完成', '图像已成功处理');
  };

  // ============================================
  // 导出图像
  // ============================================
  const handleExportImage = () => {
    Alert.alert('成功', '图像已导出到相册');
  };

  // ============================================
  // 批量处理
  // ============================================
  const handleBatchProcess = () => {
    router.push('/batch');
  };

  return (
    <LinearGradient
      colors={['#3D2B5E', '#2D1B4E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================
            顶部导航
            ============================================ */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.topNavButton}>← 返回</Text>
          </TouchableOpacity>

          <Text style={styles.topNavTitle}>AI 编辑</Text>

          <TouchableOpacity>
            <Text style={styles.topNavButton}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            Before/After 对比
            ============================================ */}
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonImageContainer}>
            {/* Before 图像 */}
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.comparisonImage,
                {
                  width: comparisonMode ? `${beforeAfterPosition * 100}%` : '100%',
                },
              ]}
            >
              <Text style={styles.comparisonLabel}>BEFORE</Text>
            </LinearGradient>

            {/* After 图像 */}
            <LinearGradient
              colors={['#E8B4F0', '#D4A5E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.comparisonImage,
                {
                  position: 'absolute',
                  width: comparisonMode ? `${(1 - beforeAfterPosition) * 100}%` : '0%',
                  right: 0,
                },
              ]}
            >
              <Text style={styles.comparisonLabel}>AFTER</Text>
            </LinearGradient>

            {/* 对比滑块 */}
            {comparisonMode && (
              <View
                style={[
                  styles.comparisonSlider,
                  { left: `${beforeAfterPosition * 100}%` },
                ]}
              >
                <View style={styles.comparisonSliderLine} />
              </View>
            )}
          </View>

          {/* 对比切换按钮 */}
          <TouchableOpacity
            style={styles.comparisonToggle}
            onPress={() => setComparisonMode(!comparisonMode)}
          >
            <Text style={styles.comparisonToggleText}>
              {comparisonMode ? '关闭对比' : '开启对比'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            功能选项卡
            ============================================ */}
        <View style={styles.modesContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              editParams.mode === 'removal' && styles.modeButtonActive,
            ]}
            onPress={() => setEditParams(prev => ({ ...prev, mode: 'removal' }))}
          >
            <Text style={styles.modeButtonIcon}>🗑️</Text>
            <Text style={styles.modeButtonText}>AI 消除</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              editParams.mode === 'outpainting' && styles.modeButtonActive,
            ]}
            onPress={() => setEditParams(prev => ({ ...prev, mode: 'outpainting' }))}
          >
            <Text style={styles.modeButtonIcon}>📐</Text>
            <Text style={styles.modeButtonText}>AI 扩图</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              editParams.mode === 'beauty' && styles.modeButtonActive,
            ]}
            onPress={() => setEditParams(prev => ({ ...prev, mode: 'beauty' }))}
          >
            <Text style={styles.modeButtonIcon}>✨</Text>
            <Text style={styles.modeButtonText}>美颜</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              editParams.mode === 'batch' && styles.modeButtonActive,
            ]}
            onPress={() => setEditParams(prev => ({ ...prev, mode: 'batch' }))}
          >
            <Text style={styles.modeButtonIcon}>⚡</Text>
            <Text style={styles.modeButtonText}>批量</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================
            参数调整面板
            ============================================ */}
        <View style={styles.paramsPanel}>
          {/* 质量控制 */}
          <View style={styles.paramItem}>
            <View style={styles.paramHeader}>
              <Text style={styles.paramLabel}>处理质量</Text>
              <Text style={styles.paramValue}>{editParams.quality}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={editParams.quality}
              onValueChange={value =>
                setEditParams(prev => ({ ...prev, quality: value }))
              }
              minimumTrackTintColor="#FF6B9D"
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            />
          </View>

          {/* 强度控制 */}
          <View style={styles.paramItem}>
            <View style={styles.paramHeader}>
              <Text style={styles.paramLabel}>处理强度</Text>
              <Text style={styles.paramValue}>{editParams.intensity}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={editParams.intensity}
              onValueChange={value =>
                setEditParams(prev => ({ ...prev, intensity: value }))
              }
              minimumTrackTintColor="#FF6B9D"
              maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            />
          </View>

          {/* 处理进度 */}
          {editParams.processing && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${editParams.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>处理中... {editParams.progress}%</Text>
            </View>
          )}
        </View>

        {/* ============================================
            模式特定选项
            ============================================ */}
        {editParams.mode === 'removal' && (
          <View style={styles.modeOptions}>
            <Text style={styles.modeTitle}>AI 消除选项</Text>
            <Text style={styles.modeDescription}>
              使用 LAMA 算法自动移除不需要的对象，保留完美背景
            </Text>
            <View style={styles.optionsGrid}>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>🎯</Text>
                <Text style={styles.optionText}>精准模式</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>⚡</Text>
                <Text style={styles.optionText}>快速模式</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>🎨</Text>
                <Text style={styles.optionText}>创意模式</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {editParams.mode === 'outpainting' && (
          <View style={styles.modeOptions}>
            <Text style={styles.modeTitle}>AI 扩图选项</Text>
            <Text style={styles.modeDescription}>
              基于 Stable Diffusion 延伸照片边缘，将特写变为广角
            </Text>
            <View style={styles.optionsGrid}>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>🌅</Text>
                <Text style={styles.optionText}>自然风格</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>🎨</Text>
                <Text style={styles.optionText}>艺术风格</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton}>
                <Text style={styles.optionIcon}>✨</Text>
                <Text style={styles.optionText}>超现实</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {editParams.mode === 'beauty' && (
          <View style={styles.modeOptions}>
            <Text style={styles.modeTitle}>7 维美颜调节</Text>
            <Text style={styles.modeDescription}>
              针对骨相进行微调，保留皮肤质感
            </Text>
            <View style={styles.beautyParams}>
              {[
                { label: '肤质', value: 45 },
                { label: '光影', value: 38 },
                { label: '骨相', value: 25 },
                { label: '色彩', value: 50 },
                { label: '美白', value: 42 },
                { label: '大眼', value: 30 },
                { label: '瘦脸', value: 28 },
              ].map((param, index) => (
                <View key={index} style={styles.beautyParam}>
                  <Text style={styles.beautyParamLabel}>{param.label}</Text>
                  <View style={styles.beautyParamBar}>
                    <View
                      style={[
                        styles.beautyParamBarFill,
                        { width: `${param.value}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.beautyParamValue}>{param.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {editParams.mode === 'batch' && (
          <View style={styles.modeOptions}>
            <Text style={styles.modeTitle}>批量处理</Text>
            <Text style={styles.modeDescription}>
              一键套用相同的 LUT 预设和水印到多张照片
            </Text>
            <TouchableOpacity
              style={styles.batchButton}
              onPress={handleBatchProcess}
            >
              <LinearGradient
                colors={['#FF6B9D', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.batchButtonGradient}
              >
                <Text style={styles.batchButtonIcon}>📦</Text>
                <Text style={styles.batchButtonText}>进入批量处理</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================
            底部操作按钮
            ============================================ */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleProcessImage}
            disabled={editParams.processing}
          >
            <LinearGradient
              colors={['#FF6B9D', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButtonGradient}
            >
              {editParams.processing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.actionButtonIcon}>⚡</Text>
                  <Text style={styles.actionButtonText}>处理图像</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportImage}
          >
            <LinearGradient
              colors={['#E8B4F0', '#D4A5E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonIcon}>💾</Text>
              <Text style={styles.actionButtonText}>一键出片</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// 样式定义
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: 12,
  },

  // 顶部导航
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  topNavButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  topNavTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Before/After 对比
  comparisonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  comparisonImageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },

  comparisonImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  comparisonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  comparisonSlider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFFFFF',
  },

  comparisonSliderLine: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  comparisonToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    alignItems: 'center',
  },

  comparisonToggleText: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '600',
  },

  // 功能选项卡
  modesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },

  modeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  modeButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderColor: '#FF6B9D',
  },

  modeButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  modeButtonText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 参数面板
  paramsPanel: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  paramItem: {
    marginBottom: 16,
  },

  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  paramLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  paramValue: {
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '700',
  },

  slider: {
    width: '100%',
    height: 6,
  },

  // 进度条
  progressContainer: {
    marginTop: 12,
  },

  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 2,
  },

  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // 模式选项
  modeOptions: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  modeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  modeDescription: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 12,
  },

  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  optionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },

  optionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  optionText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // 美颜参数
  beautyParams: {
    marginTop: 12,
  },

  beautyParam: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  beautyParamLabel: {
    width: 40,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  beautyParamBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 8,
  },

  beautyParamBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 2,
  },

  beautyParamValue: {
    width: 30,
    fontSize: 12,
    color: '#FF6B9D',
    fontWeight: '700',
    textAlign: 'right',
  },

  // 批量处理
  batchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },

  batchButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  batchButtonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  batchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 操作按钮
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },

  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  actionButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
