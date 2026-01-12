import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface WheelItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

/**
 * WheelNavigation - 星光轮盘导航组件
 * 
 * 圆形轮盘布局，带有旋转动画和星光效果
 */
export function WheelNavigation({ items }: { items: WheelItem[] }) {
  const colors = useColors();
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 缓慢旋转动画
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const radius = 120;
  const angleStep = (2 * Math.PI) / items.length;

  return (
    <View style={styles.container}>
      {/* 中心圆 */}
      <View style={[styles.centerCircle, { backgroundColor: colors.primary }]}>
        <Text style={styles.centerText}>雁宝</Text>
        <Text style={styles.centerSubtext}>AI 影像</Text>
      </View>

      {/* 轮盘背景光晕 */}
      <Animated.View style={[styles.glowRing, animatedStyle]} />

      {/* 导航按钮 */}
      {items.map((item, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <WheelButton
            key={item.id}
            item={item}
            x={x}
            y={y}
            index={index}
          />
        );
      })}
    </View>
  );
}

function WheelButton({
  item,
  x,
  y,
  index,
}: {
  item: WheelItem;
  x: number;
  y: number;
  index: number;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // 脉冲动画
    pulseScale.value = withRepeat(
      withTiming(1.1, {
        duration: 1500 + index * 200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [index]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y },
      { scale: scale.value * pulseScale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <TouchableOpacity
        onPress={item.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            backgroundColor: item.color,
            shadowColor: item.color,
          },
        ]}
      >
        <IconSymbol name={item.icon as any} size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[styles.buttonLabel, { color: colors.foreground }]}>
        {item.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E879F9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  centerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  centerSubtext: {
    fontSize: 10,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 2,
  },
  glowRing: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "#E879F9",
    opacity: 0.3,
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    gap: 8,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
