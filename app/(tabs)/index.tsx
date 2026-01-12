import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { StatusCard } from "@/components/status-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import Constants from "expo-constants";

/**
 * Home Screen - EAS Build Status and Overview
 * 
 * Displays:
 * - Application introduction
 * - EAS Build configuration status
 * - Supabase connection status
 * - Quick access to GitHub repository
 */
export default function HomeScreen() {
  const colors = useColors();
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "Not configured";
  const isSupabaseConfigured = supabaseUrl !== "Not configured";

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/Tsaojason-cao/yanbao-imaging-studio/tree/eas-build-integration");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Hero Section */}
          <View className="items-center gap-3 pt-4">
            <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center">
              <IconSymbol 
                name="paperplane.fill" 
                size={40} 
                color={colors.primary} 
              />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center">
              Yanbao EAS Build
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed px-4">
              集成 Supabase 的 Expo 应用，配置 EAS Build 自动化构建和 GitHub Actions 持续集成
            </Text>
          </View>

          {/* Status Cards */}
          <View className="gap-4 mt-4">
            <StatusCard
              title="EAS Build 已配置"
              status="success"
              description="支持 development、preview 和 production 三种构建环境"
              icon={<IconSymbol name="chevron.right" size={24} color={colors.success} />}
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
            />

            <StatusCard
              title="GitHub Actions 已配置"
              status="info"
              description="自动化构建和代码同步工作流已准备就绪"
              icon={<IconSymbol name="chevron.right" size={24} color={colors.primary} />}
            />
          </View>

          {/* Quick Actions */}
          <View className="gap-3 mt-2">
            <Text className="text-lg font-semibold text-foreground">快速访问</Text>
            
            <TouchableOpacity
              onPress={handleOpenGitHub}
              className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    GitHub 仓库
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    查看源代码和工作流配置
                  </Text>
                </View>
                <IconSymbol 
                  name="chevron.right" 
                  size={20} 
                  color={colors.muted} 
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Project Info */}
          <View className="bg-surface rounded-xl p-4 border border-border mt-2">
            <Text className="text-sm font-semibold text-foreground mb-2">
              项目信息
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">版本</Text>
                <Text className="text-sm text-foreground font-medium">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Expo SDK</Text>
                <Text className="text-sm text-foreground font-medium">54</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">React Native</Text>
                <Text className="text-sm text-foreground font-medium">0.81</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
