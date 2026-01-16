import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { masterMatrixEngine, DEFAULT_BEAUTY_PARAMS, type BeautyParams } from "@/lib/master-matrix-engine";
import { MASTER_PRESETS } from "@/constants/master-presets";

/**
 * Camera Screen - Soul Version
 * 
 * 核心功能：
 * - 完整的12维美颜引擎
 * - 31位大师预设快速切换
 * - 实时参数同步与存储
 * - 库洛米专属UI
 */
export default function CameraSoulScreen() {
  const router = useRouter();
  
  // 12维美颜参数状态
  const [beautyParams, setBeautyParams] = useState<BeautyParams>(DEFAULT_BEAUTY_PARAMS);
  
  // 相机控制状态
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [timer, setTimer] = useState<"off" | "3s" | "10s">("off");
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("back");
  
  // 大师预设选择
  const [selectedMaster, setSelectedMaster] = useState(30); // 默认选择 Yanbao AI

  // 12维美颜配置
  const beautyControls = [
    { key: "eyes", label: "Eyes", subLabel: "大眼", icon: "👁️", color: "#E879F9" },
    { key: "face", label: "Face", subLabel: "瘦脸", icon: "😊", color: "#F472B6" },
    { key: "narrow", label: "Narrow", subLabel: "窄脸", icon: "🎭", color: "#A78BFA" },
    { key: "chin", label: "Chin", subLabel: "下巴", icon: "🎨", color: "#60A5FA" },
    { key: "forehead", label: "Forehead", subLabel: "额头", icon: "✨", color: "#34D399" },
    { key: "philtrum", label: "Philtrum", subLabel: "人中", icon: "💫", color: "#FDE047" },
    { key: "nose", label: "Nose", subLabel: "瘦鼻", icon: "👃", color: "#FB923C" },
    { key: "noseLength", label: "Nose L", subLabel: "鼻长", icon: "📏", color: "#F87171" },
    { key: "mouth", label: "Mouth", subLabel: "嘴型", icon: "👄", color: "#EC4899" },
    { key: "eyeCorner", label: "Corner", subLabel: "眼角", icon: "👀", color: "#A78BFA" },
    { key: "eyeDistance", label: "Distance", subLabel: "眼距", icon: "↔️", color: "#60A5FA" },
    { key: "skinBrightness", label: "Bright", subLabel: "亮度", icon: "💡", color: "#FDE047" },
  ];

  const handleSliderChange = (key: keyof BeautyParams, value: number) => {
    // 震动反馈
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBeautyParams(prev => ({ ...prev, [key]: value }));
  };

  const handleMasterSelect = (index: number) => {
    setSelectedMaster(index);
    const preset = MASTER_PRESETS[index];
    
    // 应用大师参数到相机
    masterMatrixEngine.applyMasterToCamera(preset.id);
    
    // 震动反馈
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShutter = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // 保存照片元数据
    const photoId = `photo_${Date.now()}`;
    const currentPreset = MASTER_PRESETS[selectedMaster];
    
    await masterMatrixEngine.savePhotoMetadata(photoId, {
      id: photoId,
      timestamp: Date.now(),
      masterPreset: {
        id: currentPreset.id,
        name: currentPreset.name,
        params: currentPreset.params,
      },
      beautyParams,
      intensity: 75,
    });
    
    console.log('Photo saved with metadata:', photoId);
  };

  const toggleTimer = () => {
    const timers: Array<"off" | "3s" | "10s"> = ["off", "3s", "10s"];
    const currentIndex = timers.indexOf(timer);
    setTimer(timers[(currentIndex + 1) % timers.length]);
  };

  const currentMaster = MASTER_PRESETS[selectedMaster];

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="bg-black">
      {/* 顶部控制栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <IconSymbol 
            name={flashEnabled ? "bolt.fill" : "bolt.slash.fill"} 
            size={24} 
            color={flashEnabled ? "#FDE047" : "#FFFFFF"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timerButton}
          onPress={toggleTimer}
        >
          <IconSymbol name="timer" size={20} color="#FFFFFF" />
          <Text style={styles.timerText}>
            {timer === "off" ? "OFF" : timer}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setCameraFacing(cameraFacing === "front" ? "back" : "front")}
        >
          <IconSymbol name="arrow.triangle.2.circlepath.camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 标题 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ProCam Beauty</Text>
        <Text style={styles.subtitle}>12维骨相级调优</Text>
      </View>

      {/* 取景框区域 */}
      <View style={styles.viewfinderContainer}>
        <LinearGradient
          colors={["#8B5CF6", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.viewfinderBorder}
        >
          <View style={styles.viewfinder}>
            <Text style={styles.placeholderText}>📷 Camera Preview</Text>
            <Text style={styles.cameraInfo}>
              EV: +0.5 | ISO: 400 | WB: Auto
            </Text>
            
            {/* 当前大师信息 */}
            <View style={styles.masterBadge}>
              <Text style={styles.masterBadgeIcon}>{currentMaster.icon}</Text>
              <Text style={styles.masterBadgeName}>{currentMaster.name}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 大师预设快速切换 */}
      <View style={styles.masterQuickSelect}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MASTER_PRESETS.slice(0, 10).map((master, index) => (
            <TouchableOpacity
              key={master.id}
              style={[
                styles.masterQuickButton,
                selectedMaster === index && styles.masterQuickButtonActive,
              ]}
              onPress={() => handleMasterSelect(index)}
            >
              <Text style={styles.masterQuickIcon}>{master.icon}</Text>
              <Text style={styles.masterQuickName}>{master.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 12维美颜参数面板 */}
      <View style={styles.beautyPanel}>
        <View style={styles.beautyPanelHeader}>
          <Text style={styles.beautyPanelTitle}>12维美颜引擎</Text>
          <TouchableOpacity onPress={() => setBeautyParams(DEFAULT_BEAUTY_PARAMS)}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.beautyScroll}
          showsVerticalScrollIndicator={false}
        >
          {beautyControls.map((control) => (
            <View key={control.key} style={styles.beautyControl}>
              <View style={styles.beautyLabelContainer}>
                <Text style={styles.beautyIcon}>{control.icon}</Text>
                <View style={styles.beautyLabelText}>
                  <Text style={styles.beautyLabel}>{control.label}</Text>
                  <Text style={styles.beautySubLabel}>{control.subLabel}</Text>
                </View>
                <Text style={styles.beautyValue}>
                  {beautyParams[control.key as keyof BeautyParams]}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams[control.key as keyof BeautyParams]}
                onValueChange={(value) => handleSliderChange(control.key as keyof BeautyParams, Math.round(value))}
                minimumTrackTintColor={control.color}
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor={control.color}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 底部操作区 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.galleryButton}
          onPress={() => router.push("/(tabs)/builds" as any)}
        >
          <View style={styles.galleryThumbnail}>
            <IconSymbol name="photo.fill" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* 库洛米快门按钮 */}
        <TouchableOpacity 
          style={styles.shutterButton}
          onPress={handleShutter}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#EC4899", "#F472B6"]}
            style={styles.shutterGradient}
          >
            <Text style={styles.kuromiIcon}>🐰</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push("/(tabs)/settings" as any)}
        >
          <IconSymbol name="gear" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  timerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: "#EC4899",
    marginTop: 2,
  },
  viewfinderContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewfinderBorder: {
    flex: 1,
    borderRadius: 24,
    padding: 3,
  },
  viewfinder: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 8,
  },
  cameraInfo: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "monospace",
  },
  masterBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  masterBadgeIcon: {
    fontSize: 20,
  },
  masterBadgeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  masterQuickSelect: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  masterQuickButton: {
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  masterQuickButtonActive: {
    backgroundColor: "rgba(236, 72, 153, 0.3)",
  },
  masterQuickIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  masterQuickName: {
    fontSize: 10,
    color: "#FFFFFF",
  },
  beautyPanel: {
    height: 280,
    backgroundColor: "rgba(42, 31, 63, 0.95)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  beautyPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  beautyPanelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resetButton: {
    fontSize: 14,
    color: "#EC4899",
    fontWeight: "600",
  },
  beautyScroll: {
    flex: 1,
  },
  beautyControl: {
    marginBottom: 16,
  },
  beautyLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  beautyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  beautyLabelText: {
    flex: 1,
  },
  beautyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  beautySubLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
  beautyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EC4899",
    minWidth: 30,
    textAlign: "right",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  galleryButton: {
    width: 60,
    height: 60,
  },
  galleryThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterButton: {
    width: 80,
    height: 80,
  },
  shutterGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  kuromiIcon: {
    fontSize: 36,
  },
  settingsButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
