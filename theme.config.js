/** @type {const} */
const themeColors = {
  // 主色調 - 庫洛米深紫色系統 (v2.2.0)
  primary: { light: '#6A0DAD', dark: '#6A0DAD' },      // 庫洛米紫
  secondary: { light: '#E879F9', dark: '#E879F9' },    // 粉紫色
  accent: { light: '#A855F7', dark: '#A855F7' },       // 紫色
  
  // 背景色 - 深紫色系統
  background: { light: '#1A0B2E', dark: '#1A0B2E' },   // 深紫色背景 (對應設計稿)
  surface: { light: '#2D1B4E', dark: '#2D1B4E' },      // 深紫色表面
  card: { light: 'rgba(232, 121, 249, 0.15)', dark: 'rgba(232, 121, 249, 0.15)' }, // 粉紫色卡片
  
  // 文字色 - 白色
  foreground: { light: '#FFFFFF', dark: '#FFFFFF' },   // 白色文字
  muted: { light: '#B8B8B8', dark: '#B8B8B8' },        // 灰色文字
  
  // 邊框 - 霓虹紫色
  border: { light: 'rgba(232, 121, 249, 0.5)', dark: 'rgba(232, 121, 249, 0.5)' },
  
  // 狀態色
  success: { light: '#10B981', dark: '#34D399' },
  warning: { light: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#EF4444', dark: '#F87171' },
  
  // 漸變色 - 庫洛米深紫色漸變
  gradient1: { light: '#1A0B2E', dark: '#1A0B2E' },    // 深紫色
  gradient2: { light: '#E879F9', dark: '#E879F9' },    // 粉紫色
};

module.exports = { themeColors };
