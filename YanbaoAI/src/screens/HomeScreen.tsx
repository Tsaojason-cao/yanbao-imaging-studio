/**
 * 首页屏幕 - Home Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

const HomeScreen = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  const features = [
    {id: 1, title: '美颜相机', subtitle: 'ProCam Beauty', icon: '📷', screen: '相机'},
    {id: 2, title: '照片编辑', subtitle: 'Photo Editor', icon: '🎨', screen: '编辑'},
    {id: 3, title: '智能相册', subtitle: 'Smart Gallery', icon: '🖼️', screen: '相册'},
    {id: 4, title: '地点推荐', subtitle: 'Location Spots', icon: '📍', screen: '地图'},
    {id: 5, title: '数据统计', subtitle: 'Statistics', icon: '📊', screen: '首页'},
    {id: 6, title: '设置', subtitle: 'Settings', icon: '⚙️', screen: '首页'},
  ];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.content}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>yanbao AI</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          智能摄影助手
        </Text>
      </View>

      {/* 功能网格 */}
      <View style={styles.grid}>
        {features.map(feature => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.card, {backgroundColor: colors.surface}]}
            onPress={() => navigation.navigate(feature.screen)}>
            <Text style={styles.icon}>{feature.icon}</Text>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              {feature.title}
            </Text>
            <Text style={[styles.cardSubtitle, {color: colors.textSecondary}]}>
              {feature.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, {color: colors.textSecondary}]}>
          Powered by Leica Minimalist Design
        </Text>
        <Text style={[styles.footerText, {color: colors.textSecondary}]}>
          v1.0.0 | React Native + 原生模块
        </Text>
      </View>
    </ScrollView>
  );
};

const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A2E',
  textSecondary: '#666666',
};

const darkColors = {
  background: '#1A1A2E',
  surface: '#16213E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default HomeScreen;
