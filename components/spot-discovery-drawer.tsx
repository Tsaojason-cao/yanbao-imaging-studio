import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import {
  getNearbySpots,
  formatDistance,
  recordSpotVisit,
  type ShootingSpot,
} from "@/lib/shooting-spots-service";

interface SpotDiscoveryDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSelectSpot: (spot: ShootingSpot) => void;
}

/**
 * 灵感机位抽屉组件
 * 展示附近的拍摄机位推荐
 */
export function SpotDiscoveryDrawer({
  visible,
  onClose,
  onSelectSpot,
}: SpotDiscoveryDrawerProps) {
  const [spots, setSpots] = useState<ShootingSpot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSpots();
    }
  }, [visible]);

  const loadSpots = async () => {
    setLoading(true);
    try {
      const nearbySpots = await getNearbySpots(5); // 5km半径
      setSpots(nearbySpots);
    } catch (error) {
      console.error("加载机位失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSpot = async (spot: ShootingSpot) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await recordSpotVisit(spot.id);
    onSelectSpot(spot);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
          <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
            {/* 标题栏 */}
            <View style={styles.header}>
              <Text style={styles.title}>✨ 灵感机位</Text>
              <Text style={styles.subtitle}>
                发现附近的绝佳拍摄点
              </Text>
            </View>

            {/* 机位列表 */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF69B4" />
                <Text style={styles.loadingText}>定位中...</Text>
              </View>
            ) : spots.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>附近暂无推荐机位</Text>
                <Text style={styles.emptyHint}>
                  尝试前往热门景点或城市地标
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.spotList}
                showsVerticalScrollIndicator={false}
              >
                {spots.map((spot) => (
                  <Pressable
                    key={spot.id}
                    style={({ pressed }) => [
                      styles.spotCard,
                      pressed && styles.spotCardPressed,
                    ]}
                    onPress={() => handleSelectSpot(spot)}
                  >
                    {/* 样张图片 */}
                    <Image
                      source={{ uri: spot.sampleImageUrl }}
                      style={styles.spotImage}
                      resizeMode="cover"
                    />

                    {/* 机位信息 */}
                    <View style={styles.spotInfo}>
                      <View style={styles.spotHeader}>
                        <Text style={styles.spotName}>{spot.name}</Text>
                        <View style={styles.distanceBadge}>
                          <Text style={styles.distanceText}>
                            {formatDistance(spot.distance || 0)}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.spotDescription} numberOfLines={2}>
                        {spot.description}
                      </Text>

                      {/* 标签 */}
                      <View style={styles.tagsContainer}>
                        {spot.tags.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>

                      {/* 评分和访问次数 */}
                      <View style={styles.spotFooter}>
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingText}>⭐ {spot.rating}</Text>
                        </View>
                        <Text style={styles.visitCount}>
                          {spot.visitCount} 人打卡
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* 关闭按钮 */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>收起</Text>
            </Pressable>
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawer: {
    height: "70%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#CCCCCC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  spotList: {
    flex: 1,
  },
  spotCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  spotCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  spotImage: {
    width: 120,
    height: 160,
  },
  spotInfo: {
    flex: 1,
    padding: 12,
  },
  spotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: "rgba(255, 105, 180, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF69B4",
  },
  spotDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "rgba(138, 43, 226, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#BA55D3",
  },
  spotFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
  },
  visitCount: {
    fontSize: 12,
    color: "#999999",
  },
  closeButton: {
    backgroundColor: "rgba(255, 105, 180, 0.3)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF69B4",
  },
});
