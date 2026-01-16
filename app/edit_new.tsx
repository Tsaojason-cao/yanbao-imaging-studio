import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

/**
 * Edit Screen - Photo Editor
 * 
 * 核心功能：31位大师滤镜阵列
 * 
 * 大师列表包括：
 * - 肖全、林海音、Ansel Adams、Henri Cartier-Bresson
 * - Steve McCurry、Annie Leibovitz、Richard Avedon
 * - Sebastião Salgado、Diane Arbus、Irving Penn
 * - 以及更多世界级摄影大师的风格预设
 */
export default function EditScreen() {
  const router = useRouter();
  const [selectedMaster, setSelectedMaster] = useState(0);
  const [intensity, setIntensity] = useState(75);

  // 31位大师滤镜预设
  const masterPresets = [
    { id: 1, name: "肖全", nameEn: "Xiao Quan", style: "人文纪实", color: "#E879F9", icon: "📸" },
    { id: 2, name: "林海音", nameEn: "Lin Haiyin", style: "文学影像", color: "#F472B6", icon: "📖" },
    { id: 3, name: "Ansel Adams", nameEn: "Ansel Adams", style: "风光大师", color: "#A78BFA", icon: "🏔️" },
    { id: 4, name: "Henri Cartier-Bresson", nameEn: "HCB", style: "决定性瞬间", color: "#60A5FA", icon: "⏱️" },
    { id: 5, name: "Steve McCurry", nameEn: "McCurry", style: "人文色彩", color: "#34D399", icon: "🌍" },
    { id: 6, name: "Annie Leibovitz", nameEn: "Leibovitz", style: "肖像大师", color: "#FDE047", icon: "👤" },
    { id: 7, name: "Richard Avedon", nameEn: "Avedon", style: "时尚肖像", color: "#FB923C", icon: "👗" },
    { id: 8, name: "Sebastião Salgado", nameEn: "Salgado", style: "社会纪实", color: "#F87171", icon: "🌐" },
    { id: 9, name: "Diane Arbus", nameEn: "Arbus", style: "边缘人像", color: "#EC4899", icon: "🎭" },
    { id: 10, name: "Irving Penn", nameEn: "Penn", style: "静物大师", color: "#A78BFA", icon: "🎨" },
    { id: 11, name: "Dorothea Lange", nameEn: "Lange", style: "大萧条纪实", color: "#60A5FA", icon: "📰" },
    { id: 12, name: "Robert Capa", nameEn: "Capa", style: "战地摄影", color: "#EF4444", icon: "⚔️" },
    { id: 13, name: "Cindy Sherman", nameEn: "Sherman", style: "观念摄影", color: "#8B5CF6", icon: "🎬" },
    { id: 14, name: "Helmut Newton", nameEn: "Newton", style: "时尚先锋", color: "#EC4899", icon: "💋" },
    { id: 15, name: "Man Ray", nameEn: "Man Ray", style: "超现实主义", color: "#A78BFA", icon: "🌙" },
    { id: 16, name: "Edward Weston", nameEn: "Weston", style: "形式主义", color: "#60A5FA", icon: "🌿" },
    { id: 17, name: "Walker Evans", nameEn: "Evans", style: "美国纪实", color: "#10B981", icon: "🏛️" },
    { id: 18, name: "Garry Winogrand", nameEn: "Winogrand", style: "街头摄影", color: "#F59E0B", icon: "🚶" },
    { id: 19, name: "William Eggleston", nameEn: "Eggleston", style: "彩色先驱", color: "#EF4444", icon: "🎨" },
    { id: 20, name: "Joel Meyerowitz", nameEn: "Meyerowitz", style: "街头色彩", color: "#EC4899", icon: "🌆" },
    { id: 21, name: "Sally Mann", nameEn: "Mann", style: "家庭肖像", color: "#A78BFA", icon: "👨‍👩‍👧" },
    { id: 22, name: "Gregory Crewdson", nameEn: "Crewdson", style: "电影感", color: "#8B5CF6", icon: "🎥" },
    { id: 23, name: "Andreas Gursky", nameEn: "Gursky", style: "大画幅", color: "#06B6D4", icon: "🖼️" },
    { id: 24, name: "Nan Goldin", nameEn: "Goldin", style: "亲密日记", color: "#EC4899", icon: "💕" },
    { id: 25, name: "Martin Parr", nameEn: "Parr", style: "讽刺纪实", color: "#F59E0B", icon: "🎪" },
    { id: 26, name: "Daido Moriyama", nameEn: "Moriyama", style: "粗粒子", color: "#6B7280", icon: "🌃" },
    { id: 27, name: "Nobuyoshi Araki", nameEn: "Araki", style: "私摄影", color: "#EC4899", icon: "🌸" },
    { id: 28, name: "Hiroshi Sugimoto", nameEn: "Sugimoto", style: "极简主义", color: "#60A5FA", icon: "🌊" },
    { id: 29, name: "Rinko Kawauchi", nameEn: "Kawauchi", style: "日常诗意", color: "#F9A8D4", icon: "✨" },
    { id: 30, name: "Fan Ho", nameEn: "Fan Ho", style: "光影大师", color: "#FDE047", icon: "💡" },
    { id: 31, name: "Yanbao AI", nameEn: "Yanbao", style: "专属审美", color: "#EC4899", icon: "🐰" },
  ];

  const handleMasterSelect = (index: number) => {
    setSelectedMaster(index);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="bg-[#0a0a0a]">
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photo Editor</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* 预览区域 - Before/After 对比 */}
      <View style={styles.previewContainer}>
        <LinearGradient
          colors={["#8B5CF6", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewBorder}
        >
          <View style={styles.preview}>
            <View style={styles.previewSplit}>
              <View style={[styles.previewHalf, styles.previewBefore]}>
                <Text style={styles.previewLabel}>BEFORE</Text>
              </View>
              <View style={[styles.previewHalf, styles.previewAfter]}>
                <Text style={styles.previewLabel}>AFTER</Text>
              </View>
            </View>
            
            {/* 分割线滑块 */}
            <View style={styles.divider}>
              <View style={styles.dividerHandle}>
                <IconSymbol name="line.3.horizontal" size={20} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 31位大师滤镜卷轴 */}
      <View style={styles.masterScrollContainer}>
        <Text style={styles.sectionTitle}>大师滤镜阵列</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.masterScroll}
        >
          {masterPresets.map((master, index) => (
            <TouchableOpacity
              key={master.id}
              style={[
                styles.masterCard,
                selectedMaster === index && styles.masterCardSelected,
              ]}
              onPress={() => handleMasterSelect(index)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  selectedMaster === index
                    ? [master.color, "#EC4899"]
                    : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
                }
                style={styles.masterCardGradient}
              >
                <Text style={styles.masterIcon}>{master.icon}</Text>
                <Text style={styles.masterName}>{master.name}</Text>
                <Text style={styles.masterNameEn}>{master.nameEn}</Text>
                <Text style={styles.masterStyle}>{master.style}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 强度调节滑块 */}
      <View style={styles.intensityContainer}>
        <View style={styles.intensityHeader}>
          <Text style={styles.intensityLabel}>Intensity</Text>
          <Text style={styles.intensityValue}>{intensity}%</Text>
        </View>
        <Slider
          style={styles.intensitySlider}
          minimumValue={0}
          maximumValue={100}
          value={intensity}
          onValueChange={(value) => setIntensity(Math.round(value))}
          minimumTrackTintColor="#EC4899"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
          thumbTintColor="#EC4899"
        />
      </View>

      {/* 底部工具栏 */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton}>
          <IconSymbol name="slider.horizontal.3" size={24} color="#999999" />
          <Text style={styles.toolLabel}>Adjust</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toolButton, styles.toolButtonActive]}>
          <IconSymbol name="wand.and.stars" size={24} color="#EC4899" />
          <Text style={[styles.toolLabel, styles.toolLabelActive]}>Presets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton}>
          <IconSymbol name="crop" size={24} color="#999999" />
          <Text style={styles.toolLabel}>Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton}>
          <IconSymbol name="square.and.arrow.up" size={24} color="#999999" />
          <Text style={styles.toolLabel}>Export</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  previewContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  previewBorder: {
    borderRadius: 24,
    padding: 3,
  },
  preview: {
    height: 280,
    borderRadius: 21,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    position: "relative",
  },
  previewSplit: {
    flex: 1,
    flexDirection: "row",
  },
  previewHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewBefore: {
    backgroundColor: "#2a2a2a",
  },
  previewAfter: {
    backgroundColor: "#3a3a3a",
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  divider: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#FFFFFF",
    marginLeft: -2,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerHandle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  masterScrollContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  masterScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  masterCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
  },
  masterCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  masterCardGradient: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  masterIcon: {
    fontSize: 24,
  },
  masterName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  masterNameEn: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  masterStyle: {
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
  intensityContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(42, 31, 63, 0.5)",
  },
  intensityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  intensityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EC4899",
  },
  intensitySlider: {
    width: "100%",
    height: 40,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  toolButton: {
    alignItems: "center",
    gap: 4,
  },
  toolButtonActive: {
    // Active state styling
  },
  toolLabel: {
    fontSize: 11,
    color: "#999999",
  },
  toolLabelActive: {
    color: "#EC4899",
    fontWeight: "600",
  },
});
