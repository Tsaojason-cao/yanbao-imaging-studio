/**
 * 31位大师影像引擎参数矩阵
 * 
 * 每位大师的参数包括：
 * - exposure: 曝光补偿 (-2.0 到 +2.0)
 * - contrast: 对比度 (0 到 200)
 * - saturation: 饱和度 (0 到 200)
 * - highlights: 高光 (-100 到 +100)
 * - shadows: 阴影 (-100 到 +100)
 * - temperature: 色温 (2000K 到 10000K)
 * - tint: 色调 (-100 到 +100)
 * - grain: 颗粒度 (0 到 100)
 * - vignette: 暗角 (0 到 100)
 * - sharpness: 锐度 (0 到 200)
 */

import { Core29Params, DEFAULT_PARAMS } from '../lib/beauty-shader-engine';

/**
 * 大师预设接口
 * 预设只覆盖部分参数，其余使用 DEFAULT_PARAMS
 */
export interface MasterPreset {
  id: number;
  name: string;
  nameEn: string;
  style: string;
  color: string;
  icon: string;
  params: Partial<Core29Params>; // 使用 Partial<Core29Params> 兼容 29 维参数
  description: string;
}

/**
 * 根据预设名称获取完整的 Core22Params
 * @param name 预设名称
 * @returns 完整的 Core29Params 对象
 */
export function getPresetParams(name: string): Core29Params {
  const preset = MASTER_PRESETS.find(p => p.name === name);
  if (!preset) {
    return DEFAULT_PARAMS;
  }

  // 使用 Object.assign 合并默认参数和预设参数，确保所有 29 维都有值
  return Object.assign({}, DEFAULT_PARAMS, preset.params) as Core29Params;
}

export const MASTER_PRESETS: MasterPreset[] = [
  {
    id: 1,
    name: "肖全",
    nameEn: "Xiao Quan",
    style: "人文纪实",
    color: "#E879F9",
    icon: "📸",
    params: {
      // 影调参数 (肖全：经典黑白，高对比，高颗粒)
      exposure: -0.2,
      contrast: 135, // 135% 对比度
      saturation: 0, // 饱和度归零 (黑白)
      vibrance: 0,
      highlights: 80,
      shadows: 20,
      temperature: 6500,
      tint: 0,
      sharpness: 50,
      grain: 80, // 强烈颗粒感
      // 美颜参数 (肖全风格追求真实，美颜参数保持中性或微调)
      faceSlim: 0,
      eyeEnlarge: 0,
      noseLength: 0,
      // 进阶参数 (肖全风格不使用)
      philtrumDepth: 0,
      templeFill: 0,
      nasolabialFolds: 0,
      skinTexture: 0,
      bloomIntensity: 0,
      dehaze: 0,
    } as Partial<Core29Params>,
    description: "中国当代人文摄影大师，擅长捕捉人物内心世界",
  },
  {
    id: 2,
    name: "孙郡",
    nameEn: "Sun Jun",
    style: "诗意纪实",
    color: "#A78BFA",
    icon: "🎭",
    params: {
      exposure: 0.5,
      contrast: 105,
      saturation: 90,
      highlights: -10,
      shadows: 25,
      temperature: 6200,
      tint: 5,
      grain: 20,
      vignette: 20,
      sharpness: 105,
    },
    description: "中国新锐摄影师，以诗意的视角记录日常生活",
  },
  {
    id: 3,
    name: "林海音",
    nameEn: "Lin Haiyin",
    style: "文学影像",
    color: "#F472B6",
    icon: "📖",
    params: {
      exposure: 0.2,
      contrast: 100,
      saturation: 75,
      highlights: -20,
      shadows: 30,
      temperature: 5500,
      tint: -10,
      grain: 35,
      vignette: 25,
      sharpness: 95,
    },
    description: "文学与摄影的完美结合，温暖而怀旧的影像风格",
  },
  {
    id: 4,
    name: "Ansel Adams",
    nameEn: "Ansel Adams",
    style: "风光大师",
    color: "#60A5FA",
    icon: "🏔️",
    params: {
      exposure: 0.0,
      contrast: 135,
      saturation: 70,
      highlights: -30,
      shadows: 40,
      temperature: 6500,
      tint: 0,
      grain: 5,
      vignette: 10,
      sharpness: 140,
    },
    description: "美国风光摄影之父，区域曝光系统创始人",
  },
  {
    id: 5,
    name: "Henri Cartier-Bresson",
    nameEn: "HCB",
    style: "决定性瞬间",
    color: "#34D399",
    icon: "⏱️",
    params: {
      exposure: -0.3,
      contrast: 125,
      saturation: 0,
      highlights: -25,
      shadows: 35,
      temperature: 5500,
      tint: 0,
      grain: 40,
      vignette: 30,
      sharpness: 120,
    },
    description: "街头摄影之父，玛格南图片社创始人",
  },
  {
    id: 6,
    name: "Steve McCurry",
    nameEn: "McCurry",
    style: "人文色彩",
    color: "#FDE047",
    icon: "🌍",
    params: {
      exposure: 0.4,
      contrast: 120,
      saturation: 140,
      highlights: -10,
      shadows: 15,
      temperature: 6800,
      tint: 10,
      grain: 15,
      vignette: 20,
      sharpness: 115,
    },
    description: "《阿富汗少女》作者，色彩运用大师",
  },
  {
    id: 7,
    name: "Annie Leibovitz",
    nameEn: "Leibovitz",
    style: "肖像大师",
    color: "#FB923C",
    icon: "👤",
    params: {
      exposure: 0.6,
      contrast: 110,
      saturation: 95,
      highlights: 0,
      shadows: 10,
      temperature: 6000,
      tint: 5,
      grain: 10,
      vignette: 15,
      sharpness: 105,
    },
    description: "当代最著名的肖像摄影师，名人御用摄影师",
  },
  {
    id: 8,
    name: "Richard Avedon",
    nameEn: "Avedon",
    style: "时尚肖像",
    color: "#EC4899",
    icon: "👗",
    params: {
      exposure: 0.8,
      contrast: 130,
      saturation: 85,
      highlights: 10,
      shadows: -10,
      temperature: 6500,
      tint: 0,
      grain: 5,
      vignette: 5,
      sharpness: 125,
    },
    description: "时尚摄影革新者，极简主义肖像风格",
  },
  {
    id: 9,
    name: "Sebastião Salgado",
    nameEn: "Salgado",
    style: "社会纪实",
    color: "#6B7280",
    icon: "🌐",
    params: {
      exposure: -0.5,
      contrast: 140,
      saturation: 0,
      highlights: -35,
      shadows: 45,
      temperature: 5000,
      tint: -5,
      grain: 30,
      vignette: 35,
      sharpness: 130,
    },
    description: "巴西纪实摄影大师，关注社会与环境议题",
  },
  {
    id: 10,
    name: "Diane Arbus",
    nameEn: "Arbus",
    style: "边缘人像",
    color: "#A78BFA",
    icon: "🎭",
    params: {
      exposure: 0.0,
      contrast: 135,
      saturation: 0,
      highlights: -20,
      shadows: 30,
      temperature: 5500,
      tint: 0,
      grain: 45,
      vignette: 40,
      sharpness: 115,
    },
    description: "关注社会边缘群体，独特的人文视角",
  },
  {
    id: 11,
    name: "Irving Penn",
    nameEn: "Penn",
    style: "静物大师",
    color: "#60A5FA",
    icon: "🎨",
    params: {
      exposure: 0.7,
      contrast: 125,
      saturation: 90,
      highlights: 5,
      shadows: 5,
      temperature: 6200,
      tint: 0,
      grain: 8,
      vignette: 10,
      sharpness: 135,
    },
    description: "时尚与静物摄影大师，极简美学代表",
  },
  {
    id: 12,
    name: "Dorothea Lange",
    nameEn: "Lange",
    style: "大萧条纪实",
    color: "#9CA3AF",
    icon: "📰",
    params: {
      exposure: -0.4,
      contrast: 130,
      saturation: 0,
      highlights: -30,
      shadows: 40,
      temperature: 5200,
      tint: -10,
      grain: 50,
      vignette: 30,
      sharpness: 110,
    },
    description: "美国大萧条时期纪实摄影代表人物",
  },
  {
    id: 13,
    name: "Robert Capa",
    nameEn: "Capa",
    style: "战地摄影",
    color: "#EF4444",
    icon: "⚔️",
    params: {
      exposure: -0.6,
      contrast: 145,
      saturation: 0,
      highlights: -40,
      shadows: 50,
      temperature: 4800,
      tint: -15,
      grain: 60,
      vignette: 45,
      sharpness: 125,
    },
    description: "传奇战地摄影师，玛格南图片社创始人之一",
  },
  {
    id: 14,
    name: "Cindy Sherman",
    nameEn: "Sherman",
    style: "观念摄影",
    color: "#8B5CF6",
    icon: "🎬",
    params: {
      exposure: 0.5,
      contrast: 115,
      saturation: 110,
      highlights: 0,
      shadows: 15,
      temperature: 6500,
      tint: 10,
      grain: 20,
      vignette: 25,
      sharpness: 100,
    },
    description: "当代观念摄影先驱，自拍艺术大师",
  },
  {
    id: 15,
    name: "Helmut Newton",
    nameEn: "Newton",
    style: "时尚先锋",
    color: "#EC4899",
    icon: "💋",
    params: {
      exposure: 0.3,
      contrast: 140,
      saturation: 0,
      highlights: 10,
      shadows: -15,
      temperature: 6000,
      tint: 0,
      grain: 15,
      vignette: 20,
      sharpness: 130,
    },
    description: "时尚摄影革新者，黑白影像大师",
  },
  {
    id: 16,
    name: "Man Ray",
    nameEn: "Man Ray",
    style: "超现实主义",
    color: "#A78BFA",
    icon: "🌙",
    params: {
      exposure: 0.0,
      contrast: 150,
      saturation: 0,
      highlights: -25,
      shadows: 35,
      temperature: 5500,
      tint: -20,
      grain: 35,
      vignette: 50,
      sharpness: 105,
    },
    description: "达达主义和超现实主义摄影先驱",
  },
  {
    id: 17,
    name: "Edward Weston",
    nameEn: "Weston",
    style: "形式主义",
    color: "#60A5FA",
    icon: "🌿",
    params: {
      exposure: 0.2,
      contrast: 135,
      saturation: 0,
      highlights: -15,
      shadows: 25,
      temperature: 6000,
      tint: 0,
      grain: 10,
      vignette: 15,
      sharpness: 145,
    },
    description: "美国现代主义摄影大师，f/64小组成员",
  },
  {
    id: 18,
    name: "Walker Evans",
    nameEn: "Evans",
    style: "美国纪实",
    color: "#10B981",
    icon: "🏛️",
    params: {
      exposure: -0.2,
      contrast: 125,
      saturation: 0,
      highlights: -25,
      shadows: 35,
      temperature: 5500,
      tint: 0,
      grain: 40,
      vignette: 25,
      sharpness: 115,
    },
    description: "美国纪实摄影先驱，FSA项目核心成员",
  },
  {
    id: 19,
    name: "Garry Winogrand",
    nameEn: "Winogrand",
    style: "街头摄影",
    color: "#F59E0B",
    icon: "🚶",
    params: {
      exposure: -0.3,
      contrast: 130,
      saturation: 0,
      highlights: -20,
      shadows: 30,
      temperature: 5800,
      tint: 0,
      grain: 35,
      vignette: 30,
      sharpness: 120,
    },
    description: "美国街头摄影大师，捕捉日常生活的诗意",
  },
  {
    id: 20,
    name: "William Eggleston",
    nameEn: "Eggleston",
    style: "彩色先驱",
    color: "#EF4444",
    icon: "🎨",
    params: {
      exposure: 0.4,
      contrast: 110,
      saturation: 130,
      highlights: -5,
      shadows: 20,
      temperature: 6500,
      tint: 15,
      grain: 25,
      vignette: 20,
      sharpness: 105,
    },
    description: "彩色摄影艺术化先驱，日常生活的色彩诗人",
  },
  {
    id: 21,
    name: "Joel Meyerowitz",
    nameEn: "Meyerowitz",
    style: "街头色彩",
    color: "#EC4899",
    icon: "🌆",
    params: {
      exposure: 0.5,
      contrast: 115,
      saturation: 125,
      highlights: 0,
      shadows: 15,
      temperature: 6800,
      tint: 10,
      grain: 20,
      vignette: 15,
      sharpness: 110,
    },
    description: "彩色街头摄影大师，光影捕捉专家",
  },
  {
    id: 22,
    name: "Sally Mann",
    nameEn: "Mann",
    style: "家庭肖像",
    color: "#A78BFA",
    icon: "👨‍👩‍👧",
    params: {
      exposure: 0.6,
      contrast: 105,
      saturation: 0,
      highlights: 5,
      shadows: 20,
      temperature: 5800,
      tint: -5,
      grain: 30,
      vignette: 35,
      sharpness: 95,
    },
    description: "家庭肖像摄影大师，温暖而私密的影像",
  },
  {
    id: 23,
    name: "Gregory Crewdson",
    nameEn: "Crewdson",
    style: "电影感",
    color: "#8B5CF6",
    icon: "🎥",
    params: {
      exposure: 0.3,
      contrast: 120,
      saturation: 105,
      highlights: -10,
      shadows: 25,
      temperature: 6200,
      tint: 5,
      grain: 15,
      vignette: 30,
      sharpness: 115,
    },
    description: "电影化摄影大师，精心构建的戏剧场景",
  },
  {
    id: 24,
    name: "Andreas Gursky",
    nameEn: "Gursky",
    style: "大画幅",
    color: "#06B6D4",
    icon: "🖼️",
    params: {
      exposure: 0.2,
      contrast: 125,
      saturation: 115,
      highlights: -15,
      shadows: 20,
      temperature: 6500,
      tint: 0,
      grain: 5,
      vignette: 10,
      sharpness: 150,
    },
    description: "当代大画幅摄影代表，宏大视角的记录者",
  },
  {
    id: 25,
    name: "Nan Goldin",
    nameEn: "Goldin",
    style: "亲密日记",
    color: "#EC4899",
    icon: "💕",
    params: {
      exposure: 0.4,
      contrast: 100,
      saturation: 120,
      highlights: 0,
      shadows: 10,
      temperature: 6000,
      tint: 20,
      grain: 40,
      vignette: 25,
      sharpness: 90,
    },
    description: "亲密摄影先驱，真实记录生活的每一刻",
  },
  {
    id: 26,
    name: "Martin Parr",
    nameEn: "Parr",
    style: "讽刺纪实",
    color: "#F59E0B",
    icon: "🎪",
    params: {
      exposure: 0.6,
      contrast: 135,
      saturation: 150,
      highlights: 10,
      shadows: 5,
      temperature: 7000,
      tint: 15,
      grain: 20,
      vignette: 15,
      sharpness: 120,
    },
    description: "英国纪实摄影大师，讽刺幽默的视角",
  },
  {
    id: 27,
    name: "Daido Moriyama",
    nameEn: "Moriyama",
    style: "粗粒子",
    color: "#6B7280",
    icon: "🌃",
    params: {
      exposure: -0.8,
      contrast: 160,
      saturation: 0,
      highlights: -50,
      shadows: 60,
      temperature: 5000,
      tint: 0,
      grain: 80,
      vignette: 50,
      sharpness: 140,
    },
    description: "日本街头摄影大师，粗粒子美学代表",
  },
  {
    id: 28,
    name: "Nobuyoshi Araki",
    nameEn: "Araki",
    style: "私摄影",
    color: "#EC4899",
    icon: "🌸",
    params: {
      exposure: 0.5,
      contrast: 115,
      saturation: 110,
      highlights: 0,
      shadows: 20,
      temperature: 6200,
      tint: 10,
      grain: 35,
      vignette: 30,
      sharpness: 105,
    },
    description: "日本私摄影代表，情感与欲望的记录者",
  },
  {
    id: 29,
    name: "Hiroshi Sugimoto",
    nameEn: "Sugimoto",
    style: "极简主义",
    color: "#60A5FA",
    icon: "🌊",
    params: {
      exposure: 0.0,
      contrast: 110,
      saturation: 0,
      highlights: -10,
      shadows: 15,
      temperature: 6000,
      tint: 0,
      grain: 5,
      vignette: 20,
      sharpness: 135,
    },
    description: "日本观念摄影大师，时间与空间的哲学思考",
  },
  {
    id: 30,
    name: "Rinko Kawauchi",
    nameEn: "Kawauchi",
    style: "日常诗意",
    color: "#F9A8D4",
    icon: "✨",
    params: {
      exposure: 0.8,
      contrast: 95,
      saturation: 105,
      highlights: 15,
      shadows: 5,
      temperature: 6500,
      tint: 10,
      grain: 15,
      vignette: 10,
      sharpness: 100,
    },
    description: "日本女性摄影师，温柔而梦幻的日常影像",
  },
  {
    id: 31,
    name: "YanBao AI Custom",
    nameEn: "Yanbao Custom",
    style: "专属审美",
    color: "#EC4899",
    icon: "🐰",
    params: {
      // 影调参数 (雁宝定制：清冷高级感)
      exposure: 0.1,
      contrast: 110,
      saturation: 90, // 略微降低饱和度
      vibrance: 100,
      highlights: 110, // 提亮高光
      shadows: 10, // 压暗阴影
      temperature: 5800, // 偏冷色调
      tint: -10, // 偏洋红
      sharpness: 10,
      grain: 0,
      // 美颜参数 (核心骨相优化)
      faceSlim: 30, // 轻微瘦脸
      jawline: 20, // 轻微收紧下颌线
      eyeEnlarge: 15, // 轻微放大眼睛
      noseNarrow: 10, // 轻微瘦鼻
      noseLength: -20, // 关键：人中缩短 20%
      forehead: 10,
      mouthSize: -10, // 略微收紧嘴型
      eyeDistance: -5, // 略微拉近眼距
      // 进阶骨相
      philtrumDepth: 30, // 增加人中深度立体感
      templeFill: 20, // 轻微太阳穴填充
      nasolabialFolds: 40, // 法令纹中度淡化
      // 进阶影调与质感
      bloomIntensity: 15, // 轻微柔光
      dehaze: 10, // 轻微去雾
      skinTexture: 50, // 适度保留皮肤质感
      hslSkinHue: -5, // 肤色略微偏红
      hslSkinSat: 110, // 肤色饱和度略高
      hslSkinLum: 5, // 肤色亮度略高
    } as Partial<Core29Params>,
    description: "雁宝专属审美模型，融合亚洲审美优化与清冷高级感。",
  },
];

/**
 * 根据大师参数生成雷达图数据
 */
export function getMasterRadarData(preset: MasterPreset) {
  // 兼容旧的雷达图数据结构，只取影调参数
  const params = getPresetParams(preset.name);
  return [
    { label: "曝光", value: ((params.exposure + 2) / 4) * 100 },
    { label: "对比度", value: (params.contrast / 200) * 100 },
    { label: "饱和度", value: (params.saturation / 200) * 100 },
    { label: "颗粒", value: params.grain },
    { label: "高光", value: params.highlights },
    { label: "阴影", value: params.shadows },
    { label: "锐度", value: (params.sharpness / 200) * 100 },
  ];
}
