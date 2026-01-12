#!/bin/bash

# 雁宝 AI - EAS Build 状态检查脚本
# 用于监控构建进度并获取下载链接

export EXPO_TOKEN="dtP4O0ZtgZuoSRhWVRKmahI4Upn4amot1Erf_PuH"
BUILD_ID="0fab346f-672d-417f-8c3e-0072c4a3ed48"

echo "========================================"
echo "雁宝 AI - 构建状态检查"
echo "========================================"
echo ""
echo "构建 ID: $BUILD_ID"
echo "构建链接: https://expo.dev/accounts/tsaojason/projects/yanbao-eas-build/builds/$BUILD_ID"
echo ""

# 获取构建状态
echo "正在查询构建状态..."
npx eas-cli build:list --platform android --limit 1 --non-interactive --json > build-status.json 2>&1

# 解析 JSON 结果
STATUS=$(cat build-status.json | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
ARTIFACTS=$(cat build-status.json | grep -o '"buildUrl":"[^"]*"' | head -1 | cut -d'"' -f4)

echo ""
echo "构建状态: $STATUS"
echo ""

if [ "$STATUS" = "FINISHED" ]; then
    echo "✅ 构建已完成！"
    echo ""
    echo "APK 下载链接:"
    echo "$ARTIFACTS"
    echo ""
    echo "请将此链接更新到官网的下载按钮中。"
elif [ "$STATUS" = "IN_PROGRESS" ]; then
    echo "🔄 构建进行中..."
    echo "请稍后再次运行此脚本检查状态。"
elif [ "$STATUS" = "IN_QUEUE" ]; then
    QUEUE_POS=$(cat build-status.json | grep -o '"queuePosition":[0-9]*' | head -1 | cut -d':' -f2)
    WAIT_TIME=$(cat build-status.json | grep -o '"estimatedWaitTimeLeftSeconds":[0-9]*' | head -1 | cut -d':' -f2)
    WAIT_MIN=$((WAIT_TIME / 60))
    echo "⏳ 构建在队列中等待..."
    echo "队列位置: $QUEUE_POS"
    echo "预计等待时间: $WAIT_MIN 分钟"
    echo ""
    echo "请稍后再次运行此脚本检查状态。"
elif [ "$STATUS" = "ERRORED" ]; then
    echo "❌ 构建失败！"
    echo "请查看构建日志了解详情。"
else
    echo "⚠️ 未知状态: $STATUS"
fi

echo ""
echo "========================================"
