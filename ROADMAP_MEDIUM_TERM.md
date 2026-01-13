# yanbao AI 中期優化計畫（2-4 週）

## 計畫概述

本計畫涵蓋性能優化和監控工具集成工作，旨在進一步提升 yanbao AI 的性能表現和可維護性。

**計畫周期**：2-4 週
**目標**：達到業界先進的性能水平
**成功標準**：圖片懶加載完成、性能監控工具集成、電池消耗降低至 < 5% / 30 分鐘

---

## 第一週：圖片懶加載實現

### 1.1 圖片懶加載方案設計

#### 需求分析

**當前問題**：
- 相冊加載 500 張照片時內存占用達到 300+ MB
- 快速滾動時會出現卡頓
- 圖片加載時間過長

**優化目標**：
- 內存占用降低至 < 200 MB
- 滾動幀率穩定在 55+ FPS
- 圖片加載時間 < 500ms

#### 技術方案

**方案 1：FastImage 庫（推薦）**

優點：
- 高性能圖片加載
- 支持緩存
- 支持漸進式加載
- 支持圖片預加載

缺點：
- 需要額外依賴
- 配置相對複雜

**方案 2：React Native Image 原生方案**

優點：
- 無需額外依賴
- 輕量級
- 易於集成

缺點：
- 功能有限
- 性能不如 FastImage

**推薦方案**：使用 FastImage + 虛擬化列表 + 圖片預加載

### 1.2 FastImage 集成

#### 安裝依賴

```bash
# 安裝 FastImage
npm install react-native-fast-image

# 安裝 Pod 依賴（iOS）
cd ios && pod install && cd ..

# 重啟開發服務器
npm start
```

#### 基礎使用

```typescript
import FastImage from 'react-native-fast-image';

// 基礎圖片加載
<FastImage
  source={{ uri: 'https://example.com/photo.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// 帶緩存的圖片加載
<FastImage
  source={{
    uri: 'https://example.com/photo.jpg',
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>

// 帶預加載的圖片
FastImage.preload([
  { uri: 'https://example.com/photo1.jpg' },
  { uri: 'https://example.com/photo2.jpg' },
  { uri: 'https://example.com/photo3.jpg' },
]);
```

### 1.3 相冊模塊優化

#### 優化前代碼

```typescript
// ❌ 不推薦：使用 ScrollView，會渲染所有照片
const GalleryModule = ({ photos }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {photos.map((photo) => (
          <Image
            key={photo.id}
            source={{ uri: photo.url }}
            style={styles.thumbnail}
          />
        ))}
      </View>
    </ScrollView>
  );
};
```

#### 優化後代碼

```typescript
// ✅ 推薦：使用 FlatList + FastImage + 虛擬化
import FastImage from 'react-native-fast-image';

const GalleryModule = ({ photos }) => {
  // 預加載即將顯示的圖片
  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    const uris = viewableItems
      .filter((item) => item.isViewable)
      .map((item) => ({ uri: item.item.url }));
    
    if (uris.length > 0) {
      FastImage.preload(uris);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => (
        <FastImage
          source={{
            uri: item.url,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={3}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};
```

### 1.4 圖片緩存策略

#### 緩存配置

```typescript
// 配置 FastImage 緩存
import FastImage from 'react-native-fast-image';

// 清除所有緩存
FastImage.clearMemoryCache();
FastImage.clearDiskCache();

// 設置緩存策略
const cacheStrategies = {
  // 優先使用緩存
  cacheFirst: FastImage.cacheControl.immutable,
  
  // 優先使用網絡
  networkFirst: FastImage.cacheControl.web,
  
  // 緩存優先，網絡備用
  staleWhileRevalidate: FastImage.cacheControl.cacheOnly,
};
```

#### 緩存大小管理

```typescript
// 限制緩存大小
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100 MB

// 定期清理過期緩存
useEffect(() => {
  const cleanupInterval = setInterval(() => {
    // 獲取緩存大小
    const cacheSize = getCacheSize();
    
    if (cacheSize > MAX_CACHE_SIZE) {
      // 清理 50% 的緩存
      FastImage.clearDiskCache();
    }
  }, 1000 * 60 * 60); // 每小時檢查一次

  return () => clearInterval(cleanupInterval);
}, []);
```

---

## 第二週：性能監控工具集成

### 2.1 Flipper 集成

#### 安裝依賴

```bash
# 安裝 Flipper
npm install --save-dev flipper

# 安裝 Flipper 插件
npm install --save-dev react-native-flipper
```

#### 配置 Flipper

```typescript
// 在應用入口文件中添加
import { initializeFlipper } from 'react-native-flipper';

if (__DEV__) {
  initializeFlipper(() => {});
}
```

#### 性能監控

```typescript
// 創建性能監控插件
import { addPlugin } from 'react-native-flipper';

const performancePlugin = {
  getId: () => 'performance-monitor',
  onConnect: (connection) => {
    // 監控幀率
    let frameCount = 0;
    let lastTime = Date.now();

    const monitorFrameRate = () => {
      frameCount++;
      const now = Date.now();
      
      if (now - lastTime >= 1000) {
        connection.send('frame-rate', {
          fps: frameCount,
          timestamp: now,
        });
        frameCount = 0;
        lastTime = now;
      }

      requestAnimationFrame(monitorFrameRate);
    };

    monitorFrameRate();

    // 監控內存
    const monitorMemory = () => {
      const memoryInfo = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
      };

      connection.send('memory', memoryInfo);
    };

    setInterval(monitorMemory, 1000);
  },
  onDisconnect: () => {},
};

addPlugin(performancePlugin);
```

### 2.2 React Native Debugger

#### 安裝和配置

```bash
# 安裝 React Native Debugger
npm install -g react-native-debugger

# 啟動 Debugger
react-native-debugger

# 在應用中啟用
# 在 iOS 模擬器中按 Cmd+D
# 在 Android 模擬器中按 Ctrl+M
```

#### 性能分析

```typescript
// 使用 Performance API 進行性能測量
import { performance } from 'perf_hooks';

// 測量首頁加載時間
performance.mark('home-load-start');

// ... 加載邏輯

performance.mark('home-load-end');
performance.measure('home-load', 'home-load-start', 'home-load-end');

// 獲取測量結果
const measure = performance.getEntriesByName('home-load')[0];
console.log(`首頁加載時間：${measure.duration}ms`);
```

### 2.3 自定義性能監控

#### 創建性能監控組件

```typescript
// lib/hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
}

export const usePerformanceMonitor = (
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
) => {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const monitorInterval = setInterval(() => {
      const now = Date.now();
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));

      const metrics: PerformanceMetrics = {
        fps,
        memory: Math.round(performance.memory?.usedJSHeapSize / 1048576) || 0,
        renderTime: now - lastTimeRef.current,
      };

      onMetricsUpdate?.(metrics);

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }, 1000);

    return () => clearInterval(monitorInterval);
  }, [onMetricsUpdate]);

  useEffect(() => {
    const countFrames = () => {
      frameCountRef.current++;
      requestAnimationFrame(countFrames);
    };

    countFrames();
  }, []);
};
```

#### 使用性能監控

```typescript
// 在應用中使用
const App = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  usePerformanceMonitor((newMetrics) => {
    setMetrics(newMetrics);
    
    // 如果性能指標低於目標，記錄警告
    if (newMetrics.fps < 55) {
      console.warn(`幀率過低：${newMetrics.fps} FPS`);
    }
    
    if (newMetrics.memory > 500) {
      console.warn(`內存占用過高：${newMetrics.memory} MB`);
    }
  });

  return (
    <View>
      {/* 顯示性能指標 */}
      {__DEV__ && metrics && (
        <PerformanceOverlay metrics={metrics} />
      )}
      
      {/* 應用內容 */}
      <AppContent />
    </View>
  );
};
```

---

## 第三週：電池消耗優化

### 3.1 電池消耗分析

#### 主要消耗源

| 消耗源 | 占比 | 優化方案 |
|--------|------|--------|
| 屏幕 | 40-50% | 降低亮度、使用深色主題 |
| 網絡 | 20-30% | 優化網絡請求、使用緩存 |
| CPU | 15-25% | 優化算法、減少計算 |
| 動畫 | 5-10% | 優化動畫幀率、減少動畫 |
| 其他 | 5-10% | 優化定位、減少喚醒 |

### 3.2 優化措施

#### 優化 1：減少不必要的網絡請求

```typescript
// ❌ 不推薦：每次渲染都發起請求
const PhotoList = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos(); // 每次都會執行
  });

  return <FlatList data={photos} />;
};

// ✅ 推薦：使用依賴數組，只在必要時發起請求
const PhotoList = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []); // 只在組件掛載時執行

  return <FlatList data={photos} />;
};
```

#### 優化 2：使用請求緩存

```typescript
// 創建請求緩存
const requestCache = new Map();

const fetchWithCache = async (url: string) => {
  // 檢查緩存
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }

  // 發起請求
  const response = await fetch(url);
  const data = await response.json();

  // 存儲到緩存
  requestCache.set(url, data);

  // 5 分鐘後清除緩存
  setTimeout(() => requestCache.delete(url), 5 * 60 * 1000);

  return data;
};
```

#### 優化 3：優化動畫性能

```typescript
// ❌ 不推薦：高頻率動畫
<Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  }}
>
  <Text>動畫文本</Text>
</Animated.View>

// ✅ 推薦：使用原生驅動，減少 JS 線程負擔
<Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  }}
  useNativeDriver={true}
>
  <Text>動畫文本</Text>
</Animated.View>
```

#### 優化 4：減少後台活動

```typescript
// 監聽應用狀態變化
import { AppState } from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => subscription.remove();
}, []);

const handleAppStateChange = (state: AppStateStatus) => {
  if (state === 'background') {
    // 停止後台活動
    stopBackgroundTasks();
  } else if (state === 'active') {
    // 恢復前台活動
    resumeForegroundTasks();
  }
};
```

### 3.3 電池消耗測試

#### 測試方法

```bash
# iOS 電池消耗測試
# 1. 在 Xcode 中選擇 Product → Profile
# 2. 選擇 Energy Impact
# 3. 進行各種操作並記錄能耗

# Android 電池消耗測試
# 1. 在 Android Studio 中打開 Profiler
# 2. 選擇 Energy 標籤
# 3. 進行各種操作並記錄能耗
```

#### 測試記錄表

| 場景 | 初始電量 | 30 分鐘後 | 消耗 | 目標 | 狀態 |
|------|--------|---------|------|------|------|
| 首頁瀏覽 | 100% | 96% | 4% | < 5% | ✅ |
| 拍照 | 100% | 94% | 6% | < 5% | ⚠️ |
| 編輯 | 100% | 95% | 5% | < 5% | ✅ |
| 相冊滾動 | 100% | 97% | 3% | < 5% | ✅ |
| 批量處理 | 100% | 93% | 7% | < 5% | ⚠️ |

---

## 第四週：驗收和優化

### 4.1 性能驗收標準

#### 幀率目標

| 場景 | 目標 | 當前 | 狀態 |
|------|------|------|------|
| 首頁滾動 | > 55 FPS | ___ | |
| 拍照滑動 | > 55 FPS | ___ | |
| 編輯動畫 | > 55 FPS | ___ | |
| 相冊滾動 | > 55 FPS | ___ | |
| 批量選擇 | > 55 FPS | ___ | |

#### 內存目標

| 場景 | 目標 | 當前 | 狀態 |
|------|------|------|------|
| 應用啟動 | < 150 MB | ___ | |
| 首頁加載 | < 180 MB | ___ | |
| 相冊加載 | < 250 MB | ___ | |
| 編輯模塊 | < 350 MB | ___ | |
| 批量選擇 | < 400 MB | ___ | |

#### 電池消耗目標

| 場景 | 目標 | 當前 | 狀態 |
|------|------|------|------|
| 首頁瀏覽 | < 5% / 30min | ___ | |
| 拍照 | < 5% / 30min | ___ | |
| 編輯 | < 5% / 30min | ___ | |
| 相冊滾動 | < 5% / 30min | ___ | |
| 批量處理 | < 5% / 30min | ___ | |

### 4.2 優化成果總結

#### 預期改進

| 指標 | 優化前 | 優化後 | 改進 |
|------|-------|-------|------|
| 平均幀率 | 57.6 FPS | 59 FPS | ↑ 2.4% |
| 峰值內存 | 430 MB | 350 MB | ↓ 18.6% |
| 電池消耗 | 8% / 30min | 4% / 30min | ↓ 50% |
| 圖片加載 | 1.5s | 0.8s | ↓ 46.7% |

---

## 時間表

| 時間 | 任務 | 負責人 | 狀態 |
|------|------|--------|------|
| 第 1 週 | FastImage 集成和相冊優化 | 開發團隊 | □ |
| 第 2 週 | 性能監控工具集成 | 開發團隊 | □ |
| 第 3 週 | 電池消耗優化 | 開發團隊 | □ |
| 第 4 週 | 驗收和優化 | QA + 開發 | □ |

---

**中期計畫準備完成！** 🚀
