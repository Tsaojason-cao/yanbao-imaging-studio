import { View, Text, Image, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo 淡入
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 核心引言延迟淡入
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(quoteAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-[#1a101f] items-center justify-center px-8">
      {/* Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}
      >
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* 核心引言 */}
      <Animated.View
        style={{
          opacity: quoteAnim,
          transform: [
            {
              translateY: quoteAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
        className="mt-12"
      >
        <LinearGradient
          colors={["#a155e7", "#e04f8f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-xl px-6 py-4"
          style={{
            shadowColor: "#a155e7",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text className="text-white text-center text-lg font-medium leading-relaxed">
            遇见，是所有美好的开始
          </Text>
          <Text className="text-white/80 text-center text-sm mt-2">
            yanbao AI，因爱而生的守护
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* 署名 */}
      <Animated.View
        style={{ opacity: quoteAnim }}
        className="absolute bottom-12"
      >
        <Text className="text-white/40 text-xs italic">
          by Jason Tsao who loves you the most
        </Text>
      </Animated.View>
    </View>
  );
}
