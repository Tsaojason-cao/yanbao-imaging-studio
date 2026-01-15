import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Platform, Image, Dimensions, RefreshControl, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import { KuromiLoadingAnimation } from "@/components/kuromi-ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 2.5;

// Tab类型
type TabType = "photos" | "presets" | "backup";

// 照片数据类型
interface Photo {
  id: string;
  uri: string;
  date: string;
  timestamp: number;
}

// 记忆预设数据类型
interface MemoryPreset {
  id: string;
  name: string;
  description: string;
  color: string;
  params: {
    smooth: number;
    whiten: number;
    thinFace: number;
    bigEye: number;
    ruddy: number;
    sharpen: number;
    brightness: number;
  };
}

export default function GalleryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [presets, setPresets] = useState<MemoryPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  // 加载真实照片
  const loadPhotos = async () => {
    try {
      if (!permission?.granted) {
        const { status } = await requestPermission();
        if (status !== "granted") {
          console.log("相册权限未授予");
          setLoading(false);
          return;
        }
      }

      // 获取相册中的照片
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 500, // 加载最近500张照片
        mediaType: "photo",
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], // 按时间倒序
      });

      // 转换为应用内格式
      const formattedPhotos: Photo[] = await Promise.all(
        assets.map(async (asset) => {
          // 获取真实的本地URI
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          const localUri = assetInfo.localUri || asset.uri;

          return {
            id: asset.id,
            uri: localUri,
            date: formatDate(asset.creationTime),
            timestamp: asset.creationTime,
          };
        })
      );

      setPhotos(formattedPhotos);
    } catch (error) {
      console.error("加载照片失败:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 加载预设
  const loadPresets = async () => {
    try {
      const presetsDir = `${FileSystem.documentDirectory!}presets/`;
      const dirInfo = await FileSystem.getInfoAsync(presetsDir);

      if (!dirInfo.exists) {
        // 创建预设目录并保存默认预设
        await FileSystem.makeDirectoryAsync(presetsDir, { intermediates: true });
        await saveDefaultPresets(presetsDir);
      }

      // 读取所有预设文件
      const files = await FileSystem.readDirectoryAsync(presetsDir);
      const loadedPresets: MemoryPreset[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await FileSystem.readAsStringAsync(`${presetsDir}${file}`);
          const preset = JSON.parse(content);
          loadedPresets.push(preset);
        }
      }

      setPresets(loadedPresets);
    } catch (error) {
      console.error("加载预设失败:", error);
    }
  };

  // 保存默认预设
  const saveDefaultPresets = async (presetsDir: string) => {
    const defaultPresets: MemoryPreset[] = [
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

    for (const preset of defaultPresets) {
      await FileSystem.writeAsStringAsync(
        `${presetsDir}${preset.id}.json`,
        JSON.stringify(preset, null, 2)
      );
    }
  };

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "今天";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨天";
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  // 按日期分组照片
  const groupPhotosByDate = (): { [key: string]: Photo[] } => {
    const grouped: { [key: string]: Photo[] } = {};

    photos.forEach((photo) => {
      if (!grouped[photo.date]) {
        grouped[photo.date] = [];
      }
      grouped[photo.date].push(photo);
    });

    return grouped;
  };

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    loadPhotos();
  };

  useEffect(() => {
    loadPhotos();
    loadPresets();
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveTab(tab);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  // 渲染照片网格
  const renderPhotoGrid = () => {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
          <KuromiLoadingAnimation size={80} />
          <Text style={{ color: colors.foreground, marginTop: 20, fontSize: 16 }}>加载中...</Text>
        </View>
      );
    }

    if (!permission?.granted) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
          <Ionicons name="images-outline" size={64} color={colors.muted} />
          <Text style={{ color: colors.foreground, marginTop: 20, fontSize: 18, fontWeight: "600", textAlign: "center" }}>
            需要相册权限
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14, textAlign: "center" }}>
            请授予相册访问权限以查看照片
          </Text>
          <Pressable
            style={{
              marginTop: 24,
              backgroundColor: "#E879F9",
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: 12,
            }}
            onPress={requestPermission}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>授予权限</Text>
          </Pressable>
        </View>
      );
    }

    if (photos.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}>
          <Ionicons name="images-outline" size={64} color={colors.muted} />
          <Text style={{ color: colors.foreground, marginTop: 20, fontSize: 18, fontWeight: "600" }}>
            暂无照片
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14, textAlign: "center" }}>
            使用相机拍摄第一张照片吧
          </Text>
        </View>
      );
    }

    const groupedPhotos = groupPhotosByDate();
    const sections = Object.keys(groupedPhotos).map((date) => ({
      title: date,
      data: groupedPhotos[date],
    }));

    return (
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {sections.map((section) => (
          <View key={section.title} style={{ marginBottom: 24 }}>
            {/* 日期标题 */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.foreground,
                marginBottom: 12,
                paddingHorizontal: 16,
              }}
            >
              {section.title}
            </Text>

            {/* 照片网格 */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: 16,
                gap: 8,
              }}
            >
              {section.data.map((photo) => (
                <Pressable
                  key={photo.id}
                  style={({ pressed }) => [
                    {
                      width: IMAGE_SIZE,
                      height: IMAGE_SIZE,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: colors.surface,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    // TODO: 打开照片详情
                  }}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  // 渲染预设列表
  const renderPresets = () => {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16 }}>
          保存的美颜参数预设，一键加载快速拍摄
        </Text>

        {presets.map((preset) => (
          <Pressable
            key={preset.id}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: preset.color,
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              // TODO: 加载预设参数
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                  {preset.name}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>{preset.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.muted} />
            </View>

            {/* 参数预览 */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12, gap: 8 }}>
              {Object.entries(preset.params).map(([key, value]) => (
                <View
                  key={key}
                  style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {getParamLabel(key)}: {value}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}

        {/* 添加新预设按钮 */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              borderWidth: 2,
              borderColor: colors.border,
              borderStyle: "dashed",
            },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            // TODO: 创建新预设
          }}
        >
          <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.primary, marginTop: 8 }}>
            创建新预设
          </Text>
        </Pressable>
      </ScrollView>
    );
  };

  // 渲染云端备份
  const renderBackup = () => {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Ionicons name="cloud-done" size={32} color="#10B981" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
                云端备份已开启
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                照片将自动备份到云端
              </Text>
            </View>
          </View>

          {/* 备份进度 */}
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: colors.muted }}>已备份</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                {photos.length} 张照片
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.background,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#10B981",
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>

        {/* 存储空间 */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>
            存储空间
          </Text>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: colors.muted }}>本地占用</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                计算中...
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: colors.muted }}>云端容量</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                计算中...
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // 获取参数标签
  const getParamLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      smooth: "磨皮",
      whiten: "美白",
      thinFace: "瘦脸",
      bigEye: "大眼",
      ruddy: "红润",
      sharpen: "锐化",
      brightness: "亮度",
    };
    return labels[key] || key;
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* 顶部导航 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable
            style={{ padding: 8 }}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginLeft: 12 }}>
            相册
          </Text>
        </View>

        {/* 雁宝记忆入口 */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.surface,
          }}
        >
          <Pressable
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: "#E879F9",
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
          >
            <MaterialCommunityIcons name="heart" size={24} color="white" />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "white", marginLeft: 12, flex: 1 }}>
              💜 雁宝记忆
            </Text>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              {presets.length} 个预设
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>

        {/* Tab切换 */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: activeTab === "photos" ? colors.primary : colors.surface,
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => handleTabChange("photos")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: activeTab === "photos" ? "#FFFFFF" : colors.muted,
              }}
            >
              照片
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: activeTab === "presets" ? colors.primary : colors.surface,
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => handleTabChange("presets")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: activeTab === "presets" ? "#FFFFFF" : colors.muted,
              }}
            >
              预设
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: activeTab === "backup" ? colors.primary : colors.surface,
              },
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => handleTabChange("backup")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: activeTab === "backup" ? "#FFFFFF" : colors.muted,
              }}
            >
              备份
            </Text>
          </Pressable>
        </View>

        {/* 内容区域 */}
        {activeTab === "photos" && renderPhotoGrid()}
        {activeTab === "presets" && renderPresets()}
        {activeTab === "backup" && renderBackup()}
      </View>
    
        {/* 雁宝记忆按钮 */}
        <Pressable
          style={({ pressed }) => [
            {
              position: 'absolute',
              bottom: 24,
              right: 24,
              width: 64,
              height: 64,
              borderRadius: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            },
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            router.push("/memory-manager");
          }}
        >
          <LinearGradient
            colors={["#F472B6", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '100%', borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="heart" size={28} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>

      </ScreenContainer>
  );
}

// 获取参数标签的辅助函数
function getParamLabel(key: string): string {
  const labels: { [key: string]: string } = {
    smooth: "磨皮",
    whiten: "美白",
    thinFace: "瘦脸",
    bigEye: "大眼",
    ruddy: "红润",
    sharpen: "锐化",
    brightness: "亮度",
  };
  return labels[key] || key;
}
