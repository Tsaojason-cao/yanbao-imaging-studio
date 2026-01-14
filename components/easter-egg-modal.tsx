/**
 * 1017彩蛋展示Modal
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface EasterEggModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  specialEffect?: 'confetti' | 'hearts' | 'fireworks';
}

export function EasterEggModal({
  visible,
  onClose,
  title,
  message,
  specialEffect = 'hearts',
}: EasterEggModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const heartAnims = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
      translateX: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // 触觉反馈
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 入场动画
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 爱心飘落动画
      if (specialEffect === 'hearts') {
        heartAnims.forEach((anim, index) => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(anim.translateY, {
                toValue: -height,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: (Math.random() - 0.5) * 100,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
            ]).start();
          }, index * 200);
        });
      }
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />

        {/* 爱心特效 */}
        {specialEffect === 'hearts' &&
          heartAnims.map((anim, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.heart,
                {
                  left: (width / 20) * (index % 20),
                  bottom: -50,
                  transform: [
                    { translateY: anim.translateY },
                    { translateX: anim.translateX },
                  ],
                  opacity: anim.opacity,
                },
              ]}
            >
              💜
            </Animated.Text>
          ))}

        {/* 内容卡片 */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </ScrollView>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>收下这份心意 💜</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  card: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E879F9',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 28,
    color: '#374151',
    textAlign: 'left',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: '#E879F9',
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heart: {
    position: 'absolute',
    fontSize: 24,
  },
});
