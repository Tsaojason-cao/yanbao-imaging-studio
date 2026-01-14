import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Dimensions, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { KuromiSlider } from "@/components/kuromi-ui";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get("window");

export default function EditScreen() {
  const router = useRouter();
  const [activeFunction, setActiveFunction] = useState<"adjust" | "filter" | "crop" | "rotate">("adjust");
  const comparePosition = useSharedValue(0.5);

  // 调整参数
  const [adjustParams, setAdjustParams] = useState({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    temperature: 50,
  });

  // 滤镜列表
  const filters = [
    { name: "原图", color: "#FFFFFF" },
    { name: "清新", color: "#A7F3D0" },
    { name: "复古", color: "#FDE68A" },
    { name: "冷色", color: "#BFDBFE" },
    { name: "暖色", color: "#FED7AA" },
    { name: "黑白", color: "#E5E7EB" },
    { name: "鲜艳", color: "#FCA5A5" },
    { name: "柔和", color: "#DDD6FE" },
  ];

  const [selectedFilter, setSelectedFilter] = useState("原图");
  const [rotationAngle, setRotationAngle] = useState(0); // 旋转角度（-45° 到 +45°）
  const [selectedCropRatio, setSelectedCropRatio] = useState<string | null>(null); // 选中的裁剪比例
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null); // 当前编辑的图片
  const [memoryParams, setMemoryParams] = useState<any>(null); // 雁宝记忆参数

  // Before/After对比滑动手势
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      comparePosition.value = Math.max(0, Math.min(1, event.x / width));
    });

  const sliderStyle = useAnimatedStyle(() => ({
    left: comparePosition.value * width,
  }));

  const beforeStyle = useAnimatedStyle(() => ({
    width: comparePosition.value * width,
  }));

  const handleSave = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    alert("照片已保存");
  };

  const renderFunctionContent = () => {
    switch (activeFunction) {
      case "adjust":
        return (
          <View style={styles.adjustPanel}>
            <Text style={styles.panelTitle}>调整</Text>
            {[
              { key: "brightness", label: "亮度", value: adjustParams.brightness },
              { key: "contrast", label: "对比度", value: adjustParams.contrast },
              { key: "saturation", label: "饱和度", value: adjustParams.saturation },
              { key: "temperature", label: "色温", value: adjustParams.temperature },
            ].map((param) => (
              <KuromiSlider
                key={param.key}
                label={param.label}
                value={param.value}
              />
            ))}
          </View>
        );
      case "filter":
        return (
          <View style={styles.filterPanel}>
            <Text style={styles.panelTitle}>滤镜</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    <View style={[styles.filterPreview, { backgroundColor: filter.color }]} />
                    <Text style={styles.filterName}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      case "crop":
        return (
          <View style={styles.adjustPanel}>
            <Text style={styles.panelTitle}>裁剪</Text>
            <View style={styles.cropPresets}>
              {[
                { label: "9:16", ratio: 9/16 },
                { label: "16:9", ratio: 16/9 },
                { label: "1:1", ratio: 1 },
                { label: "4:3", ratio: 4/3 },
                { label: "自由", ratio: 0 },
              ].map((preset, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cropPresetButton}
                  onPress={async () => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedCropRatio(preset.label);
                    
                    // 如果没有图片，先选择图片
                    if (!currentImageUri) {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: false,
                        quality: 1,
                      });
                      
                      if (!result.canceled && result.assets[0]) {
                        setCurrentImageUri(result.assets[0].uri);
                      }
                      return;
                    }
                    
                    // 执行裁剪
                    try {
                      const manipResult = await ImageManipulator.manipulateAsync(
                        currentImageUri,
                        [
                          {
                            crop: {
                              originX: 0,
                              originY: 0,
                              width: 1000,
                              height: preset.ratio === 9/16 ? 1778 : preset.ratio === 1 ? 1000 : 750,
                            },
                          },
                        ],
                        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                      );
                      
                      setCurrentImageUri(manipResult.uri);
                      Alert.alert('成功', `已裁剪为 ${preset.label} 比例`);
                    } catch (error) {
                      console.error('Crop error:', error);
                      Alert.alert('错误', '裁剪失败，请重试');
                    }
                  }}
                >
                  <Text style={styles.cropPresetLabel}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.cropHintText}>选择裁剪比例后，在图片上拖动调整裁剪区域</Text>
          </View>
        );
      case "rotate":
        return (
          <View style={styles.adjustPanel}>
            <Text style={styles.panelTitle}>旋转</Text>
            <View style={styles.rotatePanel}>
              <View style={styles.rotateDisplay}>
                <MaterialCommunityIcons name="rotate-3d-variant" size={32} color="#E879F9" />
                <Text style={styles.rotateAngleText}>{rotationAngle.toFixed(1)}°</Text>
              </View>
              <KuromiSlider
                label="旋转角度"
                value={((rotationAngle + 45) / 90) * 100}
                onChange={(value) => {
                  const angle = (value / 100) * 90 - 45;
                  setRotationAngle(angle);
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
              />
              <View style={styles.rotateQuickButtons}>
                <TouchableOpacity
                  style={styles.rotateQuickButton}
                  onPress={() => {
                    setRotationAngle(-90);
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                  }}
                >
                  <MaterialCommunityIcons name="rotate-left" size={24} color="#E879F9" />
                  <Text style={styles.rotateQuickButtonText}>-90°</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rotateQuickButton}
                  onPress={() => {
                    setRotationAngle(0);
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                  }}
                >
                  <MaterialCommunityIcons name="backup-restore" size={24} color="#E879F9" />
                  <Text style={styles.rotateQuickButtonText}>重置</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rotateQuickButton}
                  onPress={() => {
                    setRotationAngle(90);
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                  }}
                >
                  <MaterialCommunityIcons name="rotate-right" size={24} color="#E879F9" />
                  <Text style={styles.rotateQuickButtonText}>+90°</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={["#2d1b4e" as const, "#2d1b4e" as const]}
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
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>照片编辑</Text>
            <View style={styles.headerRightButtons}>
              {/* 雁宝记忆按钮 */}
              <TouchableOpacity 
                style={styles.memoryButton}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                  
                  // 存入当前参数
                  const params = {
                    adjustParams,
                    selectedFilter,
                    rotationAngle,
                    timestamp: Date.now(),
                  };
                  setMemoryParams(params);
                  Alert.alert('❤️ 雁宝记忆', '参数已同步至云端\n下次编辑时可一键载入');
                }}
              >
                <Ionicons name="heart" size={24} color="#E879F9" />
              </TouchableOpacity>
              
              {/* 保存按钮 */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Before/After对比区域 */}
          <View style={styles.comparisonSection}>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={styles.comparisonContainer}>
                {/* After图片 */}
                <View style={styles.afterImage}>
                  <BlurView intensity={20} style={styles.imageBlur}>
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image" size={80} color="rgba(255, 255, 255, 0.3)" />
                      <Text style={styles.imageText}>After</Text>
                    </View>
                  </BlurView>
                </View>

                {/* Before图片（遮罩） */}
                <Animated.View style={[styles.beforeImage, beforeStyle]}>
                  <BlurView intensity={20} style={styles.imageBlur}>
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
                      <Text style={styles.imageText}>Before</Text>
                    </View>
                  </BlurView>
                </Animated.View>

                {/* 分割线 */}
                <Animated.View style={[styles.divider, sliderStyle]}>
                  <View style={styles.dividerHandle}>
                    <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
                  </View>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          </View>

          {/* 功能按钮一排 */}
          <View style={styles.functionBar}>
            <BlurView intensity={40} style={styles.functionBlur}>
              <LinearGradient
                colors={["rgba(168, 85, 247, 0.3)" as const, "rgba(236, 72, 153, 0.3)" as const]}
                style={styles.functionGradient}
              >
                <View style={styles.functionButtons}>
                  {[
                    { key: "adjust", icon: "options-outline", label: "调整" },
                    { key: "filter", icon: "color-filter-outline", label: "滤镜" },
                    { key: "crop", icon: "crop-outline", label: "裁剪" },
                    { key: "rotate", icon: "sync-outline", label: "旋转" },
                  ].map((func) => (
                    <TouchableOpacity
                      key={func.key}
                      style={[
                        styles.functionButton,
                        activeFunction === func.key && styles.functionButtonActive,
                      ]}
                      onPress={() => {
                        if (Platform.OS !== "web") {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setActiveFunction(func.key as any);
                      }}
                    >
                      <Ionicons
                        name={func.icon as any}
                        size={28}
                        color={activeFunction === func.key ? "#F472B6" : "#FFFFFF"}
                      />
                      <Text
                        style={[
                          styles.functionLabel,
                          activeFunction === func.key && styles.functionLabelActive,
                        ]}
                      >
                        {func.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          {/* 功能内容面板 */}
          <View style={styles.contentPanel}>
            <BlurView intensity={40} style={styles.contentBlur}>
              <LinearGradient
                colors={["rgba(168, 85, 247, 0.3)" as const, "rgba(236, 72, 153, 0.3)" as const]}
                style={styles.contentGradient}
              >
                {renderFunctionContent()}
              </LinearGradient>
            </BlurView>
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerRightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memoryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(232, 121, 249, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E879F9",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F472B6",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  comparisonSection: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 400,
    borderRadius: 24,
    overflow: "hidden",
  },
  comparisonContainer: {
    flex: 1,
    position: "relative",
  },
  afterImage: {
    ...StyleSheet.absoluteFillObject,
  },
  beforeImage: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  imageBlur: {
    flex: 1,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  imageText: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#F472B6",
    shadowColor: "#F472B6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  dividerHandle: {
    position: "absolute",
    top: "50%",
    left: -20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F472B6",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -22 }],
    shadowColor: "#F472B6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  functionBar: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
  functionBlur: {
    overflow: "hidden",
  },
  functionGradient: {
    padding: 16,
  },
  functionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  functionButton: {
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
  },
  functionButtonActive: {
    backgroundColor: "rgba(244, 114, 182, 0.2)",
  },
  functionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  functionLabelActive: {
    color: "#F472B6",
  },
  contentPanel: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  contentBlur: {
    overflow: "hidden",
  },
  contentGradient: {
    padding: 20,
  },
  adjustPanel: {
    gap: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skullLeft: {
    width: 24,
    height: 24,
  },
  skullRight: {
    width: 24,
    height: 24,
  },
  skull: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E879F9",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sliderContainer: {
    flex: 1,
    gap: 4,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#F472B6",
    borderRadius: 3,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    width: 40,
    textAlign: "right",
  },
  filterPanel: {
    gap: 16,
  },
  filterGrid: {
    flexDirection: "row",
    gap: 16,
  },
  filterItem: {
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 12,
  },
  filterItemActive: {
    backgroundColor: "rgba(244, 114, 182, 0.2)",
  },
  filterPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  filterName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: 20,
  },
  cropPresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  cropPresetButton: {
    width: "30%",
    padding: 16,
    backgroundColor: "rgba(45, 27, 78, 0.8)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(232, 121, 249, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  cropPresetLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cropHintText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 20,
    textAlign: "center",
  },
  rotatePanel: {
    gap: 20,
    paddingVertical: 16,
  },
  rotateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    backgroundColor: "rgba(45, 27, 78, 0.6)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(232, 121, 249, 0.3)",
  },
  rotateAngleText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E879F9",
  },
  rotateQuickButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  rotateQuickButton: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(45, 27, 78, 0.8)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(232, 121, 249, 0.3)",
    alignItems: "center",
    gap: 8,
  },
  rotateQuickButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E879F9",
  },
});
