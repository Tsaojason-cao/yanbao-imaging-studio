#!/bin/bash
echo "========================================="
echo "yanbao AI 完整测试套件"
echo "========================================="

# 1. 编译应用
echo "1. 编译应用..."
cd android
./gradlew assembleDebug
cd ..

# 2. 安装应用
echo "2. 安装应用..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 3. 启动应用
echo "3. 启动应用..."
adb shell am start -W com.yanbaoai/.MainActivity

# 4. 等待应用启动
sleep 5

# 5. 相机功能测试
echo "4. 相机功能测试..."
bash scripts/test_camera.sh

# 6. 美颜功能测试
echo "5. 美颜功能测试..."
bash scripts/test_beauty.sh

# 7. 大师功能测试
echo "6. 大师功能测试..."
bash scripts/test_master.sh

# 8. 记忆功能测试
echo "7. 记忆功能测试..."
bash scripts/test_memory.sh

# 9. 性能测试
echo "8. 性能测试..."
bash scripts/performance_test.sh

echo "========================================="
echo "测试完成！"
echo "========================================="
