import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ViewStyle } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // 轮盘旋转动画 - 20秒一圈
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );
    // 中心脉冲动画
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1
    );
  }, []);

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 轮盘按钮配置 - 5个按钮环绕中心
  const wheelButtons = [
    { icon: "camera", label: "相机", route: "/camera", angle: -90 },
    { icon: "create", label: "编辑", route: "/edit", angle: -18 },
    { icon: "images", label: "相册", route: "/(tabs)/gallery", angle: 54 },
    { icon: "settings", label: "设置", route: "/(tabs)/settings", angle: 126 },
    { icon: "home", label: "主页", route: "/(tabs)/", angle: 198 },
  ];

  const getButtonPosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      left: radius + radius * Math.cos(radian) - 35,
      top: radius + radius * Math.sin(radian) - 35,
    };
  };

  return (
    <LinearGradient
      colors={["#E9D5FF", "#FCA5A5"]}
      style={{ flex: 1 } as ViewStyle}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>YanBao AI</Text>
          </View>

          {/* 统计卡片 */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="camera" size={32} color="#9CA3AF" />
              <Text style={styles.statLabel}>已拍摄</Text>
              <Text style={styles.statValue}>12 <Text style={styles.statUnit}>张</Text></Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="create" size={32} color="#9CA3AF" />
              <Text style={styles.statLabel}>已编辑</Text>
              <Text style={styles.statValue}>8 <Text style={styles.statUnit}>张</Text></Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="brain" size={32} color="#9CA3AF" />
              <Text style={styles.statLabel}>记忆预设</Text>
              <Text style={styles.statValue}>3 <Text style={styles.statUnit}>个</Text></Text>
            </View>
          </View>

          {/* 库洛米轮盘导航 */}
          <View style={styles.wheelContainer}>
            {/* 轮盘背景 */}
            <Animated.View style={[styles.wheel, wheelAnimatedStyle]}>
              <View style={styles.wheelRing} />
            </Animated.View>

            {/* 5个环绕按钮 */}
            {wheelButtons.map((button, index) => {
              const position = getButtonPosition(button.angle, 120);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.wheelButton, position]}
                  onPress={() => router.push(button.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.wheelButtonInner}>
                    <Ionicons name={button.icon as any} size={28} color="#A78BFA" />
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
                  {/* 耳朵 */}
                  <View style={[styles.kuromiEar, { left: -10 }]} />
                  <View style={[styles.kuromiEar, { right: -10 }]} />
                  
                  {/* 脸部 */}
                  <View style={styles.kuromiFace}>
                    {/* 眼睛 */}
                    <View style={styles.kuromiEyes}>
                      <View style={styles.kuromiEye} />
                      <View style={styles.kuromiEye} />
                    </View>
                    {/* 鼻子 */}
                    <View style={styles.kuromiNose} />
                    {/* 嘴巴 */}
                    <View style={styles.kuromiMouth} />
                  </View>
                  
                  {/* 粉色蝴蝶结 */}
                  <View style={styles.kuromiBow}>
                    <View style={styles.bowLeft} />
                    <View style={styles.bowRight} />
                    <View style={styles.bowCenter} />
                  </View>
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
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statsCard: {
    marginHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statUnit: {
    fontSize: 16,
    fontWeight: "normal",
  },
  wheelContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    height: 400,
    position: "relative",
  },
  wheel: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.3)",
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  wheelButtonLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  centerCharacter: {
    position: "absolute",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiHead: {
    width: 80,
    height: 80,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: 0,
    width: 20,
    height: 30,
    backgroundColor: "#1F2937",
    borderRadius: 10,
  },
  kuromiFace: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1F2937",
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  kuromiEye: {
    width: 12,
    height: 12,
    backgroundColor: "#1F2937",
    borderRadius: 6,
  },
  kuromiNose: {
    width: 6,
    height: 6,
    backgroundColor: "#F472B6",
    borderRadius: 3,
    marginTop: 4,
  },
  kuromiMouth: {
    width: 16,
    height: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#1F2937",
    borderRadius: 8,
    marginTop: 2,
  },
  kuromiBow: {
    position: "absolute",
    top: -5,
    right: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  bowLeft: {
    width: 12,
    height: 12,
    backgroundColor: "#F472B6",
    borderRadius: 6,
  },
  bowCenter: {
    width: 6,
    height: 6,
    backgroundColor: "#F472B6",
    borderRadius: 3,
    marginHorizontal: -2,
  },
  bowRight: {
    width: 12,
    height: 12,
    backgroundColor: "#F472B6",
    borderRadius: 6,
  },
});
