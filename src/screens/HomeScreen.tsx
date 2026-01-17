/**
 * yanbao AI - 主屏幕
 * 
 * 7 个功能模块入口：
 * 1. 原生相机（Camera2 API）
 * 2. 大师脑（AI 推理引擎）
 * 3. 美颜模块
 * 4. 图像处理
 * 5. 本地数据库
 * 6. 云端同步
 * 7. 参数调整
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  NativeModules,
  Alert,
  Vibration,
} from 'react-native';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const HomeScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState<string | null>(null);

  // 原生相机模块
  const handleCameraModule = async () => {
    setLoading('camera');
    Vibration.vibrate(50); // 50ms 瞬时震动
    
    try {
      if (NativeModules.CameraModule?.openCamera) {
        await NativeModules.CameraModule.openCamera();
        Alert.alert('成功', '相机已启动');
      } else {
        Alert.alert('提示', '相机模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '无法启动相机');
    } finally {
      setLoading(null);
    }
  };

  // 大师脑模块（AI 推理）
  const handleMasterBrain = async () => {
    setLoading('master');
    
    try {
      if (NativeModules.MasterModule?.runInference) {
        const result = await NativeModules.MasterModule.runInference();
        Alert.alert('大师脑', `推理结果: ${result}`);
      } else {
        Alert.alert('提示', '大师脑模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '推理失败');
    } finally {
      setLoading(null);
    }
  };

  // 美颜模块
  const handleBeautyModule = async () => {
    setLoading('beauty');
    
    try {
      if (NativeModules.BeautyModule?.applyBeauty) {
        await NativeModules.BeautyModule.applyBeauty();
        Alert.alert('成功', '美颜已应用');
      } else {
        Alert.alert('提示', '美颜模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '美颜应用失败');
    } finally {
      setLoading(null);
    }
  };

  // 图像处理模块
  const handleImageProcessing = async () => {
    setLoading('image');
    
    try {
      if (NativeModules.ImageModule?.processImage) {
        await NativeModules.ImageModule.processImage();
        Alert.alert('成功', '图像已处理');
      } else {
        Alert.alert('提示', '图像处理模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '图像处理失败');
    } finally {
      setLoading(null);
    }
  };

  // 本地数据库模块
  const handleDatabase = async () => {
    setLoading('db');
    
    try {
      if (NativeModules.DatabaseModule?.queryData) {
        const data = await NativeModules.DatabaseModule.queryData();
        Alert.alert('数据库', `查询结果: ${data}`);
      } else {
        Alert.alert('提示', '数据库模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '数据库查询失败');
    } finally {
      setLoading(null);
    }
  };

  // 云端同步模块
  const handleCloudSync = async () => {
    setLoading('cloud');
    
    try {
      if (NativeModules.CloudModule?.syncData) {
        await NativeModules.CloudModule.syncData();
        Alert.alert('成功', '数据已同步');
      } else {
        Alert.alert('提示', '云端同步模块正在开发中');
      }
    } catch (error) {
      Alert.alert('错误', '同步失败');
    } finally {
      setLoading(null);
    }
  };

  // 参数调整模块
  const handleParameterAdjust = () => {
    setLoading('param');
    
    try {
      navigation?.navigate('Camera');
      Alert.alert('提示', '进入参数调整界面');
    } catch (error) {
      Alert.alert('错误', '无法进入参数调整');
    } finally {
      setLoading(null);
    }
  };

  const modules: ModuleItem[] = [
    {
      id: 'camera',
      title: '原生相机',
      subtitle: 'Camera2 API',
      icon: '📷',
      color: '#FF6B6B',
      onPress: handleCameraModule,
    },
    {
      id: 'master',
      title: '大师脑',
      subtitle: 'AI 推理引擎',
      icon: '🧠',
      color: '#4ECDC4',
      onPress: handleMasterBrain,
    },
    {
      id: 'beauty',
      title: '美颜模块',
      subtitle: '实时美颜处理',
      icon: '✨',
      color: '#FFD93D',
      onPress: handleBeautyModule,
    },
    {
      id: 'image',
      title: '图像处理',
      subtitle: 'GPUImage 引擎',
      icon: '🎨',
      color: '#A8E6CF',
      onPress: handleImageProcessing,
    },
    {
      id: 'db',
      title: '本地数据库',
      subtitle: 'Room 数据持久化',
      icon: '💾',
      color: '#FF8B94',
      onPress: handleDatabase,
    },
    {
      id: 'cloud',
      title: '云端同步',
      subtitle: 'Retrofit API',
      icon: '☁️',
      color: '#B4A7D6',
      onPress: handleCloudSync,
    },
    {
      id: 'param',
      title: '参数调整',
      subtitle: '29 个大师滑块',
      icon: '⚙️',
      color: '#FFB6C1',
      onPress: handleParameterAdjust,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 顶部标题 */}
        <View style={styles.header}>
          <Text style={styles.logo}>yanbao AI</Text>
          <Text style={styles.subtitle}>大师级摄影相机</Text>
        </View>

        {/* 功能模块网格 */}
        <View style={styles.gridContainer}>
          {modules.map((module, index) => (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleCard,
                {
                  backgroundColor: module.color,
                  opacity: loading === module.id ? 0.7 : 1,
                },
              ]}
              onPress={module.onPress}
              disabled={loading !== null}
              activeOpacity={0.8}
            >
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
              {loading === module.id && (
                <View style={styles.loadingIndicator}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 底部说明 */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>功能说明</Text>
          <Text style={styles.footerText}>
            • 原生相机：启动时应有 50ms 瞬时震动{'\n'}
            • 大师脑：AI 推理引擎核心{'\n'}
            • 美颜模块：实时美颜处理{'\n'}
            • 图像处理：GPUImage 滤镜引擎{'\n'}
            • 本地数据库：Room 数据持久化{'\n'}
            • 云端同步：Retrofit API 集成{'\n'}
            • 参数调整：29 个大师滑块
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'PingFang SC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PingFang SC',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  moduleCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'PingFang SC',
    textAlign: 'center',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'PingFang SC',
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'PingFang SC',
  },
  footer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'PingFang SC',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PingFang SC',
    lineHeight: 20,
  },
});

export default HomeScreen;
