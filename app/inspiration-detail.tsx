import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getInspirationDetail, type SpotDetail } from "@/lib/inspiration-service";

const { width } = Dimensions.get("window");

export default function InspirationDetailScreen() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [detail, setDetail] = useState<SpotDetail | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 模拟数据
  const mockDetail: SpotDetail = {
    id: id as string,
    title: "西湖断桥·白娘子同款",
    images: [
      "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800",
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
    ],
    location: "杭州·西湖",
    address: "浙江省杭州市西湖区断桥",
    views: 12345,
    description:
      "西湖断桥是杭州最经典的拍照机位之一，春天桃花盛开时尤其美丽。推荐穿着浅色系服装，可以拍出清新脱俗的感觉。",
    recommendedStyles: ["日系", "复古", "清新"],
    shootingTips: {
      bestTime: "黄金时刻（日出后1小时 / 日落前1小时）",
      filter: "暖调滤镜（色温+200K）",
      beautyIntensity: 60,
      exposure: "+0.5 EV",
      iso: "ISO 100-400",
      whiteBalance: "日光（5500K）",
      focusMode: "单次自动对焦（AF-S）",
      composition: "三分法构图，将断桥置于画面右侧1/3处，留出湖面和远山",
      lighting: "侧光或逆光，柔和的光线从侧面照射，适合拍摄轮廓",
      weatherSuggestion: "晴天或薄雾天气最佳，雾气可增加朦胧美感",
      clothingTips: "浅色系汉服或长裙，白色、淡粉、浅蓝为佳",
      propsSuggestion: "油纸伞、团扇、桃花枝",
    },
    poseReferences: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400",
    ],
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDetail = async () => {
    try {
      const data = await getInspirationDetail(id as string);
      if (data) {
        setDetail(data);
      } else {
        // 失败时使用模拟数据
        setDetail(mockDetail);
      }
    } catch (error) {
      console.error("加载详情失败:", error);
      setDetail(mockDetail);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFavorited(!isFavorited);
  };

  const handleNavigate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (detail) {
      // 打开地图导航
      const url = `geo:0,0?q=${encodeURIComponent(detail.address)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("提示", "无法打开地图应用");
      });
    }
  };

  const handleShootSameStyle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // 跳转到相机页面，并应用推荐参数
    router.push({
      pathname: "/(tabs)/camera",
      params: {
        autoApplySettings: "true",
        beautyIntensity: detail?.shootingTips.beautyIntensity.toString(),
        filter: detail?.shootingTips.filter,
      },
    });
  };

  if (!detail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavorite} style={styles.favoriteButton}>
          <IconSymbol
            name={isFavorited ? "heart.fill" : "heart"}
            size={24}
            color={isFavorited ? "#EF4444" : "#1F2937"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {detail.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.heroImage} />
          ))}
        </ScrollView>

        {/* Image Indicator */}
        <View style={styles.imageIndicator}>
          {detail.images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentImageIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{detail.title}</Text>
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={16} color="#E879F9" />
              <Text style={styles.locationText}>{detail.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.address}>{detail.address}</Text>
              <View style={styles.viewsRow}>
                <IconSymbol name="eye.fill" size={14} color="#9CA3AF" />
                <Text style={styles.viewsText}>{detail.views} 浏览</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{detail.description}</Text>
          </View>

          {/* Recommended Styles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 推荐风格</Text>
            <View style={styles.tagsContainer}>
              {detail.recommendedStyles.map((style, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{style}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Shooting Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 专业摄影参数</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>⏰ 最佳时间</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.bestTime}</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>🎨 推荐滤镜</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.filter}</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>✨ 美颜强度</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.beautyIntensity}%</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>🔆 曝光补偿</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.exposure}</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>📷 ISO范围</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.iso}</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>☀️ 白平衡</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.whiteBalance}</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipLabel}>🎯 对焦模式</Text>
                <Text style={styles.tipValue}>{detail.shootingTips.focusMode}</Text>
              </View>
            </View>
          </View>

          {/* Advanced Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 进阶建议</Text>
            <View style={styles.advancedTipsContainer}>
              <View style={styles.advancedTipCard}>
                <Text style={styles.advancedTipTitle}>📍 构图建议</Text>
                <Text style={styles.advancedTipContent}>{detail.shootingTips.composition}</Text>
              </View>
              <View style={styles.advancedTipCard}>
                <Text style={styles.advancedTipTitle}>🌞 光线条件</Text>
                <Text style={styles.advancedTipContent}>{detail.shootingTips.lighting}</Text>
              </View>
              <View style={styles.advancedTipCard}>
                <Text style={styles.advancedTipTitle}>☁️ 天气建议</Text>
                <Text style={styles.advancedTipContent}>{detail.shootingTips.weatherSuggestion}</Text>
              </View>
              <View style={styles.advancedTipCard}>
                <Text style={styles.advancedTipTitle}>👗 穿搭建议</Text>
                <Text style={styles.advancedTipContent}>{detail.shootingTips.clothingTips}</Text>
              </View>
              {detail.shootingTips.propsSuggestion && (
                <View style={styles.advancedTipCard}>
                  <Text style={styles.advancedTipTitle}>🎭 道具建议</Text>
                  <Text style={styles.advancedTipContent}>{detail.shootingTips.propsSuggestion}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Pose References */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧍 姿势参考</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.posesContainer}>
                {detail.poseReferences.map((pose, index) => (
                  <Image key={index} source={{ uri: pose }} style={styles.poseImage} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleNavigate} style={styles.navigateButton}>
          <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
          <Text style={styles.navigateText}>导航</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShootSameStyle} style={styles.shootButton}>
          <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
          <Text style={styles.shootText}>拍同款</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: width,
    height: width * 1.2,
    backgroundColor: "#E5E7EB",
  },
  imageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    width: 20,
    backgroundColor: "#E879F9",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: "#E879F9",
    fontWeight: "600",
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E9D5FF",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E879F9",
  },
  tipsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  tipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tipLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  tipValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  posesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  poseImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#6B7280",
    gap: 8,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  shootButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#E879F9",
    gap: 8,
  },
  shootText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  advancedTipsContainer: {
    gap: 12,
  },
  advancedTipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E879F9",
  },
  advancedTipTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  advancedTipContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },
});
