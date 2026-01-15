import os
from PIL import Image

def optimize_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                try:
                    with Image.open(file_path) as img:
                        # 保持原格式，进行优化保存
                        # 对于 PNG，使用 optimize=True
                        # 对于 JPEG，使用 quality=85, optimize=True
                        
                        file_size_before = os.path.getsize(file_path)
                        
                        if file.lower().endswith('.png'):
                            img.save(file_path, 'PNG', optimize=True)
                        elif file.lower().endswith(('.jpg', '.jpeg')):
                            img.save(file_path, 'JPEG', quality=85, optimize=True)
                            
                        file_size_after = os.path.getsize(file_path)
                        print(f"Optimized {file}: {file_size_before} -> {file_size_after} bytes")
                except Exception as e:
                    print(f"Error optimizing {file}: {e}")

if __name__ == "__main__":
    target_dir = "/home/ubuntu/yanbao-website/client/public/images"
    if os.path.exists(target_dir):
        print(f"Starting optimization for {target_dir}...")
        optimize_images(target_dir)
        print("Optimization complete.")
    else:
        print(f"Directory not found: {target_dir}")
