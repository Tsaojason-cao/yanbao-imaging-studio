import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface NavigationHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

/**
 * 通用导航头组件
 * 为所有模块提供统一的导航体验
 */
export function NavigationHeader({
  title,
  showBack = true,
  showHome = false,
  rightAction,
}: NavigationHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleHome = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/" as any);
  };

  const handleRightAction = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    rightAction?.onPress();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BlurView intensity={80} style={styles.blur}>
        <LinearGradient
          colors={["rgba(26, 10, 46, 0.95)", "rgba(45, 27, 78, 0.9)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* 左侧按钮 */}
            <View style={styles.leftSection}>
              {showBack && (
                <Pressable
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  onPress={handleBack}
                >
                  <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </Pressable>
              )}
              {showHome && (
                <Pressable
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  onPress={handleHome}
                >
                  <Ionicons name="home" size={24} color="#FFFFFF" />
                </Pressable>
              )}
            </View>

            {/* 标题 */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* 右侧按钮 */}
            <View style={styles.rightSection}>
              {rightAction && (
                <Pressable
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.iconButtonPressed,
                  ]}
                  onPress={handleRightAction}
                >
                  <Ionicons
                    name={rightAction.icon}
                    size={24}
                    color="#FFFFFF"
                  />
                </Pressable>
              )}
            </View>
          </View>
        </LinearGradient>
      </BlurView>

      {/* 底部分隔线 */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  blur: {
    backgroundColor: "transparent",
  },
  gradient: {
    paddingBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    height: 56,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 80,
  },
  titleSection: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(167, 139, 250, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 80,
    justifyContent: "flex-end",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ scale: 0.95 }],
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
  },
});
