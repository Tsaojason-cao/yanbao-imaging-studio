# yanbao AI v2.4.2 - Hermes 引擎深度优化计划

## 🎯 目标

在已启用 Hermes 的基础上，通过**代码拆分**和**原生模块优化**，进一步提升 App 的冷启动速度和运行时性能。

---

## 🚀 优化策略

### 1. 启用代码拆分 (Code Splitting)

- **策略**: 使用 Expo Router 的**异步路由**功能，将非首屏的页面和组件拆分成独立的 JS 包 (chunks)。
- **优势**: 减少初始 JS 包的大小，只在需要时加载相应页面的代码，显著加快冷启动速度。
- **实现**: 将 `app/(tabs)/` 目录下的路由从 `(tabs)/camera.tsx` 形式改为 `(tabs)/camera/index.tsx`，并使用异步导入。
- **示例**:
  ```typescript
  // app/(tabs)/_layout.tsx
  import { Tabs } from 'expo-router';

  export default function TabLayout() {
    return (
      <Tabs>
        <Tabs.Screen name="home" />
        {/* 异步加载 camera 路由 */}
        <Tabs.Screen name="camera" />
      </Tabs>
    );
  }
  ```
- **预期效果**: 初始 JS 包大小减少 30-50%，冷启动时间缩短 200-400ms。

### 2. 启用 React Compiler

- **策略**: 在 `app.config.ts` 中启用 React Compiler，让编译器自动优化 React 组件的渲染。
- **优势**: 减少不必要的重渲染，提升 UI 响应速度和运行时性能。
- **实现**: 已在 v2.4.1 中启用，v2.4.2 需持续验证其效果。
  ```typescript
  // app.config.ts
  experiments: {
    typedRoutes: true,
    reactCompiler: true, // 确保开启
  },
  ```
- **预期效果**: 交互密集型页面（如编辑页）的性能提升 10-20%。

### 3. 分析和优化 Bundle 大小

- **策略**: 使用 `react-native-bundle-visualizer` 工具，分析最终 JS 包的构成，找出并优化体积过大的第三方库。
- **工具**: `react-native-bundle-visualizer`
- **命令示例**:
  ```bash
  npx react-native-bundle-visualizer
  ```
- **优化方向**:
  - **替换重型库**: 例如，使用 `date-fns` 代替 `moment.js`。
  - **按需导入**: 对于 `lodash` 等库，使用 `lodash/fp` 或按需导入具体函数。
- **预期效果**: JS 包大小进一步减少 10-15%。

---

## 💡 实施建议

1. **从 Tab 路由开始**: 优先对主 Tab 路由进行代码拆分，这是最影响启动性能的部分。
2. **性能分析**: 在实施每项优化后，使用 `Flashlight` 或 `Perfetto` 等工具进行性能分析，量化优化效果。
3. **回归测试**: 每次优化后，进行完整的回归测试，确保没有引入新的 bug。

---

## 📈 预期成果

| 策略 | 预期启动时间缩短 | 预期运行时性能提升 |
| :--- | :--- | :--- |
| **代码拆分** | 200-400ms | - |
| **React Compiler** | - | 10-20% |
| **Bundle 分析** | 50-100ms | 5-10% |
| **总计** | **250-500ms** | **15-30%** |

通过实施以上策略，预计可将 App 的冷启动时间从 ~1.5 秒进一步缩短至 **1.0-1.2 秒**，并显著提升运行时的流畅度和响应速度。
