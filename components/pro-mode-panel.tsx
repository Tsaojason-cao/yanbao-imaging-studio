import React from "react";
import { View, Text, StyleSheet, Platform, Pressable, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { KuromiSkullDecor } from "./kuromi-ui";

export interface ProModeParams {
  iso: number;
  shutterSpeed: number; // 以分数表示，如1/1000
  whiteBalance: number; // 色温，单位K
  peakingFocus: boolean; // 峰值对焦开关
}

interface ProModePanelProps {
  params: ProModeParams;
  onParamsChange: (params: ProModeParams) => void;
  visible: boolean;
}

/**
 * 专业模式控制面板
 * 手动调节ISO、快门速度、白平衡
 */
export function ProModePanel({
  params,
  onParamsChange,
  visible,
}: ProModePanelProps) {
  if (!visible) return null;

  const handleISOChange = (value: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onParamsChange({ ...params, iso: Math.round(value) });
  };

  const handleShutterSpeedChange = (value: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onParamsChange({ ...params, shutterSpeed: Math.round(value) });
  };

  const handleWhiteBalanceChange = (value: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onParamsChange({ ...params, whiteBalance: Math.round(value) });
  };

  // 格式化快门速度显示
  const formatShutterSpeed = (value: number): string => {
    if (value >= 1) {
      return `${value}"`;
    }
    return `1/${Math.round(1 / value)}`;
  };

  // 格式化白平衡显示
  const formatWhiteBalance = (value: number): string => {
    return `${value}K`;
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={90} style={styles.blur}>
        <LinearGradient
          colors={["rgba(26, 10, 46, 0.98)", "rgba(45, 27, 78, 0.95)"]}
          style={styles.gradient}
        >
          {/* 标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>专业模式</Text>
            <Text style={styles.subtitle}>PRO MODE</Text>
          </View>

          {/* ISO控制 */}
          <View style={styles.controlSection}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>ISO</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>{params.iso}</Text>
              </View>
            </View>
            <View style={styles.sliderRow}>
              <KuromiSkullDecor size={20} />
              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={3200}
                step={100}
                value={params.iso}
                onValueChange={handleISOChange}
                minimumTrackTintColor="#E879F9"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#FFFFFF"
              />
              <KuromiSkullDecor size={20} />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>100</Text>
              <Text style={styles.rangeLabel}>3200</Text>
            </View>
          </View>

          {/* 快门速度控制 */}
          <View style={styles.controlSection}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>快门速度</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>
                  {formatShutterSpeed(params.shutterSpeed)}
                </Text>
              </View>
            </View>
            <View style={styles.sliderRow}>
              <KuromiSkullDecor size={20} />
              <Slider
                style={styles.slider}
                minimumValue={1/8000}
                maximumValue={30}
                value={params.shutterSpeed}
                onValueChange={handleShutterSpeedChange}
                minimumTrackTintColor="#E879F9"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#FFFFFF"
              />
              <KuromiSkullDecor size={20} />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>1/8000</Text>
              <Text style={styles.rangeLabel}>30"</Text>
            </View>
          </View>

          {/* 白平衡控制 */}
          <View style={styles.controlSection}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlLabel}>白平衡</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.valueText}>
                  {formatWhiteBalance(params.whiteBalance)}
                </Text>
              </View>
            </View>
            <View style={styles.sliderRow}>
              <KuromiSkullDecor size={20} />
              <Slider
                style={styles.slider}
                minimumValue={2000}
                maximumValue={10000}
                step={100}
                value={params.whiteBalance}
                onValueChange={handleWhiteBalanceChange}
                minimumTrackTintColor="#E879F9"
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor="#FFFFFF"
              />
              <KuromiSkullDecor size={20} />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>2000K</Text>
              <Text style={styles.rangeLabel}>10000K</Text>
            </View>
            {/* 色温参考 */}
            <View style={styles.wbReference}>
              <View style={styles.wbItem}>
                <View style={[styles.wbDot, { backgroundColor: "#FFA500" }]} />
                <Text style={styles.wbLabel}>日出</Text>
              </View>
              <View style={styles.wbItem}>
                <View style={[styles.wbDot, { backgroundColor: "#FFFFFF" }]} />
                <Text style={styles.wbLabel}>日光</Text>
              </View>
              <View style={styles.wbItem}>
                <View style={[styles.wbDot, { backgroundColor: "#87CEEB" }]} />
                <Text style={styles.wbLabel}>阴天</Text>
              </View>
            </View>
          </View>

          {/* 峰值对焦开关 */}
          <View style={styles.peakingSection}>
            <View style={styles.peakingHeader}>
              <View>
                <Text style={styles.peakingTitle}>峰值对焦</Text>
                <Text style={styles.peakingSubtitle}>Focus Peaking</Text>
              </View>
              <Pressable
                style={[
                  styles.peakingSwitch,
                  params.peakingFocus && styles.peakingSwitchActive,
                ]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  onParamsChange({ ...params, peakingFocus: !params.peakingFocus });
                }}
              >
                <View
                  style={[
                    styles.peakingThumb,
                    params.peakingFocus && styles.peakingThumbActive,
                  ]}
                />
              </Pressable>
            </View>
            <Text style={styles.peakingDescription}>
              高亮显示对焦清晰区域，帮助精确手动对焦
            </Text>
          </View>

          {/* 快捷预设 */}
          <View style={styles.presetsSection}>
            <Text style={styles.presetsTitle}>快捷预设</Text>
            <View style={styles.presetButtons}>
              <PresetButton
                label="自动"
                onPress={() =>
                  onParamsChange({ iso: 400, shutterSpeed: 1 / 125, whiteBalance: 5500, peakingFocus: params.peakingFocus })
                }
              />
              <PresetButton
                label="日光"
                onPress={() =>
                  onParamsChange({ iso: 200, shutterSpeed: 1 / 500, whiteBalance: 5500, peakingFocus: params.peakingFocus })
                }
              />
              <PresetButton
                label="室内"
                onPress={() =>
                  onParamsChange({ iso: 800, shutterSpeed: 1 / 60, whiteBalance: 3200, peakingFocus: params.peakingFocus })
                }
              />
              <PresetButton
                label="夜景"
                onPress={() =>
                  onParamsChange({ iso: 1600, shutterSpeed: 1 / 30, whiteBalance: 4000, peakingFocus: params.peakingFocus })
                }
              />
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

// 预设按钮组件
function PresetButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.presetButton,
        pressed && styles.presetButtonPressed,
      ]}
      onPress={() => {
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
      }}
    >
      <Text style={styles.presetButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "70%",
  },
  blur: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  gradient: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(167, 139, 250, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(167, 139, 250, 0.8)",
    letterSpacing: 2,
    marginTop: 4,
  },
  controlSection: {
    marginBottom: 28,
  },
  controlHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  valueContainer: {
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.4)",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E879F9",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  rangeLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  wbReference: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 139, 250, 0.2)",
  },
  wbItem: {
    alignItems: "center",
    gap: 4,
  },
  wbDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  wbLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
  },
  peakingSection: {
    marginBottom: 24,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  peakingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  peakingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  peakingSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(167, 139, 250, 0.7)",
    letterSpacing: 1,
    marginTop: 2,
  },
  peakingSwitch: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 2,
    justifyContent: "center",
  },
  peakingSwitchActive: {
    backgroundColor: "#E879F9",
  },
  peakingThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  peakingThumbActive: {
    transform: [{ translateX: 24 }],
  },
  peakingDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
  },
  presetsSection: {
    marginTop: 8,
  },
  presetsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: "row",
    gap: 12,
  },
  presetButton: {
    flex: 1,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.4)",
  },
  presetButtonPressed: {
    backgroundColor: "rgba(167, 139, 250, 0.4)",
    transform: [{ scale: 0.95 }],
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#E879F9",
    borderRadius: 4,
  },
});
