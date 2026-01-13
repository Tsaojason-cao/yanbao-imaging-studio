import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

interface Photo {
  id: string;
  uri: string;
  timestamp: number;
}

interface Preset {
  id: string;
  name: string;
  thumbnail?: string;
}

interface BatchProcessingProps {
  photos: Photo[];
  presets: Preset[];
  onProcessingComplete?: (processedPhotos: Photo[]) => void;
  onCancel?: () => void;
}

export const BatchProcessing: React.FC<BatchProcessingProps> = ({
  photos,
  presets,
  onProcessingComplete,
  onCancel
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // 切换照片选择
  const togglePhotoSelection = useCallback((photoId: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const handleSelectAll = useCallback(() => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)));
    }
  }, [photos, selectedPhotos.size]);

  // 应用预设
  const handleApplyPreset = useCallback(
    async (presetId: string) => {
      if (selectedPhotos.size === 0) {
        Alert.alert('No photos selected', 'Please select at least one photo');
        return;
      }

      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        const selectedPhotoIds = Array.from(selectedPhotos);
        const totalPhotos = selectedPhotoIds.length;

        // 调用后端API应用预设
        const response = await axios.post('/api/batch/apply-preset', {
          photoIds: selectedPhotoIds,
          presetId
        });

        if (response.data.success) {
          setProcessingProgress(100);

          // 延迟显示完成消息
          setTimeout(() => {
            Alert.alert(
              'Success',
              `Applied preset to ${response.data.processedCount} photos`
            );
            setSelectedPhotos(new Set());
            setIsBatchMode(false);

            if (onProcessingComplete) {
              onProcessingComplete(response.data.results);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Batch processing error:', error);
        Alert.alert('Error', 'Failed to apply preset to selected photos');
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedPhotos, onProcessingComplete]
  );

  // 批量导出
  const handleBatchExport = useCallback(async () => {
    if (selectedPhotos.size === 0) {
      Alert.alert('No photos selected', 'Please select at least one photo');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const selectedPhotoIds = Array.from(selectedPhotos);

      const response = await axios.post('/api/batch/export', {
        photoIds: selectedPhotoIds,
        format: 'jpeg',
        quality: 90
      });

      if (response.data.success) {
        setProcessingProgress(100);

        setTimeout(() => {
          Alert.alert(
            'Success',
            `Exported ${response.data.exportedCount} photos`
          );
          setSelectedPhotos(new Set());
          setIsBatchMode(false);
        }, 500);
      }
    } catch (error) {
      console.error('Batch export error:', error);
      Alert.alert('Error', 'Failed to export photos');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPhotos]);

  const renderPhotoItem = ({ item: photo }: { item: Photo }) => {
    const isSelected = selectedPhotos.has(photo.id);

    return (
      <TouchableOpacity
        onPress={() => togglePhotoSelection(photo.id)}
        style={[styles.photoItem, isSelected && styles.photoItemSelected]}
      >
        <Image source={{ uri: photo.uri }} style={styles.photoImage} />
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color="#7c3aed"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPresetItem = ({ item: preset }: { item: Preset }) => (
    <TouchableOpacity
      onPress={() => handleApplyPreset(preset.id)}
      disabled={isProcessing}
      style={[styles.presetButton, isProcessing && styles.presetButtonDisabled]}
    >
      {preset.thumbnail && (
        <Image source={{ uri: preset.thumbnail }} style={styles.presetThumbnail} />
      )}
      <Text style={styles.presetButtonText}>{preset.name}</Text>
    </TouchableOpacity>
  );

  if (!isBatchMode) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setIsBatchMode(true)}
          style={styles.enterBatchModeButton}
        >
          <MaterialCommunityIcons name="checkbox-multiple-marked" size={20} color="white" />
          <Text style={styles.enterBatchModeButtonText}>Batch Mode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 批量模式头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setIsBatchMode(false)}
          disabled={isProcessing}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Batch Mode ({selectedPhotos.size}/{photos.length})
        </Text>

        <TouchableOpacity
          onPress={handleSelectAll}
          disabled={isProcessing}
        >
          <MaterialCommunityIcons
            name={selectedPhotos.size === photos.length ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* 照片网格 */}
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        style={styles.photoGrid}
        scrollEnabled={!isProcessing}
      />

      {/* 预设应用 */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Apply Preset</Text>
        <FlatList
          data={presets}
          renderItem={renderPresetItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetsList}
        />
      </View>

      {/* 处理进度 */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.processingText}>
            Processing... {Math.round(processingProgress)}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${processingProgress}%` }
              ]}
            />
          </View>
        </View>
      )}

      {/* 底部操作 */}
      {!isProcessing && selectedPhotos.size > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={handleBatchExport}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="download" size={20} color="white" />
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPhotos(new Set())}
            style={[styles.actionButton, styles.actionButtonSecondary]}
          >
            <MaterialCommunityIcons name="close" size={20} color="white" />
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  enterBatchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
    paddingVertical: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    marginHorizontal: 16
  },
  enterBatchModeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  photoGrid: {
    flex: 1,
    paddingHorizontal: 4
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a'
  },
  photoItemSelected: {
    borderWidth: 3,
    borderColor: '#7c3aed'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 2
  },
  presetsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  presetsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  presetsList: {
    marginHorizontal: -16,
    paddingHorizontal: 16
  },
  presetButton: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  presetButtonDisabled: {
    opacity: 0.5
  },
  presetThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginBottom: 4
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  processingContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    gap: 12
  },
  processingText: {
    color: '#fff',
    fontSize: 14,
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
  bottomActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 6
  },
  actionButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
