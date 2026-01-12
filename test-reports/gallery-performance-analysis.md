# 相册与性能测试分析报告

## 测试模块：Gallery Performance

### 1. 真实读取测试

#### 1.1 相册权限处理
**代码位置**: `app/(tabs)/gallery.tsx:52, 57-64`

```typescript
const [permission, requestPermission] = MediaLibrary.usePermissions();

if (!permission?.granted) {
  const { status } = await requestPermission();
  if (status !== "granted") {
    console.log("相册权限未授予");
    setLoading(false);
    return;
  }
}
```

**测试结果**:
- ✅ **权限请求**: 使用 expo-media-library 的 hooks
- ✅ **权限检查**: 在加载前检查权限状态
- ✅ **UI 反馈**: 提供权限请求界面
- ✅ **错误处理**: 权限被拒绝时停止加载

#### 1.2 照片加载逻辑
**代码位置**: `app/(tabs)/gallery.tsx:67-95`

```typescript
// 获取相册中的照片
const { assets } = await MediaLibrary.getAssetsAsync({
  first: 500, // 加载最近500张照片
  mediaType: "photo",
  sortBy: [[MediaLibrary.SortBy.creationTime, false]], // 按时间倒序
});

// 转换为应用内格式
const formattedPhotos: Photo[] = await Promise.all(
  assets.map(async (asset) => {
    // 获取真实的本地URI
    const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
    const localUri = assetInfo.localUri || asset.uri;

    return {
      id: asset.id,
      uri: localUri,
      date: formatDate(asset.creationTime),
      timestamp: asset.creationTime,
    };
  })
);
```

**测试结果**:
- ✅ **真实读取**: 从设备存储读取实际照片
- ✅ **数量限制**: 限制加载 500 张，避免性能问题
- ✅ **时间排序**: 按创建时间倒序（最新在前）
- ✅ **本地 URI**: 获取真实的本地文件路径
- ⚠️ **性能问题**: Promise.all 同时处理 500 张照片可能阻塞

**优化建议**:

```typescript
// 分批加载照片，避免一次性加载过多
const loadPhotos = async () => {
  try {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== "granted") {
        console.log("相册权限未授予");
        setLoading(false);
        return;
      }
    }

    // 分页加载
    const BATCH_SIZE = 100;
    let allPhotos: Photo[] = [];
    let hasMore = true;
    let after: string | undefined;

    while (hasMore && allPhotos.length < 500) {
      const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
        first: BATCH_SIZE,
        after,
        mediaType: "photo",
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      });

      // 批量处理当前批次
      const batchPhotos = assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri, // 先使用基础 URI，按需加载详细信息
        date: formatDate(asset.creationTime),
        timestamp: asset.creationTime,
      }));

      allPhotos = [...allPhotos, ...batchPhotos];
      after = endCursor;
      hasMore = hasNextPage;

      // 实时更新 UI
      setPhotos([...allPhotos]);
    }
  } catch (error) {
    console.error("加载照片失败:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
```

### 2. 压力测试

#### 2.1 FlashList 使用
**代码位置**: `app/(tabs)/gallery.tsx:2`

```typescript
import { FlashList } from "@shopify/flash-list";
```

**问题发现**: ❌ **导入了 FlashList 但未使用**

**当前实现**: 使用 ScrollView + flexWrap 渲染网格

```typescript
<ScrollView style={{ flex: 1 }}>
  {sections.map((section) => (
    <View key={section.title}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {section.data.map((photo) => (
          <Image source={{ uri: photo.uri }} />
        ))}
      </View>
    </View>
  ))}
</ScrollView>
```

**性能分析**:
- ❌ **无虚拟化**: ScrollView 会渲染所有照片
- ❌ **内存占用**: 500 张照片全部加载到内存
- ❌ **滚动性能**: 大量图片导致滚动卡顿
- ❌ **无回收机制**: 不可见的图片仍占用内存

**优化建议**:
使用 FlashList 实现虚拟化渲染：

```typescript
import { FlashList } from "@shopify/flash-list";

// 将照片展平为一维数组，添加日期分隔符
const flattenPhotos = (): Array<{ type: "header"; date: string } | { type: "photo"; data: Photo }> => {
  const result: Array<{ type: "header"; date: string } | { type: "photo"; data: Photo }> = [];
  const groupedPhotos = groupPhotosByDate();

  Object.keys(groupedPhotos).forEach((date) => {
    result.push({ type: "header", date });
    groupedPhotos[date].forEach((photo) => {
      result.push({ type: "photo", data: photo });
    });
  });

  return result;
};

// 使用 FlashList 渲染
<FlashList
  data={flattenPhotos()}
  renderItem={({ item }) => {
    if (item.type === "header") {
      return (
        <Text style={styles.dateHeader}>{item.date}</Text>
      );
    }

    return (
      <Pressable
        style={styles.photoItem}
        onPress={() => handlePhotoPress(item.data)}
      >
        <Image
          source={{ uri: item.data.uri }}
          style={styles.photoImage}
        />
      </Pressable>
    );
  }}
  estimatedItemSize={IMAGE_SIZE}
  numColumns={3}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
    />
  }
  onEndReached={() => {
    // 加载更多照片
    loadMorePhotos();
  }}
  onEndReachedThreshold={0.5}
/>
```

#### 2.2 图片加载优化
**当前实现**: 直接使用 Image 组件

```typescript
<Image
  source={{ uri: photo.uri }}
  style={{ width: "100%", height: "100%", resizeMode: "cover" }}
/>
```

**性能问题**:
- ⚠️ **原图加载**: 加载原始分辨率图片
- ⚠️ **无缓存策略**: 每次滚动都重新加载
- ⚠️ **无占位图**: 加载过程中显示空白

**优化建议**:

```typescript
import { Image as ExpoImage } from "expo-image";

// 使用 expo-image 替代原生 Image
<ExpoImage
  source={{ uri: photo.uri }}
  style={styles.photoImage}
  contentFit="cover"
  transition={200}
  placeholder={require("@/assets/images/placeholder.png")}
  cachePolicy="memory-disk" // 内存+磁盘缓存
  recyclingKey={photo.id} // 复用视图
/>
```

或使用缩略图：

```typescript
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";

// 生成缩略图
const generateThumbnail = async (assetId: string): Promise<string> => {
  const asset = await MediaLibrary.getAssetInfoAsync(assetId);
  const manipResult = await ImageManipulator.manipulateAsync(
    asset.localUri || asset.uri,
    [{ resize: { width: IMAGE_SIZE * 2 } }], // 2x 分辨率
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult.uri;
};
```

#### 2.3 内存监控
**缺失功能**: 没有内存监控

**优化建议**:

```typescript
import { AppState } from "react-native";

// 监听应用状态，在后台时清理缓存
useEffect(() => {
  const subscription = AppState.addEventListener("change", (nextAppState) => {
    if (nextAppState === "background") {
      // 清理图片缓存
      ExpoImage.clearMemoryCache();
    }
  });

  return () => subscription.remove();
}, []);

// 内存警告处理
useEffect(() => {
  const handleMemoryWarning = () => {
    console.warn("内存警告，清理缓存");
    ExpoImage.clearMemoryCache();
    // 减少加载的照片数量
    setPhotos((prev) => prev.slice(0, 100));
  };

  // React Native 内存警告事件（需要原生模块支持）
  // DeviceEventEmitter.addListener("memoryWarning", handleMemoryWarning);

  return () => {
    // DeviceEventEmitter.removeListener("memoryWarning", handleMemoryWarning);
  };
}, []);
```

### 3. 日期分组测试

#### 3.1 分组逻辑
**代码位置**: `app/(tabs)/gallery.tsx:179-190`

```typescript
const groupPhotosByDate = (): { [key: string]: Photo[] } => {
  const grouped: { [key: string]: Photo[] } = {};

  photos.forEach((photo) => {
    if (!grouped[photo.date]) {
      grouped[photo.date] = [];
    }
    grouped[photo.date].push(photo);
  });

  return grouped;
};
```

**测试结果**:
- ✅ **逻辑正确**: 按日期分组照片
- ✅ **性能良好**: O(n) 时间复杂度
- ⚠️ **重复计算**: 每次渲染都重新分组

**优化建议**:

```typescript
import { useMemo } from "react";

// 使用 useMemo 缓存分组结果
const groupedPhotos = useMemo(() => {
  const grouped: { [key: string]: Photo[] } = {};

  photos.forEach((photo) => {
    if (!grouped[photo.date]) {
      grouped[photo.date] = [];
    }
    grouped[photo.date].push(photo);
  });

  return grouped;
}, [photos]);
```

#### 3.2 日期格式化
**代码位置**: `app/(tabs)/gallery.tsx:163-176`

```typescript
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "今天";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "昨天";
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};
```

**测试结果**:
- ✅ **友好显示**: 今天、昨天、日期
- ✅ **逻辑正确**: 日期比较准确
- ⚠️ **性能问题**: 每张照片都创建新的 Date 对象

**优化建议**:

```typescript
// 缓存今天和昨天的日期字符串
const today = new Date().toDateString();
const yesterday = new Date(Date.now() - 86400000).toDateString();

const formatDate = (timestamp: number): string => {
  const dateStr = new Date(timestamp).toDateString();

  if (dateStr === today) {
    return "今天";
  } else if (dateStr === yesterday) {
    return "昨天";
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};
```

### 4. 下拉刷新测试

#### 4.1 刷新逻辑
**代码位置**: `app/(tabs)/gallery.tsx:193-196, 277-279`

```typescript
const onRefresh = () => {
  setRefreshing(true);
  loadPhotos();
};

<RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  tintColor={colors.primary}
/>
```

**测试结果**:
- ✅ **功能完整**: 支持下拉刷新
- ✅ **状态管理**: 正确管理 refreshing 状态
- ✅ **UI 反馈**: 显示刷新指示器

### 5. 预设管理测试

#### 5.1 预设存储
**代码位置**: `app/(tabs)/gallery.tsx:99-126`

```typescript
const loadPresets = async () => {
  try {
    const presetsDir = `${FileSystem.documentDirectory!}presets/`;
    const dirInfo = await FileSystem.getInfoAsync(presetsDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(presetsDir, { intermediates: true });
      await saveDefaultPresets(presetsDir);
    }

    const files = await FileSystem.readDirectoryAsync(presetsDir);
    const loadedPresets: MemoryPreset[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const content = await FileSystem.readAsStringAsync(`${presetsDir}${file}`);
        const preset = JSON.parse(content);
        loadedPresets.push(preset);
      }
    }

    setPresets(loadedPresets);
  } catch (error) {
    console.error("加载预设失败:", error);
  }
};
```

**测试结果**:
- ✅ **文件系统**: 使用 expo-file-system 存储预设
- ✅ **目录管理**: 自动创建预设目录
- ✅ **默认预设**: 首次使用时创建默认预设
- ✅ **JSON 格式**: 使用 JSON 存储预设数据
- ⚠️ **错误处理**: 缺少文件读取失败的处理

**优化建议**:

```typescript
const loadPresets = async () => {
  try {
    const presetsDir = `${FileSystem.documentDirectory!}presets/`;
    const dirInfo = await FileSystem.getInfoAsync(presetsDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(presetsDir, { intermediates: true });
      await saveDefaultPresets(presetsDir);
    }

    const files = await FileSystem.readDirectoryAsync(presetsDir);
    const loadedPresets: MemoryPreset[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const content = await FileSystem.readAsStringAsync(`${presetsDir}${file}`);
          const preset = JSON.parse(content);
          
          // 验证预设数据结构
          if (preset.id && preset.name && preset.params) {
            loadedPresets.push(preset);
          } else {
            console.warn(`无效的预设文件: ${file}`);
          }
        } catch (fileError) {
          console.error(`读取预设文件失败: ${file}`, fileError);
          // 删除损坏的文件
          await FileSystem.deleteAsync(`${presetsDir}${file}`, { idempotent: true });
        }
      }
    }

    setPresets(loadedPresets);
  } catch (error) {
    console.error("加载预设失败:", error);
    // 降级：使用内存中的默认预设
    setPresets(getDefaultPresets());
  }
};
```

#### 5.2 默认预设
**代码位置**: `app/(tabs)/gallery.tsx:130-160`

```typescript
const defaultPresets: MemoryPreset[] = [
  {
    id: "1",
    name: "雁宝专属",
    description: "为雁宝定制的专属美颜参数",
    color: "#E879F9",
    params: { smooth: 80, whiten: 70, thinFace: 60, bigEye: 75, ruddy: 50, sharpen: 40, brightness: 30 },
  },
  {
    id: "2",
    name: "日常自然",
    description: "适合日常拍摄的自然风格",
    color: "#10B981",
    params: { smooth: 40, whiten: 30, thinFace: 20, bigEye: 35, ruddy: 25, sharpen: 50, brightness: 10 },
  },
  {
    id: "3",
    name: "冰壳模式",
    description: "清冷高级的冰壳质感",
    color: "#3B82F6",
    params: { smooth: 90, whiten: 85, thinFace: 70, bigEye: 80, ruddy: 15, sharpen: 60, brightness: 40 },
  },
];
```

**测试结果**:
- ✅ **预设完整**: 包含 3 个默认预设
- ✅ **参数丰富**: 7 个美颜参数
- ✅ **主题配色**: 每个预设有独特颜色

### 6. 性能指标

#### 6.1 加载时间
**预期指标**:
- 初次加载 100 张照片: < 2s
- 初次加载 500 张照片: < 5s
- 下拉刷新: < 1s

**优化建议**:
```typescript
// 添加性能监控
const startTime = Date.now();
await loadPhotos();
const loadTime = Date.now() - startTime;
console.log(`照片加载耗时: ${loadTime}ms`);

if (loadTime > 5000) {
  console.warn("照片加载过慢，建议优化");
}
```

#### 6.2 内存占用
**预期指标**:
- 100 张照片: < 200MB
- 500 张照片: < 500MB
- 滚动过程: 内存稳定，无持续增长

**监控方法**:
```typescript
// 使用 React DevTools Profiler
import { Profiler } from "react";

<Profiler
  id="GalleryScreen"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} ${phase} 耗时: ${actualDuration}ms`);
  }}
>
  {/* 相册内容 */}
</Profiler>
```

#### 6.3 帧率
**预期指标**:
- 滚动帧率: > 55 FPS
- 图片加载时: > 50 FPS
- 无明显卡顿

**优化建议**:
```typescript
// 使用 InteractionManager 延迟非关键操作
import { InteractionManager } from "react-native";

useEffect(() => {
  InteractionManager.runAfterInteractions(() => {
    // 在动画完成后加载预设
    loadPresets();
  });
}, []);
```

## 测试总结

### ✅ 已实现功能
1. 真实照片读取
2. 相册权限处理
3. 日期分组和格式化
4. 下拉刷新
5. 预设管理（文件系统存储）
6. 空状态和权限提示

### ⚠️ 需要优化
1. 使用 FlashList 替代 ScrollView
2. 分批加载照片
3. 图片缓存和缩略图
4. 日期格式化性能
5. 分组结果缓存
6. 预设文件错误处理

### ❌ 缺少实现
1. 虚拟化渲染
2. 图片懒加载
3. 内存监控和清理
4. 性能指标收集
5. 照片详情页
6. 照片编辑功能

### 硬件依赖风险
1. **存储空间**: 大量照片需要足够存储
2. **内存容量**: 低端设备可能内存不足
3. **GPU 性能**: 图片渲染依赖 GPU

### 容错机制建议
1. 内存不足时自动减少加载数量
2. 图片加载失败时显示占位图
3. 权限被拒绝时提供引导
4. 文件系统错误时降级到内存存储

```typescript
// 内存不足降级方案
const MEMORY_LIMIT_MB = 300;
let currentMemoryUsage = 0;

const loadPhotosWithMemoryLimit = async () => {
  const maxPhotos = currentMemoryUsage > MEMORY_LIMIT_MB ? 100 : 500;
  
  const { assets } = await MediaLibrary.getAssetsAsync({
    first: maxPhotos,
    mediaType: "photo",
    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  });

  // 监控内存使用
  if (Platform.OS === "android") {
    // 使用原生模块获取内存使用情况
    // currentMemoryUsage = await NativeModules.MemoryMonitor.getCurrentUsage();
  }
};
```

## 下一步行动
1. 集成 FlashList 实现虚拟化
2. 实现图片缩略图生成
3. 添加内存监控
4. 优化图片加载策略
5. 实现照片详情页
6. 添加性能指标收集
