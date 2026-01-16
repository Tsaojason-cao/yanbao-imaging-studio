import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";

/**
 * Camera Screen - ProCam Beauty
 * 
 * 核心功能：12维美颜引擎（骨相级调优）
 * 
 * 面部 6 维：
 * 1. 大眼 (Eyes)
 * 2. 瘦脸 (Face)
 * 3. 窄脸 (Narrow)
 * 4. 下巴 (Chin)
 * 5. 额头 (Forehead)
 * 6. 人中 (Philtrum)
 * 
 * 五官 6 维：
 * 7. 瘦鼻 (Nose)
 * 8. 鼻长 (Nose Length)
 * 9. 嘴型 (Mouth)
 * 10. 眼角 (Eye Corner)
 * 11. 眼距 (Eye Distance)
 * 12. 肤色亮度 (Skin Brightness)
 */
export default function CameraScreen() {
  const router = useRouter();
  
  // 12维美颜参数状态
  const [beautyParams, setBeautyParams] = useState({
    eyes: 50,           // 大眼
    face: 50,           // 瘦脸
    narrow: 50,         // 窄脸
    chin: 50,           // 下巴
    forehead: 50,       // 额头
    philtrum: 50,       // 人中
    nose: 50,           // 瘦鼻
    noseLength: 50,     // 鼻长
    mouth: 50,          // 嘴型
    eyeCorner: 50,      // 眼角
    eyeDistance: 50,    // 眼距
    skinBrightness: 50, // 肤色亮度
  });

  // 相机控制状态
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [timer, setTimer] = useState<"off" | "3s" | "10s">("off");
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("back");

  // 12维美颜配置
  const beautyControls = [
    { key: "eyes", label: "Eyes", icon: "👁️", color: "#E879F9" },
    { key: "face", label: "Face", icon: "😊", color: "#F472B6" },
    { key: "narrow", label: "Narrow", icon: "🎭", color: "#A78BFA" },
    { key: "chin", label: "Chin", icon: "🎨", color: "#60A5FA" },
    { key: "forehead", label: "Forehead", icon: "✨", color: "#34D399" },
    { key: "philtrum", label: "Philtrum", icon: "💫", color: "#FDE047" },
    { key: "nose", label: "Nose", icon: "👃", color: "#FB923C" },
    { key: "noseLength", label: "Nose L", icon: "📏", color: "#F87171" },
    { key: "mouth", label: "Mouth", icon: "👄", color: "#EC4899" },
    { key: "eyeCorner", label: "Corner", icon: "👀", color: "#A78BFA" },
    { key: "eyeDistance", label: "Distance", icon: "↔️", color: "#60A5FA" },
    { key: "skinBrightness", label: "Bright", icon: "💡", color: "#FDE047" },
  ];

  const handleSliderChange = (key: string, value: number) => {
    // 震动反馈
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBeautyParams(prev => ({ ...prev, [key]: value }));
  };

  const handleShutter = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // 拍照逻辑
  };

  const toggleTimer = () => {
    const timers: Array<"off" | "3s" | "10s"> = ["off", "3s", "10s"];
    const currentIndex = timers.indexOf(timer);
    setTimer(timers[(currentIndex + 1) % timers.length]);
  };

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
          </View>
        </LinearGradient>
      </View>

      {/* 12维美颜参数面板 */}
      <View style={styles.beautyPanel}>
        <ScrollView 
          style={styles.beautyScroll}
          showsVerticalScrollIndicator={false}
        >
          {beautyControls.map((control) => (
            <View key={control.key} style={styles.beautyControl}>
              <View style={styles.beautyLabelContainer}>
                <Text style={styles.beautyIcon}>{control.icon}</Text>
                <Text style={styles.beautyLabel}>{control.label}</Text>
                <Text style={styles.beautyValue}>
                  {beautyParams[control.key as keyof typeof beautyParams]}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={beautyParams[control.key as keyof typeof beautyParams]}
                onValueChange={(value) => handleSliderChange(control.key, Math.round(value))}
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
        <TouchableOpacity style={styles.galleryButton}>
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
          onPress={() => router.push("/settings" as any)}
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
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
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
  beautyPanel: {
    height: 280,
    backgroundColor: "rgba(42, 31, 63, 0.95)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
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
  beautyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
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
