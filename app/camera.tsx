import { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

// 美颜参数类型
interface BeautyParams {
  smooth: number; // 磨皮
  whiten: number; // 美白
  thinFace: number; // 瘦脸
  bigEye: number; // 大眼
  ruddy: number; // 红润
  sharpen: number; // 锐化
  brightness: number; // 亮度
}

// LUT预设
const LUT_PRESETS = [
  { id: "none", name: "原图", color: "#9CA3AF" },
  { id: "proraw", name: "苹果ProRAW", color: "#3B82F6" },
  { id: "natural", name: "微单自然", color: "#10B981" },
  { id: "fuji", name: "富士胶片", color: "#F59E0B" },
  { id: "ccd", name: "复古CCD", color: "#EC4899" },
];

export default function CameraScreen() {
  const router = useRouter();
  const colors = useColors();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [selectedLUT, setSelectedLUT] = useState("none");
  const [showBeautyPanel, setShowBeautyPanel] = useState(false);

  // 美颜参数
  const [beautyParams, setBeautyParams] = useState<BeautyParams>({
    smooth: 0,
    whiten: 0,
    thinFace: 0,
    bigEye: 0,
    ruddy: 0,
    sharpen: 0,
    brightness: 0,
  });

  // 请求相机权限
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // 切换前后摄像头
  const toggleCameraFacing = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // 切换闪光灯
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

  // 拍照
  const takePicture = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken:", photo?.uri);
        // TODO: 保存照片并应用美颜参数
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  // 更新美颜参数
  const updateBeautyParam = (key: keyof BeautyParams, value: number) => {
    setBeautyParams((prev) => ({ ...prev, [key]: value }));
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">正在请求相机权限...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <MaterialCommunityIcons name="camera-off" size={64} color={colors.muted} />
        <Text className="text-foreground text-lg mt-4 mb-2">需要相机权限</Text>
        <Text className="text-muted text-center mb-6">
          请授予相机权限以使用美颜拍照功能
        </Text>
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-white font-semibold">授予权限</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* 相机取景器 */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
      >
        {/* 顶部控制栏 */}
        <View className="absolute top-0 left-0 right-0 pt-12 px-6 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>

          <View className="flex-row gap-3">
            <Pressable
              onPress={toggleFlash}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons
                name={
                  flash === "off"
                    ? "flash-off"
                    : flash === "on"
                    ? "flash"
                    : "flash-outline"
                }
                size={24}
                color="white"
              />
            </Pressable>

            <Pressable
              onPress={toggleCameraFacing}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        {/* LUT预设选择器 */}
        <View className="absolute top-32 left-0 right-0 px-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {LUT_PRESETS.map((preset) => (
              <Pressable
                key={preset.id}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedLUT(preset.id);
                }}
                style={({ pressed }) => ({
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedLUT === preset.id
                      ? preset.color
                      : "rgba(0,0,0,0.5)",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-white text-sm font-medium">
                  {preset.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* 底部控制栏 */}
        <View className="absolute bottom-0 left-0 right-0 pb-12 px-6">
          {/* 美颜调节面板 */}
          {showBeautyPanel && (
            <View
              className="mb-6 p-4 rounded-3xl"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              <ScrollView
                style={{ maxHeight: 280 }}
                showsVerticalScrollIndicator={false}
              >
                {[
                  { key: "smooth", label: "磨皮", icon: "face-woman" },
                  { key: "whiten", label: "美白", icon: "white-balance-sunny" },
                  { key: "thinFace", label: "瘦脸", icon: "face-woman-outline" },
                  { key: "bigEye", label: "大眼", icon: "eye" },
                  { key: "ruddy", label: "红润", icon: "palette" },
                  { key: "sharpen", label: "锐化", icon: "image-filter-hdr" },
                  { key: "brightness", label: "亮度", icon: "brightness-6" },
                ].map(({ key, label, icon }) => (
                  <View key={key} className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name={icon as any}
                          size={20}
                          color="white"
                        />
                        <Text className="text-white text-sm">{label}</Text>
                      </View>
                      <Text className="text-white text-sm">
                        {beautyParams[key as keyof BeautyParams]}
                      </Text>
                    </View>
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      value={beautyParams[key as keyof BeautyParams]}
                      onValueChange={(value) =>
                        updateBeautyParam(key as keyof BeautyParams, Math.round(value))
                      }
                      minimumTrackTintColor="#E879F9"
                      maximumTrackTintColor="rgba(255,255,255,0.3)"
                      thumbTintColor="#E879F9"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 拍照按钮和美颜切换 */}
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => setShowBeautyPanel(!showBeautyPanel)}
              style={({ pressed }) => ({
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <MaterialCommunityIcons
                name="face-woman"
                size={28}
                color={showBeautyPanel ? "#E879F9" : "white"}
              />
            </Pressable>

            <Pressable
              onPress={takePicture}
              style={({ pressed }) => ({
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 4,
                borderColor: "#E879F9",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "#E879F9",
                }}
              />
            </Pressable>

            <View style={{ width: 56 }} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}
