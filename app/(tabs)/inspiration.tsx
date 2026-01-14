import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function InspirationScreen() {
  const [selectedTab, setSelectedTab] = useState('构图');

  const tabs = ['构图', '拍摄点', 'AI推荐'];
  
  const inspirations = [
    { id: 1, title: '对称构图法', type: '构图', difficulty: '简单', likes: '8.2k', image: '📐' },
    { id: 2, title: '黄金分割', type: '构图', difficulty: '中等', likes: '12.5k', image: '✨' },
    { id: 3, title: '故宫角楼', type: '拍摄点', difficulty: '简单', likes: '15.3k', image: '🏛️' },
    { id: 4, title: '咖啡馆窗边', type: '拍摄点', difficulty: '简单', likes: '9.8k', image: '☕' },
    { id: 5, title: '库洛米风格人像', type: 'AI推荐', difficulty: '中等', likes: '18.7k', image: '💜' },
    { id: 6, title: '夜景光轨', type: 'AI推荐', difficulty: '困难', likes: '6.4k', image: '🌃' },
  ];

  const filteredInspirations = selectedTab === 'AI推荐' 
    ? inspirations 
    : inspirations.filter(i => i.type === selectedTab);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return '#4ECDC4';
      case '中等': return '#FFA500';
      case '困难': return '#FF6B6B';
      default: return '#888888';
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>yanbao AI 灵感</Text>
      </View>

      {/* 标签栏 */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI 推荐横幅 */}
      <View style={styles.aiBanner}>
        <Text style={styles.aiBannerIcon}>✨</Text>
        <View style={styles.aiBannerTextContainer}>
          <Text style={styles.aiBannerTitle}>AI 为你推荐</Text>
          <Text style={styles.aiBannerSubtitle}>基于你的拍摄习惯和风格偏好</Text>
        </View>
      </View>

      {/* 灵感卡片列表 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredInspirations.map((item) => (
          <TouchableOpacity key={item.id} style={styles.inspirationCard}>
            {/* 左侧图标 */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{item.image}</Text>
            </View>

            {/* 中间信息 */}
            <View style={styles.infoContainer}>
              <Text style={styles.inspirationTitle}>{item.title}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                  <Text style={styles.difficultyText}>{item.difficulty}</Text>
                </View>
                <Text style={styles.likesText}>❤️ {item.likes}</Text>
              </View>
            </View>

            {/* 右侧箭头 */}
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* 底部占位 */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 底部签名 */}
      <View style={styles.footer}>
        <Text style={styles.signature}>Made with 💜 by Jason Tsao who loves you the most</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  header: {
    height: 100,
    backgroundColor: '#2D1B4E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A0B2E',
    justifyContent: 'space-around',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#2D1B4E',
    borderWidth: 2,
    borderColor: '#E879F9',
  },
  tabButtonActive: {
    backgroundColor: '#E879F9',
  },
  tabText: {
    fontSize: 14,
    color: '#E879F9',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  aiBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBannerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  aiBannerTextContainer: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: '#888888',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inspirationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    padding: 15,
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#1A0B2E',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
  },
  inspirationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  likesText: {
    fontSize: 12,
    color: '#888888',
  },
  arrow: {
    fontSize: 24,
    color: '#888888',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1A0B2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signature: {
    fontSize: 10,
    color: '#E879F9',
  },
});
