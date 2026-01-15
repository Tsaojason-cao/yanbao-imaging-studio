#!/bin/bash

# yanbao AI - 自动替换 Image 组件为 expo-image
# 将 React Native 的 Image 组件替换为性能更好的 expo-image
# 作者: Jason Tsao
# 日期: 2026-01-15

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  yanbao AI - Image 组件替换"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 查找所有需要替换的文件
FILES=$(grep -rl "from 'react-native'" app/ components/ 2>/dev/null | grep -E "\.(tsx|ts|jsx|js)$" | xargs grep -l "Image" | grep -v "ImageBackground")

if [ -z "$FILES" ]; then
    print_info "没有找到需要替换的文件"
    exit 0
fi

print_info "找到 $(echo "$FILES" | wc -l) 个文件需要处理"

for file in $FILES; do
    print_info "处理: $file"
    
    # 备份原文件
    cp "$file" "${file}.bak"
    
    # 替换导入语句
    # 从 react-native 的 Image 导入改为从 expo-image 导入
    sed -i "s/import { \(.*\)Image\(.*\) } from 'react-native'/import { \1\2 } from 'react-native'\nimport { Image } from 'expo-image'/g" "$file"
    
    # 清理可能的重复导入
    awk '!seen[$0]++' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    
    print_success "已处理: $file"
done

print_success "Image 组件替换完成！"
print_info "原文件备份为 .bak 文件"

echo ""
