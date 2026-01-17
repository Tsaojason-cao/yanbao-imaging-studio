#!/bin/bash
echo "=== 相机功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 等待应用启动
sleep 3

# 3. 监控性能
adb shell top -n 1 | grep com.yanbaoai

echo "=== 测试完成 ==="
