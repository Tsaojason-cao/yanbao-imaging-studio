# yanbao AI 实机测试与性能验证框架

**版本**: 1.0.0  
**创建日期**: 2026年1月17日  
**状态**: 🧪 测试框架完成，待实机执行  
**适用对象**: 新 Manus 账号、测试团队

---

## 📋 测试概述

本文档提供 yanbao AI 原生安卓应用的完整测试和性能验证框架，包括：
1. 实机测试清单
2. 性能验证方法
3. Bug 报告模板
4. 测试自动化脚本
5. 性能基准测试
6. 测试结果记录

---

## 🧪 实机测试清单

### 1. 相机功能测试 (Day 4)

**测试项**:
- [ ] **打开相机**
  - 测试方法：点击"相机"标签页
  - 预期结果：相机成功打开，显示实时预览
  - 验收标准：< 1 秒

- [ ] **关闭相机**
  - 测试方法：切换到其他标签页
  - 预期结果：相机成功关闭，释放资源
  - 验收标准：无延迟

- [ ] **切换前后摄像头**
  - 测试方法：点击切换按钮
  - 预期结果：成功切换，预览流畅
  - 验收标准：< 1 秒

- [ ] **拍照**
  - 测试方法：点击拍照按钮
  - 预期结果：成功拍照，保存到相册
  - 验收标准：< 500ms

- [ ] **实时预览帧率**
  - 测试方法：使用 Android Profiler 监控
  - 预期结果：稳定 60 FPS
  - 验收标准：≥ 60 FPS

- [ ] **闪光灯控制**
  - 测试方法：点击闪光灯按钮
  - 预期结果：闪光灯状态切换正常
  - 验收标准：即时响应

**测试脚本**: `scripts/test_camera.sh`
```bash
#!/bin/bash
echo "=== 相机功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 等待应用启动
sleep 3

# 3. 点击相机标签（需要 UI Automator）
# adb shell input tap <x> <y>

# 4. 监控性能
adb shell top -n 1 | grep com.yanbaoai

echo "=== 测试完成 ==="
```

---

### 2. 美颜功能测试 (Day 5)

**测试项**:
- [ ] **实时美颜**
  - 测试方法：打开相机，启用美颜
  - 预期结果：实时美颜效果流畅
  - 验收标准：< 16ms 处理延迟

- [ ] **Leica 风格滤镜**
  - 测试方法：切换不同滤镜
  - 预期结果：滤镜切换流畅，效果正确
  - 验收标准：< 100ms 切换延迟

- [ ] **图片编辑**
  - 测试方法：调节亮度/对比度/饱和度
  - 预期结果：编辑效果实时预览
  - 验收标准：< 500ms 处理延迟

- [ ] **保存编辑后的照片**
  - 测试方法：编辑后保存
  - 预期结果：成功保存到相册
  - 验收标准：< 1 秒

- [ ] **NPU 加速检测**
  - 测试方法：查看日志
  - 预期结果：显示 NPU 可用性
  - 验收标准：正确检测

**测试脚本**: `scripts/test_beauty.sh`
```bash
#!/bin/bash
echo "=== 美颜功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 监控 GPU 使用
adb shell dumpsys gfxinfo com.yanbaoai

# 3. 检查 NPU 可用性（查看日志）
adb logcat | grep NPU

echo "=== 测试完成 ==="
```

---

### 3. 大师功能测试 (Day 2)

**测试项**:
- [ ] **获取大师建议（降级模式）**
  - 测试方法：点击"获取建议"按钮
  - 预期结果：返回建议文本
  - 验收标准：< 200ms

- [ ] **获取大师建议（智能模式）**
  - 测试方法：配置 API 后点击"获取建议"
  - 预期结果：返回智能建议
  - 验收标准：< 200ms（本地）或 < 2s（云端）

- [ ] **健康检查**
  - 测试方法：点击"健康检查"按钮
  - 预期结果：显示系统状态
  - 验收标准：< 1 秒

**测试脚本**: `scripts/test_master.sh`
```bash
#!/bin/bash
echo "=== 大师功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 查看日志
adb logcat | grep MasterModule

echo "=== 测试完成 ==="
```

---

### 4. 记忆功能测试 (Day 3)

**测试项**:
- [ ] **保存记忆**
  - 测试方法：点击"保存记忆"按钮
  - 预期结果：成功保存
  - 验收标准：< 50ms

- [ ] **文本检索**
  - 测试方法：输入关键词，点击"搜索"
  - 预期结果：返回相关记忆
  - 验收标准：< 200ms

- [ ] **情感检索**
  - 测试方法：点击情感按钮
  - 预期结果：返回相似情感的记忆
  - 验收标准：< 200ms

- [ ] **获取统计**
  - 测试方法：查看统计卡片
  - 预期结果：显示记忆统计
  - 验收标准：< 10ms

**测试脚本**: `scripts/test_memory.sh`
```bash
#!/bin/bash
echo "=== 记忆功能测试 ==="

# 1. 启动应用
adb shell am start -n com.yanbaoai/.MainActivity

# 2. 查看日志
adb logcat | grep MemoryModule

echo "=== 测试完成 ==="
```

---

### 5. UI 功能测试 (Day 6)

**测试项**:
- [ ] **不同屏幕尺寸适配**
  - 测试方法：在不同设备上测试
  - 预期结果：UI 正常显示
  - 验收标准：无布局错乱

- [ ] **深色/浅色模式切换**
  - 测试方法：切换系统主题
  - 预期结果：应用主题自动切换
  - 验收标准：即时响应

- [ ] **所有文本汉化**
  - 测试方法：检查所有页面
  - 预期结果：所有文本为中文
  - 验收标准：100% 汉化

- [ ] **页面切换动效**
  - 测试方法：切换标签页
  - 预期结果：动效流畅
  - 验收标准：无卡顿

---

## ⚡ 性能验证方法

### 1. APK 包体积测试

**测试方法**:
```bash
# 打包 release APK
cd android
./gradlew assembleRelease

# 查看 APK 大小
ls -lh app/build/outputs/apk/release/app-release.apk
```

**验收标准**: < 30 MB

---

### 2. 启动速度测试

**测试方法**:
```bash
# 冷启动测试
adb shell am force-stop com.yanbaoai
adb shell am start -W com.yanbaoai/.MainActivity

# 查看 TotalTime
```

**验收标准**: < 1 秒

---

### 3. CPU 占用率测试

**测试方法**:
```bash
# 空闲状态
adb shell top -n 1 | grep com.yanbaoai

# 使用状态（打开相机）
adb shell top -n 1 | grep com.yanbaoai
```

**验收标准**: 
- 空闲 < 10%
- 使用 < 30%

---

### 4. 内存占用测试

**测试方法**:
```bash
# 查看内存占用
adb shell dumpsys meminfo com.yanbaoai | grep TOTAL
```

**验收标准**:
- 空闲 < 100 MB
- 使用 < 200 MB

---

### 5. 电池消耗测试

**测试方法**:
```bash
# 重置电池统计
adb shell dumpsys batterystats --reset

# 使用应用 30 分钟

# 查看电池消耗
adb shell dumpsys batterystats com.yanbaoai
```

**验收标准**: 正常范围内

---

### 6. 帧率测试

**测试方法**:
```bash
# 使用 Android Profiler
# 或使用 dumpsys gfxinfo
adb shell dumpsys gfxinfo com.yanbaoai
```

**验收标准**: ≥ 60 FPS

---

## 🐛 Bug 报告模板

### Bug 报告格式

```markdown
# Bug 报告 #XXX

## Bug 描述
简要描述 Bug 现象

## 优先级
- [ ] P0 - 严重（应用崩溃、数据丢失）
- [ ] P1 - 高（核心功能不可用）
- [ ] P2 - 中（功能异常但有替代方案）
- [ ] P3 - 低（UI 问题、优化建议）

## 复现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 预期行为
描述预期的正确行为

## 实际行为
描述实际发生的错误行为

## 环境信息
- 设备型号：
- Android 版本：
- 应用版本：
- 测试日期：

## 日志
```
粘贴相关日志
```

## 截图/录屏
附加截图或录屏

## 修复建议
（可选）提供修复建议
```

---

## 🤖 测试自动化脚本

### 1. 完整测试脚本

**文件**: `scripts/run_all_tests.sh`
```bash
#!/bin/bash
# 完整测试脚本

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
```

---

### 2. 性能基准测试脚本

**文件**: `scripts/performance_benchmark.sh`
```bash
#!/bin/bash
# 性能基准测试脚本

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

# 5. 打开相机
echo "5. 打开相机..."
# adb shell input tap <x> <y>  # 需要实际坐标
sleep 2

# 6. CPU 占用率（使用）
echo "6. CPU 占用率测试（使用）..."
CPU_ACTIVE=$(adb shell top -n 1 | grep com.yanbaoai | awk '{print $9}')
echo "   CPU 占用（使用）: ${CPU_ACTIVE}% (目标: < 30%)"

# 7. 内存占用（使用）
echo "7. 内存占用测试（使用）..."
MEMORY_ACTIVE=$(adb shell dumpsys meminfo com.yanbaoai | grep "TOTAL PSS" | awk '{print $3}')
echo "   内存占用（使用）: ${MEMORY_ACTIVE} KB (目标: < 200 MB)"

# 8. 生成报告
echo "========================================="
echo "性能基准测试报告"
echo "========================================="
echo "APK 大小: $APK_SIZE"
echo "启动时间: ${STARTUP_TIME}ms"
echo "CPU 占用（空闲）: ${CPU_IDLE}%"
echo "CPU 占用（使用）: ${CPU_ACTIVE}%"
echo "内存占用（空闲）: ${MEMORY_IDLE} KB"
echo "内存占用（使用）: ${MEMORY_ACTIVE} KB"
echo "========================================="

# 9. 保存报告
REPORT_FILE="performance_report_$(date +%Y%m%d_%H%M%S).txt"
cat > $REPORT_FILE <<EOF
yanbao AI 性能基准测试报告
测试日期: $(date)

1. APK 大小: $APK_SIZE (目标: < 30 MB)
2. 启动时间: ${STARTUP_TIME}ms (目标: < 1000ms)
3. CPU 占用（空闲）: ${CPU_IDLE}% (目标: < 10%)
4. CPU 占用（使用）: ${CPU_ACTIVE}% (目标: < 30%)
5. 内存占用（空闲）: ${MEMORY_IDLE} KB (目标: < 100 MB)
6. 内存占用（使用）: ${MEMORY_ACTIVE} KB (目标: < 200 MB)
EOF

echo "报告已保存: $REPORT_FILE"
```

---

## 📊 测试结果记录

### 测试结果模板

**文件**: `TEST_RESULTS.md`
```markdown
# yanbao AI 测试结果记录

## 测试信息

- **测试日期**: YYYY-MM-DD
- **测试人员**: XXX
- **设备型号**: XXX
- **Android 版本**: XXX
- **应用版本**: 1.0.0

---

## 功能测试结果

### 相机功能

| 测试项 | 预期结果 | 实际结果 | 状态 | 备注 |
|--------|----------|----------|------|------|
| 打开相机 | < 1 秒 | XXX ms | ✅/❌ | |
| 关闭相机 | 无延迟 | XXX ms | ✅/❌ | |
| 切换摄像头 | < 1 秒 | XXX ms | ✅/❌ | |
| 拍照 | < 500ms | XXX ms | ✅/❌ | |
| 实时预览帧率 | ≥ 60 FPS | XXX FPS | ✅/❌ | |

### 美颜功能

| 测试项 | 预期结果 | 实际结果 | 状态 | 备注 |
|--------|----------|----------|------|------|
| 实时美颜 | < 16ms | XXX ms | ✅/❌ | |
| 滤镜切换 | < 100ms | XXX ms | ✅/❌ | |
| 图片编辑 | < 500ms | XXX ms | ✅/❌ | |
| 保存照片 | < 1 秒 | XXX ms | ✅/❌ | |

### 大师功能

| 测试项 | 预期结果 | 实际结果 | 状态 | 备注 |
|--------|----------|----------|------|------|
| 降级模式 | < 200ms | XXX ms | ✅/❌ | |
| 智能模式 | < 200ms | XXX ms | ✅/❌ | |
| 健康检查 | < 1 秒 | XXX ms | ✅/❌ | |

### 记忆功能

| 测试项 | 预期结果 | 实际结果 | 状态 | 备注 |
|--------|----------|----------|------|------|
| 保存记忆 | < 50ms | XXX ms | ✅/❌ | |
| 文本检索 | < 200ms | XXX ms | ✅/❌ | |
| 情感检索 | < 200ms | XXX ms | ✅/❌ | |
| 获取统计 | < 10ms | XXX ms | ✅/❌ | |

---

## 性能测试结果

| 指标 | 目标值 | 实际值 | 状态 | 备注 |
|------|--------|--------|------|------|
| APK 包体积 | < 30 MB | XXX MB | ✅/❌ | |
| 启动速度 | < 1 秒 | XXX ms | ✅/❌ | |
| CPU 占用（空闲） | < 10% | XXX% | ✅/❌ | |
| CPU 占用（使用） | < 30% | XXX% | ✅/❌ | |
| 内存占用（空闲） | < 100 MB | XXX MB | ✅/❌ | |
| 内存占用（使用） | < 200 MB | XXX MB | ✅/❌ | |
| 实时预览帧率 | ≥ 60 FPS | XXX FPS | ✅/❌ | |
| 美颜处理延迟 | < 16ms | XXX ms | ✅/❌ | |

---

## Bug 列表

| Bug ID | 描述 | 优先级 | 状态 | 修复人 | 修复日期 |
|--------|------|--------|------|--------|----------|
| #1 | XXX | P1 | 待修复 | | |
| #2 | XXX | P2 | 已修复 | XXX | YYYY-MM-DD |

---

## 总结

### 通过率

- 功能测试通过率: XX/XX (XX%)
- 性能测试通过率: XX/XX (XX%)

### 主要问题

1. XXX
2. XXX
3. XXX

### 建议

1. XXX
2. XXX
3. XXX
```

---

## 🎯 测试计划

### 短期测试 (1-2 周)

**Week 1**:
- [ ] Day 1-2: 相机功能测试
- [ ] Day 3-4: 美颜功能测试
- [ ] Day 5: 大师和记忆功能测试
- [ ] Day 6: UI 功能测试
- [ ] Day 7: 性能测试和报告

**Week 2**:
- [ ] Day 1-3: Bug 修复
- [ ] Day 4-5: 回归测试
- [ ] Day 6: 性能优化验证
- [ ] Day 7: 最终验收

---

### 中期测试 (1-2 个月)

**Month 1**:
- [ ] Week 1-2: 新功能测试（TFLite 模型、Room Database）
- [ ] Week 3: 性能优化验证
- [ ] Week 4: 回归测试和报告

**Month 2**:
- [ ] Week 1-2: 更多滤镜测试
- [ ] Week 3: 性能持续监控
- [ ] Week 4: 稳定性测试

---

## 🎉 总结

### ✅ 测试框架完成

1. ✅ 实机测试清单（5 大模块）
2. ✅ 性能验证方法（6 项指标）
3. ✅ Bug 报告模板
4. ✅ 测试自动化脚本
5. ✅ 性能基准测试
6. ✅ 测试结果记录模板
7. ✅ 测试计划

### 🚀 新 Manus 账号可以

- ✅ 按照测试清单执行实机测试
- ✅ 使用自动化脚本进行性能测试
- ✅ 使用模板记录测试结果
- ✅ 使用模板报告 Bug
- ✅ 按照测试计划推进

---

**实机测试与性能验证框架完成！** 🧪

---

Made with ❤️ by Jason Tsao for yanbao AI  
文档创建时间：2026年1月17日
