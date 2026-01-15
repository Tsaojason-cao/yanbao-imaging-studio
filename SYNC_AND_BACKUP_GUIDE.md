## 🔄 代码同步 (Sync)

代码同步是通过 Git 版本控制系统完成的，它能确保您本地的开发环境与 GitHub 上的远程仓库保持一致。

### 核心概念

-   **远程仓库 (Remote Repository)**: 位于 GitHub 上的项目主副本 (`Tsaojason-cao/yanbao-imaging-studio`)。
-   **本地仓库 (Local Repository)**: 您电脑上克隆的项目副本。
-   **`git pull`**: 从远程仓库**拉取**最新的代码变更到您的本地仓库。
-   **`git push`**: 将您在本地提交的**推送**到远程仓库。

### 操作流程

#### 1. 开始新工作前：拉取最新代码

在您开始对代码进行任何修改之前，务必先执行 `git pull`，以确保您的本地代码是最新版本。这可以有效避免与他人的修改产生冲突。

```bash
# 切换到项目目录
cd yanbao-imaging-studio

# 从 main 分支拉取最新代码
git pull origin main
```

#### 2. 完成修改后：提交并推送代码

当您完成了一部分工作（例如，修复了一个 bug 或完成了一个新功能），请按照以下步骤提交并推送您的修改：

```bash
# 1. 添加所有修改过的文件到暂存区
git add .

# 2. 提交修改并撰写清晰的提交信息
git commit -m "feat: 添加了新的库洛米主题启动页"

# 3. 将本地提交推送到远程仓库
git push origin main
```

---

## 📦 项目备份 (Backup)

项目备份有两种主要方式：**Git 仓库本身** 和 **物理快照备份**。我已为您准备好两种形式的备份。

### 方式一：Git 仓库（云端实时备份）

**您的 GitHub 仓库本身就是最强大的备份**。每一次 `git push` 都会将您的代码连同完整的修改历史记录安全地保存在 GitHub 的服务器上。

-   **优点**: 实时、包含所有历史版本、可随时回滚到任何一个版本。
-   **操作**: 只需定期执行 `git push` 即可。

### 方式二：物理快照备份 (`.tar.gz`)

这是一个完整的项目文件压缩包，包含了特定时间点的所有代码和资源文件（不含 `node_modules` 等临时文件）。

-   **优点**: 离线、完整、适合长期归档或迁移。
-   **我已为您生成的备份**: `yanbao_ai_source_v2.4.1.tar.gz` (357MB)
-   **下载链接**: [点击下载](https://files.manuscdn.com/user_upload_by_module/session_file/310519663083861133/bGRouLJchbnuSXRk.gz)

#### 如何创建新的物理备份

如果您想在未来某个时间点创建新的备份，可以执行以下命令：

```bash
# 在 yanbao-imaging-studio 的父目录下执行

# 格式: tar -czf [备份文件名.tar.gz] [要备份的目录]
tar -czf yanbao_ai_source_v2.5.0.tar.gz \
  --exclude='node_modules' \
  --exclude='.expo' \
  --exclude='.git' \
  yanbao-imaging-studio/
```

---

## 💡 最佳实践

-   **每日同步**: 每天结束工作时，执行一次 `git push`。
-   **版本发布备份**: 每当发布一个重要版本（如 v2.5.0）时，创建一个物理快照备份 (`.tar.gz`) 并打上 Git 标签 (`git tag`)。
-   **云盘同步**: 可以将物理快照备份文件同步到百度网盘、Google Drive 等云盘服务，增加一层保障。
