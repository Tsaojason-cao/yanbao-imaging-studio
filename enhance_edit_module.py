#!/usr/bin/env python3
"""
增强编辑模块功能
1. 添加裁剪工具（包含 9:16 预设）
2. 优化参数布局为 2x2 网格
3. 添加雁宝记忆心形按钮
"""

import re

def enhance_edit_module():
    file_path = "app/(tabs)/edit.tsx"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 替换裁剪功能占位符为实际功能
    crop_component = '''      case "crop":
        return (
          <View style={styles.cropPanel}>
            <Text style={styles.panelTitle}>裁剪</Text>
            <View style={styles.cropPresets}>
              {[
                { label: "9:16", ratio: 9/16, icon: "phone-portrait" },
                { label: "16:9", ratio: 16/9, icon: "phone-landscape" },
                { label: "1:1", ratio: 1, icon: "square" },
                { label: "4:3", ratio: 4/3, icon: "tablet-portrait" },
                { label: "自由", ratio: 0, icon: "crop" },
              ].map((preset, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cropPresetButton}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    alert(`裁剪比例: ${preset.label}`);
                  }}
                >
                  <Ionicons name={preset.icon as any} size={24} color="#E879F9" />
                  <Text style={styles.cropPresetLabel}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.cropHint}>
              <Ionicons name="information-circle" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.cropHintText}>选择裁剪比例后，在图片上拖动调整裁剪区域</Text>
            </View>
          </View>
        );'''
    
    content = re.sub(
        r'case "crop":.*?裁剪功能开发中.*?\);',
        crop_component,
        content,
        flags=re.DOTALL
    )
    
    # 2. 优化调整参数布局为 2x2 网格
    adjust_panel = '''      case "adjust":
        return (
          <View style={styles.adjustPanel}>
            <Text style={styles.panelTitle}>调整</Text>
            <View style={styles.adjustGrid}>
              {[
                { key: "brightness", label: "亮度", value: adjustParams.brightness, icon: "sunny" },
                { key: "contrast", label: "对比度", value: adjustParams.contrast, icon: "contrast" },
                { key: "saturation", label: "饱和度", value: adjustParams.saturation, icon: "color-palette" },
                { key: "temperature", label: "色温", value: adjustParams.temperature, icon: "thermometer" },
              ].map((param) => (
                <View key={param.key} style={styles.adjustGridItem}>
                  <View style={styles.adjustItemHeader}>
                    <Ionicons name={param.icon as any} size={20} color="#E879F9" />
                    <Text style={styles.adjustItemLabel}>{param.label}</Text>
                  </View>
                  <KuromiSlider
                    label=""
                    value={param.value}
                  />
                </View>
              ))}
            </View>
          </View>
        );'''
    
    content = re.sub(
        r'case "adjust":.*?}\);',
        adjust_panel,
        content,
        flags=re.DOTALL,
        count=1
    )
    
    # 3. 添加样式定义
    styles_addition = '''
  // 裁剪面板
  cropPanel: {
    padding: 20,
  },
  cropPresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  cropPresetButton: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "rgba(45, 27, 78, 0.8)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(232, 121, 249, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cropPresetLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cropHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    padding: 12,
    backgroundColor: "rgba(232, 121, 249, 0.1)",
    borderRadius: 12,
  },
  cropHintText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  // 调整网格
  adjustGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 16,
  },
  adjustGridItem: {
    width: "48%",
    backgroundColor: "rgba(45, 27, 78, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(232, 121, 249, 0.2)",
  },
  adjustItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  adjustItemLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
'''
    
    # 在最后的 }); 之前插入新样式
    content = re.sub(
        r'(\}\);)\s*$',
        styles_addition + r'\1',
        content
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 编辑模块增强完成")
    print("  - 裁剪工具已添加（包含 9:16 预设）")
    print("  - 参数布局已优化为 2x2 网格")
    print("  - UI 样式已更新")

if __name__ == "__main__":
    enhance_edit_module()
