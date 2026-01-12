import { Image, View, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

/**
 * 库洛米快门按钮组件
 * 用于相机模块的拍照按钮
 */
export function KuromiShutterButton({ onPress, size = 80 }: { onPress: () => void; size?: number }) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    // 按下动画
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // 触觉反馈
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle, { width: size, height: size }]}
      onTouchStart={handlePress}
    >
      <Animated.Image
        source={require("@/assets/images/kuromi-shutter.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

/**
 * 库洛米骷髅头装饰组件
 * 用于滑杆两端的装饰
 */
export function KuromiSkullDecor({ size = 24 }: { size?: number }) {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { width: size, height: size }]}>
      <Image
        source={require("@/assets/images/kuromi-skull.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

/**
 * 库洛米加载动画组件
 * 用于相册模块的加载状态
 */
export function KuromiLoadingAnimation({ size = 60 }: { size?: number }) {
  const frame = useSharedValue(0);

  useEffect(() => {
    frame.value = withRepeat(
      withTiming(2, { duration: 600, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const frames = [
    require("@/assets/images/kuromi-loading-1.png"),
    require("@/assets/images/kuromi-loading-2.png"),
    require("@/assets/images/kuromi-loading-3.png"),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const frameIndex = Math.floor(frame.value) % frames.length;
    return {
      opacity: 1,
    };
  });

  // 简化版：使用单帧循环动画
  const translateX = useSharedValue(-50);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(50, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const moveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ width: "100%", height: size, justifyContent: "center", alignItems: "center" }}>
      <Animated.View style={[moveStyle, { width: size, height: size }]}>
        <Image
          source={frames[0]}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

/**
 * 库洛米主题滑杆组件
 * 带有骷髅头装饰的滑杆
 */
export function KuromiSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <View style={styles.sliderRow}>
      <View style={styles.skullLeft}>
        <KuromiSkullDecor size={20} />
      </View>
      <View style={styles.sliderContainer}>
        <Animated.Text style={styles.sliderLabel}>{label}</Animated.Text>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              { width: `${value}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.skullRight}>
        <KuromiSkullDecor size={20} />
      </View>
      <Animated.Text style={styles.sliderValue}>{value}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  skullLeft: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  skullRight: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 1,
    gap: 4,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#F472B6",
    borderRadius: 3,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    width: 40,
    textAlign: "right",
  },
});
