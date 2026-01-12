import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { StarlightParticles } from "@/components/starlight-particles";
import { WheelNavigation } from "@/components/wheel-navigation";
import { StatsCard } from "@/components/stats-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

/**
 * Home Screen - 库洛米星光轮盘首页
 * 
 * 特色功能：
 * - 星光粒子背景动画
 * - 圆形轮盘导航（带旋转和脉冲动画）
 * - 用户统计卡片（带进入动画）
 */
export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const wheelItems = [
    {
      id: "camera",
      icon: "paperplane.fill",
      label: "拍照",
      color: "#E879F9",
      onPress: () => router.push("/camera" as any),
    },
    {
      id: "edit",
      icon: "chevron.left.forwardslash.chevron.right",
      label: "编辑",
      color: "#60A5FA",
      onPress: () => router.push("/edit" as any),
    },
    {
      id: "gallery",
      icon: "house.fill",
      label: "相册",
      color: "#86EFAC",
      onPress: () => router.push("/builds" as any),
    },
    {
      id: "settings",
      icon: "gear",
      label: "设置",
      color: "#FDE047",
      onPress: () => router.push("/settings" as any),
    },
  ];

  return (
    <ScreenContainer className="bg-background">
      {/* 星光粒子背景 */}
      <StarlightParticles count={30} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12 pb-6">
          {/* 标题 */}
          <View className="items-center gap-2 mb-8">
            <Text className="text-3xl font-bold text-foreground">
              雁宝 AI 私人影像工作室
            </Text>
            <Text className="text-base text-muted">
              专属定制 · 美颜相机 · 云端备份
            </Text>
          </View>

          {/* 星光轮盘导航 */}
          <View className="items-center mb-12">
            <WheelNavigation items={wheelItems} />
          </View>

          {/* 用户统计 */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-foreground mb-2">
              使用统计
            </Text>

            <StatsCard
              label="总拍摄次数"
              value="128"
              icon={
                <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={24} color={colors.primary} />
                </View>
              }
              delay={0}
            />

            <StatsCard
              label="已编辑照片"
              value="96"
              icon={
                <View className="w-12 h-12 bg-accent/20 rounded-full items-center justify-center">
                  <IconSymbol
                    name="chevron.left.forwardslash.chevron.right"
                    size={24}
                    color={colors.accent}
                  />
                </View>
              }
              delay={100}
            />

            <StatsCard
              label="云端备份"
              value="256 MB"
              icon={
                <View className="w-12 h-12 bg-success/20 rounded-full items-center justify-center">
                  <IconSymbol name="house.fill" size={24} color={colors.success} />
                </View>
              }
              delay={200}
            />
          </View>

          {/* 底部装饰 */}
          <View className="items-center mt-12">
            <Text className="text-sm text-muted">
              ✨ 让每一刻都闪耀光芒 ✨
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
