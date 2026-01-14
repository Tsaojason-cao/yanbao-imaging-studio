/** @type {const} */
const themeColors = {
  // 主色調 - 庫洛米紫色系統 (強制覆蓋)
  primary: { light: '#6A0DAD', dark: '#6A0DAD' },      // 庫洛米紫
  secondary: { light: '#E879F9', dark: '#E879F9' },    // 粉紫色
  accent: { light: '#A855F7', dark: '#A855F7' },       // 紫色
  
  // 背景色 - 酷黑色
  background: { light: '#1A1A1A', dark: '#1A1A1A' },   // 酷黑色
  surface: { light: '#2D1B4E', dark: '#2D1B4E' },      // 深紫色
  card: { light: 'rgba(45, 27, 78, 0.95)', dark: 'rgba(45, 27, 78, 0.95)' }, // 深紫卡片
  
  // 文字色 - 白色
  foreground: { light: '#FFFFFF', dark: '#FFFFFF' },   // 白色文字
  muted: { light: '#B8B8B8', dark: '#B8B8B8' },        // 灰色文字
  
  // 邊框 - 紫色
  border: { light: 'rgba(106, 13, 173, 0.3)', dark: 'rgba(106, 13, 173, 0.3)' },
  
  // 狀態色
  success: { light: '#10B981', dark: '#34D399' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
  
  // 漸變色 - 庫洛米紫色漸變
  gradient1: { light: '#2D1B4E', dark: '#2D1B4E' },    // 深紫色
  gradient2: { light: '#E879F9', dark: '#E879F9' },    // 粉紫色
};

module.exports = { themeColors };
