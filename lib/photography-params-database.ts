/**
 * 雁宝AI - 专业摄影参数数据库
 * 
 * 为不同城市、场景、时间提供专业的摄影参数建议
 */

export interface PhotographyParams {
  bestTime: string;
  filter: string;
  beautyIntensity: number;
  exposure: string;
  iso: string;
  whiteBalance: string;
  focusMode: string;
  composition: string;
  lighting: string;
  weatherSuggestion: string;
  clothingTips: string;
  propsSuggestion?: string;
}

/**
 * 场景类型
 */
export enum SceneType {
  LAKESIDE = 'lakeside',           // 湖畔
  ANCIENT_BUILDING = 'ancient',    // 古建筑
  MODERN_CITY = 'modern_city',     // 现代都市
  PARK = 'park',                   // 公园
  CAFE = 'cafe',                   // 咖啡馆
  NIGHT_VIEW = 'night_view',       // 夜景
  BEACH = 'beach',                 // 海滩
  MOUNTAIN = 'mountain',           // 山景
}

/**
 * 时间段
 */
export enum TimeOfDay {
  GOLDEN_HOUR_MORNING = 'golden_morning',  // 黄金时刻（早晨）
  GOLDEN_HOUR_EVENING = 'golden_evening',  // 黄金时刻（傍晚）
  BLUE_HOUR = 'blue_hour',                 // 蓝调时刻
  NOON = 'noon',                           // 正午
  OVERCAST = 'overcast',                   // 阴天
  NIGHT = 'night',                         // 夜晚
}

/**
 * 杭州西湖断桥 - 专业摄影参数
 */
export const XIHU_DUANQIAO_PARAMS: Record<TimeOfDay, PhotographyParams> = {
  [TimeOfDay.GOLDEN_HOUR_MORNING]: {
    bestTime: '日出后30分钟-1小时（约6:30-7:30）',
    filter: '暖调滤镜（色温+200K）',
    beautyIntensity: 55,
    exposure: '+0.3 EV',
    iso: 'ISO 100-200',
    whiteBalance: '日光（5500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '三分法构图，将断桥置于画面右侧1/3处，留出湖面和远山',
    lighting: '侧光，柔和的晨光从东侧照射，适合拍摄剪影和轮廓',
    weatherSuggestion: '晴天或薄雾天气最佳，雾气可增加朦胧美感',
    clothingTips: '浅色系汉服或长裙，白色、淡粉、浅蓝为佳',
    propsSuggestion: '油纸伞、团扇、桃花枝',
  },
  [TimeOfDay.GOLDEN_HOUR_EVENING]: {
    bestTime: '日落前1小时（约17:00-18:00）',
    filter: '暖调滤镜（色温+300K）',
    beautyIntensity: 60,
    exposure: '+0.5 EV',
    iso: 'ISO 100-400',
    whiteBalance: '阴影（6500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用断桥作为前景，拍摄夕阳倒影，采用对称构图',
    lighting: '逆光或侧逆光，夕阳从西侧照射，适合拍摄剪影和光晕',
    weatherSuggestion: '晴天最佳，晚霞丰富时可拍出梦幻效果',
    clothingTips: '暖色系服装，橙色、红色、金色为佳',
    propsSuggestion: '纱巾、花束',
  },
  [TimeOfDay.BLUE_HOUR]: {
    bestTime: '日落后30分钟（约18:30-19:00）',
    filter: '冷调滤镜（色温-100K）',
    beautyIntensity: 65,
    exposure: '+1.0 EV',
    iso: 'ISO 800-1600',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用湖面倒影和桥梁灯光，采用中心对称构图',
    lighting: '蓝调时刻的柔和天光，配合桥梁灯光',
    weatherSuggestion: '晴天或少云天气',
    clothingTips: '深色或亮色服装，便于在蓝调背景中突出',
    propsSuggestion: '灯笼、发光道具',
  },
  [TimeOfDay.NOON]: {
    bestTime: '上午10:00-11:00或下午14:00-15:00',
    filter: '标准滤镜或轻微冷调',
    beautyIntensity: 50,
    exposure: '±0 EV',
    iso: 'ISO 100',
    whiteBalance: '自动白平衡',
    focusMode: '单次自动对焦（AF-S）',
    composition: '避免正午强光，寻找树荫或桥下阴影处拍摄',
    lighting: '顶光，光线较硬，建议使用反光板补光',
    weatherSuggestion: '多云天气更佳，光线柔和',
    clothingTips: '清新色系，避免过于鲜艳',
  },
  [TimeOfDay.OVERCAST]: {
    bestTime: '全天均可',
    filter: '暖调滤镜（色温+100K）',
    beautyIntensity: 60,
    exposure: '+0.7 EV',
    iso: 'ISO 200-400',
    whiteBalance: '阴天（6000K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用阴天柔和的光线，拍摄人物特写或半身照',
    lighting: '漫射光，光线柔和均匀，适合拍摄人像',
    weatherSuggestion: '阴天是人像摄影的最佳天气',
    clothingTips: '鲜艳色系，增加画面活力',
  },
  [TimeOfDay.NIGHT]: {
    bestTime: '19:30-21:00',
    filter: '标准滤镜',
    beautyIntensity: 70,
    exposure: '+1.5 EV',
    iso: 'ISO 1600-3200',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '手动对焦（MF）',
    composition: '利用桥梁和湖面灯光，拍摄夜景人像',
    lighting: '人工灯光，建议使用外置闪光灯或LED补光灯',
    weatherSuggestion: '晴天或少云',
    clothingTips: '亮色或反光材质服装',
    propsSuggestion: '灯笼、荧光棒',
  },
};

/**
 * 北京故宫红墙 - 专业摄影参数
 */
export const GUGONG_REDWALL_PARAMS: Record<TimeOfDay, PhotographyParams> = {
  [TimeOfDay.GOLDEN_HOUR_MORNING]: {
    bestTime: '日出后30分钟-1小时（约7:00-8:00）',
    filter: '暖调滤镜（色温+150K）',
    beautyIntensity: 50,
    exposure: '+0.2 EV',
    iso: 'ISO 100-200',
    whiteBalance: '日光（5500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用红墙作为背景，采用竖构图，人物占画面1/3',
    lighting: '侧光，晨光从东侧照射红墙，色彩饱和',
    weatherSuggestion: '晴天最佳，红墙在阳光下更加鲜艳',
    clothingTips: '白色、米色、浅蓝色汉服，与红墙形成对比',
    propsSuggestion: '团扇、宫灯',
  },
  [TimeOfDay.GOLDEN_HOUR_EVENING]: {
    bestTime: '日落前1小时（约16:30-17:30）',
    filter: '暖调滤镜（色温+200K）',
    beautyIntensity: 55,
    exposure: '+0.3 EV',
    iso: 'ISO 100-400',
    whiteBalance: '阴影（6500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用红墙和金色琉璃瓦，采用对角线构图',
    lighting: '侧逆光，夕阳从西侧照射，适合拍摄轮廓光',
    weatherSuggestion: '晴天或少云',
    clothingTips: '深色或金色系服装',
  },
  [TimeOfDay.BLUE_HOUR]: {
    bestTime: '日落后30分钟（约18:00-18:30）',
    filter: '标准滤镜',
    beautyIntensity: 60,
    exposure: '+1.0 EV',
    iso: 'ISO 800-1600',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用宫灯和红墙，营造古典氛围',
    lighting: '蓝调时刻的柔和天光配合宫灯',
    weatherSuggestion: '晴天',
    clothingTips: '明亮色系，便于在暗光中突出',
  },
  [TimeOfDay.NOON]: {
    bestTime: '上午10:00-11:00或下午14:00-15:00',
    filter: '标准滤镜',
    beautyIntensity: 45,
    exposure: '-0.3 EV',
    iso: 'ISO 100',
    whiteBalance: '自动白平衡',
    focusMode: '单次自动对焦（AF-S）',
    composition: '寻找红墙的阴影处，避免强光直射',
    lighting: '顶光，光线较硬',
    weatherSuggestion: '多云天气更佳',
    clothingTips: '清新色系',
  },
  [TimeOfDay.OVERCAST]: {
    bestTime: '全天均可',
    filter: '暖调滤镜（色温+100K）',
    beautyIntensity: 55,
    exposure: '+0.5 EV',
    iso: 'ISO 200-400',
    whiteBalance: '阴天（6000K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用阴天柔和的光线，拍摄人物与红墙的互动',
    lighting: '漫射光，光线柔和',
    weatherSuggestion: '阴天是拍摄红墙的好时机',
    clothingTips: '鲜艳色系或白色',
  },
  [TimeOfDay.NIGHT]: {
    bestTime: '故宫夜场开放时间（需预约）',
    filter: '标准滤镜',
    beautyIntensity: 65,
    exposure: '+1.5 EV',
    iso: 'ISO 1600-3200',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '手动对焦（MF）',
    composition: '利用宫灯和红墙，营造古典夜景',
    lighting: '人工灯光',
    weatherSuggestion: '晴天',
    clothingTips: '明亮色系或传统服饰',
    propsSuggestion: '宫灯、灯笼',
  },
};

/**
 * 上海外滩 - 专业摄影参数
 */
export const SHANGHAI_BUND_PARAMS: Record<TimeOfDay, PhotographyParams> = {
  [TimeOfDay.GOLDEN_HOUR_EVENING]: {
    bestTime: '日落前1小时（约17:00-18:00）',
    filter: '暖调滤镜（色温+200K）',
    beautyIntensity: 60,
    exposure: '+0.5 EV',
    iso: 'ISO 100-400',
    whiteBalance: '阴影（6500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '以东方明珠或浦东天际线为背景，采用三分法构图',
    lighting: '逆光或侧逆光，夕阳从西侧照射',
    weatherSuggestion: '晴天或少云，晚霞丰富时效果最佳',
    clothingTips: '都市时尚风格，黑色、白色、红色为佳',
    propsSuggestion: '墨镜、手提包',
  },
  [TimeOfDay.BLUE_HOUR]: {
    bestTime: '日落后30分钟（约18:30-19:30）',
    filter: '冷调滤镜（色温-50K）',
    beautyIntensity: 65,
    exposure: '+1.0 EV',
    iso: 'ISO 800-1600',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用黄浦江倒影和建筑灯光，采用对称构图',
    lighting: '蓝调时刻的柔和天光配合城市灯光',
    weatherSuggestion: '晴天或少云',
    clothingTips: '亮色或反光材质服装，便于在暗光中突出',
  },
  [TimeOfDay.NIGHT]: {
    bestTime: '19:30-22:00',
    filter: '标准滤镜',
    beautyIntensity: 70,
    exposure: '+1.5 EV',
    iso: 'ISO 1600-3200',
    whiteBalance: '钨丝灯（3200K）',
    focusMode: '手动对焦（MF）',
    composition: '利用外滩建筑群灯光和浦东天际线，拍摄夜景人像',
    lighting: '城市灯光，建议使用外置闪光灯或LED补光灯',
    weatherSuggestion: '晴天',
    clothingTips: '时尚都市风格，亮色或金属质感服装',
    propsSuggestion: '反光板、LED灯',
  },
  [TimeOfDay.GOLDEN_HOUR_MORNING]: {
    bestTime: '日出后30分钟-1小时（约6:30-7:30）',
    filter: '暖调滤镜（色温+150K）',
    beautyIntensity: 55,
    exposure: '+0.3 EV',
    iso: 'ISO 100-200',
    whiteBalance: '日光（5500K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '以浦东天际线为背景，拍摄晨光中的人像',
    lighting: '侧光，晨光从东侧照射',
    weatherSuggestion: '晴天',
    clothingTips: '清新都市风格',
  },
  [TimeOfDay.NOON]: {
    bestTime: '上午10:00-11:00或下午14:00-15:00',
    filter: '标准滤镜',
    beautyIntensity: 50,
    exposure: '±0 EV',
    iso: 'ISO 100',
    whiteBalance: '自动白平衡',
    focusMode: '单次自动对焦（AF-S）',
    composition: '寻找建筑阴影处，避免强光直射',
    lighting: '顶光，光线较硬',
    weatherSuggestion: '多云天气更佳',
    clothingTips: '都市休闲风格',
  },
  [TimeOfDay.OVERCAST]: {
    bestTime: '全天均可',
    filter: '标准滤镜',
    beautyIntensity: 60,
    exposure: '+0.5 EV',
    iso: 'ISO 200-400',
    whiteBalance: '阴天（6000K）',
    focusMode: '单次自动对焦（AF-S）',
    composition: '利用阴天柔和的光线，拍摄都市人像',
    lighting: '漫射光',
    weatherSuggestion: '阴天适合拍摄都市风格',
    clothingTips: '鲜艳色系',
  },
};

/**
 * 根据场景和时间获取摄影参数
 */
export function getPhotographyParams(
  sceneType: SceneType,
  timeOfDay: TimeOfDay,
  location?: string
): PhotographyParams | null {
  // 根据location和sceneType匹配具体的参数数据库
  if (location?.includes('杭州') && location?.includes('西湖')) {
    return XIHU_DUANQIAO_PARAMS[timeOfDay] || null;
  }
  
  if (location?.includes('北京') && location?.includes('故宫')) {
    return GUGONG_REDWALL_PARAMS[timeOfDay] || null;
  }
  
  if (location?.includes('上海') && location?.includes('外滩')) {
    return SHANGHAI_BUND_PARAMS[timeOfDay] || null;
  }
  
  return null;
}

/**
 * 根据当前时间判断时间段
 */
export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 8) {
    return TimeOfDay.GOLDEN_HOUR_MORNING;
  } else if (hour >= 17 && hour < 19) {
    return TimeOfDay.GOLDEN_HOUR_EVENING;
  } else if (hour >= 19 && hour < 20) {
    return TimeOfDay.BLUE_HOUR;
  } else if (hour >= 20 || hour < 6) {
    return TimeOfDay.NIGHT;
  } else if (hour >= 11 && hour < 15) {
    return TimeOfDay.NOON;
  } else {
    return TimeOfDay.OVERCAST; // 默认返回阴天参数
  }
}
