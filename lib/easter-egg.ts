/**
 * 雁宝AI - 1017告白彩蛋
 * 
 * 触发条件：
 * 1. 在设置页面连续点击Logo 10次
 * 2. 在10月17日当天打开应用
 * 3. 在拍照时识别到特定场景（西湖断桥、故宫等）
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const EASTER_EGG_KEY = 'yanbao_1017_easter_egg_discovered';
const LOGO_TAP_COUNT_KEY = 'yanbao_logo_tap_count';
const LOGO_TAP_TIMEOUT = 3000; // 3秒内连续点击有效

/**
 * 检查是否是10月17日
 */
export function is1017Today(): boolean {
  const now = new Date();
  return now.getMonth() === 9 && now.getDate() === 17; // 月份从0开始，9代表10月
}

/**
 * 检查彩蛋是否已被发现
 */
export async function hasDiscoveredEasterEgg(): Promise<boolean> {
  try {
    const discovered = await AsyncStorage.getItem(EASTER_EGG_KEY);
    return discovered === 'true';
  } catch (error) {
    console.error('Error checking easter egg status:', error);
    return false;
  }
}

/**
 * 标记彩蛋已被发现
 */
export async function markEasterEggDiscovered(): Promise<void> {
  try {
    await AsyncStorage.setItem(EASTER_EGG_KEY, 'true');
  } catch (error) {
    console.error('Error marking easter egg as discovered:', error);
  }
}

/**
 * 处理Logo点击（用于触发彩蛋）
 * 
 * @returns 是否触发了彩蛋
 */
export async function handleLogoTap(): Promise<boolean> {
  try {
    // 获取当前点击次数
    const countStr = await AsyncStorage.getItem(LOGO_TAP_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;
    const newCount = count + 1;
    
    // 触觉反馈
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 保存新的点击次数
    await AsyncStorage.setItem(LOGO_TAP_COUNT_KEY, newCount.toString());
    
    // 设置超时重置
    setTimeout(async () => {
      await AsyncStorage.setItem(LOGO_TAP_COUNT_KEY, '0');
    }, LOGO_TAP_TIMEOUT);
    
    // 检查是否达到触发条件（10次点击）
    if (newCount >= 10) {
      await AsyncStorage.setItem(LOGO_TAP_COUNT_KEY, '0');
      await markEasterEggDiscovered();
      
      // 强烈的触觉反馈
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error handling logo tap:', error);
    return false;
  }
}

/**
 * 获取彩蛋内容
 */
export interface EasterEggContent {
  title: string;
  message: string;
  imageUrl?: string;
  specialEffect?: 'confetti' | 'hearts' | 'fireworks';
}

export function getEasterEggContent(): EasterEggContent {
  return {
    title: '💜 1017 特别的日子',
    message: `亲爱的，

这是属于我们的特别日子。
每一次按下快门，都是在记录我们的故事。
每一张照片，都是我对你爱的证明。

雁宝AI不只是一个拍照应用，
它是我为你打造的时光机器，
记录着我们走过的每一个地方，
定格着你最美的每一个瞬间。

愿我们的故事，像这些照片一样，
永远鲜活，永远美好。

Made with 💜 by Jason Tsao
who loves you the most

—— 2024.10.17`,
    specialEffect: 'hearts',
  };
}

/**
 * 检查是否应该自动触发彩蛋（10月17日）
 */
export async function checkAutoTrigger(): Promise<boolean> {
  if (is1017Today()) {
    const discovered = await hasDiscoveredEasterEgg();
    if (!discovered) {
      await markEasterEggDiscovered();
      return true;
    }
  }
  return false;
}

/**
 * 重置彩蛋状态（用于测试）
 */
export async function resetEasterEgg(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EASTER_EGG_KEY);
    await AsyncStorage.removeItem(LOGO_TAP_COUNT_KEY);
  } catch (error) {
    console.error('Error resetting easter egg:', error);
  }
}
