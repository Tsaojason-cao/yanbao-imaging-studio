import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { theme } from '../config/theme';

const { width, height } = Dimensions.get('window');

interface CameraScreenProps {
  navigation: any;
}

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.front);
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isReady) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        });
        
        // 导航到编辑页面
        navigation.navigate('Edit', { photoUri: photo.uri });
      } catch (error) {
        console.error('拍照失败:', error);
      }
    }
  };

  const toggleCameraType = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>请求相机权限中...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>没有相机权限</Text>
        <Text style={styles.subMessage}>
          请在设置中允许访问相机
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        onCameraReady={() => setIsReady(true)}
      >
        {/* 顶部工具栏 */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>雁宝相机</Text>
          
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <Text style={styles.flipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* 底部控制栏 */}
        <View style={styles.bottomBar}>
          {/* 相册按钮 */}
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => navigation.navigate('Gallery')}
          >
            <Text style={styles.galleryIcon}>🖼️</Text>
          </TouchableOpacity>

          {/* 拍照按钮 */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={!isReady}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {/* 预设按钮 */}
          <TouchableOpacity
            style={styles.presetsButton}
            onPress={() => navigation.navigate('Presets')}
          >
            <Text style={styles.presetsIcon}>💜</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subMessage: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  camera: {
    flex: 1,
    width: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.xl,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryIcon: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: theme.colors.text,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.text,
  },
  presetsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsIcon: {
    fontSize: 24,
  },
});
