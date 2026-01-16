import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";

const { width } = Dimensions.get("window");

/**
 * Stats Screen - 数据统计与持久化
 * 
 * 功能：
 * - 用户拍摄频率统计
 * - 最常用的3位大师风格比例
 * - 摄影成长轨迹曲线
 * - 存储管理
 */
export default function StatsScreen() {
  // 模拟数据
  const stats = {
    totalEdits: 247,
    storageUsed: 8,
    storageTotal: 50,
    presetCount: 12,
    favoritePhotos: 38,
  };

  const weeklyData = [
    { day: "Mon", value: 15 },
    { day: "Tue", value: 22 },
    { day: "Wed", value: 18 },
    { day: "Thu", value: 28 },
    { day: "Fri", value: 24 },
    { day: "Sat", value: 35 },
    { day: "Sun", value: 31 },
  ];

  const topFeatures = [
    { name: "亮度调整", usage: 85, icon: "💡", color: "#8B5CF6" },
    { name: "饱和度", usage: 72, icon: "🎨", color: "#EC4899" },
    { name: "滤镜应用", usage: 68, icon: "📷", color: "#A78BFA" },
    { name: "裁剪", usage: 45, icon: "✂️", color: "#F472B6" },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <ScreenContainer className="bg-[#1a101f]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* 标题 */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>📊</Text>
            <Text style={styles.headerTitle}>数据统计与持久化</Text>
            <Text style={styles.kuromiDecor}>🐰</Text>
          </View>

          {/* 统计卡片网格 (2x2) */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <LinearGradient
                colors={["#8B5CF6", "#6D28D9"]}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>总编辑数</Text>
                <Text style={styles.statValue}>{stats.totalEdits}</Text>
                <Text style={styles.statUnit}>Edits</Text>
                <Text style={styles.statTrend}>📈</Text>
              </LinearGradient>

              <LinearGradient
                colors={["#EC4899", "#DB2777"]}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <IconSymbol name="internaldrive.fill" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>已用存储</Text>
                <Text style={styles.statValue}>{stats.storageUsed}/{stats.storageTotal} GB</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(stats.storageUsed / stats.storageTotal) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.statUnit}>{Math.round((stats.storageUsed / stats.storageTotal) * 100)}%</Text>
              </LinearGradient>
            </View>

            <View style={styles.statsRow}>
              <LinearGradient
                colors={["#8B5CF6", "#6D28D9"]}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <IconSymbol name="brain.head.profile" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>配方数量</Text>
                <Text style={styles.statValue}>{stats.presetCount}</Text>
                <Text style={styles.statIcon}>📱</Text>
              </LinearGradient>

              <LinearGradient
                colors={["#EC4899", "#DB2777"]}
                style={styles.statCard}
              >
                <View style={styles.statIconContainer}>
                  <IconSymbol name="star.fill" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>收藏照片</Text>
                <Text style={styles.statValue}>{stats.favoritePhotos}</Text>
                <Text style={styles.statIcon}>📸</Text>
              </LinearGradient>
            </View>
          </View>

          {/* 近七日编辑趋势图 */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <IconSymbol name="chart.xyaxis.line" size={20} color="#EC4899" />
              <Text style={styles.chartTitle}>近七日编辑趋势</Text>
            </View>

            <View style={styles.chart}>
              {weeklyData.map((item, index) => (
                <View key={item.day} style={styles.chartBar}>
                  <Text style={styles.chartValue}>{item.value}</Text>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={["#A78BFA", "#8B5CF6"]}
                      style={[
                        styles.bar,
                        { height: `${(item.value / maxValue) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartDay}>{item.day}</Text>
                </View>
              ))}
              
              {/* 库洛米装饰 */}
              <View style={styles.kuromiOnChart}>
                <Text style={styles.kuromiEmoji}>🐰</Text>
              </View>
            </View>
          </View>

          {/* 最常用功能 */}
          <View style={styles.featuresContainer}>
            <View style={styles.featuresHeader}>
              <IconSymbol name="gear" size={20} color="#EC4899" />
              <Text style={styles.featuresTitle}>最常用功能</Text>
            </View>

            {topFeatures.map((feature, index) => (
              <View key={feature.name} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureName}>{feature.name}</Text>
                <View style={styles.featureBarContainer}>
                  <LinearGradient
                    colors={[feature.color, "#EC4899"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.featureBar, { width: `${feature.usage}%` }]}
                  />
                </View>
                <Text style={styles.featureUsage}>{feature.usage}% usage</Text>
                <Text style={styles.kuromiSmall}>🐰</Text>
              </View>
            ))}
          </View>

          {/* 备份按钮 */}
          <LinearGradient
            colors={["#8B5CF6", "#6D28D9"]}
            style={styles.backupButton}
          >
            <IconSymbol name="icloud.and.arrow.up.fill" size={24} color="#FFFFFF" />
            <Text style={styles.backupText}>备份数据到云端</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  kuromiDecor: {
    fontSize: 24,
  },
  statsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
    position: "relative",
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
  },
  statTrend: {
    position: "absolute",
    top: 16,
    right: 16,
    fontSize: 20,
  },
  statIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
    fontSize: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  chartContainer: {
    backgroundColor: "rgba(42, 31, 63, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    position: "relative",
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  barContainer: {
    flex: 1,
    width: "70%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
  },
  chartDay: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
  kuromiOnChart: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  kuromiEmoji: {
    fontSize: 32,
  },
  featuresContainer: {
    backgroundColor: "rgba(42, 31, 63, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featuresHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureName: {
    fontSize: 14,
    color: "#FFFFFF",
    width: 80,
  },
  featureBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    overflow: "hidden",
  },
  featureBar: {
    height: "100%",
    borderRadius: 10,
  },
  featureUsage: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    width: 70,
    textAlign: "right",
  },
  kuromiSmall: {
    fontSize: 16,
  },
  backupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
  },
  backupText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
