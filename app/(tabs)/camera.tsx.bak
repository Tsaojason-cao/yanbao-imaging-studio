import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { KuromiShutterButton } from "@/components/kuromi-ui";
import { SpotDiscoveryDrawer } from "@/components/spot-discovery-drawer";
import type { ShootingSpot } from "@/lib/shooting-spots-service";
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
  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [timer, setTimer] = useState<0 | 3 | 10>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
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
  const [showBeautyPanel, setShowBeautyPanel] = useState(false); // 美颜面板显示状态
  const [showSpotDrawer, setShowSpotDrawer] = useState(false); // 机位推荐抽屉显示状态

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

  // 定时拍照倒计时逻辑
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      // 倒计时结束，自动拍照
      takePicture();
      setCountdown(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

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
    setFlash((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    // 显示闪白动画
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: true,
      });
      
      if (photo && mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        
        // 保存缩略图
        setLastPhoto(photo.uri);
        
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        alert("照片已保存到相册");
      }
    } catch (error) {
      console.error("Failed to take picture:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert("拍照失败", "请稍后重试");
    }
  };

  const handleShutterPress = () => {
    if (countdown !== null) {
      // 取消倒计时
      setCountdown(null);
      return;
    }

    if (timer > 0) {
      // 开始倒计时
      setCountdown(timer);
    } else {
      // 立即拍照
      takePicture();
    }
  };

  const cycleTimer = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimer((current) => {
      if (current === 0) return 3;
      if (current === 3) return 10;
      return 0;
    });
  };

  // 旧版拍照函数（已废弃）
  /*
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
  */

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode="picture"
        videoQuality="1080p"
        responsiveOrientationWhenOrientationLocked={true}
      >
        {/* 顶部控制栏 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
            <Ionicons
              name={flash === "off" ? "flash-off" : flash === "on" ? "flash" : "flash-outline"}
              size={28}
              color="#FFFFFF"
            />
            {flash === "auto" && (
              <Text style={{ fontSize: 10, color: "#FFFFFF", marginTop: 2 }}>自动</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.timerContainer} onPress={cycleTimer}>
            <Ionicons name="timer-outline" size={24} color="#FFFFFF" />
            <Text style={styles.timerText}>{timer === 0 ? "关" : `${timer}s`}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.topButton} 
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setShowSpotDrawer(true);
            }}
          >
            <Ionicons name="location" size={28} color="#FFFFFF" />
            <Text style={{ fontSize: 10, color: "#FFFFFF", marginTop: 2 }}>机位</Text>
          </TouchableOpacity>

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
        {showBeautyPanel && (
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
                      {/* 可拖动滑块 */}
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: `${param.value}%` },
                        ]}
                        onStartShouldSetResponder={() => true}
                        onResponderMove={(e) => {
                          const locationX = e.nativeEvent.locationX;
                          const trackWidth = 200; // 滑块轨道宽度
                          const newValue = Math.max(0, Math.min(100, Math.round((locationX / trackWidth) * 100)));
                          
                          // 每隔5个单位触发一次细腻震动
                          if (Math.abs(newValue - param.value) >= 5) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }
                          
                          setBeautyParams(prev => ({
                            ...prev,
                            [param.key]: newValue,
                          }));
                        }}
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
            <KuromiShutterButton onPress={handleShutterPress} size={80} />

            {/* 美颜按钮 - 库洛米图标 */}
            <TouchableOpacity
              style={styles.beautyButton}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setShowBeautyPanel(!showBeautyPanel);
              }}
            >
              <View style={styles.beautyButtonKuromi}>
                <View style={styles.kuromiMiniHead}>
                  <View style={[styles.kuromiMiniEar, { left: 2 }]} />
                  <View style={[styles.kuromiMiniEar, { right: 2 }]} />
                  <View style={styles.kuromiMiniFace}>
                    <View style={styles.kuromiMiniEyes}>
                      <View style={styles.kuromiMiniEye} />
                      <View style={styles.kuromiMiniEye} />
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.beautyButtonBadge}>8</Text>
            </TouchableOpacity>

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
        )}

        {/* 倒计时显示 */}
        {countdown !== null && countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {/* 闪白动画 */}
        {flashAnimation && (
          <View style={styles.flashOverlay} />
        )}

        {/* 缩略图预览 */}
        {lastPhoto && (
          <TouchableOpacity
            style={styles.thumbnailContainer}
            onPress={() => {
              // TODO: 打开相册详情
              console.log("打开照片:", lastPhoto);
            }}
          >
            <Image
              source={{ uri: lastPhoto }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        )}
      </CameraView>

      {/* 机位推荐抽屉 */}
      <SpotDiscoveryDrawer
        visible={showSpotDrawer}
        onClose={() => setShowSpotDrawer(false)}
        onSelectSpot={(spot: ShootingSpot) => {
          console.log("选择机位:", spot.name);
          // TODO: 可以在这里显示机位详情或其他操作
        }}
      />
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
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#EC4899",
    marginLeft: -10, // 居中对齐
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  beautyButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  beautyButtonKuromi: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(236, 72, 153, 0.3)",
    borderWidth: 2,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiMiniHead: {
    width: 28,
    height: 28,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiMiniEar: {
    position: "absolute",
    top: -1,
    width: 6,
    height: 10,
    backgroundColor: "#2D3748",
    borderRadius: 3,
  },
  kuromiMiniFace: {
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  kuromiMiniEyes: {
    flexDirection: "row",
    gap: 4,
    marginTop: 2,
  },
  kuromiMiniEye: {
    width: 3,
    height: 5,
    backgroundColor: "#1F2937",
    borderRadius: 1.5,
  },
  beautyButtonBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EC4899",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(236, 72, 153, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  flashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
  },
  thumbnailContainer: {
    position: "absolute",
    bottom: 120,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});
