import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const rotation = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    // 轮盘缓慢旋转动画
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );

    // 星光闪烁动画
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
    opacity: interpolate(sparkleScale.value, [1, 1.3], [0.6, 1]),
  }));

  const handleNavigation = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(route as any);
  };

  const wheelButtons = [
    { icon: "camera", label: "相机", route: "/(tabs)/camera", angle: 0 },
    { icon: "create", label: "编辑", route: "/(tabs)/edit", angle: 72 },
    { icon: "images", label: "相册", route: "/(tabs)/gallery", angle: 144 },
    { icon: "settings", label: "设置", route: "/(tabs)/settings", angle: 216 },
    { icon: "home", label: "主页", route: "/(tabs)/", angle: 288 },
  ];

  return (
    <LinearGradient
      colors={["#E9D5FF" as const, "#FBE7F3" as const, "#FCE7F3" as const]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部统计卡片 - 完全克隆设计稿 */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>数据统计</Text>
            <View style={styles.statsCard}>
              <BlurView intensity={30} style={styles.statsBlur}>
                <LinearGradient
                  colors={["rgba(168, 85, 247, 0.15)" as const, "rgba(236, 72, 153, 0.15)" as const]}
                  style={styles.statsGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
                        <Ionicons name="camera" size={28} color="#F59E0B" />
                      </View>
                      <Text style={styles.statValue}>12</Text>
                      <Text style={styles.statLabel}>已拍摄</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: "#FCE7F3" }]}>
                        <Ionicons name="brush" size={28} color="#EC4899" />
                      </View>
                      <Text style={styles.statValue}>8</Text>
                      <Text style={styles.statLabel}>已编辑</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <View style={[styles.statIcon, { backgroundColor: "#EDE9FE" }]}>
                        <MaterialCommunityIcons name="brain" size={28} color="#8B5CF6" />
                      </View>
                      <Text style={styles.statValue}>3</Text>
                      <Text style={styles.statLabel}>记忆预设</Text>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          </View>

          {/* 库洛米星光轮盘 - 完全克隆设计稿 */}
          <View style={styles.wheelSection}>
            {/* 星光粒子背景 */}
            <View style={styles.sparklesContainer}>
              {[...Array(12)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.sparkle,
                    sparkleAnimatedStyle,
                    {
                      top: `${15 + Math.random() * 70}%`,
                      left: `${10 + Math.random() * 80}%`,
                      opacity: 0.3 + Math.random() * 0.4,
                    },
                  ]}
                >
                  <Ionicons name="star" size={16 + Math.random() * 12} color="#F472B6" />
                </Animated.View>
              ))}
            </View>

            {/* 轮盘容器 */}
            <View style={styles.wheelContainer}>
              {/* 外圈装饰 */}
              <Animated.View style={[styles.wheelOuter, wheelAnimatedStyle]}>
                <LinearGradient
                  colors={["#A78BFA" as const, "#EC4899" as const, "#F472B6" as const]}
                  style={styles.wheelOuterGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>

              {/* 中圈 */}
              <View style={styles.wheelMiddle}>
                <BlurView intensity={40} style={styles.wheelMiddleBlur}>
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.9)" as const, "rgba(255, 255, 255, 0.7)" as const]}
                    style={styles.wheelMiddleGradient}
                  />
                </BlurView>
              </View>

              {/* 中心库洛米 */}
              <View style={styles.centerKuromi}>
                <View style={styles.kuromiHead}>
                  {/* 耳朵 */}
                  <View style={[styles.kuromiEar, styles.kuromiEarLeft]} />
                  <View style={[styles.kuromiEar, styles.kuromiEarRight]} />

                  {/* 脸 */}
                  <View style={styles.kuromiFace}>
                    <View style={styles.kuromiEyes}>
                      <View style={styles.kuromiEye}>
                        <View style={styles.kuromiEyeHighlight} />
                      </View>
                      <View style={styles.kuromiEye}>
                        <View style={styles.kuromiEyeHighlight} />
                      </View>
                    </View>
                    <View style={styles.kuromiNose} />
                  </View>

                  {/* 蝴蝶结 */}
                  <View style={styles.kuromiBow}>
                    <View style={styles.bowLeft} />
                    <View style={styles.bowCenter} />
                    <View style={styles.bowRight} />
                    <View style={styles.bowSkull}>
                      <View style={styles.skullDot} />
                    </View>
                  </View>
                </View>
              </View>

              {/* 5个功能按钮 */}
              {wheelButtons.map((button, index) => {
                const radius = 110;
                const angleRad = (button.angle * Math.PI) / 180;
                const x = radius * Math.cos(angleRad - Math.PI / 2);
                const y = radius * Math.sin(angleRad - Math.PI / 2);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.wheelButton,
                      {
                        transform: [{ translateX: x }, { translateY: y }],
                      },
                    ]}
                    onPress={() => handleNavigation(button.route)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={["#A78BFA" as const, "#EC4899" as const]}
                      style={styles.wheelButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name={button.icon as any} size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={styles.wheelButtonLabel}>{button.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.wheelHint}>点击图标快速进入</Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.3)",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  statsGradient: {
    padding: 24,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1F2937",
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    marginHorizontal: 8,
  },
  wheelSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    position: "relative",
  },
  sparklesContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  sparkle: {
    position: "absolute",
  },
  wheelContainer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  wheelOuter: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    padding: 4,
  },
  wheelOuterGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 130,
  },
  wheelMiddle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: "hidden",
  },
  wheelMiddleBlur: {
    width: "100%",
    height: "100%",
  },
  wheelMiddleGradient: {
    width: "100%",
    height: "100%",
  },
  centerKuromi: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
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
    left: 12,
    transform: [{ rotate: "-15deg" }],
  },
  kuromiEarRight: {
    right: 12,
    transform: [{ rotate: "15deg" }],
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
  kuromiBow: {
    position: "absolute",
    top: -8,
    right: -6,
    width: 42,
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
    transform: [{ scaleX: 1.3 }],
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
    transform: [{ scaleX: 1.3 }],
  },
  bowSkull: {
    position: "absolute",
    top: 3,
    left: 14,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  skullDot: {
    width: 9,
    height: 9,
    backgroundColor: "#1F2937",
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  wheelButton: {
    position: "absolute",
    alignItems: "center",
    gap: 6,
  },
  wheelButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  wheelButtonLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wheelHint: {
    marginTop: 32,
    fontSize: 15,
    color: "#8B5CF6",
    fontWeight: "600",
  },
});
