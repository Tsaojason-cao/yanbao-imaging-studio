/**
 * yanbao AI 大师预设系统
 * 
 * 包含 1 个自带美颜 + 5 个世界顶级摄影师参数
 * 
 * 摄影师来源：
 * - Alan Schaller: 英国黑白街头摄影大师
 * - Luisa Dörr: 国家地理签约摄影师
 * - Liam Wong: 赛博朋克城市摄影师
 * - Minh T: 极简建筑摄影师
 * - Tasneem Alsultan: 中东人文摄影师
 */

export interface MasterPreset {
  id: string;
  name: string;
  photographer: string;
  description: string;
  beautyParams: {
    smooth: number;      // 磨皮 (0-100)
    slim: number;        // 瘦脸 (0-100)
    eye: number;         // 大眼 (0-100)
    bright: number;      // 亮眼 (0-100)
    teeth: number;       // 白牙 (0-100)
    nose: number;        // 隆鼻 (0-100)
    blush: number;       // 红润 (0-100)
  };
  filterParams: {
    contrast: number;     // 对比度 (-100 到 +100)
    saturation: number;   // 饱和度 (-100 到 +100)
    brightness: number;   // 亮度 (-100 到 +100)
    grain: number;        // 颗粒感 (0-100)
    temperature: number;  // 色温 (-100 到 +100, 负数偏冷，正数偏暖)
  };
  cameraParams: {
    iso: number;          // ISO 感光度
    shutter: string;      // 快门速度
    aperture: string;     // 光圈
    whiteBalance: string; // 白平衡
  };
  tags: string[];         // 标签（适用场景）
  difficulty: 'easy' | 'medium' | 'hard';  // 难度
}

/**
 * 预设 0: 自然原生美颜
 * 即使不调整滑块，也默认开启
 */
export const DEFAULT_BEAUTY_PRESET: MasterPreset = {
  id: 'preset_0_default',
  name: '自然原生',
  photographer: 'yanbao AI',
  description: '自然无痕：保留皮肤纹理（毛孔），仅淡化暗沉与痘印，拒绝「蛇精脸」',
  beautyParams: {
    smooth: 22,   // 磨皮 22% (18%-25% 区间)：保留皮肤纹理（毛孔），仅淡化暗沉与痘印
    slim: 12,     // 瘦脸 12%：针对下颌线进行微调，拒绝「蛇精脸」，保持原生骨相
    eye: 8,       // 大眼 8%：轻微提升神采，模拟广角镜头下的中心汇聚感
    bright: 15,   // 亮眼 15%：增加瞳孔高光，让眼神看起来更清澈
    teeth: 10,    // 白牙 10%：自然去黄，不产生假白感
    nose: 5,      // 隆鼻 5%：仅在山根处增加微弱阴影，提升五官立体度
    blush: 12,    // 红润 12%：提升肤色饱和度，模拟运动后的健康血色
  },
  filterParams: {
    contrast: 0,
    saturation: 0,
    brightness: 0,
    grain: 0,
    temperature: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: 'auto',
  },
  tags: ['日常', '自然', '通用'],
  difficulty: 'easy',
};

/**
 * 预设 1: 街头诗人 (Alan Schaller 风格)
 * 高对比黑白、强化光影边界、颗粒感 20%
 */
export const PRESET_ALAN_SCHALLER: MasterPreset = {
  id: 'preset_1_alan_schaller',
  name: '街头诗人',
  photographer: 'Alan Schaller',
  description: '高对比黑白、强化光影边界、颗粒感 20%，适合极致的黑白纪实',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 0,
    teeth: 0,
    nose: 0,
    blush: 0,
  },
  filterParams: {
    contrast: 60,        // 高对比度
    saturation: -100,    // 完全去饱和（黑白）
    brightness: -10,     // 略微降低亮度
    grain: 20,           // 颗粒感 20%
    temperature: 0,      // 中性色温
  },
  cameraParams: {
    iso: 400,
    shutter: '1/250',
    aperture: 'f/8',
    whiteBalance: '5500K',
  },
  tags: ['黑白', '街头', '纪实', '高对比'],
  difficulty: 'medium',
};

/**
 * 预设 2: 国家地理 (Luisa Dörr 风格)
 * 暖色调补偿、饱和度 +15%、自然光感增强
 */
export const PRESET_LUISA_DORR: MasterPreset = {
  id: 'preset_2_luisa_dorr',
  name: '国家地理',
  photographer: 'Luisa Dörr',
  description: '暖色调补偿、饱和度 +15%、自然光感增强，适合人像与壮丽自然',
  beautyParams: {
    smooth: 20,
    slim: 10,
    eye: 15,
    bright: 20,
    teeth: 15,
    nose: 5,
    blush: 15,
  },
  filterParams: {
    contrast: 10,        // 略微增强对比度
    saturation: 15,      // 饱和度 +15%
    brightness: 10,      // 略微提亮
    grain: 0,            // 无颗粒感
    temperature: 20,     // 暖色调补偿
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/4',
    whiteBalance: '6000K',
  },
  tags: ['人像', '自然', '暖色', '纪实'],
  difficulty: 'easy',
};

/**
 * 预设 3: 城市霓虹 (Liam Wong 风格)
 * 偏向青橙色调 (Teal & Orange)、暗部偏紫、高光偏蓝
 */
export const PRESET_LIAM_WONG: MasterPreset = {
  id: 'preset_3_liam_wong',
  name: '城市霓虹',
  photographer: 'Liam Wong',
  description: '偏向青橙色调 (Teal & Orange)、暗部偏紫、高光偏蓝，适合夜景',
  beautyParams: {
    smooth: 25,
    slim: 15,
    eye: 20,
    bright: 30,
    teeth: 20,
    nose: 10,
    blush: 10,
  },
  filterParams: {
    contrast: 30,        // 中等对比度
    saturation: 40,      // 高饱和度
    brightness: -15,     // 略微降低亮度（营造夜景氛围）
    grain: 10,           // 轻微颗粒感
    temperature: -20,    // 冷色调（偏青蓝）
  },
  cameraParams: {
    iso: 800,
    shutter: '1/60',
    aperture: 'f/1.8',
    whiteBalance: '4500K',
  },
  tags: ['夜景', '城市', '赛博朋克', '霓虹'],
  difficulty: 'medium',
};

/**
 * 预设 4: 静谧极简 (Minh T 风格)
 * 低饱和、高亮度、冷色调
 */
export const PRESET_MINH_T: MasterPreset = {
  id: 'preset_4_minh_t',
  name: '静谧极简',
  photographer: 'Minh T',
  description: '低饱和、高亮度、冷色调，适合建筑与极简构图',
  beautyParams: {
    smooth: 30,
    slim: 5,
    eye: 10,
    bright: 15,
    teeth: 10,
    nose: 0,
    blush: 0,
  },
  filterParams: {
    contrast: -10,       // 略微降低对比度
    saturation: -30,     // 低饱和度
    brightness: 20,      // 高亮度
    grain: 0,            // 无颗粒感
    temperature: -30,    // 冷色调
  },
  cameraParams: {
    iso: 100,
    shutter: '1/250',
    aperture: 'f/11',
    whiteBalance: '5000K',
  },
  tags: ['建筑', '极简', '冷色', '高调'],
  difficulty: 'easy',
};

/**
 * 预设 5: 温润情感 (Tasneem Alsultan 风格)
 * 柔光滤镜效果、肤色暖化、对比度调低
 */
export const PRESET_TASNEEM_ALSULTAN: MasterPreset = {
  id: 'preset_5_tasneem_alsultan',
  name: '温润情感',
  photographer: 'Tasneem Alsultan',
  description: '柔光滤镜效果、肤色暖化、对比度调低，适合温馨生活记录',
  beautyParams: {
    smooth: 35,
    slim: 8,
    eye: 12,
    bright: 18,
    teeth: 12,
    nose: 5,
    blush: 20,
  },
  filterParams: {
    contrast: -20,       // 降低对比度（柔光效果）
    saturation: 5,       // 略微增加饱和度
    brightness: 15,      // 提亮
    grain: 5,            // 轻微颗粒感
    temperature: 30,     // 暖色调（肤色暖化）
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '6500K',
  },
  tags: ['人像', '生活', '暖色', '柔光'],
  difficulty: 'easy',
};

/**
 * 所有大师预设列表
 */
export const MASTER_PRESETS: MasterPreset[] = [
  DEFAULT_BEAUTY_PRESET,
  PRESET_ALAN_SCHALLER,
  PRESET_LUISA_DORR,
  PRESET_LIAM_WONG,
  PRESET_MINH_T,
  PRESET_TASNEEM_ALSULTAN,
];

/**
 * 根据 ID 获取预设
 */
export function getPresetById(id: string): MasterPreset | undefined {
  return MASTER_PRESETS.find(preset => preset.id === id);
}

/**
 * 根据摄影师名字获取预设
 */
export function getPresetByPhotographer(photographer: string): MasterPreset | undefined {
  return MASTER_PRESETS.find(preset => preset.photographer === photographer);
}

/**
 * 根据标签筛选预设
 */
export function getPresetsByTag(tag: string): MasterPreset[] {
  return MASTER_PRESETS.filter(preset => preset.tags.includes(tag));
}

/**
 * 根据难度筛选预设
 */
export function getPresetsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): MasterPreset[] {
  return MASTER_PRESETS.filter(preset => preset.difficulty === difficulty);
}
