import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

/**
 * Camera Screen - 相机控制界面
 * 
 * 模拟相机取景和控制，包括：
 * - 取景框动画
 * - 拍照按钮脉冲效果
 * - LUT 预设选择
 * - 美颜参数快速调整
 */
export default function CameraScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedLUT, setSelectedLUT] = useState("自然");
  const [beautyLevel, setBeautyLevel] = useState(5);

  const shutterScale = useSharedValue(1);
  const focusOpacity = useSharedValue(0);

  useEffect(() => {
    // 拍照按钮脉冲动画
    shutterScale.value = withRepeat(
      withTiming(1.1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const handleShutter = () => {
    // 模拟拍照闪光效果
    focusOpacity.value = withTiming(1, { duration: 100 }, () => {
      focusOpacity.value = withTiming(0, { duration: 300 });
    });
  };

  const shutterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: focusOpacity.value,
  }));

  const lutPresets = ["自然", "清新", "复古", "胶片", "黑白"];

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="bg-black">
      {/* 返回按钮 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.surface + "CC" }]}
        >
          <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* 取景框区域 */}
      <View style={styles.viewfinderContainer}>
        {/* 模拟取景画面 */}
        <View style={[styles.viewfinder, { backgroundColor: colors.surface }]}>
          <Text style={[styles.placeholderText, { color: colors.muted }]}>
            📷 相机取景区域
          </Text>
          <Text style={[styles.placeholderSubtext, { color: colors.muted }]}>
            实时美颜 · {selectedLUT} 滤镜
          </Text>
        </View>

        {/* 拍照闪光效果 */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.flash, flashAnimatedStyle]} />

        {/* 对焦框 */}
        <View style={[styles.focusFrame, { borderColor: colors.primary }]} />
      </View>

      {/* LUT 预设选择 */}
      <View style={styles.lutContainer}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          滤镜预设
        </Text>
        <View style={styles.lutList}>
          {lutPresets.map((lut) => (
            <TouchableOpacity
              key={lut}
              onPress={() => setSelectedLUT(lut)}
              style={[
                styles.lutButton,
                {
                  backgroundColor:
                    selectedLUT === lut ? colors.primary : colors.surface,
                  borderColor: selectedLUT === lut ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.lutText,
                  {
                    color: selectedLUT === lut ? "#FFFFFF" : colors.foreground,
                  },
                ]}
              >
                {lut}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 美颜强度快速调整 */}
      <View style={styles.beautyContainer}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          美颜强度: {beautyLevel}
        </Text>
        <View style={styles.beautySlider}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setBeautyLevel(level)}
              style={[
                styles.beautyDot,
                {
                  backgroundColor:
                    level <= beautyLevel ? colors.primary : colors.border,
                  transform: [{ scale: level <= beautyLevel ? 1.2 : 1 }],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 拍照按钮 */}
      <View style={styles.controlsContainer}>
        <Animated.View style={shutterAnimatedStyle}>
          <TouchableOpacity
            onPress={handleShutter}
            style={[styles.shutterButton, { borderColor: colors.primary }]}
          >
            <View style={[styles.shutterInner, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* 底部功能按钮 */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={() => router.push("/edit" as any)}
          style={[styles.iconButton, { backgroundColor: colors.surface + "CC" }]}
        >
          <IconSymbol
            name="chevron.left.forwardslash.chevron.right"
            size={24}
            color={colors.foreground}
          />
          <Text style={[styles.iconButtonText, { color: colors.foreground }]}>
            编辑
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/builds" as any)}
          style={[styles.iconButton, { backgroundColor: colors.surface + "CC" }]}
        >
          <IconSymbol name="house.fill" size={24} color={colors.foreground} />
          <Text style={[styles.iconButtonText, { color: colors.foreground }]}>
            相册
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  viewfinderContainer: {
    flex: 1,
    marginTop: 80,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
  },
  viewfinder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
  },
  flash: {
    backgroundColor: "#FFFFFF",
  },
  focusFrame: {
    position: "absolute",
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 4,
    top: "50%",
    left: "50%",
    marginTop: -50,
    marginLeft: -50,
  },
  lutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  lutList: {
    flexDirection: "row",
    gap: 8,
  },
  lutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
  },
  lutText: {
    fontSize: 13,
    fontWeight: "600",
  },
  beautyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  beautySlider: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  beautyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  controlsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  iconButton: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  iconButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
