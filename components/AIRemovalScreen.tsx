import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { Canvas, useImage, Skia, Path } from '@shopify/react-native-skia';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

interface AIRemovalScreenProps {
  imageUri: string;
  onRemovalComplete: (resultUri: string) => void;
  onCancel?: () => void;
}

type BrushMode = 'draw' | 'erase';

/**
 * AI 消除屏幕 - 第一阶段核心组件
 * 
 * 功能：
 * - 涂鸦标记要移除的区域
 * - 实时预览
 * - 撤销/重做
 * - WebSocket 实时进度推送
 */
export const AIRemovalScreen: React.FC<AIRemovalScreenProps> = ({
  imageUri,
  onRemovalComplete,
  onCancel
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Array<{ path: any; points: Array<{ x: number; y: number }> }>>([]);
  const [brushSize, setBrushSize] = useState(30);
  const [brushMode, setBrushMode] = useState<BrushMode>('draw');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const image = useImage(imageUri);

  const { width, height } = Dimensions.get('window');
  const canvasHeight = height * 0.65;
  const canvasWidth = width;

  // 开始绘制
  const handleTouchStart = useCallback((event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setIsDrawing(true);

    const path = Skia.Path.Make();
    path.moveTo(locationX, locationY);
    setPaths((prev) => [
      ...prev,
      {
        path,
        points: [{ x: locationX, y: locationY }]
      }
    ]);
  }, []);

  // 继续绘制
  const handleTouchMove = useCallback((event: any) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;

    setPaths((prev) => {
      const newPaths = [...prev];
      const lastPath = newPaths[newPaths.length - 1];
      if (lastPath) {
        lastPath.path.lineTo(locationX, locationY);
        lastPath.points.push({ x: locationX, y: locationY });
      }
      return newPaths;
    });
  }, [isDrawing]);

  // 结束绘制
  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // 撤销
  const handleUndo = useCallback(() => {
    setPaths((prev) => prev.slice(0, -1));
  }, []);

  // 清除所有
  const handleClear = useCallback(() => {
    setPaths([]);
  }, []);

  // 生成掩码
  const generateMask = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // 创建掩码画布
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvasWidth;
      maskCanvas.height = canvasHeight;
      const ctx = maskCanvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 背景为黑色
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 绘制白色笔迹（要移除的区域）
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      paths.forEach(({ points }) => {
        if (points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
      });

      // 转换为 Blob
      maskCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create mask blob'));
        }
      }, 'image/png');
    });
  };

  // 连接 WebSocket
  const connectWebSocket = (taskId: string) => {
    const wsUrl = `ws://localhost:8000/ws/inpaint/${taskId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      logger.info(`WebSocket connected for task ${taskId}`);
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'progress':
          setProgress(data.progress);
          break;

        case 'completed':
          setProgress(100);
          // 下载结果
          downloadResult(taskId);
          break;

        case 'error':
          Alert.alert('Error', data.error);
          setIsProcessing(false);
          break;
      }
    };

    ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
      Alert.alert('Connection Error', 'Failed to connect to inpainting service');
      setIsProcessing(false);
    };

    ws.onclose = () => {
      setWsConnected(false);
    };
  };

  // 下载结果
  const downloadResult = async (taskId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/inpaint/${taskId}/result`,
        { responseType: 'blob' }
      );

      const resultUri = URL.createObjectURL(response.data);
      setPreviewUri(resultUri);
      setShowPreview(true);
      setIsProcessing(false);

      // 延迟调用完成回调
      setTimeout(() => {
        onRemovalComplete(resultUri);
      }, 1000);
    } catch (error) {
      logger.error('Failed to download result:', error);
      Alert.alert('Error', 'Failed to download result');
      setIsProcessing(false);
    }
  };

  // 提交 inpainting 任务
  const handleSubmit = async () => {
    if (paths.length === 0) {
      Alert.alert('No mask', 'Please draw on the image to mark areas to remove');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // 生成掩码
      const maskBlob = await generateMask();

      // 获取原图
      const imageBlob = await fetch(imageUri).then((r) => r.blob());

      // 创建 FormData
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.jpg');
      formData.append('mask', maskBlob, 'mask.png');
      formData.append('priority', '1');

      // 提交任务
      const response = await axios.post(
        'http://localhost:8000/api/v1/inpaint',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const { taskId } = response.data;
      setTaskId(taskId);

      // 连接 WebSocket 监听进度
      connectWebSocket(taskId);
    } catch (error) {
      logger.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit inpainting task');
      setIsProcessing(false);
    }
  };

  // 切换笔刷模式
  const toggleBrushMode = useCallback(() => {
    setBrushMode((prev) => (prev === 'draw' ? 'erase' : 'draw'));
  }, []);

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Object Removal</Text>
        <Text style={styles.headerSubtitle}>Draw to mark areas to remove</Text>
      </View>

      {/* 画布 */}
      <View style={[styles.canvasContainer, { width: canvasWidth, height: canvasHeight }]}>
        {image && (
          <Canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 原图 */}
            <Image
              image={image}
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
            />

            {/* 绘制的路径 */}
            {paths.map((pathObj, idx) => (
              <Path
                key={idx}
                path={pathObj.path}
                stroke="#FF6B6B"
                strokeWidth={brushSize}
                strokeLineCap="round"
                strokeLineJoin="round"
              />
            ))}
          </Canvas>
        )}
      </View>

      {/* 笔刷控制 */}
      <View style={styles.brushControls}>
        <View style={styles.brushSizeControl}>
          <MaterialCommunityIcons name="brush" size={16} color="#fff" />
          <Text style={styles.brushSizeLabel}>{brushSize}px</Text>
          <View
            style={[
              styles.brushSizeSlider,
              { width: brushSize * 2 }
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={toggleBrushMode}
          style={[
            styles.modeButton,
            brushMode === 'erase' && styles.modeButtonActive
          ]}
        >
          <MaterialCommunityIcons
            name={brushMode === 'draw' ? 'pencil' : 'eraser'}
            size={16}
            color="#fff"
          />
          <Text style={styles.modeButtonText}>
            {brushMode === 'draw' ? 'Draw' : 'Erase'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 处理进度 */}
      {isProcessing && (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.progressText}>Processing... {progress}%</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          {wsConnected && (
            <Text style={styles.wsStatusText}>Connected to server</Text>
          )}
        </View>
      )}

      {/* 操作按钮 */}
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={handleUndo}
          disabled={paths.length === 0 || isProcessing}
          style={[styles.button, (paths.length === 0 || isProcessing) && styles.buttonDisabled]}
        >
          <MaterialCommunityIcons name="undo" size={20} color="#fff" />
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClear}
          disabled={paths.length === 0 || isProcessing}
          style={[styles.button, (paths.length === 0 || isProcessing) && styles.buttonDisabled]}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={paths.length === 0 || isProcessing}
          style={[
            styles.button,
            styles.submitButton,
            (paths.length === 0 || isProcessing) && styles.buttonDisabled
          ]}
        >
          <MaterialCommunityIcons name="magic-wand" size={20} color="#fff" />
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={isProcessing}
          style={[styles.button, isProcessing && styles.buttonDisabled]}
        >
          <MaterialCommunityIcons name="close" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* 结果预览 Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>Removal Complete</Text>
            {previewUri && (
              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
              />
            )}
            <TouchableOpacity
              onPress={() => setShowPreview(false)}
              style={styles.previewButton}
            >
              <Text style={styles.previewButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  headerSubtitle: {
    color: '#d1d5db',
    fontSize: 12,
    marginTop: 4
  },
  canvasContainer: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  brushControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  brushSizeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brushSizeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40
  },
  brushSizeSlider: {
    height: 4,
    backgroundColor: '#7c3aed',
    borderRadius: 2
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6
  },
  modeButtonActive: {
    backgroundColor: '#7c3aed'
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed'
  },
  wsStatusText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '500'
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a0a'
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6
  },
  buttonDisabled: {
    opacity: 0.5
  },
  submitButton: {
    backgroundColor: '#7c3aed'
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewContent: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 12
  },
  previewButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 6,
    alignItems: 'center'
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});

// 简单的日志工具
const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[WARN] ${msg}`, ...args)
};
