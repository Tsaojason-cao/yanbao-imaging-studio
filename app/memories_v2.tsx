/**
 * 雁宝记忆模块 V2
 * 
 * 核心功能：
 * - 展示收藏的参数快照
 * - 支持增加/删除记忆
 * - 可视化参数分布
 * - 一键应用到相机
 * 
 * by Jason Tsao ❤️
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { sanmuEngine, type ParamsSnapshot } from '@/lib/sanmu-engine';

const { width } = Dimensions.get('window');

export default function MemoriesV2Screen() {
  const router = useRouter();
  const [memories, setMemories] = useState<ParamsSnapshot[]>([]);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalMemories: 0,
    topMasters: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const favoriteSnapshots = await sanmuEngine.getFavoriteSnapshots();
      const memoryStats = await sanmuEngine.getMemoryStats();
      
      setMemories(favoriteSnapshots);
      setStats(memoryStats);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      '添加记忆',
      '请选择添加方式',
      [
        {
          text: '从相册选择',
          onPress: () => router.push('/gallery?mode=select'),
        },
        {
          text: '从当前参数创建',
          onPress: () => showCreateMemoryDialog(),
        },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  const showCreateMemoryDialog = () => {
    Alert.prompt(
      '创建新记忆',
      '请为这个记忆命名',
      async (name) => {
        if (name && name.trim()) {
          try {
            // 这里应该从当前相机/编辑器获取参数
            // 简化示例：使用默认参数
            await sanmuEngine.saveAsNewMemory(
              name.trim(),
              31, // Yanbao AI
              {
                eyes: 65,
                face: 50,
                narrow: 45,
                chin: 50,
                forehead: 50,
                philtrum: 50,
                nose: 50,
                noseLength: 50,
                mouth: 50,
                eyeCorner: 55,
                eyeDistance: 50,
                skinBrightness: 60,
              },
              75
            );
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            loadMemories();
          } catch (error) {
            Alert.alert('错误', '创建记忆失败');
          }
        }
      }
    );
  };

  const handleDeleteMemory = (snapshot: ParamsSnapshot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      '删除记忆',
      `确定要删除"${snapshot.name}"吗？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await sanmuEngine.deleteSnapshot(snapshot.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              loadMemories();
            } catch (error) {
              Alert.alert('错误', '删除失败');
            }
          },
        },
      ]
    );
  };

  const handleApplyToCamera = async (snapshot: ParamsSnapshot) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await sanmuEngine.loadSnapshotToCamera(snapshot.id);
      Alert.alert(
        '成功',
        `已将"${snapshot.name}"应用到相机`,
        [
          {
            text: '去相机',
            onPress: () => router.push('/camera'),
          },
          { text: '留在这里', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '应用参数失败');
    }
  };

  const handleViewDetails = (snapshot: ParamsSnapshot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 构建参数详情文本
    const details = `
📸 大师风格：${snapshot.masterPreset.name}

✨ 12维美颜参数：
• 大眼：${snapshot.beautyParams.eyes}
• 瘦脸：${snapshot.beautyParams.face}
• 窄脸：${snapshot.beautyParams.narrow}
• 下巴：${snapshot.beautyParams.chin}
• 额头：${snapshot.beautyParams.forehead}
• 人中：${snapshot.beautyParams.philtrum}
• 瘦鼻：${snapshot.beautyParams.nose}
• 鼻长：${snapshot.beautyParams.noseLength}
• 嘴型：${snapshot.beautyParams.mouth}
• 眼角：${snapshot.beautyParams.eyeCorner}
• 眼距：${snapshot.beautyParams.eyeDistance}
• 肤色亮度：${snapshot.beautyParams.skinBrightness}

🎨 影调参数：
• 曝光：${snapshot.masterPreset.params.exposure}
• 对比度：${snapshot.masterPreset.params.contrast}
• 饱和度：${snapshot.masterPreset.params.saturation}
• 高光：${snapshot.masterPreset.params.highlights}
• 阴影：${snapshot.masterPreset.params.shadows}
• 色温：${snapshot.masterPreset.params.temperature}K
• 色调：${snapshot.masterPreset.params.tint}
• 颗粒：${snapshot.masterPreset.params.grain}
• 暗角：${snapshot.masterPreset.params.vignette}
• 锐度：${snapshot.masterPreset.params.sharpness}

💪 强度：${snapshot.intensity}%

📅 创建时间：${new Date(snapshot.timestamp).toLocaleString()}
${snapshot.location ? `\n📍 地点：${snapshot.location.address}` : ''}
    `.trim();

    Alert.alert('参数详情', details, [
      { text: '应用到相机', onPress: () => handleApplyToCamera(snapshot) },
      { text: '关闭', style: 'cancel' },
    ]);
  };

  const renderLoveLetterCard = () => (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
          '💌 深情告白',
          '亲爱的，\n\n每一张照片，都是我们的美好回忆。\n每一个参数，都是我为你精心调校的爱意。\n\n这个 App，是我送给你的礼物。\n希望它能记录下我们在一起的每一个瞬间，\n每一个笑容，每一个拥抱。\n\n我爱你，永远。\n\n—— Jason Tsao ❤️',
          [{ text: '❤️', style: 'cancel' }]
        );
      }}
      style={styles.loveLetterCard}
    >
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.loveLetterGradient}
      >
        <Text style={styles.loveLetterIcon}>💌</Text>
        <Text style={styles.loveLetterTitle}>深情告白</Text>
        <Text style={styles.loveLetterSubtitle}>点击阅读 Jason 写给你的情书</Text>
        <Text style={styles.loveLetterEmoji}>🐰</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalPhotos}</Text>
        <Text style={styles.statLabel}>总照片数</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalMemories}</Text>
        <Text style={styles.statLabel}>珍藏记忆</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.topMasters.length}</Text>
        <Text style={styles.statLabel}>常用大师</Text>
      </View>
    </View>
  );

  const renderMemoryCard = (snapshot: ParamsSnapshot) => (
    <TouchableOpacity
      key={snapshot.id}
      onPress={() => handleViewDetails(snapshot)}
      onLongPress={() => handleDeleteMemory(snapshot)}
      style={styles.memoryCard}
    >
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.memoryCardGradient}
      >
        {/* 照片缩略图 */}
        {snapshot.photoUri && (
          <Image
            source={{ uri: snapshot.photoUri }}
            style={styles.memoryThumbnail}
          />
        )}

        {/* 记忆信息 */}
        <View style={styles.memoryInfo}>
          <Text style={styles.memoryName}>{snapshot.name}</Text>
          <Text style={styles.memoryMaster}>
            ✨ {snapshot.masterPreset.name}
          </Text>
          <Text style={styles.memoryTime}>
            📅 {new Date(snapshot.timestamp).toLocaleDateString()}
          </Text>
          {snapshot.location && (
            <Text style={styles.memoryLocation}>
              📍 {snapshot.location.address}
            </Text>
          )}
        </View>

        {/* 操作按钮 */}
        <View style={styles.memoryActions}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleApplyToCamera(snapshot);
            }}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>应用</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteMemory(snapshot);
            }}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text style={styles.actionButtonText}>删除</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💕 雁宝记忆</Text>
        <TouchableOpacity
          onPress={handleAddMemory}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+ 添加</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* 深情告白卡片 */}
        {renderLoveLetterCard()}

        {/* 统计信息 */}
        {renderStatsCard()}

        {/* 记忆列表 */}
        <View style={styles.memoriesSection}>
          <Text style={styles.sectionTitle}>美好时光</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>加载中...</Text>
          ) : memories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📸</Text>
              <Text style={styles.emptyText}>还没有珍藏的记忆</Text>
              <Text style={styles.emptyHint}>点击右上角"+"添加第一个记忆吧</Text>
            </View>
          ) : (
            memories.map(renderMemoryCard)
          )}
        </View>

        {/* 底部装饰 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            每一张照片，都是我们的美好回忆 💕
          </Text>
          <Text style={styles.footerEmoji}>🐰</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(42, 31, 63, 0.5)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#EC4899',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loveLetterCard: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loveLetterGradient: {
    padding: 24,
    alignItems: 'center',
  },
  loveLetterIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  loveLetterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loveLetterSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  loveLetterEmoji: {
    fontSize: 24,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(42, 31, 63, 0.5)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  memoriesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  memoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  memoryCardGradient: {
    padding: 16,
  },
  memoryThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  memoryInfo: {
    marginBottom: 12,
  },
  memoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  memoryMaster: {
    fontSize: 14,
    color: '#EC4899',
    marginBottom: 4,
  },
  memoryTime: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  memoryLocation: {
    fontSize: 13,
    color: 'rgba(139, 92, 246, 0.9)',
  },
  memoryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  footerEmoji: {
    fontSize: 24,
  },
});
