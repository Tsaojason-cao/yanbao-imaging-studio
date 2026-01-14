import React from 'react';
import { Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * 流体手势处理器
 * 实现全屏无返回键的流体手势操作
 */
export function useFluidGesture() {
  const navigation = useNavigation();
  const translateX = new Animated.Value(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10 && gestureState.dx > 0;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx > 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 100 && gestureState.vx > 0.3) {
        Animated.timing(translateX, {
          toValue: 400,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          navigation.goBack();
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return { panResponder, translateX };
}
