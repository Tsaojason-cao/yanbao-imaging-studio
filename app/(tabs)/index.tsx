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
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const [greeting, setGreeting] = useState("早上好");

  useEffect(() => {
    // 根据时间设置问候语
    const hour = new Date().getHours();
    if (hour < 6) setGreeting("夜深了");
    else if (hour < 12) setGreeting("早上好");
    else if (hour < 18) setGreeting("下午好");
    else setGreeting("晚上好");

    // 库洛米呼吸动画
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  const kuromiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleNavigation = (route: string, label: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(route as any);
  };

  const quickActions = [
    { icon: "camera", label: "拍照", route: "/(tabs)/camera", color: "#A78BFA", gradient: ["#A78BFA", "#EC4899"] },
    { icon: "create", label: "编辑", route: "/edit", color: "#F59E0B", gradient: ["#F59E0B", "#EF4444"] },
  ];

  const navButtons = [
    { icon: "images", label: "相册", route: "/(tabs)/gallery", color: "#EC4899" },
    { icon: "settings", label: "设置", route: "/(tabs)/settings", color: "#8B5CF6" },
    { icon: "heart", label: "收藏", route: "/(tabs)/gallery", color: "#F472B6" },
    { icon: "cloud-upload", label: "云端", route: "/(tabs)/settings", color: "#A78BFA" },
  ];

  return (
    <LinearGradient
      colors={["#FAF5FF" as const, "#FDF2F8" as const, "#FFF1F2" as const]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部问候区 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting} 👋</Text>
              <Text style={styles.subtitle}>准备好变美了吗？</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* 统计卡片 - 优化布局 */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
              <BlurView intensity={20} style={styles.statsBlur}>
                <View style={styles.statsContent}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: "#FEF3C7" }]}>
                      <Ionicons name="camera" size={24} color="#F59E0B" />
                    </View>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>已拍摄</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: "#FCE7F3" }]}>
                      <Ionicons name="brush" size={24} color="#EC4899" />
                    </View>
                    <Text style={styles.statValue}>8</Text>
                    <Text style={styles.statLabel}>已编辑</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <View style={[styles.statIconContainer, { backgroundColor: "#EDE9FE" }]}>
                      <MaterialCommunityIcons name="brain" size={24} color="#8B5CF6" />
                    </View>
                    <Text style={styles.statValue}>3</Text>
                    <Text style={styles.statLabel}>记忆预设</Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </View>

          {/* 库洛米角色 + 快捷操作 */}
          <View style={styles.mainSection}>
            <Animated.View style={[styles.kuromiContainer, kuromiAnimatedStyle]}>
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
            </Animated.View>

            <Text style={styles.kuromiMessage}>让我帮你变得更美吧！</Text>
          </View>

          {/* 快捷操作按钮 - 大按钮，易点击 */}
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => handleNavigation(action.route, action.label)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient as any}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon as any} size={32} color="#FFFFFF" />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* 功能导航网格 - 拇指友好 */}
          <View style={styles.navGrid}>
            {navButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.navButton}
                onPress={() => handleNavigation(button.route, button.label)}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconContainer, { backgroundColor: `${button.color}20` }]}>
                  <Ionicons name={button.icon as any} size={28} color={button.color} />
                </View>
                <Text style={styles.navLabel}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statsBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  statsContent: {
    flexDirection: "row",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    marginHorizontal: 8,
  },
  mainSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  kuromiContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiHead: {
    width: 100,
    height: 100,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: -5,
    width: 28,
    height: 42,
    backgroundColor: "#2D3748",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  kuromiEarLeft: {
    left: 10,
    transform: [{ rotate: "-15deg" }],
  },
  kuromiEarRight: {
    right: 10,
    transform: [{ rotate: "15deg" }],
  },
  kuromiEarInner: {
    width: 18,
    height: 28,
    backgroundColor: "#F3E5F5",
    borderRadius: 9,
    alignSelf: "center",
    marginTop: 6,
  },
  kuromiFace: {
    width: 80,
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },
  kuromiEye: {
    width: 16,
    height: 20,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    position: "relative",
  },
  kuromiEyeHighlight: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 6,
    height: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  kuromiNose: {
    width: 10,
    height: 8,
    backgroundColor: "#F472B6",
    borderRadius: 5,
    marginTop: 6,
  },
  kuromiMouth: {
    width: 24,
    height: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2.5,
    borderTopWidth: 0,
    borderColor: "#F472B6",
    marginTop: 4,
  },
  kuromiBow: {
    position: "absolute",
    top: -10,
    right: -8,
    width: 48,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bowLeft: {
    width: 18,
    height: 18,
    backgroundColor: "#F472B6",
    borderRadius: 9,
    transform: [{ scaleX: 1.3 }],
  },
  bowCenter: {
    width: 10,
    height: 14,
    backgroundColor: "#F472B6",
    borderRadius: 5,
    marginHorizontal: -2,
  },
  bowRight: {
    width: 18,
    height: 18,
    backgroundColor: "#F472B6",
    borderRadius: 9,
    transform: [{ scaleX: 1.3 }],
  },
  bowSkull: {
    position: "absolute",
    top: 4,
    left: 16,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skullCircle: {
    width: 11,
    height: 11,
    backgroundColor: "#1F2937",
    borderRadius: 5.5,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  kuromiBody: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  kuromiPaw: {
    width: 14,
    height: 14,
    backgroundColor: "#2D3748",
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  kuromiMessage: {
    marginTop: 16,
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 8,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 16,
  },
  navButton: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",
  },
  navIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
});
