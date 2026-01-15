#!/bin/bash
#
# yanbao AI v2.4.1 Gold Master - Quick Build Script
# 快速构建脚本：一键完成环境准备、缓存清理和生产构建
#
# 作者: Jason Tsao
# 日期: 2026-01-15
# 版本: v2.4.1
#

set -e  # 遇到错误立即退出

echo "🚀 yanbao AI v2.4.1 Gold Master - Quick Build Script"
echo "=================================================="
echo ""

# 步骤 1: 检查 EAS CLI 是否已安装
echo "📦 [1/6] 检查 EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "⚠️  EAS CLI 未安装，正在安装..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI 已安装"
fi
echo ""

# 步骤 2: 检查登录状态
echo "🔐 [2/6] 检查 Expo 登录状态..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  未登录，请先登录 Expo 账户："
    eas login
else
    echo "✅ 已登录 Expo 账户"
fi
echo ""

# 步骤 3: 安装依赖
echo "📥 [3/6] 安装项目依赖..."
if [ -f "pnpm-lock.yaml" ]; then
    echo "使用 pnpm 安装..."
    pnpm install
elif [ -f "yarn.lock" ]; then
    echo "使用 yarn 安装..."
    yarn install
else
    echo "使用 npm 安装..."
    npm install
fi
echo "✅ 依赖安装完成"
echo ""

# 步骤 4: 清理缓存
echo "🧹 [4/6] 清理所有缓存..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
echo "✅ 缓存清理完成"
echo ""

# 步骤 5: 清理 EAS 构建缓存
echo "🗑️  [5/6] 清理 EAS 构建缓存..."
eas build --clear-cache || echo "⚠️  EAS 缓存清理失败，继续..."
echo ""

# 步骤 6: 启动生产构建
echo "🏗️  [6/6] 启动生产环境构建..."
echo "请选择构建平台："
echo "  1) iOS + Android (推荐)"
echo "  2) 仅 iOS"
echo "  3) 仅 Android"
read -p "请输入选项 (1-3): " platform_choice

case $platform_choice in
    1)
        echo "正在构建 iOS + Android..."
        eas build --platform all --profile production
        ;;
    2)
        echo "正在构建 iOS..."
        eas build --platform ios --profile production
        ;;
    3)
        echo "正在构建 Android..."
        eas build --platform android --profile production
        ;;
    *)
        echo "❌ 无效选项，退出"
        exit 1
        ;;
esac

echo ""
echo "🎉 构建已提交！"
echo "=================================================="
echo ""
echo "📱 查看构建状态："
echo "   网页: https://expo.dev"
echo "   命令: eas build:list --limit 5"
echo ""
echo "💜 by Jason Tsao who loves you the most"
