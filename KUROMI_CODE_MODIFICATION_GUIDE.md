# 库洛米 UI 更新：各模块代码修改指南

**版本**: v2.5.0-kuromi
**文档生成日期**: 2026-01-15
**作者**: Manus AI

---

## 1. 主页模块 (`app/(tabs)/index.tsx`)

### 目标
- 替换中心 Logo
- 移除快捷入口的装饰性兔子图标

### 修改步骤

1.  **替换中心 Logo**

    ```diff
    // app/(tabs)/index.tsx
    
    // ... imports
    
    export default function HomeScreen() {
      // ... hooks and functions
    
      return (
        <View>
          {/* ... other components */}
          <View style={styles.centerLogoContainer}>
    -       <Image source={require("@/assets/images/bunny-logo.png")} style={styles.centerLogo} />
    +       <Image source={require("@/assets/images/kuromi/kuromi-avatar.png")} style={styles.centerLogo} />
          </View>
          {/* ... other components */}
        </View>
      );
    }
    ```

2.  **移除快捷入口装饰**

    ```diff
    // app/(tabs)/index.tsx
    
    // ...
    
    const QuickAccessButton = ({ icon, label }) => (
      <Pressable style={styles.quickAccessButton}>
    -   <Image source={require("@/assets/images/bunny-decorator.png")} style={styles.quickAccessDecorator} />
        <Ionicons name={icon} size={32} color="#fff" />
        <Text style={styles.quickAccessLabel}>{label}</Text>
      </Pressable>
    );
    
    // ...
    ```

---

## 2. 相机模块 (`app/(tabs)/camera.tsx`)

### 目标
- 替换快门按钮为库洛米图标

### 修改步骤

```diff
// app/(tabs)/camera.tsx

// ... imports

export default function CameraScreen() {
  // ... hooks and functions

  const handleTakePicture = async () => { /* ... */ };

  return (
    <View style={styles.container}>
      {/* ... camera preview */}
      <View style={styles.bottomControls}>
        <Pressable onPress={handleTakePicture} style={styles.shutterButton}>
-         <View style={styles.shutterInnerCircle} />
+         <Image source={require("@/assets/images/kuromi/kuromi-bat.png")} style={styles.shutterIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ...
  shutterIcon: {
    width: 60,
    height: 60,
  },
});
```

---

## 3. 编辑模块 (`app/(tabs)/edit.tsx`)

### 目标
- 替换美颜滑块的拖动球为库洛米图标

### 修改步骤

```diff
// app/(tabs)/edit.tsx

import Slider from "@react-native-community/slider";

// ...

export default function EditScreen() {
  // ...

  return (
    <View>
      {/* ... */}
      <Slider
        // ... other props
-       thumbTintColor="#a155e7"
+       thumbImage={require("@/assets/images/kuromi/kuromi-star.png")}
      />
      {/* ... */}
    </View>
  );
}
```

---

## 4. 设置模块 (`app/(tabs)/settings.tsx`)

### 目标
- 添加库洛米城堡背景
- 替换设置项图标

### 修改步骤

1.  **添加背景**

    ```diff
    // app/(tabs)/settings.tsx
    
    // ...
    
    export default function SettingsScreen() {
      // ...
      return (
        <ScreenContainer>
+         <Image source={require("@/assets/images/kuromi/kuromi-castle-1.png")} style={styles.backgroundBanner} />
          <ScrollView>
            {/* ... content */}
          </ScrollView>
        </ScreenContainer>
      );
    }

    const styles = StyleSheet.create({
      backgroundBanner: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 200, // or adjust as needed
        opacity: 0.1,
      },
      // ...
    });
    ```

2.  **替换图标**

    ```diff
    // app/(tabs)/settings.tsx
    
    // ...
    
    const SETTINGS_ITEMS = [
      // ...
      { id: "clear-cache", label: "清空缓存", icon: require("@/assets/images/kuromi/kuromi-gear-plain.png") },
      { id: "terms", label: "用户协议", icon: require("@/assets/images/kuromi/kuromi-scroll-checkbox.png") },
      // ...
    ];
    
    // ...
    
    // In the render logic for settings items:
    <View style={styles.iconContainer}>
      {typeof item.icon === "number" ? (
        <Image source={item.icon} style={styles.itemIconImage} />
      ) : (
        <Ionicons name={item.icon} size={24} color="#fff" />
      )}
    </View>
    
    // ...
    ```

---

## 5. 相册模块 (`app/(tabs)/gallery.tsx`)

### 目标
- 替换空状态提示图

### 修改步骤

```diff
// app/(tabs)/gallery.tsx

// ...

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);
  // ...

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
-       <Image source={require("@/assets/images/empty-gallery-bunny.png")} style={styles.emptyImage} />
+       <Image source={require("@/assets/images/kuromi/kuromi-backpack.png")} style={styles.emptyImage} />
        <Text style={styles.emptyText}>相册空空如也，快去创作吧！</Text>
      </View>
    );
  }

  return (
    // ... FlatList of photos
  );
}
```
