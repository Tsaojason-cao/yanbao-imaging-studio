import * as Location from 'expo-location';

export interface WatermarkConfig {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  fontSize: number;
  color: string;
  opacity: number;
}

export class WatermarkService {
  private static instance: WatermarkService;

  private constructor() {}

  static getInstance(): WatermarkService {
    if (!WatermarkService.instance) {
      WatermarkService.instance = new WatermarkService();
    }
    return WatermarkService.instance;
  }

  async generateLocationWatermark(): Promise<WatermarkConfig> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return this.getDefaultWatermark();
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = address.city || address.region || 'Unknown';
      const watermarkText = `Designed for YanBao @ ${city}`;

      return {
        text: watermarkText,
        position: 'bottom-right',
        fontSize: 14,
        color: '#E879F9',
        opacity: 0.8,
      };
    } catch (error) {
      console.error('[Watermark] Error generating location watermark:', error);
      return this.getDefaultWatermark();
    }
  }

  private getDefaultWatermark(): WatermarkConfig {
    return {
      text: 'Designed for YanBao',
      position: 'bottom-right',
      fontSize: 14,
      color: '#E879F9',
      opacity: 0.8,
    };
  }

  generateCustomWatermark(text: string): WatermarkConfig {
    return {
      text,
      position: 'bottom-right',
      fontSize: 14,
      color: '#E879F9',
      opacity: 0.8,
    };
  }
}
