import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface BeautyParam {
  id: string;
  label: string;
  icon: string;
  value: number;
  color: string;
}

/**
 * Edit Screen - 7 维美颜滑块编辑器
 * 
 * 包含：
 * - 7 个美颜参数滑块
 * - 实时预览对比
 * - 滤镜选择
 * - 前后对比功能
 */
export default function EditScreen() {
  const colors = useColors();
  const router = useRouter();
  const [showComparison, setShowComparison] = useState(false);

  const [beautyParams, setBeautyParams] = useState<BeautyParam[]>([
    { id: "smooth", label: "磨皮", icon: "✨", value: 50, color: "#E879F9" },
    { id: "whiten", label: "美白", icon: "🌟", value: 40, color: "#60A5FA" },
    { id: "ruddy", label: "红润", icon: "🌸", value: 30, color: "#FCA5A5" },
    { id: "brighten", label: "亮眼", icon: "👁️", value: 45, color: "#86EFAC" },
    { id: "thin", label: "瘦脸", icon: "💎", value: 35, color: "#FDE047" },
    { id: "enlarge", label: "大眼", icon: "👀", value: 40, color: "#C084FC" },
    { id: "nose", label: "瘦鼻", icon: "👃", value: 25, color: "#93C5FD" },
  ]);

  const updateParam = (id: string, value: number) => {
    setBeautyParams((prev) =>
      prev.map((param) => (param.id === id ? { ...param, value } : param))
    );
  };

  const resetAll = () => {
    setBeautyParams((prev) =>
      prev.map((param) => ({ ...param, value: 50 }))
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="bg-background">
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
        >
          <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          美颜编辑
        </Text>

        <TouchableOpacity
          onPress={resetAll}
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.resetText, { color: colors.primary }]}>
            重置
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 预览区域 */}
        <View style={styles.previewContainer}>
          <View style={[styles.preview, { backgroundColor: colors.surface }]}>
            <Text style={[styles.previewText, { color: colors.muted }]}>
              🖼️ 照片预览
            </Text>
            <Text style={[styles.previewSubtext, { color: colors.muted }]}>
              实时美颜效果
            </Text>
          </View>

          {/* 前后对比按钮 */}
          <TouchableOpacity
            onPress={() => setShowComparison(!showComparison)}
            style={[
              styles.compareButton,
              {
                backgroundColor: showComparison ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.compareText,
                { color: showComparison ? "#FFFFFF" : colors.foreground },
              ]}
            >
              {showComparison ? "✓ 对比中" : "前后对比"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 7 维美颜滑块 */}
        <View style={styles.slidersContainer}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            7 维美颜参数
          </Text>

          {beautyParams.map((param, index) => (
            <BeautySlider
              key={param.id}
              param={param}
              onValueChange={(value) => updateParam(param.id, value)}
              delay={index * 50}
            />
          ))}
        </View>

        {/* 快捷预设 */}
        <View style={styles.presetsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            快捷预设
          </Text>
          <View style={styles.presetsList}>
            {["自然", "清新", "甜美", "冷艳"].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[styles.presetButton, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.presetText, { color: colors.foreground }]}>
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 保存按钮 */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.saveText}>保存照片</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function BeautySlider({
  param,
  onValueChange,
  delay,
}: {
  param: BeautyParam;
  onValueChange: (value: number) => void;
  delay: number;
}) {
  const colors = useColors();
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useState(() => {
    setTimeout(() => {
      translateY.value = withSpring(0);
      opacity.value = withSpring(1);
    }, delay);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.sliderContainer, animatedStyle]}>
      <View style={styles.sliderHeader}>
        <View style={styles.sliderLabel}>
          <Text style={styles.sliderIcon}>{param.icon}</Text>
          <Text style={[styles.sliderText, { color: colors.foreground }]}>
            {param.label}
          </Text>
        </View>
        <Text style={[styles.sliderValue, { color: param.color }]}>
          {Math.round(param.value)}
        </Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={param.value}
        onValueChange={onValueChange}
        minimumTrackTintColor={param.color}
        maximumTrackTintColor={colors.border}
        thumbTintColor={param.color}
      />
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  previewContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  preview: {
    height: 300,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  previewText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  previewSubtext: {
    fontSize: 14,
  },
  compareButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: "center",
  },
  compareText: {
    fontSize: 14,
    fontWeight: "600",
  },
  slidersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sliderLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sliderIcon: {
    fontSize: 20,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  presetsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  presetsList: {
    flexDirection: "row",
    gap: 12,
  },
  presetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  presetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
