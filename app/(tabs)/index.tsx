import { View, Text, Pressable, StyleSheet, Dimensions, Platform, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Canvas, LinearGradient as SkiaLinearGradient, Rect, vec, Blur, Paint } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type CardType = "stats" | "memory" | "ai-lab";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // 卡片状态
  const [activeCard, setActiveCard] = useState<CardType>("stats");
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  
  // 动画值
  const flowAnimation = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);
  const kuromiScale = useSharedValue(1);
  const kuromiRotate = useSharedValue(0);
  const quickMenuScale = useSharedValue(0);
  const quickMenuOpacity = useSharedValue(0);

  useEffect(() => {
    // 流光动画
    flowAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // 库洛米呼吸动画
    kuromiScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    // 库洛米旋转动画
    kuromiRotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  // 卡片滑动手势
  const cardGesture = Gesture.Pan()
    .onUpdate((event) => {
      cardTranslateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY < -100) {
        // 向上滑动
        runOnJS(switchCard)("next");
      } else if (event.translationY > 100) {
        // 向下滑动
        runOnJS(switchCard)("prev");
      }
      cardTranslateY.value = withSpring(0);
    });

  const switchCard = (direction: "next" | "prev") => {
    const cards: CardType[] = ["stats", "memory", "ai-lab"];
    const currentIndex = cards.indexOf(activeCard);
    
    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActiveCard(cards[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
      setActiveCard(cards[prevIndex]);
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // 库洛米助手点击
  const handleKuromiPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setShowQuickMenu(!showQuickMenu);
    
    if (!showQuickMenu) {
      quickMenuScale.value = withSpring(1);
      quickMenuOpacity.value = withTiming(1, { duration: 200 });
    } else {
      quickMenuScale.value = withTiming(0, { duration: 200 });
      quickMenuOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  // 快捷入口导航
  const handleQuickNav = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setShowQuickMenu(false);
    quickMenuScale.value = withTiming(0, { duration: 200 });
    quickMenuOpacity.value = withTiming(0, { duration: 200 });

    router.push(route as any);
  };

  // 动画样式
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const kuromiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: kuromiScale.value },
      { rotate: `${kuromiRotate.value}deg` },
    ],
  }));

  const quickMenuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quickMenuScale.value }],
    opacity: quickMenuOpacity.value,
  }));

  // 渲染卡片内容
  const renderCardContent = () => {
    switch (activeCard) {
      case "stats":
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>数据统计</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: "rgba(139, 92, 246, 0.2)" }]}>
                  <Ionicons name="camera" size={32} color="#A78BFA" />
                </View>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>已拍摄</Text>
              </View>

              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: "rgba(236, 72, 153, 0.2)" }]}>
                  <Ionicons name="brush" size={32} color="#F472B6" />
                </View>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>已编辑</Text>
              </View>

              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                  <MaterialCommunityIcons name="brain" size={32} color="#34D399" />
                </View>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>记忆预设</Text>
              </View>
            </View>
          </View>
        );

      case "memory":
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>记忆预设</Text>
            <View style={styles.memoryList}>
              <View style={styles.memoryItem}>
                <View style={styles.memoryIcon}>
                  <Ionicons name="sunny" size={24} color="#F59E0B" />
                </View>
                <View style={styles.memoryInfo}>
                  <Text style={styles.memoryName}>阳光明媚</Text>
                  <Text style={styles.memoryDesc}>适合户外人像</Text>
                </View>
              </View>

              <View style={styles.memoryItem}>
                <View style={styles.memoryIcon}>
                  <Ionicons name="moon" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.memoryInfo}>
                  <Text style={styles.memoryName}>夜幕降临</Text>
                  <Text style={styles.memoryDesc}>适合夜景拍摄</Text>
                </View>
              </View>

              <View style={styles.memoryItem}>
                <View style={styles.memoryIcon}>
                  <Ionicons name="heart" size={24} color="#EC4899" />
                </View>
                <View style={styles.memoryInfo}>
                  <Text style={styles.memoryName}>浪漫时刻</Text>
                  <Text style={styles.memoryDesc}>适合情侣合影</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case "ai-lab":
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>AI 实验室</Text>
            <View style={styles.aiGrid}>
              <Pressable style={styles.aiFeature}>
                <View style={[styles.aiIcon, { backgroundColor: "rgba(139, 92, 246, 0.2)" }]}>
                  <MaterialCommunityIcons name="auto-fix" size={28} color="#A78BFA" />
                </View>
                <Text style={styles.aiLabel}>一键美化</Text>
              </Pressable>

              <Pressable style={styles.aiFeature}>
                <View style={[styles.aiIcon, { backgroundColor: "rgba(236, 72, 153, 0.2)" }]}>
                  <MaterialCommunityIcons name="palette" size={28} color="#F472B6" />
                </View>
                <Text style={styles.aiLabel}>风格迁移</Text>
              </Pressable>

              <Pressable style={styles.aiFeature}>
                <View style={[styles.aiIcon, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                  <MaterialCommunityIcons name="magic-staff" size={28} color="#34D399" />
                </View>
                <Text style={styles.aiLabel}>智能修复</Text>
              </Pressable>

              <Pressable style={styles.aiFeature}>
                <View style={[styles.aiIcon, { backgroundColor: "rgba(245, 158, 11, 0.2)" }]}>
                  <MaterialCommunityIcons name="creation" size={28} color="#FBBF24" />
                </View>
                <Text style={styles.aiLabel}>AI生成</Text>
              </Pressable>
            </View>
          </View>
        );
    }
  };

  const quickMenuItems = [
    { icon: "camera", label: "相机", route: "/(tabs)/camera", color: "#A78BFA" },
    { icon: "create", label: "编辑", route: "/(tabs)/edit", color: "#F472B6" },
    { icon: "images", label: "相册", route: "/(tabs)/gallery", color: "#34D399" },
    { icon: "settings", label: "设置", route: "/(tabs)/settings", color: "#FBBF24" },
  ];

  return (
    <View style={styles.container}>
      {/* 深色金属感流光背景 */}
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <SkiaLinearGradient
            start={vec(0, 0)}
            end={vec(SCREEN_WIDTH, SCREEN_HEIGHT)}
            colors={["#1a0a2e", "#2d1b4e", "#1a0a2e"]}
          />
        </Rect>
      </Canvas>

      {/* 流光效果层 */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>
        <LinearGradient
          colors={["transparent", "rgba(167, 139, 250, 0.3)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* 顶部标题 */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.appTitle}>YanBao AI</Text>
        <Text style={styles.appSubtitle}>流体美学 · 私人影像工作室</Text>
      </View>

      {/* 层叠式悬浮卡片 */}
      <View style={styles.cardsContainer}>
        <GestureDetector gesture={cardGesture}>
          <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
            {/* 背景卡片（层叠效果） */}
            <View style={[styles.card, styles.cardBackground, { transform: [{ scale: 0.95 }, { translateY: -20 }] }]} />
            <View style={[styles.card, styles.cardBackground, { transform: [{ scale: 0.97 }, { translateY: -10 }] }]} />

            {/* 主卡片 */}
            <View style={styles.card}>
              <BlurView intensity={60} style={styles.cardBlur}>
                <LinearGradient
                  colors={["rgba(45, 27, 78, 0.8)", "rgba(26, 10, 46, 0.6)"]}
                  style={styles.cardGradient}
                >
                  {renderCardContent()}
                </LinearGradient>
              </BlurView>
            </View>

            {/* 滑动提示 */}
            <View style={styles.swipeHint}>
              <View style={styles.swipeIndicator} />
              <Text style={styles.swipeText}>上下滑动切换</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* 库洛米浮动助手 */}
      <Animated.View style={[styles.kuromiAssistant, kuromiAnimatedStyle]}>
        <Pressable onPress={handleKuromiPress}>
          <View style={styles.kuromiContainer}>
            {/* 发光光晕 */}
            <View style={styles.kuromiGlow} />

            {/* 库洛米头像 */}
            <View style={styles.kuromiHead}>
              <View style={[styles.kuromiEar, styles.kuromiEarLeft]} />
              <View style={[styles.kuromiEar, styles.kuromiEarRight]} />
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
        </Pressable>
      </Animated.View>

      {/* 快捷入口菜单 */}
      {showQuickMenu && (
        <Animated.View style={[styles.quickMenu, quickMenuAnimatedStyle]}>
          <BlurView intensity={80} style={styles.quickMenuBlur}>
            <LinearGradient
              colors={["rgba(45, 27, 78, 0.95)", "rgba(26, 10, 46, 0.9)"]}
              style={styles.quickMenuGradient}
            >
              {quickMenuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.quickMenuItem}
                  onPress={() => handleQuickNav(item.route)}
                >
                  <View style={[styles.quickMenuIcon, { backgroundColor: `${item.color}33` }]}>
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                  </View>
                  <Text style={styles.quickMenuLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
  },
  // 顶部标题
  header: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
    textShadowColor: "rgba(167, 139, 250, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
    letterSpacing: 2,
  },
  // 卡片容器
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 400,
    position: "relative",
  },
  card: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
    backgroundColor: "rgba(45, 27, 78, 0.4)",
  },
  cardBlur: {
    backgroundColor: "transparent",
  },
  cardGradient: {
    padding: 32,
    minHeight: 400,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 24,
    textShadowColor: "rgba(167, 139, 250, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  // 统计卡片
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  // 记忆预设
  memoryList: {
    gap: 16,
  },
  memoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  memoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  memoryInfo: {
    flex: 1,
  },
  memoryName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  memoryDesc: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.6)",
  },
  // AI实验室
  aiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  aiFeature: {
    width: "47%",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  aiLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // 滑动提示
  swipeHint: {
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(167, 139, 250, 0.5)",
  },
  swipeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
  },
  // 库洛米助手
  kuromiAssistant: {
    position: "absolute",
    bottom: 100,
    right: 24,
    zIndex: 100,
  },
  kuromiContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  kuromiGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  kuromiHead: {
    width: 70,
    height: 70,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: -4,
    width: 20,
    height: 32,
    backgroundColor: "#2D3748",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  kuromiEarLeft: {
    left: 10,
    transform: [{ rotate: "-15deg" }],
  },
  kuromiEarRight: {
    right: 10,
    transform: [{ rotate: "15deg" }],
  },
  kuromiFace: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },
  kuromiEye: {
    width: 12,
    height: 16,
    backgroundColor: "#1F2937",
    borderRadius: 6,
    position: "relative",
  },
  kuromiEyeHighlight: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 4,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  kuromiNose: {
    width: 7,
    height: 5,
    backgroundColor: "#F472B6",
    borderRadius: 3.5,
    marginTop: 3,
  },
  kuromiBow: {
    position: "absolute",
    top: -6,
    right: -4,
    width: 36,
    height: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bowLeft: {
    width: 13,
    height: 13,
    backgroundColor: "#F472B6",
    borderRadius: 6.5,
    transform: [{ scaleX: 1.3 }],
  },
  bowCenter: {
    width: 7,
    height: 10,
    backgroundColor: "#F472B6",
    borderRadius: 3.5,
    marginHorizontal: -2,
  },
  bowRight: {
    width: 13,
    height: 13,
    backgroundColor: "#F472B6",
    borderRadius: 6.5,
    transform: [{ scaleX: 1.3 }],
  },
  bowSkull: {
    position: "absolute",
    top: 3,
    left: 12,
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  skullDot: {
    width: 8,
    height: 8,
    backgroundColor: "#1F2937",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  // 快捷菜单
  quickMenu: {
    position: "absolute",
    bottom: 190,
    right: 24,
    width: 200,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 15,
  },
  quickMenuBlur: {
    backgroundColor: "transparent",
  },
  quickMenuGradient: {
    padding: 16,
    gap: 12,
  },
  quickMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  quickMenuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  quickMenuLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
