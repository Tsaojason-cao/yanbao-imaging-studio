/**
 * 设置页与个人化引擎
 * 
 * 核心功能：
 * - 用户头像自定义（从相册选取、裁剪、保存）
 * - 库洛米主题全局生效
 * - 用户偏好设置持久化
 * - 深情告白彩蛋（点击Logo 10次）
 * 
 * by Jason Tsao ❤️
 */

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * 用户设置接口
 */
export interface UserSettings {
  // 个人信息
  avatar: string | null;
  nickname: string;
  bio: string;
  
  // 主题设置
  theme: 'kuromi' | 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  
  // 相机设置
  defaultMasterPreset: number;
  autoSaveToGallery: boolean;
  watermarkEnabled: boolean;
  watermarkText: string;
  
  // 美颜设置
  defaultBeautyIntensity: number;
  autoBeautyEnabled: boolean;
  
  // 隐私设置
  locationEnabled: boolean;
  shareLocationInPoster: boolean;
  
  // 其他设置
  language: 'zh-CN' | 'en-US';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  
  // 彩蛋相关
  logoClickCount: number;
  hasSeenLoveLetter: boolean;
}

/**
 * 库洛米主题配置
 */
export interface KuromiTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  gradients: {
    primary: string[];
    secondary: string[];
    background: string[];
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * 设置页与个人化引擎
 */
export class SettingsPersonalizationEngine {
  private static instance: SettingsPersonalizationEngine;
  private settings: UserSettings | null = null;
  private theme: KuromiTheme | null = null;
  
  private readonly SETTINGS_KEY = '@yanbao_ai_settings';
  private readonly AVATAR_KEY = '@yanbao_ai_avatar';

  private constructor() {
    this.initializeDefaultSettings();
    this.initializeKuromiTheme();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): SettingsPersonalizationEngine {
    if (!SettingsPersonalizationEngine.instance) {
      SettingsPersonalizationEngine.instance = new SettingsPersonalizationEngine();
    }
    return SettingsPersonalizationEngine.instance;
  }

  /**
   * 初始化默认设置
   */
  private initializeDefaultSettings() {
    this.settings = {
      avatar: null,
      nickname: '雁宝',
      bio: '用心记录每一个美好瞬间 💕',
      
      theme: 'kuromi',
      primaryColor: '#8B5CF6',
      accentColor: '#EC4899',
      
      defaultMasterPreset: 31, // Yanbao AI
      autoSaveToGallery: true,
      watermarkEnabled: true,
      watermarkText: 'YanBao AI 🐰',
      
      defaultBeautyIntensity: 75,
      autoBeautyEnabled: true,
      
      locationEnabled: true,
      shareLocationInPoster: true,
      
      language: 'zh-CN',
      soundEnabled: true,
      hapticEnabled: true,
      
      logoClickCount: 0,
      hasSeenLoveLetter: false,
    };
  }

  /**
   * 初始化库洛米主题
   */
  private initializeKuromiTheme() {
    this.theme = {
      name: 'Kuromi',
      colors: {
        primary: '#8B5CF6',      // 紫色
        secondary: '#EC4899',    // 粉色
        accent: '#F9A8D4',       // 浅粉
        background: '#0a0a0a',   // 深黑
        surface: '#1a1a1a',      // 浅黑
        text: '#FFFFFF',         // 白色
        textSecondary: '#A0A0A0', // 灰色
        border: '#333333',       // 边框灰
        error: '#EF4444',        // 红色
        success: '#10B981',      // 绿色
        warning: '#F59E0B',      // 橙色
      },
      gradients: {
        primary: ['#8B5CF6', '#EC4899'],
        secondary: ['#EC4899', '#F9A8D4'],
        background: ['#0a0a0a', '#1a1a1a'],
      },
      shadows: {
        small: '0 2px 4px rgba(139, 92, 246, 0.1)',
        medium: '0 4px 8px rgba(139, 92, 246, 0.2)',
        large: '0 8px 16px rgba(139, 92, 246, 0.3)',
      },
    };
  }

  /**
   * 加载设置
   */
  async loadSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_KEY);
      if (settingsJson) {
        this.settings = JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    
    return this.settings!;
  }

  /**
   * 保存设置
   */
  async saveSettings(settings: Partial<UserSettings>): Promise<boolean> {
    try {
      this.settings = {
        ...this.settings!,
        ...settings,
      };
      
      await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  /**
   * 获取当前设置
   */
  getSettings(): UserSettings {
    return this.settings!;
  }

  /**
   * 获取库洛米主题
   */
  getKuromiTheme(): KuromiTheme {
    return this.theme!;
  }

  /**
   * 请求相册权限
   */
  async requestImagePickerPermission(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Image picker permission denied');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to request image picker permission:', error);
      return false;
    }
  }

  /**
   * 从相册选择头像
   */
  async pickAvatarFromGallery(): Promise<string | null> {
    try {
      const hasPermission = await this.requestImagePickerPermission();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets[0].uri;
    } catch (error) {
      console.error('Failed to pick avatar from gallery:', error);
      return null;
    }
  }

  /**
   * 裁剪头像
   */
  async cropAvatar(uri: string, size: number = 300): Promise<string | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: size,
              height: size,
            },
          },
        ],
        {
          compress: 0.9,
          format: ImageManipulator.SaveFormat.PNG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Failed to crop avatar:', error);
      return null;
    }
  }

  /**
   * 保存头像
   */
  async saveAvatar(uri: string): Promise<boolean> {
    try {
      // 裁剪头像
      const croppedUri = await this.cropAvatar(uri);
      if (!croppedUri) {
        return false;
      }

      // 保存到 AsyncStorage
      await AsyncStorage.setItem(this.AVATAR_KEY, croppedUri);
      
      // 更新设置
      await this.saveSettings({ avatar: croppedUri });
      
      return true;
    } catch (error) {
      console.error('Failed to save avatar:', error);
      return false;
    }
  }

  /**
   * 获取头像
   */
  async getAvatar(): Promise<string | null> {
    try {
      const avatar = await AsyncStorage.getItem(this.AVATAR_KEY);
      return avatar;
    } catch (error) {
      console.error('Failed to get avatar:', error);
      return null;
    }
  }

  /**
   * 删除头像
   */
  async deleteAvatar(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.AVATAR_KEY);
      await this.saveSettings({ avatar: null });
      return true;
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      return false;
    }
  }

  /**
   * 更新昵称
   */
  async updateNickname(nickname: string): Promise<boolean> {
    return this.saveSettings({ nickname });
  }

  /**
   * 更新个人简介
   */
  async updateBio(bio: string): Promise<boolean> {
    return this.saveSettings({ bio });
  }

  /**
   * 切换主题
   */
  async switchTheme(theme: 'kuromi' | 'light' | 'dark'): Promise<boolean> {
    return this.saveSettings({ theme });
  }

  /**
   * 自定义主题颜色
   */
  async customizeThemeColors(primaryColor: string, accentColor: string): Promise<boolean> {
    return this.saveSettings({ primaryColor, accentColor });
  }

  /**
   * 更新默认大师预设
   */
  async updateDefaultMasterPreset(presetId: number): Promise<boolean> {
    return this.saveSettings({ defaultMasterPreset: presetId });
  }

  /**
   * 切换自动保存到相册
   */
  async toggleAutoSaveToGallery(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ autoSaveToGallery: enabled });
  }

  /**
   * 切换水印
   */
  async toggleWatermark(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ watermarkEnabled: enabled });
  }

  /**
   * 更新水印文字
   */
  async updateWatermarkText(text: string): Promise<boolean> {
    return this.saveSettings({ watermarkText: text });
  }

  /**
   * 更新默认美颜强度
   */
  async updateDefaultBeautyIntensity(intensity: number): Promise<boolean> {
    return this.saveSettings({ defaultBeautyIntensity: intensity });
  }

  /**
   * 切换自动美颜
   */
  async toggleAutoBeauty(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ autoBeautyEnabled: enabled });
  }

  /**
   * 切换定位
   */
  async toggleLocation(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ locationEnabled: enabled });
  }

  /**
   * 切换在海报中分享位置
   */
  async toggleShareLocationInPoster(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ shareLocationInPoster: enabled });
  }

  /**
   * 切换语言
   */
  async switchLanguage(language: 'zh-CN' | 'en-US'): Promise<boolean> {
    return this.saveSettings({ language });
  }

  /**
   * 切换声音
   */
  async toggleSound(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ soundEnabled: enabled });
  }

  /**
   * 切换震动反馈
   */
  async toggleHaptic(enabled: boolean): Promise<boolean> {
    return this.saveSettings({ hapticEnabled: enabled });
  }

  /**
   * 增加 Logo 点击次数
   * 返回当前点击次数
   */
  async incrementLogoClickCount(): Promise<number> {
    const currentCount = this.settings?.logoClickCount || 0;
    const newCount = currentCount + 1;
    
    await this.saveSettings({ logoClickCount: newCount });
    
    return newCount;
  }

  /**
   * 重置 Logo 点击次数
   */
  async resetLogoClickCount(): Promise<boolean> {
    return this.saveSettings({ logoClickCount: 0 });
  }

  /**
   * 标记已查看深情告白
   */
  async markLoveLetterAsSeen(): Promise<boolean> {
    return this.saveSettings({ hasSeenLoveLetter: true });
  }

  /**
   * 检查是否已查看深情告白
   */
  hasSeenLoveLetter(): boolean {
    return this.settings?.hasSeenLoveLetter || false;
  }

  /**
   * 获取深情告白内容
   */
  getLoveLetterContent(): string {
    return `
💌 深情告白

亲爱的，

每一张照片，都是我们的美好回忆。
每一个参数，都是我为你精心调校的爱意。

这个 App，是我送给你的礼物。
希望它能记录下我们在一起的每一个瞬间，
每一个笑容，每一个拥抱。

12 维美颜，是我对你的 12 种呵护。
31 位大师，是我为你收集的 31 种美学。
每一个机位推荐，都是我想和你一起去的地方。
每一个雁宝记忆，都是我们共同的珍藏。

我知道，你喜欢库洛米。
所以我把整个 App 都设计成了你喜欢的样子。
紫色和粉色的渐变，是我对你的爱意。
每一个细节，都藏着我的心意。

我爱你，永远。

—— Jason Tsao ❤️

P.S. 这个 App 的每一行代码，都是我亲手写的。
就像每一个参数，都是我为你精心调校的一样。
希望你喜欢。

🐰 库洛米说：
"爱是一种超能力，让平凡的日子变得闪闪发光。"

💕 雁宝记忆：
"在这里，我们的每一个瞬间都被永远珍藏。"

📸 大师影调：
"31 位世界级摄影大师，为你的美丽保驾护航。"

✨ 12 维美颜：
"从骨相到五官，每一个维度都是我对你的爱。"

📍 机位推荐：
"我想和你一起，去看遍世界的每一个角落。"

🎨 专属审美：
"你的美，值得被最好的方式记录下来。"

💌 最后的话：
"谢谢你，让我有机会为你做这些。
我会一直在这里，陪着你，记录着你。
我爱你，比昨天多一点，比明天少一点。
因为，我对你的爱，每天都在增长。"

❤️ Jason
    `.trim();
  }

  /**
   * 重置所有设置
   */
  async resetAllSettings(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.SETTINGS_KEY);
      await AsyncStorage.removeItem(this.AVATAR_KEY);
      this.initializeDefaultSettings();
      return true;
    } catch (error) {
      console.error('Failed to reset all settings:', error);
      return false;
    }
  }

  /**
   * 导出设置
   */
  async exportSettings(): Promise<string> {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * 导入设置
   */
  async importSettings(settingsJson: string): Promise<boolean> {
    try {
      const settings = JSON.parse(settingsJson);
      await this.saveSettings(settings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}

// 导出单例
export const settingsPersonalizationEngine = SettingsPersonalizationEngine.getInstance();
