/**
 * yanbao AI 快速訪問欄
 * 參考「美圖秀秀」的直覺感設計
 * 支持快速進入核心功能（拍照、編輯、相冊）
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import YanbaoTheme from '@/lib/theme-config';

const { width } = Dimensions.get('window');

// ============================================
// 快速訪問項目接口
// ============================================
interface QuickAccessItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
  badge?: number; // 用於顯示未讀數量或提示
}

// ============================================
// 快速訪問欄組件
// ============================================
interface QuickAccessBarProps {
  items: QuickAccessItem[];
  style?: any;
  onItemPress?: (item: QuickAccessItem) => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({
  items,
  style,
  onItemPress,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scaleAnim = new Animated.Value(1);

  const handlePress = async (item: QuickAccessItem) => {
    setSelectedId(item.id);
    
    // 觸覺反饋
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 動畫效果
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // 執行回調
    if (onItemPress) {
      onItemPress(item);
    }
    item.onPress();
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['rgba(77, 59, 110, 0.9)', 'rgba(45, 27, 78, 0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              style={[
                styles.itemContainer,
                selectedId === item.id && styles.itemContainerActive,
              ]}
            >
              <Animated.View
                style={[
                  styles.itemContent,
                  selectedId === item.id && {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.label}>{item.label}</Text>
                {item.badge !== undefined && item.badge > 0 && (
                  <View style={[styles.badge, { backgroundColor: item.color }]}>
                    <Text style={styles.badgeText}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

// ============================================
// 快速工具欄組件（用於編輯模塊）
// ============================================
interface QuickToolBarProps {
  tools: Array<{
    id: string;
    label: string;
    icon: string;
    onPress: () => void;
  }>;
  activeToolId?: string;
  style?: any;
}

export const QuickToolBar: React.FC<QuickToolBarProps> = ({
  tools,
  activeToolId,
  style,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(activeToolId || null);

  const handlePress = async (tool: any) => {
    setSelectedId(tool.id);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    tool.onPress();
  };

  return (
    <View style={[styles.toolBarContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolBarContent}
      >
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() => handlePress(tool)}
            style={[
              styles.toolItem,
              selectedId === tool.id && styles.toolItemActive,
            ]}
          >
            <Text style={styles.toolIcon}>{tool.icon}</Text>
            <Text
              style={[
                styles.toolLabel,
                selectedId === tool.id && styles.toolLabelActive,
              ]}
            >
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================
// 快速分類選擇器（用於相冊模塊）
// ============================================
interface QuickCategoryProps {
  categories: Array<{
    id: string;
    label: string;
    count: number;
  }>;
  activeCategory?: string;
  onCategoryChange: (categoryId: string) => void;
  style?: any;
}

export const QuickCategorySelector: React.FC<QuickCategoryProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  style,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(activeCategory || null);

  const handlePress = async (categoryId: string) => {
    setSelectedId(categoryId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChange(categoryId);
  };

  return (
    <View style={[styles.categoryContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handlePress(category.id)}
            style={[
              styles.categoryItem,
              selectedId === category.id && styles.categoryItemActive,
            ]}
          >
            <Text
              style={[
                styles.categoryLabel,
                selectedId === category.id && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
            <Text
              style={[
                styles.categoryCount,
                selectedId === category.id && styles.categoryCountActive,
              ]}
            >
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================
// 樣式定義
// ============================================
const styles = StyleSheet.create({
  // 快速訪問欄樣式
  container: {
    height: 100,
    paddingVertical: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  itemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  itemContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemContent: {
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // 快速工具欄樣式
  toolBarContainer: {
    height: 80,
    backgroundColor: 'rgba(45, 27, 78, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 157, 0.2)',
  },
  toolBarContent: {
    paddingHorizontal: 12,
    gap: 12,
    alignItems: 'center',
  },
  toolItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  toolItemActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.6)',
  },
  toolIcon: {
    fontSize: 20,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  toolLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 快速分類選擇器樣式
  categoryContainer: {
    height: 60,
    backgroundColor: 'rgba(45, 27, 78, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 107, 157, 0.1)',
  },
  categoryContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  categoryItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    gap: 2,
  },
  categoryItemActive: {
    backgroundColor: 'linear-gradient(135deg, #FF6B9D, #A855F7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryCount: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  categoryCountActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default QuickAccessBar;
