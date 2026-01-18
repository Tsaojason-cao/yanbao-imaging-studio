# yanbao AI - 高保真 UI 设计文档

## 设计规范概览

### 配色契约
- **背景色**: `#F8F9FA` (高级冷灰)
- **主色**: `#FF1493` (库洛米粉)
- **辅色**: `#9D4EDD` (库洛米紫)
- **文字色**: `#2C2C2C` (深灰)
- **深色背景**: `#1A1A1A` (用于 AI 分析面板)

### 排版契约
- **统一边距**: 24dp
- **字体**: Android 标准思源黑体 (Noto Sans CJK)
- **语言**: 简体中文

---

## 模块 1: 首页 (8选项轮盘)

**文件**: `01_home_wheel.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 尺寸/位置 |
|---------|------------|---------|----------|
| 顶部标题 "yanbao AI" | `@+id/yb_title_home` | `#FF1493` | 60sp, 居中 |
| 中心库洛米剪影 | `@+id/yb_kuromi_silhouette` | `#FF1493` | 80dp 半径 |
| 轮盘选项卡片 (×8) | `@+id/yb_wheel_option_[1-8]` | 玻璃拟态 (RGBA 255,255,255,180) | 140dp × 140dp |
| 选项标签 | `@+id/yb_option_label_[1-8]` | `#2C2C2C` | 32sp |

### 8 个选项标签
1. 大师微雕
2. 胶片肤质
3. 星光特效
4. 库洛米滤镜
5. 梦幻色调
6. 哥特风格
7. 快速美颜
8. 自定义

---

## 模块 2: 参数编辑器 (29维系统)

**文件**: `02_param_editor.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 页面标题 | `@+id/yb_title_params` | `#FF1493` | "参数编辑器 · 29维系统" |
| 分组标题 (×3) | `@+id/yb_group_title_[1-3]` | `#9D4EDD` | 皮相/光影/骨相 |
| 分组分隔线 | `@+id/yb_group_divider` | `#FF1493` | 2dp 宽 |
| 参数标签 (×29) | `@+id/yb_param_label_[name]` | `#2C2C2C` | 32sp |
| 滑块轨道 | `@+id/yb_slider_track` | `#DDDDDD` (未激活) | 2dp 高 |
| 滑块激活部分 | `@+id/yb_slider_active` | `#FF1493` | 2dp 高 |
| 滑块拇指 (Thumb) | `@+id/yb_slider_thumb` | `#FF1493` | 12dp 半径圆形 |
| 数值显示 | `@+id/yb_param_value` | `#FF1493` | 28sp |

### 29 个参数（按分组）

#### 皮相处理 (7 个)
1. 磨皮 - `yb_param_skin_smooth`
2. 美白 - `yb_param_skin_brighten`
3. 红润 - `yb_param_skin_rosy`
4. 去油光 - `yb_param_skin_deoil`
5. 锐化 - `yb_param_skin_sharpen`
6. 清晰度 - `yb_param_skin_clarity`
7. 皮肤纹理保留 - `yb_param_skin_texture`

#### 光影调节 (6 个)
8. 丁达尔效应 - `yb_param_light_tyndall`
9. 面部立体感 - `yb_param_light_contour`
10. 阴影补光 - `yb_param_light_fill`
11. 冷暖 - `yb_param_tone_warmth`
12. 色调偏向 - `yb_param_tone_shift`
13. 肤色统一 - `yb_param_tone_unify`

#### 骨相微雕 (16 个)
14. 瘦脸 - `yb_param_face_slim`
15. 窄脸 - `yb_param_face_narrow`
16. 大眼 - `yb_param_eye_enlarge`
17. 下巴 - `yb_param_chin_adjust`
18. 额头 - `yb_param_forehead_adjust`
19. 脸部立体感 - `yb_param_face_contour`
20. 眼距 - `yb_param_eye_distance`
21. 眼角 - `yb_param_eye_corner`
22. 倾斜 - `yb_param_eye_tilt`
23. 眼袋消减 - `yb_param_eye_bag`
24. 瘦鼻 - `yb_param_nose_slim`
25. 鼻翼 - `yb_param_nose_wing`
26. 鼻梁长短 - `yb_param_nose_length`
27. 鼻梁高度 - `yb_param_nose_height`
28. 嘴位 - `yb_param_mouth_position`
29. 嘴角上扬 - `yb_param_mouth_corner`
30. 缩嘴 - `yb_param_mouth_size`
31. 厚度 - `yb_param_lip_thickness`

---

## 模块 3: 大师脑 AI 分析

**文件**: `03_ai_brain.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 页面标题 | `@+id/yb_title_ai_brain` | `#FF1493` | "大师脑 AI 分析" |
| 面部网格 (Mesh) | `@+id/yb_facial_mesh` | `#9D4EDD` | 紫色线框 |
| 关键点标记 | `@+id/yb_facial_keypoint` | `#FF1493` | 8dp 圆点 |
| AI 建议卡片 (×3) | `@+id/yb_ai_card_[1-3]` | 背景 `#2A2A2A`, 边框 `#FF1493` | 圆角 16dp |
| 卡片标题 | `@+id/yb_ai_card_title` | `#FF1493` | 36sp 粗体 |
| 卡片内容 | `@+id/yb_ai_card_content` | `#FFFFFF` | 28sp |

---

## 模块 4: 滤镜库 (3×3 宫格)

**文件**: `04_filter_library.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 页面标题 | `@+id/yb_title_filters` | `#FF1493` | "滤镜库" |
| 滤镜卡片 (×9) | `@+id/yb_filter_card_[1-9]` | 背景 `#E0E0E0`, 边框 `#FF1493` | 3dp 边框 |
| 滤镜名称 | `@+id/yb_filter_name` | `#2C2C2C` | 32sp |
| 水印 "yanbao" | `@+id/yb_watermark` | `#FF1493` | 右下角 |

### 9 个滤镜名称
1. 库洛米
2. 梦幻
3. 哥特
4. 清透
5. 复古
6. 冷调
7. 暖调
8. 黑白
9. 胶片

---

## 模块 5: 原生相机

**文件**: `05_native_camera.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 对焦框 (爱心形状) | `@+id/yb_focus_frame_heart` | `#FF1493` | 4dp 线宽 |
| 快门按钮 | `@+id/yb_shutter_button` | `#FF1493` | 60dp 半径圆形 |

---

## 模块 6: 作品集 (2×2 瀑布流)

**文件**: `06_gallery.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 页面标题 | `@+id/yb_title_gallery` | `#FF1493` | "作品集" |
| 照片卡片 (×4) | `@+id/yb_photo_card_[1-4]` | `#D0D0D0` | 圆角 12dp |
| 参数摘要水印 | `@+id/yb_photo_watermark` | `#FF1493` | 右下角, 24sp |

---

## 模块 7: 设置页面

**文件**: `07_settings.png`

### UI 元素映射

| 元素名称 | XML ID 建议 | 颜色 Hex | 说明 |
|---------|------------|---------|------|
| 页面标题 | `@+id/yb_title_settings` | `#FF1493` | "设置" |
| 设置项容器 (×4) | `@+id/yb_setting_item_[1-4]` | 背景 `#FFFFFF`, 边框 `#FF1493` | 圆角 12dp |
| 设置项文字 | `@+id/yb_setting_text` | `#2C2C2C` | 36sp |
| 开关指示器 | `@+id/yb_setting_toggle` | `#FF1493` (开启) / `#CCCCCC` (关闭) | 30dp 圆形 |

### 4 个设置项
1. 库洛米水印开关
2. 导出质量控制
3. 参数预设管理
4. 关于 yanbao AI

---

## 设计资产文件清单

1. `01_home_wheel.png` - 首页 (8选项轮盘)
2. `02_param_editor.png` - 参数编辑器 (29维系统)
3. `03_ai_brain.png` - 大师脑 AI 分析
4. `04_filter_library.png` - 滤镜库 (3×3 宫格)
5. `05_native_camera.png` - 原生相机
6. `06_gallery.png` - 作品集 (2×2 瀑布流)
7. `07_settings.png` - 设置页面

---

## Git 提交信息

```
feat: 7 high-fidelity UI modules for yanbao AI with Kuromi theme

- Rendered all 7 modules using Python (Pillow)
- Strict adherence to design specifications (24dp margin, #FF1493 primary, #9D4EDD secondary)
- Kuromi elements: vectorized monochrome silhouettes (no low-res stickers)
- 29-dimensional parameter editor with [皮相/光影/骨相] grouping
- XML ID mapping documented in README_UI.md
```

---

**生成日期**: 2026-01-18  
**设计师**: Manus (首席 UI 设计师模式)  
**项目**: yanbao AI - 库洛米主题美颜相机
