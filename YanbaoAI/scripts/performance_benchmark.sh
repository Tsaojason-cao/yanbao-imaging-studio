#!/bin/bash
echo "========================================="
echo "yanbao AI 性能基准测试"
echo "========================================="

# 1. APK 包体积
echo "1. APK 包体积测试..."
APK_SIZE=$(ls -lh android/app/build/outputs/apk/release/app-release.apk 2>/dev/null | awk '{print $5}')
echo "   APK 大小: $APK_SIZE (目标: < 30 MB)"

# 2. 启动速度
echo "2. 启动速度测试..."
adb shell am force-stop com.yanbaoai
STARTUP_TIME=$(adb shell am start -W com.yanbaoai/.MainActivity | grep TotalTime | awk '{print $2}')
echo "   启动时间: ${STARTUP_TIME}ms (目标: < 1000ms)"

# 3. CPU 占用率（空闲）
echo "3. CPU 占用率测试（空闲）..."
sleep 3
CPU_IDLE=$(adb shell top -n 1 | grep com.yanbaoai | awk '{print $9}')
echo "   CPU 占用（空闲）: ${CPU_IDLE}% (目标: < 10%)"

# 4. 内存占用（空闲）
echo "4. 内存占用测试（空闲）..."
MEMORY_IDLE=$(adb shell dumpsys meminfo com.yanbaoai | grep "TOTAL PSS" | awk '{print $3}')
echo "   内存占用（空闲）: ${MEMORY_IDLE} KB (目标: < 100 MB)"

echo "========================================="
echo "性能基准测试完成"
echo "========================================="
