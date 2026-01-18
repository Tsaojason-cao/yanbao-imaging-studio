package com.yanbaoai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * yanbao AI - Compose Preview Activity
 * 用于展示 8 选项轮盘首页的 Compose Preview
 */
class ComposePreviewActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            YanbaoAIComposeTheme {
                YanbaoAIHomeScreen()
            }
        }
    }
}

/**
 * yanbao AI 首页 - 8 选项轮盘
 * 库洛米主题：粉色 (#FF1493) + 紫色 (#9D4EDD)
 */
@Composable
fun YanbaoAIHomeScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                color = Color(0xFFF8F0FF)  // 浅紫色背景
            ),
        contentAlignment = Alignment.Center
    ) {
        // 8 选项轮盘容器 (320×320dp)
        Box(
            modifier = Modifier
                .size(320.dp)
                .clip(CircleShape)
                .background(Color.White)
                .border(4.dp, Color(0xFFFF1493), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            // 中心库洛米头像 (80×80dp)
            KuromiAvatar(
                modifier = Modifier
                    .size(80.dp)
                    .align(Alignment.Center)
            )
            
            // 8 个功能按钮 - 圆形排列
            // 选项 1: 原生相机 (顶部)
            YanbaoWheelButton(
                label = "原生相机",
                color = Color(0xFFFFB6D9),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .offset(y = 12.dp)
            )
            
            // 选项 2: 大师脑 AI (右上 45°)
            YanbaoWheelButton(
                label = "大师脑 AI",
                color = Color(0xFFE0B0FF),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = (-30).dp, y = 30.dp)
            )
            
            // 选项 3: 参数调整 (右侧)
            YanbaoWheelButton(
                label = "参数调整",
                color = Color(0xFFC8B6FF),
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .offset(x = (-12).dp)
            )
            
            // 选项 4: 美颜模块 (右下 45°)
            YanbaoWheelButton(
                label = "美颜模块",
                color = Color(0xFFFFD1DC),
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .offset(x = (-30).dp, y = (-30).dp)
            )
            
            // 选项 5: 图像处理 (底部)
            YanbaoWheelButton(
                label = "图像处理",
                color = Color(0xFFFFE0B2),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .offset(y = (-12).dp)
            )
            
            // 选项 6: 雁宝记忆 (左下 45°)
            YanbaoWheelButton(
                label = "雁宝记忆",
                color = Color(0xFFB3E5FC),
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .offset(x = 30.dp, y = (-30).dp)
            )
            
            // 选项 7: 云端同步 (左侧)
            YanbaoWheelButton(
                label = "云端同步",
                color = Color(0xFFC8E6C9),
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .offset(x = 12.dp)
            )
            
            // 选项 8: 高级功能 (左上 45°)
            YanbaoWheelButton(
                label = "高级功能",
                color = Color(0xFFF0F4C3),
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .offset(x = 30.dp, y = 30.dp)
            )
        }
    }
}

/**
 * 库洛米头像 - Compose 实现
 * 粉色 (#FF1493) + 白色内圆
 */
@Composable
fun KuromiAvatar(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(Color(0xFFFF1493))  // 库洛米粉色
    ) {
        // 白色内圆
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(4.dp)
                .clip(CircleShape)
                .background(Color.White)
        )
        
        // 库洛米标识
        Text(
            text = "K",
            modifier = Modifier.align(Alignment.Center),
            color = Color(0xFFFF1493),
            fontSize = 36.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

/**
 * yanbao AI 轮盘按钮
 */
@Composable
fun YanbaoWheelButton(
    label: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(CircleShape)
                .background(color),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "◆",
                color = Color.White,
                fontSize = 24.sp
            )
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = label,
            fontSize = 9.sp,
            color = Color(0xFF333333),
            fontWeight = FontWeight.Medium
        )
    }
}

/**
 * 简单的主题包装
 */
@Composable
fun YanbaoAIComposeTheme(content: @Composable () -> Unit) {
    content()
}

/**
 * ========== COMPOSE PREVIEW 预览 ==========
 */

/**
 * Preview: 完整首页轮盘
 * 展示 8 选项轮盘首页
 * - 中心库洛米头像 (粉色 #FF1493)
 * - 8 个彩色圆形按钮（圆形排列）
 * - 库洛米主题色应用
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 823,
    name = "yanbao AI 首页轮盘"
)
@Composable
fun YanbaoAIHomeScreenPreview() {
    YanbaoAIComposeTheme {
        YanbaoAIHomeScreen()
    }
}

/**
 * Preview: 库洛米头像
 * 展示库洛米主题的粉色头像
 * - 外圆：粉色 (#FF1493)
 * - 内圆：白色 (#FFFFFF)
 */
@Preview(
    showBackground = true,
    widthDp = 100,
    heightDp = 100,
    name = "库洛米头像"
)
@Composable
fun KuromiAvatarPreview() {
    YanbaoAIComposeTheme {
        KuromiAvatar(modifier = Modifier.size(80.dp))
    }
}

/**
 * Preview: 单个轮盘按钮
 * 展示 8 个功能按钮中的一个
 * - 按钮颜色：浅粉 (#FFB6D9)
 * - 大小：60×60dp
 */
@Preview(
    showBackground = true,
    widthDp = 100,
    heightDp = 100,
    name = "轮盘按钮示例"
)
@Composable
fun YanbaoWheelButtonPreview() {
    YanbaoAIComposeTheme {
        YanbaoWheelButton(
            label = "原生相机",
            color = Color(0xFFFFB6D9)
        )
    }
}

/**
 * Preview: 所有 8 个按钮的颜色展示
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 200,
    name = "8个按钮颜色展示"
)
@Composable
fun AllButtonColorsPreview() {
    YanbaoAIComposeTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFFFB6D9))
                )
                Text("原生相机 #FFB6D9")
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFE0B0FF))
                )
                Text("大师脑 AI #E0B0FF")
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFC8B6FF))
                )
                Text("参数调整 #C8B6FF")
            }
        }
    }
}

// 扩展函数：添加 border 支持
@Composable
fun Modifier.border(
    width: Int,
    color: Color,
    shape: androidx.compose.foundation.shape.Shape
): Modifier {
    return this.then(
        androidx.compose.foundation.border(
            width = width.dp,
            color = color,
            shape = shape
        )
    )
}
