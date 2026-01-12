import { View, Text, Pressable, StyleSheet, Dimensions, Platform, Modal } from "react-native";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 功能面板类型
type PanelType = "home" | "camera" | "edit" | "gallery" | "settings" | null;

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const [activePanel, setActivePanel] = useState<PanelType>("home");
  const panelOpacity = useSharedValue(1);
  const panelTranslateY = useSharedValue(0);

  // 切换面板
  const switchPanel = (panel: PanelType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // 面板切换动画
    panelOpacity.value = withTiming(0, { duration: 200 }, () => {
      panelOpacity.value = withSpring(1);
    });

    setActivePanel(panel);
  };

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ translateY: panelTranslateY.value }],
  }));

  // 轮盘功能按钮
  const wheelButtons = [
    { id: "camera", label: "相机", icon: "camera", angle: 0 },
    { id: "edit", label: "编辑", icon: "create", angle: 72 },
    { id: "gallery", label: "相册", icon: "images", angle: 144 },
    { id: "settings", label: "设置", icon: "settings", angle: 216 },
    { id: "home", label: "主页", icon: "home", angle: 288 },
  ];

  const renderWheel = () => {
    const radius = 140;
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2 - 50;

    return (
      <View style={[styles.wheelContainer, { top: centerY - radius, left: centerX - radius }]}>
        {/* 外圈轮盘 */}
        <View style={styles.wheelOuter}>
          <LinearGradient
            colors={["#E9D5FF", "#FBE7F3", "#FCE7F3"]}
            style={styles.wheelGradient}
          >
            {/* 功能按钮 */}
            {wheelButtons.map((button, index) => {
              const angleRad = (button.angle * Math.PI) / 180;
              const x = radius + Math.cos(angleRad - Math.PI / 2) * (radius - 50);
              const y = radius + Math.sin(angleRad - Math.PI / 2) * (radius - 50);

              return (
                <Pressable
                  key={button.id}
                  style={[
                    styles.wheelButton,
                    {
                      left: x - 35,
                      top: y - 35,
                    },
                    activePanel === button.id && styles.wheelButtonActive,
                  ]}
                  onPress={() => switchPanel(button.id as PanelType)}
                >
                  <View style={styles.wheelButtonInner}>
                    <Ionicons
                      name={button.icon as any}
                      size={28}
                      color={activePanel === button.id ? "#FFFFFF" : "#8B5CF6"}
                    />
                  </View>
                  <Text style={styles.wheelButtonLabel}>{button.label}</Text>
                </Pressable>
              );
            })}

            {/* 中心库洛米头像 */}
            <View style={styles.wheelCenter}>
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
          </LinearGradient>
        </View>
      </View>
    );
  };

  // 渲染当前激活的面板
  const renderActivePanel = () => {
    switch (activePanel) {
      case "home":
        return renderHomePanel();
      case "camera":
        return renderCameraPanel();
      case "edit":
        return renderEditPanel();
      case "gallery":
        return renderGalleryPanel();
      case "settings":
        return renderSettingsPanel();
      default:
        return null;
    }
  };

  // 首页面板
  const renderHomePanel = () => (
    <View style={styles.panel}>
      {/* 顶部标题 */}
      <Text style={styles.appTitle}>YanBao AI</Text>

      {/* 统计卡片 */}
      <View style={styles.statsCard}>
        <BlurView intensity={30} style={styles.statsBlur}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"]}
            style={styles.statsGradient}
          >
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="camera" size={28} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.statLabel}>已拍摄</Text>
                <Text style={styles.statValue}>12 张</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="create" size={28} color="#EC4899" />
              </View>
              <View>
                <Text style={styles.statLabel}>已编辑</Text>
                <Text style={styles.statValue}>8 张</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="brain" size={28} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statLabel}>记忆预设</Text>
                <Text style={styles.statValue}>3 个</Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </View>
  );

  // 相机面板（占位）
  const renderCameraPanel = () => (
    <View style={[styles.panel, styles.centerPanel]}>
      <Text style={styles.panelTitle}>相机模块</Text>
      <Text style={styles.panelSubtitle}>实时美颜取景</Text>
    </View>
  );

  // 编辑面板（占位）
  const renderEditPanel = () => (
    <View style={[styles.panel, styles.centerPanel]}>
      <Text style={styles.panelTitle}>编辑模块</Text>
      <Text style={styles.panelSubtitle}>Before/After对比</Text>
    </View>
  );

  // 相册面板（占位）
  const renderGalleryPanel = () => (
    <View style={[styles.panel, styles.centerPanel]}>
      <Text style={styles.panelTitle}>相册模块</Text>
      <Text style={styles.panelSubtitle}>网格视图</Text>
    </View>
  );

  // 设置面板（占位）
  const renderSettingsPanel = () => (
    <View style={[styles.panel, styles.centerPanel]}>
      <Text style={styles.panelTitle}>设置模块</Text>
      <Text style={styles.panelSubtitle}>数据统计</Text>
    </View>
  );

  // 底部Tab栏
  const renderBottomTabBar = () => (
    <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <BlurView intensity={80} style={styles.tabBarBlur}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"]}
          style={styles.tabBarGradient}
        >
          {wheelButtons.map((button) => (
            <Pressable
              key={button.id}
              style={styles.tabButton}
              onPress={() => switchPanel(button.id as PanelType)}
            >
              <View
                style={[
                  styles.tabButtonInner,
                  activePanel === button.id && styles.tabButtonActive,
                ]}
              >
                <Ionicons
                  name={button.icon as any}
                  size={24}
                  color={activePanel === button.id ? "#FFFFFF" : "#6B7280"}
                />
              </View>
              <Text
                style={[
                  styles.tabButtonLabel,
                  activePanel === button.id && styles.tabButtonLabelActive,
                ]}
              >
                {button.label}
              </Text>
            </Pressable>
          ))}
        </LinearGradient>
      </BlurView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 背景渐变 */}
      <LinearGradient
        colors={["#E9D5FF", "#FBE7F3", "#FCE7F3"]}
        style={styles.background}
      />

      {/* 当前激活的面板 */}
      <Animated.View style={[styles.panelContainer, panelAnimatedStyle]}>
        {renderActivePanel()}
      </Animated.View>

      {/* 轮盘导航 */}
      {renderWheel()}

      {/* 底部Tab栏 */}
      {renderBottomTabBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  panelContainer: {
    flex: 1,
  },
  panel: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  centerPanel: {
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 8,
  },
  panelSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  // 统计卡片
  statsCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.3)",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  statsBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  statsGradient: {
    flexDirection: "row",
    padding: 20,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  // 轮盘导航
  wheelContainer: {
    position: "absolute",
    width: 280,
    height: 280,
  },
  wheelOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 140,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(139, 92, 246, 0.3)",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
  },
  wheelGradient: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  wheelButton: {
    position: "absolute",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  wheelButtonActive: {},
  wheelButtonLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  wheelCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
    alignItems: "center",
    justifyContent: "center",
  },
  // 库洛米头像
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
    height: 38,
    backgroundColor: "#2D3748",
    borderRadius: 12,
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
    width: 72,
    height: 72,
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 18,
    marginTop: 10,
  },
  kuromiEye: {
    width: 14,
    height: 19,
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
    width: 9,
    height: 7,
    backgroundColor: "#F472B6",
    borderRadius: 4.5,
    marginTop: 5,
  },
  kuromiBow: {
    position: "absolute",
    top: -10,
    right: -8,
    width: 44,
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
    width: 9,
    height: 12,
    backgroundColor: "#F472B6",
    borderRadius: 4.5,
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
    top: 4,
    left: 14,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  skullDot: {
    width: 10,
    height: 10,
    backgroundColor: "#1F2937",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  // 底部Tab栏
  bottomTabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
  },
  tabBarBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  tabBarGradient: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButtonLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabButtonLabelActive: {
    color: "#8B5CF6",
    fontWeight: "700",
  },
});
