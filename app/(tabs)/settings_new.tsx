import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

/**
 * Settings Screen - 库洛米主题设置页面
 * 
 * 特色功能：
 * - 库洛米主题深度植入
 * - 点击 Logo 10次触发「深情告白」彩蛋
 * - 所有开关和进度条使用库洛米配色
 */
export default function SettingsScreen() {
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const logoScale = useSharedValue(1);
  const logoRotate = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const appName = Constants.expoConfig?.name || "雁宝 AI 私人影像工作室";
  const appVersion = Constants.expoConfig?.version || "2.4.2";

  const handleLogoPress = () => {
    // Logo 动画
    logoScale.value = withSequence(
      withSpring(0.8),
      withSpring(1.2),
      withSpring(1)
    );
    logoRotate.value = withSequence(
      withTiming(15, { duration: 100 }),
      withTiming(-15, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    setEasterEggCount((prev) => {
      const newCount = prev + 1;
      
      // 进度提示
      if (newCount === 5) {
        Alert.alert("💫", "继续点击，还有惊喜...", [{ text: "好的" }]);
      }
      
      // 达到10次触发彩蛋
      if (newCount >= 10 && !showEasterEgg) {
        setShowEasterEgg(true);
        triggerEasterEgg();
        return 0; // 重置计数
      }
      
      return newCount;
    });
  };

  const triggerEasterEgg = () => {
    // 爱心动画
    heartScale.value = withSpring(1.5);
    heartOpacity.value = withSpring(1);

    // 显示深情告白
    setTimeout(() => {
      Alert.alert(
        "💕 深情告白 💕",
        `亲爱的雁宝：

每一次快门，都是我对你的凝视
每一张照片，都是我们的美好回忆
这个应用，是我用代码写给你的情书

12维美颜，是因为你的美有无数个维度
31位大师，也不及你在我心中的独特
库洛米的紫与粉，是你最爱的颜色

愿时光温柔，岁月静好
愿这个小小的应用
能记录下我们所有的美好瞬间

— Jason Tsao 致最爱的你 ❤️`,
        [
          {
            text: "好感动 ❤️",
            onPress: () => {
              setShowEasterEgg(false);
              heartOpacity.value = withTiming(0, { duration: 1000 });
            },
          },
        ]
      );
    }, 500);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const settingsOptions = [
    { icon: "person.crop.circle", label: "账号设置", color: "#A78BFA" },
    { icon: "lock.shield", label: "隐私与安全", color: "#EC4899" },
    { icon: "bell.badge", label: "通知设置", color: "#F472B6" },
    { icon: "internaldrive", label: "存储管理", color: "#60A5FA" },
    { icon: "info.circle", label: "关于我们", color: "#8B5CF6" },
    { icon: "questionmark.circle", label: "帮助与反馈", color: "#A78BFA" },
  ];

  return (
    <ScreenContainer className="bg-[#1a101f]">
      {/* 全屏爱心动画 */}
      {showEasterEgg && (
        <Animated.View style={[styles.heartOverlay, heartAnimatedStyle]}>
          <Text style={styles.heartEmoji}>💕</Text>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* 个人资料区域 */}
          <View style={styles.profileSection}>
            <View style={styles.decorPattern} />
            
            <TouchableOpacity
              onPress={handleLogoPress}
              activeOpacity={0.8}
            >
              <Animated.View style={[styles.avatarContainer, logoAnimatedStyle]}>
                <LinearGradient
                  colors={["#8B5CF6", "#EC4899"]}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.kuromiAvatar}>🐰</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.userName}>Yanbao</Text>
            
            <TouchableOpacity style={styles.editProfileButton}>
              <LinearGradient
                colors={["#EC4899", "#F472B6"]}
                style={styles.editProfileGradient}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 设置选项列表 */}
          <View style={styles.settingsList}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                style={styles.settingItem}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIcon, { backgroundColor: option.color + "20" }]}>
                  <IconSymbol name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.settingLabel}>{option.label}</Text>
                <IconSymbol name="chevron.right" size={20} color="#666666" />
              </TouchableOpacity>
            ))}
          </View>

          {/* 登出按钮 */}
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* 底部签名 */}
          <View style={styles.footer}>
            <Text style={styles.appInfo}>
              {appName} v{appVersion}
            </Text>
            <Text style={styles.signature}>
              by Jason Tsao who loves you the most ❤️
            </Text>
            {easterEggCount > 0 && easterEggCount < 10 && (
              <Text style={styles.easterEggHint}>
                🐰 {easterEggCount}/10
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: "relative",
  },
  decorPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "rgba(139, 92, 246, 0.05)",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  kuromiAvatar: {
    fontSize: 60,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  editProfileButton: {
    marginTop: 8,
  },
  editProfileGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  settingsList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(139, 92, 246, 0.2)",
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  appInfo: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  signature: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },
  easterEggHint: {
    fontSize: 14,
    color: "#EC4899",
    marginTop: 8,
  },
  heartOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    pointerEvents: "none",
  },
  heartEmoji: {
    fontSize: 120,
  },
});
