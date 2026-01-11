// 7维美颜参数系统
export interface BeautyParams {
  smoothing: number;      // 磨皮 (0-100)
  whitening: number;      // 美白 (0-100)
  faceSlim: number;       // 瘦脸 (0-100)
  eyeEnlarge: number;     // 大眼 (0-100)
  brightness: number;     // 亮度 (0-100)
  contrast: number;       // 对比度 (0-100)
  saturation: number;     // 饱和度 (0-100)
}

export const DEFAULT_BEAUTY_PARAMS: BeautyParams = {
  smoothing: 50,
  whitening: 30,
  faceSlim: 20,
  eyeEnlarge: 15,
  brightness: 50,
  contrast: 50,
  saturation: 50,
};

// 雁宝记忆预设
export interface BeautyPreset {
  id: string;
  name: string;
  params: BeautyParams;
  thumbnail?: string;
  createdAt: Date;
  isFavorite: boolean;
}

// 照片元数据
export interface Photo {
  id: string;
  uri: string;
  originalUri?: string;
  beautyParams: BeautyParams;
  presetId?: string;
  createdAt: Date;
  syncedToCloud: boolean;
}
