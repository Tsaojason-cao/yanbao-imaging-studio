import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VideoRecorderProps {
  onRecordingComplete: (videoUri: string) => void;
  onCancel?: () => void;
}

type VideoQuality = '1080p' | '4k';
type CameraFacing = 'front' | 'back';

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onRecordingComplete,
  onCancel
}) => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('1080p');
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>('front');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 请求权限
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    // 请求音频权限
    Audio.requestPermissionsAsync();
  }, [permission]);

  // 更新录制时间
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  // 开始录制
  const handleStartRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      const video = await (cameraRef.current as any).recordAsync({
        quality: videoQuality === '4k' ? '4:3' : '16:9',
        maxDuration: 300, // 5分钟
        mute: false
      });

      setIsProcessing(true);
      onRecordingComplete(video.uri);
      setIsProcessing(false);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
    }
  };

  // 停止录制
  const handleStopRecording = async () => {
    if ((cameraRef.current as any) && isRecording) {
      await (cameraRef.current as any).stopRecording();
      setIsRecording(false);
    }
  };

  // 切换摄像头
  const handleToggleCamera = () => {
    setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* 摄像头预览 */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraFacing}
        videoStabilizationMode="auto"
      />

      {/* 质量选择 */}
      <View style={styles.topControls}>
        <View style={styles.qualityButtons}>
          {(['1080p', '4k'] as VideoQuality[]).map((quality) => (
            <TouchableOpacity
              key={quality}
              onPress={() => setVideoQuality(quality)}
              style={[
                styles.qualityButton,
                videoQuality === quality && styles.qualityButtonActive
              ]}
            >
              <Text
                style={[
                  styles.qualityButtonText,
                  videoQuality === quality && styles.qualityButtonTextActive
                ]}
              >
                {quality}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 录制时间显示 */}
      {isRecording && (
        <View style={styles.recordingTime}>
          <View style={styles.recordingIndicator} />
          <Text style={styles.recordingTimeText}>{formatTime(recordingTime)}</Text>
        </View>
      )}

      {/* 底部控制 */}
      <View style={styles.bottomControls}>
        {/* 切换摄像头按钮 */}
        <TouchableOpacity
          onPress={handleToggleCamera}
          style={styles.controlButton}
          disabled={isRecording}
        >
          <MaterialCommunityIcons
            name="camera-flip"
            size={28}
            color="white"
          />
        </TouchableOpacity>

        {/* 录制按钮 */}
        <TouchableOpacity
          onPress={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" size="large" />
          ) : isRecording ? (
            <View style={styles.recordButtonStop} />
          ) : (
            <View style={styles.recordButtonStart} />
          )}
        </TouchableOpacity>

        {/* 取消按钮 */}
        <TouchableOpacity
          onPress={onCancel}
          style={styles.controlButton}
          disabled={isRecording}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  camera: {
    flex: 1
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50
  },
  permissionButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    alignItems: 'center'
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  topControls: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 8
  },
  qualityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  qualityButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed'
  },
  qualityButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  qualityButtonTextActive: {
    color: '#fff'
  },
  recordingTime: {
    position: 'absolute',
    top: 60,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 10
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    animation: 'pulse'
  },
  recordingTimeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  recordButtonActive: {
    backgroundColor: '#ef4444'
  },
  recordButtonStart: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff'
  },
  recordButtonStop: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#fff'
  }
});
