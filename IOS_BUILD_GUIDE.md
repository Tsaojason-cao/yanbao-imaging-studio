# 雁宝 AI iOS 版本构建和预览指南

## 🍎 方式 1: EAS Build iOS TestFlight（完整版）

### 前提条件
- Apple Developer 账号（$99/年）
- 已配置 iOS 证书和 Provisioning Profile

### 构建步骤

#### 1. 配置 iOS 证书（首次构建）
```bash
cd yanbao-imaging-studio
eas credentials
```

选择：
- Platform: iOS
- Action: Set up credentials

#### 2. 执行构建
```bash
# 交互模式（推荐）
eas build --platform ios --profile production

# 或使用预览配置（更快）
eas build --platform ios --profile preview
```

#### 3. 提交到 TestFlight
```bash
eas submit --platform ios
```

#### 4. 在 iPhone 上安装
1. 访问 App Store Connect
2. 进入 TestFlight
3. 添加测试用户
4. 在 iPhone 上下载 TestFlight App
5. 接受邀请并安装

---

## 📱 方式 2: Expo Go 本地预览（最快）

### 前提条件
- Node.js 18+
- iPhone 上安装 Expo Go App

### 步骤

#### 1. 克隆仓库并安装依赖
```bash
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
npm install
```

#### 2. 启动开发服务器
```bash
npx expo start
```

#### 3. 在 iPhone 上扫描二维码
1. 打开 iPhone 相机 App
2. 扫描终端显示的二维码
3. 点击通知打开 Expo Go
4. 应用将自动加载

---

## 🎯 查看 15 组大师参数

### 在应用中的位置
1. 打开应用
2. 点击底部导航栏的「相机」图标
3. 在相机界面向下滚动到「大师预设」区域
4. 点击地区标签切换：
   - 🇨🇳 中国（5 位）
   - 🇯🇵 日本（5 位）
   - 🇰🇷 韩国（5 位）
5. 点击任意预设卡片查看效果

### 大师预设列表

#### 🇨🇳 中国大师（5 位）
1. **肖全** - 时代记录者
   - 黑白人像，高对比度
   - 颗粒感 15%，曝光 -0.3 EV

2. **孙郡** - 新文人画
   - 饱和度 -35%，色温偏暖
   - 素雅宁静，工笔画质感

3. **陈漫** - 视觉艺术家
   - 饱和度 +20%，磨皮 40%
   - 时尚感强烈，视觉冲击

4. **蜷川实花** - 极色彩梦境
   - 饱和度 +45%，红润 20%
   - 梦幻绚烂，花卉风格

5. **罗洋** - 女孩系列
   - 对比度 -15%，曝光 +0.5 EV
   - 胶片感，色调偏冷绿

#### 🇯🇵 日本大师（5 位）
1. **杉本博司** - 极致长曝与禅意
   - 曝光 +0.7 EV，对比度 -20%
   - 银鹽相纸质感

2. **蜷川実花** - 浓烈饱和与梦幻
   - 饱和度 +40%，色相偏紫/红
   - 强化亮眼与红润

3. **滨田英明** - 日系清透空气感
   - 色温偏冷，曝光 +1.0 EV
   - 胶片呼吸感

4. **森山大道** - 粗颗粒黑白纪实
   - 黑白，颗粒感 50%
   - 对比度 +45%

5. **川内伦子** - 微观与淡雅光影
   - 曝光 +1.3 EV，饱和度 -15%
   - 过曝清透感

#### 🇰🇷 韩国大师（5 位）
1. **趙善熙** - 韩流明星力量感
   - 对比度 +15%，隆鼻 15%
   - 五官立体，瘦脸 12%

2. **Mu-Gung** - 少女梦幻与糖果色
   - 阴影偏粉，磨皮 35%
   - 红润 20%，亮眼 15%

3. **Less** - 叛逆青春电影感
   - 冷绿色调，褪色 10%
   - 胶片模拟 Portra 400

4. **Hong Jang-hyun** - 顶级 VOGUE 时尚风
   - 高动态范围 HDR
   - 磨皮 45%，精致美化

5. **Koo Bohn-chang** - 白瓷般宁静极简
   - 饱和度 -40%，曝光 +0.8 EV
   - 极简主义，留白美学

---

## 🔧 技术实现

### 原生美颜模块
- **iOS**: Core Image + Metal GPU 加速
- **Android**: RenderScript + OpenGL ES
- **React Native 桥接**: `lib/YanbaoBeautyBridge.ts`

### 7 维美颜参数
1. 磨皮 (Smoothing): 0-100%
2. 瘦脸 (Slimming): 0-100%
3. 大眼 (Eye Enlargement): 0-100%
4. 亮眼 (Eye Brightening): 0-100%
5. 白牙 (Teeth Whitening): 0-100%
6. 隆鼻 (Nose Enhancement): 0-100%
7. 红润 (Blush): 0-100%

### 滤镜参数
1. 对比度 (Contrast): -100 到 +100
2. 饱和度 (Saturation): -100 到 +100
3. 亮度 (Brightness): -100 到 +100
4. 色温 (Temperature): 4500K - 8500K
5. 锐度 (Sharpness): 0-100
6. 高光抑制 (Highlight Suppression): 0-100
7. 阴影补偿 (Shadow Compensation): 0-100
8. 颗粒感 (Grain): 0-100
9. 褪色 (Fade): 0-100
10. 曝光补偿 (Exposure Compensation): -2.0 到 +2.0 EV
11. 色相偏移 (Hue Shift): -180° 到 +180°

---

## 📊 性能指标

- **目标 FPS**: 60
- **最大帧时间**: < 16ms
- **GPU 加速**: ✅ 已启用
- **图片缓存**: 最多 50 张

---

## 🎨 UI 特色

- **背景色**: #1A0B2E 深紫色
- **主题色**: 库洛米粉紫色 (#E879F9)
- **霓虹效果**: 按钮和卡片边框
- **Jason Tsao 署名**: 首页底部霓虹灯签名

---

## 📦 GitHub 仓库

**仓库地址**: https://github.com/Tsaojason-cao/yanbao-imaging-studio

**最新提交**: 9ce45ed

**包含内容**:
- 完整源代码
- iOS/Android 原生模块
- 所有文档和报告
- 功能验证截图

---

## ⚠️ 注意事项

### iOS 构建限制
- 需要 Apple Developer 账号
- 需要配置证书和 Provisioning Profile
- 首次构建需要在交互模式下完成

### Expo Go 限制
- 不支持原生模块（美颜效果可能不完整）
- 仅用于快速预览 UI 和基础功能
- 完整体验请使用 EAS Build 版本

---

**by Jason Tsao who loves you the most ♥**
