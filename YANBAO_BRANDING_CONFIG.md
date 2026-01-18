# YANBAO AI 品牌与包名硬锁定配置

## 包名硬锁定
- **包名**：`com.yanbaoai`
- **位置**：
  - `android/app/build.gradle` - `applicationId "com.yanbaoai"`
  - `android/app/src/main/AndroidManifest.xml` - `package="com.yanbaoai"`
  - 所有 Kotlin 源文件包声明：`package com.yanbaoai.*`

## App 名称硬锁定
- **显示名称**：`yanbao AI`（英文）
- **位置**：`android/app/src/main/res/values/strings.xml`
- **资源 ID**：`@string/app_name`

## 库洛米主题色硬锁定
- **主色**：粉色 `#FF1493`（库洛米标志色）
- **辅色**：紫色 `#9D4EDD`（库洛米主题紫）
- **位置**：`android/app/src/main/res/values/colors.xml`

## UI 资源结构
```
android/app/src/main/res/
├── layout/
│   ├── activity_main.xml              # 8选项轮盘首页
│   ├── activity_parameters.xml        # 7维参数滑块页面
│   └── item_parameter_slider.xml      # 单个滑块 item
├── drawable/
│   ├── gradient_background.xml        # 渐变背景
│   ├── wheel_background.xml           # 轮盘背景
│   ├── button_*.xml                   # 8个按钮背景
│   ├── ic_*.xml                       # 所有图标
│   ├── kuromi_avatar.xml              # 库洛米头像
│   ├── seekbar_*.xml                  # 滑块样式
│   └── card_background.xml            # 卡片背景
└── values/
    ├── strings.xml                    # 所有文本资源
    ├── colors.xml                     # 颜色定义
    └── preview.xml                    # Layout Editor 预览配置
```

## Shader 资源结构
```
android/app/src/main/assets/shaders/
├── default.vert                       # 通用顶点着色器
├── starlight_effect.frag              # 星光动效着色器
└── soft_focus_filter.frag             # 柔焦滤镜着色器
```

## Kotlin 源代码结构
```
android/app/src/main/java/com/yanbaoai/
├── model/
│   └── Parameter.kt                   # 参数数据模型
├── adapter/
│   └── ParameterSliderAdapter.kt      # RecyclerView Adapter（60fps优化）
└── graphics/
    ├── KuromiWatermarkRenderer.kt     # 库洛米水印 Canvas 渲染
    └── ShaderManager.kt               # OpenGL Shader 管理器
```

## 性能优化指标
- **RecyclerView 滑块**：60fps 丝滑滚动
- **Shader 渲染**：<16ms 帧延迟
- **启动时间**：<500ms
- **响应延迟**：<100ms

## Layout Editor 预览
- 支持 Android Studio Layout Editor 实时预览
- 所有布局文件均使用标准 Android XML 格式
- 预览尺寸：411dp × 823dp（标准 Pixel 3 尺寸）

## 验证清单
- [x] 包名：com.yanbaoai
- [x] App 名称：yanbao AI
- [x] 库洛米主题色应用
- [x] 8 选项轮盘首页 UI
- [x] 7 维参数滑块 UI
- [x] Shader 着色器文件
- [x] 库洛米水印 Canvas 渲染
- [x] RecyclerView 性能优化
- [x] Layout Editor 预览支持
