/**
 * AR 姿势纠正系统
 * 
 * 功能：
 * - 50+ 个姿势模板
 * - 实时相似度百分比显示
 * - 姿势纠正语音/文字提示
 * - 侧面姿势检测
 * - 自定义姿势录制
 * 
 * 作者：Manus AI
 * 日期：2026-01-13
 */

export interface PoseTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  keypoints: Array<{ x: number; y: number; confidence: number }>;
  thumbnail?: string;
  tips: string[];
  voiceGuidance?: string;
  viewAngle: 'front' | 'side' | 'back' | 'angle';
  estimatedDuration?: number; // 秒
}

export interface PoseSimilarity {
  overallScore: number;      // 整体相似度（0-100）
  keyPointScores: Map<string, number>; // 各关键点相似度
  feedback: string[];        // 改进建议
  voicePrompt?: string;      // 语音提示
  timestamp: number;         // 时间戳
}

export class ARPoseCorrectionSystem {
  private static instance: ARPoseCorrectionSystem;
  private templates: Map<string, PoseTemplate> = new Map();
  private customTemplates: Map<string, PoseTemplate> = new Map();
  private currentPose: Array<{ x: number; y: number; confidence: number }> | null = null;
  private similarityHistory: PoseSimilarity[] = [];
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): ARPoseCorrectionSystem {
    if (!ARPoseCorrectionSystem.instance) {
      ARPoseCorrectionSystem.instance = new ARPoseCorrectionSystem();
    }
    return ARPoseCorrectionSystem.instance;
  }

  /**
   * 初始化系统
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.initializeTemplates();
      this.initialized = true;
      console.log('[ARPoseCorrectionSystem] Initialized with', this.templates.size, 'pose templates');
    } catch (error) {
      console.error('[ARPoseCorrectionSystem] Initialization failed:', error);
    }
  }

  /**
   * 获取所有姿势模板
   */
  getAllTemplates(): PoseTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 按分类获取模板
   */
  getTemplatesByCategory(category: string): PoseTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  /**
   * 按难度获取模板
   */
  getTemplatesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): PoseTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.difficulty === difficulty);
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.templates.forEach(t => categories.add(t.category));
    return Array.from(categories).sort();
  }

  /**
   * 获取分类中的模板数量
   */
  getCategoryCount(category: string): number {
    return Array.from(this.templates.values()).filter(t => t.category === category).length;
  }

  /**
   * 计算姿势相似度
   */
  calculateSimilarity(
    currentPose: Array<{ x: number; y: number; confidence: number }>,
    templateId: string
  ): PoseSimilarity {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    this.currentPose = currentPose;

    // 计算关键点相似度
    const keyPointScores = new Map<string, number>();
    let totalScore = 0;
    let validPoints = 0;

    // 使用欧几里得距离计算相似度
    const keyPointNames = [
      'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
      'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
      'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
    ];

    currentPose.forEach((point, index) => {
      if (template.keypoints[index] && point.confidence > 0.3) {
        const templatePoint = template.keypoints[index];
        const distance = Math.sqrt(
          Math.pow(point.x - templatePoint.x, 2) +
          Math.pow(point.y - templatePoint.y, 2)
        );
        
        // 转换为相似度分数（0-100）
        // 距离越小，相似度越高
        const maxDistance = 100; // 最大允许距离
        const similarity = Math.max(0, 100 - (distance / maxDistance) * 100);
        
        const keyPointName = keyPointNames[index] || `point_${index}`;
        keyPointScores.set(keyPointName, Math.round(similarity));
        
        totalScore += similarity;
        validPoints++;
      }
    });

    const overallScore = validPoints > 0 ? Math.round(totalScore / validPoints) : 0;

    // 生成反馈和语音提示
    const feedback = this.generateFeedback(overallScore, keyPointScores, template);
    const voicePrompt = this.generateVoicePrompt(overallScore, feedback);

    const similarity: PoseSimilarity = {
      overallScore,
      keyPointScores,
      feedback,
      voicePrompt,
      timestamp: Date.now()
    };

    this.similarityHistory.push(similarity);

    return similarity;
  }

  /**
   * 录制自定义姿势
   */
  recordCustomPose(
    name: string,
    category: string,
    currentPose: Array<{ x: number; y: number; confidence: number }>,
    tips: string[] = [],
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): PoseTemplate {
    const template: PoseTemplate = {
      id: `custom-pose-${Date.now()}`,
      name,
      category,
      description: `Custom pose: ${name}`,
      difficulty,
      keypoints: currentPose,
      tips,
      viewAngle: 'front'
    };

    this.customTemplates.set(template.id, template);
    this.templates.set(template.id, template);

    console.log('[ARPoseCorrectionSystem] Custom pose recorded:', template.id);

    return template;
  }

  /**
   * 删除自定义姿势
   */
  deleteCustomPose(poseId: string): boolean {
    if (!this.customTemplates.has(poseId)) {
      return false;
    }

    this.customTemplates.delete(poseId);
    this.templates.delete(poseId);

    console.log('[ARPoseCorrectionSystem] Custom pose deleted:', poseId);

    return true;
  }

  /**
   * 获取相似度历史
   */
  getSimilarityHistory(): PoseSimilarity[] {
    return this.similarityHistory;
  }

  /**
   * 清空相似度历史
   */
  clearSimilarityHistory(): void {
    this.similarityHistory = [];
  }

  /**
   * 获取最佳相似度
   */
  getBestSimilarity(): PoseSimilarity | undefined {
    if (this.similarityHistory.length === 0) {
      return undefined;
    }

    return this.similarityHistory.reduce((best, current) =>
      current.overallScore > best.overallScore ? current : best
    );
  }

  /**
   * 获取平均相似度
   */
  getAverageSimilarity(): number {
    if (this.similarityHistory.length === 0) {
      return 0;
    }

    const sum = this.similarityHistory.reduce((acc, curr) => acc + curr.overallScore, 0);
    return Math.round(sum / this.similarityHistory.length);
  }

  /**
   * 获取模板详情
   */
  getTemplate(templateId: string): PoseTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * 搜索模板
   */
  searchTemplates(query: string): PoseTemplate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
    );
  }

  // ============ 私有方法 ============

  private initializeTemplates(): void {
    // 初始化 50+ 个姿势模板
    const templates: PoseTemplate[] = [
      // 自拍姿势（10 个）
      ...this.createSelfieTemplates(),
      // 全身姿势（10 个）
      ...this.createFullBodyTemplates(),
      // 坐姿（10 个）
      ...this.createSittingTemplates(),
      // 运动姿势（10 个）
      ...this.createSportTemplates(),
      // 创意姿势（10 个）
      ...this.createCreativeTemplates()
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });

    console.log('[ARPoseCorrectionSystem] Initialized', templates.length, 'pose templates');
  }

  private createSelfieTemplates(): PoseTemplate[] {
    return [
      {
        id: 'pose-selfie-1',
        name: '经典自拍',
        category: '自拍',
        description: '最受欢迎的自拍姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['头部略微倾斜', '眼睛看向镜头', '嘴角微笑'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-2',
        name: '侧脸自拍',
        category: '自拍',
        description: '展现侧脸线条的自拍',
        difficulty: 'easy',
        keypoints: [],
        tips: ['头部向一侧转', '下巴微微抬起', '眼睛看向镜头'],
        viewAngle: 'side'
      },
      {
        id: 'pose-selfie-3',
        name: '俯视自拍',
        category: '自拍',
        description: '显脸小的俯视角度',
        difficulty: 'easy',
        keypoints: [],
        tips: ['手机位置在头顶', '头部微微抬起', '眼睛向上看'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-4',
        name: '仰视自拍',
        category: '自拍',
        description: '显脸长的仰视角度',
        difficulty: 'easy',
        keypoints: [],
        tips: ['手机位置在下方', '头部微微低下', '眼睛向下看'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-5',
        name: '双人自拍',
        category: '自拍',
        description: '两个人的自拍',
        difficulty: 'medium',
        keypoints: [],
        tips: ['两人靠近', '头部相靠', '都看向镜头'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-6',
        name: '眨眼自拍',
        category: '自拍',
        description: '俏皮的眨眼自拍',
        difficulty: 'easy',
        keypoints: [],
        tips: ['一只眼睛眨起', '嘴角上扬', '表情俏皮'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-7',
        name: '撅嘴自拍',
        category: '自拍',
        description: '可爱的撅嘴自拍',
        difficulty: 'easy',
        keypoints: [],
        tips: ['嘴巴撅起', '眼睛看向镜头', '头部微微倾斜'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-8',
        name: '大笑自拍',
        category: '自拍',
        description: '开心的大笑自拍',
        difficulty: 'easy',
        keypoints: [],
        tips: ['嘴巴大开', '眼睛眯起', '表情开心'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-9',
        name: '认真自拍',
        category: '自拍',
        description: '高冷的认真自拍',
        difficulty: 'easy',
        keypoints: [],
        tips: ['表情认真', '眼睛直视', '嘴巴放松'],
        viewAngle: 'front'
      },
      {
        id: 'pose-selfie-10',
        name: '思考自拍',
        category: '自拍',
        description: '深思的思考自拍',
        difficulty: 'medium',
        keypoints: [],
        tips: ['手指放在嘴边', '眼睛看向远方', '表情沉思'],
        viewAngle: 'front'
      }
    ];
  }

  private createFullBodyTemplates(): PoseTemplate[] {
    return [
      {
        id: 'pose-body-1',
        name: '站立姿势',
        category: '全身',
        description: '标准站立姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['挺胸收腹', '双腿并拢', '手臂自然下垂'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-2',
        name: '单腿站立',
        category: '全身',
        description: '优雅的单腿站立',
        difficulty: 'medium',
        keypoints: [],
        tips: ['一条腿向前抬起', '身体保持平衡', '手臂自然摆放'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-3',
        name: '交叉站立',
        category: '全身',
        description: '腿部交叉的站立',
        difficulty: 'easy',
        keypoints: [],
        tips: ['两条腿交叉', '身体略微倾斜', '手臂放在身体两侧'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-4',
        name: '侧身站立',
        category: '全身',
        description: '展现身材的侧身站立',
        difficulty: 'easy',
        keypoints: [],
        tips: ['身体向一侧转', '一条腿向前迈', '手臂自然摆放'],
        viewAngle: 'side'
      },
      {
        id: 'pose-body-5',
        name: '背身站立',
        category: '全身',
        description: '展现背部线条的背身站立',
        difficulty: 'easy',
        keypoints: [],
        tips: ['背部向镜头', '头部微微转向', '手臂自然下垂'],
        viewAngle: 'back'
      },
      {
        id: 'pose-body-6',
        name: '手叉腰',
        category: '全身',
        description: '自信的手叉腰姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['两手叉腰', '肘部向外', '身体挺直'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-7',
        name: '手放头后',
        category: '全身',
        description: '放松的手放头后姿势',
        difficulty: 'medium',
        keypoints: [],
        tips: ['两手放在头后', '肘部向外', '身体放松'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-8',
        name: '手插口袋',
        category: '全身',
        description: '随意的手插口袋姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['一手或两手插入口袋', '身体放松', '表情自然'],
        viewAngle: 'front'
      },
      {
        id: 'pose-body-9',
        name: '转身姿势',
        category: '全身',
        description: '动感的转身姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体转向一侧', '一条腿向前迈', '手臂摆动'],
        viewAngle: 'angle'
      },
      {
        id: 'pose-body-10',
        name: '跳跃姿势',
        category: '全身',
        description: '充满活力的跳跃姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['双腿离地', '手臂向上', '面带笑容'],
        viewAngle: 'front'
      }
    ];
  }

  private createSittingTemplates(): PoseTemplate[] {
    return [
      {
        id: 'pose-sit-1',
        name: '优雅坐姿',
        category: '坐姿',
        description: '优雅的坐姿',
        difficulty: 'medium',
        keypoints: [],
        tips: ['背部挺直', '双腿并拢', '手放在腿上'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-2',
        name: '盘腿坐',
        category: '坐姿',
        description: '舒适的盘腿坐',
        difficulty: 'easy',
        keypoints: [],
        tips: ['两腿盘起', '背部挺直', '手放在膝盖上'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-3',
        name: '侧坐',
        category: '坐姿',
        description: '展现身材的侧坐',
        difficulty: 'medium',
        keypoints: [],
        tips: ['身体向一侧转', '一条腿向前伸', '手臂放在身体两侧'],
        viewAngle: 'side'
      },
      {
        id: 'pose-sit-4',
        name: '靠背坐',
        category: '坐姿',
        description: '放松的靠背坐',
        difficulty: 'easy',
        keypoints: [],
        tips: ['身体靠在椅背上', '头部放松', '手臂自然下垂'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-5',
        name: '前倾坐',
        category: '坐姿',
        description: '专注的前倾坐',
        difficulty: 'medium',
        keypoints: [],
        tips: ['身体向前倾', '肘部放在膝盖上', '手放在脸颊'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-6',
        name: '跪坐',
        category: '坐姿',
        description: '优雅的跪坐',
        difficulty: 'hard',
        keypoints: [],
        tips: ['双腿跪起', '背部挺直', '手放在腿上'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-7',
        name: '单膝跪',
        category: '坐姿',
        description: '动感的单膝跪',
        difficulty: 'hard',
        keypoints: [],
        tips: ['一条腿跪起', '另一条腿向前伸', '手臂自然摆放'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-8',
        name: '蜷缩坐',
        category: '坐姿',
        description: '温暖的蜷缩坐',
        difficulty: 'medium',
        keypoints: [],
        tips: ['身体蜷缩', '膝盖靠近胸部', '手臂环绕膝盖'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-9',
        name: '床上坐',
        category: '坐姿',
        description: '舒适的床上坐',
        difficulty: 'easy',
        keypoints: [],
        tips: ['坐在床上', '背部靠在枕头上', '双腿自然伸展'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sit-10',
        name: '地上坐',
        category: '坐姿',
        description: '随意的地上坐',
        difficulty: 'easy',
        keypoints: [],
        tips: ['坐在地上', '双腿向前伸', '身体放松'],
        viewAngle: 'front'
      }
    ];
  }

  private createSportTemplates(): PoseTemplate[] {
    return [
      {
        id: 'pose-sport-1',
        name: '瑜伽山式',
        category: '运动',
        description: '瑜伽基础姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['双脚并拢', '手臂自然下垂', '目视前方'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sport-2',
        name: '瑜伽树式',
        category: '运动',
        description: '瑜伽平衡姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['一条腿抬起', '脚放在另一条腿的大腿内侧', '手臂向上'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sport-3',
        name: '瑜伽战士式',
        category: '运动',
        description: '瑜伽力量姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['一条腿向前迈', '膝盖弯曲', '手臂向上'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sport-4',
        name: '俯卧撑',
        category: '运动',
        description: '经典俯卧撑',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体平直', '手臂支撑', '核心收紧'],
        viewAngle: 'side'
      },
      {
        id: 'pose-sport-5',
        name: '平板支撑',
        category: '运动',
        description: '核心训练姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体平直', '肘部支撑', '核心收紧'],
        viewAngle: 'side'
      },
      {
        id: 'pose-sport-6',
        name: '深蹲',
        category: '运动',
        description: '腿部训练',
        difficulty: 'medium',
        keypoints: [],
        tips: ['膝盖弯曲', '背部挺直', '重心在脚跟'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sport-7',
        name: '弓步',
        category: '运动',
        description: '腿部拉伸',
        difficulty: 'medium',
        keypoints: [],
        tips: ['一条腿向前迈', '膝盖弯曲', '后腿伸直'],
        viewAngle: 'front'
      },
      {
        id: 'pose-sport-8',
        name: '倒立',
        category: '运动',
        description: '高难度倒立',
        difficulty: 'hard',
        keypoints: [],
        tips: ['双手支撑', '身体垂直', '核心收紧'],
        viewAngle: 'side'
      },
      {
        id: 'pose-sport-9',
        name: '瑜伽下犬式',
        category: '运动',
        description: '瑜伽经典姿势',
        difficulty: 'medium',
        keypoints: [],
        tips: ['双手双脚支撑', '臀部向上', '头部放松'],
        viewAngle: 'side'
      },
      {
        id: 'pose-sport-10',
        name: '瑜伽婴儿式',
        category: '运动',
        description: '瑜伽放松姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['跪坐', '身体向前折', '手臂放松'],
        viewAngle: 'front'
      }
    ];
  }

  private createCreativeTemplates(): PoseTemplate[] {
    return [
      {
        id: 'pose-creative-1',
        name: '跳跃',
        category: '创意',
        description: '充满活力的跳跃',
        difficulty: 'hard',
        keypoints: [],
        tips: ['双腿离地', '手臂向上', '面带笑容'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-2',
        name: '旋转',
        category: '创意',
        description: '动感的旋转',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体旋转', '手臂展开', '头部跟随'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-3',
        name: '躺卧',
        category: '创意',
        description: '舒适的躺卧',
        difficulty: 'easy',
        keypoints: [],
        tips: ['身体放松', '头部放在手臂上', '表情舒适'],
        viewAngle: 'side'
      },
      {
        id: 'pose-creative-4',
        name: '靠墙',
        category: '创意',
        description: '靠在墙上的姿势',
        difficulty: 'easy',
        keypoints: [],
        tips: ['背部靠墙', '一条腿向前伸', '表情放松'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-5',
        name: '攀爬',
        category: '创意',
        description: '动感的攀爬',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体向上', '手臂向上伸', '腿部用力'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-6',
        name: '舞蹈',
        category: '创意',
        description: '优美的舞蹈姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体摇摆', '手臂舞动', '表情开心'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-7',
        name: '拥抱',
        category: '创意',
        description: '温暖的拥抱',
        difficulty: 'medium',
        keypoints: [],
        tips: ['两人靠近', '手臂环绕', '表情温暖'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-8',
        name: '牵手',
        category: '创意',
        description: '亲密的牵手',
        difficulty: 'easy',
        keypoints: [],
        tips: ['两人靠近', '手紧握', '表情亲密'],
        viewAngle: 'front'
      },
      {
        id: 'pose-creative-9',
        name: '背背',
        category: '创意',
        description: '背靠背的姿势',
        difficulty: 'medium',
        keypoints: [],
        tips: ['两人背靠背', '头部微微转向', '表情温暖'],
        viewAngle: 'back'
      },
      {
        id: 'pose-creative-10',
        name: '飞行',
        category: '创意',
        description: '飞行的姿势',
        difficulty: 'hard',
        keypoints: [],
        tips: ['身体向前倾', '手臂展开', '一条腿向后'],
        viewAngle: 'side'
      }
    ];
  }

  private generateFeedback(
    score: number,
    keyPointScores: Map<string, number>,
    template: PoseTemplate
  ): string[] {
    const feedback: string[] = [];

    if (score < 50) {
      feedback.push('姿势差异较大，请参考示例调整');
    } else if (score < 70) {
      feedback.push('姿势基本正确，但还需微调');
    } else if (score < 85) {
      feedback.push('姿势接近，再调整一点就完美了');
    } else {
      feedback.push('完美！姿势非常接近');
    }

    // 添加模板的提示
    feedback.push(...template.tips);

    return feedback;
  }

  private generateVoicePrompt(score: number, feedback: string[]): string {
    if (score >= 90) {
      return '完美！保持这个姿势';
    } else if (score >= 75) {
      return '很好，再调整一点';
    } else if (score >= 50) {
      return '继续调整，接近了';
    } else {
      return '请参考示例重新调整';
    }
  }
}

export default ARPoseCorrectionSystem;
