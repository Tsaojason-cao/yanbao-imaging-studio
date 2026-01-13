/**
 * yanbao AI 專業級參數控制組件
 * 參考「像素蛋糕」的專業感設計
 * 
 * 功能：
 * - 細膩的數值刻度顯示
 * - ISO、快門、白平衡精細調整
 * - 參數預覽實時反饋
 * - 高級色彩分級工具
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// ============================================
// 參數控制接口
// ============================================
interface ParameterControlProps {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step: number;
  unit: string;
  presets?: Array<{ label: string; value: number }>;
  onChange: (value: number) => void;
  onPresetSelect?: (value: number) => void;
}

// ============================================
// 專業級參數控制組件
// ============================================
export const ProfessionalParameterControl: React.FC<ParameterControlProps> = ({
  label,
  value,
  minValue,
  maxValue,
  step,
  unit,
  presets,
  onChange,
  onPresetSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  // 切換展開/收縮
  const toggleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  // 計算刻度標記
  const getScaleMarks = () => {
    const marks = [];
    const markCount = 5;
    const step = (maxValue - minValue) / (markCount - 1);
    
    for (let i = 0; i < markCount; i++) {
      marks.push({
        value: minValue + i * step,
        label: `${Math.round(minValue + i * step)}`,
      });
    }
    
    return marks;
  };

  // 計算進度百分比
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

  // 獲取刻度標記
  const scaleMarks = getScaleMarks();

  return (
    <View style={styles.container}>
      {/* 參數頭部 */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valueDisplay}>
            <Text style={styles.value}>{value.toFixed(1)}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </View>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {/* 進度條 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* 滑塊 */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minValue}
          maximumValue={maxValue}
          step={step}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor="#FF6B9D"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        />
      </View>

      {/* 刻度標記 */}
      <View style={styles.scaleContainer}>
        {scaleMarks.map((mark, index) => (
          <View key={index} style={styles.scaleMark}>
            <View style={styles.scaleMarkLine} />
            <Text style={styles.scaleMarkLabel}>{mark.label}</Text>
          </View>
        ))}
      </View>

      {/* 展開內容 */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.expandedContent,
            {
              opacity: expandAnim,
              maxHeight: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300],
              }),
            },
          ]}
        >
          {/* 預設按鈕 */}
          {presets && presets.length > 0 && (
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsTitle}>快速預設</Text>
              <View style={styles.presetsGrid}>
                {presets.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.presetButton,
                      value === preset.value && styles.presetButtonActive,
                    ]}
                    onPress={() => {
                      onChange(preset.value);
                      onPresetSelect?.(preset.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                  >
                    <Text
                      style={[
                        styles.presetButtonText,
                        value === preset.value && styles.presetButtonTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 精確輸入 */}
          <View style={styles.preciseInputContainer}>
            <Text style={styles.preciseInputLabel}>精確輸入</Text>
            <View style={styles.preciseInputField}>
              <TouchableOpacity
                style={styles.preciseInputButton}
                onPress={() => onChange(Math.max(minValue, value - step))}
              >
                <Text style={styles.preciseInputButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.preciseInputValue}>
                {value.toFixed(1)} {unit}
              </Text>
              <TouchableOpacity
                style={styles.preciseInputButton}
                onPress={() => onChange(Math.min(maxValue, value + step))}
              >
                <Text style={styles.preciseInputButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

// ============================================
// 色彩分級工具
// ============================================
interface ColorGradingToolProps {
  shadows: number;
  midtones: number;
  highlights: number;
  onShadowsChange: (value: number) => void;
  onMidtonesChange: (value: number) => void;
  onHighlightsChange: (value: number) => void;
}

export const ColorGradingTool: React.FC<ColorGradingToolProps> = ({
  shadows,
  midtones,
  highlights,
  onShadowsChange,
  onMidtonesChange,
  onHighlightsChange,
}) => {
  return (
    <View style={styles.colorGradingContainer}>
      <Text style={styles.colorGradingTitle}>色彩分級</Text>

      {/* 陰影 */}
      <View style={styles.colorGradingItem}>
        <View style={styles.colorGradingLabel}>
          <View style={[styles.colorGradingDot, { backgroundColor: '#1a1a1a' }]} />
          <Text style={styles.colorGradingItemLabel}>陰影</Text>
        </View>
        <Slider
          style={styles.colorGradingSlider}
          minimumValue={-100}
          maximumValue={100}
          step={1}
          value={shadows}
          onValueChange={onShadowsChange}
          minimumTrackTintColor="#FF6B9D"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        />
        <Text style={styles.colorGradingValue}>{shadows > 0 ? '+' : ''}{shadows}</Text>
      </View>

      {/* 中間調 */}
      <View style={styles.colorGradingItem}>
        <View style={styles.colorGradingLabel}>
          <View style={[styles.colorGradingDot, { backgroundColor: '#888888' }]} />
          <Text style={styles.colorGradingItemLabel}>中間調</Text>
        </View>
        <Slider
          style={styles.colorGradingSlider}
          minimumValue={-100}
          maximumValue={100}
          step={1}
          value={midtones}
          onValueChange={onMidtonesChange}
          minimumTrackTintColor="#FF6B9D"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        />
        <Text style={styles.colorGradingValue}>{midtones > 0 ? '+' : ''}{midtones}</Text>
      </View>

      {/* 高光 */}
      <View style={styles.colorGradingItem}>
        <View style={styles.colorGradingLabel}>
          <View style={[styles.colorGradingDot, { backgroundColor: '#ffffff' }]} />
          <Text style={styles.colorGradingItemLabel}>高光</Text>
        </View>
        <Slider
          style={styles.colorGradingSlider}
          minimumValue={-100}
          maximumValue={100}
          step={1}
          value={highlights}
          onValueChange={onHighlightsChange}
          minimumTrackTintColor="#FF6B9D"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        />
        <Text style={styles.colorGradingValue}>{highlights > 0 ? '+' : ''}{highlights}</Text>
      </View>
    </View>
  );
};

// ============================================
// 樣式定義
// ============================================
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  unit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 2,
  },
  sliderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  slider: {
    height: 4,
    borderRadius: 2,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  scaleMark: {
    alignItems: 'center',
    gap: 4,
  },
  scaleMarkLine: {
    width: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scaleMarkLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetsContainer: {
    marginBottom: 12,
  },
  presetsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  presetsGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderColor: 'rgba(255, 107, 157, 0.6)',
  },
  presetButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  presetButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  preciseInputContainer: {
    gap: 8,
  },
  preciseInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  preciseInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  preciseInputButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preciseInputButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  preciseInputValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  colorGradingContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorGradingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  colorGradingItem: {
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  colorGradingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorGradingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  colorGradingItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  colorGradingSlider: {
    height: 4,
    borderRadius: 2,
  },
  colorGradingValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B9D',
    textAlign: 'right',
  },
});

export default ProfessionalParameterControl;
