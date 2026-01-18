# yanbao AI 项目交接 - 快速参考卡片

## 🚀 30 秒快速开始

```bash
# 1. 克隆项目
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio

# 2. 切换分支
git checkout sanmu-v1-production

# 3. 打开 Android Studio
# File > Open > 选择项目目录

# 4. 同步 Gradle（自动）

# 5. 查看设计稿
open design_ui/

# 6. 阅读设计规范
cat design_ui/YANBAO_UI_DESIGN_SPECS.md

# 7. 编译项目
./gradlew assembleDebug
```

---

## 📱 项目基本信息

| 项目 | 内容 |
|------|------|
| **项目名** | yanbao AI - 私人影像工作室 |
| **仓库** | https://github.com/Tsaojason-cao/yanbao-imaging-studio |
| **分支** | sanmu-v1-production |
| **最新 Commit** | 437c4a71 |
| **模块数** | 7 个 |
| **参数数** | 29 个 |
| **设计稿** | 7 个 PNG（1080×1920px） |
| **状态** | UI 设计完成，功能开发待开始 |

---

## 📁 关键文件位置

| 文件 | 位置 | 说明 |
|------|------|------|
| **设计稿** | `design_ui/yanbao_ui_module_*.png` | 7 个高保真 UI 设计稿 |
| **设计规范** | `design_ui/YANBAO_UI_DESIGN_SPECS.md` | 完整的设计规范文档 |
| **交接文档** | `PROJECT_HANDOVER.md` | 项目完整交接文档 |
| **布局文件** | `android/app/src/main/res/layout/` | 7 个 Activity 的布局 |
| **图标文件** | `android/app/src/main/res/drawable/` | 10 个 XML Vector Drawable |
| **资源文件** | `android/app/src/main/res/values/` | colors.xml、strings.xml 等 |
| **Gradle 配置** | `android/build.gradle` | 项目级 Gradle 配置 |
| **清单文件** | `android/app/src/main/AndroidManifest.xml` | 应用清单 |

---

## 🎨 7 个模块概览

| 模块 | 文件 | 功能 | 状态 |
|------|------|------|------|
| 1 | activity_main.xml | 星光轮盘首页 | 布局完成 |
| 2 | activity_parameters.xml | 29 维参数编辑器 | 布局完成 |
| 3 | activity_filters.xml | 魔法滤镜库 | 布局完成 |
| 4 | activity_ai_brain.xml | AI 智能脑 | 布局完成 |
| 5 | activity_camera.xml | 原生沉浸相机 | 布局完成 |
| 6 | activity_gallery.xml | 雁宝记忆作品集 | 布局完成 |
| 7 | activity_settings.xml | 高级设置页面 | 布局完成 |

---

## 🎨 色彩系统（复制粘贴）

```xml
<!-- colors.xml -->
<color name="bg_deep_purple">#1A0033</color>
<color name="bg_gradient_light">#2D0052</color>
<color name="kuromi_pink">#FF1493</color>
<color name="kuromi_purple">#9D4EDD</color>
<color name="white">#FFFFFF</color>
<color name="light_gray">#F5F5F5</color>
```

---

## 📐 间距系统（复制粘贴）

```xml
<!-- dimens.xml -->
<dimen name="margin_global">24dp</dimen>
<dimen name="margin_card">16dp</dimen>
<dimen name="margin_element">12dp</dimen>
<dimen name="corner_radius">12dp</dimen>
<dimen name="font_title">24sp</dimen>
<dimen name="font_body">14sp</dimen>
<dimen name="font_small">12sp</dimen>
```

---

## 🔧 常用命令

```bash
# 编译 Debug APK
./gradlew assembleDebug

# 编译 Release APK
./gradlew assembleRelease

# 运行单元测试
./gradlew test

# 清理项目
./gradlew clean

# 查看依赖树
./gradlew dependencies

# 同步 Gradle
./gradlew sync

# 安装到设备
./gradlew installDebug

# 卸载应用
./gradlew uninstallDebug
```

---

## 📝 Git 常用命令

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交代码
git commit -m "feat: 功能描述"

# 推送代码
git push origin sanmu-v1-production

# 查看日志
git log --oneline -10

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout sanmu-v1-production

# 合并分支
git merge feature/new-feature
```

---

## 💡 29 个参数速查表

### 皮相（10 维）
奶油肌、通透感、光泽度、平滑度、毛孔细致、去噪、纹理、饱和度、色温、色调

### 光影（9 维）
感光度、对比度、高光、阴影、黑点、白点、清晰度、晕影、柔焦

### 骨相（10 维）
脸型调整、颧骨高度、下颌线、额头宽度、鼻型、眼睛大小、唇部丰满、下巴长度、脸部宽度、锐化

---

## 🎯 下一步任务清单

### 立即开始（今天）
- [ ] 克隆项目
- [ ] 打开 Android Studio
- [ ] 同步 Gradle
- [ ] 查看设计稿
- [ ] 阅读设计规范

### 本周
- [ ] 实现 MainActivity
- [ ] 实现 ParametersActivity
- [ ] 实现 FiltersActivity
- [ ] 编写单元测试

### 下周
- [ ] 实现 AiBrainActivity
- [ ] 实现 CameraActivity
- [ ] 实现 GalleryActivity
- [ ] 实现 SettingsActivity

### 两周后
- [ ] 性能优化
- [ ] 集成测试
- [ ] Bug 修复
- [ ] 代码审查

---

## ❓ 遇到问题怎么办？

| 问题 | 解决方案 |
|------|---------|
| Gradle 同步失败 | 检查网络，更新 Gradle 版本 |
| 编译错误 | 检查 Java 版本（11+），更新 SDK |
| 运行崩溃 | 查看 Logcat，检查权限 |
| 设计不匹配 | 检查 colors.xml 和 dimens.xml |
| Git 冲突 | 手动解决冲突，git add，git commit |

---

## 📞 重要联系方式

| 项目 | 值 |
|------|-----|
| 仓库地址 | https://github.com/Tsaojason-cao/yanbao-imaging-studio |
| 主分支 | sanmu-v1-production |
| 交接文档 | PROJECT_HANDOVER.md |
| 设计规范 | design_ui/YANBAO_UI_DESIGN_SPECS.md |

---

## ✅ 交接检查清单

在开始开发前，请确认以下事项：

- [ ] 已克隆项目到本地
- [ ] 已切换到 sanmu-v1-production 分支
- [ ] 已在 Android Studio 中打开项目
- [ ] 已同步 Gradle
- [ ] 已查看 7 个设计稿
- [ ] 已阅读 YANBAO_UI_DESIGN_SPECS.md
- [ ] 已理解 29 个参数的含义
- [ ] 已了解项目的 7 个模块
- [ ] 已配置好开发环境
- [ ] 已能够成功编译项目

---

## 🎉 准备好开始了吗？

**是的！** 现在您已经拥有了所有必要的信息。

**下一步**：
1. 打开 `PROJECT_HANDOVER.md` 获取完整信息
2. 查看 `design_ui/YANBAO_UI_DESIGN_SPECS.md` 了解设计规范
3. 开始实现第一个模块（建议从 MainActivity 开始）

**祝您开发愉快！** 🚀

---

**快速参考卡片版本**：1.0  
**生成时间**：2026-01-18 04:00 GMT+8  
**适用于**：下一个 Manus 账号 / 开发团队
