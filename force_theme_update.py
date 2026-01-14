#!/usr/bin/env python3
"""
暴力覆盖全局主题色和视觉效果
确保所有文件都使用库洛米紫色系统
"""

import os
import re
from pathlib import Path

# 定义新的主题色
THEME_COLORS = {
    'primary': '#6A0DAD',      # 库洛米紫色
    'secondary': '#E879F9',    # 粉紫色
    'dark': '#1A1A1A',         # 酷黑色
    'purple_deep': '#2d1b4e',  # 深紫色
    'purple_light': '#A78BFA', # 浅紫色
}

def update_theme_config():
    """更新 theme.config.js"""
    file_path = "theme.config.js"
    
    content = f'''// Yanbao AI v2.2.0 主题配置
// 库洛米紫色系统
export const theme = {{
  colors: {{
    primary: "{THEME_COLORS['primary']}",
    secondary: "{THEME_COLORS['secondary']}",
    dark: "{THEME_COLORS['dark']}",
    purpleDeep: "{THEME_COLORS['purple_deep']}",
    purpleLight: "{THEME_COLORS['purple_light']}",
    
    // 渐变色
    gradientStart: "{THEME_COLORS['purple_deep']}",
    gradientMiddle: "{THEME_COLORS['primary']}",
    gradientEnd: "{THEME_COLORS['purple_deep']}",
    
    // 霓虹效果
    neonPink: "{THEME_COLORS['secondary']}",
    neonPurple: "{THEME_COLORS['primary']}",
  }},
  
  shadows: {{
    neon: {{
      shadowColor: "{THEME_COLORS['secondary']}",
      shadowOffset: {{ width: 0, height: 0 }},
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 20,
    }},
  }},
}};

export default theme;
'''
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {file_path} 已更新")

def update_file_colors(file_path, old_colors, new_color):
    """批量替换文件中的颜色"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        for old_color in old_colors:
            if old_color in content:
                content = content.replace(old_color, new_color)
                modified = True
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        pass
    
    return False

def batch_update_colors():
    """批量更新所有文件中的颜色"""
    
    # 定义需要替换的旧颜色
    old_purple_colors = ['#A78BFA', '#a78bfa', '#9333EA', '#9333ea']
    old_background_colors = ['#1a0a2e', '#1A0A2E']
    
    # 遍历所有 TypeScript/JavaScript 文件
    files_updated = 0
    for root, dirs, files in os.walk('.'):
        # 跳过 node_modules 和其他不需要的目录
        if 'node_modules' in root or '.git' in root or 'dist' in root:
            continue
        
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                
                # 替换紫色为粉紫色
                if update_file_colors(file_path, old_purple_colors, THEME_COLORS['secondary']):
                    files_updated += 1
                    print(f"  更新: {file_path}")
                
                # 替换背景色为深紫色
                if update_file_colors(file_path, old_background_colors, THEME_COLORS['purple_deep']):
                    files_updated += 1
                    print(f"  更新: {file_path}")
    
    print(f"\n✅ 共更新 {files_updated} 个文件")

def main():
    print("🚀 开始暴力覆盖主题色...")
    print(f"   主色: {THEME_COLORS['primary']} (库洛米紫)")
    print(f"   辅色: {THEME_COLORS['secondary']} (粉紫色)")
    print(f"   深色: {THEME_COLORS['dark']} (酷黑色)")
    print()
    
    # 1. 更新主题配置文件
    update_theme_config()
    
    # 2. 批量更新所有文件中的颜色
    batch_update_colors()
    
    print("\n✨ 主题色暴力覆盖完成！")

if __name__ == "__main__":
    main()
