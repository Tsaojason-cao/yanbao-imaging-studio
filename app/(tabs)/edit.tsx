import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function EditScreen() {
  const router = useRouter();
  const [showComparison, setShowComparison] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("原图");
  const comparePosition = useSharedValue(0.5);

  // 7维美颜参数
  const [editParams, setEditParams] = useState({
    skin: 45,      // 肤质
    light: 38,     // 光影
    bone: 25,      // 骨相
    color: 50,     // 色彩
    whitening: 42, // 美白
    eye: 30,       // 大眼
    face: 28,      // 瘦脸
  });

  // 滤镜列表
  const filters = [
    { name: "原图", icon: "image-outline" },
    { name: "清新", icon: "leaf-outline" },
    { name: "复古", icon: "time-outline" },
    { name: "冷色", icon: "snow-outline" },
    { name: "暖色", icon: "sunny-outline" },
    { name: "黑白", icon: "contrast-outline" },
    { name: "鲜艳", icon: "color-palette-outline" },
    { name: "柔和", icon: "heart-outline" },
  ];

  // Comparison slider logic (simplified for now)
  const handleCompareSlide = (x: number) => {
    comparePosition.value = Math.max(0, Math.min(1, x / 300));
  };

  const sliderStyle = useAnimatedStyle(() => ({
    left: `${comparePosition.value * 100}%`,
  }));

  const handleSave = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    alert("照片已保存");
  };

  return (
    <LinearGradient
      colors={["#E9D5FF" as const, "#FBE7F3" as const, "#FCE7F3" as const]}
      style={{ flex: 1 }}
    >
      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部标题栏 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>照片编辑</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>保存</Text>
            </TouchableOpacity>
          </View>

          {/* 图片预览区 */}
          <View style={styles.previewSection}>
            <View style={styles.previewContainer}>
              <BlurView intensity={20} style={styles.previewBlur}>
                <View style={styles.previewImage}>
                  <Ionicons name="image" size={80} color="#9CA3AF" />
                  <Text style={styles.previewText}>选择照片开始编辑</Text>
                </View>
              </BlurView>

              {/* Before/After对比按钮 */}
              <TouchableOpacity
                style={styles.compareButton}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setShowComparison(!showComparison);
                }}
              >
                <MaterialCommunityIcons
                  name="compare"
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.compareText}>对比</Text>
              </TouchableOpacity>

              {/* 库洛米装饰 */}
              <View style={styles.previewKuromi}>
                <View style={styles.kuromiHead}>
                  <View style={[styles.kuromiEar, styles.kuromiEarLeft]} />
                  <View style={[styles.kuromiEar, styles.kuromiEarRight]} />
                  <View style={styles.kuromiFace}>
                    <View style={styles.kuromiEyes}>
                      <View style={styles.kuromiEye} />
                      <View style={styles.kuromiEye} />
                    </View>
                  </View>
                  <View style={styles.kuromiBow} />
                </View>
              </View>
            </View>
          </View>

          {/* 7维美颜滑块 */}
          <View style={styles.adjustSection}>
            <Text style={styles.sectionTitle}>美颜调节</Text>
            <View style={styles.adjustCard}>
              <BlurView intensity={30} style={styles.adjustBlur}>
                <LinearGradient
                  colors={["rgba(168, 85, 247, 0.15)" as const, "rgba(236, 72, 153, 0.15)" as const]}
                  style={styles.adjustGradient}
                >
                  {[
                    { key: "skin", label: "肤质", value: editParams.skin },
                    { key: "light", label: "光影", value: editParams.light },
                    { key: "bone", label: "骨相", value: editParams.bone },
                    { key: "color", label: "色彩", value: editParams.color },
                    { key: "whitening", label: "美白", value: editParams.whitening },
                    { key: "eye", label: "大眼", value: editParams.eye },
                    { key: "face", label: "瘦脸", value: editParams.face },
                  ].map((param) => (
                    <View key={param.key} style={styles.sliderRow}>
                      <Text style={styles.sliderLabel}>{param.label}</Text>
                      <View style={styles.sliderTrack}>
                        <View
                          style={[
                            styles.sliderFill,
                            { width: `${param.value}%` },
                          ]}
                        />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: `${param.value}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.sliderValue}>{param.value}</Text>
                    </View>
                  ))}
                </LinearGradient>
              </BlurView>
            </View>
          </View>

          {/* 滤镜网格 */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>滤镜选择</Text>
            <View style={styles.filterGrid}>
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterItem,
                    selectedFilter === filter.name && styles.filterItemActive,
                  ]}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedFilter(filter.name);
                  }}
                >
                  <BlurView intensity={20} style={styles.filterBlur}>
                    <LinearGradient
                      colors={
                        selectedFilter === filter.name
                          ? ["#A78BFA" as const, "#EC4899" as const]
                          : ["rgba(255, 255, 255, 0.8)" as const, "rgba(255, 255, 255, 0.6)" as const]
                      }
                      style={styles.filterGradient}
                    >
                      <Ionicons
                        name={filter.icon as any}
                        size={32}
                        color={selectedFilter === filter.name ? "#FFFFFF" : "#6B7280"}
                      />
                      <Text
                        style={[
                          styles.filterName,
                          selectedFilter === filter.name && styles.filterNameActive,
                        ]}
                      >
                        {filter.name}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#8B5CF6",
    borderRadius: 22,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  previewSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  previewContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.3)",
    position: "relative",
  },
  previewBlur: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  previewImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  previewText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  compareButton: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 92, 246, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  compareText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  previewKuromi: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
  },
  adjustSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
  },
  adjustCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  adjustBlur: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  adjustGradient: {
    padding: 20,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    width: 50,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(209, 213, 219, 0.8)",
    borderRadius: 4,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#EC4899",
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    top: -4,
    width: 16,
    height: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#EC4899",
    marginLeft: -8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    width: 36,
    textAlign: "right",
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  filterItem: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  filterItemActive: {
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  filterBlur: {
    flex: 1,
  },
  filterGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  filterName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterNameActive: {
    color: "#FFFFFF",
  },
  kuromiHead: {
    width: 50,
    height: 50,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 18,
    backgroundColor: "#2D3748",
    borderRadius: 6,
  },
  kuromiEarLeft: {
    left: 8,
  },
  kuromiEarRight: {
    right: 8,
  },
  kuromiFace: {
    width: 38,
    height: 38,
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  kuromiEye: {
    width: 7,
    height: 10,
    backgroundColor: "#1F2937",
    borderRadius: 3.5,
  },
  kuromiBow: {
    position: "absolute",
    top: -5,
    right: -3,
    width: 20,
    height: 10,
    backgroundColor: "#F472B6",
    borderRadius: 5,
  },
});
