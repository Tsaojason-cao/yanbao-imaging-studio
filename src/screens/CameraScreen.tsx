/**
 * 相机屏幕 - Camera Screen
 * 调用原生 CameraModule
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  NativeModules,
  Alert,
} from 'react-native';

// 导入原生模块
const {CameraModule, BeautyModule} = NativeModules;

const CameraScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  const [beautyLevel, setBeautyLevel] = useState(80);
  const [whitenLevel, setWhitenLevel] = useState(60);
  const [cameraActive, setCameraActive] = useState(false);

  // 打开相机
  const handleOpenCamera = async () => {
    try {
      if (CameraModule) {
        const result = await CameraModule.openCamera({
          facing: 'front',
          beautyLevel: beautyLevel,
          whitenLevel: whitenLevel,
        });
        setCameraActive(true);
        console.log('相机已打开:', result);
      } else {
        Alert.alert('提示', '原生相机模块尚未实现\n将在 Day 4-5 完成');
      }
    } catch (error) {
      console.error('相机错误:', error);
      Alert.alert('错误', '无法打开相机');
    }
  };

  // 拍照
  const handleCapture = async () => {
    try {
      if (CameraModule) {
        const result = await CameraModule.capturePhoto();
        Alert.alert('成功', `照片已保存: ${result}`);
      } else {
        Alert.alert('提示', '拍照功能将在原生模块中实现');
      }
    } catch (error) {
      console.error('拍照错误:', error);
    }
  };

  // 应用美颜
  const handleApplyBeauty = async (level: number) => {
    try {
      if (BeautyModule) {
        await BeautyModule.applyBeauty(level);
        setBeautyLevel(level);
      } else {
        setBeautyLevel(level);
        console.log('美颜级别:', level);
      }
    } catch (error) {
      console.error('美颜错误:', error);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>美颜相机</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          专业美颜相机
        </Text>
      </View>

      {/* 相机预览区域 */}
      <View style={[styles.preview, {backgroundColor: colors.surface}]}>
        <Text style={[styles.previewText, {color: colors.textSecondary}]}>
          {cameraActive ? '📷 相机预览' : '📷 点击下方按钮打开相机'}
        </Text>
        <Text style={[styles.previewHint, {color: colors.textSecondary}]}>
          原生 Camera2 API + NPU 加速
        </Text>
      </View>

      {/* 美颜控制 */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, {color: colors.text}]}>
            美颜: {beautyLevel}
          </Text>
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, {backgroundColor: colors.primary}]}
              onPress={() => handleApplyBeauty(Math.max(0, beautyLevel - 10))}>
              <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, {backgroundColor: colors.primary}]}
              onPress={() => handleApplyBeauty(Math.min(100, beautyLevel + 10))}>
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, {color: colors.text}]}>
            美白: {whitenLevel}
          </Text>
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, {backgroundColor: colors.secondary}]}
              onPress={() => setWhitenLevel(Math.max(0, whitenLevel - 10))}>
              <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, {backgroundColor: colors.secondary}]}
              onPress={() => setWhitenLevel(Math.min(100, whitenLevel + 10))}>
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.primary}]}
          onPress={handleOpenCamera}>
          <Text style={styles.actionButtonText}>
            {cameraActive ? '🔄 切换相机' : '📷 打开相机'}
          </Text>
        </TouchableOpacity>

        {cameraActive && (
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.secondary}]}
            onPress={handleCapture}>
            <Text style={styles.actionButtonText}>📸 拍照</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 提示信息 */}
      <View style={styles.info}>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          💡 原生模块状态: {CameraModule ? '✅ 已集成' : '⏳ 待实现'}
        </Text>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          🚀 硬件加速: NPU + GPU
        </Text>
      </View>
    </View>
  );
};

const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A2E',
  textSecondary: '#666666',
  primary: '#A33BFF',
  secondary: '#FF69B4',
};

const darkColors = {
  background: '#1A1A2E',
  surface: '#16213E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#A33BFF',
  secondary: '#FF69B4',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  preview: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  previewText: {
    fontSize: 24,
    marginBottom: 8,
  },
  previewHint: {
    fontSize: 12,
  },
  controls: {
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default CameraScreen;
