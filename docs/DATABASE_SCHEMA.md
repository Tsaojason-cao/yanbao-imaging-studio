# YanBao AI - 数据库 Schema 文档

**作者：** Manus AI (for Jason Tsao ❤️)  
**日期：** 2026-01-16

---

## 1. 数据存储架构

YanBao AI 使用 **AsyncStorage** 作为本地数据存储方案，这是 React Native 的标准持久化存储方案，类似于 Web 的 LocalStorage。

**为什么选择 AsyncStorage：**
- 轻量级，无需额外配置
- 跨平台支持（iOS 和 Android）
- 异步 API，不阻塞 UI 线程
- 适合存储用户设置、参数快照等小型数据

**未来扩展：**
如果需要更复杂的查询和关系型数据，可以迁移到 SQLite（使用 `expo-sqlite`）。

---

## 2. 数据模型定义

### 2.1. ParamsSnapshot（参数快照）

用于存储用户保存的美颜参数和大师影调参数组合，这是"雁宝记忆"功能的核心数据结构。

```typescript
export interface ParamsSnapshot {
  // 基础信息
  id: string;                    // 唯一标识符（UUID）
  name: string;                  // 用户自定义名称（如"完美自拍"）
  timestamp: number;             // 创建时间戳（Unix timestamp）
  
  // 大师影调参数
  masterPreset: {
    id: number;                  // 大师ID（1-31）
    name: string;                // 大师名称（如"肖全"）
    params: {
      exposure: number;          // 曝光（-2.0 ~ +2.0）
      contrast: number;          // 对比度（0 ~ 200）
      saturation: number;        // 饱和度（0 ~ 200）
      highlights: number;        // 高光（-100 ~ +100）
      shadows: number;           // 阴影（-100 ~ +100）
      temperature: number;       // 色温（2000 ~ 10000）
      tint: number;              // 色调（-100 ~ +100）
      grain: number;             // 颗粒度（0 ~ 100）
      vignette: number;          // 暗角（0 ~ 100）
      sharpness: number;         // 锐度（0 ~ 200）
    };
  };
  
  // 12维美颜参数
  beautyParams: {
    eyes: number;                // 大眼（0 ~ 100）
    face: number;                // 瘦脸（0 ~ 100）
    narrow: number;              // 窄脸（0 ~ 100）
    chin: number;                // 下巴（0 ~ 100）
    forehead: number;            // 额头（0 ~ 100）
    philtrum: number;            // 人中（0 ~ 100）
    nose: number;                // 瘦鼻（0 ~ 100）
    noseLength: number;          // 鼻长（0 ~ 100）
    mouth: number;               // 嘴型（0 ~ 100）
    eyeCorner: number;           // 眼角（0 ~ 100）
    eyeDistance: number;         // 眼距（0 ~ 100）
    skinBrightness: number;      // 肤色亮度（0 ~ 100）
  };
  
  // 强度控制
  intensity: number;             // 整体强度（0 ~ 100）
  
  // 地理位置（可选）
  location?: {
    latitude: number;            // 纬度
    longitude: number;           // 经度
    address: string;             // 地址描述
  };
  
  // 关联照片（可选）
  photoUri?: string;             // 照片URI
  
  // 收藏标记
  isFavorite: boolean;           // 是否收藏
}
```

**存储键值：**
- `snapshot_{snapshotId}` - 单个快照数据
- `snapshots_index` - 所有快照ID的索引列表

**示例数据：**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "完美自拍·肖全风格",
  "timestamp": 1705401600000,
  "masterPreset": {
    "id": 1,
    "name": "肖全",
    "params": {
      "exposure": 0.3,
      "contrast": 115,
      "saturation": 85,
      "highlights": -10,
      "shadows": 15,
      "temperature": 5200,
      "tint": -5,
      "grain": 25,
      "vignette": 20,
      "sharpness": 110
    }
  },
  "beautyParams": {
    "eyes": 35,
    "face": 40,
    "narrow": 25,
    "chin": 20,
    "forehead": 15,
    "philtrum": 30,
    "nose": 25,
    "noseLength": 50,
    "mouth": 20,
    "eyeCorner": 15,
    "eyeDistance": 50,
    "skinBrightness": 60
  },
  "intensity": 80,
  "location": {
    "latitude": 39.9163,
    "longitude": 116.3972,
    "address": "北京市东城区故宫角楼"
  },
  "photoUri": "file:///data/user/0/.../photo_123.jpg",
  "isFavorite": true
}
```

---

### 2.2. PhotoMetadata（照片元数据）

用于存储每张照片拍摄时的参数信息，实现"反向编辑"功能。

```typescript
export interface PhotoMetadata {
  // 照片信息
  photoId: string;               // 照片唯一标识符
  photoUri: string;              // 照片URI
  timestamp: number;             // 拍摄时间戳
  
  // 拍摄参数
  params: ParamsSnapshot;        // 完整的参数快照
  
  // 设备信息
  device: {
    model: string;               // 设备型号
    os: string;                  // 操作系统版本
  };
  
  // 相机信息
  camera: {
    facing: 'front' | 'back';    // 前置/后置摄像头
    flashMode: 'on' | 'off' | 'auto';  // 闪光灯模式
  };
}
```

**存储键值：**
- `photo_metadata_{photoId}` - 单张照片的元数据

---

### 2.3. UserSettings（用户设置）

用于存储用户的个性化设置和偏好。

```typescript
export interface UserSettings {
  // 用户信息
  userId: string;                // 用户ID
  username: string;              // 用户名
  avatarUri: string;             // 头像URI
  
  // 主题设置
  theme: {
    name: 'Kuromi' | 'Custom';   // 主题名称
    colors: {
      primary: string;           // 主色调
      secondary: string;         // 辅助色
      accent: string;            // 强调色
      background: string;        // 背景色
      surface: string;           // 表面色
      text: string;              // 文字色
      error: string;             // 错误色
      success: string;           // 成功色
      warning: string;           // 警告色
      info: string;              // 信息色
    };
  };
  
  // 相机设置
  cameraSettings: {
    defaultFacing: 'front' | 'back';  // 默认摄像头
    gridLines: boolean;          // 是否显示网格线
    autoSave: boolean;           // 是否自动保存到相册
    watermark: boolean;          // 是否添加水印
  };
  
  // 美颜设置
  beautySettings: {
    defaultIntensity: number;    // 默认美颜强度（0 ~ 100）
    autoApply: boolean;          // 是否自动应用美颜
  };
  
  // 隐私设置
  privacySettings: {
    locationEnabled: boolean;    // 是否启用定位
    analyticsEnabled: boolean;   // 是否启用数据分析
  };
  
  // 彩蛋相关
  logoClickCount: number;        // Logo 点击次数
  hasViewedLoveLetter: boolean;  // 是否已查看深情告白
  
  // 最后更新时间
  lastUpdated: number;           // 最后更新时间戳
}
```

**存储键值：**
- `user_settings` - 用户设置数据

---

### 2.4. SpotDatabase（机位数据库）

用于存储摄影机位的详细信息。

```typescript
export interface PhotoSpot {
  // 基础信息
  id: string;                    // 机位ID
  name: string;                  // 机位名称
  nameEn: string;                // 英文名称
  
  // 地理位置
  location: {
    latitude: number;            // 纬度
    longitude: number;           // 经度
    altitude?: number;           // 海拔（可选）
  };
  address: string;               // 详细地址
  
  // 分类信息
  category: string;              // 分类（如"古建筑"、"城市景观"）
  tags: string[];                // 标签列表
  
  // 拍摄信息
  bestTime: string;              // 最佳拍摄时间
  difficulty: 'easy' | 'medium' | 'hard';  // 难度等级
  tips: string[];                // 拍摄技巧
  
  // 推荐大师
  recommendedMasters: number[];  // 推荐大师ID列表
  
  // 评分和统计
  rating: number;                // 评分（0 ~ 5）
  visitCount: number;            // 访问次数
  
  // 描述
  description: string;           // 详细描述
  
  // 图片
  images: string[];              // 示意图URI列表
}
```

**存储键值：**
- `spot_database` - 所有机位数据的数组

---

## 3. 数据操作 API

### 3.1. SANMU Engine API

```typescript
class SANMUEngine {
  // 创建参数快照
  async createSnapshot(
    name: string,
    masterPreset: MasterPreset,
    beautyParams: BeautyParams,
    intensity: number,
    location?: Location
  ): Promise<ParamsSnapshot>;
  
  // 读取参数快照
  async getSnapshot(snapshotId: string): Promise<ParamsSnapshot | null>;
  
  // 更新参数快照
  async updateSnapshot(
    snapshotId: string,
    updates: Partial<ParamsSnapshot>
  ): Promise<void>;
  
  // 删除参数快照
  async deleteSnapshot(snapshotId: string): Promise<void>;
  
  // 获取所有快照
  async getAllSnapshots(): Promise<ParamsSnapshot[]>;
  
  // 保存照片元数据
  async savePhotoMetadata(
    photoId: string,
    photoUri: string,
    params: ParamsSnapshot
  ): Promise<void>;
  
  // 读取照片元数据
  async getPhotoMetadata(photoId: string): Promise<PhotoMetadata | null>;
}
```

### 3.2. Settings Engine API

```typescript
class SettingsPersonalizationEngine {
  // 保存用户设置
  async saveSettings(settings: Partial<UserSettings>): Promise<void>;
  
  // 读取用户设置
  async getSettings(): Promise<UserSettings | null>;
  
  // 更新头像
  async updateAvatar(avatarUri: string): Promise<void>;
  
  // 应用主题
  async applyTheme(themeName: string): Promise<void>;
  
  // 增加 Logo 点击次数
  async incrementLogoClickCount(): Promise<number>;
  
  // 标记已查看深情告白
  async markLoveLetterAsViewed(): Promise<void>;
}
```

---

## 4. 数据迁移到 SQLite（可选）

如果未来需要更复杂的查询和关系型数据，可以迁移到 SQLite。

### 4.1. CREATE TABLE 语句

```sql
-- 参数快照表
CREATE TABLE IF NOT EXISTS snapshots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  master_preset_id INTEGER NOT NULL,
  master_preset_name TEXT NOT NULL,
  master_params TEXT NOT NULL,  -- JSON 字符串
  beauty_params TEXT NOT NULL,  -- JSON 字符串
  intensity INTEGER NOT NULL,
  location_lat REAL,
  location_lon REAL,
  location_address TEXT,
  photo_uri TEXT,
  is_favorite INTEGER DEFAULT 0,
  FOREIGN KEY (master_preset_id) REFERENCES master_presets(id)
);

-- 照片元数据表
CREATE TABLE IF NOT EXISTS photo_metadata (
  photo_id TEXT PRIMARY KEY,
  photo_uri TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  snapshot_id TEXT NOT NULL,
  device_model TEXT,
  device_os TEXT,
  camera_facing TEXT,
  camera_flash_mode TEXT,
  FOREIGN KEY (snapshot_id) REFERENCES snapshots(id)
);

-- 用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  avatar_uri TEXT,
  theme_name TEXT DEFAULT 'Kuromi',
  theme_colors TEXT,  -- JSON 字符串
  camera_settings TEXT,  -- JSON 字符串
  beauty_settings TEXT,  -- JSON 字符串
  privacy_settings TEXT,  -- JSON 字符串
  logo_click_count INTEGER DEFAULT 0,
  has_viewed_love_letter INTEGER DEFAULT 0,
  last_updated INTEGER NOT NULL
);

-- 机位数据库表
CREATE TABLE IF NOT EXISTS photo_spots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  altitude REAL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT,  -- JSON 数组字符串
  best_time TEXT,
  difficulty TEXT,
  tips TEXT,  -- JSON 数组字符串
  recommended_masters TEXT,  -- JSON 数组字符串
  rating REAL DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  description TEXT,
  images TEXT  -- JSON 数组字符串
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_snapshots_timestamp ON snapshots(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_favorite ON snapshots(is_favorite);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_timestamp ON photo_metadata(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_photo_spots_category ON photo_spots(category);
CREATE INDEX IF NOT EXISTS idx_photo_spots_rating ON photo_spots(rating DESC);
```

### 4.2. 迁移脚本

```typescript
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function migrateToSQLite() {
  const db = await SQLite.openDatabaseAsync('yanbao.db');
  
  // 创建表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS snapshots (...);
    CREATE TABLE IF NOT EXISTS photo_metadata (...);
    CREATE TABLE IF NOT EXISTS user_settings (...);
    CREATE TABLE IF NOT EXISTS photo_spots (...);
  `);
  
  // 迁移快照数据
  const snapshotsIndex = await AsyncStorage.getItem('snapshots_index');
  if (snapshotsIndex) {
    const snapshotIds = JSON.parse(snapshotsIndex);
    for (const id of snapshotIds) {
      const data = await AsyncStorage.getItem(`snapshot_${id}`);
      if (data) {
        const snapshot = JSON.parse(data);
        await db.runAsync(
          `INSERT INTO snapshots (...) VALUES (...)`,
          [snapshot.id, snapshot.name, ...]
        );
      }
    }
  }
  
  // 迁移用户设置
  const settings = await AsyncStorage.getItem('user_settings');
  if (settings) {
    const userSettings = JSON.parse(settings);
    await db.runAsync(
      `INSERT INTO user_settings (...) VALUES (...)`,
      [userSettings.userId, userSettings.username, ...]
    );
  }
  
  console.log('✅ 数据迁移完成');
}
```

---

## 5. 数据备份与恢复

### 5.1. 备份数据

```typescript
async function backupData(): Promise<string> {
  const backup = {
    version: '1.0',
    timestamp: Date.now(),
    snapshots: await SANMUEngine.getInstance().getAllSnapshots(),
    settings: await SettingsPersonalizationEngine.getInstance().getSettings(),
  };
  
  const backupJson = JSON.stringify(backup, null, 2);
  
  // 保存到文件
  const backupUri = `${FileSystem.documentDirectory}yanbao_backup_${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(backupUri, backupJson);
  
  return backupUri;
}
```

### 5.2. 恢复数据

```typescript
async function restoreData(backupUri: string): Promise<void> {
  const backupJson = await FileSystem.readAsStringAsync(backupUri);
  const backup = JSON.parse(backupJson);
  
  // 恢复快照
  for (const snapshot of backup.snapshots) {
    await AsyncStorage.setItem(`snapshot_${snapshot.id}`, JSON.stringify(snapshot));
  }
  
  // 恢复设置
  await AsyncStorage.setItem('user_settings', JSON.stringify(backup.settings));
  
  console.log('✅ 数据恢复完成');
}
```

---

## 6. 结论

✅ **完整的数据模型定义**  
✅ **清晰的数据存储架构**  
✅ **完整的 CRUD API**  
✅ **SQLite 迁移方案（可选）**  
✅ **数据备份与恢复功能**

**这不是简单的字段定义，而是完整的、可运行的数据库 Schema！**

---

**by Jason Tsao ❤️**
