#!/bin/bash
echo "=== 大师功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 查看日志
adb logcat | grep MasterModule &
LOGCAT_PID=$!
sleep 5
kill $LOGCAT_PID

echo "=== 测试完成 ==="
