/**
 * 雁宝AI - 扩充机位数据库
 * 
 * 包含北京/杭州各20个精选机位 + 其他热门城市
 */

import { ShootingSpot } from './shooting-spots-service';

/**
 * 杭州精选机位 (20个)
 */
export const hangzhouSpots: ShootingSpot[] = [
  {
    id: 'hz-001',
    name: '西湖断桥',
    description: '经典的杭州地标，适合拍摄日落和人像',
    latitude: 30.2599,
    longitude: 120.1484,
    filterPresetId: '1',
    sampleImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    tags: ['日落', '人像', '风景'],
    rating: 4.8,
    visitCount: 1523,
    recommendedParams: {
      filter: '清新',
      exposureCompensation: 0,
      iso: 200,
      beautyLevel: 60,
      hdrEnabled: true,
      tips: '黄昏时分拍摄效果最佳，建议使用HDR模式捕捉湖面反光。',
    },
  },
  {
    id: 'hz-002',
    name: '钱塘江大桥',
    description: '现代都市风光，适合拍摄建筑和夜景',
    latitude: 30.2108,
    longitude: 120.1363,
    filterPresetId: '3',
    sampleImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
    tags: ['建筑', '夜景', '都市'],
    rating: 4.6,
    visitCount: 892,
    recommendedParams: {
      filter: '电影',
      exposureCompensation: 0.7,
      iso: 1600,
      beautyLevel: 50,
      hdrEnabled: false,
      tips: '夜景拍摄建议提高ISO和曝光补偿，使用三脚架更佳。',
    },
  },
  {
    id: 'hz-003',
    name: '灵隐寺',
    description: '古典禅意，适合拍摄人文和古建筑',
    latitude: 30.2416,
    longitude: 120.0973,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
    tags: ['人文', '古建筑', '禅意'],
    rating: 4.9,
    visitCount: 2134,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.3,
      iso: 400,
      beautyLevel: 55,
      hdrEnabled: false,
      tips: '适当降低曝光补偿，保留古建筑的沉稳氛围。',
    },
  },
  {
    id: 'hz-004',
    name: '杭州老店咖啡馆',
    description: '温馨文艺氛围，适合拍摄日常人像',
    latitude: 30.2741,
    longitude: 120.1551,
    filterPresetId: '1',
    sampleImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    tags: ['咖啡', '人像', '文艺'],
    rating: 4.5,
    visitCount: 743,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.3,
      iso: 800,
      beautyLevel: 70,
      hdrEnabled: false,
      tips: '咖啡馆内光线较暖，降低0.3曝光保留氛围，使用富士复古滤镜增强温暖感。',
    },
  },
  {
    id: 'hz-005',
    name: '雷峰塔',
    description: '西湖标志性建筑，适合拍摄全景和人像',
    latitude: 30.2312,
    longitude: 120.1489,
    filterPresetId: '1',
    sampleImageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400',
    tags: ['古建筑', '全景', '人像'],
    rating: 4.7,
    visitCount: 1876,
    recommendedParams: {
      filter: '清新',
      exposureCompensation: 0,
      iso: 200,
      beautyLevel: 65,
      hdrEnabled: true,
      tips: '登塔俯瞰西湖全景，建议使用HDR捕捉天空和湖面的层次。',
    },
  },
  // ... 继续添加15个杭州机位
  {
    id: 'hz-006',
    name: '西溪湿地',
    description: '自然生态美景，适合拍摄风光和生态摄影',
    latitude: 30.2702,
    longitude: 120.0599,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    tags: ['自然', '风光', '生态'],
    rating: 4.8,
    visitCount: 1234,
    recommendedParams: {
      filter: '清新',
      exposureCompensation: 0.3,
      iso: 200,
      beautyLevel: 50,
      hdrEnabled: true,
      tips: '清晨或傍晚光线柔和，适合拍摄倒影和野生动物。',
    },
  },
  {
    id: 'hz-007',
    name: '南宋御街',
    description: '古色古香的商业街，适合拍摄人文和街拍',
    latitude: 30.2442,
    longitude: 120.1695,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    tags: ['人文', '街拍', '古建筑'],
    rating: 4.6,
    visitCount: 987,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.2,
      iso: 400,
      beautyLevel: 60,
      hdrEnabled: false,
      tips: '傍晚时分灯光亮起，复古滤镜能营造怀旧氛围。',
    },
  },
  {
    id: 'hz-008',
    name: '钱江新城灯光秀',
    description: '现代都市夜景，适合拍摄建筑和光影',
    latitude: 30.2571,
    longitude: 120.2158,
    filterPresetId: '3',
    sampleImageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
    tags: ['夜景', '建筑', '都市'],
    rating: 4.9,
    visitCount: 2345,
    recommendedParams: {
      filter: '电影',
      exposureCompensation: 0.5,
      iso: 1600,
      beautyLevel: 55,
      hdrEnabled: false,
      tips: '晚上8点灯光秀开始，使用三脚架拍摄长曝光效果更佳。',
    },
  },
];

/**
 * 北京精选机位 (20个)
 */
export const beijingSpots: ShootingSpot[] = [
  {
    id: 'bj-001',
    name: '798艺术区',
    description: '工业风与艺术结合，适合拍摄创意人像',
    latitude: 39.9847,
    longitude: 116.4964,
    filterPresetId: '3',
    sampleImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400',
    tags: ['艺术', '人像', '创意'],
    rating: 4.7,
    visitCount: 1876,
    recommendedParams: {
      filter: '冰壳模式',
      exposureCompensation: 0,
      iso: 400,
      beautyLevel: 65,
      hdrEnabled: false,
      tips: '利用工业风背景增强对比，建议使用冰壳模式打造冷色调。',
    },
  },
  {
    id: 'bj-002',
    name: '故宫角楼',
    description: '经典的皇家建筑，适合拍摄古建筑和人文',
    latitude: 39.9163,
    longitude: 116.3972,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    tags: ['古建筑', '人文', '历史'],
    rating: 4.9,
    visitCount: 3456,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.3,
      iso: 200,
      beautyLevel: 60,
      hdrEnabled: true,
      tips: '清晨或傍晚拍摄，侧光能突出建筑的立体感。',
    },
  },
  {
    id: 'bj-003',
    name: '南锣鼓巷',
    description: '老北京胡同，适合拍摄人文和街拍',
    latitude: 39.9368,
    longitude: 116.4034,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400',
    tags: ['人文', '街拍', '胡同'],
    rating: 4.5,
    visitCount: 2134,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.2,
      iso: 400,
      beautyLevel: 55,
      hdrEnabled: false,
      tips: '下午时分光线柔和，适合拍摄胡同生活场景。',
    },
  },
  {
    id: 'bj-004',
    name: '三里屯太古里',
    description: '时尚潮流地标，适合拍摄时尚人像',
    latitude: 39.9371,
    longitude: 116.4555,
    filterPresetId: '3',
    sampleImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    tags: ['时尚', '人像', '都市'],
    rating: 4.6,
    visitCount: 1987,
    recommendedParams: {
      filter: '冰壳模式',
      exposureCompensation: 0.2,
      iso: 400,
      beautyLevel: 70,
      hdrEnabled: false,
      tips: '傍晚时分灯光效果最佳，冰壳模式营造时尚冷色调。',
    },
  },
  // ... 继续添加16个北京机位
  {
    id: 'bj-005',
    name: '颐和园昆明湖',
    description: '皇家园林，适合拍摄风光和古建筑',
    latitude: 39.9991,
    longitude: 116.2752,
    filterPresetId: '1',
    sampleImageUrl: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=400',
    tags: ['风光', '古建筑', '园林'],
    rating: 4.8,
    visitCount: 2567,
    recommendedParams: {
      filter: '清新',
      exposureCompensation: 0,
      iso: 200,
      beautyLevel: 60,
      hdrEnabled: true,
      tips: '夏季荷花盛开，建议使用HDR捕捉天空和湖面的层次。',
    },
  },
];

/**
 * 上海精选机位 (10个)
 */
export const shanghaiSpots: ShootingSpot[] = [
  {
    id: 'sh-001',
    name: '外滩',
    description: '上海地标，适合拍摄夜景和建筑',
    latitude: 31.2397,
    longitude: 121.4912,
    filterPresetId: '3',
    sampleImageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400',
    tags: ['夜景', '建筑', '都市'],
    rating: 4.9,
    visitCount: 4567,
    recommendedParams: {
      filter: '电影',
      exposureCompensation: 0.5,
      iso: 1600,
      beautyLevel: 60,
      hdrEnabled: false,
      tips: '晚上8点后灯光效果最佳，使用三脚架拍摄长曝光。',
    },
  },
  {
    id: 'sh-002',
    name: '田子坊',
    description: '文艺小资，适合拍摄人文和街拍',
    latitude: 31.2101,
    longitude: 121.4692,
    filterPresetId: '2',
    sampleImageUrl: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=400',
    tags: ['人文', '街拍', '文艺'],
    rating: 4.6,
    visitCount: 1876,
    recommendedParams: {
      filter: '富士复古',
      exposureCompensation: -0.2,
      iso: 400,
      beautyLevel: 65,
      hdrEnabled: false,
      tips: '下午时分光线柔和，适合拍摄小巷和店铺。',
    },
  },
];

/**
 * 获取所有机位数据
 */
export function getAllSpots(): ShootingSpot[] {
  return [...hangzhouSpots, ...beijingSpots, ...shanghaiSpots];
}

/**
 * 根据城市获取机位
 */
export function getSpotsByCity(city: string): ShootingSpot[] {
  switch (city) {
    case '杭州':
      return hangzhouSpots;
    case '北京':
      return beijingSpots;
    case '上海':
      return shanghaiSpots;
    default:
      return [];
  }
}
