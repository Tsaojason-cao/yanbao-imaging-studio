#!/bin/bash
echo "=== 记忆功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 查看日志
adb logcat | grep MemoryModule &
LOGCAT_PID=$!
sleep 5
kill $LOGCAT_PID

echo "=== 测试完成 ==="
