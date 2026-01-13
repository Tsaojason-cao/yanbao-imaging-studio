/**
 * 雁寶記憶系統 - 數據結構定義
 * YanBao Memory System - Data Structure Definitions
 */

/**
 * 光學校準參數
 * Optical Calibration Parameters
 */
export interface OpticalCalibration {
  iso: number; // 感光度 100-3200
  shutterSpeed: number; // 快門速度 (1/x)
  whiteBalance: number; // 色溫 2500-8000K
}

/**
 * 美顏參數 (7 維)
 * Beauty Parameters (7D)
 */
export interface BeautyParameters {
  skinSmoothing: number; // 磨皮 0-100
  whitening: number; // 美白 0-100
  faceThinning: number; // 瘦臉 0-100
  eyeEnlarging: number; // 大眼 0-100
  exposure: number; // 曝光補償 -2~+2 EV
  contrast: number; // 對比度 -100~+100
  saturation: number; // 飽和度 -100~+100
}

/**
 * 濾鏡參數
 * Filter Parameters
 */
export interface FilterParameters {
  filterId: string; // 濾鏡 ID
  filterName: string; // 濾鏡名稱
  intensity: number; // 濾鏡強度 0-100
}

/**
 * AR 姿勢模板
 * AR Pose Template
 */
export interface ARPoseTemplate {
  templateId: string; // 模板 ID
  templateName: string; // 模板名稱 (如: "庫洛米甜酷風")
  poseType: 'face' | 'body' | 'gesture'; // 姿勢類型
  confidence: number; // 識別置信度 0-100
}

/**
 * 環境信息 (AI 自動提取)
 * Environment Information (Auto-extracted by AI)
 */
export interface EnvironmentInfo {
  location?: string; // 位置 (如: "北京冬日暖陽")
  lighting: 'daylight' | 'indoor' | 'sunset' | 'night'; // 光線類型
  season: 'spring' | 'summer' | 'autumn' | 'winter'; // 季節
  mood: string; // 氛圍描述 (如: "復古咖啡館")
  temperature?: number; // 溫度 (℃)
}

/**
 * 記憶參數包 - 核心結構
 * Memory Parameter Package - Core Structure
 */
export interface YanBaoMemory {
  // 基本信息
  id: string; // 唯一 ID (UUID)
  userId: string; // 用戶 ID
  createdAt: string; // 創建時間 (ISO 8601)
  updatedAt: string; // 更新時間 (ISO 8601)

  // 記憶名稱和描述
  name: string; // 記憶名稱 (AI 自動生成或用戶自定義)
  description?: string; // 記憶描述
  tags?: string[]; // 標籤 (如: ["北京", "冬日", "暖陽"])

  // 核心參數包
  optical: OpticalCalibration; // 光學校準
  beauty: BeautyParameters; // 美顏參數
  filter: FilterParameters; // 濾鏡參數
  arPose?: ARPoseTemplate; // AR 姿勢模板 (可選)

  // 環境信息
  environment: EnvironmentInfo; // 環境信息

  // 使用統計
  usageCount: number; // 使用次數
  lastUsedAt?: string; // 最後使用時間
  favorited: boolean; // 是否收藏

  // 同步狀態
  syncStatus: 'local' | 'syncing' | 'synced'; // 同步狀態
  cloudId?: string; // 雲端 ID (Supabase)
}

/**
 * 記憶庫 - 用戶的所有記憶集合
 * Memory Library - Collection of all user memories
 */
export interface YanBaoMemoryLibrary {
  userId: string;
  memories: YanBaoMemory[];
  totalCount: number;
  storageUsed: number; // 字節數
  lastSyncAt: string;
}

/**
 * 記憶應用請求
 * Memory Application Request
 */
export interface ApplyMemoryRequest {
  memoryId: string;
  targetMode: 'camera' | 'edit'; // 應用到相機或編輯模式
  timestamp: string;
}

/**
 * 記憶應用結果
 * Memory Application Result
 */
export interface ApplyMemoryResult {
  success: boolean;
  memoryId: string;
  appliedAt: string;
  message: string;
}

/**
 * 記憶存儲請求
 * Memory Storage Request
 */
export interface SaveMemoryRequest {
  optical: OpticalCalibration;
  beauty: BeautyParameters;
  filter: FilterParameters;
  arPose?: ARPoseTemplate;
  environment: EnvironmentInfo;
  customName?: string; // 用戶自定義名稱 (可選)
}

/**
 * 記憶存儲結果
 * Memory Storage Result
 */
export interface SaveMemoryResult {
  success: boolean;
  memory: YanBaoMemory;
  message: string;
}

/**
 * 記憶刪除請求
 * Memory Deletion Request
 */
export interface DeleteMemoryRequest {
  memoryId: string;
  userId: string;
}

/**
 * 記憶刪除結果
 * Memory Deletion Result
 */
export interface DeleteMemoryResult {
  success: boolean;
  memoryId: string;
  message: string;
}

/**
 * 記憶重命名請求
 * Memory Rename Request
 */
export interface RenameMemoryRequest {
  memoryId: string;
  newName: string;
}

/**
 * 記憶重命名結果
 * Memory Rename Result
 */
export interface RenameMemoryResult {
  success: boolean;
  memoryId: string;
  newName: string;
  message: string;
}

/**
 * 記憶統計信息
 * Memory Statistics
 */
export interface MemoryStatistics {
  totalMemories: number; // 總記憶數
  totalUsage: number; // 總使用次數
  mostUsedMemory?: YanBaoMemory; // 最常用的記憶
  favoriteCount: number; // 收藏數
  storageUsed: number; // 存儲已用 (字節)
  storageQuota: number; // 存儲配額 (字節)
  lastSyncAt: string; // 最後同步時間
}
