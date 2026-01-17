/**
 * 大师屏幕 - Master Screen
 * 测试 MasterModule 原生模块
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  NativeModules,
  Alert,
  ActivityIndicator,
} from 'react-native';

// 导入原生模块
const {MasterModule} = NativeModules;

const MasterScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  // 获取大师建议
  const handleGetAdvice = async (type: string) => {
    try {
      setLoading(true);
      setAdvice(null);

      if (MasterModule) {
        const result = await MasterModule.getMasterAdvice({
          type: type,
          data: {
            timestamp: Date.now(),
            user: 'test_user',
          },
          needDeep: type === 'photo', // 照片需要深度推理
        });

        setAdvice(result);
        console.log('大师建议:', result);
      } else {
        Alert.alert('提示', 'MasterModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('获取建议失败:', error);
      Alert.alert('错误', error.message || '获取建议失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取模块状态
  const handleGetStatus = async () => {
    try {
      if (MasterModule) {
        const result = await MasterModule.getStatus();
        setStatus(result);
        console.log('模块状态:', result);
      } else {
        Alert.alert('提示', 'MasterModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('获取状态失败:', error);
      Alert.alert('错误', error.message || '获取状态失败');
    }
  };

  // 配置 API 地址
  const handleSetApiUrl = async () => {
    try {
      if (MasterModule) {
        await MasterModule.setApiBaseUrl('https://api.yanbao.ai');
        Alert.alert('成功', 'API 地址已更新');
      } else {
        Alert.alert('提示', 'MasterModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('配置失败:', error);
      Alert.alert('错误', error.message || '配置失败');
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>大师推理引擎</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Master Reasoning Engine
        </Text>
      </View>

      {/* 功能按钮 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          获取建议
        </Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={() => handleGetAdvice('photo')}
          disabled={loading}>
          <Text style={styles.buttonText}>📷 拍照建议（深度推理）</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.secondary}]}
          onPress={() => handleGetAdvice('location')}
          disabled={loading}>
          <Text style={styles.buttonText}>📍 地点推荐</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={() => handleGetAdvice('edit')}
          disabled={loading}>
          <Text style={styles.buttonText}>🎨 编辑建议</Text>
        </TouchableOpacity>
      </View>

      {/* 配置按钮 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>配置</Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.surface}]}
          onPress={handleGetStatus}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            📊 查看状态
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.surface}]}
          onPress={handleSetApiUrl}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            ⚙️ 配置 API
          </Text>
        </TouchableOpacity>
      </View>

      {/* 加载指示器 */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.textSecondary}]}>
            正在推理...
          </Text>
        </View>
      )}

      {/* 建议结果 */}
      {advice && (
        <View style={[styles.result, {backgroundColor: colors.surface}]}>
          <Text style={[styles.resultTitle, {color: colors.text}]}>
            推理结果
          </Text>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              模式:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {advice.mode === 'intelligent' ? '🧠 智能模式' : '🔧 降级模式'}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              延迟:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {advice.latency}ms
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              健康:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {advice.healthy ? '✅ 健康' : '⚠️ 降级'}
            </Text>
          </View>

          {advice.advice && advice.advice.local && (
            <>
              <Text
                style={[styles.resultSubtitle, {color: colors.textSecondary}]}>
                本地建议:
              </Text>
              <Text style={[styles.resultText, {color: colors.text}]}>
                {advice.advice.local.suggestion || '无'}
              </Text>
              <Text style={[styles.resultText, {color: colors.textSecondary}]}>
                置信度: {advice.advice.local.confidence || 0}
              </Text>
              <Text style={[styles.resultText, {color: colors.textSecondary}]}>
                推理: {advice.advice.local.reasoning || '无'}
              </Text>
            </>
          )}

          {advice.advice && advice.advice.cloud && (
            <>
              <Text
                style={[styles.resultSubtitle, {color: colors.textSecondary}]}>
                云端建议:
              </Text>
              <Text style={[styles.resultText, {color: colors.text}]}>
                {advice.advice.cloud.suggestion || '无'}
              </Text>
            </>
          )}
        </View>
      )}

      {/* 状态结果 */}
      {status && (
        <View style={[styles.result, {backgroundColor: colors.surface}]}>
          <Text style={[styles.resultTitle, {color: colors.text}]}>
            模块状态
          </Text>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              健康:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {status.healthy ? '✅ 健康' : '⚠️ 降级'}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              TFLite:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {status.tfliteLoaded ? '✅ 已加载' : '❌ 未加载'}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, {color: colors.textSecondary}]}>
              API:
            </Text>
            <Text style={[styles.resultValue, {color: colors.text}]}>
              {status.apiBaseUrl}
            </Text>
          </View>
        </View>
      )}

      {/* 提示信息 */}
      <View style={styles.info}>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          💡 原生模块状态: {MasterModule ? '✅ 已集成' : '⏳ 待实现'}
        </Text>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          🚀 功能: Chain of Thought 推理
        </Text>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          🔄 双轨制: 智能模式 + 降级模式
        </Text>
      </View>
    </ScrollView>
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
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  result: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    width: 80,
  },
  resultValue: {
    fontSize: 14,
    flex: 1,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  info: {
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default MasterScreen;
