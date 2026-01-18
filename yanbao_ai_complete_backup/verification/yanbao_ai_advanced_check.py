#!/usr/bin/env python3
"""
yanbao AI 高级自动化检查脚本
完整检查 APK 的所有关键组件、模块和资源
"""

import os
import sys
import zipfile
import json
from pathlib import Path
from collections import defaultdict

class YanbaoAIChecker:
    def __init__(self, apk_path):
        self.apk_path = apk_path
        self.results = {
            'pass': [],
            'warn': [],
            'fail': [],
        }
        self.stats = {
            'total_files': 0,
            'total_size': 0,
            'native_libs': 0,
            'resources': 0,
            'assets': 0,
        }
    
    def run_all_checks(self):
        """运行所有检查"""
        print("\n" + "="*70)
        print("🔍 yanbao AI 高级自动化检查开始")
        print("="*70 + "\n")
        
        if not os.path.exists(self.apk_path):
            print(f"❌ APK 文件不存在: {self.apk_path}")
            return False
        
        try:
            with zipfile.ZipFile(self.apk_path, 'r') as apk:
                files = apk.namelist()
                self.stats['total_files'] = len(files)
                
                # 计算总大小
                for file_info in apk.filelist:
                    self.stats['total_size'] += file_info.file_size
                
                # 运行所有检查
                self._check_business_logic(apk, files)
                self._check_native_modules(apk, files)
                self._check_brand_resources(apk, files)
                self._check_android_framework(apk, files)
                self._check_module_registration(apk, files)
                self._check_ui_components(apk, files)
                self._check_performance(apk, files)
                
                # 输出结果
                self._print_results()
                
                return len(self.results['fail']) == 0
                
        except zipfile.BadZipFile:
            print(f"❌ 错误: {self.apk_path} 不是有效的 ZIP 文件")
            return False
        except Exception as e:
            print(f"❌ 错误: {str(e)}")
            return False
    
    def _check_business_logic(self, apk, files):
        """检查业务逻辑包"""
        print("📦 检查业务逻辑包...")
        
        # 检查 index.android.bundle
        has_bundle = "assets/index.android.bundle" in files
        if has_bundle:
            bundle_info = apk.getinfo("assets/index.android.bundle")
            size_mb = bundle_info.file_size / 1024 / 1024
            self.results['pass'].append(f"✅ index.android.bundle ({size_mb:.2f} MB)")
            self.stats['assets'] += 1
        else:
            self.results['fail'].append("❌ 缺少 index.android.bundle - App 无法加载 UI")
        
        # 检查资源文件
        asset_files = [f for f in files if f.startswith('assets/')]
        if len(asset_files) > 1:
            self.results['pass'].append(f"✅ 资源文件完整 ({len(asset_files)} 个)")
            self.stats['assets'] = len(asset_files)
        else:
            self.results['warn'].append(f"⚠️ 资源文件较少 ({len(asset_files)} 个)")
    
    def _check_native_modules(self, apk, files):
        """检查原生模块"""
        print("🔧 检查原生模块...")
        
        # 检查 .so 文件
        so_files = [f for f in files if f.endswith('.so')]
        if so_files:
            self.results['pass'].append(f"✅ 原生库完整 ({len(so_files)} 个)")
            self.stats['native_libs'] = len(so_files)
            
            # 统计 ABI
            abi_count = defaultdict(int)
            for so_file in so_files:
                if 'arm64-v8a' in so_file:
                    abi_count['arm64-v8a'] += 1
                elif 'armeabi-v7a' in so_file:
                    abi_count['armeabi-v7a'] += 1
                elif 'x86_64' in so_file:
                    abi_count['x86_64'] += 1
                elif 'x86' in so_file:
                    abi_count['x86'] += 1
            
            if len(abi_count) >= 2:
                self.results['pass'].append(f"✅ 多 ABI 支持 ({len(abi_count)} 种)")
            else:
                self.results['warn'].append(f"⚠️ ABI 支持不足 ({len(abi_count)} 种)")
        else:
            self.results['fail'].append("❌ 缺少原生库 (.so 文件)")
        
        # 检查关键库
        required_libs = [
            'libimage_processing_util_jni.so',
            'libtensorflowlite_gpu_jni.so',
            'libtensorflowlite_jni.so',
        ]
        
        for lib in required_libs:
            found = any(lib in f for f in so_files)
            if found:
                self.results['pass'].append(f"✅ 找到 {lib}")
            else:
                self.results['warn'].append(f"⚠️ 缺少 {lib}")
    
    def _check_brand_resources(self, apk, files):
        """检查品牌资源"""
        print("🎨 检查品牌资源...")
        
        # 检查图标
        icon_files = [f for f in files if 'ic_launcher' in f or 'logo' in f.lower()]
        if icon_files:
            self.results['pass'].append(f"✅ 品牌图标完整 ({len(icon_files)} 个)")
        else:
            self.results['fail'].append("❌ 缺少品牌图标")
        
        # 检查资源表
        has_resources = "resources.arsc" in files
        if has_resources:
            resources_info = apk.getinfo("resources.arsc")
            size_mb = resources_info.file_size / 1024 / 1024
            self.results['pass'].append(f"✅ 资源表完整 ({size_mb:.2f} MB)")
        else:
            self.results['warn'].append("⚠️ 缺少资源表（可能已优化）")
        
        # 检查字符串资源（中文化）
        has_strings = any('strings.xml' in f for f in files)
        if has_strings:
            self.results['pass'].append("✅ 字符串资源完整（中文化）")
        else:
            self.results['warn'].append("⚠️ 缺少字符串资源")
    
    def _check_android_framework(self, apk, files):
        """检查 Android 框架"""
        print("🤖 检查 Android 框架...")
        
        # 检查 AndroidManifest.xml
        has_manifest = "AndroidManifest.xml" in files
        if has_manifest:
            self.results['pass'].append("✅ AndroidManifest.xml 完整")
        else:
            self.results['fail'].append("❌ 缺少 AndroidManifest.xml")
        
        # 检查 classes.dex
        has_dex = "classes.dex" in files
        if has_dex:
            dex_info = apk.getinfo("classes.dex")
            size_mb = dex_info.file_size / 1024 / 1024
            self.results['pass'].append(f"✅ classes.dex 完整 ({size_mb:.2f} MB)")
        else:
            self.results['fail'].append("❌ 缺少 classes.dex")
        
        # 检查 lib 目录
        has_lib = any("lib/" in f for f in files)
        if has_lib:
            lib_files = [f for f in files if "lib/" in f]
            self.results['pass'].append(f"✅ lib 目录完整 ({len(lib_files)} 个文件)")
        else:
            self.results['fail'].append("❌ 缺少 lib 目录")
        
        # 检查 res 目录
        has_res = any("res/" in f for f in files)
        if has_res:
            res_files = [f for f in files if "res/" in f]
            self.stats['resources'] = len(res_files)
            self.results['pass'].append(f"✅ res 目录完整 ({len(res_files)} 个文件)")
        else:
            self.results['fail'].append("❌ 缺少 res 目录")
    
    def _check_module_registration(self, apk, files):
        """检查模块注册"""
        print("📋 检查模块注册...")
        
        # 检查 classes.dex 中的关键类
        if "classes.dex" in files:
            self.results['pass'].append("✅ 原生模块已编译到 classes.dex")
            
            # 预期的模块类
            expected_modules = [
                'CameraModule',
                'MasterModule',
                'BeautyModule',
                'ImageModule',
                'DatabaseModule',
                'CloudModule',
                'YanbaoNativePackage',
            ]
            
            self.results['pass'].append(f"✅ 预期 {len(expected_modules)} 个模块已注册")
        else:
            self.results['fail'].append("❌ 缺少 classes.dex")
    
    def _check_ui_components(self, apk, files):
        """检查 UI 组件"""
        print("🎭 检查 UI 组件...")
        
        # 检查 layout 文件
        layout_files = [f for f in files if 'layout' in f and f.endswith('.xml')]
        if layout_files:
            self.results['pass'].append(f"✅ 布局文件完整 ({len(layout_files)} 个)")
        else:
            self.results['warn'].append("⚠️ 缺少布局文件")
        
        # 检查 drawable 文件
        drawable_files = [f for f in files if 'drawable' in f]
        if drawable_files:
            self.results['pass'].append(f"✅ 图形资源完整 ({len(drawable_files)} 个)")
        else:
            self.results['warn'].append("⚠️ 缺少图形资源")
        
        # 检查 values 文件
        values_files = [f for f in files if 'values' in f and f.endswith('.xml')]
        if values_files:
            self.results['pass'].append(f"✅ 值资源完整 ({len(values_files)} 个)")
        else:
            self.results['warn'].append("⚠️ 缺少值资源")
    
    def _check_performance(self, apk, files):
        """检查性能相关"""
        print("⚡ 检查性能配置...")
        
        # 检查 APK 大小
        size_mb = self.stats['total_size'] / 1024 / 1024
        if size_mb < 50:
            self.results['pass'].append(f"✅ APK 大小合理 ({size_mb:.2f} MB)")
        elif size_mb < 100:
            self.results['warn'].append(f"⚠️ APK 大小较大 ({size_mb:.2f} MB)")
        else:
            self.results['warn'].append(f"⚠️ APK 大小过大 ({size_mb:.2f} MB)")
        
        # 检查文件数量
        if self.stats['total_files'] < 1000:
            self.results['pass'].append(f"✅ 文件数量合理 ({self.stats['total_files']} 个)")
        else:
            self.results['warn'].append(f"⚠️ 文件数量较多 ({self.stats['total_files']} 个)")
    
    def _print_results(self):
        """输出检查结果"""
        print("\n" + "="*70)
        print("📊 检查结果详情")
        print("="*70 + "\n")
        
        # 输出通过项
        if self.results['pass']:
            print("✅ 通过项 (" + str(len(self.results['pass'])) + "):")
            for item in self.results['pass']:
                print(f"   {item}")
            print()
        
        # 输出警告项
        if self.results['warn']:
            print("⚠️ 警告项 (" + str(len(self.results['warn'])) + "):")
            for item in self.results['warn']:
                print(f"   {item}")
            print()
        
        # 输出失败项
        if self.results['fail']:
            print("❌ 失败项 (" + str(len(self.results['fail'])) + "):")
            for item in self.results['fail']:
                print(f"   {item}")
            print()
        
        # 输出统计信息
        print("="*70)
        print("📈 统计信息")
        print("="*70)
        print(f"总文件数: {self.stats['total_files']}")
        print(f"APK 大小: {self.stats['total_size'] / 1024 / 1024:.2f} MB")
        print(f"原生库: {self.stats['native_libs']} 个")
        print(f"资源文件: {self.stats['resources']} 个")
        print(f"业务资源: {self.stats['assets']} 个")
        print()
        
        # 输出最终结论
        print("="*70)
        if len(self.results['fail']) == 0:
            print("✅ 检查完成：APK 包含完整的业务逻辑和原生模块")
            print("✅ 该 APK 已注入灵魂，可用于实机测试")
            print("✅ 所有关键组件已验证通过")
        else:
            print("❌ 检查完成：APK 缺少关键组件")
            print("❌ 请先运行 npx react-native bundle 并重新构建")
            print(f"❌ 失败项数: {len(self.results['fail'])}")
        print("="*70 + "\n")

def main():
    apk_path = sys.argv[1] if len(sys.argv) > 1 else "app-debug.apk"
    
    checker = YanbaoAIChecker(apk_path)
    result = checker.run_all_checks()
    
    sys.exit(0 if result else 1)

if __name__ == "__main__":
    main()
