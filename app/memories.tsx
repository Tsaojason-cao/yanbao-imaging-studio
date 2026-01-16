import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * Yanbao Memories - 雁宝记忆/点滴
 * 
 * 这是 App 的情感核心模块
 * 
 * 功能：
 * - 瀑布流/时间轴展示照片
 * - 自动标注拍摄时使用的大师影调
 * - 显示地理位置（机位推荐）
 * - 深情告白沉浸式阅读页面
 */
export default function MemoriesScreen() {
  const router = useRouter();

  // 模拟记忆数据
  const memories = [
    {
      id: 1,
      date: "2026-01-15",
      location: "北京·故宫",
      masterStyle: "肖全·人文纪实",
      photoCount: 12,
      highlight: true,
    },
    {
      id: 2,
      date: "2026-01-10",
      location: "上海·外滩",
      masterStyle: "Fan Ho·光影大师",
      photoCount: 8,
    },
    {
      id: 3,
      date: "2026-01-05",
      location: "杭州·西湖",
      masterStyle: "Ansel Adams·风光大师",
      photoCount: 15,
    },
    {
      id: 4,
      date: "2025-12-25",
      location: "成都·宽窄巷子",
      masterStyle: "Henri Cartier-Bresson·决定性瞬间",
      photoCount: 20,
      highlight: true,
    },
  ];

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="bg-[#1a101f]">
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.kuromiIcon}>💕</Text>
          <Text style={styles.headerTitle}>雁宝记忆</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* 深情告白卡片 */}
          <TouchableOpacity
            style={styles.loveLetterCard}
            activeOpacity={0.8}
            onPress={() => {
              // 触发深情告白全屏动效
            }}
          >
            <LinearGradient
              colors={["#8B5CF6", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loveLetterGradient}
            >
              <Text style={styles.loveLetterIcon}>💌</Text>
              <Text style={styles.loveLetterTitle}>深情告白</Text>
              <Text style={styles.loveLetterSubtitle}>
                点击阅读 Jason 写给你的情书
              </Text>
              <View style={styles.loveLetterDecor}>
                <Text style={styles.kuromiDecor}>🐰</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* 统计信息 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>247</Text>
              <Text style={styles.statLabel}>总照片数</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>31</Text>
              <Text style={styles.statLabel}>大师风格</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>拍摄地点</Text>
            </View>
          </View>

          {/* 时间轴记忆列表 */}
          <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>美好时光</Text>
            
            {memories.map((memory, index) => (
              <TouchableOpacity
                key={memory.id}
                style={styles.memoryCard}
                activeOpacity={0.8}
              >
                {memory.highlight && (
                  <View style={styles.highlightBadge}>
                    <IconSymbol name="star.fill" size={12} color="#FDE047" />
                  </View>
                )}
                
                <View style={styles.memoryLeft}>
                  <View style={styles.timelineDot} />
                  {index < memories.length - 1 && <View style={styles.timelineLine} />}
                </View>

                <LinearGradient
                  colors={["rgba(139, 92, 246, 0.1)", "rgba(236, 72, 153, 0.1)"]}
                  style={styles.memoryContent}
                >
                  <View style={styles.memoryHeader}>
                    <Text style={styles.memoryDate}>{memory.date}</Text>
                    <View style={styles.photoCountBadge}>
                      <IconSymbol name="photo.fill" size={12} color="#EC4899" />
                      <Text style={styles.photoCountText}>{memory.photoCount}</Text>
                    </View>
                  </View>

                  <View style={styles.memoryLocation}>
                    <IconSymbol name="location.fill" size={16} color="#A78BFA" />
                    <Text style={styles.memoryLocationText}>{memory.location}</Text>
                  </View>

                  <View style={styles.memoryMaster}>
                    <IconSymbol name="wand.and.stars" size={16} color="#EC4899" />
                    <Text style={styles.memoryMasterText}>{memory.masterStyle}</Text>
                  </View>

                  {/* 照片缩略图网格 */}
                  <View style={styles.photoGrid}>
                    {[1, 2, 3, 4].map((photo) => (
                      <View key={photo} style={styles.photoThumbnail}>
                        <IconSymbol name="photo" size={20} color="#666666" />
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* 底部装饰 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              每一张照片，都是我们的美好回忆 💕
            </Text>
            <Text style={styles.kuromiFooter}>🐰</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  kuromiIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loveLetterCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
  },
  loveLetterGradient: {
    padding: 32,
    alignItems: "center",
    position: "relative",
  },
  loveLetterIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loveLetterTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  loveLetterSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  loveLetterDecor: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  kuromiDecor: {
    fontSize: 32,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(42, 31, 63, 0.5)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EC4899",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  timelineContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  memoryCard: {
    flexDirection: "row",
    marginBottom: 16,
    position: "relative",
  },
  highlightBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  memoryLeft: {
    width: 40,
    alignItems: "center",
    paddingTop: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EC4899",
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(236, 72, 153, 0.3)",
  },
  memoryContent: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  memoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  memoryDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  photoCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(236, 72, 153, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EC4899",
  },
  memoryLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  memoryLocationText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
  memoryMaster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  memoryMasterText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  photoGrid: {
    flexDirection: "row",
    gap: 8,
  },
  photoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    textAlign: "center",
  },
  kuromiFooter: {
    fontSize: 32,
  },
});
