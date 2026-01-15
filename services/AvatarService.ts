import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_KEY = '@yanbao_user_avatar';

/**
 * 头像存储服务
 * 用于保存和加载用户自定义的头像
 */
export class AvatarService {
  /**
   * 保存用户头像 URI
   * @param uri 图片的本地 URI
   */
  static async saveAvatar(uri: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, uri);
      console.log('头像已保存:', uri);
    } catch (error) {
      console.error('保存头像失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户头像 URI
   * @returns 图片的本地 URI，如果没有则返回 null
   */
  static async getAvatar(): Promise<string | null> {
    try {
      const uri = await AsyncStorage.getItem(AVATAR_KEY);
      return uri;
    } catch (error) {
      console.error('获取头像失败:', error);
      return null;
    }
  }

  /**
   * 删除用户头像（恢复默认）
   */
  static async deleteAvatar(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AVATAR_KEY);
      console.log('头像已删除，恢复默认');
    } catch (error) {
      console.error('删除头像失败:', error);
      throw error;
    }
  }
}
