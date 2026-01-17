#!/bin/bash

# yanbao AI 原生 Android 应用快速启动脚本
# 适用于新的 Manus 账号接手项目
# 创建时间：2026年1月17日

set -e

echo "========================================="
echo "yanbao AI 原生 Android 应用快速启动"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 检查环境
echo -e "${BLUE}[1/6] 检查开发环境...${NC}"
echo ""

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
echo -e "${BLUE}[2/6] 获取项目代码...${NC}"
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
echo -e "${BLUE}[3/6] 项目信息${NC}"
echo ""
echo "项目名称: yanbao AI"
echo "项目类型: 原生 Android 应用"
echo "开发语言: Kotlin"
echo "UI 框架: Jetpack Compose"
echo "架构模式: MVVM + Clean Architecture"
echo ""

# 4. 列出关键文档
echo -e "${BLUE}[4/6] 关键文档清单${NC}"
echo ""
echo "优先级 1 ⭐⭐⭐（必读）:"
echo "  1. NATIVE_ANDROID_ARCHITECTURE.md - 完整的架构设计"
echo "  2. UI_AUDIT_REPORT.md - UI 审计结果"
echo "  3. NATIVE_ANDROID_SUMMARY.md - 项目概述和衔接方案"
echo ""
echo "优先级 2 ⭐⭐（推荐）:"
echo "  4. ENHANCED_EXECUTION_PLAN.md - 智能化升级方案"
echo "  5. INTELLIGENCE_UPGRADE.md - 从死功能到活智能"
echo "  6. GIT_WORKFLOW.md - Git 同步流程"
echo ""
echo "优先级 3 ⭐（参考）:"
echo "  7. ARCHITECTURE.md - 云端架构设计"
echo "  8. MASTER_AND_MEMORY.md - 大师功能和记忆系统"
echo "  9. 7_DAY_SPRINT.md - 7天开发计划"
echo ""

# 5. 检查文档是否存在
echo -e "${BLUE}[5/6] 验证文档完整性...${NC}"
echo ""

DOCS=(
    "NATIVE_ANDROID_ARCHITECTURE.md"
    "UI_AUDIT_REPORT.md"
    "NATIVE_ANDROID_SUMMARY.md"
    "ENHANCED_EXECUTION_PLAN.md"
    "INTELLIGENCE_UPGRADE.md"
    "GIT_WORKFLOW.md"
    "NEW_MANUS_HANDOVER_GUIDE.md"
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

# 6. 下一步指引
echo -e "${BLUE}[6/6] 下一步操作${NC}"
echo ""
echo "🎯 快速开始（3 步）:"
echo ""
echo "  1️⃣  阅读架构文档"
echo "     cat NATIVE_ANDROID_ARCHITECTURE.md"
echo ""
echo "  2️⃣  阅读 UI 审计报告"
echo "     cat UI_AUDIT_REPORT.md"
echo ""
echo "  3️⃣  阅读项目总结"
echo "     cat NATIVE_ANDROID_SUMMARY.md"
echo ""
echo "🚀 开始开发:"
echo ""
echo "  1. 打开 Android Studio"
echo "  2. File → New → New Project"
echo "  3. 选择 Empty Activity (Compose)"
echo "  4. 按照 NATIVE_ANDROID_ARCHITECTURE.md 配置项目"
echo "  5. 开始 Phase 1: 基础框架开发"
echo ""
echo "📚 完整文档:"
echo "  https://github.com/Tsaojason-cao/yanbao-imaging-studio"
echo ""
echo "🔄 Git 同步:"
echo "  git pull origin main  # 拉取最新代码"
echo "  git add ."
echo "  git commit -m \"Day X: 完成 XXX 功能\""
echo "  git push origin main  # 推送到远程"
echo ""
echo "========================================="
echo -e "${GREEN}✅ 项目准备完成！开始开发吧！${NC}"
echo "========================================="
echo ""
