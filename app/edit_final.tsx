import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { MASTER_PRESETS, getMasterRadarData, type MasterPreset } from "@/constants/master-presets";

const { width } = Dimensions.get("window");

/**
 * Edit Screen - Photo Editor with 31 Master Presets
 * 
 * 核心功能：
 * - 31位大师滤镜参数矩阵
 * - 实时参数雷达图显示
 * - Before/After 对比预览
 */
export default function EditScreen() {
  const router = useRouter();
  const [selectedMaster, setSelectedMaster] = useState(0);
  const [intensity, setIntensity] = useState(75);
  const [showParams, setShowParams] = useState(true);

  const currentPreset = MASTER_PRESETS[selectedMaster];
  const radarData = getMasterRadarData(currentPreset);

  const handleMasterSelect = (index: number) => {
    setSelectedMaster(index);
    setShowParams(true);
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
                
                {/* 当前大师信息叠加层 */}
                {showParams && (
                  <View style={styles.masterInfoOverlay}>
                    <Text style={styles.masterInfoIcon}>{currentPreset.icon}</Text>
                    <Text style={styles.masterInfoName}>{currentPreset.name}</Text>
                    <Text style={styles.masterInfoStyle}>{currentPreset.style}</Text>
                  </View>
                )}
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

      {/* 大师参数面板 */}
      {showParams && (
        <View style={styles.paramsPanel}>
          <View style={styles.paramsPanelHeader}>
            <Text style={styles.paramsPanelTitle}>参数矩阵</Text>
            <TouchableOpacity onPress={() => setShowParams(false)}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#999999" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.paramsGrid}>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>曝光</Text>
                <Text style={styles.paramValue}>{currentPreset.params.exposure.toFixed(1)}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>对比度</Text>
                <Text style={styles.paramValue}>{currentPreset.params.contrast}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>饱和度</Text>
                <Text style={styles.paramValue}>{currentPreset.params.saturation}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>高光</Text>
                <Text style={styles.paramValue}>{currentPreset.params.highlights}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>阴影</Text>
                <Text style={styles.paramValue}>{currentPreset.params.shadows}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>色温</Text>
                <Text style={styles.paramValue}>{currentPreset.params.temperature}K</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>颗粒</Text>
                <Text style={styles.paramValue}>{currentPreset.params.grain}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>暗角</Text>
                <Text style={styles.paramValue}>{currentPreset.params.vignette}</Text>
              </View>
              <View style={styles.paramItem}>
                <Text style={styles.paramLabel}>锐度</Text>
                <Text style={styles.paramValue}>{currentPreset.params.sharpness}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* 31位大师滤镜卷轴 */}
      <View style={styles.masterScrollContainer}>
        <Text style={styles.sectionTitle}>大师滤镜阵列 ({MASTER_PRESETS.length}位)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.masterScroll}
        >
          {MASTER_PRESETS.map((master, index) => (
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
                
                {selectedMaster === index && (
                  <View style={styles.selectedBadge}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color="#FFFFFF" />
                  </View>
                )}
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
    marginBottom: 12,
  },
  previewBorder: {
    borderRadius: 24,
    padding: 3,
  },
  preview: {
    height: 240,
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
  masterInfoOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  masterInfoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  masterInfoName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  masterInfoStyle: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.7)",
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
  paramsPanel: {
    backgroundColor: "rgba(42, 31, 63, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  paramsPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paramsPanelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  paramsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  paramItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: 8,
  },
  paramLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  paramValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EC4899",
  },
  masterScrollContainer: {
    paddingBottom: 12,
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
    position: "relative",
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
  selectedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  intensityContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    paddingVertical: 12,
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
