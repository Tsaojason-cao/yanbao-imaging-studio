/**
 * 相册屏幕 - Gallery Screen
 */

import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';

const GalleryScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>智能相册</Text>
      <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
        智能相册 - 本地数据库
      </Text>
    </View>
  );
};

const lightColors = {
  background: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#666666',
};

const darkColors = {
  background: '#1A1A2E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default GalleryScreen;
