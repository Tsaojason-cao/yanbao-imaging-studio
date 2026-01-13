/**
 * 雁寶記憶按鈕組件
 * YanBao Memory Button Component
 * 
 * 功能：
 * - 在拍照和編輯頁面顯示記憶按鈕
 * - 點擊後彈窗詢問是否存入記憶
 * - 成功存入後顯示反饋動畫
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Animated,
  StyleSheet,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { YanBaoMemory, SaveMemoryRequest, SaveMemoryResult } from '../types/memory';

interface YanBaoMemoryButtonProps {
  onSaveMemory: (request: SaveMemoryRequest) => Promise<SaveMemoryResult>;
  currentParameters: {
    optical: any;
    beauty: any;
    filter: any;
    arPose?: any;
    environment: any;
  };
  mode?: 'camera' | 'edit';
  onSuccess?: (memory: YanBaoMemory) => void;
  onError?: (error: Error) => void;
}

export const YanBaoMemoryButton: React.FC<YanBaoMemoryButtonProps> = ({
  onSaveMemory,
  currentParameters,
  mode = 'camera',
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(0);

  // 按鈕按下效果
  const handleButtonPress = useCallback(async () => {
    // 觸覺反饋
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowConfirmModal(true);
  }, []);

  // 確認保存記憶
  const handleConfirmSave = useCallback(async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      // 觸覺反饋
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // 構建記憶保存請求
      const request: SaveMemoryRequest = {
        optical: currentParameters.optical,
        beauty: currentParameters.beauty,
        filter: currentParameters.filter,
        arPose: currentParameters.arPose,
        environment: currentParameters.environment,
        customName: customName || undefined,
      };

      // 調用保存函數
      const result = await onSaveMemory(request);

      if (result.success) {
        // 顯示成功動畫
        setShowSuccessAnimation(true);
        
        // 播放成功動畫
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // 強烈觸覺反饋
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // 調用成功回調
        if (onSuccess) {
          onSuccess(result.memory);
        }

        // 2 秒後隱藏成功動畫
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setCustomName('');
        }, 2000);

        // 顯示成功提示
        Alert.alert(
          '✨ 記憶已保存',
          `『${result.memory.name}』已成功存入雁寶記憶庫！`,
          [{ text: '確定', onPress: () => {} }]
        );
      } else {
        throw new Error(result.message || '保存失敗');
      }
    } catch (error) {
      // 失敗觸覺反饋
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const err = error instanceof Error ? error : new Error('未知錯誤');
      if (onError) {
        onError(err);
      }

      Alert.alert('保存失敗', err.message, [{ text: '確定', onPress: () => {} }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentParameters, customName, onSaveMemory, onSuccess, onError]);

  // 取消保存
  const handleCancel = useCallback(() => {
    setShowConfirmModal(false);
    setCustomName('');
  }, []);

  return (
    <>
      {/* 記憶按鈕 */}
      <TouchableOpacity
        style={styles.memoryButton}
        onPress={handleButtonPress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Heart
            size={24}
            color="#FF6B9D"
            fill="#FF6B9D"
            strokeWidth={2}
          />
        </Animated.View>
        <Text style={styles.buttonLabel}>記憶</Text>
      </TouchableOpacity>

      {/* 確認對話框 */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 標題 */}
            <Text style={styles.modalTitle}>
              ✨ 要存入『雁寶記憶』嗎？
            </Text>

            {/* 描述 */}
            <Text style={styles.modalDescription}>
              當前的光學校準、美顏參數、濾鏡設置和 AR 模板將被保存，
              下次可快速還原這個風格！
            </Text>

            {/* 自定義名稱輸入 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>記憶名稱 (可選)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputPlaceholder}>
                  {customName || '系統將自動命名...'}
                </Text>
              </View>
            </View>

            {/* 按鈕組 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleConfirmSave}
                disabled={isLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {isLoading ? '保存中...' : '確認保存'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 成功動畫 */}
      {showSuccessAnimation && (
        <View style={styles.successContainer}>
          <Animated.View
            style={[
              styles.successContent,
              {
                opacity: Animated.divide(
                  Animated.add(opacityAnim, 1),
                  2
                ),
              },
            ]}
          >
            <Heart
              size={48}
              color="#FF6B9D"
              fill="#FF6B9D"
              strokeWidth={2}
            />
            <Text style={styles.successText}>記憶已保存！</Text>
          </Animated.View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // 記憶按鈕
  memoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#FF6B9D',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    marginTop: 4,
  },

  // 模態對話框
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },

  // 輸入框
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#999999',
  },

  // 按鈕組
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  confirmButton: {
    backgroundColor: '#FF6B9D',
    borderWidth: 0,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 成功動畫
  successContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  successContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B9D',
    marginTop: 12,
  },
});
