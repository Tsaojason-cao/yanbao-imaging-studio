import { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Platform, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 图像调整参数
interface ImageAdjustments {
  brightness: number; // 亮度 -100 to 100
  contrast: number; // 对比度 -100 to 100
  saturation: number; // 饱和度 -100 to 100
  temperature: number; // 色温 -100 to 100
}

// 滤镜预设
const FILTERS = [
  { id: "none", name: "原图", color: "#9CA3AF" },
  { id: "fresh", name: "清新", color: "#10B981" },
  { id: "romantic", name: "浪漫", color: "#EC4899" },
  { id: "vintage", name: "复古", color: "#F59E0B" },
  { id: "bw", name: "黑白", color: "#6B7280" },
  { id: "japan", name: "日系", color: "#3B82F6" },
  { id: "warm", name: "温暖", color: "#EF4444" },
];

// 工具类型
type ToolType = "adjust" | "filter" | "crop" | "tools";

export default function EditScreen() {
  const router = useRouter();
  const colors = useColors();
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>("adjust");
  const [selectedFilter, setSelectedFilter] = useState("none");

  // 图像调整参数
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
  });

  // Before/After分割线位置
  const dividerPosition = useSharedValue(SCREEN_WIDTH / 2);

  // 拖动手势
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(SCREEN_WIDTH, event.absoluteX));
      dividerPosition.value = newPosition;
    });

  const dividerAnimatedStyle = useAnimatedStyle(() => ({
    left: dividerPosition.value,
  }));

  const afterImageAnimatedStyle = useAnimatedStyle(() => ({
    width: dividerPosition.value,
  }));

  // 更新调整参数
  const updateAdjustment = (key: keyof ImageAdjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  // 重置所有参数
  const resetAll = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
    });
    setSelectedFilter("none");
  };

  // 保存编辑
  const saveEdit = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: 应用调整参数并保存
    router.back();
  };

  // 示例图片（实际应从路由参数获取）
  const sampleImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400";

  return (
    <View className="flex-1 bg-background">
      {/* 顶部工具栏 */}
      <View className="pt-12 px-6 pb-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>

        <Text className="text-foreground text-lg font-semibold">图像编辑</Text>

        <Pressable
          onPress={saveEdit}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-white font-semibold">保存</Text>
        </Pressable>
      </View>

      {/* Before/After切换按钮 */}
      <View className="px-6 mb-4">
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setShowBeforeAfter(!showBeforeAfter);
          }}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: showBeforeAfter ? colors.primary : colors.surface,
            alignSelf: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            className="font-semibold"
            style={{ color: showBeforeAfter ? "white" : colors.foreground }}
          >
            {showBeforeAfter ? "Before/After" : "编辑模式"}
          </Text>
        </Pressable>
      </View>

      {/* 图像预览区域 */}
      <View className="flex-1 mx-6 mb-4 rounded-3xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
        {showBeforeAfter ? (
          // Before/After对比模式
          <View style={{ flex: 1, position: "relative" }}>
            {/* Before图像（底层） */}
            <Image
              source={{ uri: sampleImage }}
              style={{ width: "100%", height: "100%", position: "absolute" }}
              resizeMode="cover"
            />

            {/* After图像（遮罩层） */}
            <Animated.View
              style={[
                { height: "100%", overflow: "hidden", position: "absolute", left: 0 },
                afterImageAnimatedStyle,
              ]}
            >
              <Image
                source={{ uri: sampleImage }}
                style={{ width: SCREEN_WIDTH - 48, height: "100%" }}
                resizeMode="cover"
              />
            </Animated.View>

            {/* 分割线 */}
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: "white",
                    zIndex: 10,
                  },
                  dividerAnimatedStyle,
                ]}
              >
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: -16,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: -18,
                  }}
                >
                  <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                </View>
              </Animated.View>
            </GestureDetector>

            {/* Before/After标签 */}
            <View className="absolute top-4 left-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <Text className="text-white text-xs font-semibold">Before</Text>
            </View>
            <View className="absolute top-4 right-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <Text className="text-white text-xs font-semibold">After</Text>
            </View>
          </View>
        ) : (
          // 普通编辑模式
          <Image
            source={{ uri: sampleImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        )}
      </View>

      {/* 底部工具栏 */}
      <View className="px-6 pb-8">
        {/* 工具选择 */}
        <View className="flex-row gap-2 mb-4">
          {[
            { id: "adjust", label: "调整", icon: "tune" },
            { id: "filter", label: "滤镜", icon: "color-filter" },
            { id: "crop", label: "裁剪", icon: "crop" },
            { id: "tools", label: "工具", icon: "construct" },
          ].map(({ id, label, icon }) => (
            <Pressable
              key={id}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSelectedTool(id as ToolType);
              }}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: selectedTool === id ? colors.primary : colors.surface,
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons
                name={icon as any}
                size={20}
                color={selectedTool === id ? "white" : colors.foreground}
              />
              <Text
                className="text-xs font-semibold mt-1"
                style={{ color: selectedTool === id ? "white" : colors.foreground }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 工具内容区域 */}
        <View className="p-4 rounded-3xl" style={{ backgroundColor: colors.surface, maxHeight: 280 }}>
          {selectedTool === "adjust" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { key: "brightness", label: "亮度", icon: "brightness-6" },
                { key: "contrast", label: "对比度", icon: "contrast" },
                { key: "saturation", label: "饱和度", icon: "palette" },
                { key: "temperature", label: "色温", icon: "thermometer" },
              ].map(({ key, label, icon }) => (
                <View key={key} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name={icon as any}
                        size={20}
                        color={colors.foreground}
                      />
                      <Text className="text-foreground text-sm">{label}</Text>
                    </View>
                    <Text className="text-foreground text-sm">
                      {adjustments[key as keyof ImageAdjustments]}
                    </Text>
                  </View>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={-100}
                    maximumValue={100}
                    value={adjustments[key as keyof ImageAdjustments]}
                    onValueChange={(value) =>
                      updateAdjustment(key as keyof ImageAdjustments, Math.round(value))
                    }
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                  />
                </View>
              ))}

              <Pressable
                onPress={resetAll}
                style={({ pressed }) => ({
                  marginTop: 8,
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: colors.border,
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-foreground font-semibold">重置参数</Text>
              </Pressable>
            </ScrollView>
          )}

          {selectedTool === "filter" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap gap-3">
                {FILTERS.map((filter) => (
                  <Pressable
                    key={filter.id}
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setSelectedFilter(filter.id);
                    }}
                    style={({ pressed }) => ({
                      width: (SCREEN_WIDTH - 96) / 3,
                      aspectRatio: 1,
                      borderRadius: 16,
                      backgroundColor: filter.color,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: selectedFilter === filter.id ? 3 : 0,
                      borderColor: colors.primary,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text className="text-white font-semibold">{filter.name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}

          {selectedTool === "crop" && (
            <View className="items-center justify-center py-8">
              <MaterialCommunityIcons name="crop" size={48} color={colors.muted} />
              <Text className="text-muted mt-4">裁剪功能即将推出</Text>
            </View>
          )}

          {selectedTool === "tools" && (
            <View className="items-center justify-center py-8">
              <MaterialCommunityIcons name="tools" size={48} color={colors.muted} />
              <Text className="text-muted mt-4">更多工具即将推出</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
