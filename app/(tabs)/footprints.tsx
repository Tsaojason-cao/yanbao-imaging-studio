import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FootprintService, Footprint } from "@/src/services/FootprintService";

const { width } = Dimensions.get("window");

export default function FootprintsScreen() {
  const router = useRouter();
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [statistics, setStatistics] = useState({
    totalSpots: 0,
    totalVisits: 0,
    totalPhotos: 0,
    mostVisitedSpot: null as Footprint | null,
  });

  useEffect(() => {
    loadFootprints();
  }, []);

  const loadFootprints = async () => {
    const allFootprints = await FootprintService.getAllFootprints();
    const stats = await FootprintService.getStatistics();
    
    // 按最后访问时间倒序排列
    allFootprints.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
    
    setFootprints(allFootprints);
    setStatistics(stats);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleClearAll = async () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    await FootprintService.clearAllFootprints();
    await loadFootprints();
  };

  return (
    <ScreenContainer>
      <LinearGradient
        colors={["#1A0A2E", "#2D1B4E", "#3D2463"]}
        style={styles.background}
      >
        {/* 顶部导航栏 */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>我的足迹</Text>
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={handleClearAll}
          >
            <MaterialCommunityIcons name="delete-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 统计卡片 */}
          <View style={styles.statsContainer}>
            <BlurView intensity={80} style={styles.statsBlur}>
              <LinearGradient
                colors={["rgba(167, 139, 250, 0.2)", "rgba(236, 72, 153, 0.2)"]}
                style={styles.statsGradient}
              >
                <View style={styles.statsRow}>
                  <StatCard
                    icon="map-marker-multiple"
                    label="探索机位"
                    value={statistics.totalSpots}
                  />
                  <StatCard
                    icon="foot-print"
                    label="访问次数"
                    value={statistics.totalVisits}
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="camera"
                    label="拍摄照片"
                    value={statistics.totalPhotos}
                  />
                  <StatCard
                    icon="star"
                    label="最爱机位"
                    value={statistics.mostVisitedSpot?.visitCount || 0}
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          {/* 足迹列表 */}
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>访问记录</Text>
            {footprints.length === 0 ? (
              <BlurView intensity={60} style={styles.emptyBlur}>
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons
                    name="map-marker-off"
                    size={64}
                    color="rgba(167, 139, 250, 0.5)"
                  />
                  <Text style={styles.emptyText}>还没有足迹记录</Text>
                  <Text style={styles.emptySubtext}>
                    去探索附近的拍摄机位吧！
                  </Text>
                </View>
              </BlurView>
            ) : (
              footprints.map((footprint, index) => (
                <FootprintCard
                  key={footprint.spotId}
                  footprint={footprint}
                  formatDate={formatDate}
                  isFirst={index === 0}
                />
              ))
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenContainer>
  );
}

// 统计卡片组件
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <MaterialCommunityIcons
        name={icon as any}
        size={32}
        color="#A78BFA"
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// 足迹卡片组件
function FootprintCard({
  footprint,
  formatDate,
  isFirst,
}: {
  footprint: Footprint;
  formatDate: (timestamp: number) => string;
  isFirst: boolean;
}) {
  return (
    <BlurView intensity={60} style={styles.footprintBlur}>
      <LinearGradient
        colors={
          isFirst
            ? ["rgba(167, 139, 250, 0.3)", "rgba(236, 72, 153, 0.3)"]
            : ["rgba(167, 139, 250, 0.15)", "rgba(236, 72, 153, 0.15)"]
        }
        style={styles.footprintCard}
      >
        {isFirst && (
          <View style={styles.recentBadge}>
            <Text style={styles.recentBadgeText}>最近</Text>
          </View>
        )}
        
        <View style={styles.footprintHeader}>
          <View style={styles.footprintTitleRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#A78BFA"
            />
            <Text style={styles.footprintName}>{footprint.spotName}</Text>
          </View>
          <Text style={styles.footprintDate}>
            {formatDate(footprint.lastVisitTime)}
          </Text>
        </View>

        <View style={styles.footprintStats}>
          <View style={styles.footprintStatItem}>
            <MaterialCommunityIcons
              name="foot-print"
              size={16}
              color="rgba(167, 139, 250, 0.8)"
            />
            <Text style={styles.footprintStatText}>
              访问 {footprint.visitCount} 次
            </Text>
          </View>
          <View style={styles.footprintStatItem}>
            <MaterialCommunityIcons
              name="camera"
              size={16}
              color="rgba(236, 72, 153, 0.8)"
            />
            <Text style={styles.footprintStatText}>
              拍摄 {footprint.photosTaken} 张
            </Text>
          </View>
        </View>

        <View style={styles.footprintCoords}>
          <Text style={styles.footprintCoordsText}>
            📍 {footprint.latitude.toFixed(4)}, {footprint.longitude.toFixed(4)}
          </Text>
        </View>
      </LinearGradient>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(167, 139, 250, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsBlur: {
    borderRadius: 24,
    overflow: "hidden",
  },
  statsGradient: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  listContainer: {
    gap: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyBlur: {
    borderRadius: 24,
    overflow: "hidden",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 8,
  },
  footprintBlur: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
  },
  footprintCard: {
    padding: 20,
    position: "relative",
  },
  recentBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#A78BFA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footprintHeader: {
    marginBottom: 12,
  },
  footprintTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  footprintName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  footprintDate: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },
  footprintStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  footprintStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footprintStatText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  footprintCoords: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 139, 250, 0.2)",
  },
  footprintCoordsText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
