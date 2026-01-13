# GitHub 同步和 EAS Build 配置指南

## 项目已推送到 GitHub

您的项目已成功推送到 GitHub 仓库的 `eas-build-integration` 分支：

**仓库地址**: https://github.com/Tsaojason-cao/yanbao-imaging-studio

**分支**: `eas-build-integration`

## 配置 GitHub Actions 工作流

由于 GitHub App 权限限制，工作流文件已准备好但需要手动添加。请按以下步骤操作：

### 步骤 1: 在 GitHub 网页端添加工作流文件

1. 访问仓库：https://github.com/Tsaojason-cao/yanbao-imaging-studio
2. 切换到 `eas-build-integration` 分支
3. 创建目录 `.github/workflows/`
4. 添加以下两个工作流文件：

#### 文件 1: `.github/workflows/eas-build.yml`

这个工作流负责自动化构建和发布：

- **触发条件**：推送到 main/develop 分支、Pull Request、手动触发
- **功能**：
  - 使用 EAS Build 构建 Android APK 和 iOS 应用
  - 自动创建 GitHub Release
  - 上传构建产物
  - 记录构建状态

#### 文件 2: `.github/workflows/sync-code.yml`

这个工作流负责代码同步和报告：

- **触发条件**：推送代码、每日定时、手动触发
- **功能**：
  - 检测代码变更
  - 生成同步报告
  - 记录提交历史

工作流文件内容已在项目的 `.github/workflows/` 目录中准备好。

### 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 访问：https://github.com/Tsaojason-cao/yanbao-imaging-studio/settings/secrets/actions

2. 添加以下 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `EXPO_TOKEN` | `dtP4O0ZtgZuoSRhWVRKmahI4Upn4amot1Erf_PuH` | Expo Access Token |
| `SUPABASE_URL` | `https://kbsezvxaydmalzfirhdn.supabase.co` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | `sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA` | Supabase 公开密钥 |

> **注意**: `GITHUB_TOKEN` 是自动提供的，无需手动配置。

### 步骤 3: 配置 EAS Build

在本地项目中运行以下命令配置 EAS：

```bash
# 登录 Expo 账户
npx eas-cli login

# 配置项目
npx eas-cli build:configure

# 设置环境变量（在 EAS 项目设置中）
npx eas-cli secret:create --name SUPABASE_URL --value "https://kbsezvxaydmalzfirhdn.supabase.co"
npx eas-cli secret:create --name SUPABASE_ANON_KEY --value "sb_publishable_frmsrgifeKQAPLq7SPAJAw_5QMc7dnA"
```

## 使用 GitHub Actions

### 自动构建

当您推送代码到 `main` 或 `develop` 分支时，GitHub Actions 会自动触发构建流程。

### 手动触发构建

1. 访问：https://github.com/Tsaojason-cao/yanbao-imaging-studio/actions
2. 选择 "EAS Build and Deploy" 工作流
3. 点击 "Run workflow"
4. 选择平台（Android/iOS/All）和构建配置（development/preview/production）
5. 点击 "Run workflow" 开始构建

### 查看构建状态

- **Actions 页面**：https://github.com/Tsaojason-cao/yanbao-imaging-studio/actions
- **Releases 页面**：https://github.com/Tsaojason-cao/yanbao-imaging-studio/releases

## 持续同步工作流

### 代码同步

`sync-code.yml` 工作流会：

1. **自动运行**：每次推送代码时
2. **定时运行**：每天 UTC 00:00
3. **手动触发**：在 Actions 页面手动运行

### 同步报告

每次同步后会生成 `SYNC_REPORT.md` 文件，包含：

- 最新的 5 条提交记录
- 文件变更统计
- 同步时间戳

## EAS Build 配置说明

项目的 `eas.json` 配置了三个构建配置：

### 1. Development Build

```bash
eas build --profile development --platform android
```

- 用于开发和测试
- 包含开发工具
- 构建速度快

### 2. Preview Build

```bash
eas build --profile preview --platform android
```

- 用于内部测试和预览
- 接近生产环境
- 生成 APK 文件（Android）

### 3. Production Build

```bash
eas build --profile production --platform android
```

- 用于正式发布
- 完全优化
- 可提交到应用商店

## 本地开发工作流

### 1. 开发新功能

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 开发和测试
pnpm dev

# 提交更改
git add .
git commit -m "Add: your feature description"

# 推送到 GitHub
git push github feature/your-feature-name
```

### 2. 创建 Pull Request

1. 访问 GitHub 仓库
2. 创建 Pull Request 到 `main` 分支
3. GitHub Actions 会自动运行测试和构建
4. 合并后自动触发生产构建

### 3. 查看构建结果

- 在 GitHub Actions 页面查看构建日志
- 在 Releases 页面下载构建产物
- 在 EAS 控制台查看详细构建信息

## 故障排查

### 构建失败

1. 检查 GitHub Actions 日志
2. 确认所有 Secrets 已正确配置
3. 检查 EAS 账户配额
4. 验证 `eas.json` 配置

### 推送失败

1. 确认 GitHub 权限
2. 检查分支保护规则
3. 验证 Git 配置

### Supabase 连接问题

1. 验证 SUPABASE_URL 和 SUPABASE_ANON_KEY
2. 检查 Supabase 项目状态
3. 运行测试：`pnpm test tests/supabase.test.ts`

## 下一步

1. ✅ 项目已推送到 GitHub
2. ⏳ 在 GitHub 网页端添加工作流文件
3. ⏳ 配置 GitHub Secrets
4. ⏳ 运行 EAS Build 配置命令
5. ⏳ 测试完整的 CI/CD 流程

## 相关链接

- **GitHub 仓库**: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- **EAS Build 文档**: https://docs.expo.dev/build/introduction/
- **GitHub Actions 文档**: https://docs.github.com/en/actions
- **Supabase 文档**: https://supabase.com/docs
