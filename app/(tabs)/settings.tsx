import { ScrollView, Text, View, Pressable, Alert, Platform, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 设置项数据
const SETTINGS_ITEMS = [
  { id: "account", label: "账户管理", icon: "person", color: "#3B82F6" },
  { id: "notification", label: "通知设置", icon: "notifications", color: "#10B981" },
  { id: "privacy", label: "隐私与安全", icon: "shield-checkmark", color: "#F59E0B" },
  { id: "storage", label: "存储管理", icon: "folder", color: "#EC4899" },
  { id: "language", label: "语言设置", icon: "language", color: "#8B5CF6" },
  { id: "about", label: "关于应用", icon: "information-circle", color: "#6B7280" },
];

// 统计数据
const STATS_DATA = {
  totalEdits: 247,
  presets: 12,
  storage: { used: 8, total: 50 },
  favorites: 38,
  weeklyEdits: [12, 18, 15, 22, 28, 25, 30],
  topFeatures: [
    { name: "亮度调整", percentage: 85, color: "#3B82F6" },
    { name: "饱和度", percentage: 72, color: "#10B981" },
    { name: "滤镜应用", percentage: 68, color: "#F59E0B" },
    { name: "裁剪", percentage: 45, color: "#EC4899" },
  ],
};

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const logoScale = useSharedValue(1);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const handleLogoPress = () => {
    // Logo 弹跳动画
    logoScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setEasterEggCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5 && !showEasterEgg) {
        // 触发彩蛋
        setShowEasterEgg(true);
        triggerEasterEgg();
      }
      return newCount;
    });
  };

  const triggerEasterEgg = () => {
    // 爱心动画
    heartScale.value = withSpring(1);
    heartOpacity.value = withSpring(1);

    // 3 秒后淡出
    heartOpacity.value = withDelay(3000, withSpring(0));

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // 显示浪漫弹窗
    setTimeout(() => {
      Alert.alert(
        "💜 浪漫彩蛋 💜",
        "这不只是一个App，这是用代码写的情书💜\n\n每一张照片，都是我们的美好回忆\n愿时光温柔，岁月静好\n\n— 致最特别的雁宝",
        [{ text: "好的 ❤️", onPress: () => setShowEasterEgg(false) }]
      );
    }, 500);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  // 渲染设置页面
  const renderSettings = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-6 pt-12 pb-6">
        {/* Logo 和标题 */}
        <View className="items-center gap-4 mb-8">
          <Pressable onPress={handleLogoPress}>
            <Animated.View
              style={[
                {
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                },
                logoAnimatedStyle,
              ]}
            >
              <Text style={{ fontSize: 40 }}>✨</Text>
            </Animated.View>
          </Pressable>

          {/* 浪漫彩蛋爱心 */}
          {showEasterEgg && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                },
                heartAnimatedStyle,
              ]}
            >
              <Text style={{ fontSize: 60 }}>💕</Text>
            </Animated.View>
          )}

          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">
              雁宝 AI 私人影像工作室
            </Text>
            <Text className="text-sm text-muted">版本 1.0.0</Text>
          </View>
        </View>

        {/* 数据统计卡片 */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowStats(true);
          }}
          style={({ pressed }) => ({
            marginBottom: 24,
            padding: 20,
            borderRadius: 24,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-semibold mb-1">
                数据统计
              </Text>
              <Text className="text-white/80 text-sm">
                查看你的使用数据和趋势
              </Text>
            </View>
            <Ionicons name="stats-chart" size={32} color="white" />
          </View>
        </Pressable>

        {/* 设置列表 */}
        <View className="gap-3 mb-6">
          {SETTINGS_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                // TODO: 导航到对应设置页面
              }}
              style={({ pressed }) => ({
                padding: 16,
                borderRadius: 20,
                backgroundColor: colors.surface,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="flex-row items-center gap-3">
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: item.color + "20",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="text-foreground font-semibold">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {/* 彩蛋提示 */}
        {easterEggCount > 0 && easterEggCount < 5 && (
          <View className="items-center mb-6">
            <Text className="text-xs text-muted">
              再点击 {5 - easterEggCount} 次 Logo 解锁彩蛋 ✨
            </Text>
          </View>
        )}

        {/* 底部装饰 */}
        <View className="items-center mt-8">
          <Text className="text-sm text-muted">Made with 💕 by Yanbao Team</Text>
        </View>
      </View>
    </ScrollView>
  );

  // 渲染数据统计页面
  const renderStats = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-6 pt-12 pb-6">
        {/* 返回按钮 */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowStats(false);
          }}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        <Text className="text-foreground text-3xl font-bold mb-6">数据统计</Text>

        {/* 统计卡片 */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View
            className="p-5 rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              width: (SCREEN_WIDTH - 54) / 2,
            }}
          >
            <MaterialCommunityIcons name="image-edit" size={32} color={colors.primary} />
            <Text className="text-foreground text-3xl font-bold mt-3">
              {STATS_DATA.totalEdits}
            </Text>
            <Text className="text-muted text-sm mt-1">总编辑数</Text>
          </View>

          <View
            className="p-5 rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              width: (SCREEN_WIDTH - 54) / 2,
            }}
          >
            <MaterialCommunityIcons name="star" size={32} color="#F59E0B" />
            <Text className="text-foreground text-3xl font-bold mt-3">
              {STATS_DATA.presets}
            </Text>
            <Text className="text-muted text-sm mt-1">配方数量</Text>
          </View>

          <View
            className="p-5 rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              width: (SCREEN_WIDTH - 54) / 2,
            }}
          >
            <MaterialCommunityIcons name="database" size={32} color="#10B981" />
            <Text className="text-foreground text-3xl font-bold mt-3">
              {STATS_DATA.storage.used}/{STATS_DATA.storage.total}GB
            </Text>
            <Text className="text-muted text-sm mt-1">已用存储</Text>
          </View>

          <View
            className="p-5 rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              width: (SCREEN_WIDTH - 54) / 2,
            }}
          >
            <MaterialCommunityIcons name="heart" size={32} color="#EC4899" />
            <Text className="text-foreground text-3xl font-bold mt-3">
              {STATS_DATA.favorites}
            </Text>
            <Text className="text-muted text-sm mt-1">收藏照片</Text>
          </View>
        </View>

        {/* 近7日编辑趋势 */}
        <View className="p-6 rounded-3xl mb-6" style={{ backgroundColor: colors.surface }}>
          <Text className="text-foreground text-lg font-semibold mb-4">
            近7日编辑趋势
          </Text>
          <View className="flex-row items-end justify-between" style={{ height: 120 }}>
            {STATS_DATA.weeklyEdits.map((value, index) => {
              const maxValue = Math.max(...STATS_DATA.weeklyEdits);
              const height = (value / maxValue) * 100;
              return (
                <View key={index} className="items-center gap-2">
                  <View
                    style={{
                      width: 32,
                      height: `${height}%`,
                      borderRadius: 8,
                      backgroundColor: colors.primary,
                    }}
                  />
                  <Text className="text-muted text-xs">
                    {["一", "二", "三", "四", "五", "六", "日"][index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 最常用功能 */}
        <View className="p-6 rounded-3xl mb-6" style={{ backgroundColor: colors.surface }}>
          <Text className="text-foreground text-lg font-semibold mb-4">
            最常用功能
          </Text>
          {STATS_DATA.topFeatures.map((feature, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-foreground font-medium">{feature.name}</Text>
                <Text className="text-muted text-sm">{feature.percentage}%</Text>
              </View>
              <View className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
                <View
                  className="h-2 rounded-full"
                  style={{
                    width: `${feature.percentage}%`,
                    backgroundColor: feature.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* 备份数据按钮 */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert("备份数据", "数据备份功能即将推出");
          }}
          style={({ pressed }) => ({
            paddingVertical: 16,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-white font-semibold">备份数据到云端</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  return (
    <ScreenContainer className="bg-background">
      {showStats ? renderStats() : renderSettings()}
    </ScreenContainer>
  );
}
