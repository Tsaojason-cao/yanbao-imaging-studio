#!/bin/bash

# yanbao AI v2.4.1 Gold Master - 一键构建脚本
# 自动化执行完整的 APK 构建流程
# 作者: Jason Tsao
# 日期: 2026-01-15

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 主函数
main() {
    print_header "yanbao AI v2.4.1 Gold Master - 一键构建脚本"
    echo ""
    
    # Phase 1: 环境检查
    print_header "Phase 1: 环境检查"
    
    print_info "检查 Node.js..."
    if command_exists node; then
        NODE_VERSION=$(node -v)
        print_success "Node.js 已安装: $NODE_VERSION"
    else
        print_error "Node.js 未安装！请先安装 Node.js 22.x"
        exit 1
    fi
    
    print_info "检查 pnpm..."
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm -v)
        print_success "pnpm 已安装: $PNPM_VERSION"
    else
        print_error "pnpm 未安装！正在安装..."
        npm install -g pnpm
    fi
    
    print_info "检查 EAS CLI..."
    if command_exists eas; then
        EAS_VERSION=$(eas --version)
        print_success "EAS CLI 已安装: $EAS_VERSION"
    else
        print_warning "EAS CLI 未安装！正在安装..."
        npm install -g eas-cli
    fi
    
    echo ""
    
    # Phase 2: 代码同步
    print_header "Phase 2: 代码同步"
    
    print_info "拉取最新代码..."
    git pull origin main
    print_success "代码已更新到最新版本"
    
    echo ""
    
    # Phase 3: 依赖安装
    print_header "Phase 3: 依赖安装"
    
    print_info "安装项目依赖..."
    pnpm install
    print_success "依赖安装完成"
    
    echo ""
    
    # Phase 4: EAS 登录检查
    print_header "Phase 4: EAS 登录检查"
    
    print_info "检查 Expo 登录状态..."
    if eas whoami >/dev/null 2>&1; then
        EXPO_USER=$(eas whoami)
        print_success "已登录 Expo 账号: $EXPO_USER"
    else
        print_warning "未登录 Expo 账号，请登录..."
        eas login
    fi
    
    echo ""
    
    # Phase 5: 构建配置确认
    print_header "Phase 5: 构建配置确认"
    
    print_info "当前构建配置:"
    echo "  - 版本: v2.4.1"
    echo "  - 平台: Android"
    echo "  - 配置: Production"
    echo "  - 输出: APK"
    echo "  - JS 引擎: Hermes"
    echo "  - 资产大小: ~21 MB"
    echo "  - 预估 APK: ~29 MB"
    echo ""
    
    read -p "是否继续构建？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "构建已取消"
        exit 0
    fi
    
    echo ""
    
    # Phase 6: 启动构建
    print_header "Phase 6: 启动 EAS Build"
    
    print_info "开始构建 APK..."
    print_warning "预计耗时: 18-20 分钟"
    echo ""
    
    eas build --platform android --profile production
    
    echo ""
    print_success "构建完成！"
    print_info "请在 Expo 控制台查看构建详情和下载链接"
    print_info "控制台地址: https://expo.dev"
    
    echo ""
    print_header "构建流程完成"
}

# 错误处理
trap 'print_error "构建过程中发生错误！请查看上方日志。"; exit 1' ERR

# 执行主函数
main
