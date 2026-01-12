import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useColors } from "@/hooks/use-colors";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  delay?: number;
}

/**
 * StatsCard - 统计卡片组件
 * 
 * 带有进入动画的统计信息卡片
 */
export function StatsCard({ label, value, icon, delay = 0 }: StatsCardProps) {
  const colors = useColors();
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withSpring(0));
    opacity.value = withDelay(delay, withSpring(1));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 20,
          borderWidth: 2,
          borderColor: colors.border,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        },
        animatedStyle,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {icon && <View>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 4,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.foreground,
            }}
          >
            {value}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
