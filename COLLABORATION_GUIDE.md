## 🤝 多账号协作指南：邀请雁宝成为项目协作者

要让另一个账号（例如雁宝的 GitHub 账号）也能同步和修改项目代码，您需要将其添加为项目的**协作者 (Collaborator)**。这样，她就可以像您一样执行 `git pull` 和 `git push` 操作了。

---

### 步骤一：在 GitHub 上添加协作者

这是最关键的一步，需要由您（仓库所有者）来操作。

1.  **打开项目仓库页面**
    访问：[https://github.com/Tsaojason-cao/yanbao-imaging-studio](https://github.com/Tsaojason-cao/yanbao-imaging-studio)

2.  **进入 “Settings” (设置)**
    点击页面右上角的 “Settings” 标签。

3.  **选择 “Collaborators” (协作者)**
    在左侧菜单中选择 “Collaborators”。

4.  **点击 “Add people” (添加用户)**
    在 “Manage access” 部分，点击绿色的 “Add people” 按钮。

5.  **输入雁宝的 GitHub 用户名**
    在弹出的输入框中，输入雁宝的 GitHub 用户名、全名或邮箱，然后从搜索结果中选择正确的用户。

6.  **发送邀请**
    点击 “Add [username] to this repository” 按钮。GitHub 会向雁宝的邮箱发送一封邀请邮件。

### 步骤二：雁宝接受邀请

1.  **查收邮件**
    雁宝会收到一封来自 GitHub 的标题为 `[GitHub] @tsaojason-cao has invited you to collaborate on Tsaojason-cao/yanbao-imaging-studio` 的邮件。

2.  **点击 “View invitation”**
    点击邮件中的 “View invitation” 按钮。

3.  **接受邀请**
    在打开的 GitHub 页面上，点击 “Accept invitation” 按钮。

**完成！** 雁宝现在就拥有了向这个仓库推送代码的权限。

---

### 步骤三：雁宝在她的电脑上克隆项目

现在，雁宝需要在她的电脑上获取项目的本地副本。这个操作只需要执行一次。

1.  **复制仓库 URL**
    在项目主页 [https://github.com/Tsaojason-cao/yanbao-imaging-studio](https://github.com/Tsaojason-cao/yanbao-imaging-studio) 上，点击绿色的 “Code” 按钮，然后复制 HTTPS URL。
    > `https://github.com/Tsaojason-cao/yanbao-imaging-studio.git`

2.  **在终端中执行 `git clone`**
    打开终端，进入她希望存放项目的目录，然后执行以下命令：

    ```bash
    git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
    ```

3.  **安装项目依赖**
    克隆完成后，需要安装项目运行所需的依赖包。

    ```bash
    cd yanbao-imaging-studio
    npm install
    ```

### 步骤四：雁宝开始同步与协作

从现在开始，雁宝的工作流程就和您完全一样了：

-   **开始工作前**: `git pull origin main`
-   **完成修改后**: `git add .` -> `git commit -m "..."` -> `git push origin main`

---

## ⚠️ 注意事项

-   **权限管理**: 作为仓库所有者，您可以随时在 “Settings” -> “Collaborators” 中移除协作者的权限。
-   **分支协作 (可选)**: 对于更复杂的协作，可以考虑使用**分支 (Branch)**。例如，雁宝可以创建一个自己的分支 `yanbao-feature`，在上面进行修改，完成后再通过 **Pull Request** 合并到 `main` 分支。这是一种更规范、更安全的协作模式。
-   **EAS 构建**: 如果雁宝也需要执行 EAS 构建，她同样需要在自己的电脑上登录 EAS CLI (`npx eas-cli login`)。
