import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

// 模拟照片数据
const MOCK_PHOTOS = Array.from({ length: 24 }, (_, i) => ({
  id: `photo-${i}`,
  uri: `https://picsum.photos/400/400?random=${i}`,
  timestamp: Date.now() - i * 86400000,
  favorite: i % 5 === 0,
  edited: i % 3 === 0,
}));

export default function GalleryScreen({ onPhotoSelect, onClose }: any) {
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'edited'>('all');
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const toggleFavorite = (photoId: string) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, favorite: !photo.favorite }
          : photo
      )
    );
  };

  const deleteSelected = () => {
    Alert.alert(
      '删除照片',
      `确定要删除 ${selectedPhotos.length} 张照片吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.id)));
            setSelectedPhotos([]);
            Alert.alert('成功', '照片已删除');
          },
        },
      ]
    );
  };

  const filteredPhotos = photos.filter(photo => {
    if (filterMode === 'favorites' && !photo.favorite) return false;
    if (filterMode === 'edited' && !photo.edited) return false;
    return true;
  });

  const renderPhoto = ({ item }: any) => {
    const isSelected = selectedPhotos.includes(item.id);
    
    return (
      <TouchableOpacity
        style={styles.photoItem}
        onPress={() => togglePhotoSelection(item.id)}
        onLongPress={() => onPhotoSelect && onPhotoSelect(item)}
      >
        <Image source={{ uri: item.uri }} style={styles.photoImage} />
        
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}
        
        {item.favorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeText}>⭐</Text>
          </View>
        )}
        
        {item.edited && (
          <View style={styles.editedBadge}>
            <Text style={styles.editedBadgeText}>✨</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {item.favorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButton}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>相册</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>
            {selectedPhotos.length > 0 ? `已选 ${selectedPhotos.length}` : '选择'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索照片..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
          onPress={() => setFilterMode('all')}
        >
          <Text style={[styles.filterTabText, filterMode === 'all' && styles.filterTabTextActive]}>
            全部 ({photos.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilterMode('favorites')}
        >
          <Text style={[styles.filterTabText, filterMode === 'favorites' && styles.filterTabTextActive]}>
            收藏 ({photos.filter(p => p.favorite).length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'edited' && styles.filterTabActive]}
          onPress={() => setFilterMode('edited')}
        >
          <Text style={[styles.filterTabText, filterMode === 'edited' && styles.filterTabTextActive]}>
            已编辑 ({photos.filter(p => p.edited).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Grid */}
      <FlatList
        data={filteredPhotos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.photoGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Actions */}
      {selectedPhotos.length > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>分享</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>✨</Text>
            <Text style={styles.actionText}>编辑</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={deleteSelected}>
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionText}>删除</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setSelectedPhotos([])}
          >
            <Text style={styles.actionIcon}>✕</Text>
            <Text style={styles.actionText}>取消</Text>
          </TouchableOpacity>
        </View>
      )}
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
    color: '#A33BFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#1a1a2e',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a1e',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0a0a1e',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterTabActive: {
    backgroundColor: 'rgba(163, 59, 255, 0.2)',
    borderColor: '#A33BFF',
  },
  filterTabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#A33BFF',
    fontWeight: '600',
  },
  photoGrid: {
    padding: 2,
  },
  photoItem: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 2,
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(163, 59, 255, 0.4)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#A33BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    fontSize: 20,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  favoriteBadgeText: {
    fontSize: 16,
  },
  editedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  editedBadgeText: {
    fontSize: 16,
  },
  bottomActions: {
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
