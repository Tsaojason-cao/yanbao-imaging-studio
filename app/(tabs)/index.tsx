import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { StatusCard } from "@/components/status-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import Constants from "expo-constants";

/**
 * Home Screen - 雁宝 AI 私人影像工作室
 * 
 * 采用粉紫渐变设计风格，展示：
 * - 应用介绍和品牌信息
 * - EAS Build 配置状态
 * - Supabase 连接状态
 * - GitHub 仓库快速访问
 */
export default function HomeScreen() {
  const colors = useColors();
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "Not configured";
  const isSupabaseConfigured = supabaseUrl !== "Not configured";

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/Tsaojason-cao/yanbao-imaging-studio/tree/eas-build-integration");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          {/* Hero Section with Gradient */}
          <View className="items-center gap-4 pt-8 pb-6 px-6">
            {/* Logo */}
            <View className="w-28 h-28 rounded-3xl overflow-hidden shadow-lg border-4 border-white/30">
              <View className="w-full h-full bg-gradient-to-br from-gradient1 to-gradient2 items-center justify-center">
                <IconSymbol 
                  name="paperplane.fill" 
                  size={48} 
                  color="#FFFFFF" 
                />
              </View>
            </View>

            {/* Title */}
            <View className="items-center gap-2">
              <Text className="text-4xl font-bold text-foreground text-center">
                雁宝 AI 影像
              </Text>
              <Text className="text-lg text-primary font-semibold">
                私人影像工作室
              </Text>
            </View>

            {/* Subtitle */}
            <Text className="text-base text-muted text-center leading-relaxed px-4">
              集成 Supabase 后端 · EAS Build 自动化构建 · GitHub Actions 持续集成
            </Text>
          </View>

          {/* Status Cards */}
          <View className="gap-4 px-6 pb-6">
            <StatusCard
              title="EAS Build 已配置"
              status="success"
              description="支持 development、preview 和 production 三种构建环境"
              icon={<IconSymbol name="chevron.right" size={24} color={colors.success} />}
              className="shadow-md"
            />

            <StatusCard
              title={isSupabaseConfigured ? "Supabase 已连接" : "Supabase 未配置"}
              status={isSupabaseConfigured ? "success" : "warning"}
              description={
                isSupabaseConfigured
                  ? "后端服务已就绪，可使用数据库和认证功能"
                  : "请配置 Supabase 环境变量"
              }
              icon={
                <IconSymbol 
                  name="chevron.right" 
                  size={24} 
                  color={isSupabaseConfigured ? colors.success : colors.warning} 
                />
              }
              className="shadow-md"
            />

            <StatusCard
              title="GitHub Actions 已配置"
              status="info"
              description="自动化构建和代码同步工作流已准备就绪"
              icon={<IconSymbol name="chevron.right" size={24} color={colors.primary} />}
              className="shadow-md"
            />
          </View>

          {/* Quick Access */}
          <View className="gap-3 px-6 pb-6">
            <Text className="text-xl font-bold text-foreground">快速访问</Text>
            
            <TouchableOpacity
              onPress={handleOpenGitHub}
              className="bg-surface rounded-2xl p-5 border-2 border-border active:opacity-70 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    GitHub 仓库
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    查看源代码和工作流配置
                  </Text>
                </View>
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <IconSymbol 
                    name="chevron.right" 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Project Info Card */}
          <View className="mx-6 mb-6 bg-gradient-to-br from-gradient1/10 to-gradient2/10 rounded-2xl p-5 border-2 border-primary/20 shadow-sm">
            <Text className="text-lg font-bold text-foreground mb-4">
              项目信息
            </Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">版本号</Text>
                <Text className="text-base text-foreground font-semibold">1.0.0</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Expo SDK</Text>
                <Text className="text-base text-foreground font-semibold">54</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">React Native</Text>
                <Text className="text-base text-foreground font-semibold">0.81</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
