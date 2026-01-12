import { View, Text, Pressable, ScrollView } from "react-native";
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

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // 轮盘旋转动画
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );
    // 脉冲动画
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
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

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center px-6 pt-8">
          {/* 顶部标题 */}
          <Text className="text-4xl font-bold text-foreground mb-8">
            YanBao AI
          </Text>

          {/* 统计卡片 */}
          <View className="w-full bg-surface/80 rounded-3xl p-6 mb-12 shadow-lg">
            <View className="flex-row justify-around">
              <View className="items-center">
                <Ionicons name="camera" size={32} color={colors.primary} />
                <Text className="text-muted text-sm mt-2">已拍摄</Text>
                <Text className="text-foreground text-2xl font-bold">
                  12<Text className="text-base"> 张</Text>
                </Text>
              </View>
              <View className="items-center">
                <MaterialCommunityIcons
                  name="image-edit"
                  size={32}
                  color="#60A5FA"
                />
                <Text className="text-muted text-sm mt-2">已编辑</Text>
                <Text className="text-foreground text-2xl font-bold">
                  8<Text className="text-base"> 张</Text>
                </Text>
              </View>
              <View className="items-center">
                <MaterialCommunityIcons
                  name="brain"
                  size={32}
                  color="#F472B6"
                />
                <Text className="text-muted text-sm mt-2">记忆预设</Text>
                <Text className="text-foreground text-2xl font-bold">
                  3<Text className="text-base"> 个</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* 库洛米星光轮盘导航 */}
          <View className="items-center justify-center" style={{ height: 420 }}>
            {/* 轮盘背景圆环 */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: 320,
                  height: 320,
                  borderRadius: 160,
                  borderWidth: 2,
                  borderColor: colors.primary + "30",
                },
                wheelAnimatedStyle,
              ]}
            />

            {/* 导航按钮 - 顶部：相机 */}
            <Pressable
              onPress={() => router.push("/camera")}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 0,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#E879F9",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#E879F9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="camera" size={32} color="white" />
              <Text className="text-white text-xs mt-1 font-medium">拍照</Text>
            </Pressable>

            {/* 导航按钮 - 右上：编辑 */}
            <Pressable
              onPress={() => router.push("/edit")}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 80,
                  right: 40,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#60A5FA",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#60A5FA",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="image-edit"
                size={32}
                color="white"
              />
              <Text className="text-white text-xs mt-1 font-medium">编辑</Text>
            </Pressable>

            {/* 导航按钮 - 右下：相册 */}
            <Pressable
              onPress={() => router.push("/(tabs)/builds")}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  bottom: 80,
                  right: 40,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#34D399",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#34D399",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="images" size={32} color="white" />
              <Text className="text-white text-xs mt-1 font-medium">相册</Text>
            </Pressable>

            {/* 导航按钮 - 左下：设置 */}
            <Pressable
              onPress={() => router.push("/(tabs)/settings")}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  bottom: 80,
                  left: 40,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#FBBF24",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#FBBF24",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="settings" size={32} color="white" />
              <Text className="text-white text-xs mt-1 font-medium">设置</Text>
            </Pressable>

            {/* 中心按钮 - 雁宝 AI 影像 */}
            <Animated.View style={[pulseAnimatedStyle]}>
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  {
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.5,
                    shadowRadius: 16,
                    elevation: 12,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white text-base font-bold">雁宝</Text>
                <Text className="text-white text-xs mt-1">AI 影像</Text>
              </Pressable>
            </Animated.View>

            {/* 导航按钮 - 左上：主页 */}
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [
                {
                  position: "absolute",
                  top: 80,
                  left: 40,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#A78BFA",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#A78BFA",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="home" size={32} color="white" />
              <Text className="text-white text-xs mt-1 font-medium">主页</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
