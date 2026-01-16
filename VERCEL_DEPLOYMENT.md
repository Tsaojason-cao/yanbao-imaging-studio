# Yanbao AI 官网 - Vercel 部署指南

## ✅ 已完成配置

我已经为您完成了以下配置工作：

1. **创建 Vercel 配置文件** (`vercel.json`)
   - 配置了构建命令：`pnpm build`
   - 设置输出目录：`dist/public`
   - 配置了 SPA 路由重写规则
   - 添加了安全响应头
   - 优化了 PWA Service Worker 缓存策略

2. **创建 .vercelignore 文件**
   - 排除不必要的文件和目录

3. **推送到 GitHub**
   - 所有配置文件已提交并推送到 `main` 分支

---

## 🚀 部署步骤

### 方法一：通过 Vercel 网页界面部署（推荐）

1. **访问 Vercel 部署页面**
   - 打开：https://vercel.com/new
   - 使用您的 GitHub 账号登录

2. **导入仓库**
   - 在 "Import Git Repository" 部分
   - 找到 `yanbao-imaging-studio` 仓库
   - 点击 **Import** 按钮

3. **配置项目**
   - **Project Name**: `yanbao-imaging-studio`（或自定义）
   - **Framework Preset**: Vite（会自动检测）
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: `pnpm build`（已在 vercel.json 配置）
   - **Output Directory**: `dist/public`（已在 vercel.json 配置）
   - **Install Command**: `pnpm install`（已在 vercel.json 配置）

4. **部署**
   - 点击 **Deploy** 按钮
   - 等待 2-3 分钟完成构建和部署

5. **获取网址**
   - 部署成功后，您会获得一个永久网址，格式如：
     - `https://yanbao-imaging-studio.vercel.app`
     - 或自定义域名

---

### 方法二：使用 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
cd /home/ubuntu/yanbao-imaging-studio
vercel --prod
```

---

## 🔧 项目配置说明

### 构建配置
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "installCommand": "pnpm install"
}
```

### 路由配置
- 所有路由都会重定向到 `index.html`，支持 React Router 的客户端路由

### PWA 支持
- Service Worker 已配置为自动更新
- 支持离线访问
- 图标和 manifest 已配置

---

## 📝 注意事项

1. **首次部署时间**：约 2-3 分钟（需要安装依赖和构建）
2. **后续部署**：每次推送到 `main` 分支都会自动触发部署
3. **环境变量**：如需配置环境变量，在 Vercel 项目设置中添加
4. **自定义域名**：可在 Vercel 项目设置中绑定自定义域名

---

## 🎯 部署后验证

部署成功后，请验证以下功能：

- [ ] 首页正常加载
- [ ] 路由跳转正常
- [ ] PWA 功能正常（可添加到主屏幕）
- [ ] TensorFlow.js AI 功能正常
- [ ] 图片加载正常
- [ ] 响应式布局正常

---

## 🔗 相关链接

- **GitHub 仓库**: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- **Vercel 控制台**: https://vercel.com/dashboard
- **Vercel 文档**: https://vercel.com/docs

---

## 💡 提示

- Vercel 免费套餐包含：
  - 无限部署
  - 自动 HTTPS
  - 全球 CDN
  - 自动 Git 集成
  - 每月 100GB 带宽

祝部署顺利！🎉
