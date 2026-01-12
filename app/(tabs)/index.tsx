import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDecay,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import type { ViewStyle } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const velocity = useSharedValue(0);

  useEffect(() => {
    // 轮盘旋转动画 - 20秒一圈
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );
    // 中心脉冲动画
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1
    );
  }, []);

  // 手势拖动旋转轮盘
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      velocity.value = event.velocityX;
      rotation.value += event.translationX * 0.2;
    })
    .onEnd(() => {
      rotation.value = withDecay({
        velocity: velocity.value * 0.001,
        deceleration: 0.998,
      });
    });

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 轮盘按钮配置 - 5个按钮环绕中心
  const wheelButtons = [
    { icon: "camera", label: "相机", route: "/camera", angle: -90, color: "#A78BFA" },
    { icon: "create", label: "编辑", route: "/edit", angle: -18, color: "#F59E0B" },
    { icon: "images", label: "相册", route: "/(tabs)/gallery", angle: 54, color: "#EC4899" },
    { icon: "settings", label: "设置", route: "/(tabs)/settings", angle: 126, color: "#8B5CF6" },
    { icon: "home", label: "主页", route: "/(tabs)/", angle: 198, color: "#F472B6" },
  ];

  const handleButtonPress = (route: string) => {
    // 触觉反馈
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(route as any);
  };

  const getButtonPosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      left: radius + radius * Math.cos(radian) - 40,
      top: radius + radius * Math.sin(radian) - 40,
    };
  };

  return (
    <LinearGradient
      colors={["#E9D5FF", "#DDD6FE", "#FCA5A5"]}
      style={{ flex: 1 } as ViewStyle}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>YanBao AI</Text>
          </View>

          {/* 统计卡片 */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="camera-outline" size={36} color="#9CA3AF" />
              <Text style={styles.statLabel}>已拍摄</Text>
              <Text style={styles.statValue}>
                12 <Text style={styles.statUnit}>张</Text>
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="create-outline" size={36} color="#9CA3AF" />
              <Text style={styles.statLabel}>已编辑</Text>
              <Text style={styles.statValue}>
                8 <Text style={styles.statUnit}>张</Text>
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="brain" size={36} color="#9CA3AF" />
              <Text style={styles.statLabel}>记忆预设</Text>
              <Text style={styles.statValue}>
                3 <Text style={styles.statUnit}>个</Text>
              </Text>
            </View>
          </View>

          {/* 库洛米轮盘导航 */}
          <View style={styles.wheelContainer}>
            {/* 彩虹光晕背景 */}
            <View style={styles.rainbowGlow}>
              <LinearGradient
                colors={["#A78BFA", "#F472B6", "#FCA5A5", "#FBBF24", "#A78BFA"]}
                style={styles.rainbowGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>

            {/* 轮盘背景 - 支持手势拖动 */}
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.wheel, wheelAnimatedStyle]}>
                <View style={styles.wheelRing}>
                  <BlurView intensity={20} style={styles.wheelBlur} />
                </View>
              </Animated.View>
            </GestureDetector>

            {/* 5个环绕按钮 */}
            {wheelButtons.map((button, index) => {
              const position = getButtonPosition(button.angle, 130);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.wheelButton, position]}
                  onPress={() => handleButtonPress(button.route)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.wheelButtonInner, { backgroundColor: "rgba(255, 255, 255, 0.95)" }]}>
                    <Ionicons name={button.icon as any} size={32} color={button.color} />
                  </View>
                  <Text style={styles.wheelButtonLabel}>{button.label}</Text>
                </TouchableOpacity>
              );
            })}

            {/* 中心库洛米角色 */}
            <Animated.View style={[styles.centerCharacter, pulseAnimatedStyle]}>
              <View style={styles.kuromiContainer}>
                {/* 库洛米头部 */}
                <View style={styles.kuromiHead}>
                  {/* 左耳 */}
                  <View style={[styles.kuromiEar, styles.kuromiEarLeft]}>
                    <View style={styles.kuromiEarInner} />
                  </View>
                  {/* 右耳 */}
                  <View style={[styles.kuromiEar, styles.kuromiEarRight]}>
                    <View style={styles.kuromiEarInner} />
                  </View>

                  {/* 脸部 */}
                  <View style={styles.kuromiFace}>
                    {/* 眼睛 */}
                    <View style={styles.kuromiEyes}>
                      <View style={styles.kuromiEye}>
                        <View style={styles.kuromiEyeHighlight} />
                      </View>
                      <View style={styles.kuromiEye}>
                        <View style={styles.kuromiEyeHighlight} />
                      </View>
                    </View>
                    {/* 鼻子 */}
                    <View style={styles.kuromiNose} />
                    {/* 嘴巴 */}
                    <View style={styles.kuromiMouth} />
                  </View>

                  {/* 粉色蝴蝶结 */}
                  <View style={styles.kuromiBow}>
                    <View style={styles.bowLeft} />
                    <View style={styles.bowCenter} />
                    <View style={styles.bowRight} />
                    {/* 骷髅头装饰 */}
                    <View style={styles.bowSkull}>
                      <View style={styles.skullCircle} />
                    </View>
                  </View>
                </View>

                {/* 身体（小爪子） */}
                <View style={styles.kuromiBody}>
                  <View style={styles.kuromiPaw} />
                  <View style={styles.kuromiPaw} />
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -1,
  },
  statsCard: {
    marginHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 28,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -1,
  },
  statUnit: {
    fontSize: 18,
    fontWeight: "600",
  },
  wheelContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    height: 420,
    position: "relative",
  },
  rainbowGlow: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    opacity: 0.3,
  },
  rainbowGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 170,
  },
  wheel: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelRing: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  wheelBlur: {
    width: "100%",
    height: "100%",
  },
  wheelButton: {
    position: "absolute",
    width: 80,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 1)",
  },
  wheelButtonLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  centerCharacter: {
    position: "absolute",
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiContainer: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiHead: {
    width: 90,
    height: 90,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: -5,
    width: 24,
    height: 36,
    backgroundColor: "#2D3748",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  kuromiEarLeft: {
    left: 8,
    transform: [{ rotate: "-15deg" }],
  },
  kuromiEarRight: {
    right: 8,
    transform: [{ rotate: "15deg" }],
  },
  kuromiEarInner: {
    width: 16,
    height: 24,
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 4,
  },
  kuromiFace: {
    width: 70,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 18,
    marginTop: 8,
  },
  kuromiEye: {
    width: 14,
    height: 18,
    backgroundColor: "#1F2937",
    borderRadius: 7,
    position: "relative",
  },
  kuromiEyeHighlight: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 5,
    height: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 2.5,
  },
  kuromiNose: {
    width: 8,
    height: 6,
    backgroundColor: "#F472B6",
    borderRadius: 4,
    marginTop: 4,
  },
  kuromiMouth: {
    width: 20,
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#F472B6",
    marginTop: 2,
  },
  kuromiBow: {
    position: "absolute",
    top: -8,
    right: -5,
    width: 40,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bowLeft: {
    width: 16,
    height: 16,
    backgroundColor: "#F472B6",
    borderRadius: 8,
    transform: [{ scaleX: 1.2 }],
  },
  bowCenter: {
    width: 8,
    height: 12,
    backgroundColor: "#F472B6",
    borderRadius: 4,
    marginHorizontal: -2,
  },
  bowRight: {
    width: 16,
    height: 16,
    backgroundColor: "#F472B6",
    borderRadius: 8,
    transform: [{ scaleX: 1.2 }],
  },
  bowSkull: {
    position: "absolute",
    top: 2,
    left: 12,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skullCircle: {
    width: 10,
    height: 10,
    backgroundColor: "#1F2937",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  kuromiBody: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  kuromiPaw: {
    width: 12,
    height: 12,
    backgroundColor: "#2D3748",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
