#!/bin/bash

# yanbao AI - 自动化图片优化脚本
# 在构建前自动执行图片压缩和格式转换
# 作者: Jason Tsao
# 日期: 2026-01-15

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查必要工具
check_tools() {
    print_info "检查必要工具..."
    
    if ! command -v pngquant &> /dev/null; then
        print_warning "pngquant 未安装，正在安装..."
        sudo apt-get install -y pngquant > /dev/null 2>&1
    fi
    
    if ! command -v optipng &> /dev/null; then
        print_warning "optipng 未安装，正在安装..."
        sudo apt-get install -y optipng > /dev/null 2>&1
    fi
    
    if ! command -v cwebp &> /dev/null; then
        print_warning "webp 未安装，正在安装..."
        sudo apt-get install -y webp > /dev/null 2>&1
    fi
    
    print_success "所有工具已就绪"
}

# 优化 PNG 文件
optimize_png() {
    local assets_dir="$1"
    print_info "优化 PNG 文件..."
    
    local count=0
    find "$assets_dir" -name "*.png" -type f | while read file; do
        # 跳过已经是 _original 的文件
        if [[ "$file" == *"_original"* ]]; then
            continue
        fi
        
        # 使用 pngquant 压缩
        pngquant --quality=70-85 --ext .png --force "$file" 2>/dev/null || true
        
        # 使用 optipng 进一步优化
        optipng -o2 -quiet "$file" 2>/dev/null || true
        
        count=$((count + 1))
    done
    
    print_success "已优化 PNG 文件"
}

# 转换大文件为 WebP
convert_to_webp() {
    local assets_dir="$1"
    print_info "转换大尺寸文件为 WebP..."
    
    local count=0
    find "$assets_dir" -name "*.png" -type f -size +100k | while read file; do
        local basename="${file%.png}"
        local webp_file="${basename}.webp"
        
        # 如果 WebP 文件已存在且更新，跳过
        if [ -f "$webp_file" ] && [ "$webp_file" -nt "$file" ]; then
            continue
        fi
        
        # 转换为 WebP（保留透明度）
        cwebp -q 85 -alpha_q 100 "$file" -o "$webp_file" 2>/dev/null
        
        if [ -f "$webp_file" ]; then
            print_success "已转换: $(basename $file) -> $(basename $webp_file)"
            count=$((count + 1))
        fi
    done
    
    print_success "WebP 转换完成"
}

# 清理冗余文件
cleanup_redundant() {
    local assets_dir="$1"
    print_info "清理冗余文件..."
    
    # 删除 _original 文件
    find "$assets_dir" -name "*_original.*" -type f -delete 2>/dev/null || true
    
    print_success "冗余文件已清理"
}

# 生成优化报告
generate_report() {
    local assets_dir="$1"
    print_info "生成优化报告..."
    
    local total_size=$(du -sh "$assets_dir" | cut -f1)
    local png_count=$(find "$assets_dir" -name "*.png" -type f | wc -l)
    local webp_count=$(find "$assets_dir" -name "*.webp" -type f | wc -l)
    local jpg_count=$(find "$assets_dir" -name "*.jpg" -o -name "*.jpeg" -type f | wc -l)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  优化报告"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  总大小: $total_size"
    echo "  PNG 文件: $png_count"
    echo "  WebP 文件: $webp_count"
    echo "  JPG 文件: $jpg_count"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# 主函数
main() {
    local assets_dir="${1:-./assets/images}"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  yanbao AI - 图片资产自动优化"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if [ ! -d "$assets_dir" ]; then
        print_warning "资产目录不存在: $assets_dir"
        exit 1
    fi
    
    check_tools
    optimize_png "$assets_dir"
    convert_to_webp "$assets_dir"
    cleanup_redundant "$assets_dir"
    generate_report "$assets_dir"
    
    print_success "图片优化完成！"
}

# 执行主函数
main "$@"
