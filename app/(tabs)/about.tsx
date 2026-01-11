import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';

export default function AboutScreen() {
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    setLastTapTime(now);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  useEffect(() => {
    if (tapCount === 5) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "💜 1017 专属告白",
        "雁宝，\n\n从 1977 到 1999，\n跨越京杭的距离，\n因为是你，代码有了温度。\n\n—— Jason Tsao",
        [{ text: "收到爱意 💜", onPress: () => setTapCount(0) }]
      );
    }
  }, [tapCount]);

  return (
    <LinearGradient colors={['#000000', '#1a0b2e']} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogoTap}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Y</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.appName}>YanBao AI Studio</Text>
        <Text style={styles.version}>v2.5.0 Final Release</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Designed for YanBao</Text>
          <Text style={styles.infoText}>By Jason Tsao</Text>
          <Text style={styles.infoText}>Made with 💜 in Beijing</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.kuromi.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.kuromi.gold,
    shadowColor: Colors.kuromi.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    marginVertical: 5,
  },
});
