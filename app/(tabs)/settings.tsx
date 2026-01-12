import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { InfoRow } from "@/components/info-row";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import Constants from "expo-constants";

/**
 * Settings Screen - 设置页面和浪漫彩蛋
 * 
 * 包含：
 * - 应用设置和信息
 * - Supabase 云端配置
 * - 隐藏的浪漫彩蛋（点击 Logo 触发）
 * - 关于信息
 */
export default function SettingsScreen() {
  const colors = useColors();
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const logoScale = useSharedValue(1);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const appName = Constants.expoConfig?.name || "雁宝 AI 私人影像工作室";
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  const handleLogoPress = () => {
    // Logo 弹跳动画
    logoScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );

    setEasterEggCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5 && !showEasterEgg) {
        // 触发彩蛋
        setShowEasterEgg(true);
        triggerEasterEgg();
      }
      return newCount;
    });
  };

  const triggerEasterEgg = () => {
    // 爱心动画
    heartScale.value = withSpring(1);
    heartOpacity.value = withSpring(1);

    // 3 秒后淡出
    heartOpacity.value = withDelay(3000, withSpring(0));

    // 显示浪漫弹窗
    setTimeout(() => {
      Alert.alert(
        "💕 浪漫彩蛋 💕",
        "每一张照片，都是我们的美好回忆\n愿时光温柔，岁月静好\n\n— 致最特别的你",
        [{ text: "好的 ❤️", onPress: () => setShowEasterEgg(false) }]
      );
    }, 500);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12 pb-6">
          {/* Logo 和标题 */}
          <View className="items-center gap-4 mb-8">
            <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.8}>
              <Animated.View
                style={[
                  {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                  },
                  logoAnimatedStyle,
                ]}
              >
                <Text style={{ fontSize: 40 }}>✨</Text>
              </Animated.View>
            </TouchableOpacity>

            {/* 浪漫彩蛋爱心 */}
            {showEasterEgg && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 0,
                  },
                  heartAnimatedStyle,
                ]}
              >
                <Text style={{ fontSize: 60 }}>💕</Text>
              </Animated.View>
            )}

            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground">
                {appName}
              </Text>
              <Text className="text-sm text-muted">
                版本 {appVersion}
              </Text>
            </View>
          </View>

          {/* 应用信息 */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">应用信息</Text>

            <View className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-sm">
              <InfoRow label="应用名称" value={appName} />
              <InfoRow label="版本号" value={appVersion} />
              <InfoRow label="Expo SDK" value="54" />
              <InfoRow label="React Native" value="0.81" className="border-b-0" />
            </View>
          </View>

          {/* 云端服务 */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">云端服务</Text>

            <View className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-sm">
              <InfoRow label="Supabase" value="已连接" />
              <InfoRow label="云端备份" value="已启用" />
              <InfoRow label="已用空间" value="256 MB" className="border-b-0" />
            </View>
          </View>

          {/* 功能设置 */}
          <View className="gap-4 mb-6">
            <Text className="text-xl font-bold text-foreground">功能设置</Text>

            <TouchableOpacity className="bg-surface rounded-2xl p-5 border-2 border-border active:opacity-70 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground">
                    自动备份
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    拍摄后自动上传到云端
                  </Text>
                </View>
                <View className="w-10 h-10 bg-success/20 rounded-full items-center justify-center">
                  <IconSymbol name="chevron.right" size={20} color={colors.success} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface rounded-2xl p-5 border-2 border-border active:opacity-70 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground">
                    美颜默认值
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    设置默认美颜参数
                  </Text>
                </View>
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <IconSymbol name="chevron.right" size={20} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* 关于 */}
          <View className="bg-gradient-to-br from-gradient1/10 to-gradient2/10 rounded-2xl p-5 border-2 border-primary/20 shadow-sm mb-6">
            <Text className="text-lg font-bold text-foreground mb-3">
              关于
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              雁宝 AI 私人影像工作室是一款专为您打造的美颜相机应用。
              集成了先进的 AI 美颜技术和云端备份功能，
              让每一刻都闪耀光芒。
            </Text>
          </View>

          {/* 彩蛋提示 */}
          {easterEggCount > 0 && easterEggCount < 5 && (
            <View className="items-center">
              <Text className="text-xs text-muted">
                再点击 {5 - easterEggCount} 次 Logo 解锁彩蛋 ✨
              </Text>
            </View>
          )}

          {/* 底部装饰 */}
          <View className="items-center mt-8">
            <Text className="text-sm text-muted">
              Made with 💕 by Yanbao Team
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
