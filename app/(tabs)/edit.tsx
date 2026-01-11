import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BeautySlider } from '../../components/BeautySlider';
import { Colors } from '../../constants/Colors';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export default function EditScreen() {
  const [beautyParams, setBeautyParams] = useState({
    smooth: 60,
    white: 40,
    light: 50,
    bone: 30,
    color: 45,
    sharp: 20,
    atmosphere: 70,
  });

  const updateParam = (key: keyof typeof beautyParams, value: number) => {
    setBeautyParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // 实际保存逻辑（模拟）
    console.log('Saved with params:', beautyParams);
  };

  return (
    <LinearGradient colors={['#000000', '#1a0b2e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>7维美颜矩阵</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>保存</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={60} color={Colors.kuromi.purple} />
            <Text style={styles.placeholderText}>选择照片开始修图</Text>
          </View>
        </View>

        <ScrollView style={styles.controlsContainer}>
          <BeautySlider label="磨皮" value={beautyParams.smooth} onValueChange={(v) => updateParam('smooth', v)} />
          <BeautySlider label="美白" value={beautyParams.white} onValueChange={(v) => updateParam('white', v)} />
          <BeautySlider label="光影" value={beautyParams.light} onValueChange={(v) => updateParam('light', v)} />
          <BeautySlider label="骨相" value={beautyParams.bone} onValueChange={(v) => updateParam('bone', v)} />
          <BeautySlider label="色彩" value={beautyParams.color} onValueChange={(v) => updateParam('color', v)} />
          <BeautySlider label="锐度" value={beautyParams.sharp} onValueChange={(v) => updateParam('sharp', v)} />
          <BeautySlider label="氛围" value={beautyParams.atmosphere} onValueChange={(v) => updateParam('atmosphere', v)} />
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.kuromi.purple,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewContainer: {
    height: 300,
    backgroundColor: '#111',
    margin: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.kuromi.purple,
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 10,
  },
  controlsContainer: {
    flex: 1,
  },
});
