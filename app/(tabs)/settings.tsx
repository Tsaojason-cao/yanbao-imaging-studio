import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { InfoRow } from "@/components/info-row";
import { StatusCard } from "@/components/status-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import Constants from "expo-constants";

/**
 * Settings Screen - 设置和配置信息
 * 
 * 采用圆润卡片设计风格，展示：
 * - Supabase 配置状态
 * - Expo 项目配置
 * - GitHub 仓库信息
 * - 环境状态和快速链接
 */
export default function SettingsScreen() {
  const colors = useColors();
  const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "Not configured";
  const isSupabaseConfigured = supabaseUrl !== "Not configured";
  
  const appName = Constants.expoConfig?.name || "Unknown";
  const appVersion = Constants.expoConfig?.version || "Unknown";
  const appSlug = Constants.expoConfig?.slug || "Unknown";

  const handleOpenSupabase = () => {
    if (isSupabaseConfigured) {
      Linking.openURL(supabaseUrl);
    }
  };

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/Tsaojason-cao/yanbao-imaging-studio");
  };

  const handleOpenEAS = () => {
    Linking.openURL("https://expo.dev");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-8 pb-6">
          {/* Header */}
          <View className="gap-3 mb-6">
            <Text className="text-4xl font-bold text-foreground">设置</Text>
            <Text className="text-base text-muted leading-relaxed">
              应用配置和环境信息
            </Text>
          </View>

          {/* Environment Status */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">环境状态</Text>
            
            <StatusCard
              title={isSupabaseConfigured ? "Supabase 已连接" : "Supabase 未配置"}
              status={isSupabaseConfigured ? "success" : "warning"}
              description={
                isSupabaseConfigured
                  ? "后端服务运行正常"
                  : "请在环境变量中配置 Supabase"
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
              title="EAS Build 已配置"
              status="success"
              description="云端构建服务已就绪"
              icon={<IconSymbol name="chevron.right" size={24} color={colors.success} />}
              className="shadow-md"
            />
          </View>

          {/* Application Info */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">应用信息</Text>
            
            <View className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-sm">
              <InfoRow label="应用名称" value={appName} />
              <InfoRow label="版本号" value={appVersion} />
              <InfoRow label="应用标识" value={appSlug} />
              <InfoRow label="Expo SDK" value="54" />
              <InfoRow label="React Native" value="0.81" className="border-b-0" />
            </View>
          </View>

          {/* Supabase Configuration */}
          {isSupabaseConfigured && (
            <View className="gap-4 mb-6">
              <Text className="text-xl font-bold text-foreground">Supabase 配置</Text>
              
              <View className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-sm">
                <InfoRow 
                  label="项目 URL" 
                  value={supabaseUrl.replace("https://", "").substring(0, 30) + "..."} 
                />
                <InfoRow label="状态" value="已连接" className="border-b-0" />
              </View>

              <TouchableOpacity
                onPress={handleOpenSupabase}
                className="bg-primary px-5 py-4 rounded-2xl active:opacity-80 shadow-md"
              >
                <Text className="text-white font-bold text-center text-base">
                  打开 Supabase 控制台
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Links */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">快速链接</Text>
            
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
                    查看源代码和 Actions
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

            <TouchableOpacity
              onPress={handleOpenEAS}
              className="bg-surface rounded-2xl p-5 border-2 border-border active:opacity-70 shadow-sm"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    EAS 控制台
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    查看构建历史和配置
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

          {/* About Card */}
          <View className="bg-gradient-to-br from-gradient1/10 to-gradient2/10 rounded-2xl p-5 border-2 border-primary/20 shadow-sm">
            <Text className="text-lg font-bold text-foreground mb-3">
              关于
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              这是一个演示 EAS Build 与 GitHub Actions 持续集成的示例应用。
              集成了 Supabase 后端服务，支持自动化构建和部署。
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
