import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { theme } from '../config/theme';
import { BeautyParams, DEFAULT_BEAUTY_PARAMS } from '../types/beauty';
import BeautyRenderer from '../components/BeautyRenderer';

const { width, height } = Dimensions.get('window');

interface EditScreenProps {
  navigation: any;
  route: {
    params: {
      photoUri: string;
    };
  };
}

export default function EditScreen({ navigation, route }: EditScreenProps) {
  const { photoUri } = route.params;
  const [beautyParams, setBeautyParams] = useState<BeautyParams>(DEFAULT_BEAUTY_PARAMS);
  const [showComparison, setShowComparison] = useState(false);

  const beautyControls = [
    { key: 'smoothing', label: '磨皮', icon: '✨', color: theme.colors.primary },
    { key: 'whitening', label: '美白', icon: '🌟', color: theme.colors.secondary },
    { key: 'faceSlim', label: '瘦脸', icon: '💫', color: theme.colors.accent },
    { key: 'eyeEnlarge', label: '大眼', icon: '👁️', color: theme.colors.primary },
    { key: 'brightness', label: '亮度', icon: '☀️', color: theme.colors.secondary },
    { key: 'contrast', label: '对比度', icon: '🎨', color: theme.colors.accent },
    { key: 'saturation', label: '饱和度', icon: '🌈', color: theme.colors.primary },
  ];

  const handleParamChange = (key: keyof BeautyParams, value: number) => {
    setBeautyParams(prev => ({ ...prev, [key]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const resetParams = () => {
    setBeautyParams(DEFAULT_BEAUTY_PARAMS);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const savePhoto = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: 保存照片到相册
    alert('照片已保存！');
    navigation.navigate('Gallery');
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
        
        <Text style={styles.title}>美颜编辑</Text>
        
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetParams}
        >
          <Text style={styles.resetIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* 照片预览区域 */}
      <View style={styles.previewContainer}>
        {showComparison ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        ) : (
          <BeautyRenderer
            imageUri={photoUri}
            beautyParams={beautyParams}
            style={styles.previewImage}
          />
        )}
        
        {/* 前后对比按钮 */}
        <TouchableOpacity
          style={styles.compareButton}
          onPressIn={() => {
            setShowComparison(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          onPressOut={() => setShowComparison(false)}
        >
          <Text style={styles.compareText}>
            {showComparison ? '原图' : '长按对比'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 美颜参数控制区域 */}
      <View style={styles.controlsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.controlsScroll}
        >
          {beautyControls.map(control => (
            <View key={control.key} style={styles.controlItem}>
              <View style={styles.controlHeader}>
                <Text style={styles.controlIcon}>{control.icon}</Text>
                <Text style={styles.controlLabel}>{control.label}</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={beautyParams[control.key as keyof BeautyParams]}
                  onValueChange={value =>
                    handleParamChange(control.key as keyof BeautyParams, value)
                  }
                  minimumTrackTintColor={control.color}
                  maximumTrackTintColor={theme.colors.surface}
                  thumbTintColor={control.color}
                />
                <Text style={styles.valueText}>
                  {Math.round(beautyParams[control.key as keyof BeautyParams])}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.presetButton}
          onPress={() => navigation.navigate('Presets')}
        >
          <Text style={styles.presetIcon}>💜</Text>
          <Text style={styles.buttonText}>预设</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePhoto}
        >
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => alert('分享功能开发中...')}
        >
          <Text style={styles.shareIcon}>📤</Text>
          <Text style={styles.buttonText}>分享</Text>
        </TouchableOpacity>
      </View>
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
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    fontSize: 20,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  previewImage: {
    width: width - theme.spacing.lg * 2,
    height: (width - theme.spacing.lg * 2) * 1.33,
    borderRadius: theme.borderRadius.lg,
  },
  compareButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.borderRadius.md,
  },
  compareText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  controlsContainer: {
    paddingVertical: theme.spacing.lg,
  },
  controlsScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  controlItem: {
    width: 100,
    alignItems: 'center',
  },
  controlHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
    paddingTop: theme.spacing.md,
  },
  presetButton: {
    alignItems: 'center',
    gap: 4,
  },
  presetIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.md,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  shareButton: {
    alignItems: 'center',
    gap: 4,
  },
  shareIcon: {
    fontSize: 24,
  },
});
