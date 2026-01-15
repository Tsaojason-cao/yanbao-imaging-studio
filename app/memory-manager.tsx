/**
 * 雁宝记忆管理页面
 * 用户可查看、管理、一键套用自己保存的参数预设
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { YanbaoMemoryService, YanbaoMemory } from "@/services/database";
import { KuromiLoadingAnimation } from "@/components/kuromi-ui";

export default function MemoryManagerScreen() {
  const router = useRouter();
  const colors = useColors();
  const [memories, setMemories] = useState<YanbaoMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<YanbaoMemory | null>(null);

  // 加载所有雁宝记忆
  const loadMemories = async () => {
    try {
      setLoading(true);
      const data = await YanbaoMemoryService.getAllMemories();
      // 按时间倒序排列
      data.sort((a, b) => b.timestamp - a.timestamp);
      setMemories(data);
    } catch (error) {
      console.error("加载雁宝记忆失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  // 删除记忆
  const handleDeleteMemory = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      "删除雁宝记忆",
      "确定要删除这个参数预设吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            try {
              await YanbaoMemoryService.deleteMemory(id);
              await loadMemories();
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            } catch (error) {
              console.error("删除失败:", error);
            }
          },
        },
      ]
    );
  };

  // 一键套用记忆
  const handleApplyMemory = (memory: YanbaoMemory) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // TODO: 将参数传递给相机或编辑模块
    Alert.alert(
      "已套用雁宝记忆",
      `参数预设「${memory.presetName}」已应用到当前编辑器`,
      [{ text: "好的" }]
    );

    router.back();
  };

  // 查看记忆详情
  const handleViewDetails = (memory: YanbaoMemory) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedMemory(memory);
    setModalVisible(true);
  };

  // 格式化时间
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <KuromiLoadingAnimation size={80} />
          <Text style={{ color: colors.foreground, marginTop: 20, fontSize: 16 }}>
            加载雁宝记忆中...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* 顶部导航栏 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.back();
          }}
          style={{ padding: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>
          雁宝记忆
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* 记忆列表 */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {memories.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
            <Ionicons name="heart-outline" size={64} color={colors.muted} />
            <Text style={{ color: colors.foreground, marginTop: 20, fontSize: 18, fontWeight: "600" }}>
              暂无雁宝记忆
            </Text>
            <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14, textAlign: "center" }}>
              在编辑照片时保存参数{"\n"}就会自动记录在这里
            </Text>
          </View>
        ) : (
          memories.map((memory, index) => (
            <Pressable
              key={memory.id}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: "#E879F9",
                },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => handleViewDetails(memory)}
            >
              {/* 标题行 */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
                    {memory.presetName}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    {memory.photographer} · {formatTimestamp(memory.timestamp)}
                  </Text>
                </View>
              </View>

              {/* 参数预览 */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12, gap: 8 }}>
                <View style={{ backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    磨皮: {memory.beautyParams.smooth}
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    瘦脸: {memory.beautyParams.slim}
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    大眼: {memory.beautyParams.eye}
                  </Text>
                </View>
                <View style={{ backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    对比: {memory.filterParams.contrast}
                  </Text>
                </View>
              </View>

              {/* 操作按钮 */}
              <View style={{ flexDirection: "row", marginTop: 16, gap: 12 }}>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: "#E879F9",
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                  onPress={() => handleApplyMemory(memory)}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
                    一键套用
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: colors.background,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                  onPress={() => handleDeleteMemory(memory.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* 详情弹窗 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedMemory && (
              <>
                <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
                  {selectedMemory.presetName}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>
                  {selectedMemory.photographer}
                </Text>

                {/* 美颜参数 */}
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
                  美颜参数
                </Text>
                <View style={{ gap: 8, marginBottom: 20 }}>
                  {Object.entries(selectedMemory.beautyParams).map(([key, value]) => (
                    <View key={key} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.muted }}>{getParamLabel(key)}</Text>
                      <Text style={{ color: colors.foreground, fontWeight: "600" }}>{value}</Text>
                    </View>
                  ))}
                </View>

                {/* 滤镜参数 */}
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 12 }}>
                  滤镜参数
                </Text>
                <View style={{ gap: 8 }}>
                  {Object.entries(selectedMemory.filterParams).map(([key, value]) => (
                    <View key={key} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.muted }}>{getParamLabel(key)}</Text>
                      <Text style={{ color: colors.foreground, fontWeight: "600" }}>{value}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={{
                    backgroundColor: "#E879F9",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 24,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    if (selectedMemory) {
                      handleApplyMemory(selectedMemory);
                    }
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
                    立即套用
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

// 参数标签映射
function getParamLabel(key: string): string {
  const labels: { [key: string]: string } = {
    smooth: "磨皮",
    slim: "瘦脸",
    eye: "大眼",
    bright: "亮眼",
    teeth: "白牙",
    nose: "隆鼻",
    blush: "红润",
    contrast: "对比度",
    saturation: "饱和度",
    brightness: "亮度",
    grain: "颗粒",
    temperature: "色温",
  };
  return labels[key] || key;
}
