package com.yanbaoai

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.yanbaoai.constants.MasterParams
import com.yanbaoai.constants.ParamDefinition

/**
 * yanbao AI - 29 维参数调整页面
 * 展示所有大师参数的 Compose Preview
 */
@Composable
fun YanbaoParametersScreen() {
    val params = MasterParams.getAllParams()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8F0FF))
    ) {
        // 顶部标题栏
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(Color(0xFFFF1493)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "yanbao AI - 29 维大师参数",
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
        
        // 参数列表 (LazyColumn - 支持 60fps 丝滑滚动)
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(params) { param ->
                ParameterSliderItem(param = param)
            }
        }
        
        // 底部操作栏
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(Color(0xFFFFE8F5)),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "← 返回",
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(4.dp))
                        .padding(8.dp),
                    color = Color(0xFF333333),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "重置 ↻",
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(4.dp))
                        .padding(8.dp),
                    color = Color(0xFF333333),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "应用 ✓",
                    modifier = Modifier
                        .weight(1f)
                        .background(Color(0xFFFF1493), RoundedCornerShape(4.dp))
                        .padding(8.dp),
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

/**
 * 单个参数滑块 Item
 * 展示参数名称、当前值、SeekBar 和最小/最大值
 */
@Composable
fun ParameterSliderItem(param: ParamDefinition) {
    val currentValue = remember { mutableStateOf(param.defaultValue.toFloat()) }
    
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White, RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        // 参数名称和当前值
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = param.name,  // 中文参数名称
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF333333)
            )
            
            Text(
                text = currentValue.value.toInt().toString(),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFF1493)  // 粉色显示当前值
            )
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        // SeekBar 滑块
        Slider(
            value = currentValue.value,
            onValueChange = { currentValue.value = it },
            valueRange = param.minValue.toFloat()..param.maxValue.toFloat(),
            modifier = Modifier.fillMaxWidth(),
            colors = SliderDefaults.colors(
                thumbColor = Color(0xFFFF1493),        // 粉色滑块
                activeTrackColor = Color(0xFFFF1493),  // 粉色进度条
                inactiveTrackColor = Color(0xFFE8E8E8) // 灰色背景
            )
        )
        
        // 最小/最大值标签
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = param.minValue.toString(),
                fontSize = 10.sp,
                color = Color(0xFF999999)
            )
            
            Text(
                text = param.maxValue.toString(),
                fontSize = 10.sp,
                color = Color(0xFF999999)
            )
        }
    }
}

/**
 * ========== COMPOSE PREVIEW 预览 ==========
 */

/**
 * Preview: 完整参数调整页面
 * 展示 29 维参数的 RecyclerView/LazyColumn
 * - 参数名称：中文（奶油肌、通透感、感光度等）
 * - 滑块颜色：粉色 (#FF1493)
 * - 60fps 丝滑滚动
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 823,
    name = "29维参数调整页面"
)
@Composable
fun YanbaoParametersScreenPreview() {
    YanbaoAIComposeTheme {
        YanbaoParametersScreen()
    }
}

/**
 * Preview: 单个参数滑块
 * 展示"奶油肌"参数
 * - 参数名称：中文
 * - 当前值：粉色显示
 * - SeekBar：粉色进度条
 */
@Preview(
    showBackground = true,
    widthDp = 350,
    heightDp = 100,
    name = "单个参数滑块"
)
@Composable
fun ParameterSliderItemPreview() {
    YanbaoAIComposeTheme {
        ParameterSliderItem(
            param = ParamDefinition(
                id = "soft_skin",
                name = "奶油肌",
                minValue = -100,
                maxValue = 100,
                defaultValue = 0
            )
        )
    }
}

/**
 * Preview: 参数分类展示
 * 展示肤质参数分类
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 400,
    name = "肤质参数分类"
)
@Composable
fun SkinParamsPreview() {
    YanbaoAIComposeTheme {
        val skinParams = MasterParams.getParamsByCategory("skin")
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F0FF))
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "肤质参数 (5 维)",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFF1493),
                modifier = Modifier.padding(8.dp)
            )
            
            skinParams.forEach { param ->
                ParameterSliderItem(param = param)
            }
        }
    }
}

/**
 * Preview: 光影参数分类
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 600,
    name = "光影参数分类"
)
@Composable
fun LightParamsPreview() {
    YanbaoAIComposeTheme {
        val lightParams = MasterParams.getParamsByCategory("light")
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F0FF))
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "光影参数 (7 维)",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFF1493),
                modifier = Modifier.padding(8.dp)
            )
            
            lightParams.forEach { param ->
                ParameterSliderItem(param = param)
            }
        }
    }
}

/**
 * Preview: 色彩参数分类
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 700,
    name = "色彩参数分类"
)
@Composable
fun ColorParamsPreview() {
    YanbaoAIComposeTheme {
        val colorParams = MasterParams.getParamsByCategory("color")
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F0FF))
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "色彩参数 (8 维)",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFF1493),
                modifier = Modifier.padding(8.dp)
            )
            
            colorParams.forEach { param ->
                ParameterSliderItem(param = param)
            }
        }
    }
}

/**
 * Preview: 参数名称列表
 * 展示所有 29 个参数的中文名称
 */
@Preview(
    showBackground = true,
    widthDp = 411,
    heightDp = 823,
    name = "29维参数名称列表"
)
@Composable
fun AllParamsNamesPreview() {
    YanbaoAIComposeTheme {
        val allParams = MasterParams.getAllParams()
        
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F0FF))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            items(allParams) { param ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White, RoundedCornerShape(4.dp))
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = param.name,
                        fontSize = 12.sp,
                        color = Color(0xFF333333)
                    )
                    Text(
                        text = "${param.minValue} ~ ${param.maxValue}",
                        fontSize = 10.sp,
                        color = Color(0xFF999999)
                    )
                }
            }
        }
    }
}
