#!/usr/bin/env python3
"""
更新首页 UI 以符合 yanbao_AI_v2.2.0 设计报告要求
"""

import re

def update_home_ui():
    file_path = "app/(tabs)/index.tsx"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 更新主卡片的霓虹边框效果
    content = re.sub(
        r'card: \{[^}]+\}',
        '''card: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(232, 121, 249, 0.8)",
    shadowColor: "#E879F9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  }''',
        content,
        count=1
    )
    
    # 2. 更新卡片渐变背景为深紫色
    content = re.sub(
        r'cardGradient: \{[^}]+\}',
        '''cardGradient: {
    padding: 32,
    minHeight: 400,
    backgroundColor: "rgba(45, 27, 78, 0.95)",
  }''',
        content,
        count=1
    )
    
    # 3. 更新卡片标题的发光效果
    content = re.sub(
        r'cardTitle: \{[^}]+\}',
        '''cardTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 24,
    textShadowColor: "rgba(232, 121, 249, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }''',
        content,
        count=1
    )
    
    # 4. 更新统计图标容器的阴影效果
    content = re.sub(
        r'statIconContainer: \{[^}]+\}',
        '''statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E879F9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }''',
        content,
        count=1
    )
    
    # 5. 更新背景渐变色为粉紫到蓝紫
    content = content.replace(
        'colors={["#1a0a2e", "#2d1b4e", "#1a0a2e"]}',
        'colors={["#2d1b4e", "#6A0DAD", "#2d1b4e"]}'
    )
    
    # 6. 更新流光效果颜色
    content = content.replace(
        'colors={["transparent", "rgba(167, 139, 250, 0.3)", "transparent"]}',
        'colors={["transparent", "rgba(232, 121, 249, 0.4)", "transparent"]}'
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 首页 UI 更新完成")
    print("  - 霓虹边框效果已应用")
    print("  - 深紫色背景已设置")
    print("  - 粉紫渐变已启用")
    print("  - 发光效果已增强")

if __name__ == "__main__":
    update_home_ui()
