/**
 * yanbao AI - 相机屏幕
 * 
 * 集成 MasterSliderBar，底部横向滚动的 29 个大师参数滑块
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  NativeModules,
  ActivityIndicator,
  Alert,
  useCameraPermission,
} from 'react-native';
import MasterSliderBar from '../components/MasterSliderBar';

interface CameraScreenProps {
  navigation?: any;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // 处理参数变化
  const handleParamChange = (paramId: string, value: number) => {
    console.log(`✅ 参数更新: ${paramId} = ${value}`);
    
    // 调用原生模块
    if (NativeModules.MasterModule?.updateParam) {
      NativeModules.MasterModule.updateParam(paramId, value).catch((error: any) => {
        console.error(`❌ 参数应用失败:`, error);
      });
    }
  };

  // 打开相机
  const handleOpenCamera = async () => {
    setIsLoading(true);
    try {
      // 调用原生相机模块
      if (NativeModules.CameraModule?.openCamera) {
        await NativeModules.CameraModule.openCamera();
        setCameraActive(true);
      } else {
        Alert.alert('提示', '相机模块正在开发中');
      }
    } catch (error) {
      console.error('❌ 打开相机失败:', error);
      Alert.alert('错误', '无法打开相机');
    } finally {
      setIsLoading(false);
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    try {
      if (NativeModules.CameraModule?.takePhoto) {
        const photo = await NativeModules.CameraModule.takePhoto();
        console.log('✅ 拍照成功:', photo);
        Alert.alert('成功', '照片已保存');
      } else {
        Alert.alert('提示', '拍照功能正在开发中');
      }
    } catch (error) {
      console.error('❌ 拍照失败:', error);
      Alert.alert('错误', '拍照失败');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>yanbao AI</Text>
        <Text style={styles.subtitle}>大师级摄影相机</Text>
      </View>

      {/* 相机预览区域 */}
      <View style={styles.cameraPreview}>
        {cameraActive ? (
          <Text style={styles.cameraPlaceholder}>📷 相机预览</Text>
        ) : (
          <>
            <Text style={styles.cameraPlaceholder}>📷 相机预览区域</Text>
            <Text style={styles.cameraHint}>点击下方"打开相机"按钮启动</Text>
          </>
        )}
      </View>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleOpenCamera}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>打开相机</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleTakePhoto}
        >
          <Text style={styles.buttonText}>拍照</Text>
        </TouchableOpacity>
      </View>

      {/* 底部大师滑块条 */}
      <MasterSliderBar onParamChange={handleParamChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'PingFang SC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PingFang SC',
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cameraPlaceholder: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'PingFang SC',
    marginBottom: 8,
  },
  cameraHint: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'PingFang SC',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
  },
  secondaryButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'PingFang SC',
  },
});

export default CameraScreen;
