import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function CameraScreen({ onClose, onPhotoTaken }: any) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const camera = useRef<Camera>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Beauty filter settings
  const [beautyLevel, setBeautyLevel] = useState(50);
  const [whiteningLevel, setWhiteningLevel] = useState(30);
  
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    if (!camera.current) return;
    
    setIsLoading(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });
      
      Alert.alert('照片已拍摄', `路径: ${photo.path}`);
      
      if (onPhotoTaken) {
        onPhotoTaken(photo);
      }
    } catch (error) {
      Alert.alert('错误', '拍照失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>需要相机权限</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A33BFF" />
        <Text style={styles.loadingText}>加载相机...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ProCam Beauty</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Beauty Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>美颜</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${beautyLevel}%`, backgroundColor: '#A33BFF' }
                ]} 
              />
            </View>
            <Text style={styles.controlValue}>{beautyLevel}</Text>
          </View>
        </View>
        
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>美白</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${whiteningLevel}%`, backgroundColor: '#FF69B4' }
                ]} 
              />
            </View>
            <Text style={styles.controlValue}>{whiteningLevel}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeText}>滤镜</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={takePhoto}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.modeButton}>
          <Text style={styles.modeText}>翻转</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  controlsContainer: {
    position: 'absolute',
    right: 20,
    top: '30%',
    gap: 20,
  },
  controlRow: {
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderTrack: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 25,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 30,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modeButton: {
    padding: 10,
  },
  modeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A33BFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
});
