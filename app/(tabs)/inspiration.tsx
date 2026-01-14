import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import {
  getInspirationContent,
  searchInspirationContent,
} from "@/lib/inspiration-service";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 左右各16px padding，中间16px gap

type ContentCategory = "all" | "spots" | "poses" | "styles";

interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  location?: string;
  category: ContentCategory;
  views?: number;
  author?: string;
}

export default function InspirationScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 模拟数据（后续会从API获取）
  const mockData: InspirationItem[] = [
    {
      id: "1",
      title: "西湖断桥·白娘子同款",
      imageUrl: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400",
      location: "杭州·西湖",
      category: "spots",
      views: 1234,
      author: "小红书用户",
    },
    {
      id: "2",
      title: "复古港风拍照姿势",
      imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      location: "通用",
      category: "poses",
      views: 5678,
      author: "抖音用户",
    },
    {
      id: "3",
      title: "日系清新穿搭妆造",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      location: "通用",
      category: "styles",
      views: 3456,
      author: "小红书用户",
    },
    {
      id: "4",
      title: "北京故宫·红墙机位",
      imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400",
      location: "北京·故宫",
      category: "spots",
      views: 9012,
      author: "小红书用户",
    },
  ];

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    // 搜索防抖
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        loadContent();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const results = await getInspirationContent(selectedCategory);
      setItems(results as InspirationItem[]);
    } catch (error) {
      console.error("加载内容失败:", error);
      // 失败时使用模拟数据
      const filtered =
        selectedCategory === "all"
          ? mockData
          : mockData.filter((item) => item.category === selectedCategory);
      setItems(filtered);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadContent();
      return;
    }
    setLoading(true);
    try {
      const results = await searchInspirationContent(searchQuery);
      setItems(results as InspirationItem[]);
    } catch (error) {
      console.error("搜索失败:", error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  const handleCategoryChange = (category: ContentCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleItemPress = (item: InspirationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // 跳转到详情页
    router.push({
      pathname: "/inspiration-detail",
      params: { id: item.id },
    });
  };

  const renderCategoryTab = (category: ContentCategory, label: string) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        onPress={() => handleCategoryChange(category)}
        style={[styles.categoryTab, isSelected && styles.categoryTabActive]}
      >
        <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = (item: InspirationItem, index: number) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { marginRight: index % 2 === 0 ? 16 : 0 }]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.location && (
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={12} color="#E879F9" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.authorText}>{item.author}</Text>
            <View style={styles.viewsRow}>
              <IconSymbol name="eye.fill" size={12} color="#9CA3AF" />
              <Text style={styles.viewsText}>{item.views}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>灵感推荐</Text>
        <Text style={styles.headerSubtitle}>发现拍照的无限可能</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索地点、风格、姿势..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {renderCategoryTab("all", "全部")}
        {renderCategoryTab("spots", "机位")}
        {renderCategoryTab("poses", "姿势")}
        {renderCategoryTab("styles", "风格")}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E879F9" />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((item, index) => renderItem(item, index))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  categoryTabActive: {
    backgroundColor: "#E879F9",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 1.2,
    backgroundColor: "#E5E7EB",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#E879F9",
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#9CA3AF",
  },
});
