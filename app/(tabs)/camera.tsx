import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { KuromiShutterButton } from "@/components/kuromi-ui";
import { ProModePanel, ProModeParams } from "@/components/pro-mode-panel";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [flash, setFlash] = useState(false);
  const [timer, setTimer] = useState(3);
  const [showLUT, setShowLUT] = useState(false);
  const [selectedLUT, setSelectedLUT] = useState("原图");
  const [showProMode, setShowProMode] = useState(false);
  const [proModeParams, setProModeParams] = useState<ProModeParams>({
    iso: 400,
    shutterSpeed: 1 / 125,
    whiteBalance: 5500,
    peakingFocus: false,
  });
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  // 7维美颜参数
  const [beautyParams, setBeautyParams] = useState({
    skin: 45,      // 肤质
    light: 38,     // 光影
    bone: 25,      // 骨相
    color: 50,     // 色彩
    whitening: 42, // 美白
    eye: 30,       // 大眼
    face: 28,      // 瘦脸
  });

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // LUT预设列表
  const lutPresets = [
    { name: "原图", color: "#FFFFFF" },
    { name: "清新", color: "#A7F3D0" },
    { name: "复古", color: "#FDE68A" },
    { name: "冷色", color: "#BFDBFE" },
    { name: "暖色", color: "#FED7AA" },
    { name: "黑白", color: "#E5E7EB" },
  ];

  if (!permission || !mediaPermission) {
    return <View style={styles.container}><Text>正在加载...</Text></View>;
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="camera-off" size={64} color="#9CA3AF" />
          <Text style={styles.permissionText}>需要相机和相册权限</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => {
              requestPermission();
              requestMediaPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>授予权限</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const toggleCameraFacing = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFlash(!flash);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        alert("照片已保存到相册");
      }
    } catch (error) {
      console.error("Failed to take picture:", error);
      alert("拍照失败，请重试");
    }
  };

  const takePictureOld = async () => {
    if (!cameraRef.current) return;

    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }

      buttonScale.value = withSpring(0.9, {}, () => {
        buttonScale.value = withSpring(1);
      });

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photo && photo.uri) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        Alert.alert("成功", "照片已保存到相册");
      }
    } catch (error) {
      console.error("拍照失败:", error);
      Alert.alert("错误", "拍照失败，请重试");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? "on" : "off"}
        mode="picture"
        videoQuality="1080p"
        responsiveOrientationWhenOrientationLocked={true}
      >
        {/* 顶部控制栏 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
            <Ionicons
              name={flash ? "flash" : "flash-off"}
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Ionicons name="timer-outline" size={24} color="#FFFFFF" />
            <Text style={styles.timerText}>{timer}s</Text>
          </View>

          <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 右侧装饰 */}
        <View style={styles.rightSide}>
          {/* 库洛米头像 */}
          <View style={styles.kuromiAvatar}>
            <View style={styles.kuromiHead}>
              <View style={[styles.kuromiEar, styles.kuromiEarLeft]} />
              <View style={[styles.kuromiEar, styles.kuromiEarRight]} />
              <View style={styles.kuromiFace}>
                <View style={styles.kuromiEyes}>
                  <View style={styles.kuromiEye} />
                  <View style={styles.kuromiEye} />
                </View>
                <View style={styles.kuromiNose} />
              </View>
              <View style={styles.kuromiBow}>
                <View style={styles.bowSkull} />
              </View>
            </View>
          </View>

          {/* HD标签 */}
          <View style={styles.hdBadge}>
            <Text style={styles.hdText}>HD</Text>
          </View>

          {/* LUT预设按钮 */}
          <TouchableOpacity
            style={styles.lutButton}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setShowLUT(!showLUT);
            }}
          >
            <MaterialCommunityIcons name="palette" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* LUT预设选择器 */}
        {showLUT && (
          <View style={styles.lutPanel}>
            <BlurView intensity={40} style={styles.lutBlur}>
              <LinearGradient
                colors={["rgba(168, 85, 247, 0.3)" as const, "rgba(236, 72, 153, 0.3)" as const]}
                style={styles.lutGradient}
              >
                <Text style={styles.lutTitle}>LUT预设</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.lutList}>
                    {lutPresets.map((lut, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.lutItem,
                          selectedLUT === lut.name && styles.lutItemActive,
                        ]}
                        onPress={() => {
                          if (Platform.OS !== "web") {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                          setSelectedLUT(lut.name);
                        }}
                      >
                        <View style={[styles.lutPreview, { backgroundColor: lut.color }]} />
                        <Text style={styles.lutName}>{lut.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </LinearGradient>
            </BlurView>
          </View>
        )}

        {/* 底部美颜参数面板 */}
        <View style={styles.bottomPanel}>
          <BlurView intensity={40} style={styles.beautyPanel}>
            <LinearGradient
              colors={["rgba(168, 85, 247, 0.3)" as const, "rgba(236, 72, 153, 0.3)" as const]}
              style={styles.beautyPanelGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* 7维美颜滑块 */}
              <View style={styles.beautySliders}>
                {[
                  { key: "skin", label: "肤质", value: beautyParams.skin },
                  { key: "light", label: "光影", value: beautyParams.light },
                  { key: "bone", label: "骨相", value: beautyParams.bone },
                  { key: "color", label: "色彩", value: beautyParams.color },
                  { key: "whitening", label: "美白", value: beautyParams.whitening },
                  { key: "eye", label: "大眼", value: beautyParams.eye },
                  { key: "face", label: "瘦脸", value: beautyParams.face },
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
                    </View>
                    <Text style={styles.sliderValue}>{param.value}</Text>
                  </View>
                ))}
              </View>

              {/* 右下角库洛米装饰 */}
              <View style={styles.panelKuromi}>
                <View style={styles.kuromiHead}>
                  <View style={[styles.kuromiEar, styles.kuromiEarLeft]} />
                  <View style={[styles.kuromiEar, styles.kuromiEarRight]} />
                  <View style={styles.kuromiFace}>
                    <View style={styles.kuromiEyes}>
                      <View style={styles.kuromiEye} />
                      <View style={styles.kuromiEye} />
                    </View>
                  </View>
                  <View style={styles.kuromiBow}>
                    <View style={styles.bowSkull} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </BlurView>

          {/* 底部控制区 */}
          <View style={styles.controls}>
            {/* 相册预览 */}
            <TouchableOpacity
              style={styles.galleryPreview}
              onPress={() => router.push("/(tabs)/gallery")}
            >
              <View style={styles.previewImage}>
                <Ionicons name="images" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.previewKuromi}>
                <View style={styles.kuromiTiny} />
              </View>
            </TouchableOpacity>

            {/* 拍照按钮 - 库洛米快门 */}
            <KuromiShutterButton onPress={takePicture} size={80} />

            {/* 专业模式按钮 */}
            <TouchableOpacity
              style={styles.proModeButton}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowProMode(!showProMode);
              }}
            >
              <Ionicons
                name={showProMode ? "settings" : "settings-outline"}
                size={28}
                color="#FFFFFF"
              />
              <Text style={styles.proModeText}>PRO</Text>
            </TouchableOpacity>
          </View>

          {/* 专业模式控制面板 */}
          <ProModePanel
            visible={showProMode}
            params={proModeParams}
            onParamsChange={setProModeParams}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  rightSide: {
    position: "absolute",
    top: 120,
    right: 20,
    alignItems: "center",
    gap: 16,
  },
  kuromiAvatar: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  hdBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hdText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  lutButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  lutPanel: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 100,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  lutBlur: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  lutGradient: {
    padding: 16,
  },
  lutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  lutList: {
    flexDirection: "row",
    gap: 12,
  },
  lutItem: {
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  lutItemActive: {
    backgroundColor: "rgba(236, 72, 153, 0.3)",
    borderWidth: 2,
    borderColor: "#EC4899",
  },
  lutPreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  lutName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  beautyPanel: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },
  beautyPanelGradient: {
    padding: 20,
    position: "relative",
  },
  beautySliders: {
    gap: 12,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    width: 50,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(75, 85, 99, 0.8)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#EC4899",
    borderRadius: 4,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    width: 36,
    textAlign: "right",
  },
  panelKuromi: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  galleryPreview: {
    width: 70,
    height: 70,
    position: "relative",
  },
  previewImage: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(75, 85, 99, 0.8)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  previewKuromi: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: "#EC4899",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  kuromiTiny: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EC4899",
  },
  placeholder: {
    width: 70,
  },
  kuromiHead: {
    width: 40,
    height: 40,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEar: {
    position: "absolute",
    top: -2,
    width: 10,
    height: 14,
    backgroundColor: "#2D3748",
    borderRadius: 5,
  },
  kuromiEarLeft: {
    left: 6,
  },
  kuromiEarRight: {
    right: 6,
  },
  kuromiFace: {
    width: 30,
    height: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiEyes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  kuromiEye: {
    width: 6,
    height: 8,
    backgroundColor: "#1F2937",
    borderRadius: 3,
  },
  kuromiNose: {
    width: 4,
    height: 3,
    backgroundColor: "#F472B6",
    borderRadius: 2,
    marginTop: 2,
  },
  kuromiBow: {
    position: "absolute",
    top: -4,
    right: -2,
    width: 16,
    height: 8,
    backgroundColor: "#F472B6",
    borderRadius: 4,
  },
  bowSkull: {
    position: "absolute",
    top: 1,
    left: 5,
    width: 6,
    height: 6,
    backgroundColor: "#1F2937",
    borderRadius: 3,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  permissionButton: {
    backgroundColor: "#9333EA",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  proModeButton: {
    width: 70,
    alignItems: "center",
    gap: 4,
  },
  proModeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(167, 139, 250, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
