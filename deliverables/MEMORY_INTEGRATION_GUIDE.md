# 「雁寶記憶」系統集成指南
# YanBao Memory System Integration Guide

## 📋 集成清單

### 1. 導入類型定義
```typescript
// app/(tabs)/index.tsx, camera.tsx, edit.tsx, gallery.tsx, settings.tsx
import { YanBaoMemory, SaveMemoryRequest } from '../lib/types/memory';
```

### 2. 導入組件和 Hooks
```typescript
// 在需要的頁面中
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
import { MemoryLibraryCarousel } from '../lib/components/MemoryLibraryCarousel';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';
```

### 3. 初始化記憶庫
```typescript
// 在頁面組件中
const { 
  memories, 
  saveMemory, 
  applyMemory, 
  deleteMemory, 
  toggleFavorite,
  statistics 
} = useMemoryLibrary(userId);
```

---

## 🎯 集成步驟

### 步驟 1：拍照頁面集成
**文件**：`app/(tabs)/camera.tsx`

```typescript
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';

export function CameraScreen() {
  const userId = 'user123'; // 從認證系統獲取
  const { saveMemory } = useMemoryLibrary(userId);

  const handleSaveMemory = async (request) => {
    return await saveMemory(request);
  };

  return (
    <View>
      {/* 其他 UI */}
      <YanBaoMemoryButton
        onSaveMemory={handleSaveMemory}
        currentParameters={currentParameters}
        mode="camera"
        onSuccess={(memory) => {
          console.log('Memory saved:', memory.name);
        }}
      />
    </View>
  );
}
```

### 步驟 2：編輯頁面集成
**文件**：`app/(tabs)/edit.tsx`

```typescript
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';

export function EditScreen() {
  const userId = 'user123';
  const { saveMemory } = useMemoryLibrary(userId);

  return (
    <View>
      {/* 其他 UI */}
      <YanBaoMemoryButton
        onSaveMemory={async (request) => saveMemory(request)}
        currentParameters={currentParameters}
        mode="edit"
      />
    </View>
  );
}
```

### 步驟 3：相冊頁面集成
**文件**：`app/(tabs)/gallery.tsx`

```typescript
import { MemoryLibraryCarousel } from '../lib/components/MemoryLibraryCarousel';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';

export function GalleryScreen() {
  const userId = 'user123';
  const { 
    memories, 
    applyMemory, 
    deleteMemory, 
    toggleFavorite 
  } = useMemoryLibrary(userId);

  return (
    <View>
      <MemoryLibraryCarousel
        memories={memories}
        onApplyMemory={async (id) => {
          const result = await applyMemory({ 
            memoryId: id, 
            targetMode: 'camera',
            timestamp: new Date().toISOString()
          });
          // 導航到相機頁面並應用參數
        }}
        onDeleteMemory={async (id) => {
          await deleteMemory({ memoryId: id, userId });
        }}
        onToggleFavorite={async (id) => {
          await toggleFavorite(id);
        }}
      />
      {/* 其他 UI */}
    </View>
  );
}
```

### 步驟 4：設定頁面集成
**文件**：`app/(tabs)/settings.tsx`

```typescript
import { SettingsOptimized } from './settings-optimized';
import { useMemoryLibrary } from '../lib/hooks/useMemoryLibrary';

export function SettingsScreen() {
  const userId = 'user123';
  const { statistics, clearAllMemories } = useMemoryLibrary(userId);

  return (
    <SettingsOptimized
      userId={userId}
      memoryStats={statistics}
      onClearMemories={clearAllMemories}
      onLogout={() => {
        // 登出邏輯
      }}
    />
  );
}
```

---

## 🔌 參數傳遞指南

### 當前參數結構
```typescript
const currentParameters = {
  optical: {
    iso: 400,              // 100-3200
    shutterSpeed: 125,     // 1/x 格式
    whiteBalance: 5500,    // 2500-8000K
  },
  beauty: {
    skinSmoothing: 75,     // 0-100
    whitening: 60,         // 0-100
    faceThinning: 50,      // 0-100
    eyeEnlarging: 65,      // 0-100
    exposure: 0,           // -2~+2 EV
    contrast: 10,          // -100~+100
    saturation: 15,        // -100~+100
  },
  filter: {
    filterId: 'preset_natural',
    filterName: '自然',
    intensity: 100,        // 0-100
  },
  arPose: {
    templateId: 'kuromi_cute',
    templateName: '庫洛米甜酷風',
    poseType: 'face',      // 'face' | 'body' | 'gesture'
    confidence: 95,        // 0-100
  },
  environment: {
    location: '北京',
    lighting: 'daylight',  // 'daylight' | 'indoor' | 'sunset' | 'night'
    season: 'winter',      // 'spring' | 'summer' | 'autumn' | 'winter'
    mood: '冬日暖陽',
    temperature: 12,       // 攝氏度
  },
};
```

### 動態更新參數
```typescript
// 當用戶調整參數時
setCurrentParameters(prev => ({
  ...prev,
  beauty: {
    ...prev.beauty,
    skinSmoothing: newValue,
  },
}));
```

---

## 💾 本地存儲管理

### 初始化
```typescript
// 自動初始化（useMemoryLibrary 會自動處理）
const { memories, isLoading } = useMemoryLibrary(userId);
```

### 手動操作
```typescript
// 保存記憶
const result = await saveMemory({
  optical: currentParameters.optical,
  beauty: currentParameters.beauty,
  filter: currentParameters.filter,
  arPose: currentParameters.arPose,
  environment: currentParameters.environment,
  customName: '我的風格', // 可選
});

// 應用記憶
await applyMemory({
  memoryId: memory.id,
  targetMode: 'camera',
  timestamp: new Date().toISOString(),
});

// 刪除記憶
await deleteMemory({
  memoryId: memory.id,
  userId: userId,
});

// 重命名記憶
await renameMemory({
  memoryId: memory.id,
  newName: '新名稱',
});

// 切換收藏
await toggleFavorite(memory.id);
```

---

## 🧪 測試檢查清單

### 功能測試
- [ ] 記憶按鈕顯示正確
- [ ] 確認對話框彈出
- [ ] 記憶成功保存
- [ ] 成功動畫播放
- [ ] 觸覺反饋工作
- [ ] 記憶庫輪播顯示
- [ ] 點擊記憶應用參數
- [ ] 收藏/刪除功能正常
- [ ] 設定頁面統計正確
- [ ] 存儲進度條準確

### 性能測試
- [ ] 保存記憶 < 500ms
- [ ] 應用記憶 < 300ms
- [ ] 記憶庫加載 < 1s
- [ ] 內存占用 < 50MB
- [ ] 電池消耗 < 2% / 30 分鐘

### 兼容性測試
- [ ] iOS 13.0+ 支持
- [ ] Android 8.0+ 支持
- [ ] 小屏幕設備 (< 4.5")
- [ ] 大屏幕設備 (> 6.5")
- [ ] 橫屏/豎屏切換

---

## 🐛 常見問題

### Q1: 記憶按鈕不顯示
**A**: 檢查是否正確導入組件
```typescript
import { YanBaoMemoryButton } from '../lib/components/YanBaoMemoryButton';
```

### Q2: 記憶無法保存
**A**: 檢查 currentParameters 是否完整
```typescript
// 確保所有必需字段都已填充
console.log(currentParameters);
```

### Q3: 記憶庫為空
**A**: 檢查 useMemoryLibrary 是否正確初始化
```typescript
const { memories, isLoading } = useMemoryLibrary(userId);
console.log('Memories:', memories);
```

### Q4: 觸覺反饋不工作
**A**: 檢查 expo-haptics 是否正確安裝
```bash
npm install expo-haptics
# 或
yarn add expo-haptics
```

---

## 📦 依賴檢查

### 必需依賴
```json
{
  "expo": "^50.0.0",
  "react-native": "^0.73.0",
  "expo-haptics": "^12.0.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "lucide-react-native": "^0.263.0",
  "uuid": "^9.0.0"
}
```

### 安裝命令
```bash
npm install expo-haptics @react-native-async-storage/async-storage lucide-react-native uuid
# 或
yarn add expo-haptics @react-native-async-storage/async-storage lucide-react-native uuid
```

---

## 🚀 集成完成檢查

集成完成後，請確認以下項目：

- [ ] 所有文件已複製到項目
- [ ] 所有依賴已安裝
- [ ] 所有導入語句正確
- [ ] 所有類型定義已導入
- [ ] 所有頁面已集成
- [ ] 測試用例已執行
- [ ] 沒有編譯錯誤
- [ ] 沒有運行時錯誤

---

## 📞 技術支持

如有問題，請參考以下資源：

1. **類型定義**：`lib/types/memory.ts`
2. **組件實現**：`lib/components/YanBaoMemoryButton.tsx`
3. **Hook 實現**：`lib/hooks/useMemoryLibrary.ts`
4. **集成示例**：`app/(tabs)/camera-memory-integrated.tsx`

---

**集成指南完成！準備好開始集成了嗎？** 🚀
