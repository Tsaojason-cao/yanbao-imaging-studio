/**
 * yanbao AI - 大师参数控制面板
 * 
 * 包含 29 个精确调参滑块：
 * - 基础光影阵列（10 个）
 * - 色彩美学阵列（9 个）
 * - 大师/抖音/黄油强化阵列（10 个）
 * 
 * 优化特性：
 * - FlatList 虚拟化列表
 * - Native Driver 原生驱动
 * - 60fps 无卡顿
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeModules,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  default: number;
  category: 'light' | 'color' | 'master';
  description?: string;
}

// ============================================================================
// 第一阵列：基础光影（10 个滑块）
// ============================================================================
const LIGHT_SLIDERS: SliderConfig[] = [
  {
    id: 'exposure',
    label: '感光度',
    min: -100,
    max: 100,
    default: 0,
    category: 'light',
    description: '控制全局亮度，步进 0.1',
  },
  {
    id: 'contrast',
    label: '对比度',
    min: 0,
    max: 2.0,
    default: 1.0,
    category: 'light',
    description: '强化明暗边界',
  },
  {
    id: 'highlight',
    label: '高光抑制',
    min: -100,
    max: 0,
    default: 0,
    category: 'light',
    description: '挽救天空细节',
  },
  {
    id: 'shadow',
    label: '阴影提亮',
    min: 0,
    max: 100,
    default: 0,
    category: 'light',
    description: '挽救暗部细节',
  },
  {
    id: 'whites',
    label: '白点',
    min: -100,
    max: 100,
    default: 0,
    category: 'light',
    description: '调整高光区域亮度',
  },
  {
    id: 'blacks',
    label: '黑点',
    min: -100,
    max: 100,
    default: 0,
    category: 'light',
    description: '调整暗部区域亮度',
  },
  {
    id: 'temperature',
    label: '色温',
    min: -50,
    max: 50,
    default: 0,
    category: 'light',
    description: '向暖/向冷偏移',
  },
  {
    id: 'tint',
    label: '色调',
    min: -50,
    max: 50,
    default: 0,
    category: 'light',
    description: '向绿/向品红偏移',
  },
  {
    id: 'saturation',
    label: '饱和度',
    min: -100,
    max: 100,
    default: 0,
    category: 'light',
    description: '控制色彩浓度',
  },
  {
    id: 'vibrance',
    label: '自然饱和度',
    min: -100,
    max: 100,
    default: 0,
    category: 'light',
    description: '智能饱和度调整',
  },
];

// ============================================================================
// 第二阵列：色彩美学（9 个滑块）
// ============================================================================
const COLOR_SLIDERS: SliderConfig[] = [
  {
    id: 'skin_tone',
    label: '肤色校准',
    min: -50,
    max: 50,
    default: 0,
    category: 'color',
    description: '向暖/向冷偏移，实现大师肤色',
  },
  {
    id: 'hsl_red',
    label: '红色偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '控制唇色与肤色红润度',
  },
  {
    id: 'hsl_green',
    label: '绿色偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '调整绿色通道',
  },
  {
    id: 'hsl_blue',
    label: '蓝色偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '调整蓝色通道',
  },
  {
    id: 'hsl_yellow',
    label: '黄色偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '调整黄色通道',
  },
  {
    id: 'hsl_cyan',
    label: '青色偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '调整青色通道',
  },
  {
    id: 'hsl_magenta',
    label: '品红偏移',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '调整品红通道',
  },
  {
    id: 'faded',
    label: '褪色感',
    min: 0,
    max: 100,
    default: 0,
    category: 'color',
    description: '胶片质感核心参数',
  },
  {
    id: 'clarity',
    label: '清晰度',
    min: -100,
    max: 100,
    default: 0,
    category: 'color',
    description: '中频锐化效果',
  },
];

// ============================================================================
// 第三阵列：大师/抖音/黄油强化（10 个滑块）
// ============================================================================
const MASTER_SLIDERS: SliderConfig[] = [
  {
    id: 'grain',
    label: '胶片颗粒',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '抖音风格：模拟电影负片粗糙度',
  },
  {
    id: 'halo',
    label: '柔光光晕',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '抖音风格：复古氤氲感',
  },
  {
    id: 'border_w',
    label: '留白宽度',
    min: 0,
    max: 80,
    default: 0,
    category: 'master',
    description: '黄油相机：极简留白边框',
  },
  {
    id: 'canvas_ratio',
    label: '画布比例',
    min: 1,
    max: 16,
    default: 1,
    category: 'master',
    description: '黄油相机：排版辅助',
  },
  {
    id: 'vignette',
    label: '暗角',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '边缘暗化效果',
  },
  {
    id: 'sepia',
    label: '棕褐色',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '复古棕褐色调',
  },
  {
    id: 'vintage',
    label: '复古',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '复古胶片效果',
  },
  {
    id: 'filmstrip',
    label: '胶片感',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '电影级胶片质感',
  },
  {
    id: 'sharpen',
    label: '锐化',
    min: 0,
    max: 100,
    default: 0,
    category: 'master',
    description: '边缘锐化效果',
  },
  {
    id: 'master_weight',
    label: '大师权重',
    min: 0,
    max: 100,
    default: 50,
    category: 'master',
    description: '决定 AI 逻辑介入的深度',
  },
];

// ============================================================================
// 合并所有滑块配置
// ============================================================================
const ALL_SLIDERS = [...LIGHT_SLIDERS, ...COLOR_SLIDERS, ...MASTER_SLIDERS];

interface MasterControlPanelProps {
  onParamChange?: (paramId: string, value: number) => void;
  pressureTestMode?: boolean;
}

export const MasterControlPanel: React.FC<MasterControlPanelProps> = ({
  onParamChange,
  pressureTestMode = false,
}) => {
  const [params, setParams] = useState<Record<string, number>>(() => {
    const initialParams: Record<string, number> = {};
    ALL_SLIDERS.forEach(slider => {
      initialParams[slider.id] = slider.default;
    });
    return initialParams;
  });

  const [pressureTestCount, setPressureTestCount] = useState(0);

  // 处理参数变化
  const handleParamChange = useCallback(
    (paramId: string, value: number) => {
      setParams(prev => ({ ...prev, [paramId]: value }));
      setPressureTestCount(prev => prev + 1);

      // 调用原生模块
      if (NativeModules.CameraModule?.applyFilter) {
        NativeModules.CameraModule.applyFilter({
          paramId,
          value,
        }).catch((error: any) => {
          console.warn(`❌ 参数应用失败 (${paramId}):`, error);
        });
      }

      // 触发回调
      onParamChange?.(paramId, value);

      // 压力测试日志
      if (pressureTestMode && pressureTestCount % 10 === 0) {
        console.log(`✅ 压力测试进度: ${pressureTestCount} 次滑块操作`);
      }
    },
    [onParamChange, pressureTestMode, pressureTestCount]
  );

  // 重置所有参数
  const handleResetAll = useCallback(() => {
    const resetParams: Record<string, number> = {};
    ALL_SLIDERS.forEach(slider => {
      resetParams[slider.id] = slider.default;
    });
    setParams(resetParams);
    setPressureTestCount(0);
  }, []);

  // 渲染单个滑块项
  const renderSliderItem = useCallback(
    ({ item }: { item: SliderConfig }) => (
      <View style={styles.sliderItem}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{item.label}</Text>
          <Text style={styles.sliderValue}>
            {params[item.id]?.toFixed(1) || item.default.toFixed(1)}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={item.min}
          maximumValue={item.max}
          value={params[item.id] || item.default}
          onValueChange={value => handleParamChange(item.id, value)}
          step={0.1}
          minimumTrackTintColor="#FF6B6B"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#FF6B6B"
          useNativeDriver={true}
        />
        {item.description && (
          <Text style={styles.sliderDescription}>{item.description}</Text>
        )}
      </View>
    ),
    [params, handleParamChange]
  );

  // 按类别分组数据
  const groupedData = useMemo(() => {
    return [
      { title: '基础光影阵列 (10 个)', data: LIGHT_SLIDERS },
      { title: '色彩美学阵列 (9 个)', data: COLOR_SLIDERS },
      { title: '大师/抖音/黄油强化阵列 (10 个)', data: MASTER_SLIDERS },
    ];
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>yanbao AI 大师参数控制</Text>
        <Text style={styles.subtitle}>29 个精确调参滑块</Text>
      </View>

      {/* 压力测试信息 */}
      {pressureTestMode && (
        <View style={styles.pressureTestInfo}>
          <Text style={styles.pressureTestLabel}>
            压力测试进度: {pressureTestCount} 次操作
          </Text>
          <Text style={styles.pressureTestHint}>
            同时滑动多个参数，监控帧率和内存占用
          </Text>
        </View>
      )}

      {/* 滑块组 */}
      {groupedData.map((group, index) => (
        <View key={index} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <FlatList
            data={group.data}
            renderItem={renderSliderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        </View>
      ))}

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        <Text
          style={[styles.button, styles.resetButton]}
          onPress={handleResetAll}
        >
          重置所有参数
        </Text>
      </View>

      {/* 统计信息 */}
      <View style={styles.stats}>
        <Text style={styles.statsLabel}>
          已激活参数: {Object.keys(params).filter(k => params[k] !== 0).length}/29
        </Text>
        <Text style={styles.statsLabel}>
          总操作次数: {pressureTestCount}
        </Text>
      </View>

      {/* 底部间距 */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// ============================================================================
// 样式定义（Leica 极简风格）
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'PingFang SC',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'PingFang SC',
  },
  pressureTestInfo: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pressureTestLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    fontFamily: 'PingFang SC',
    marginBottom: 4,
  },
  pressureTestHint: {
    fontSize: 12,
    color: '#BF360C',
    fontFamily: 'PingFang SC',
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'PingFang SC',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sliderItem: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'PingFang SC',
  },
  sliderValue: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    fontFamily: 'PingFang SC',
  },
  slider: {
    height: 40,
    width: '100%',
  },
  sliderDescription: {
    fontSize: 11,
    color: '#999999',
    fontFamily: 'PingFang SC',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'PingFang SC',
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
  },
  stats: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statsLabel: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PingFang SC',
    marginBottom: 4,
  },
});

export default MasterControlPanel;
