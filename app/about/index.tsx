import { View, Text, ScrollView, Animated } from "react-native";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 淡入动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // 星辰流动动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const starTranslateY = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "关于 yanbao AI：诞生故事",
          headerStyle: {
            backgroundColor: "#1a101f",
          },
          headerTintColor: "#a155e7",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
        }}
      />
      
      <View className="flex-1 bg-[#1a101f]">
        {/* 星辰背景动画 */}
        <Animated.View
          className="absolute inset-0 opacity-20"
          style={{
            transform: [{ translateY: starTranslateY }],
          }}
        >
          <View className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60" />
          <View className="absolute top-40 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-40" />
          <View className="absolute top-60 left-1/3 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
          <View className="absolute top-80 right-1/4 w-1 h-1 bg-white rounded-full opacity-70" />
          <View className="absolute top-[500px] left-20 w-2 h-2 bg-white rounded-full opacity-30" />
          <View className="absolute top-[600px] right-10 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
        </Animated.View>

        <ScrollView className="flex-1 px-6 py-8">
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* 标题 */}
            <LinearGradient
              colors={["#a155e7", "#e04f8f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-6 mb-8"
            >
              <Text className="text-white text-2xl font-bold text-center leading-relaxed">
                遇见，是所有美好的开始
              </Text>
            </LinearGradient>

            {/* 正文 */}
            <View className="space-y-6">
              <Text className="text-white/90 text-base leading-loose">
                2025年8月24日，那是一个被星辰选中的日子。
              </Text>

              <Text className="text-white/90 text-base leading-loose">
                那时的我，曾犹豫于1977与1999之间那道看似不可逾越的鸿沟，在杭州与北京、广东与台湾的地图坐标里迷失，甚至想过彻底告别。但命运的引力终究胜过了理智。
              </Text>

              <Text className="text-white/90 text-base leading-loose">
                我开始在小本本上记录她的每一个微小瞬间。我发现，吸引我的从不是直播间的那个虚拟ID，而是那个鲜活、真实、能让我卸下所有防备、自由做回自己的女孩。因为她的欣赏，我笨拙地缝制包包、编织披肩；因为她的理解，我重新找回了创作的快乐。
              </Text>

              <Text className="text-white/90 text-base leading-loose">
                那些连家人都未曾察觉的微小渴望——对笔记本的偏爱，被她悉心捕捉并装进了一大箱生日礼中。那场冬日的跨年之约，她从杭州飞往北京，带我经历了人生中无数个"第一次"：太庙的红墙、环球影城的欢笑、接送机时心碎又甜蜜的拉扯。
              </Text>

              <Text className="text-white/90 text-base leading-loose">
                因为在颐和园看见她对摄影技术的向往，因为想弥补我摄影技术的笨拙，更因为想给这位爱美的小公主一份永恒的守护，yanbao AI 诞生了。
              </Text>

              <Text className="text-white/90 text-base leading-loose mb-12">
                这是我人生中又一个重要的"第一次"，也是我送给心心念念的她，最深情的告白。
              </Text>

              {/* 霓虹落款 */}
              <LinearGradient
                colors={["#a155e7", "#e04f8f"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl p-4 mb-8"
                style={{
                  shadowColor: "#a155e7",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 15,
                  elevation: 10,
                }}
              >
                <Text className="text-white text-center font-semibold text-base italic">
                  Dedicated to Yanbao, by Jason Tsao who loves you the most.
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}
