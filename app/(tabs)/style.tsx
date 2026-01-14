import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2列瀑布流

export default function StyleScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', '库洛米', '甜酷风', '复古', '清新', '暗黑'];
  
  const styles_data = [
    { id: 1, name: '库洛米甜心', category: '库洛米', color: '#E879F9', usage: '12.5k' },
    { id: 2, name: '紫色梦境', category: '库洛米', color: '#9D4EDD', usage: '8.3k' },
    { id: 3, name: '甜酷少女', category: '甜酷风', color: '#FF6B6B', usage: '15.2k' },
    { id: 4, name: '复古胶片', category: '复古', color: '#FFA500', usage: '9.8k' },
    { id: 5, name: '清新日系', category: '清新', color: '#4ECDC4', usage: '11.1k' },
    { id: 6, name: '暗黑哥特', category: '暗黑', color: '#2D1B4E', usage: '6.7k' },
    { id: 7, name: '樱花粉调', category: '甜酷风', color: '#FFB6C1', usage: '13.4k' },
    { id: 8, name: '冬日暖阳', category: '清新', color: '#FFD700', usage: '10.2k' },
  ];

  const filteredStyles = selectedCategory === '全部' 
    ? styles_data 
    : styles_data.filter(s => s.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>yanbao AI 风格</Text>
      </View>

      {/* 分类标签 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 瀑布流风格卡片 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredStyles.map((style, index) => (
            <TouchableOpacity 
              key={style.id} 
              style={[
                styles.styleCard,
                { marginRight: index % 2 === 0 ? 10 : 0 }
              ]}
            >
              {/* 预览区域 */}
              <View style={[styles.previewArea, { backgroundColor: style.color }]}>
                <Text style={styles.previewText}>预览</Text>
              </View>
              
              {/* 信息区域 */}
              <View style={styles.infoArea}>
                <Text style={styles.styleName}>{style.name}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.categoryTag}>{style.category}</Text>
                  <Text style={styles.usageText}>🔥 {style.usage}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  categoryScroll: {
    maxHeight: 60,
    backgroundColor: '#1A0B2E',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#2D1B4E',
    borderWidth: 2,
    borderColor: '#E879F9',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#E879F9',
  },
  categoryText: {
    fontSize: 14,
    color: '#E879F9',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20,
    paddingBottom: 80,
  },
  styleCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E879F9',
    marginBottom: 15,
    overflow: 'hidden',
  },
  previewArea: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  infoArea: {
    padding: 12,
  },
  styleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 12,
    color: '#E879F9',
  },
  usageText: {
    fontSize: 12,
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
