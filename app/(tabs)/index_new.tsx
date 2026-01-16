import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen - 库洛米主题首页
 * 
 * 设计规范：
 * - 深色背景（#1a101f）
 * - 2x2 网格布局的功能卡片
 * - 玻璃态效果（半透明、模糊）
 * - 紫粉渐变边框
 * - 库洛米品牌元素
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const features = [
    {
      id: "camera",
      title: "相机",
      icon: "camera.fill",
      gradient: ["#8B5CF6", "#60A5FA"],
      route: "/camera",
    },
    {
      id: "gallery",
      title: "相册",
      icon: "square.grid.2x2.fill",
      gradient: ["#EC4899", "#F472B6"],
      route: "/builds",
    },
    {
      id: "edit",
      title: "编辑",
      icon: "slider.horizontal.3",
      gradient: ["#60A5FA", "#A78BFA"],
      route: "/edit",
    },
    {
      id: "spots",
      title: "地区推荐",
      icon: "location.fill",
      gradient: ["#10B981", "#34D399"],
      route: "/settings",
    },
  ];

  return (
    <ScreenContainer className="bg-[#1a101f]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-6">
          {/* 顶部标题栏 */}
          <View className="flex-row items-center justify-between mb-12">
            <View className="flex-row items-center gap-3">
              {/* 库洛米 Logo */}
              <View className="w-12 h-12 bg-pink-500 rounded-full items-center justify-center">
                <Text className="text-2xl">🐰</Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                yanbao AI
              </Text>
            </View>
            
            <View className="flex-row gap-4">
              <TouchableOpacity className="w-10 h-10 items-center justify-center">
                <IconSymbol name="bell.fill" size={24} color="#A78BFA" />
              </TouchableOpacity>
              <TouchableOpacity 
                className="w-10 h-10 items-center justify-center"
                onPress={() => router.push("/settings" as any)}
              >
                <IconSymbol name="gear" size={24} color="#A78BFA" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 功能卡片网格 (2x2) */}
          <View className="gap-4 mb-8">
            <View className="flex-row gap-4">
              {features.slice(0, 2).map((feature, index) => (
                <TouchableOpacity
                  key={feature.id}
                  className="flex-1"
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["rgba(139, 92, 246, 0.1)", "rgba(236, 72, 153, 0.1)"]}
                    className="rounded-3xl p-0.5"
                  >
                    <View className="bg-[#2a1f3f]/80 rounded-3xl p-6 aspect-square items-center justify-center gap-4">
                      <LinearGradient
                        colors={feature.gradient}
                        className="w-20 h-20 rounded-2xl items-center justify-center"
                      >
                        <IconSymbol name={feature.icon} size={40} color="white" />
                      </LinearGradient>
                      <Text className="text-white text-lg font-semibold">
                        {feature.title}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-4">
              {features.slice(2, 4).map((feature, index) => (
                <TouchableOpacity
                  key={feature.id}
                  className="flex-1"
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["rgba(139, 92, 246, 0.1)", "rgba(236, 72, 153, 0.1)"]}
                    className="rounded-3xl p-0.5"
                  >
                    <View className="bg-[#2a1f3f]/80 rounded-3xl p-6 aspect-square items-center justify-center gap-4">
                      <LinearGradient
                        colors={feature.gradient}
                        className="w-20 h-20 rounded-2xl items-center justify-center"
                      >
                        <IconSymbol name={feature.icon} size={40} color="white" />
                      </LinearGradient>
                      <Text className="text-white text-lg font-semibold">
                        {feature.title}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 底部装饰 */}
          <View className="items-center mt-auto pt-8">
            <Text className="text-muted text-sm">
              by Jason Tsao who loves you the most ❤️
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
