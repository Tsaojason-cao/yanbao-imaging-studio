/**
 * yanbao AI v2.2.0 全局主题配置
 * 库洛米商用级设计系统
 */

export const YanbaoTheme = {
  // ============================================
  // 色彩系统
  // ============================================
  colors: {
    // 主色系 - 紫粉渐变
    primary: {
      light: '#E8B4F0',    // 紫粉浅
      medium: '#D4A5E8',   // 紫粉中
      dark: '#C896E0',     // 紫粉深
    },

    // 深色背景 - 深紫蓝
    dark: {
      light: '#4D3B6E',    // 深紫蓝浅
      medium: '#3D2B5E',   // 深紫蓝中
      deep: '#2D1B4E',     // 深紫蓝深
    },

    // 强调色 - 霓虹系
    accent: {
      pink: '#FF6B9D',           // 霓虹粉
      pinkLight: '#FF7BA8',      // 霓虹粉浅
      pinkLighter: '#FF8BB3',    // 霓虹粉较浅
      purple: '#A855F7',         // 霓虹紫
      purpleLight: '#B968FF',    // 霓虹紫浅
      purpleLighter: '#CA7BFF',  // 霓虹紫较浅
    },

    // 中性色
    neutral: {
      white: '#FFFFFF',
      lightGray1: '#F5F5F5',
      lightGray2: '#EEEEEE',
      mediumGray1: '#CCCCCC',
      mediumGray2: '#AAAAAA',
      darkGray1: '#666666',
      darkGray2: '#333333',
    },

    // 功能色
    functional: {
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      info: '#2196F3',
    },
  },

  // ============================================
  // 排版系统
  // ============================================
  typography: {
    fontFamily: {
      heading: 'Montserrat, PingFang SC, sans-serif',
      body: 'Inter, Helvetica Neue, PingFang SC, sans-serif',
      mono: 'Roboto Mono, monospace',
    },

    fontSize: {
      h1: { size: 40, lineHeight: 1.2, weight: 700 },
      h2: { size: 32, lineHeight: 1.3, weight: 700 },
      h3: { size: 24, lineHeight: 1.4, weight: 600 },
      h4: { size: 20, lineHeight: 1.4, weight: 600 },
      body: { size: 16, lineHeight: 1.5, weight: 400 },
      small: { size: 14, lineHeight: 1.6, weight: 400 },
      caption: { size: 12, lineHeight: 1.7, weight: 400 },
    },

    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // ============================================
  // 间距系统
  // ============================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ============================================
  // 圆角系统
  // ============================================
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // ============================================
  // 阴影系统
  // ============================================
  shadows: {
    light: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 8px 16px rgba(0, 0, 0, 0.12)',
    deep: '0 16px 32px rgba(0, 0, 0, 0.16)',
  },

  // ============================================
  // 发光效果
  // ============================================
  glow: {
    weak: '0 0 20px rgba(255, 107, 157, 0.4)',
    strong: '0 0 30px rgba(255, 107, 157, 0.8)',
    purple: '0 0 20px rgba(168, 85, 247, 0.4)',
  },

  // ============================================
  // 动画系统
  // ============================================
  animations: {
    wheelRotate: {
      duration: 3000,
      easing: 'linear',
      loop: true,
    },
    glowPulse: {
      duration: 2000,
      easing: 'ease-in-out',
      loop: true,
    },
    buttonHover: {
      duration: 300,
      easing: 'ease',
    },
    pageEnter: {
      duration: 500,
      easing: 'ease-out',
    },
    sliderDrag: {
      duration: 200,
      easing: 'ease',
    },
    characterFloat: {
      duration: 3000,
      easing: 'ease-in-out',
      loop: true,
    },
  },

  // ============================================
  // 库洛米品牌元素
  // ============================================
  kuromi: {
    positions: {
      homeCenter: { size: 120, animation: 'rotate' },
      cameraTopRight: { size: 60, animation: 'float' },
      galleryCorner: { size: 40, animation: 'static' },
      settingsPage: { size: 80, animation: 'interactive' },
    },

    expressions: {
      default: 'smile',
      shooting: 'focus',
      success: 'celebrate',
      error: 'confused',
      loading: 'thinking',
    },
  },

  // ============================================
  // 组件样式
  // ============================================
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #FF6B9D, #A855F7)',
        text: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: 24,
        shadow: '0 8px 16px rgba(255, 107, 157, 0.3)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.2)',
        text: '#2D1B4E',
        padding: '12px 24px',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
      ghost: {
        background: 'transparent',
        text: '#A855F7',
        padding: '12px 24px',
        borderRadius: 24,
        border: '1px solid #A855F7',
      },
    },

    card: {
      standard: {
        background: '#FFFFFF',
        borderRadius: 16,
        shadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: 16,
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: 16,
      },
      dark: {
        background: 'linear-gradient(135deg, #3D2B5E, #2D1B4E)',
        borderRadius: 16,
        shadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
        padding: 16,
        text: '#FFFFFF',
      },
    },

    input: {
      standard: {
        background: '#F5F5F5',
        border: '1px solid #CCCCCC',
        borderRadius: 8,
        padding: '12px 16px',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: '12px 16px',
      },
    },

    slider: {
      track: 'linear-gradient(90deg, #FF6B9D, #A855F7)',
      thumb: '#FFFFFF',
      height: 6,
      borderRadius: 3,
    },
  },

  // ============================================
  // 响应式断点
  // ============================================
  breakpoints: {
    mobile: 0,
    tablet: 640,
    desktop: 1024,
  },

  // ============================================
  // 梯度渐变
  // ============================================
  gradients: {
    primaryGradient: 'linear-gradient(135deg, #E8B4F0, #C896E0)',
    darkGradient: 'linear-gradient(135deg, #4D3B6E, #2D1B4E)',
    neonGradient: 'linear-gradient(90deg, #FF6B9D, #A855F7)',
    accentGradient: 'linear-gradient(135deg, #FF6B9D, #A855F7)',
  },
};

// ============================================
// 导出主题类型
// ============================================
export type YanbaoThemeType = typeof YanbaoTheme;

// ============================================
// 辅助函数
// ============================================

/**
 * 获取渐变色
 */
export function getGradient(type: 'primary' | 'dark' | 'neon' | 'accent') {
  const gradients: Record<string, string> = {
    primary: YanbaoTheme.gradients.primaryGradient,
    dark: YanbaoTheme.gradients.darkGradient,
    neon: YanbaoTheme.gradients.neonGradient,
    accent: YanbaoTheme.gradients.accentGradient,
  };
  return gradients[type];
}

/**
 * 获取颜色值
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = YanbaoTheme.colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || '#000000';
}

/**
 * 获取间距值
 */
export function getSpacing(level: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): number {
  return YanbaoTheme.spacing[level];
}

/**
 * 获取圆角值
 */
export function getBorderRadius(level: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'): number {
  return YanbaoTheme.borderRadius[level];
}

/**
 * 获取阴影值
 */
export function getShadow(level: 'light' | 'medium' | 'deep'): string {
  return YanbaoTheme.shadows[level];
}

/**
 * 获取字体大小
 */
export function getFontSize(level: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption') {
  return YanbaoTheme.typography.fontSize[level];
}

/**
 * 创建渐变背景样式
 */
export function createGradientStyle(type: 'primary' | 'dark' | 'neon' | 'accent') {
  return {
    background: getGradient(type),
  };
}

/**
 * 创建玻璃态样式
 */
export function createGlassStyle() {
  return {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };
}

/**
 * 创建发光样式
 */
export function createGlowStyle(type: 'weak' | 'strong' | 'purple' = 'weak') {
  return {
    boxShadow: YanbaoTheme.glow[type],
  };
}

export default YanbaoTheme;
