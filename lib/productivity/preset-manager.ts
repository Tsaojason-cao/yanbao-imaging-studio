/**
 * 预设管理系统
 * 
 * 功能：
 * - 管理 20+ 个内置预设
 * - 保存自定义预设
 * - 预设分享和导入
 * - 预设分类和搜索
 * 
 * 作者：Manus AI
 * 日期：2026-01-13
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail?: string;
  parameters: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    warmth?: number;
    blur?: number;
    sharpen?: number;
    [key: string]: any;
  };
  isBuiltIn: boolean;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  author?: string;
    downloads?: number;
}

export class PresetManager {
  private static instance: PresetManager;
  private presets: Map<string, Preset> = new Map();
  private builtInPresets: Preset[] = [];
  private customPresets: Preset[] = [];
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): PresetManager {
    if (!PresetManager.instance) {
      PresetManager.instance = new PresetManager();
    }
    return PresetManager.instance;
  }

  /**
   * 初始化预设管理器
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.initializeBuiltInPresets();
      await this.loadCustomPresets();
      this.initialized = true;
      console.log('[PresetManager] Initialized with', this.presets.size, 'presets');
    } catch (error) {
      console.error('[PresetManager] Initialization failed:', error);
    }
  }

  /**
   * 获取所有预设
   */
  getAllPresets(): Preset[] {
    return Array.from(this.presets.values());
  }

  /**
   * 获取内置预设
   */
  getBuiltInPresets(): Preset[] {
    return this.builtInPresets;
  }

  /**
   * 获取自定义预设
   */
  getCustomPresets(): Preset[] {
    return this.customPresets;
  }

  /**
   * 获取预设分类
   */
  getPresetsByCategory(category: string): Preset[] {
    return Array.from(this.presets.values()).filter(p => p.category === category);
  }

  /**
   * 搜索预设
   */
  searchPresets(query: string): Preset[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.presets.values()).filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 保存自定义预设
   */
  async saveCustomPreset(
    name: string,
    category: string,
    parameters: Preset['parameters'],
    description: string = ''
  ): Promise<Preset> {
    const preset: Preset = {
      id: `custom-${Date.now()}`,
      name,
      category,
      description,
      parameters,
      isBuiltIn: false,
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.presets.set(preset.id, preset);
    this.customPresets.push(preset);
    await this.persistCustomPresets();

    console.log('[PresetManager] Custom preset saved:', preset.id);

    return preset;
  }

  /**
   * 更新自定义预设
   */
  async updateCustomPreset(
    presetId: string,
    updates: Partial<Preset>
  ): Promise<Preset | undefined> {
    const preset = this.presets.get(presetId);
    if (!preset || preset.isBuiltIn) {
      return undefined;
    }

    const updated = {
      ...preset,
      ...updates,
      updatedAt: Date.now()
    };

    this.presets.set(presetId, updated);
    const index = this.customPresets.findIndex(p => p.id === presetId);
    if (index >= 0) {
      this.customPresets[index] = updated;
    }

    await this.persistCustomPresets();

    console.log('[PresetManager] Custom preset updated:', presetId);

    return updated;
  }

  /**
   * 删除自定义预设
   */
  async deleteCustomPreset(presetId: string): Promise<boolean> {
    const preset = this.presets.get(presetId);
    if (!preset || preset.isBuiltIn) {
      return false;
    }

    this.presets.delete(presetId);
    this.customPresets = this.customPresets.filter(p => p.id !== presetId);
    await this.persistCustomPresets();

    console.log('[PresetManager] Custom preset deleted:', presetId);

    return true;
  }

  /**
   * 分享预设
   */
  async sharePreset(presetId: string): Promise<string> {
    const preset = this.presets.get(presetId);
    if (!preset) {
      throw new Error('Preset not found');
    }

    preset.isPublic = true;
    preset.updatedAt = Date.now();

    if (!preset.isBuiltIn) {
      await this.persistCustomPresets();
    }

    console.log('[PresetManager] Preset shared:', presetId);

    // 返回分享链接
    return `yanbao://preset/${preset.id}`;
  }

  /**
   * 导入预设
   */
  async importPreset(presetData: Partial<Preset>): Promise<Preset> {
    const preset: Preset = {
      id: `imported-${Date.now()}`,
      name: presetData.name || 'Imported Preset',
      category: presetData.category || 'Imported',
      description: presetData.description || '',
      parameters: presetData.parameters || {},
      isBuiltIn: false,
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      author: presetData.author
    };

    this.presets.set(preset.id, preset);
    this.customPresets.push(preset);
    await this.persistCustomPresets();

    console.log('[PresetManager] Preset imported:', preset.id);

    return preset;
  }

  /**
   * 获取预设详情
   */
  getPreset(presetId: string): Preset | undefined {
    return this.presets.get(presetId);
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.presets.forEach(p => categories.add(p.category));
    return Array.from(categories).sort();
  }

  /**
   * 获取分类中的预设数量
   */
  getCategoryCount(category: string): number {
    return Array.from(this.presets.values()).filter(p => p.category === category).length;
  }

  /**
   * 复制预设
   */
  async duplicatePreset(presetId: string): Promise<Preset | undefined> {
    const original = this.presets.get(presetId);
    if (!original) {
      return undefined;
    }

    const duplicate: Preset = {
      id: `copy-${Date.now()}`,
      name: `${original.name} (副本)`,
      category: original.category,
      description: original.description,
      parameters: { ...original.parameters },
      isBuiltIn: false,
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      author: original.author
    };

    this.presets.set(duplicate.id, duplicate);
    this.customPresets.push(duplicate);
    await this.persistCustomPresets();

    console.log('[PresetManager] Preset duplicated:', presetId, '->', duplicate.id);

    return duplicate;
  }

  /**
   * 导出预设为 JSON
   */
  exportPresetAsJSON(presetId: string): string | undefined {
    const preset = this.presets.get(presetId);
    if (!preset) {
      return undefined;
    }

    return JSON.stringify(preset, null, 2);
  }

  /**
   * 导入预设从 JSON
   */
  async importPresetFromJSON(jsonString: string): Promise<Preset | undefined> {
    try {
      const presetData = JSON.parse(jsonString);
      return await this.importPreset(presetData);
    } catch (error) {
      console.error('[PresetManager] Import from JSON failed:', error);
      return undefined;
    }
  }

  // ============ 私有方法 ============

  private initializeBuiltInPresets(): void {
    // 初始化 20+ 个内置预设
    const builtInPresets: Preset[] = [
      // 自然风格（5个）
      {
        id: 'preset-natural-1',
        name: '自然清爽',
        category: '自然',
        description: '清爽自然的日常妆容',
        parameters: { brightness: 0.1, contrast: 0.05, saturation: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-natural-2',
        name: '温暖阳光',
        category: '自然',
        description: '温暖舒适的阳光感',
        parameters: { brightness: 0.15, warmth: 0.2, saturation: 0.05 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-natural-3',
        name: '清晨薄雾',
        category: '自然',
        description: '清晨薄雾的朦胧感',
        parameters: { brightness: 0.05, contrast: -0.1, blur: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-natural-4',
        name: '日落余晖',
        category: '自然',
        description: '日落余晖的温暖色调',
        parameters: { warmth: 0.3, saturation: 0.15, brightness: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-natural-5',
        name: '清爽薄荷',
        category: '自然',
        description: '清爽薄荷色调',
        parameters: { saturation: 0.2, contrast: 0.1, warmth: -0.15 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      // 精致风格（5个）
      {
        id: 'preset-delicate-1',
        name: '精致妆容',
        category: '精致',
        description: '精致细腻的妆容效果',
        parameters: { blur: 0.3, contrast: 0.1, saturation: 0.15 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-delicate-2',
        name: '磨皮美白',
        category: '精致',
        description: '磨皮美白效果',
        parameters: { blur: 0.4, brightness: 0.15, contrast: 0.05 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-delicate-3',
        name: '樱花粉',
        category: '精致',
        description: '樱花粉色调',
        parameters: { saturation: 0.2, warmth: 0.1, blur: 0.2 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-delicate-4',
        name: '冷调仙女',
        category: '精致',
        description: '冷调仙女风格',
        parameters: { warmth: -0.2, saturation: 0.1, contrast: 0.15 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-delicate-5',
        name: '蜜桃少女',
        category: '精致',
        description: '蜜桃少女色调',
        parameters: { warmth: 0.15, saturation: 0.25, blur: 0.25 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      // 明星风格（5个）
      {
        id: 'preset-celebrity-1',
        name: '明星范儿',
        category: '明星',
        description: '专业级明星妆容',
        parameters: { blur: 0.4, brightness: 0.2, contrast: 0.15, saturation: 0.2 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-celebrity-2',
        name: '高级质感',
        category: '明星',
        description: '高级质感风格',
        parameters: { contrast: 0.2, saturation: 0.15, sharpen: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-celebrity-3',
        name: '电影感',
        category: '明星',
        description: '电影感色调',
        parameters: { contrast: 0.25, saturation: 0.1, warmth: 0.05 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-celebrity-4',
        name: '冷艳女神',
        category: '明星',
        description: '冷艳女神风格',
        parameters: { warmth: -0.15, contrast: 0.2, saturation: 0.15 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-celebrity-5',
        name: '温柔女人',
        category: '明星',
        description: '温柔女人风格',
        parameters: { warmth: 0.2, blur: 0.15, saturation: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      // 复古风格（5个）
      {
        id: 'preset-vintage-1',
        name: '胶片感',
        category: '复古',
        description: '经典胶片感',
        parameters: { saturation: -0.1, contrast: 0.1, warmth: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-vintage-2',
        name: '复古棕',
        category: '复古',
        description: '复古棕色调',
        parameters: { warmth: 0.25, saturation: -0.05, contrast: 0.05 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-vintage-3',
        name: '黑白经典',
        category: '复古',
        description: '黑白经典风格',
        parameters: { saturation: -1, contrast: 0.2 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-vintage-4',
        name: '淡雅复古',
        category: '复古',
        description: '淡雅复古色调',
        parameters: { saturation: -0.2, brightness: 0.1, contrast: -0.05 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: 'preset-vintage-5',
        name: '怀旧蓝',
        category: '复古',
        description: '怀旧蓝色调',
        parameters: { warmth: -0.2, saturation: 0.05, contrast: 0.1 },
        isBuiltIn: true,
        isPublic: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    builtInPresets.forEach(preset => {
      this.presets.set(preset.id, preset);
      this.builtInPresets.push(preset);
    });

    console.log('[PresetManager] Initialized', builtInPresets.length, 'built-in presets');
  }

  private async loadCustomPresets(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('yanbao_custom_presets');
      if (data) {
        const presets = JSON.parse(data) as Preset[];
        presets.forEach(preset => {
          this.presets.set(preset.id, preset);
          this.customPresets.push(preset);
        });
        console.log('[PresetManager] Loaded', presets.length, 'custom presets');
      }
    } catch (error) {
      console.error('[PresetManager] Failed to load custom presets:', error);
    }
  }

  private async persistCustomPresets(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        'yanbao_custom_presets',
        JSON.stringify(this.customPresets)
      );
    } catch (error) {
      console.error('[PresetManager] Failed to persist custom presets:', error);
    }
  }
}

export default PresetManager;
