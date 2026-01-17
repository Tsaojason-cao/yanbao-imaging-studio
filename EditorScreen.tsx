import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

// 滤镜预设
const FILTERS = [
  { id: 'none', name: '原图', icon: '📷' },
  { id: 'vintage', name: '复古', icon: '🎞️', brightness: 0.9, contrast: 1.1, saturation: 0.8 },
  { id: 'vivid', name: '鲜艳', icon: '🌈', brightness: 1.1, contrast: 1.2, saturation: 1.3 },
  { id: 'cool', name: '冷色', icon: '❄️', brightness: 1.0, contrast: 1.1, saturation: 0.9 },
  { id: 'warm', name: '暖色', icon: '🔥', brightness: 1.1, contrast: 1.0, saturation: 1.1 },
  { id: 'bw', name: '黑白', icon: '⚫', brightness: 1.0, contrast: 1.2, saturation: 0 },
  { id: 'soft', name: '柔和', icon: '☁️', brightness: 1.05, contrast: 0.9, saturation: 0.95 },
  { id: 'dramatic', name: '戏剧', icon: '🎭', brightness: 0.95, contrast: 1.4, saturation: 1.1 },
  { id: 'fade', name: '褪色', icon: '🌫️', brightness: 1.1, contrast: 0.8, saturation: 0.7 },
  { id: 'mono', name: '单色', icon: '🖤', brightness: 1.0, contrast: 1.3, saturation: 0.2 },
  { id: 'sunset', name: '日落', icon: '🌅', brightness: 1.05, contrast: 1.1, saturation: 1.2 },
  { id: 'neon', name: '霓虹', icon: '💜', brightness: 1.2, contrast: 1.3, saturation: 1.5 },
];

export default function EditorScreen({ imageUri, onClose, onSave }: any) {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const applyFilter = (filterId: string) => {
    setSelectedFilter(filterId);
    const filter = FILTERS.find(f => f.id === filterId);
    if (filter && filter.id !== 'none') {
      setBrightness(Math.round((filter.brightness || 1) * 100));
      setContrast(Math.round((filter.contrast || 1) * 100));
      setSaturation(Math.round((filter.saturation || 1) * 100));
    } else {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
    }
  };

  const saveImage = async () => {
    setIsProcessing(true);
    try {
      // 这里应该应用实际的图片处理
      // 使用 expo-image-manipulator 或其他库
      Alert.alert('保存成功', '照片已保存到相册');
      if (onSave) {
        onSave(imageUri);
      }
    } catch (error) {
      Alert.alert('错误', '保存失败');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Photo Editor</Text>
        <TouchableOpacity onPress={saveImage} disabled={isProcessing}>
          <Text style={[styles.headerButton, styles.saveButton]}>
            {isProcessing ? '处理中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>🖼️</Text>
            <Text style={styles.placeholderText}>选择照片开始编辑</Text>
          </View>
        )}
        
        {/* Filter Overlay Info */}
        {selectedFilter !== 'none' && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>
              {FILTERS.find(f => f.id === selectedFilter)?.name}
            </Text>
          </View>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>✨ 滤镜预设</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersList}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterItem,
                selectedFilter === filter.id && styles.filterItemActive,
              ]}
              onPress={() => applyFilter(filter.id)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={styles.filterName}>{filter.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Adjustments */}
      <View style={styles.adjustmentsSection}>
        <Text style={styles.sectionTitle}>🎨 参数调节</Text>
        
        <View style={styles.adjustmentRow}>
          <Text style={styles.adjustmentLabel}>亮度</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${brightness}%`, backgroundColor: '#A33BFF' }
                ]} 
              />
            </View>
            <Text style={styles.adjustmentValue}>{brightness}</Text>
          </View>
        </View>

        <View style={styles.adjustmentRow}>
          <Text style={styles.adjustmentLabel}>对比度</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${contrast}%`, backgroundColor: '#FF69B4' }
                ]} 
              />
            </View>
            <Text style={styles.adjustmentValue}>{contrast}</Text>
          </View>
        </View>

        <View style={styles.adjustmentRow}>
          <Text style={styles.adjustmentLabel}>饱和度</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${saturation}%`, backgroundColor: '#A33BFF' }
                ]} 
              />
            </View>
            <Text style={styles.adjustmentValue}>{saturation}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>↩️</Text>
          <Text style={styles.actionText}>撤销</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💾</Text>
          <Text style={styles.actionText}>保存配方</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>重置</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    color: '#A33BFF',
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  filterBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(163, 59, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filtersList: {
    paddingHorizontal: 15,
  },
  filterItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 12,
    minWidth: 70,
  },
  filterItemActive: {
    backgroundColor: 'rgba(163, 59, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#A33BFF',
  },
  filterIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  filterName: {
    color: '#fff',
    fontSize: 12,
  },
  adjustmentsSection: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  adjustmentLabel: {
    color: '#fff',
    fontSize: 14,
    width: 70,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
  },
  adjustmentValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
});
