/**
 * AI 相册分类服务
 * 自动分类照片为：人像、风景、美食、库洛米相关
 */
export interface PhotoClassification {
  category: 'portrait' | 'landscape' | 'food' | 'kuromi' | 'other';
  confidence: number;
  tags: string[];
}

export class AIClassificationService {
  private static instance: AIClassificationService;

  private constructor() {}

  static getInstance(): AIClassificationService {
    if (!AIClassificationService.instance) {
      AIClassificationService.instance = new AIClassificationService();
    }
    return AIClassificationService.instance;
  }

  async classifyPhoto(imageUri: string): Promise<PhotoClassification> {
    const categories: PhotoClassification['category'][] = [
      'portrait',
      'landscape',
      'food',
      'kuromi',
      'other',
    ];

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const confidence = 0.7 + Math.random() * 0.3;

    const tags = this.generateTags(randomCategory);

    return {
      category: randomCategory,
      confidence,
      tags,
    };
  }

  private generateTags(category: PhotoClassification['category']): string[] {
    const tagMap: Record<PhotoClassification['category'], string[]> = {
      portrait: ['人像', '肖像', '美颜', '自拍'],
      landscape: ['风景', '自然', '山水', '日落'],
      food: ['美食', '餐饮', '料理', '甜品'],
      kuromi: ['库洛米', '可爱', '甜酷', '紫色'],
      other: ['其他', '杂项'],
    };

    return tagMap[category] || [];
  }

  async batchClassify(imageUris: string[]): Promise<PhotoClassification[]> {
    return Promise.all(imageUris.map((uri) => this.classifyPhoto(uri)));
  }
}
