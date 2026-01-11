import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <LinearGradient colors={['#000000', '#1a0b2e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>早安，雁宝</Text>
              <Text style={styles.subtitle}>今天也是元气满满的一天</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.wheelContainer}>
          <View style={styles.wheel}>
            <Link href="/(tabs)/camera" asChild>
              <TouchableOpacity style={styles.wheelItem}>
                <Ionicons name="camera" size={32} color="white" />
                <Text style={styles.wheelText}>AI 拍照</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(tabs)/edit" asChild>
              <TouchableOpacity style={[styles.wheelItem, { marginTop: 20 }]}>
                <Ionicons name="color-wand" size={32} color="white" />
                <Text style={styles.wheelText}>修图</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(tabs)/about" asChild>
              <TouchableOpacity style={[styles.wheelItem, { marginTop: 20 }]}>
                <Ionicons name="heart" size={32} color="white" />
                <Text style={styles.wheelText}>关于</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.features}>
          <Text style={styles.sectionTitle}>最近使用</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>一键美颜</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>人像精修</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.kuromi.purple,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.kuromi.gold,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 12,
  },
  wheelContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(160, 32, 240, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  wheelItem: {
    alignItems: 'center',
    padding: 10,
  },
  wheelText: {
    color: 'white',
    marginTop: 5,
    fontWeight: '600',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  featureCard: {
    flex: 1,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  featureTitle: {
    color: 'white',
    fontWeight: '600',
  },
});
