import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { StatusCard } from "@/components/status-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

interface BuildRecord {
  id: string;
  platform: "android" | "ios";
  profile: "development" | "preview" | "production";
  status: "success" | "error" | "warning";
  timestamp: string;
  duration: string;
}

/**
 * Build Status Screen - Display build history and status
 * 
 * Shows:
 * - Current build status
 * - Build history with details
 * - Platform and profile information
 */
export default function BuildsScreen() {
  const colors = useColors();
  
  // Mock build data - in production, this would come from EAS API or Supabase
  const [builds] = useState<BuildRecord[]>([
    {
      id: "1",
      platform: "android",
      profile: "preview",
      status: "success",
      timestamp: "2026-01-12 21:30",
      duration: "8m 32s",
    },
    {
      id: "2",
      platform: "ios",
      profile: "preview",
      status: "success",
      timestamp: "2026-01-12 21:15",
      duration: "12m 45s",
    },
    {
      id: "3",
      platform: "android",
      profile: "development",
      status: "success",
      timestamp: "2026-01-12 20:50",
      duration: "6m 18s",
    },
  ]);

  const getStatusText = (status: BuildRecord["status"]) => {
    switch (status) {
      case "success":
        return "构建成功";
      case "error":
        return "构建失败";
      case "warning":
        return "构建中";
      default:
        return "未知状态";
    }
  };

  const getPlatformText = (platform: BuildRecord["platform"]) => {
    return platform === "android" ? "Android" : "iOS";
  };

  const getProfileText = (profile: BuildRecord["profile"]) => {
    switch (profile) {
      case "development":
        return "开发版";
      case "preview":
        return "预览版";
      case "production":
        return "生产版";
      default:
        return profile;
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">构建状态</Text>
            <Text className="text-base text-muted leading-relaxed">
              查看 EAS Build 构建历史和详细信息
            </Text>
          </View>

          {/* Current Status */}
          <StatusCard
            title="最新构建"
            status="success"
            description={`Android Preview - ${builds[0].timestamp}`}
            icon={<IconSymbol name="chevron.right" size={24} color={colors.success} />}
          />

          {/* Build History */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">构建历史</Text>
            
            {builds.map((build) => (
              <TouchableOpacity
                key={build.id}
                className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
              >
                <View className="gap-3">
                  {/* Build Header */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View 
                        className={`w-3 h-3 rounded-full ${
                          build.status === "success" 
                            ? "bg-success" 
                            : build.status === "error" 
                            ? "bg-error" 
                            : "bg-warning"
                        }`} 
                      />
                      <Text className="text-base font-semibold text-foreground">
                        {getPlatformText(build.platform)} - {getProfileText(build.profile)}
                      </Text>
                    </View>
                    <IconSymbol 
                      name="chevron.right" 
                      size={20} 
                      color={colors.muted} 
                    />
                  </View>

                  {/* Build Details */}
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">状态</Text>
                      <Text className={`text-sm font-medium ${
                        build.status === "success" 
                          ? "text-success" 
                          : build.status === "error" 
                          ? "text-error" 
                          : "text-warning"
                      }`}>
                        {getStatusText(build.status)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">时间</Text>
                      <Text className="text-sm text-foreground">{build.timestamp}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">耗时</Text>
                      <Text className="text-sm text-foreground">{build.duration}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Build Statistics */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-3">
              构建统计
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">总构建次数</Text>
                <Text className="text-sm text-foreground font-medium">{builds.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">成功率</Text>
                <Text className="text-sm text-success font-medium">100%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">平均耗时</Text>
                <Text className="text-sm text-foreground font-medium">9m 12s</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
