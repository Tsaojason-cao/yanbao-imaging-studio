import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas, Line, Circle, Group, Paint } from '@shopify/react-native-skia';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface PoseTemplate {
  id: string;
  name: string;
  description: string;
  image?: string;
  tips: string[];
}

interface PoseGuideProps {
  onPoseDetected?: (landmarks: Landmark[]) => void;
  onCapture?: () => void;
}

// 姿势模板库
const POSE_TEMPLATES: PoseTemplate[] = [
  {
    id: 'standing-straight',
    name: 'Standing Straight',
    description: 'Stand with shoulders back, chin slightly down',
    tips: [
      'Keep shoulders relaxed',
      'Engage core',
      'Look slightly above camera',
      'Weight on both feet'
    ]
  },
  {
    id: 'side-profile',
    name: 'Side Profile',
    description: 'Turn 45 degrees to the side',
    tips: [
      'Angle body at 45 degrees',
      'Extend neck slightly',
      'Relax shoulders',
      'Look at camera'
    ]
  },
  {
    id: 'three-quarter',
    name: 'Three Quarter',
    description: 'Turn 30 degrees to the side',
    tips: [
      'Slight body turn',
      'Both shoulders visible',
      'Natural arm position',
      'Engage with camera'
    ]
  },
  {
    id: 'sitting',
    name: 'Sitting',
    description: 'Sit with good posture',
    tips: [
      'Back straight',
      'Lean slightly forward',
      'Hands on lap or armrest',
      'Chin parallel to ground'
    ]
  },
  {
    id: 'lying-down',
    name: 'Lying Down',
    description: 'Lie down naturally',
    tips: [
      'Support head with hand',
      'Relax shoulders',
      'Natural leg position',
      'Look at camera'
    ]
  }
];

// 骨架连接点
const SKELETON_CONNECTIONS = [
  [11, 12], // 肩膀
  [11, 13], [13, 15], // 左臂
  [12, 14], [14, 16], // 右臂
  [11, 23], [12, 24], // 躯干
  [23, 24], // 腰部
  [23, 25], [25, 27], // 左腿
  [24, 26], [26, 28] // 右腿
];

export const PoseGuide: React.FC<PoseGuideProps> = ({
  onPoseDetected,
  onCapture
}) => {
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PoseTemplate | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [poseQuality, setPoseQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('fair');

  // 请求权限
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // 模拟姿势检测（实际应使用MediaPipe）
  useEffect(() => {
    const interval = setInterval(() => {
      // 这里应该集成MediaPipe进行实际的姿势检测
      // 现在使用模拟数据
      const mockLandmarks = generateMockLandmarks();
      setLandmarks(mockLandmarks);

      if (onPoseDetected) {
        onPoseDetected(mockLandmarks);
      }

      // 评估姿势质量
      evaluatePoseQuality(mockLandmarks);
    }, 100);

    return () => clearInterval(interval);
  }, [onPoseDetected]);

  // 生成模拟的关键点数据
  const generateMockLandmarks = (): Landmark[] => {
    const landmarks: Landmark[] = [];
    for (let i = 0; i < 33; i++) {
      landmarks.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.5,
        visibility: Math.random() > 0.1 ? 1 : 0
      });
    }
    return landmarks;
  };

  // 评估姿势质量
  const evaluatePoseQuality = (lms: Landmark[]) => {
    if (lms.length === 0) return;

    // 计算可见关键点的比例
    const visibleCount = lms.filter((l) => l.visibility > 0.5).length;
    const visibilityRatio = visibleCount / lms.length;

    if (visibilityRatio > 0.9) {
      setPoseQuality('excellent');
    } else if (visibilityRatio > 0.75) {
      setPoseQuality('good');
    } else if (visibilityRatio > 0.6) {
      setPoseQuality('fair');
    } else {
      setPoseQuality('poor');
    }
  };

  // 绘制骨架
  const renderSkeleton = () => {
    if (landmarks.length === 0 || !showSkeleton) return null;

    const { width, height } = Dimensions.get('window');
    const paint = new Paint();
    paint.setColor('#7c3aed');

    return (
      <Canvas ref={canvasRef} style={styles.skeleton}>
        <Group>
          {/* 绘制连接线 */}
          {SKELETON_CONNECTIONS.map(([startIdx, endIdx], idx) => {
            const startLandmark = landmarks[startIdx];
            const endLandmark = landmarks[endIdx];

            if (!startLandmark || !endLandmark || startLandmark.visibility < 0.5 || endLandmark.visibility < 0.5) {
              return null;
            }

            return (
              <Line
                key={`line-${idx}`}
                p1={{
                  x: startLandmark.x * width,
                  y: startLandmark.y * height
                }}
                p2={{
                  x: endLandmark.x * width,
                  y: endLandmark.y * height
                }}
                paint={paint}
                strokeWidth={2}
              />
            );
          })}

          {/* 绘制关键点 */}
          {landmarks.map((landmark, idx) => {
            if (landmark.visibility < 0.5) return null;

            return (
              <Circle
                key={`circle-${idx}`}
                cx={landmark.x * width}
                cy={landmark.y * height}
                r={4}
                paint={paint}
              />
            );
          })}
        </Group>
      </Canvas>
    );
  };

  // 获取姿势质量颜色
  const getPoseQualityColor = () => {
    switch (poseQuality) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'fair':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
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

  return (
    <View style={styles.container}>
      {/* 摄像头预览 */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      {/* 骨架叠加 */}
      {renderSkeleton()}

      {/* 姿势质量指示器 */}
      <View style={styles.qualityIndicator}>
        <View
          style={[
            styles.qualityDot,
            { backgroundColor: getPoseQualityColor() }
          ]}
        />
        <Text style={styles.qualityText}>
          {poseQuality.charAt(0).toUpperCase() + poseQuality.slice(1)}
        </Text>
      </View>

      {/* 骨架显示切换 */}
      <TouchableOpacity
        style={styles.skeletonToggle}
        onPress={() => setShowSkeleton(!showSkeleton)}
      >
        <MaterialCommunityIcons
          name={showSkeleton ? 'eye' : 'eye-off'}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {/* 姿势模板 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.templatesContainer}
      >
        {POSE_TEMPLATES.map((template) => (
          <TouchableOpacity
            key={template.id}
            onPress={() => setSelectedTemplate(template)}
            style={[
              styles.templateButton,
              selectedTemplate?.id === template.id && styles.templateButtonActive
            ]}
          >
            <MaterialCommunityIcons
              name="human"
              size={24}
              color={selectedTemplate?.id === template.id ? '#7c3aed' : '#fff'}
            />
            <Text
              style={[
                styles.templateButtonText,
                selectedTemplate?.id === template.id && styles.templateButtonTextActive
              ]}
            >
              {template.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 姿势提示 */}
      {selectedTemplate && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>{selectedTemplate.name}</Text>
          <Text style={styles.tipsDescription}>{selectedTemplate.description}</Text>
          <View style={styles.tipsList}>
            {selectedTemplate.tips.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color="#7c3aed"
                />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 拍摄按钮 */}
      <TouchableOpacity
        style={styles.captureButton}
        onPress={onCapture}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <View style={styles.captureButtonInner} />
        )}
      </TouchableOpacity>
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
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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
  qualityIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 10
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  qualityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  skeletonToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  templatesContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    maxHeight: 80
  },
  templateButton: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  templateButtonActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderColor: '#7c3aed'
  },
  templateButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500'
  },
  templateButtonTextActive: {
    color: '#7c3aed'
  },
  tipsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    padding: 12,
    maxHeight: 120
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  tipsDescription: {
    color: '#d1d5db',
    fontSize: 12,
    marginBottom: 8
  },
  tipsList: {
    gap: 4
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  tipText: {
    color: '#d1d5db',
    fontSize: 11
  },
  captureButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  captureButtonInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff'
  }
});
