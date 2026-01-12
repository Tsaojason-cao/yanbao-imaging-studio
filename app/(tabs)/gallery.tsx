import { useState } from "react";
import { View, Text, Pressable, ScrollView, Platform, Image, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 3;

// Tab类型
type TabType = "photos" | "presets" | "backup";

// 示例照片数据
const SAMPLE_PHOTOS = [
  { id: "1", uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", date: "今天" },
  { id: "2", uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200", date: "今天" },
  { id: "3", uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200", date: "今天" },
  { id: "4", uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200", date: "昨天" },
  { id: "5", uri: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200", date: "昨天" },
  { id: "6", uri: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200", date: "昨天" },
];

// 记忆预设数据
const MEMORY_PRESETS = [
  {
    id: "1",
    name: "雁宝专属",
    description: "为雁宝定制的专属美颜参数",
    color: "#E879F9",
    params: { smooth: 80, whiten: 70, thinFace: 60, bigEye: 75, ruddy: 50, sharpen: 40, brightness: 30 },
  },
  {
    id: "2",
    name: "日常自然",
    description: "适合日常拍摄的自然风格",
    color: "#10B981",
    params: { smooth: 40, whiten: 30, thinFace: 20, bigEye: 35, ruddy: 25, sharpen: 50, brightness: 10 },
  },
  {
    id: "3",
    name: "冰壳模式",
    description: "清冷高级的冰壳质感",
    color: "#3B82F6",
    params: { smooth: 90, whiten: 85, thinFace: 70, bigEye: 80, ruddy: 15, sharpen: 60, brightness: 40 },
  },
];

export default function GalleryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedTab, setSelectedTab] = useState<TabType>("photos");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // 应用预设
  const applyPreset = (presetId: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // TODO: 应用预设参数
    console.log("Apply preset:", presetId);
  };

  // 渲染照片网格
  const renderPhotosTab = () => {
    const groupedPhotos = SAMPLE_PHOTOS.reduce((acc, photo) => {
      if (!acc[photo.date]) {
        acc[photo.date] = [];
      }
      acc[photo.date].push(photo);
      return acc;
    }, {} as Record<string, typeof SAMPLE_PHOTOS>);

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {Object.entries(groupedPhotos).map(([date, photos]) => (
          <View key={date} className="mb-6">
            <Text className="text-foreground text-lg font-semibold mb-3 px-6">
              {date}
            </Text>
            <View className="flex-row flex-wrap px-6" style={{ gap: 6 }}>
              {photos.map((photo) => (
                <Pressable
                  key={photo.id}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    // TODO: 打开照片详情
                  }}
                  style={({ pressed }) => ({
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    borderRadius: 12,
                    overflow: "hidden",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  // 渲染记忆预设Tab
  const renderPresetsTab = () => {
    return (
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-2xl font-bold mb-2">记忆预设</Text>
        <Text className="text-muted mb-6">保存你最爱的美颜参数组合</Text>

        {MEMORY_PRESETS.map((preset) => (
          <Pressable
            key={preset.id}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setSelectedPreset(preset.id);
            }}
            style={({ pressed }) => ({
              marginBottom: 16,
              padding: 20,
              borderRadius: 24,
              backgroundColor: colors.surface,
              borderWidth: selectedPreset === preset.id ? 2 : 0,
              borderColor: preset.color,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: preset.color,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons name="star" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-foreground text-lg font-semibold">
                    {preset.name}
                  </Text>
                  <Text className="text-muted text-sm">{preset.description}</Text>
                </View>
              </View>
            </View>

            {/* 参数条形图 */}
            <View className="gap-2">
              {Object.entries(preset.params).map(([key, value]) => (
                <View key={key} className="flex-row items-center gap-2">
                  <Text className="text-muted text-xs w-16">
                    {key === "smooth" ? "磨皮" :
                     key === "whiten" ? "美白" :
                     key === "thinFace" ? "瘦脸" :
                     key === "bigEye" ? "大眼" :
                     key === "ruddy" ? "红润" :
                     key === "sharpen" ? "锐化" : "亮度"}
                  </Text>
                  <View className="flex-1 h-2 rounded-full" style={{ backgroundColor: colors.border }}>
                    <View
                      className="h-2 rounded-full"
                      style={{ width: `${value}%`, backgroundColor: preset.color }}
                    />
                  </View>
                  <Text className="text-muted text-xs w-8">{value}</Text>
                </View>
              ))}
            </View>

            {/* Apply按钮 */}
            {selectedPreset === preset.id && (
              <Pressable
                onPress={() => applyPreset(preset.id)}
                style={({ pressed }) => ({
                  marginTop: 16,
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: preset.color,
                  alignItems: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-white font-semibold">应用预设</Text>
              </Pressable>
            )}
          </Pressable>
        ))}

        {/* 创建新预设按钮 */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            // TODO: 创建新预设
          }}
          style={({ pressed }) => ({
            marginBottom: 24,
            paddingVertical: 16,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-white font-semibold">+ 创建新预设</Text>
        </Pressable>
      </ScrollView>
    );
  };

  // 渲染云端备份Tab
  const renderBackupTab = () => {
    const backupProgress = 75;
    const backedUp = 9;
    const total = 12;
    const remaining = total - backedUp;

    return (
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-foreground text-2xl font-bold mb-2">云端备份</Text>
        <Text className="text-muted mb-6">自动备份你的照片到云端</Text>

        {/* 圆形进度条 */}
        <View className="items-center mb-8">
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 12,
              borderColor: colors.primary,
            }}
          >
            <Text className="text-foreground text-5xl font-bold">{backupProgress}%</Text>
            <Text className="text-muted text-sm mt-2">备份进度</Text>
          </View>
        </View>

        {/* 备份统计 */}
        <View className="p-6 rounded-3xl mb-6" style={{ backgroundColor: colors.surface }}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="cloud-check" size={32} color={colors.primary} />
              <View>
                <Text className="text-foreground text-lg font-semibold">已备份</Text>
                <Text className="text-muted text-sm">{backedUp} / {total} 张照片</Text>
              </View>
            </View>
            <Text className="text-primary text-2xl font-bold">{backedUp}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="cloud-upload" size={32} color={colors.muted} />
              <View>
                <Text className="text-foreground text-lg font-semibold">剩余</Text>
                <Text className="text-muted text-sm">预计 2 分钟</Text>
              </View>
            </View>
            <Text className="text-muted text-2xl font-bold">{remaining}</Text>
          </View>
        </View>

        {/* 备份设置 */}
        <View className="p-6 rounded-3xl mb-6" style={{ backgroundColor: colors.surface }}>
          <Text className="text-foreground text-lg font-semibold mb-4">备份设置</Text>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="backup-restore" size={24} color={colors.foreground} />
              <Text className="text-foreground">自动备份</Text>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ({
                width: 51,
                height: 31,
                borderRadius: 15.5,
                backgroundColor: colors.primary,
                justifyContent: "center",
                paddingHorizontal: 2,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 13.5,
                  backgroundColor: "white",
                  alignSelf: "flex-end",
                }}
              />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name="wifi" size={24} color={colors.foreground} />
              <Text className="text-foreground">仅 Wi-Fi</Text>
            </View>
            <Pressable
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ({
                width: 51,
                height: 31,
                borderRadius: 15.5,
                backgroundColor: colors.primary,
                justifyContent: "center",
                paddingHorizontal: 2,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 13.5,
                  backgroundColor: "white",
                  alignSelf: "flex-end",
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* 立即备份按钮 */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            // TODO: 开始备份
          }}
          style={({ pressed }) => ({
            marginBottom: 24,
            paddingVertical: 16,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-white font-semibold">立即备份</Text>
        </Pressable>
      </ScrollView>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      {/* 顶部标题 */}
      <View className="pt-12 px-6 pb-4">
        <Text className="text-foreground text-3xl font-bold">相册</Text>
      </View>

      {/* Tab切换 */}
      <View className="flex-row gap-2 px-6 mb-4">
        {[
          { id: "photos", label: "照片", icon: "images" },
          { id: "presets", label: "预设", icon: "star" },
          { id: "backup", label: "备份", icon: "cloud-upload" },
        ].map(({ id, label, icon }) => (
          <Pressable
            key={id}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setSelectedTab(id as TabType);
            }}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: selectedTab === id ? colors.primary : colors.surface,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons
              name={icon as any}
              size={18}
              color={selectedTab === id ? "white" : colors.foreground}
            />
            <Text
              className="font-semibold"
              style={{ color: selectedTab === id ? "white" : colors.foreground }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab内容 */}
      {selectedTab === "photos" && renderPhotosTab()}
      {selectedTab === "presets" && renderPresetsTab()}
      {selectedTab === "backup" && renderBackupTab()}
    </ScreenContainer>
  );
}
