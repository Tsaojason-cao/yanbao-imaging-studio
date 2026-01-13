/**
 * yanbao AI 手勢交互系統
 * 支持左右滑動、上下滑動、雙指縮放、觸覺反饋
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Animated,
  GestureResponderEvent,
  PanResponder,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// ============================================
// 手勢交互配置
// ============================================
interface GestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onParameterChange?: (value: number) => void;
  onPinch?: (scale: number) => void;
  enableHaptics?: boolean;
  swipeThreshold?: number;
  parameterSensitivity?: number;
}

// ============================================
// 手勢交互 Hook
// ============================================
export const useGestureInteraction = (config: GestureConfig) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onParameterChange,
    onPinch,
    enableHaptics = true,
    swipeThreshold = 50,
    parameterSensitivity = 0.5,
  } = config;

  const startX = useRef(0);
  const startY = useRef(0);
  const startDistance = useRef(0);
  const [isGestureActive, setIsGestureActive] = useState(false);

  // 觸覺反饋
  const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics) return;
    
    try {
      if (type === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'heavy') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      // 某些設備可能不支持觸覺反饋
    }
  };

  // 計算兩點之間的距離（用於雙指縮放）
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // 處理手勢開始
  const handleGestureStart = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    startX.current = nativeEvent.pageX;
    startY.current = nativeEvent.pageY;
    setIsGestureActive(true);
  };

  // 處理手勢移動
  const handleGestureMove = (event: GestureResponderEvent) => {
    if (!isGestureActive) return;

    const { nativeEvent } = event;
    const currentX = nativeEvent.pageX;
    const currentY = nativeEvent.pageY;

    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    // 檢測左右滑動
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > swipeThreshold && onSwipeRight) {
        triggerHaptic('medium');
        onSwipeRight();
        setIsGestureActive(false);
      } else if (deltaX < -swipeThreshold && onSwipeLeft) {
        triggerHaptic('medium');
        onSwipeLeft();
        setIsGestureActive(false);
      }
    }
    // 檢測上下滑動
    else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > swipeThreshold && onSwipeDown) {
        triggerHaptic('medium');
        onSwipeDown();
        setIsGestureActive(false);
      } else if (deltaY < -swipeThreshold && onSwipeUp) {
        triggerHaptic('medium');
        onSwipeUp();
        setIsGestureActive(false);
      }

      // 上下滑動調整參數
      if (onParameterChange) {
        const parameterDelta = -deltaY * parameterSensitivity;
        onParameterChange(parameterDelta);
      }
    }
  };

  // 處理手勢結束
  const handleGestureEnd = () => {
    setIsGestureActive(false);
    startX.current = 0;
    startY.current = 0;
  };

  return {
    handleGestureStart,
    handleGestureMove,
    handleGestureEnd,
    triggerHaptic,
    isGestureActive,
  };
};

// ============================================
// 手勢交互容器組件
// ============================================
interface GestureContainerProps {
  children: React.ReactNode;
  config: GestureConfig;
  style?: any;
}

export const GestureContainer: React.FC<GestureContainerProps> = ({
  children,
  config,
  style,
}) => {
  const { handleGestureStart, handleGestureMove, handleGestureEnd } =
    useGestureInteraction(config);

  return (
    <View
      style={style}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleGestureStart}
      onResponderMove={handleGestureMove}
      onResponderRelease={handleGestureEnd}
      onResponderTerminate={handleGestureEnd}
    >
      {children}
    </View>
  );
};

// ============================================
// 參數調整手勢組件
// ============================================
interface ParameterGestureProps {
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange: (value: number) => void;
  children: React.ReactNode;
  enableHaptics?: boolean;
}

export const ParameterGesture: React.FC<ParameterGestureProps> = ({
  value,
  minValue = 0,
  maxValue = 100,
  onChange,
  children,
  enableHaptics = true,
}) => {
  const { handleGestureStart, handleGestureMove, handleGestureEnd, triggerHaptic } =
    useGestureInteraction({
      onParameterChange: (delta) => {
        const newValue = Math.max(
          minValue,
          Math.min(maxValue, value + delta)
        );
        onChange(newValue);
        
        // 每 10 個單位觸發一次觸覺反饋
        if (Math.floor(newValue / 10) !== Math.floor(value / 10)) {
          triggerHaptic('light');
        }
      },
      enableHaptics,
      parameterSensitivity: 0.3,
    });

  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleGestureStart}
      onResponderMove={handleGestureMove}
      onResponderRelease={handleGestureEnd}
      onResponderTerminate={handleGestureEnd}
    >
      {children}
    </View>
  );
};

// ============================================
// 濾鏡切換手勢組件
// ============================================
interface FilterGestureProps {
  filters: Array<{ id: string; name: string }>;
  currentFilterIndex: number;
  onFilterChange: (index: number) => void;
  children: React.ReactNode;
  enableHaptics?: boolean;
}

export const FilterGesture: React.FC<FilterGestureProps> = ({
  filters,
  currentFilterIndex,
  onFilterChange,
  children,
  enableHaptics = true,
}) => {
  const { handleGestureStart, handleGestureMove, handleGestureEnd, triggerHaptic } =
    useGestureInteraction({
      onSwipeLeft: () => {
        const nextIndex = (currentFilterIndex + 1) % filters.length;
        onFilterChange(nextIndex);
        triggerHaptic('medium');
      },
      onSwipeRight: () => {
        const prevIndex =
          currentFilterIndex === 0 ? filters.length - 1 : currentFilterIndex - 1;
        onFilterChange(prevIndex);
        triggerHaptic('medium');
      },
      enableHaptics,
      swipeThreshold: 30,
    });

  return (
    <View
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleGestureStart}
      onResponderMove={handleGestureMove}
      onResponderRelease={handleGestureEnd}
      onResponderTerminate={handleGestureEnd}
    >
      {children}
    </View>
  );
};

// ============================================
// 快速撤銷手勢檢測
// ============================================
export const useQuickUndo = (onUndo: () => void, enableHaptics = true) => {
  const touchCount = useRef(0);
  const lastTouchTime = useRef(0);

  const handleMultiTouch = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    const currentTime = Date.now();

    // 檢測三指輕點
    if (nativeEvent.touches && nativeEvent.touches.length === 3) {
      if (currentTime - lastTouchTime.current < 300) {
        touchCount.current++;
        if (touchCount.current >= 1) {
          onUndo();
          if (enableHaptics) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          touchCount.current = 0;
        }
      } else {
        touchCount.current = 1;
      }
      lastTouchTime.current = currentTime;
    }
  };

  return { handleMultiTouch };
};

export default GestureContainer;
