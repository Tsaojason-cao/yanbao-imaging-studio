// 库洛米主题配置
export const theme = {
  colors: {
    primary: '#D4A5FF',      // 库洛米紫色
    secondary: '#FFB3D9',    // 粉色
    background: '#1A0B2E',   // 深紫背景
    surface: '#2D1B4E',      // 卡片背景
    text: '#FFFFFF',         // 主文字
    textSecondary: '#B8A3D1', // 次要文字
    accent: '#FFD700',       // 金色强调
    error: '#FF6B9D',        // 错误提示
    success: '#A8E6CF',      // 成功提示
    
    // 渐变色
    gradientStart: '#D4A5FF',
    gradientEnd: '#FFB3D9',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  
  shadows: {
    sm: {
      shadowColor: '#D4A5FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#D4A5FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#D4A5FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
