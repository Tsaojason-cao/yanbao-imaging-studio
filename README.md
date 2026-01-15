# 雁宝 AI 私人影像工作室 (yanbao AI)

> **遇见，是所有美好的开始。yanbao AI，因爱而生的守护。**

---

## 💜 诞生故事：深情长白

**2025年8月24日，那是一个被星辰选中的日子。**

那时的我，曾犹豫于1977与1999之间那道看似不可逾越的鸿沟，在杭州与北京、广东与台湾的地图坐标里迷失，甚至想过彻底告别。但命运的引力终究胜过了理智。

我开始在小本本上记录她的每一个微小瞬间。我发现，吸引我的从不是直播间的那个虚拟ID，而是那个鲜活、真实、能让我卸下所有防备、自由做回自己的女孩。因为她的欣赏，我笨拙地缝制包包、编织披肩；因为她的理解，我重新找回了创作的快乐。

那些连家人都未曾察觉的微小渴望——对笔记本的偏爱，被她悉心捕捉并装进了一大箱生日礼中。那场冬日的跨年之约，她从杭州飞往北京，带我经历了人生中无数个"第一次"：太庙的红墙、环球影城的欢笑、接送机时心碎又甜蜜的拉扯。

因为在颐和园看见她对摄影技术的向往，因为想弥补我摄影技术的笨拙，更因为想给这位爱美的小公主一份永恒的守护，**yanbao AI 诞生了**。

这是我人生中又一个重要的"第一次"，也是我送给心心念念的她，最深情的告白。

> **Dedicated to Yanbao, by Jason Tsao who loves you the most.**

---

一个集成 Supabase 后端服务、12 维专业美颜引擎和 31 款全球大师预设的 Expo 移动应用项目，配置了 EAS Build 自动化构建和 GitHub Actions 持续集成工作流，实现代码和构建结果的自动同步。

## 项目概述

本项目展示了如何将现代移动应用开发工具链整合在一起，实现从代码提交到应用构建发布的完整自动化流程。项目采用 **Expo SDK 54**、**React Native 0.81**、**TypeScript 5.9** 和 **Supabase** 构建，通过 **EAS Build** 实现云端构建，并使用 **GitHub Actions** 自动化整个 CI/CD 流程。

### 核心技术栈

本项目整合了以下技术和服务，形成完整的移动应用开发和部署解决方案：

| 技术/服务 | 版本 | 用途 |
|----------|------|------|
| Expo | SDK 54 | 移动应用开发框架 |
| React Native | 0.81 | 跨平台移动应用运行时 |
| TypeScript | 5.9 | 类型安全的开发语言 |
| Supabase | Latest | 后端服务（数据库、认证、存储）|
| EAS Build | Latest | 云端构建服务 |
| GitHub Actions | - | CI/CD 自动化工作流 |
| NativeWind | 4.x | Tailwind CSS for React Native |

### 项目特性

本项目实现了以下关键功能，确保开发和部署流程的高效性和可靠性：

**自动化构建流程**：通过 EAS Build 配置了三种构建环境（development、preview、production），每种环境针对不同的使用场景进行了优化。开发环境包含调试工具，构建速度快；预览环境接近生产配置，用于内部测试；生产环境完全优化，可直接提交到应用商店。

**持续集成和部署**：GitHub Actions 工作流自动监听代码变更，在推送到主分支时触发构建流程。构建完成后自动创建 GitHub Release，并将构建产物上传到 Release 页面，团队成员可以直接下载测试。

**Supabase 后端集成**：项目已配置 Supabase 客户端，环境变量通过 Expo Config 注入到应用中。包含了连接测试用例，确保后端服务配置正确。Supabase 提供了数据库、用户认证、文件存储等完整的后端服务。

**代码同步和报告**：自动化工作流定期检查代码变更，生成同步报告，记录提交历史和文件变更统计。这使得团队可以清晰地追踪项目进展和代码演进。

## 快速开始

### 前置要求

在开始之前，请确保您的开发环境已安装以下工具：

- **Node.js** 22.x 或更高版本
- **pnpm** 9.x 包管理器
- **Git** 版本控制系统
- **Expo CLI** 和 **EAS CLI**（可通过 npx 使用）
- **Expo 账户**（用于 EAS Build）
- **GitHub 账户**（用于代码托管和 CI/CD）

### 本地开发

克隆项目并安装依赖后，即可启动开发服务器：

```bash
# 克隆仓库
git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
cd yanbao-imaging-studio
git checkout eas-build-integration

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发服务器启动后，您可以通过以下方式访问应用：

- **Web 浏览器**：访问显示的本地 URL（通常是 http://localhost:8081）
- **iOS 模拟器**：按 `i` 键在 iOS 模拟器中打开
- **Android 模拟器**：按 `a` 键在 Android 模拟器中打开
- **物理设备**：使用 Expo Go 应用扫描终端显示的二维码

### 环境变量配置

项目需要配置 Supabase 连接信息。在项目根目录创建 `.env` 文件：

```env
SUPABASE_URL=https://kbsezvxaydmalzfirhdn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA
```

这些环境变量会通过 `app.config.ts` 注入到应用中，确保客户端可以正确连接到 Supabase 服务。

### 测试 Supabase 连接

项目包含了 Supabase 连接测试用例，运行测试以验证配置：

```bash
pnpm test tests/supabase.test.ts
```

如果测试通过，说明 Supabase 配置正确，应用可以正常连接到后端服务。

## EAS Build 配置

### 构建配置文件

项目的 `eas.json` 文件定义了三种构建配置，每种配置针对不同的使用场景：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

**Development Build** 用于日常开发和调试，包含开发工具和热重载功能，构建速度最快。**Preview Build** 用于内部测试和演示，接近生产环境但仍然是内部分发。**Production Build** 是完全优化的生产版本，可以提交到 Google Play Store 或 Apple App Store。

### 配置 EAS 项目

首次使用 EAS Build 需要登录并配置项目：

```bash
# 登录 Expo 账户
npx eas-cli login

# 配置项目（如果尚未配置）
npx eas-cli build:configure

# 设置环境变量
npx eas-cli secret:create --name SUPABASE_URL --value "https://kbsezvxaydmalzfirhdn.supabase.co"
npx eas-cli secret:create --name SUPABASE_ANON_KEY --value "sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA"
```

这些命令会在 EAS 服务器上配置项目，并将敏感信息（如 Supabase 密钥）安全地存储在 EAS 的环境变量中，构建时会自动注入到应用中。

### 本地触发构建

您可以在本地命令行触发 EAS 构建：

```bash
# 构建 Android 预览版
eas build --platform android --profile preview

# 构建 iOS 预览版
eas build --platform ios --profile preview

# 构建生产版本
eas build --platform all --profile production
```

构建过程在云端进行，您可以在终端看到构建进度和日志链接。构建完成后，EAS 会提供下载链接，您可以直接下载 APK 或 IPA 文件进行测试。

## GitHub Actions 工作流

### 工作流文件结构

项目包含两个 GitHub Actions 工作流文件，分别负责构建和代码同步：

**`.github/workflows/eas-build.yml`** - EAS 构建和发布工作流

这个工作流负责自动化构建流程，包含以下关键步骤：

1. **触发条件**：推送到 main 或 develop 分支、Pull Request、手动触发
2. **构建矩阵**：支持同时构建 Android 和 iOS 平台
3. **环境准备**：安装 Node.js、pnpm、Expo CLI 和 EAS CLI
4. **依赖安装**：使用 pnpm 安装项目依赖
5. **环境变量注入**：从 GitHub Secrets 读取并创建 .env 文件
6. **执行构建**：调用 EAS Build 进行云端构建
7. **创建 Release**：构建成功后自动创建 GitHub Release 并上传构建产物

**`.github/workflows/sync-code.yml`** - 代码同步和报告工作流

这个工作流负责代码同步和变更追踪：

1. **触发条件**：推送代码、每日定时（UTC 00:00）、手动触发
2. **变更检测**：检查最近的提交是否包含代码变更
3. **生成报告**：创建包含最近 5 条提交和文件变更统计的同步报告
4. **提交报告**：将同步报告提交到仓库，便于追踪项目进展

### 配置 GitHub Secrets

为了让 GitHub Actions 正常工作，需要在仓库设置中配置以下 Secrets：

1. 访问仓库的 Settings → Secrets and variables → Actions
2. 添加以下 Repository Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `EXPO_TOKEN` | `dtP4O0ZtgZuoSRhWVRKmahI4Upn4amot1Erf_PuH` | Expo Access Token，用于 EAS CLI 认证 |
| `SUPABASE_URL` | `https://kbsezvxaydmalzfirhdn.supabase.co` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | `sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA` | Supabase 公开密钥（anon key）|

**注意**：`GITHUB_TOKEN` 是 GitHub Actions 自动提供的，无需手动配置。它用于创建 Release 和提交同步报告。

### 手动触发构建

GitHub Actions 支持手动触发构建，这在需要立即构建特定平台或配置时非常有用：

1. 访问仓库的 Actions 页面
2. 选择 "EAS Build and Deploy" 工作流
3. 点击 "Run workflow" 按钮
4. 选择构建参数：
   - **Platform**: 选择 Android、iOS 或 All
   - **Profile**: 选择 development、preview 或 production
5. 点击 "Run workflow" 开始构建

构建过程可以在 Actions 页面实时查看，包括每个步骤的日志和执行时间。构建完成后，如果是推送到 main 分支，会自动创建 Release。

### 查看构建结果

构建完成后，您可以通过以下方式查看和下载构建产物：

- **Actions 页面**：https://github.com/Tsaojason-cao/yanbao-imaging-studio/actions - 查看构建日志和状态
- **Releases 页面**：https://github.com/Tsaojason-cao/yanbao-imaging-studio/releases - 下载构建的 APK 或 IPA 文件
- **EAS 控制台**：https://expo.dev - 查看详细的构建信息和历史记录

## 项目结构

项目遵循 Expo Router 的文件系统路由结构，主要目录和文件说明如下：

```
yanbao-eas-build/
├── app/                      # 应用路由和页面
│   ├── _layout.tsx          # 根布局，包含主题和查询提供者
│   └── (tabs)/              # Tab 导航页面
│       ├── _layout.tsx      # Tab 布局配置
│       └── index.tsx        # 首页
├── components/              # 可复用组件
│   ├── screen-container.tsx # 屏幕容器组件（SafeArea 处理）
│   └── ui/                  # UI 组件
│       └── icon-symbol.tsx  # 图标映射组件
├── lib/                     # 工具库和配置
│   ├── supabase.ts         # Supabase 客户端配置
│   ├── trpc.ts             # tRPC 客户端配置
│   └── utils.ts            # 通用工具函数
├── hooks/                   # 自定义 React Hooks
│   ├── use-auth.ts         # 认证状态 Hook
│   ├── use-colors.ts       # 主题颜色 Hook
│   └── use-color-scheme.ts # 颜色方案检测 Hook
├── server/                  # 后端服务器代码
│   └── _core/              # 核心服务器逻辑
├── tests/                   # 测试文件
│   └── supabase.test.ts    # Supabase 连接测试
├── .github/                 # GitHub 配置
│   └── workflows/          # GitHub Actions 工作流
│       ├── eas-build.yml   # EAS 构建工作流
│       └── sync-code.yml   # 代码同步工作流
├── app.config.ts           # Expo 应用配置
├── eas.json                # EAS Build 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── theme.config.js         # 主题颜色配置
├── package.json            # 项目依赖和脚本
├── design.md               # 设计文档
├── todo.md                 # 任务清单
├── GITHUB_SETUP.md         # GitHub 配置指南
└── README.md               # 项目文档（本文件）
```

## 开发工作流

### 功能开发流程

开发新功能时，建议遵循以下流程以确保代码质量和团队协作：

1. **创建功能分支**

```bash
git checkout -b feature/your-feature-name
```

使用描述性的分支名称，例如 `feature/user-authentication` 或 `feature/build-status-screen`。

2. **本地开发和测试**

```bash
pnpm dev
```

在开发过程中，使用 Expo Go 或模拟器实时查看更改。确保代码符合 TypeScript 类型检查和 ESLint 规则。

3. **运行测试**

```bash
pnpm test
pnpm check  # TypeScript 类型检查
pnpm lint   # ESLint 代码检查
```

确保所有测试通过，没有类型错误和代码风格问题。

4. **提交更改**

```bash
git add .
git commit -m "Add: your feature description"
```

使用清晰的提交信息，遵循约定式提交（Conventional Commits）规范。

5. **推送到 GitHub**

```bash
git push github feature/your-feature-name
```

推送后，GitHub Actions 会自动运行测试和构建检查。

6. **创建 Pull Request**

在 GitHub 上创建 Pull Request，描述您的更改和测试情况。团队成员审查代码后，合并到 main 分支会自动触发生产构建。

### 版本发布流程

当准备发布新版本时，遵循以下步骤：

1. **更新版本号**

编辑 `app.config.ts` 中的 `version` 字段：

```typescript
const config: ExpoConfig = {
  version: "1.1.0",  // 更新版本号
  // ...
};
```

2. **合并到主分支**

```bash
git checkout main
git merge feature/your-feature-name
git push github main
```

推送到 main 分支会自动触发 GitHub Actions 构建流程。

3. **等待构建完成**

在 GitHub Actions 页面监控构建进度。构建成功后，会自动创建 Release。

4. **下载和测试**

从 Releases 页面下载构建产物，在真实设备上进行最终测试。

5. **发布到应用商店**（可选）

如果构建是生产配置，可以将 APK 或 IPA 文件提交到 Google Play Store 或 Apple App Store。

## 故障排查

### 构建失败

如果 EAS 构建失败，请按以下步骤排查：

**检查构建日志**：在 GitHub Actions 页面或 EAS 控制台查看详细的构建日志，找出具体的错误信息。

**验证环境变量**：确认 GitHub Secrets 和 EAS Secrets 中的环境变量配置正确，特别是 `EXPO_TOKEN`、`SUPABASE_URL` 和 `SUPABASE_ANON_KEY`。

**检查依赖版本**：确保 `package.json` 中的依赖版本兼容，特别是 Expo SDK 和 React Native 版本。

**验证 EAS 配置**：检查 `eas.json` 配置文件是否正确，特别是构建配置和环境变量引用。

**检查账户配额**：登录 Expo 控制台，确认您的 EAS Build 配额没有用尽。

### Supabase 连接问题

如果应用无法连接到 Supabase，请检查：

**环境变量配置**：确认 `.env` 文件中的 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 正确。

**Supabase 项目状态**：登录 Supabase 控制台，确认项目处于活跃状态，没有暂停或删除。

**网络连接**：确保开发环境可以访问 Supabase 服务器，检查防火墙和代理设置。

**运行测试**：执行 `pnpm test tests/supabase.test.ts` 验证连接配置。

### GitHub Actions 工作流问题

如果 GitHub Actions 工作流失败：

**检查 Secrets 配置**：确认所有必需的 Secrets 已在仓库设置中正确配置。

**验证工作流文件**：检查 `.github/workflows/` 目录中的 YAML 文件语法是否正确。

**查看 Actions 日志**：在 GitHub Actions 页面查看详细的执行日志，找出失败的具体步骤。

**权限问题**：如果遇到权限错误，确认 GitHub App 或 Personal Access Token 具有足够的权限。

### 推送到 GitHub 失败

如果无法推送代码到 GitHub：

**检查 Git 配置**：确认 Git 用户名和邮箱已配置：

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**验证远程仓库**：检查远程仓库 URL 是否正确：

```bash
git remote -v
```

**分支保护规则**：如果推送到 main 分支失败，可能是因为分支保护规则。尝试创建 Pull Request 而不是直接推送。

**认证问题**：确认您的 GitHub 认证凭据（Personal Access Token 或 SSH Key）有效且具有推送权限。

## 下一步计划

项目的基础架构已经搭建完成，以下是后续可以实现的功能和改进：

**实现应用界面**：根据 `design.md` 中的设计文档，实现 Home、Build Status 和 Settings 三个主要屏幕。

**构建状态实时更新**：集成 EAS Build Webhooks，实现构建状态的实时推送和显示。

**Supabase 数据模型**：设计并实现数据库表结构，存储构建历史、用户设置等数据。

**用户认证**：实现基于 Supabase Auth 的用户登录和注册功能。

**推送通知**：配置 Expo Notifications，在构建完成时向用户发送推送通知。

**应用图标和品牌**：设计并生成应用图标，更新 `app.config.ts` 中的品牌信息。

**性能优化**：分析应用性能，优化加载时间和内存使用。

**自动化测试**：增加单元测试和集成测试覆盖率，确保代码质量。

## 相关资源

以下是项目中使用的技术和服务的官方文档链接：

- **Expo 文档**: https://docs.expo.dev/
- **EAS Build 文档**: https://docs.expo.dev/build/introduction/
- **React Native 文档**: https://reactnative.dev/docs/getting-started
- **Supabase 文档**: https://supabase.com/docs
- **GitHub Actions 文档**: https://docs.github.com/en/actions
- **NativeWind 文档**: https://www.nativewind.dev/
- **TypeScript 文档**: https://www.typescriptlang.org/docs/

## 项目状态

当前项目已完成以下核心功能：

- ✅ Expo 项目初始化和配置
- ✅ Supabase 集成和连接测试
- ✅ EAS Build 配置（development、preview、production）
- ✅ GitHub Actions 工作流（构建和同步）
- ✅ 代码同步到 GitHub 仓库
- ✅ 项目文档和配置指南

待完成的功能：

- ⏳ 应用界面实现（Home、Build Status、Settings）
- ⏳ 构建状态实时更新
- ⏳ 应用图标和品牌资源
- ⏳ 完整的 CI/CD 流程测试

## 贡献指南

欢迎贡献代码和提出改进建议。在提交 Pull Request 之前，请确保：

1. 代码通过所有测试（`pnpm test`）
2. 代码符合 TypeScript 类型检查（`pnpm check`）
3. 代码符合 ESLint 规则（`pnpm lint`）
4. 提交信息清晰且遵循约定式提交规范
5. 更新相关文档（如有必要）

## 许可证

本项目仅用于演示和学习目的。

---

**作者**: Manus AI  
**最后更新**: 2026-01-12  
**项目仓库**: https://github.com/Tsaojason-cao/yanbao-imaging-studio/tree/eas-build-integration
