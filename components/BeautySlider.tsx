import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/Colors';

interface BeautySliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const BeautySlider: React.FC<BeautySliderProps> = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
          if (Math.round(val) % 5 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        minimumTrackTintColor={Colors.kuromi.purple}
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor={Colors.kuromi.gold}
      />
      <Text style={styles.value}>{Math.round(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    color: 'white',
    width: 60,
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  value: {
    color: 'white',
    width: 30,
    textAlign: 'right',
    fontSize: 14,
  },
});
