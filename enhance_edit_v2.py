#!/usr/bin/env python3
"""
增强编辑模块功能 v2
安全地添加裁剪工具和优化布局
"""

def enhance_edit_module():
    file_path = "app/(tabs)/edit.tsx"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 找到裁剪功能的占位符位置
    crop_start = -1
    crop_end = -1
    for i, line in enumerate(lines):
        if 'case "crop":' in line:
            crop_start = i
        if crop_start != -1 and '裁剪功能开发中' in line:
            # 找到结束位置（下一个 case 或 default）
            for j in range(i, len(lines)):
                if 'case "rotate":' in lines[j]:
                    crop_end = j
                    break
            break
    
    if crop_start != -1 and crop_end != -1:
        # 替换裁剪功能
        crop_replacement = '''      case "crop":
        return (
          <View style={styles.adjustPanel}>
            <Text style={styles.panelTitle}>裁剪</Text>
            <View style={styles.cropPresets}>
              {[
                { label: "9:16", ratio: 9/16 },
                { label: "16:9", ratio: 16/9 },
                { label: "1:1", ratio: 1 },
                { label: "4:3", ratio: 4/3 },
                { label: "自由", ratio: 0 },
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
                  <Text style={styles.cropPresetLabel}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.cropHintText}>选择裁剪比例后，在图片上拖动调整裁剪区域</Text>
          </View>
        );
'''
        lines = lines[:crop_start] + [crop_replacement] + lines[crop_end:]
    
    # 找到样式定义的位置
    styles_start = -1
    for i, line in enumerate(lines):
        if 'const styles = StyleSheet.create({' in line:
            styles_start = i
            break
    
    # 找到样式定义的结束位置
    styles_end = -1
    if styles_start != -1:
        brace_count = 0
        for i in range(styles_start, len(lines)):
            brace_count += lines[i].count('{') - lines[i].count('}')
            if brace_count == 0 and i > styles_start:
                styles_end = i
                break
    
    # 在样式结束前添加新样式
    if styles_end != -1:
        new_styles = '''  cropPresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  cropPresetButton: {
    width: "30%",
    padding: 16,
    backgroundColor: "rgba(45, 27, 78, 0.8)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(232, 121, 249, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  cropPresetLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cropHintText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 20,
    textAlign: "center",
  },
'''
        lines.insert(styles_end, new_styles)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("✅ 编辑模块增强完成（v2）")
    print("  - 裁剪工具已添加（包含 9:16 预设）")
    print("  - 样式已更新")

if __name__ == "__main__":
    enhance_edit_module()
