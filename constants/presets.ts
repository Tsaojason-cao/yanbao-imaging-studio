/**
 * yanbao AI 全球大师预设系统 - Global Edition
 * 
 * 包含 1 个自带美颜 + 15 个中日韩顶级摄影师参数
 * 
 * 🇨🇳 中国摄影师（5位）:
 * - 肖全: 时代的记录者，极致黑白人像大师
 * - 孙郡: 新文人画摄影，素雅宁静的中国风
 * - 陈漫: 视觉艺术家，高饱和时尚摄影
 * - 蜷川实花: 极色彩风格，梦幻繁盛的花卉美学（活跃于中国）
 * - 罗洋: 女孩系列，自然胶片感的忧郁美学
 * 
 * 🇯🇵 日本摄影师（5位）:
 * - 杉本博司: 极致长曝与禅意，银盐相纸质感
 * - 蜷川实花: 浓烈饱和与梦幻（国际版）
 * - 滨田英明: 日系清透空气感，胶片呼吸感
 * - 森山大道: 粗颗粒黑白纪实，强调光影反差
 * - 川内伦子: 微观与淡雅光影，过曝清透感
 * 
 * 🇰🇷 韩国摄影师（5位）:
 * - 趙善熙: 韩流明星力量感，强调五官立体
 * - Mu-Gung: 少女梦幻与糖果色，粉色系美化
 * - Less (Kim Tae-gyun): 叛逆青春电影感，冷绿色调
 * - Hong Jang-hyun: 顶级 VOGUE 时尚风，极致美化
 * - Koo Bohn-chang: 白瓷般宁静极简，剔透感
 */

export type PresetRegion = 'CN' | 'JP' | 'KR' | 'DEFAULT';

export interface MasterPreset {
  id: string;
  name: string;
  photographer: string;
  region: PresetRegion;  // 地区标签
  description: string;
  beautyParams: {
    // 原有 7 维美颜引擎
    smooth: number;      // 磨皮 (0-100)
    slim: number;        // 瘦脸 (0-100)
    eye: number;         // 大眼 (0-100)
    bright: number;      // 亮眼 (0-100)
    teeth: number;       // 白牙 (0-100)
    nose: number;        // 隆鼻 (0-100)
    blush: number;       // 红润 (0-100)
    
    // v2.3.0 新增 5 维专业美学引擎
    sculpting3D: number;          // 骨相立体 (0-100)
    textureRetention: number;     // 原生膚質保护 (0-100)
    teethWhiteningPro: number;    // 牙齿美白增强版 (0-100)
    darkCircleRemoval: number;    // 黑眼圈淡化 (0-100)
    hairlineAdjustment: number;   // 发际线修饰 (0-100)
  };
  filterParams: {
    contrast: number;     // 对比度 (-100 到 +100)
    saturation: number;   // 饱和度 (-100 到 +100)
    brightness: number;   // 亮度 (-100 到 +100)
    grain: number;        // 颗粒感 (0-100)
    temperature: number;  // 色温 (-100 到 +100, 负数偏冷，正数偏暖)
    highlightSuppression: number;  // 高光抑制 (0-100)
    shadowCompensation: number;    // 阴影补偿 (0-100)
    vignette: number;     // 暗角 (0-100)
    hueShift: number;     // 色相偏移 (-100 到 +100, 负数偏青绿，正数偏洋红)
    sharpness: number;    // 锐度 (0-100)
    fade: number;         // 褪色 (0-100)
  };
  cameraParams: {
    iso: number;          // ISO 感光度
    shutter: string;      // 快门速度
    aperture: string;     // 光圈
    whiteBalance: string; // 白平衡
    exposureCompensation: string; // 曝光补偿
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
  region: 'DEFAULT',
  description: '自然无痕：保留皮肤纹理（毛孔），仅淡化暗沉与痘印，拒绝「蛇精脸」',
  beautyParams: {
    smooth: 22,   // 磨皮 22%
    slim: 12,     // 瘦脸 12%
    eye: 8,       // 大眼 8%
    bright: 15,   // 亮眼 15%
    teeth: 10,    // 白牙 10%
    nose: 5,      // 隆鼻 5%
    blush: 12,    // 红润 12%
    // v2.3.0 新增
    sculpting3D: 0,
    textureRetention: 30,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 0,
    saturation: 0,
    brightness: 0,
    grain: 0,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 0,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: 'auto',
    exposureCompensation: '0.0 EV',
  },
  tags: ['日常', '自然', '通用'],
  difficulty: 'easy',
};

// ============================================
// 🇨🇳 中国摄影师预设（5位）
// ============================================

/**
 * 预设 1: 时代的记录者 (肖全风格)
 */
export const PRESET_XIAO_QUAN: MasterPreset = {
  id: 'preset_cn_1_xiao_quan',
  name: '时代记录者',
  photographer: '肖全',
  region: 'CN',
  description: '极致黑白人像，强调眼神光和皮肤纹理，穿越时间的厚重感',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 20,
    teeth: 0,
    nose: 0,
    blush: 0,
  // v2.3.0 新增
  sculpting3D: 0,
  textureRetention: 100,
  teethWhiteningPro: 0,
  darkCircleRemoval: 0,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 25,
    saturation: -100,
    brightness: -15,
    grain: 15,
    temperature: 0,
    highlightSuppression: 10,
    shadowCompensation: 5,
    vignette: 15,
    hueShift: 0,
    sharpness: 10,
    fade: 0,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5500K',
    exposureCompensation: '-0.3 EV',
  },
  tags: ['黑白', '人像', '纪实', '经典'],
  difficulty: 'medium',
};

/**
 * 预设 2: 新文人画摄影 (孙郡风格)
 */
export const PRESET_SUN_JUN: MasterPreset = {
  id: 'preset_cn_2_sun_jun',
  name: '新文人画',
  photographer: '孙郡',
  region: 'CN',
  description: '浓郁中国风，画面如工笔画般素雅宁静，色彩饱和度极低',
  beautyParams: {
    smooth: 15,
    slim: 10,
    eye: 5,
    bright: 10,
    teeth: 5,
    nose: 0,
    blush: 15,
  // v2.3.0 新增
  sculpting3D: 10,
  textureRetention: 50,
  teethWhiteningPro: 5,
  darkCircleRemoval: 15,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 0,
    saturation: -35,
    brightness: 5,
    grain: 0,
    temperature: 10,
    highlightSuppression: 20,
    shadowCompensation: 15,
    vignette: 5,
    hueShift: 0,
    sharpness: 0,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/125',
    aperture: 'f/4',
    whiteBalance: '5800K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['中国风', '素雅', '文艺', '人像'],
  difficulty: 'easy',
};

/**
 * 预设 3: 视觉艺术家 (陈漫风格)
 */
export const PRESET_CHEN_MAN: MasterPreset = {
  id: 'preset_cn_3_chen_man',
  name: '视觉艺术家',
  photographer: '陈漫',
  region: 'CN',
  description: '色彩极其饱和、时尚感强烈、皮肤修饰完美、极具视觉冲击力',
  beautyParams: {
    smooth: 40,
    slim: 15,
    eye: 15,
    bright: 25,
    teeth: 20,
    nose: 10,
    blush: 15,
  // v2.3.0 新增
  sculpting3D: 45,
  textureRetention: 20,
  teethWhiteningPro: 30,
  darkCircleRemoval: 40,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 15,
    saturation: 20,
    brightness: 10,
    grain: 0,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 10,
    vignette: 10,
    hueShift: 5,
    sharpness: 15,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/2.8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['时尚', '高饱和', '人像', '视觉冲击'],
  difficulty: 'medium',
};

/**
 * 预设 4: 极色彩风格 (蜷川实花风格 - 中国版)
 */
export const PRESET_NINAGAWA_MIKA_CN: MasterPreset = {
  id: 'preset_cn_4_ninagawa_mika',
  name: '极色彩梦境',
  photographer: '蜷川实花',
  region: 'CN',
  description: '极其繁盛的色彩，梦幻且绚烂，通常伴随花卉元素',
  beautyParams: {
    smooth: 30,
    slim: 12,
    eye: 15,
    bright: 15,
    teeth: 15,
    nose: 5,
    blush: 20,
  // v2.3.0 新增
  sculpting3D: 25,
  textureRetention: 30,
  teethWhiteningPro: 20,
  darkCircleRemoval: 30,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 10,
    saturation: 45,
    brightness: 15,
    grain: 0,
    temperature: 5,
    highlightSuppression: 10,
    shadowCompensation: 15,
    vignette: 5,
    hueShift: 10,
    sharpness: 5,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5800K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['梦幻', '高饱和', '花卉', '绚烂'],
  difficulty: 'easy',
};

/**
 * 预设 5: 女孩系列 (罗洋风格)
 */
export const PRESET_LUO_YANG: MasterPreset = {
  id: 'preset_cn_5_luo_yang',
  name: '女孩',
  photographer: '罗洋',
  region: 'CN',
  description: '自然、略带忧郁、真实的胶片感，色调偏冷绿或偏淡',
  beautyParams: {
    smooth: 10,
    slim: 5,
    eye: 5,
    bright: 10,
    teeth: 5,
    nose: 0,
    blush: 8,
  // v2.3.0 新增
  sculpting3D: 0,
  textureRetention: 80,
  teethWhiteningPro: 5,
  darkCircleRemoval: 10,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -15,
    saturation: -20,
    brightness: 25,
    grain: 12,
    temperature: -25,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 8,
    hueShift: -10,
    sharpness: 0,
    fade: 5,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/125',
    aperture: 'f/2.0',
    whiteBalance: '5000K',
    exposureCompensation: '+0.5 EV',
  },
  tags: ['胶片', '冷调', '自然', '忧郁'],
  difficulty: 'easy',
};

// ============================================
// 🇯🇵 日本摄影师预设（5位）
// ============================================

/**
 * 预设 6: 极致长曝与禅意 (杉本博司风格)
 */
export const PRESET_SUGIMOTO_HIROSHI: MasterPreset = {
  id: 'preset_jp_1_sugimoto',
  name: '禅意长曝',
  photographer: '杉本博司',
  region: 'JP',
  description: '极致长曝与禅意，灰度滤镜，模拟银盐相纸质感',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 10,
    teeth: 0,
    nose: 0,
    blush: 0,
  // v2.3.0 新增
  sculpting3D: 0,
  textureRetention: 100,
  teethWhiteningPro: 0,
  darkCircleRemoval: 0,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -20,
    saturation: -80,
    brightness: 35,
    grain: 8,
    temperature: 0,
    highlightSuppression: 25,
    shadowCompensation: 30,
    vignette: 0,
    hueShift: 0,
    sharpness: 15,
    fade: 10,
  },
  cameraParams: {
    iso: 50,
    shutter: '30s',
    aperture: 'f/22',
    whiteBalance: '5500K',
    exposureCompensation: '+0.7 EV',
  },
  tags: ['黑白', '禅意', '极简', '长曝'],
  difficulty: 'hard',
};

/**
 * 预设 7: 浓烈饱和与梦幻 (蜷川实花风格 - 日本版)
 */
export const PRESET_NINAGAWA_MIKA_JP: MasterPreset = {
  id: 'preset_jp_2_ninagawa',
  name: '梦幻花卉',
  photographer: '蜷川実花',
  region: 'JP',
  description: '浓烈饱和与梦幻，强化亮眼与红润，背景虚化（Bokeh）',
  beautyParams: {
    smooth: 25,
    slim: 10,
    eye: 18,
    bright: 20,
    teeth: 15,
    nose: 5,
    blush: 25,
  // v2.3.0 新增
  sculpting3D: 30,
  textureRetention: 25,
  teethWhiteningPro: 25,
  darkCircleRemoval: 35,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 15,
    saturation: 40,
    brightness: 10,
    grain: 0,
    temperature: 5,
    highlightSuppression: 5,
    shadowCompensation: 10,
    vignette: 10,
    hueShift: 15,
    sharpness: 5,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/1.4',
    whiteBalance: '5800K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['梦幻', '高饱和', '花卉', '虚化'],
  difficulty: 'easy',
};

/**
 * 预设 8: 日系清透空气感 (滨田英明风格)
 */
export const PRESET_HAMADA_HIDEAKI: MasterPreset = {
  id: 'preset_jp_3_hamada',
  name: '清透空气感',
  photographer: '濱田英明',
  region: 'JP',
  description: '日系清透空气感，色温偏冷，曝光 +1.0，画面有胶片呼吸感',
  beautyParams: {
    smooth: 20,
    slim: 8,
    eye: 10,
    bright: 15,
    teeth: 10,
    nose: 0,
    blush: 12,
  // v2.3.0 新增
  sculpting3D: 15,
  textureRetention: 60,
  teethWhiteningPro: 15,
  darkCircleRemoval: 20,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -10,
    saturation: -15,
    brightness: 50,
    grain: 8,
    temperature: -15,
    highlightSuppression: 20,
    shadowCompensation: 25,
    vignette: 5,
    hueShift: -5,
    sharpness: 0,
    fade: 8,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5000K',
    exposureCompensation: '+1.0 EV',
  },
  tags: ['日系', '清透', '胶片', '空气感'],
  difficulty: 'easy',
};

/**
 * 预设 9: 粗颗粒黑白纪实 (森山大道风格)
 */
export const PRESET_MORIYAMA_DAIDO: MasterPreset = {
  id: 'preset_jp_4_moriyama',
  name: '街头纪实',
  photographer: '森山大道',
  region: 'JP',
  description: '粗颗粒黑白纪实，禁用美颜，强调面部光影反差',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 0,
    teeth: 0,
    nose: 0,
    blush: 0,
  // v2.3.0 新增
  sculpting3D: 0,
  textureRetention: 100,
  teethWhiteningPro: 0,
  darkCircleRemoval: 0,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 45,
    saturation: -100,
    brightness: -10,
    grain: 50,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 20,
    hueShift: 0,
    sharpness: 20,
    fade: 0,
  },
  cameraParams: {
    iso: 1600,
    shutter: '1/250',
    aperture: 'f/8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['黑白', '街头', '纪实', '粗颗粒'],
  difficulty: 'hard',
};

/**
 * 预设 10: 微观与淡雅光影 (川内伦子风格)
 */
export const PRESET_KAWAUCHI_RINKO: MasterPreset = {
  id: 'preset_jp_5_kawauchi',
  name: '淡雅微光',
  photographer: '川内倫子',
  region: 'JP',
  description: '微观与淡雅光影，曝光补偿 +1.3，画面边缘微弱失光',
  beautyParams: {
    smooth: 15,
    slim: 5,
    eye: 8,
    bright: 10,
    teeth: 5,
    nose: 0,
    blush: 8,
  // v2.3.0 新增
  sculpting3D: 5,
  textureRetention: 70,
  teethWhiteningPro: 10,
  darkCircleRemoval: 15,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -25,
    saturation: -15,
    brightness: 65,
    grain: 5,
    temperature: 10,
    highlightSuppression: 30,
    shadowCompensation: 35,
    vignette: 12,
    hueShift: 0,
    sharpness: 0,
    fade: 15,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/60',
    aperture: 'f/2.0',
    whiteBalance: '5800K',
    exposureCompensation: '+1.3 EV',
  },
  tags: ['淡雅', '过曝', '微观', '柔光'],
  difficulty: 'easy',
};

// ============================================
// 🇰🇷 韩国摄影师预设（5位）
// ============================================

/**
 * 预设 11: 韩流明星力量感 (趙善熙风格)
 */
export const PRESET_CHO_SUN_HEE: MasterPreset = {
  id: 'preset_kr_1_cho',
  name: '韩流明星',
  photographer: '趙善熙',
  region: 'KR',
  description: '韩流明星力量感，隆鼻 15%，瘦脸 12%，强调五官立体',
  beautyParams: {
    smooth: 30,
    slim: 12,
    eye: 15,
    bright: 20,
    teeth: 18,
    nose: 15,
    blush: 15,
  // v2.3.0 新增
  sculpting3D: 40,
  textureRetention: 25,
  teethWhiteningPro: 30,
  darkCircleRemoval: 45,
  hairlineAdjustment: 10,
  },
  filterParams: {
    contrast: 15,
    saturation: 5,
    brightness: 10,
    grain: 0,
    temperature: 15,
    highlightSuppression: 5,
    shadowCompensation: 10,
    vignette: 5,
    hueShift: 0,
    sharpness: 10,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/2.8',
    whiteBalance: '5800K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['韩流', '明星', '时尚', '立体'],
  difficulty: 'easy',
};

/**
 * 预设 12: 少女梦幻与糖果色 (Mu-Gung风格)
 */
export const PRESET_MU_GUNG: MasterPreset = {
  id: 'preset_kr_2_mugung',
  name: '少女梦境',
  photographer: 'Mu-Gung',
  region: 'KR',
  description: '少女梦幻与糖果色，磨皮 35%，红润 20%，亮眼 15%',
  beautyParams: {
    smooth: 35,
    slim: 10,
    eye: 15,
    bright: 15,
    teeth: 15,
    nose: 8,
    blush: 20,
  // v2.3.0 新增
  sculpting3D: 20,
  textureRetention: 20,
  teethWhiteningPro: 25,
  darkCircleRemoval: 50,
  hairlineAdjustment: 5,
  },
  filterParams: {
    contrast: 5,
    saturation: 15,
    brightness: 25,
    grain: 0,
    temperature: 10,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 5,
    hueShift: 10,
    sharpness: 0,
    fade: 5,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.0',
    whiteBalance: '5800K',
    exposureCompensation: '+0.5 EV',
  },
  tags: ['少女', '梦幻', '糖果色', '粉色'],
  difficulty: 'easy',
};

/**
 * 预设 13: 叛逆青春电影感 (Less/Kim Tae-gyun风格)
 */
export const PRESET_LESS: MasterPreset = {
  id: 'preset_kr_3_less',
  name: '青春电影',
  photographer: 'Less',
  region: 'KR',
  description: '叛逆青春电影感，冷绿色调，胶片模拟 (Portra 400)，褪色 10%',
  beautyParams: {
    smooth: 10,
    slim: 5,
    eye: 8,
    bright: 12,
    teeth: 8,
    nose: 0,
    blush: 5,
  // v2.3.0 新增
  sculpting3D: 10,
  textureRetention: 70,
  teethWhiteningPro: 10,
  darkCircleRemoval: 15,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 10,
    saturation: -10,
    brightness: 5,
    grain: 15,
    temperature: -20,
    highlightSuppression: 10,
    shadowCompensation: 15,
    vignette: 10,
    hueShift: -15,
    sharpness: 5,
    fade: 10,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5000K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['电影', '青春', '冷调', '胶片'],
  difficulty: 'medium',
};

/**
 * 预设 14: 顶级 VOGUE 时尚风 (Hong Jang-hyun风格)
 */
export const PRESET_HONG_JANG_HYUN: MasterPreset = {
  id: 'preset_kr_4_hong',
  name: 'VOGUE 时尚',
  photographer: 'Hong Jang-hyun',
  region: 'KR',
  description: '顶级 VOGUE 时尚风，极致磨皮 40%，亮眼 20%，瘦脸 10%',
  beautyParams: {
    smooth: 40,
    slim: 10,
    eye: 18,
    bright: 20,
    teeth: 20,
    nose: 12,
    blush: 15,
  // v2.3.0 新增
  sculpting3D: 50,
  textureRetention: 15,
  teethWhiteningPro: 35,
  darkCircleRemoval: 50,
  hairlineAdjustment: 15,
  },
  filterParams: {
    contrast: 20,
    saturation: 10,
    brightness: 15,
    grain: 0,
    temperature: 5,
    highlightSuppression: 10,
    shadowCompensation: 20,
    vignette: 8,
    hueShift: 0,
    sharpness: 15,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/200',
    aperture: 'f/2.8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['时尚', 'VOGUE', '高端', '精致'],
  difficulty: 'medium',
};

/**
 * 预设 15: 白瓷般宁静极简 (Koo Bohn-chang风格)
 */
export const PRESET_KOO_BOHN_CHANG: MasterPreset = {
  id: 'preset_kr_5_koo',
  name: '白瓷极简',
  photographer: 'Koo Bohn-chang',
  region: 'KR',
  description: '白瓷般宁静极简，亮白皮肤 25%，打造剔透感',
  beautyParams: {
    smooth: 25,
    slim: 5,
    eye: 10,
    bright: 18,
    teeth: 15,
    nose: 0,
    blush: 8,
  // v2.3.0 新增
  sculpting3D: 5,
  textureRetention: 40,
  teethWhiteningPro: 20,
  darkCircleRemoval: 25,
  hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -30,
    saturation: -40,
    brightness: 75,
    grain: 0,
    temperature: 5,
    highlightSuppression: 35,
    shadowCompensation: 40,
    vignette: 0,
    hueShift: 0,
    sharpness: 10,
    fade: 20,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/125',
    aperture: 'f/11',
    whiteBalance: '5800K',
    exposureCompensation: '+1.5 EV',
  },
  tags: ['极简', '白瓷', '宁静', '高调'],
  difficulty: 'easy',
};

// ============================================
// 所有大师预设列表（16组）
// ============================================

export const MASTER_PRESETS: MasterPreset[] = [
  DEFAULT_BEAUTY_PRESET,
  // 🇨🇳 中国（5位）
  PRESET_XIAO_QUAN,
  PRESET_SUN_JUN,
  PRESET_CHEN_MAN,
  PRESET_NINAGAWA_MIKA_CN,
  PRESET_LUO_YANG,
  // 🇯🇵 日本（5位）
  PRESET_SUGIMOTO_HIROSHI,
  PRESET_NINAGAWA_MIKA_JP,
  PRESET_HAMADA_HIDEAKI,
  PRESET_MORIYAMA_DAIDO,
  PRESET_KAWAUCHI_RINKO,
  // 🇰🇷 韩国（5位）
  PRESET_CHO_SUN_HEE,
  PRESET_MU_GUNG,
  PRESET_LESS,
  PRESET_HONG_JANG_HYUN,
  PRESET_KOO_BOHN_CHANG,
];

/**
 * 根据地区筛选预设
 */
export function getPresetsByRegion(region: PresetRegion): MasterPreset[] {
  return MASTER_PRESETS.filter(preset => preset.region === region);
}

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

/**
 * 获取地区标签的显示名称
 */
export function getRegionDisplayName(region: PresetRegion): string {
  const names: Record<PresetRegion, string> = {
    'DEFAULT': '默认',
    'CN': '🇨🇳 中国',
    'JP': '🇯🇵 日本',
    'KR': '🇰🇷 韩国',
  };
  return names[region] || region;
}
