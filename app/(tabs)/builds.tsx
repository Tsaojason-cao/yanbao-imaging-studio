import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Photo {
  id: string;
  timestamp: string;
  preset: string;
  color: string;
}

/**
 * Builds Screen - 网格相册界面
 * 
 * 包含：
 * - 照片网格视图
 * - 记忆预设快速访问
 * - 云端备份状态
 * - 照片筛选和排序
 */
export default function BuildsScreen() {
  const colors = useColors();
  const [selectedPreset, setSelectedPreset] = useState("全部");

  const [photos] = useState<Photo[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: `photo-${i}`,
      timestamp: `2026-01-${String(12 - Math.floor(i / 3)).padStart(2, "0")}`,
      preset: ["自然", "清新", "复古", "胶片"][i % 4],
      color: ["#E879F9", "#60A5FA", "#86EFAC", "#FDE047"][i % 4],
    }))
  );

  const presets = ["全部", "自然", "清新", "复古", "胶片"];

  const filteredPhotos =
    selectedPreset === "全部"
      ? photos
      : photos.filter((p) => p.preset === selectedPreset);

  return (
    <ScreenContainer className="bg-background">
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          我的相册
        </Text>
        <TouchableOpacity style={[styles.cloudButton, { backgroundColor: colors.success + "20" }]}>
          <IconSymbol name="house.fill" size={20} color={colors.success} />
          <Text style={[styles.cloudText, { color: colors.success }]}>
            已备份
          </Text>
        </TouchableOpacity>
      </View>

      {/* 记忆预设 */}
      <View style={styles.presetsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          记忆预设
        </Text>
        <View style={styles.presetsList}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => setSelectedPreset(preset)}
              style={[
                styles.presetButton,
                {
                  backgroundColor:
                    selectedPreset === preset ? colors.primary : colors.surface,
                  borderColor: selectedPreset === preset ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.presetText,
                  {
                    color: selectedPreset === preset ? "#FFFFFF" : colors.foreground,
                  },
                ]}
              >
                {preset}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 照片网格 */}
      <FlatList
        data={filteredPhotos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PhotoGridItem photo={item} index={index} />
        )}
      />

      {/* 统计信息 */}
      <View style={[styles.statsBar, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {photos.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            张照片
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            256 MB
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            已使用
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            100%
          </Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            已备份
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function PhotoGridItem({ photo, index }: { photo: Photo; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = (index % 9) * 50;
    scale.value = withDelay(delay, withSpring(1));
    opacity.value = withDelay(delay, withSpring(1));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.photoItem, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.photoCard,
          {
            backgroundColor: photo.color,
          },
        ]}
      >
        <View style={styles.photoContent}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoPreset}>{photo.preset}</Text>
        </View>
        <Text style={styles.photoDate}>{photo.timestamp}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  cloudButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  cloudText: {
    fontSize: 12,
    fontWeight: "600",
  },
  presetsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  presetsList: {
    flexDirection: "row",
    gap: 8,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  presetText: {
    fontSize: 13,
    fontWeight: "600",
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  photoItem: {
    width: "33.33%",
    padding: 4,
  },
  photoCard: {
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
  },
  photoContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  photoIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  photoPreset: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  photoDate: {
    fontSize: 10,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  statsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: "100%",
  },
});
