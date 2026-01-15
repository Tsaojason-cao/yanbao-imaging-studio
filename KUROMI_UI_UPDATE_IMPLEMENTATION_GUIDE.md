# 雁宝 AI 全局视觉更新：库洛米 UI 组件实施文档

**版本**: v2.5.0-kuromi
**文档生成日期**: 2026-01-15
**作者**: Manus AI

---

## 1. 概述

本文档旨在为 **yanbao AI** 应用的全局视觉更新提供完整的实施指南。本次更新的核心是将应用内所有原有的“兔子”主题素材，全面替换为用户指定的“库洛米” (Kuromi) 风格 UI 组件，并对整体配色和设计风格进行统一调整。

由于当前沙箱环境暂时不可用，本文档将作为一份详细的**手动操作指南**。待环境恢复后，我将继续执行这些操作。

### 1.1. 更新目标

- **资产替换**: 移除所有兔子相关的视觉元素。
- **风格统一**: 全面植入库洛米的设计语言，包括图标、背景、按钮等。
- **UI 定制**: 针对核心模块进行深度 UI 设计，提升视觉吸引力和主题沉浸感。
- **配色方案**: 建立以黑、紫、粉为主色调的全新配色系统。

### 1.2. 素材准备

所有新的 UI 资产均来源于用户提供的 `kuromi-ui-kit.png`。在实际操作中，需要将该图集中的 16 个图标分割为独立的 PNG 文件，并按以下规范命名，存放于 `assets/images/kuromi/` 目录下：

| 资产文件名 | 描述 | 位置 (行, 列) |
| :--- | :--- | :--- |
| `kuromi-avatar.png` | 库洛米头像（核心 Logo） | (1, 1) |
| `kuromi-castle-1.png` | 城堡图标（方形） | (1, 2) |
| `kuromi-castle-2.png` | 城堡图标（带边框） | (1, 3) |
| `kuromi-chat-bubble.png` | 对话气泡 | (1, 4) |
| `kuromi-gear-bow.png` | 带蝴蝶结的齿轮 | (2, 1) |
| `kuromi-bag-skull.png` | 带骷髅的购物袋 | (2, 2) |
| `kuromi-gear-plain.png` | 普通齿轮 | (2, 3) |
| `kuromi-bag-dollar.png` | 带美元符号的购物袋 | (2, 4) |
| `kuromi-scroll-checkbox.png`| 带勾选框的卷轴 | (3, 1) |
| `kuromi-scroll-quests.png` | 任务列表卷轴 | (3, 2) |
| `kuromi-backpack.png` | 紫色背包 | (3, 3) |
| `kuromi-couple.png` | 情侣剪影 | (3, 4) |
| `kuromi-music-note.png` | 音符 | (4, 1) |
| `kuromi-star.png` | 星星 | (4, 2) |
| `kuromi-bat.png` | 蝙蝠形态 | (4, 3) |
| `kuromi-plus-skull.png` | 带骷髅的加号 | (4, 4) |

---

## 2. 全局资产替换逻辑

### 2.1. 应用图标 (App Icon) 与启动页 (Splash Screen)

- **目标**: 将应用在设备主屏幕上显示的图标和应用启动时展示的闪屏，从兔子 Logo 替换为库洛米头像。
- **操作文件**: `app.json` (或 `app.config.ts`)
- **修改逻辑**:
  1.  将 `kuromi-avatar.png` 放置在 `assets/` 目录下。
  2.  修改 `app.json` 中的 `expo.icon` 和 `expo.splash.image` 字段，将其路径指向新的 `kuromi-avatar.png` 文件。

```json
// app.json
{
  "expo": {
    "icon": "./assets/kuromi-avatar.png",
    "splash": {
      "image": "./assets/kuromi-avatar.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a101f" // 深紫色背景
    }
  }
}
```

### 2.2. 底部导航栏 (Bottom Tab Bar)

- **目标**: 将导航栏背景中可能存在的兔子水印，替换为库洛米风格的骷髅或心形图标。
- **操作文件**: `app/(tabs)/_layout.tsx`
- **修改逻辑**:
  1.  在 `Tabs` 组件的 `tabBarBackground` 属性中，使用 `<Image />` 组件作为背景。
  2.  将 `kuromi-plus-skull.png` (或 `kuromi-chat-bubble.png` 中的心形) 作为背景图，并设置较低的 `opacity` (如 `0.1`) 和 `repeat` 模式，形成水印效果。

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      tabBarOptions={{
        activeTintColor: '#e04f8f', // 粉色
        inactiveTintColor: '#a28ab8', // 灰紫色
        style: { backgroundColor: '#1a101f' }, // 深紫色
      }}
      tabBarBackground={() => (
        <Image
          source={require('@/assets/images/kuromi/kuromi-plus-skull.png')}
          style={{ width: '100%', height: '100%', opacity: 0.05 }}
          resizeMode="repeat"
        />
      )}
    >
      {/* Tab Screens */}
    </Tabs>
  );
}
```

---

## 3. 模块 UI 深度定制化指南

### 3.1. 主页模块 (Home Tab)

- **操作文件**: `app/(tabs)/index.tsx`
- **修改逻辑**:
  1.  **中心 Logo**: 找到原有的兔子 Logo 组件，将其 `<Image />` 的 `source` 替换为 `require('@/assets/images/kuromi/kuromi-avatar.png')`。
  2.  **快捷入口**: 遍历四个快捷访问按钮的渲染逻辑，将其中的装饰性小兔子图标组件直接**删除**或注释掉。

### 3.2. 快门按钮 (Camera)

- **操作文件**: `app/(tabs)/camera.tsx`
- **修改逻辑**:
  1.  找到快门按钮的 `<Pressable />` 组件。
  2.  将其中的图标或 `View` 替换为一个 `<Image />` 组件，`source` 指向 `require('@/assets/images/kuromi/kuromi-bat.png')`。
  3.  调整图片尺寸和样式，确保其视觉上作为快门按钮的协调性。

### 3.3. 编辑模块 (Edit Slider)

- **操作文件**: `app/(tabs)/edit.tsx`
- **修改逻辑**:
  1.  找到渲染 12 维美颜滑块的组件（可能是 `Slider` 或自定义组件）。
  2.  定位到控制滑块拖动球（Thumb）的属性，通常是 `thumbImage` 或 `renderThumbComponent`。
  3.  将其值设置为 `require('@/assets/images/kuromi/kuromi-star.png')` (带翅膀的小骷髅在图中没有，使用星星骷髅替代)。

### 3.4. 设置模块 (Settings)

- **操作文件**: `app/(tabs)/settings.tsx`
- **修改逻辑**:
  1.  **顶部 Banner**: 在页面根 `View` 的最顶层，添加一个绝对定位的 `<Image />` 组件作为背景。`source` 指向 `require('@/assets/images/kuromi/kuromi-castle-1.png')`，并设置 `opacity` 为 `0.1` 或 `0.2`。
  2.  **设置项图标**: 修改 `SETTINGS_ITEMS` 常量数组。
      -   找到“清空缓存”对应的条目，将其 `icon` 属性值改为 `'@/assets/images/kuromi/kuromi-gear-plain.png'`。
      -   找到“用户协议”对应的条目，将其 `icon` 属性值改为 `'@/assets/images/kuromi/kuromi-scroll-checkbox.png'`。
      -   在渲染逻辑中，判断 `icon` 属性是字符串还是图片资源，动态渲染 `<Ionicons />` 或 `<Image />`。

### 3.5. 相册模块 (Gallery)

- **操作文件**: `app/(tabs)/gallery.tsx`
- **修改逻辑**:
  1.  找到渲染相册“空状态”的条件逻辑（通常是当照片列表为空时）。
  2.  将其中的提示图 `<Image />` 的 `source` 替换为 `require('@/assets/images/kuromi/kuromi-backpack.png')`。

---

## 4. 设计规范与配色方案

为配合库洛米主题，全局色彩需要进行统一调整。

- **主色调 (Primary)**: `#a155e7` (库洛米紫)
- **辅助色 (Accent)**: `#e04f8f` (恶魔粉)
- **背景色 (Background)**: `#1a101f` (深黑紫)
- **前景色/文本 (Foreground)**: `#f5eefc` (淡紫色)
- **点缀色 (Muted)**: `#a28ab8` (灰紫色)

**操作**: 修改 `hooks/use-colors.ts` 或 `constants/colors.ts` 文件，更新亮色模式和暗色模式的颜色定义。

---

## 5. 署名保留

在所有页面的 `render` 函数末尾，确保以下组件被保留，以维持应用的品牌和情感核心：

```tsx
<View style={{ alignItems: 'center', padding: 20 }}>
  <Text style={{ color: '#a28ab8', fontSize: 12, fontFamily: 'NeonFont' }}>
    by Jason Tsao who loves you the most
  </Text>
</View>
```
*(注意: `fontFamily: 'NeonFont'` 为示意，需替换为实际使用的霓虹灯效果字体或样式)*

---

## 6. 后续步骤

1.  **等待沙箱恢复**: 一旦环境可用，我将自动执行以上所有步骤。
2.  **代码实现**: 将上述逻辑转化为实际的代码修改。
3.  **视觉确认**: 生成各模块的示意图供您审核。
4.  **提交与同步**: 将所有修改提交到 GitHub 仓库。
