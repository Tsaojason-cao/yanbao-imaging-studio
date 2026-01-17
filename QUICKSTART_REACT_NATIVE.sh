#!/bin/bash

# yanbao AI - React Native 快速启动脚本
# 适用于新的 Manus 账号接手项目
# 创建时间：2026年1月17日

set -e

echo "========================================="
echo "yanbao AI - React Native 快速启动"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 检查环境
echo -e "${BLUE}[1/8] 检查开发环境...${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js 已安装: $(node --version)${NC}"
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm 已安装: $(npm --version)${NC}"
fi

# 检查 Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java 未安装${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Java 已安装: $(java -version 2>&1 | head -1)${NC}"
fi

# 检查 Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Git 已安装: $(git --version)${NC}"
fi

# 检查 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI 未安装，将使用 HTTPS 克隆${NC}"
    USE_GH=false
else
    echo -e "${GREEN}✅ GitHub CLI 已安装: $(gh --version | head -1)${NC}"
    USE_GH=true
fi

echo ""

# 2. 克隆或更新项目
echo -e "${BLUE}[2/8] 获取项目代码...${NC}"
echo ""

if [ -d "yanbao-imaging-studio" ]; then
    echo -e "${YELLOW}项目目录已存在，拉取最新代码...${NC}"
    cd yanbao-imaging-studio
    git pull origin main
    cd ..
else
    if [ "$USE_GH" = true ]; then
        echo "使用 GitHub CLI 克隆项目..."
        gh repo clone Tsaojason-cao/yanbao-imaging-studio
    else
        echo "使用 HTTPS 克隆项目..."
        git clone https://github.com/Tsaojason-cao/yanbao-imaging-studio.git
    fi
fi

cd yanbao-imaging-studio

echo -e "${GREEN}✅ 项目代码已准备就绪${NC}"
echo ""

# 3. 显示项目信息
echo -e "${BLUE}[3/8] 项目信息${NC}"
echo ""
echo "项目名称: yanbao AI"
echo "项目类型: React Native + 原生 Android 模块"
echo "开发语言: TypeScript + Kotlin"
echo "UI 框架: React Native"
echo "架构模式: 混合架构"
echo "当前进度: Day 1 完成 (14%)"
echo ""

# 4. 进入 React Native 项目
echo -e "${BLUE}[4/8] 进入 React Native 项目...${NC}"
echo ""

if [ ! -d "YanbaoAI" ]; then
    echo -e "${RED}❌ YanbaoAI 目录不存在${NC}"
    echo "请确保已完成 Day 1 开发"
    exit 1
fi

cd YanbaoAI
echo -e "${GREEN}✅ 已进入 YanbaoAI 目录${NC}"
echo ""

# 5. 安装依赖
echo -e "${BLUE}[5/8] 安装 npm 依赖...${NC}"
echo ""

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules 已存在，跳过安装${NC}"
else
    echo "正在安装依赖（可能需要几分钟）..."
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
fi

echo ""

# 6. 列出关键文档
echo -e "${BLUE}[6/8] 关键文档清单${NC}"
echo ""
echo "优先级 1 ⭐⭐⭐（必读）:"
echo "  1. REACT_NATIVE_HYBRID_ARCHITECTURE.md - 混合架构设计"
echo "  2. YanbaoAI/DAY1_COMPLETION_REPORT.md - Day 1 完成报告"
echo "  3. NEW_MANUS_HANDOVER_REACT_NATIVE.md - 交接指南"
echo ""
echo "优先级 2 ⭐⭐（推荐）:"
echo "  4. ENHANCED_EXECUTION_PLAN.md - 智能化升级方案"
echo "  5. INTELLIGENCE_UPGRADE.md - 从死功能到活智能"
echo "  6. UI_AUDIT_REPORT.md - UI 审计结果"
echo ""

# 7. 验证文档完整性
echo -e "${BLUE}[7/8] 验证文档完整性...${NC}"
echo ""

DOCS=(
    "../REACT_NATIVE_HYBRID_ARCHITECTURE.md"
    "DAY1_COMPLETION_REPORT.md"
    "../NEW_MANUS_HANDOVER_REACT_NATIVE.md"
)

ALL_DOCS_EXIST=true
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $doc${NC}"
    else
        echo -e "${RED}❌ $doc (缺失)${NC}"
        ALL_DOCS_EXIST=false
    fi
done

echo ""

if [ "$ALL_DOCS_EXIST" = false ]; then
    echo -e "${RED}⚠️  部分文档缺失，请检查 Git 同步状态${NC}"
    echo ""
fi

# 8. 下一步指引
echo -e "${BLUE}[8/8] 下一步操作${NC}"
echo ""
echo "🎯 快速开始（3 步）:"
echo ""
echo "  1️⃣  阅读架构文档"
echo "     cat ../REACT_NATIVE_HYBRID_ARCHITECTURE.md"
echo ""
echo "  2️⃣  阅读 Day 1 完成报告"
echo "     cat DAY1_COMPLETION_REPORT.md"
echo ""
echo "  3️⃣  阅读交接指南"
echo "     cat ../NEW_MANUS_HANDOVER_REACT_NATIVE.md"
echo ""
echo "🚀 运行应用:"
echo ""
echo "  npm run android  # 运行 Android 应用"
echo "  npm test         # 运行单元测试"
echo "  npm run lint     # 代码检查"
echo ""
echo "📚 开始 Day 2 开发:"
echo ""
echo "  1. 阅读 REACT_NATIVE_HYBRID_ARCHITECTURE.md 的 Day 2 部分"
echo "  2. 创建 MasterModule.kt 原生模块"
echo "  3. 实现 JNI 接口"
echo "  4. 集成 TensorFlow Lite"
echo "  5. 测试推理延迟 < 200ms"
echo ""
echo "🔄 Git 同步:"
echo "  git pull origin main  # 拉取最新代码"
echo "  git add ."
echo "  git commit -m \"Day X: 完成 XXX 功能\""
echo "  git push origin main  # 推送到远程"
echo ""
echo "📊 当前进度:"
echo "  Day 1: ✅ 完成 (100%)"
echo "  Day 2: ⏳ 待开始 (0%)"
echo "  Day 3: ⏳ 待开始 (0%)"
echo "  Day 4-5: ⏳ 待开始 (0%)"
echo "  Day 6: ⏳ 待开始 (0%)"
echo "  Day 7: ⏳ 待开始 (0%)"
echo ""
echo "========================================="
echo -e "${GREEN}✅ 项目准备完成！开始开发吧！${NC}"
echo "========================================="
echo ""
