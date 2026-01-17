/**
 * 记忆屏幕 - Memory Screen
 * 测试 MemoryModule 原生模块
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
  NativeModules,
  Alert,
  ActivityIndicator,
} from 'react-native';

// 导入原生模块
const {MemoryModule} = NativeModules;

const MemoryScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 保存记忆
  const handleSaveMemory = async (type: string) => {
    try {
      setLoading(true);

      if (MemoryModule) {
        const result = await MemoryModule.saveMemory({
          type: type,
          content: `测试${type}记忆 - ${new Date().toLocaleString()}`,
          emotion: {
            happiness: Math.random(),
            sadness: Math.random(),
            calmness: Math.random(),
            excitement: Math.random(),
          },
          metadata: {
            source: 'test',
            timestamp: Date.now(),
          },
        });

        Alert.alert('成功', `记忆已保存 (${result.latency}ms)`);
        console.log('保存结果:', result);

        // 刷新统计
        handleGetStats();
      } else {
        Alert.alert('提示', 'MemoryModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('保存记忆失败:', error);
      Alert.alert('错误', error.message || '保存记忆失败');
    } finally {
      setLoading(false);
    }
  };

  // 检索记忆
  const handleSearchMemories = async () => {
    try {
      setLoading(true);
      setMemories([]);

      if (MemoryModule) {
        const result = await MemoryModule.searchMemories({
          text: searchQuery,
          limit: 10,
          needCloud: false,
        });

        setMemories(result.memories || []);
        console.log('检索结果:', result);
      } else {
        Alert.alert('提示', 'MemoryModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('检索记忆失败:', error);
      Alert.alert('错误', error.message || '检索记忆失败');
    } finally {
      setLoading(false);
    }
  };

  // 情感检索
  const handleSearchByEmotion = async (emotion: string) => {
    try {
      setLoading(true);
      setMemories([]);

      if (MemoryModule) {
        const emotionMap: any = {
          happy: {happiness: 0.9, sadness: 0.1, calmness: 0.5, excitement: 0.7},
          sad: {happiness: 0.1, sadness: 0.9, calmness: 0.3, excitement: 0.2},
          calm: {happiness: 0.5, sadness: 0.2, calmness: 0.9, excitement: 0.1},
          excited: {
            happiness: 0.7,
            sadness: 0.1,
            calmness: 0.2,
            excitement: 0.9,
          },
        };

        const result = await MemoryModule.searchByEmotion(emotionMap[emotion]);

        setMemories(result.memories || []);
        console.log('情感检索结果:', result);
      } else {
        Alert.alert('提示', 'MemoryModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('情感检索失败:', error);
      Alert.alert('错误', error.message || '情感检索失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计
  const handleGetStats = async () => {
    try {
      if (MemoryModule) {
        const result = await MemoryModule.getStatistics();
        setStats(result);
        console.log('统计结果:', result);
      } else {
        Alert.alert('提示', 'MemoryModule 原生模块尚未实现');
      }
    } catch (error: any) {
      console.error('获取统计失败:', error);
      Alert.alert('错误', error.message || '获取统计失败');
    }
  };

  // 清空记忆
  const handleClearMemories = async () => {
    Alert.alert('确认', '确定要清空所有记忆吗？', [
      {text: '取消', style: 'cancel'},
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            if (MemoryModule) {
              await MemoryModule.clearMemories();
              setMemories([]);
              setStats(null);
              Alert.alert('成功', '记忆已清空');
            }
          } catch (error: any) {
            Alert.alert('错误', error.message || '清空失败');
          }
        },
      },
    ]);
  };

  // 初始化时获取统计
  useEffect(() => {
    handleGetStats();
  }, []);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>记忆系统</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Memory System
        </Text>
      </View>

      {/* 统计卡片 */}
      {stats && (
        <View style={[styles.statsCard, {backgroundColor: colors.surface}]}>
          <Text style={[styles.statsTitle, {color: colors.text}]}>
            记忆统计
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: colors.primary}]}>
                {stats.totalCount}
              </Text>
              <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
                总数
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: colors.secondary}]}>
                {stats.photoCount}
              </Text>
              <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
                照片
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: colors.primary}]}>
                {stats.locationCount}
              </Text>
              <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
                地点
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, {color: colors.secondary}]}>
                {stats.eventCount}
              </Text>
              <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
                事件
              </Text>
            </View>
          </View>

          {stats.averageEmotion && (
            <View style={styles.emotionSection}>
              <Text
                style={[styles.emotionTitle, {color: colors.textSecondary}]}>
                平均情感
              </Text>
              <View style={styles.emotionBars}>
                <EmotionBar
                  label="快乐"
                  value={stats.averageEmotion.happiness}
                  color={colors.primary}
                  textColor={colors.text}
                />
                <EmotionBar
                  label="悲伤"
                  value={stats.averageEmotion.sadness}
                  color={colors.secondary}
                  textColor={colors.text}
                />
                <EmotionBar
                  label="平静"
                  value={stats.averageEmotion.calmness}
                  color={colors.primary}
                  textColor={colors.text}
                />
                <EmotionBar
                  label="激动"
                  value={stats.averageEmotion.excitement}
                  color={colors.secondary}
                  textColor={colors.text}
                />
              </View>
            </View>
          )}
        </View>
      )}

      {/* 保存记忆 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          保存记忆
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.primary}]}
            onPress={() => handleSaveMemory('photo')}
            disabled={loading}>
            <Text style={styles.buttonText}>📷 照片</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.secondary}]}
            onPress={() => handleSaveMemory('location')}
            disabled={loading}>
            <Text style={styles.buttonText}>📍 地点</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.primary}]}
            onPress={() => handleSaveMemory('event')}
            disabled={loading}>
            <Text style={styles.buttonText}>🎉 事件</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 检索记忆 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          检索记忆
        </Text>

        <View style={[styles.searchBox, {backgroundColor: colors.surface}]}>
          <TextInput
            style={[styles.searchInput, {color: colors.text}]}
            placeholder="输入关键词..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.searchButton, {backgroundColor: colors.primary}]}
            onPress={handleSearchMemories}
            disabled={loading || !searchQuery}>
            <Text style={styles.buttonText}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 情感检索 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          情感检索
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.primary}]}
            onPress={() => handleSearchByEmotion('happy')}
            disabled={loading}>
            <Text style={styles.buttonText}>😊 快乐</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.secondary}]}
            onPress={() => handleSearchByEmotion('sad')}
            disabled={loading}>
            <Text style={styles.buttonText}>😢 悲伤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.primary}]}
            onPress={() => handleSearchByEmotion('calm')}
            disabled={loading}>
            <Text style={styles.buttonText}>😌 平静</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallButton, {backgroundColor: colors.secondary}]}
            onPress={() => handleSearchByEmotion('excited')}
            disabled={loading}>
            <Text style={styles.buttonText}>🤩 激动</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 管理 */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>管理</Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.surface}]}
          onPress={handleGetStats}>
          <Text style={[styles.buttonText, {color: colors.text}]}>
            📊 刷新统计
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#FF4444'}]}
          onPress={handleClearMemories}>
          <Text style={styles.buttonText}>🗑️ 清空记忆</Text>
        </TouchableOpacity>
      </View>

      {/* 加载指示器 */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.textSecondary}]}>
            处理中...
          </Text>
        </View>
      )}

      {/* 记忆列表 */}
      {memories.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            检索结果 ({memories.length})
          </Text>

          {memories.map((memory, index) => (
            <View
              key={index}
              style={[styles.memoryCard, {backgroundColor: colors.surface}]}>
              <View style={styles.memoryHeader}>
                <Text style={[styles.memoryType, {color: colors.primary}]}>
                  {memory.type === 'photo'
                    ? '📷 照片'
                    : memory.type === 'location'
                    ? '📍 地点'
                    : '🎉 事件'}
                </Text>
                <Text style={[styles.memoryTime, {color: colors.textSecondary}]}>
                  {new Date(memory.timestamp).toLocaleString()}
                </Text>
              </View>

              <Text style={[styles.memoryContent, {color: colors.text}]}>
                {memory.content}
              </Text>

              {memory.emotion && (
                <View style={styles.memoryEmotion}>
                  <Text
                    style={[
                      styles.memoryEmotionLabel,
                      {color: colors.textSecondary},
                    ]}>
                    情感:
                  </Text>
                  <Text
                    style={[
                      styles.memoryEmotionValue,
                      {color: colors.textSecondary},
                    ]}>
                    快乐 {(memory.emotion.happiness * 100).toFixed(0)}% | 悲伤{' '}
                    {(memory.emotion.sadness * 100).toFixed(0)}%
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 提示信息 */}
      <View style={styles.info}>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          💡 原生模块状态: {MemoryModule ? '✅ 已集成' : '⏳ 待实现'}
        </Text>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          🚀 功能: 情感维度记忆 + 语义检索
        </Text>
        <Text style={[styles.infoText, {color: colors.textSecondary}]}>
          ⚡ 目标: 检索延迟 {'<'} 200ms
        </Text>
      </View>
    </ScrollView>
  );
};

// 情感条组件
const EmotionBar = ({
  label,
  value,
  color,
  textColor,
}: {
  label: string;
  value: number;
  color: string;
  textColor: string;
}) => (
  <View style={styles.emotionBar}>
    <Text style={[styles.emotionBarLabel, {color: textColor}]}>{label}</Text>
    <View style={styles.emotionBarTrack}>
      <View
        style={[
          styles.emotionBarFill,
          {width: `${value * 100}%`, backgroundColor: color},
        ]}
      />
    </View>
    <Text style={[styles.emotionBarValue, {color: textColor}]}>
      {(value * 100).toFixed(0)}%
    </Text>
  </View>
);

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
  statsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  emotionSection: {
    marginTop: 20,
  },
  emotionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  emotionBars: {
    gap: 8,
  },
  emotionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionBarLabel: {
    fontSize: 12,
    width: 40,
  },
  emotionBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  emotionBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emotionBarValue: {
    fontSize: 12,
    width: 40,
    textAlign: 'right',
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
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  searchButton: {
    padding: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  loading: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  memoryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  memoryType: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  memoryTime: {
    fontSize: 12,
  },
  memoryContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  memoryEmotion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryEmotionLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  memoryEmotionValue: {
    fontSize: 12,
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

export default MemoryScreen;
