/**
 * yanbao AI 全球大师预设系统 - Global Edition v2.4.0
 * 
 * 包含 1 个自带美颜 + 30 个全球顶级摄影师参数
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
 * 
 * 🇺🇸 美国摄影师（5位）:
 * - Annie Leibovitz: 史诗肖像，戏剧性光影
 * - Richard Avedon: 纯白背景极简肖像
 * - Irving Penn: 极简静物美学，冷调精致
 * - Diane Arbus: 边缘人物纪实，粗粝黑白
 * - Cindy Sherman: 自拍艺术，戏剧性色彩
 * 
 * 🇹🇼 台湾摄影师（5位）:
 * - 林海音: 柔和自然，肤色纯净
 * - 阮义忠: 人文纪实，黑白强对比
 * - 张照堂: 超现实黑白，实验性影像
 * - 郭英声: 台湾风土，温暖纪实
 * - 何经泰: 台湾街头，胶片感纪实
 * 
 * 🇬🇧 英国摄影师（5位）:
 * - David Bailey: 摇摆伦敦，时尚黑白
 * - Nick Knight: 数字艺术先锋，实验性色彩
 * - Tim Walker: 梦幻叙事，童话感柔和
 * - Rankin: 现代肖像，干净锐利
 * - Nadav Kander: 极简肖像，冷调低饱和
 */

export type PresetRegion = 'CN' | 'JP' | 'KR' | 'US' | 'TW' | 'UK' | 'DEFAULT';

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

/**
 * 预设 0.5：雁宝经典（Yanbao Classic）
 * 原生模块设计，看起来像原相机直出，但细节已经过滤
 */
export const PRESET_YANBAO_CLASSIC: MasterPreset = {
  id: 'preset_0_5_yanbao_classic',
  name: '雁宝经典',
  photographer: 'yanbao AI',
  region: 'DEFAULT',
  description: '原生相机质感，保留皮肤纹理（毛孔），仅淡化暗沉与痘印，微调下颌线，提升神采',
  beautyParams: {
    smooth: 22,   // 磨皮 22% - 保留皮肤纹理（毛孔），仅淡化暗沉与痘印
    slim: 12,     // 瘦脸 12% - 针对下颌线进行微调，拒绝「蛇精脸」，保持原生骨相
    eye: 8,       // 大眼 8% - 轻微提升神采，模拟广角镜头下的中心汇聚感
    bright: 15,   // 亮眼 15% - 增加瞳孔高光，让眼神看起来更清澈
    teeth: 10,    // 白牙 10% - 自然去黄，不产生假白感
    nose: 5,      // 隆鼻 5% - 仅在山根处增加微弱阴影，提升五官立体度
    blush: 12,    // 红润 12% - 提升肤色饱和度，模拟运动后的健康血色
    // v2.3.0 新增 5 维
    sculpting3D: 0,
    textureRetention: 30,  // 30% 纹理保留，确保皮肤真实感
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
  tags: ['日常', '自然', '通用', '经典', '原生'],
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
    grayscale: 1.0,  // 启用黑白模式
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
  PRESET_YANBAO_CLASSIC,  // 雁宝经典
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
 * 史诗肖像 (Annie Leibovitz风格)
 */
export const PRESET_US_1_ANNIE: MasterPreset = {
  id: 'preset_us_1_annie',
  name: '史诗肖像',
  photographer: 'Annie Leibovitz',
  region: 'US',
  description: '史诗感、冷暖对比、油画质感',
  beautyParams: {
    smooth: 20,
    slim: 8,
    eye: 10,
    bright: 25,
    teeth: 15,
    nose: 5,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 40,
    textureRetention: 60,
    teethWhiteningPro: 20,
    darkCircleRemoval: 30,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 30,
    saturation: 0,
    brightness: 0,
    grain: 5,
    temperature: -15,
    highlightSuppression: 20,
    shadowCompensation: 20,
    vignette: 10,
    hueShift: 5,
    sharpness: 15,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5200K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['史诗', '戏剧性', '肖像', '冷暖对比'],
  difficulty: 'medium',
};

/**
 * 人文细节 (Steve McCurry风格)
 */
export const PRESET_US_2_STEVE: MasterPreset = {
  id: 'preset_us_2_steve',
  name: '人文细节',
  photographer: 'Steve McCurry',
  region: 'US',
  description: '浓郁饱和、人文细节、高宽容度',
  beautyParams: {
    smooth: 10,
    slim: 0,
    eye: 5,
    bright: 15,
    teeth: 5,
    nose: 0,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 15,
    textureRetention: 50,
    teethWhiteningPro: 10,
    darkCircleRemoval: 15,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 20,
    saturation: 40,
    brightness: 5,
    grain: 8,
    temperature: 10,
    highlightSuppression: 30,
    shadowCompensation: 30,
    vignette: 5,
    hueShift: 0,
    sharpness: 10,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/250',
    aperture: 'f/5.6',
    whiteBalance: '5600K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['人文', '饱和', '细节', '纪实'],
  difficulty: 'easy',
};

/**
 * 极简白背 (Richard Avedon风格)
 */
export const PRESET_US_3_RICHARD: MasterPreset = {
  id: 'preset_us_3_richard',
  name: '极简白背',
  photographer: 'Richard Avedon',
  region: 'US',
  description: '极简白背、高锐度、硬核黑白',
  beautyParams: {
    smooth: 15,
    slim: 5,
    eye: 8,
    bright: 20,
    teeth: 10,
    nose: 0,
    blush: 5,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 25,
    textureRetention: 70,
    teethWhiteningPro: 15,
    darkCircleRemoval: 20,
    hairlineAdjustment: 20,
  },
  filterParams: {
    contrast: 60,
    saturation: -100,
    brightness: 40,
    grain: 0,
    temperature: 0,
    highlightSuppression: 50,
    shadowCompensation: 10,
    vignette: 0,
    hueShift: 0,
    sharpness: 40,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/160',
    aperture: 'f/8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['极简', '纯白', '肖像', '锐利'],
  difficulty: 'easy',
};

/**
 * 生活胶片 (Nan Goldin风格)
 */
export const PRESET_US_4_NAN: MasterPreset = {
  id: 'preset_us_4_nan',
  name: '生活胶片',
  photographer: 'Nan Goldin',
  region: 'US',
  description: '胶片暗角、生活化、低明度',
  beautyParams: {
    smooth: 5,
    slim: 0,
    eye: 5,
    bright: 10,
    teeth: 5,
    nose: 0,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 5,
    textureRetention: 80,
    teethWhiteningPro: 5,
    darkCircleRemoval: 30,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 15,
    saturation: 10,
    brightness: -20,
    grain: 30,
    temperature: 20,
    highlightSuppression: 15,
    shadowCompensation: 15,
    vignette: 25,
    hueShift: 5,
    sharpness: 0,
    fade: 10,
  },
  cameraParams: {
    iso: 800,
    shutter: '1/60',
    aperture: 'f/2.0',
    whiteBalance: '5800K',
    exposureCompensation: '-0.5 EV',
  },
  tags: ['胶片', '生活', '暗角', '纪实'],
  difficulty: 'medium',
};

/**
 * 区域曝光 (Ansel Adams风格)
 */
export const PRESET_US_5_ANSEL: MasterPreset = {
  id: 'preset_us_5_ansel',
  name: '区域曝光',
  photographer: 'Ansel Adams',
  region: 'US',
  description: '区域曝光、极致黑白细节',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 15,
    teeth: 0,
    nose: 0,
    blush: 0,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 0,
    textureRetention: 100,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 50,
    saturation: -100,
    brightness: 10,
    grain: 5,
    temperature: 0,
    highlightSuppression: 30,
    shadowCompensation: 40,
    vignette: 0,
    hueShift: 0,
    sharpness: 50,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/250',
    aperture: 'f/16',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['黑白', '风景', '区域曝光', '极致'],
  difficulty: 'hard',
};

/**
 * 纯净原生 (林海音风格)
 */
export const PRESET_TW_1_LIN: MasterPreset = {
  id: 'preset_tw_1_lin',
  name: '纯净原生',
  photographer: '林海音',
  region: 'TW',
  description: '纯净原生、柔和肤色、自然光',
  beautyParams: {
    smooth: 25,
    slim: 8,
    eye: 10,
    bright: 15,
    teeth: 12,
    nose: 5,
    blush: 20,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 15,
    textureRetention: 40,
    teethWhiteningPro: 30,
    darkCircleRemoval: 30,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 0,
    saturation: 0,
    brightness: 15,
    grain: 0,
    temperature: 10,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 0,
    hueShift: 5,
    sharpness: 5,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.8',
    whiteBalance: '5600K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['柔和', '自然', '肤色', '台湾'],
  difficulty: 'easy',
};

/**
 * 浓郁光影 (范毅舜风格)
 */
export const PRESET_TW_2_FAN: MasterPreset = {
  id: 'preset_tw_2_fan',
  name: '浓郁光影',
  photographer: '范毅舜',
  region: 'TW',
  description: '浓郁光影、戏剧化色彩',
  beautyParams: {
    smooth: 15,
    slim: 5,
    eye: 8,
    bright: 20,
    teeth: 10,
    nose: 5,
    blush: 15,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 30,
    textureRetention: 60,
    teethWhiteningPro: 15,
    darkCircleRemoval: 20,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 30,
    saturation: 25,
    brightness: 5,
    grain: 5,
    temperature: 10,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 10,
    hueShift: 0,
    sharpness: 10,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/4',
    whiteBalance: '5600K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['光影', '戏剧', '色彩', '台湾'],
  difficulty: 'medium',
};

/**
 * 纪实质感 (阮义忠风格)
 */
export const PRESET_TW_3_RUAN: MasterPreset = {
  id: 'preset_tw_3_ruan',
  name: '纪实质感',
  photographer: '阮义忠',
  region: 'TW',
  description: '纪实质感、高反差黑白',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 15,
    teeth: 0,
    nose: 0,
    blush: 0,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 0,
    textureRetention: 100,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 40,
    saturation: -100,
    brightness: 0,
    grain: 20,
    temperature: 0,
    highlightSuppression: 10,
    shadowCompensation: 10,
    vignette: 10,
    hueShift: 0,
    sharpness: 15,
    fade: 0,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/125',
    aperture: 'f/5.6',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['人文', '纪实', '黑白', '台湾'],
  difficulty: 'medium',
};

/**
 * 现代高冷 (陈漫（台湾视角）风格)
 */
export const PRESET_TW_4_CHENMAN: MasterPreset = {
  id: 'preset_tw_4_chenman_tw',
  name: '现代高冷',
  photographer: '陈漫（台湾视角）',
  region: 'TW',
  description: '现代感、高冷调、后期精修',
  beautyParams: {
    smooth: 30,
    slim: 12,
    eye: 15,
    bright: 20,
    teeth: 18,
    nose: 10,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 50,
    textureRetention: 30,
    teethWhiteningPro: 30,
    darkCircleRemoval: 40,
    hairlineAdjustment: 10,
  },
  filterParams: {
    contrast: 25,
    saturation: 10,
    brightness: 10,
    grain: 0,
    temperature: -10,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 5,
    hueShift: 15,
    sharpness: 20,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/2.8',
    whiteBalance: '5200K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['现代', '高冷', '精修', '台湾'],
  difficulty: 'medium',
};

/**
 * 荒诞黑白 (张照堂风格)
 */
export const PRESET_TW_5_ZHANG: MasterPreset = {
  id: 'preset_tw_5_zhang',
  name: '荒诞黑白',
  photographer: '张照堂',
  region: 'TW',
  description: '荒诞感、深邃黑白、硬核颗粒',
  beautyParams: {
    smooth: 0,
    slim: 0,
    eye: 0,
    bright: 10,
    teeth: 0,
    nose: 0,
    blush: 0,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 0,
    textureRetention: 100,
    teethWhiteningPro: 0,
    darkCircleRemoval: 0,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 50,
    saturation: -100,
    brightness: -10,
    grain: 70,
    temperature: 0,
    highlightSuppression: 0,
    shadowCompensation: 0,
    vignette: 20,
    hueShift: 0,
    sharpness: 20,
    fade: 0,
  },
  cameraParams: {
    iso: 400,
    shutter: '1/250',
    aperture: 'f/8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['超现实', '黑白', '实验', '台湾'],
  difficulty: 'hard',
};

/**
 * 肖像至上 (David Bailey风格)
 */
export const PRESET_UK_1_DAVID: MasterPreset = {
  id: 'preset_uk_1_david',
  name: '肖像至上',
  photographer: 'David Bailey',
  region: 'UK',
  description: '肖像至上、简单直接、柔光',
  beautyParams: {
    smooth: 20,
    slim: 10,
    eye: 12,
    bright: 20,
    teeth: 15,
    nose: 8,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 30,
    textureRetention: 50,
    teethWhiteningPro: 20,
    darkCircleRemoval: 25,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 20,
    saturation: 0,
    brightness: 10,
    grain: 5,
    temperature: 5,
    highlightSuppression: 30,
    shadowCompensation: 20,
    vignette: 10,
    hueShift: 0,
    sharpness: 15,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/4',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['时尚', '肖像', '伦敦', '柔光'],
  difficulty: 'medium',
};

/**
 * 实验艺术 (Nick Knight风格)
 */
export const PRESET_UK_2_NICK: MasterPreset = {
  id: 'preset_uk_2_nick',
  name: '实验艺术',
  photographer: 'Nick Knight',
  region: 'UK',
  description: '实验艺术、超现实色彩',
  beautyParams: {
    smooth: 30,
    slim: 12,
    eye: 15,
    bright: 25,
    teeth: 20,
    nose: 10,
    blush: 15,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 40,
    textureRetention: 30,
    teethWhiteningPro: 25,
    darkCircleRemoval: 40,
    hairlineAdjustment: 5,
  },
  filterParams: {
    contrast: 40,
    saturation: 60,
    brightness: 15,
    grain: 0,
    temperature: 0,
    highlightSuppression: 15,
    shadowCompensation: 20,
    vignette: 5,
    hueShift: 10,
    sharpness: 20,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/160',
    aperture: 'f/2.8',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['实验', '数字', '色彩', '艺术'],
  difficulty: 'hard',
};

/**
 * 时尚锐利 (Rankin风格)
 */
export const PRESET_UK_3_RANKIN: MasterPreset = {
  id: 'preset_uk_3_rankin',
  name: '时尚锐利',
  photographer: 'Rankin',
  region: 'UK',
  description: '时尚锐利、眼神光突出',
  beautyParams: {
    smooth: 25,
    slim: 10,
    eye: 15,
    bright: 50,
    teeth: 18,
    nose: 10,
    blush: 12,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 35,
    textureRetention: 45,
    teethWhiteningPro: 25,
    darkCircleRemoval: 30,
    hairlineAdjustment: 5,
  },
  filterParams: {
    contrast: 20,
    saturation: 5,
    brightness: 10,
    grain: 0,
    temperature: 0,
    highlightSuppression: 15,
    shadowCompensation: 15,
    vignette: 0,
    hueShift: 0,
    sharpness: 40,
    fade: 0,
  },
  cameraParams: {
    iso: 100,
    shutter: '1/160',
    aperture: 'f/4',
    whiteBalance: '5500K',
    exposureCompensation: '0.0 EV',
  },
  tags: ['现代', '肖像', '干净', '锐利'],
  difficulty: 'easy',
};

/**
 * 讽刺色彩 (Martin Parr风格)
 */
export const PRESET_UK_4_MARTIN: MasterPreset = {
  id: 'preset_uk_4_martin',
  name: '讽刺色彩',
  photographer: 'Martin Parr',
  region: 'UK',
  description: '讽刺色彩、闪光灯硬调',
  beautyParams: {
    smooth: 10,
    slim: 0,
    eye: 5,
    bright: 15,
    teeth: 10,
    nose: 0,
    blush: 10,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 10,
    textureRetention: 70,
    teethWhiteningPro: 10,
    darkCircleRemoval: 15,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: 25,
    saturation: 50,
    brightness: 20,
    grain: 0,
    temperature: 5,
    highlightSuppression: 10,
    shadowCompensation: 10,
    vignette: 0,
    hueShift: 5,
    sharpness: 30,
    fade: 0,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/8',
    whiteBalance: '5500K',
    exposureCompensation: '+0.5 EV',
  },
  tags: ['讽刺', '色彩', '纪实', '闪光'],
  difficulty: 'medium',
};

/**
 * 梦幻糖果 (Tim Walker风格)
 */
export const PRESET_UK_5_TIM: MasterPreset = {
  id: 'preset_uk_5_tim',
  name: '梦幻糖果',
  photographer: 'Tim Walker',
  region: 'UK',
  description: '梦幻糖果色、低对比柔焦',
  beautyParams: {
    smooth: 25,
    slim: 8,
    eye: 12,
    bright: 18,
    teeth: 15,
    nose: 5,
    blush: 20,
    // v2.3.0 新增 12 维美颜引擎
    sculpting3D: 20,
    textureRetention: 40,
    teethWhiteningPro: 18,
    darkCircleRemoval: 35,
    hairlineAdjustment: 0,
  },
  filterParams: {
    contrast: -30,
    saturation: 20,
    brightness: 20,
    grain: 0,
    temperature: 10,
    highlightSuppression: 20,
    shadowCompensation: 25,
    vignette: 5,
    hueShift: 20,
    sharpness: 0,
    fade: 10,
  },
  cameraParams: {
    iso: 200,
    shutter: '1/125',
    aperture: 'f/2.0',
    whiteBalance: '5600K',
    exposureCompensation: '+0.5 EV',
  },
  tags: ['梦幻', '童话', '柔和', '叙事'],
  difficulty: 'easy',
};

/**
 * 获取地区标签的显示名称
 */
export function getRegionDisplayName(region: PresetRegion): string {
  const names: Record<PresetRegion, string> = {
    'DEFAULT': '默认',
    'CN': '🇨🇳 中国',
    'JP': '🇯🇵 日本',
    'KR': '🇰🇷 韩国',
    'US': '🇺🇸 美国',
    'TW': '🇹🇼 台湾',
    'UK': '🇬🇧 英国',
  };
  return names[region] || region;
}


/**
 * 全球大师预设数组（v2.4.0）
 * 总计 31 个预设：1 个默认 + 30 个全球大师
 */
export const ALL_MASTER_PRESETS: MasterPreset[] = [
  DEFAULT_BEAUTY_PRESET,
  
  // 🇨🇳 中国大师（5位）
  PRESET_CN_1_XIAOQUAN,
  PRESET_CN_2_SUNJUN,
  PRESET_CN_3_CHENMAN,
  PRESET_CN_4_NINAGAWA,
  PRESET_CN_5_LUOYANG,
  
  // 🇯🇵 日本大师（5位）
  PRESET_JP_1_SUGIMOTO,
  PRESET_JP_2_NINAGAWA,
  PRESET_JP_3_HAMADA,
  PRESET_JP_4_MORIYAMA,
  PRESET_JP_5_KAWAUCHI,
  
  // 🇰🇷 韩国大师（5位）
  PRESET_KR_1_CHO,
  PRESET_KR_2_MUGUNG,
  PRESET_KR_3_LESS,
  PRESET_KR_4_HONG,
  PRESET_KR_5_KOO,
  
  // 🇺🇸 美国大师（5位）
  PRESET_US_1_ANNIE,
  PRESET_US_2_RICHARD,
  PRESET_US_3_IRVING,
  PRESET_US_4_DIANE,
  PRESET_US_5_CINDY,
  
  // 🇹🇼 台湾大师（5位）
  PRESET_TW_1_LIN,
  PRESET_TW_2_RUAN,
  PRESET_TW_3_ZHANG,
  PRESET_TW_4_GUO,
  PRESET_TW_5_HE,
  
  // 🇬🇧 英国大师（5位）
  PRESET_UK_1_DAVID,
  PRESET_UK_2_NICK,
  PRESET_UK_3_TIM,
  PRESET_UK_4_RANKIN,
  PRESET_UK_5_NADAV,
];

/**
 * 按地区分组的大师预设
 */
export const PRESETS_BY_REGION = {
  DEFAULT: [DEFAULT_BEAUTY_PRESET],
  CN: [PRESET_CN_1_XIAOQUAN, PRESET_CN_2_SUNJUN, PRESET_CN_3_CHENMAN, PRESET_CN_4_NINAGAWA, PRESET_CN_5_LUOYANG],
  JP: [PRESET_JP_1_SUGIMOTO, PRESET_JP_2_NINAGAWA, PRESET_JP_3_HAMADA, PRESET_JP_4_MORIYAMA, PRESET_JP_5_KAWAUCHI],
  KR: [PRESET_KR_1_CHO, PRESET_KR_2_MUGUNG, PRESET_KR_3_LESS, PRESET_KR_4_HONG, PRESET_KR_5_KOO],
  US: [PRESET_US_1_ANNIE, PRESET_US_2_RICHARD, PRESET_US_3_IRVING, PRESET_US_4_DIANE, PRESET_US_5_CINDY],
  TW: [PRESET_TW_1_LIN, PRESET_TW_2_RUAN, PRESET_TW_3_ZHANG, PRESET_TW_4_GUO, PRESET_TW_5_HE],
  UK: [PRESET_UK_1_DAVID, PRESET_UK_2_NICK, PRESET_UK_3_TIM, PRESET_UK_4_RANKIN, PRESET_UK_5_NADAV],
};

/**
 * 地区名称映射
 */
export const REGION_NAMES = {
  DEFAULT: '默认',
  CN: '🇨🇳 中国',
  JP: '🇯🇵 日本',
  KR: '🇰🇷 韩国',
  US: '🇺🇸 美国',
  TW: '🇹🇼 台湾',
  UK: '🇬🇧 英国',
};
