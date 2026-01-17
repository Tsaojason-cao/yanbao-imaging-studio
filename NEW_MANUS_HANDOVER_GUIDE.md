# 新 Manus 账号任务交接指南

## 🎯 任务目标

将 yanbao AI 从"死功能"升级为"活智能"，实现：
1. **功能联动** - 通过记忆中心串联所有模块
2. **深度推理** - Chain of Thought 推理链
3. **情感记忆** - 理解用户情绪和偏好
4. **主动推荐** - 预测用户需求

---

## 🚀 立即开始（5分钟）

### 方法一：从 GitHub 克隆（最推荐）⭐⭐⭐

```bash
# 1. 克隆项目
gh repo clone Tsaojason-cao/yanbao-imaging-studio
cd yanbao-imaging-studio

# 2. 查看核心文档
ls -la *.md

# 3. 阅读加强版执行方案（必读）⭐⭐⭐
cat ENHANCED_EXECUTION_PLAN.md

# 4. 安装依赖
pnpm install
pip3 install openai pinecone-client redis flask

# 5. 启动开发
npx expo start

# 完成！
```

### 方法二：使用快速启动脚本

```bash
# 1. 上传并解压交接包
tar -xzf yanbao-ai-final-handover.tar.gz

# 2. 运行快速启动脚本
bash NEW_MANUS_QUICKSTART.sh
```

---

## 📚 必读文档（按优先级）

### 1. ENHANCED_EXECUTION_PLAN.md ⭐⭐⭐ 最重要
**加强版执行方案** - 包含 4 大关键加强：
- ✅ 双轨制接口（防呆机制）
- ✅ 情感记忆维度
- ✅ 大师反思机制
- ✅ 预测性交互 UI

**阅读时间**: 40分钟  
**包含内容**: 完整的实现代码（TypeScript + Python）

### 2. INTELLIGENCE_UPGRADE.md ⭐⭐⭐
**智能化升级方案** - 理解核心理念
- 从"死功能"到"活智能"
- 四大智能化升级详解

**阅读时间**: 20分钟

### 3. GIT_WORKFLOW.md ⭐⭐
**Git 同步和备份流程** - 每天都要用

**阅读时间**: 10分钟

### 4. ARCHITECTURE.md
**云端架构设计** - 理解系统架构

### 5. EXECUTION_PLAYBOOK.md
**详细执行手册** - Day 1-7 详细步骤

---

## 📅 7天执行计划

### Day 1: 架构校对与记忆接口重构

**核心任务**:
1. 部署双轨制接口
2. 实现降级保护
3. UI 规范检查（简体中文）

**验收标准**:
- [ ] 双轨制接口部署完成
- [ ] 降级保护测试通过（AI 超时能自动切换）
- [ ] 健康检查系统运行正常

**代码文件**:
- `src/services/DualModeService.ts` ✅ 已完成

**执行步骤**:
```bash
# 1. 查看双轨制接口代码
cat src/services/DualModeService.ts

# 2. 集成到现有组件
# 在 CameraScreen.tsx、EditorScreen.tsx 等组件中引入

# 3. 测试降级保护
# 模拟 AI 服务超时，验证能否自动切换到基础模式

# 4. 部署健康检查 API
cd backend
python api.py  # 启动后端服务
```

---

### Day 2: 大师脑与记忆系统实现

**核心任务**:
1. 实现大师反思机制
2. 部署向量数据库
3. 实现情感记忆系统

**验收标准**:
- [ ] 反思机制实现
- [ ] 自我校对功能测试通过
- [ ] 置信度低于 0.7 时能自动深度检索
- [ ] 情感标签系统部署
- [ ] 操作频率权重计算正确

**代码参考**:
- `ENHANCED_EXECUTION_PLAN.md` 中的:
  - `MasterWithReflection` 类（Python）
  - `EmotionalAnalyzer` 类（Python）
  - `EmotionalMemoryService` 类（Python）

**执行步骤**:
```bash
# 1. 创建后端文件
cd backend
touch master_with_reflection.py
touch emotional_analyzer.py
touch emotional_memory_service.py

# 2. 复制代码
# 从 ENHANCED_EXECUTION_PLAN.md 复制对应代码

# 3. 安装依赖
pip3 install openai pinecone-client

# 4. 配置环境变量
export OPENAI_API_KEY="your_key"
export PINECONE_API_KEY="your_key"

# 5. 测试
python master_with_reflection.py
python emotional_analyzer.py
```

---

### Day 3: 感知层数据打通

**核心任务**:
1. 语义修图（"昨天的感觉"）
2. 意图地图（主动推荐）
3. 动态避雷（过滤负面地点）

**验收标准**:
- [ ] 语义修图功能实现
- [ ] "昨天的感觉"能精准还原参数
- [ ] 配方记忆按权重排序
- [ ] 动态避雷功能实现
- [ ] 主动推荐命中率 > 60%

**执行步骤**:
```bash
# 1. 更新 EditorScreen.tsx
# 集成情感记忆检索

# 2. 更新 MapScreen.tsx
# 实现主动推荐和动态避雷

# 3. 测试
npx expo start
# 测试"昨天的感觉"功能
# 测试地图推荐功能
```

---

### Day 4-5: 媒体处理与地图推荐集成

**核心任务**:
1. 完善语义修图
2. 完善意图地图
3. 集成所有智能功能

**验收标准**:
- [ ] 所有功能集成完成
- [ ] 跨模块数据流通畅
- [ ] 记忆系统稳定运行

---

### Day 6: UI/UX 优化与智能交互

**核心任务**:
1. 部署预测性交互 UI
2. 实现前置触发功能
3. 简体中文规范审计

**验收标准**:
- [ ] 预测性交互 UI 部署
- [ ] 前置触发功能测试通过
- [ ] 简体中文规范审计通过（除 yanbao AI 外全部简体中文）

**代码参考**:
- `ENHANCED_EXECUTION_PLAN.md` 中的 `PredictiveUI` 组件

**执行步骤**:
```bash
# 1. 创建组件
touch src/components/PredictiveUI.tsx

# 2. 复制代码
# 从 ENHANCED_EXECUTION_PLAN.md 复制

# 3. 集成到 App.tsx
# 在主应用中引入 PredictiveUI

# 4. 测试
# 模拟不同场景，验证预测推荐
```

---

### Day 7: 性能优化与上线准备

**核心任务**:
1. 压力测试
2. 性能优化
3. 上线准备

**验收标准**:
- [ ] 压力测试通过（1000 并发）
- [ ] 记忆检索 + 推理延迟 < 200ms
- [ ] 系统可用性 > 99.9%

**执行步骤**:
```bash
# 1. 压力测试
cd backend
python stress_test.py

# 2. 性能分析
# 使用 React Native Performance Monitor

# 3. 构建 APK
cd android
./gradlew assembleRelease

# 4. 测试 APK
# 安装到真机测试
```

---

## 🔑 关键信息

### GitHub 仓库
```
https://github.com/Tsaojason-cao/yanbao-imaging-studio
```

### 最新提交
```
commit 45214ff
Author: Jason Tsao
Date: 2026-01-17

feat: add enhanced execution plan with dual-mode service
```

### 核心代码文件

**前端（TypeScript）**:
```
src/
├── services/
│   ├── DualModeService.ts      ✅ 双轨制接口
│   ├── MemoryService.ts         记忆服务
│   └── MasterService.ts         大师服务
├── components/
│   └── PredictiveUI.tsx         预测性交互 UI
├── App.tsx                      主应用
├── CameraScreen.tsx             相机
├── EditorScreen.tsx             编辑器
├── GalleryScreen.tsx            相册
└── MapScreen.tsx                地图
```

**后端（Python）**:
```
backend/
├── master_with_reflection.py    大师反思机制
├── emotional_analyzer.py        情感分析器
├── emotional_memory_service.py  情感记忆服务
├── api.py                       Flask API
└── stress_test.py               压力测试
```

---

## 🛠️ Git 同步流程

### 每天的工作流程

```bash
# 1. 早上：拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature/day-X-task-name

# 3. 工作中：定期提交
git add .
git commit -m "feat: implement XXX"

# 4. 晚上：推送到远程
git push origin feature/day-X-task-name

# 5. 创建 Pull Request
gh pr create --title "Day X: Task Name" --body "完成情况..."

# 6. 合并到主分支
gh pr merge
```

### 提交信息规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

---

## 💾 备份策略

### 每日备份

```bash
# 1. 创建备份
cd /home/ubuntu
tar -czf yanbao-backup-$(date +%Y%m%d).tar.gz yanbao-imaging-studio/

# 2. 上传到云端（可选）
# 使用 gh release 或其他云存储服务
```

### 重要节点备份

```bash
# 完成 Day 1-2-3-7 后创建备份
tar -czf yanbao-milestone-day-X.tar.gz yanbao-imaging-studio/
```

---

## ⚠️ 注意事项

### 环境配置

1. **OpenAI API Key**
   ```bash
   export OPENAI_API_KEY="your_key"
   ```

2. **Pinecone API Key**
   ```bash
   export PINECONE_API_KEY="your_key"
   ```

3. **Python 环境**
   ```bash
   python3 --version  # 需要 3.11+
   pip3 install openai pinecone-client redis flask
   ```

4. **Node.js 环境**
   ```bash
   node --version  # 需要 22+
   pnpm install
   ```

### 常见问题

**Q: 双轨制接口如何测试？**
```typescript
// 强制切换到降级模式
const dualMode = DualModeService.getInstance();
dualMode.forceFallbackMode();

// 验证功能是否正常
// 应该使用基础逻辑而不是 AI
```

**Q: 如何验证情感记忆？**
```python
# 运行测试脚本
python emotional_analyzer.py

# 查看输出的情感标签和权重
```

**Q: 预测性 UI 不显示？**
```typescript
// 检查置信度阈值
// 在 predictUserIntent 中降低阈值进行测试
if (intent && intent.confidence > 0.5) {  // 原来是 0.7
  // ...
}
```

---

## 🎯 成功标准

### 用户体验
- ✅ 用户感觉 AI "懂"自己
- ✅ 功能之间有联动感
- ✅ 推荐准确且有用
- ✅ 越用越顺手

### 技术指标
- ✅ 记忆检索延迟 < 100ms
- ✅ 推理链响应时间 < 3s
- ✅ 推荐准确率 > 70%
- ✅ 系统可用性 > 99.9%

### 智能化程度
- ✅ 主动推荐命中率 > 60%
- ✅ 用户接受率 > 50%
- ✅ 记忆召回准确率 > 80%
- ✅ 自进化改进幅度 > 5%/周

---

## 📞 获取帮助

### 项目相关
- **GitHub Repo**: https://github.com/Tsaojason-cao/yanbao-imaging-studio
- **GitHub Issues**: https://github.com/Tsaojason-cao/yanbao-imaging-studio/issues

### 技术社区
- **Expo Discord**: https://chat.expo.dev/
- **React Native**: https://reactnative.dev/community/overview
- **OpenAI Forum**: https://community.openai.com/

---

## 🎉 总结

### 这次交接的核心

**不是简单的代码交接，而是思维方式的升级：**

1. **从工具到伙伴** - AI 理解用户
2. **从被动到主动** - AI 主动推荐
3. **从遗忘到记忆** - 记住用户偏好
4. **从静态到进化** - 越用越聪明

### 执行路径

1. ✅ 克隆项目 (5分钟)
2. ✅ 阅读 ENHANCED_EXECUTION_PLAN.md (40分钟)
3. ✅ 理解四大加强 (1小时)
4. ✅ 按 7 天计划执行 (7天)
5. ✅ 验收智能化效果 (1天)

---

**所有准备工作已完成，包含完整的实现代码！**

**新的 Manus 账号可以立即开始智能化升级！**

**让 yanbao AI 真正"活"起来！** 🚀

---

**交接人**: Jason Tsao  
**交接时间**: 2026年1月17日  
**版本**: Final Enhanced 3.0
