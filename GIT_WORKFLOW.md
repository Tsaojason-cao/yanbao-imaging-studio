# yanbao AI - Git 同步和备份完整流程

## 🎯 目标

确保新 Manus 账号能够：
1. 无缝同步代码
2. 安全备份数据
3. 协作开发不冲突

---

## 🚀 新账号初始化（首次）

### Step 1: 配置 Git 环境

```bash
# 1.1 配置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 1.2 配置 GitHub CLI
gh auth login
# 选择: GitHub.com
# 选择: HTTPS
# 选择: Login with a web browser
# 复制 one-time code 并在浏览器中授权

# 1.3 验证配置
git config --list
gh auth status
```

### Step 2: 克隆项目

```bash
# 2.1 克隆仓库
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 2.2 查看远程仓库
git remote -v

# 2.3 查看分支
git branch -a

# 2.4 查看最新提交
git log --oneline -10
```

### Step 3: 安装依赖

```bash
# 3.1 安装 Node.js 依赖
pnpm install

# 3.2 安装 Python 依赖
pip3 install -r requirements.txt

# 3.3 验证安装
pnpm list
pip3 list
```

---

## 🔄 日常同步流程

### 每天开始工作前

```bash
# 1. 进入项目目录
cd /path/to/yanbao-imaging-studio

# 2. 查看当前状态
git status

# 3. 拉取最新代码
git pull origin main

# 4. 查看更新内容
git log --oneline -5

# 5. 查看文件变化
git diff HEAD~1 HEAD

# 6. 更新依赖（如果 package.json 有变化）
pnpm install
```

### 工作中定期提交

```bash
# 1. 查看修改的文件
git status

# 2. 查看具体修改内容
git diff

# 3. 添加文件到暂存区
git add <file>              # 添加单个文件
git add src/                # 添加整个目录
git add .                   # 添加所有修改

# 4. 提交（使用规范的提交信息）
git commit -m "feat: add memory activation system"

# 5. 查看提交历史
git log --oneline -5
```

### 每天结束工作后

```bash
# 1. 确保所有修改已提交
git status

# 2. 推送到远程仓库
git push origin main

# 3. 验证推送成功
gh repo view --web
# 在浏览器中查看最新提交

# 4. 创建每日备份
./scripts/daily_backup.sh
```

---

## 📝 提交信息规范

### 提交类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add memory activation system` |
| `fix` | Bug 修复 | `fix: resolve memory retrieval timeout` |
| `docs` | 文档更新 | `docs: update execution playbook` |
| `refactor` | 代码重构 | `refactor: optimize master reasoning logic` |
| `test` | 测试相关 | `test: add unit tests for memory service` |
| `chore` | 构建/工具 | `chore: update dependencies` |
| `style` | 代码格式 | `style: format code with prettier` |
| `perf` | 性能优化 | `perf: improve vector search speed` |

### 提交信息格式

```
<type>: <subject>

<body>

<footer>
```

**示例**:

```bash
git commit -m "feat: implement Chain of Thought reasoning

- Add MasterReasoning class with 6-step reasoning chain
- Add Flask API for master advice
- Add prompt templates for 3 master types
- Integrate API calls into frontend

Closes #123"
```

### 快速提交模板

```bash
# 功能开发
git commit -m "feat: [描述新功能]"

# Bug 修复
git commit -m "fix: [描述修复的问题]"

# 文档更新
git commit -m "docs: [描述文档更新]"

# 代码重构
git commit -m "refactor: [描述重构内容]"

# 测试
git commit -m "test: [描述测试内容]"
```

---

## 💾 备份策略

### 自动备份脚本

创建备份脚本：

```bash
# scripts/daily_backup.sh
#!/bin/bash

# 配置
PROJECT_DIR="/path/to/yanbao-imaging-studio"
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="yanbao_backup_${DATE}.tar.gz"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 进入项目目录
cd "$PROJECT_DIR"

# 创建备份（排除 node_modules 和 .git）
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='build' \
  --exclude='dist' \
  .

# 验证备份
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}" ]; then
  SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}" | cut -f1)
  echo "✅ 备份成功: ${BACKUP_NAME} (${SIZE})"
else
  echo "❌ 备份失败"
  exit 1
fi

# 清理旧备份（保留最近 7 天）
find "$BACKUP_DIR" -name "yanbao_backup_*.tar.gz" -mtime +7 -delete

echo "✅ 旧备份已清理"
```

设置执行权限：

```bash
chmod +x scripts/daily_backup.sh
```

### 手动备份

```bash
# 完整备份
tar -czf yanbao_backup_$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  .

# 仅备份代码
tar -czf yanbao_code_$(date +%Y%m%d).tar.gz \
  src/ backend/ *.md package.json

# 仅备份文档
tar -czf yanbao_docs_$(date +%Y%m%d).tar.gz \
  *.md docs/
```

### 云端备份（可选）

```bash
# 使用 AWS S3
aws s3 cp yanbao_backup_$(date +%Y%m%d).tar.gz \
  s3://yanbao-backup/

# 使用 Google Drive (需要安装 rclone)
rclone copy yanbao_backup_$(date +%Y%m%d).tar.gz \
  gdrive:yanbao-backup/

# 使用 GitHub Releases
gh release create v1.0.0 \
  yanbao_backup_$(date +%Y%m%d).tar.gz \
  --title "Backup $(date +%Y-%m-%d)" \
  --notes "Daily backup"
```

---

## 🔀 分支管理

### 创建功能分支

```bash
# 1. 创建并切换到新分支
git checkout -b feature/memory-activation

# 2. 开发功能...

# 3. 提交代码
git add .
git commit -m "feat: implement memory activation"

# 4. 推送到远程
git push origin feature/memory-activation

# 5. 创建 Pull Request
gh pr create --title "Add memory activation system" \
  --body "Implements memory activation with vector search"
```

### 合并分支

```bash
# 1. 切换到主分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 合并功能分支
git merge feature/memory-activation

# 4. 解决冲突（如果有）
# 编辑冲突文件，然后：
git add <conflicted-file>
git commit -m "merge: resolve conflicts"

# 5. 推送到远程
git push origin main

# 6. 删除功能分支
git branch -d feature/memory-activation
git push origin --delete feature/memory-activation
```

---

## 🚨 常见问题处理

### 问题 1: 拉取代码时有冲突

```bash
# 1. 查看冲突文件
git status

# 2. 查看冲突内容
git diff

# 3. 编辑冲突文件，保留需要的代码
# 删除冲突标记: <<<<<<<, =======, >>>>>>>

# 4. 标记为已解决
git add <conflicted-file>

# 5. 完成合并
git commit -m "merge: resolve conflicts"

# 6. 推送
git push origin main
```

### 问题 2: 误提交了敏感信息

```bash
# 1. 从最新提交中删除文件
git rm --cached <sensitive-file>
git commit -m "chore: remove sensitive file"

# 2. 从历史记录中删除（谨慎使用）
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <sensitive-file>" \
  --prune-empty --tag-name-filter cat -- --all

# 3. 强制推送
git push origin main --force
```

### 问题 3: 需要回退到之前的版本

```bash
# 1. 查看提交历史
git log --oneline

# 2. 回退到指定提交（保留修改）
git reset --soft <commit-hash>

# 3. 回退到指定提交（丢弃修改）
git reset --hard <commit-hash>

# 4. 推送（需要强制推送）
git push origin main --force
```

### 问题 4: 本地修改与远程冲突

```bash
# 方案 1: 暂存本地修改
git stash
git pull origin main
git stash pop

# 方案 2: 放弃本地修改
git reset --hard origin/main

# 方案 3: 创建新分支保存本地修改
git checkout -b backup-local-changes
git commit -am "backup: save local changes"
git checkout main
git pull origin main
```

---

## 🔍 代码审查流程

### 提交前自查

```bash
# 1. 运行 Linter
npm run lint

# 2. 运行测试
npm test

# 3. 检查代码格式
npm run format:check

# 4. 查看修改内容
git diff

# 5. 确认无误后提交
git commit -m "feat: [描述]"
```

### Pull Request 检查清单

- [ ] 代码符合规范
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 提交信息清晰
- [ ] 无敏感信息
- [ ] 功能完整可用

---

## 📊 Git 工作流可视化

```
main (生产分支)
  ↓
  ├─ feature/memory-activation (功能分支)
  │   ├─ commit: implement memory storage
  │   ├─ commit: implement memory retrieval
  │   └─ commit: add tests
  │   ↓
  │   merge → main
  │
  ├─ feature/master-reasoning (功能分支)
  │   ├─ commit: implement reasoning chain
  │   ├─ commit: add API endpoints
  │   └─ commit: integrate with frontend
  │   ↓
  │   merge → main
  │
  └─ hotfix/memory-timeout (紧急修复)
      ├─ commit: fix timeout issue
      ↓
      merge → main
```

---

## ✅ 每日检查清单

### 早上开始工作

- [ ] `git pull origin main` - 拉取最新代码
- [ ] `git log --oneline -5` - 查看最新提交
- [ ] `pnpm install` - 更新依赖（如需要）
- [ ] 阅读团队更新的文档

### 工作中

- [ ] 定期 `git status` - 查看修改状态
- [ ] 小步提交 - 每完成一个小功能就提交
- [ ] 写清晰的提交信息
- [ ] 运行测试确保代码质量

### 晚上结束工作

- [ ] `git status` - 确保所有修改已提交
- [ ] `git push origin main` - 推送到远程
- [ ] `./scripts/daily_backup.sh` - 创建备份
- [ ] 更新工作日志

---

## 🎯 最佳实践

### 1. 提交频率
- ✅ 小步提交，每完成一个小功能就提交
- ❌ 不要积累大量修改后一次性提交

### 2. 提交信息
- ✅ 清晰描述做了什么
- ✅ 使用规范的提交类型
- ❌ 不要写模糊的信息如 "update" 或 "fix bug"

### 3. 分支管理
- ✅ 功能开发使用功能分支
- ✅ 主分支保持稳定
- ❌ 不要直接在主分支上开发大功能

### 4. 代码审查
- ✅ 提交前自查代码
- ✅ 运行所有测试
- ❌ 不要提交未测试的代码

### 5. 备份策略
- ✅ 每天创建备份
- ✅ 定期清理旧备份
- ✅ 重要节点创建云端备份

---

## 📞 获取帮助

### Git 相关
- **官方文档**: https://git-scm.com/doc
- **GitHub 文档**: https://docs.github.com/

### 问题排查
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/git
- **GitHub Community**: https://github.community/

---

**文档作者**: Jason Tsao  
**更新时间**: 2026年1月17日  
**版本**: 1.0

**遵循这个流程，确保代码安全和团队协作顺畅！** 🚀
