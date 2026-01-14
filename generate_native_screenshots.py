#!/usr/bin/env python3
"""
生成雁寶 v2.2.0 原生 UI 截圖
基於設計稿創建高保真模擬截圖
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 創建輸出目錄
output_dir = "/home/ubuntu/yanbao-v2.2.0/native_screenshots"
os.makedirs(output_dir, exist_ok=True)

# 設備尺寸 (iPhone 14 Pro)
WIDTH = 1179
HEIGHT = 2556
SAFE_TOP = 100
SAFE_BOTTOM = 100

# v2.2.0 庫洛米配色
COLORS = {
    'bg_deep_purple': '#1A0B2E',
    'surface_purple': '#2D1B4E',
    'primary_purple': '#6A0DAD',
    'accent_pink': '#E879F9',
    'text_white': '#FFFFFF',
    'text_muted': '#B8B8B8',
    'border_neon': 'rgba(232, 121, 249, 0.5)',
}

def hex_to_rgb(hex_color):
    """轉換 HEX 顏色為 RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_gradient_background(width, height):
    """創建深紫色漸變背景"""
    img = Image.new('RGB', (width, height), hex_to_rgb(COLORS['bg_deep_purple']))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 添加漸變效果
    for y in range(height):
        alpha = int(50 * (1 - y / height))
        color = hex_to_rgb(COLORS['surface_purple']) + (alpha,)
        draw.line([(0, y), (width, y)], fill=color, width=1)
    
    return img

def draw_rounded_rectangle(draw, xy, radius, fill, outline=None, width=1):
    """繪製圓角矩形"""
    x1, y1, x2, y2 = xy
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill, outline=outline, width=width)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill, outline=outline, width=width)
    draw.pieslice([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=fill, outline=outline)
    draw.pieslice([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=fill, outline=outline)
    draw.pieslice([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=fill, outline=outline)
    draw.pieslice([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=fill, outline=outline)

def generate_home_screen():
    """生成首頁截圖"""
    print("生成首頁截圖...")
    img = create_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 標題區域
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        signature_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        signature_font = ImageFont.load_default()
    
    # 標題
    draw.text((60, SAFE_TOP + 40), "YanBao AI", fill=hex_to_rgb(COLORS['text_white']), font=title_font)
    draw.text((60, SAFE_TOP + 140), "流体美学 · 私人影像工作室", fill=hex_to_rgb(COLORS['text_muted']), font=subtitle_font)
    draw.text((60, SAFE_TOP + 190), "by Jason Tsao who loves you the most ♥", fill=hex_to_rgb(COLORS['accent_pink']), font=signature_font)
    
    # 數據統計卡片
    card_y = HEIGHT // 2 - 300
    card_height = 500
    card_margin = 60
    
    # 繪製霓虹邊框卡片
    draw_rounded_rectangle(
        draw,
        [card_margin, card_y, WIDTH - card_margin, card_y + card_height],
        radius=48,
        fill=hex_to_rgb(COLORS['surface_purple']) + (200,),
        outline=hex_to_rgb(COLORS['accent_pink']) + (128,),
        width=3
    )
    
    # 卡片標題
    try:
        card_title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        stat_value_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        stat_label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        card_title_font = ImageFont.load_default()
        stat_value_font = ImageFont.load_default()
        stat_label_font = ImageFont.load_default()
    
    draw.text((card_margin + 60, card_y + 60), "数据统计", fill=hex_to_rgb(COLORS['text_white']), font=card_title_font)
    
    # 統計數據
    stats = [
        ("12", "已拍摄", 200),
        ("8", "已编辑", 500),
        ("3", "记忆预设", 800)
    ]
    
    for value, label, x_offset in stats:
        stat_x = card_margin + x_offset
        stat_y = card_y + 200
        
        # 圖標圓圈
        draw.ellipse(
            [stat_x - 60, stat_y - 60, stat_x + 60, stat_y + 60],
            fill=hex_to_rgb(COLORS['primary_purple']) + (100,),
            outline=hex_to_rgb(COLORS['accent_pink']) + (150,)
        )
        
        # 數值
        draw.text((stat_x - 40, stat_y + 100), value, fill=hex_to_rgb(COLORS['text_white']), font=stat_value_font)
        draw.text((stat_x - 60, stat_y + 200), label, fill=hex_to_rgb(COLORS['text_muted']), font=stat_label_font)
    
    # 庫洛米助手（右下角）
    kuromi_x = WIDTH - 150
    kuromi_y = HEIGHT - SAFE_BOTTOM - 250
    
    # 粉色光暈
    draw.ellipse(
        [kuromi_x - 80, kuromi_y - 80, kuromi_x + 80, kuromi_y + 80],
        fill=hex_to_rgb(COLORS['accent_pink']) + (50,)
    )
    
    # 白色臉部
    draw.ellipse(
        [kuromi_x - 60, kuromi_y - 60, kuromi_x + 60, kuromi_y + 60],
        fill=(255, 255, 255)
    )
    
    # 粉色蝴蝶結
    draw.ellipse([kuromi_x + 30, kuromi_y - 70, kuromi_x + 60, kuromi_y - 40], fill=(244, 114, 182))
    
    img.save(f"{output_dir}/01_Home_Native.png")
    print(f"✓ 首頁截圖已保存: {output_dir}/01_Home_Native.png")

def generate_camera_screen():
    """生成相機頁面截圖"""
    print("生成相機頁面截圖...")
    img = Image.new('RGB', (WIDTH, HEIGHT), (20, 20, 20))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 取景框區域
    viewfinder_y = SAFE_TOP + 100
    viewfinder_height = HEIGHT - SAFE_TOP - SAFE_BOTTOM - 300
    
    draw.rectangle(
        [50, viewfinder_y, WIDTH - 50, viewfinder_y + viewfinder_height],
        fill=(40, 40, 40),
        outline=hex_to_rgb(COLORS['accent_pink']) + (100,),
        width=2
    )
    
    # 紫色心形「雁寶記憶」按鈕（右側）
    memory_x = WIDTH - 150
    memory_y = viewfinder_y + 200
    
    # 按鈕背景
    draw_rounded_rectangle(
        draw,
        [memory_x - 60, memory_y - 60, memory_x + 60, memory_y + 60],
        radius=24,
        fill=hex_to_rgb(COLORS['accent_pink']) + (50,),
        outline=hex_to_rgb(COLORS['accent_pink']),
        width=3
    )
    
    # 心形圖標（簡化）
    try:
        heart_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    except:
        heart_font = ImageFont.load_default()
    draw.text((memory_x - 30, memory_y - 40), "♥", fill=hex_to_rgb(COLORS['accent_pink']), font=heart_font)
    
    try:
        label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
    except:
        label_font = ImageFont.load_default()
    
    draw.text((memory_x - 30, memory_y + 30), "记忆", fill=hex_to_rgb(COLORS['accent_pink']), font=label_font)
    
    # 快門按鈕（底部中央）
    shutter_x = WIDTH // 2
    shutter_y = HEIGHT - SAFE_BOTTOM - 150
    
    draw.ellipse(
        [shutter_x - 80, shutter_y - 80, shutter_x + 80, shutter_y + 80],
        fill=(255, 255, 255),
        outline=hex_to_rgb(COLORS['accent_pink']),
        width=6
    )
    
    img.save(f"{output_dir}/02_Camera_Native.png")
    print(f"✓ 相機頁面截圖已保存: {output_dir}/02_Camera_Native.png")

def generate_gallery_screen():
    """生成相冊頁面截圖"""
    print("生成相冊頁面截圖...")
    img = create_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 標題
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
    except:
        title_font = ImageFont.load_default()
    
    draw.text((60, SAFE_TOP + 40), "相册", fill=hex_to_rgb(COLORS['text_white']), font=title_font)
    
    # 2.5 列照片網格
    grid_start_y = SAFE_TOP + 150
    col_width = (WIDTH - 120) // 2.5
    gap = 20
    
    for row in range(4):
        for col in range(3):
            if col == 2:
                col_width_adjusted = col_width * 0.5
            else:
                col_width_adjusted = col_width
            
            x = 60 + col * (col_width + gap)
            y = grid_start_y + row * (col_width + gap)
            
            draw_rounded_rectangle(
                draw,
                [x, y, x + col_width_adjusted, y + col_width],
                radius=24,
                fill=hex_to_rgb(COLORS['surface_purple']) + (150,),
                outline=hex_to_rgb(COLORS['accent_pink']) + (100,),
                width=2
            )
    
    img.save(f"{output_dir}/03_Gallery_Native.png")
    print(f"✓ 相冊頁面截圖已保存: {output_dir}/03_Gallery_Native.png")

def generate_edit_screen():
    """生成編輯頁面截圖"""
    print("生成編輯頁面截圖...")
    img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(COLORS['bg_deep_purple']))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 圖片預覽區域
    preview_height = HEIGHT // 2
    draw.rectangle(
        [0, SAFE_TOP, WIDTH, SAFE_TOP + preview_height],
        fill=(60, 60, 60)
    )
    
    # 裁剪比例按鈕（9:16）
    ratio_y = SAFE_TOP + preview_height + 50
    
    try:
        button_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    except:
        button_font = ImageFont.load_default()
    
    ratios = ["1:1", "4:3", "9:16", "16:9"]
    button_width = 150
    start_x = (WIDTH - len(ratios) * button_width - (len(ratios) - 1) * 20) // 2
    
    for i, ratio in enumerate(ratios):
        x = start_x + i * (button_width + 20)
        
        is_active = (ratio == "9:16")
        fill_color = hex_to_rgb(COLORS['accent_pink']) + (200,) if is_active else hex_to_rgb(COLORS['surface_purple']) + (150,)
        
        draw_rounded_rectangle(
            draw,
            [x, ratio_y, x + button_width, ratio_y + 80],
            radius=20,
            fill=fill_color,
            outline=hex_to_rgb(COLORS['accent_pink']) if is_active else None,
            width=3 if is_active else 0
        )
        
        draw.text((x + 35, ratio_y + 20), ratio, fill=hex_to_rgb(COLORS['text_white']), font=button_font)
    
    # 旋轉水平撥盤
    dial_y = ratio_y + 150
    dial_width = WIDTH - 120
    
    draw.line(
        [(60, dial_y), (WIDTH - 60, dial_y)],
        fill=hex_to_rgb(COLORS['accent_pink']),
        width=4
    )
    
    # 撥盤指示器
    indicator_x = WIDTH // 2
    draw.ellipse(
        [indicator_x - 20, dial_y - 20, indicator_x + 20, dial_y + 20],
        fill=hex_to_rgb(COLORS['accent_pink'])
    )
    
    img.save(f"{output_dir}/04_Edit_Native.png")
    print(f"✓ 編輯頁面截圖已保存: {output_dir}/04_Edit_Native.png")

def generate_settings_screen():
    """生成設置頁面截圖"""
    print("生成設置頁面截圖...")
    img = create_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # 標題
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        item_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    except:
        title_font = ImageFont.load_default()
        item_font = ImageFont.load_default()
    
    draw.text((60, SAFE_TOP + 40), "设置", fill=hex_to_rgb(COLORS['text_white']), font=title_font)
    
    # 設置項目
    settings_items = [
        "自动保存",
        "高清模式",
        "位置服务",
        "通知提醒",
        "深色模式"
    ]
    
    item_start_y = SAFE_TOP + 180
    item_height = 100
    item_gap = 20
    
    for i, item in enumerate(settings_items):
        y = item_start_y + i * (item_height + item_gap)
        
        # 項目背景
        draw_rounded_rectangle(
            draw,
            [60, y, WIDTH - 60, y + item_height],
            radius=24,
            fill=hex_to_rgb(COLORS['surface_purple']) + (150,),
            outline=hex_to_rgb(COLORS['accent_pink']) + (80,),
            width=2
        )
        
        # 項目文字
        draw.text((100, y + 30), item, fill=hex_to_rgb(COLORS['text_white']), font=item_font)
        
        # 庫洛米紫色開關
        switch_x = WIDTH - 180
        switch_y = y + 50
        
        # 開關背景
        draw_rounded_rectangle(
            draw,
            [switch_x, switch_y - 20, switch_x + 100, switch_y + 20],
            radius=20,
            fill=hex_to_rgb(COLORS['accent_pink']) + (200,),
            outline=None
        )
        
        # 開關圓鈕
        draw.ellipse(
            [switch_x + 60, switch_y - 18, switch_x + 96, switch_y + 18],
            fill=(255, 255, 255)
        )
    
    img.save(f"{output_dir}/05_Settings_Native.png")
    print(f"✓ 設置頁面截圖已保存: {output_dir}/05_Settings_Native.png")

if __name__ == "__main__":
    print("=" * 60)
    print("雁寶 v2.2.0 原生 UI 截圖生成器")
    print("=" * 60)
    
    generate_home_screen()
    generate_camera_screen()
    generate_gallery_screen()
    generate_edit_screen()
    generate_settings_screen()
    
    print("=" * 60)
    print(f"✓ 所有截圖已生成完成！")
    print(f"✓ 輸出目錄: {output_dir}")
    print("=" * 60)
