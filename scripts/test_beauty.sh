#!/bin/bash
echo "=== 美颜功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 监控 GPU 使用
adb shell dumpsys gfxinfo com.yanbaoai

# 3. 检查 NPU 可用性（查看日志）
adb logcat | grep NPU &
LOGCAT_PID=$!
sleep 5
kill $LOGCAT_PID

echo "=== 测试完成 ==="
