#!/usr/bin/env python3
"""
在相机和相册页面添加"雁宝记忆"心形按钮
"""

import re

def add_memory_button_to_camera():
    """在相机页面添加雁宝记忆按钮"""
    file_path = "app/(tabs)/camera.tsx"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 在顶部控制栏添加雁宝记忆按钮
    memory_button = '''
          <TouchableOpacity 
            style={styles.memoryButton} 
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              router.push("/(tabs)/inspiration");
            }}
          >
            <Ionicons name="heart" size={28} color="#F472B6" />
            <Text style={{ fontSize: 10, color: "#F472B6", marginTop: 2 }}>记忆</Text>
          </TouchableOpacity>
'''
    
    # 在机位按钮后添加记忆按钮
    content = re.sub(
        r'(<TouchableOpacity style=\{styles\.topButton\} onPress=\{toggleCameraFacing\}>)',
        memory_button + r'\n          \1',
        content,
        count=1
    )
    
    # 添加样式
    memory_button_style = '''  memoryButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(244, 114, 182, 0.2)",
    borderWidth: 2,
    borderColor: "#F472B6",
    shadowColor: "#F472B6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
'''
    
    # 在样式定义末尾添加
    content = re.sub(
        r'(\}\);)\s*$',
        memory_button_style + r'\1',
        content
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 相机页面已添加雁宝记忆按钮")

def add_memory_button_to_gallery():
    """在相册页面添加雁宝记忆按钮"""
    file_path = "app/(tabs)/gallery.tsx"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 Tab 切换区域，在其后添加雁宝记忆按钮
    memory_button = '''
        {/* 雁宝记忆按钮 */}
        <Pressable
          style={({ pressed }) => [
            styles.memoryFloatingButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
          ]}
          onPress={() => {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            router.push("/(tabs)/inspiration");
          }}
        >
          <LinearGradient
            colors={["#F472B6", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.memoryButtonGradient}
          >
            <Ionicons name="heart" size={28} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
'''
    
    # 在返回的 JSX 中添加浮动按钮
    content = re.sub(
        r'(</ScreenContainer>)',
        memory_button + r'\n      \1',
        content,
        count=1
    )
    
    # 添加样式
    memory_button_style = '''  memoryFloatingButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: "#F472B6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100,
  },
  memoryButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
'''
    
    # 在文件末尾添加样式（如果有 StyleSheet.create）
    if 'StyleSheet.create' in content:
        content = re.sub(
            r'(\}\);)\s*$',
            memory_button_style + r'\1',
            content
        )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 相册页面已添加雁宝记忆浮动按钮")

if __name__ == "__main__":
    add_memory_button_to_camera()
    add_memory_button_to_gallery()
    print("\n✨ 雁宝记忆按钮添加完成")
