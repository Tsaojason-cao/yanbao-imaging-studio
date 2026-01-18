# yanbao AI 设计图库

## 📋 7 个核心模块的 UI 布局示意图

本目录包含 yanbao AI 应用的 7 个核心模块的高保真 UI 布局示意图。所有设计图都严格遵循库洛米主题色和布局规范。

---

## 🎨 模块清单

### 1. 首页轮盘 (Module 1)
**文件**：`yanbao_ui_module_1_home_wheel.png`

**对应代码**：`android/app/src/main/res/layout/activity_main.xml`

**核心元素**：
- 中心库洛米头像（粉色 #FF1493）
- 8 个彩色圆形按钮（圆形排列）
- 8 个功能模块：原生相机、大师脑、参数调整、美颜模块、图像处理、雁宝记忆、云端同步、高级功能
- 顶部标题栏 + 底部功能栏

**设计规范**：
- 轮盘圆心：(540, 860) dp
- 轮盘半径：160 dp
- 按钮距离：220 dp
- 库洛米头像：80×80 dp

---

### 2. 参数编辑器 (Module 2)
**文件**：`yanbao_ui_module_2_parameters.png`

**对应代码**：
- `android/app/src/main/res/layout/activity_parameters.xml`
- `android/app/src/main/res/layout/item_parameter_slider.xml`

**核心元素**：
- 29 个参数卡片（5 大分类）
- 粉色 SeekBar 滑块（#FF1493）
- 参数名称全中文：奶油肌、通透感、光泽度、平滑度、毛孔细致、感光度、对比度、高光、阴影等
- 当前值显示 + 范围标签（-100 ~ +100）
- 底部操作按钮：取消、应用

**设计规范**：
- 卡片宽度：SCREEN_WIDTH - 32 dp
- 卡片高度：70 dp
- 卡片圆角：8 dp
- SeekBar 高度：4 dp
- 滑块半径：6 dp

---

### 3. 滤镜选择器 (Module 3)
**文件**：`yanbao_ui_module_3_filters.png`

**对应代码**：
- `android/app/src/main/res/layout/activity_filters.xml`
- `android/app/src/main/res/layout/item_filter_card.xml`

**核心元素**：
- 3×3 网格布局（9 个滤镜卡片）
- 库洛米专属滤镜：库洛米粉、星光梦幻、紫月夜、奶油肌、胶片感、清晨雾、深夜蓝、樱花粉、自定义
- 滤镜预览（彩色背景）
- 滤镜名称全中文

**设计规范**：
- 卡片宽度：(SCREEN_WIDTH - 36) / 3 dp
- 卡片高度：160 dp
- 卡片圆角：8 dp
- 网格间距：12 dp

---

### 4. AI 智能脑 (Module 4)
**文件**：`yanbao_ui_module_4_ai_brain.png`

**对应代码**：`android/app/src/main/res/layout/activity_ai_brain.xml`

**核心元素**：
- 面部扫描区域（黑色背景）
- 粉色对焦框（#FF1493）
- 骨相分析卡片：脸型、额头、颧骨、下颌
- 气质评分：⭐⭐⭐⭐⭐ 4.5/5
- 个性化美颜建议（3 条建议）
- 底部操作按钮：保存结果、应用建议

**设计规范**：
- 扫描区域高度：600 dp
- 对焦框半径：40 dp
- 结果卡片圆角：8 dp

---

### 5. 原生相机 (Module 5)
**文件**：`yanbao_ui_module_5_camera.png`

**对应代码**：`android/app/src/main/res/layout/activity_camera.xml`

**核心元素**：
- 相机预览（深灰色背景）
- 爱心对焦框（粉色 #FF1493）
- 紫色快门按钮（#9D4EDD）
  - 外圆：紫色（40 dp）
  - 内圆：粉色（30 dp）
- 左侧参数显示：ISO、对焦、闪光
- 底部控制栏：闪光灯、快门、切换摄像头

**设计规范**：
- 快门按钮外圆半径：40 dp
- 快门按钮内圆半径：30 dp
- 参数显示框圆角：8 dp

---

### 6. 作品集 (Module 6)
**文件**：`yanbao_ui_module_6_gallery.png`

**对应代码**：
- `android/app/src/main/res/layout/activity_gallery.xml`
- `android/app/src/main/res/layout/item_photo_card.xml`

**核心元素**：
- 2×2 网格布局（4 张照片卡片）
- 库洛米水印（爱心 ♡，粉色 #FF1493）
- 圆角卡片设计
- 彩色照片预览

**设计规范**：
- 卡片宽度：300 dp
- 卡片高度：300 dp
- 卡片圆角：8 dp
- 水印位置：右下角（40×40 dp）

---

### 7. 设置页面 (Module 7)
**文件**：`yanbao_ui_module_7_settings.png`

**对应代码**：`android/app/src/main/res/layout/activity_settings.xml`

**核心元素**：
- 4 个分组：显示设置、导出设置、存储管理、关于应用
- 每个分组包含多个设置项
- 圆角卡片设计
- 设置值显示
- 底部操作按钮：取消、保存

**设计规范**：
- 分组标题：粉色 #FF1493，12 sp
- 设置项卡片圆角：8 dp
- 卡片高度：50 dp

---

## 🎨 品牌色彩系统

| 颜色名称 | Hex 值 | 用途 |
|---------|--------|------|
| 库洛米粉 | #FF1493 | 主色，标题、按钮、强调 |
| 库洛米紫 | #9D4EDD | 辅色，特殊功能、快门按钮 |
| 白色 | #FFFFFF | 背景、卡片 |
| 浅灰 | #F5F5F5 | 页面背景 |
| 深灰 | #1A1A1A | 文字 |
| 中灰 | #999999 | 次要文字 |

---

## 📐 统一设计规范

### 圆角系统
- 卡片圆角：8 dp
- 按钮圆角：8 dp
- 输入框圆角：8 dp

### 字体系统
- 标题：18 sp，粉色 #FF1493，加粗
- 正文：12 sp，深灰 #1A1A1A
- 次要文字：10 sp，中灰 #999999

### 间距系统
- 屏幕边距：16 dp
- 卡片间距：12 dp
- 元素间距：8 dp

### 阴影系统
- 卡片阴影：elevation 2 dp
- 按钮阴影：elevation 4 dp

---

## 🔗 相关文件

- **源代码**：`android/app/src/main/java/com/yanbaoai/`
- **XML 布局**：`android/app/src/main/res/layout/`
- **资源文件**：`android/app/src/main/res/drawable/`
- **颜色定义**：`android/app/src/main/res/values/colors.xml`
- **字符串资源**：`android/app/src/main/res/values/strings.xml`

---

## ✅ 验收标准

所有设计图都符合以下标准：

- ✅ 颜色精准匹配（粉色 #FF1493、紫色 #9D4EDD）
- ✅ 布局严格遵守（坐标、尺寸、圆角）
- ✅ 文字全中文
- ✅ 包含库洛米元素
- ✅ 对应的 XML 代码已实现

---

**生成日期**：2026-01-18  
**生成工具**：Python matplotlib  
**设计规范版本**：1.0
