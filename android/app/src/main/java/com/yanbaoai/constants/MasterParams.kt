package com.yanbaoai.constants

/**
 * yanbao AI - 29 维大师参数定义
 * 所有参数与 Shader Uniform 一一对应
 */
object MasterParams {
    
    // ========== 肤质参数 (5 维) ==========
    const val PARAM_SOFT_SKIN = "soft_skin"           // 奶油肌 (-100 ~ +100)
    const val PARAM_TRANSPARENCY = "transparency"     // 通透感 (-100 ~ +100)
    const val PARAM_GLOW = "glow"                     // 光泽度 (-100 ~ +100)
    const val PARAM_SMOOTHNESS = "smoothness"         // 平滑度 (-100 ~ +100)
    const val PARAM_PORE_REFINE = "pore_refine"       // 毛孔细致 (-100 ~ +100)
    
    // ========== 光影参数 (7 维) ==========
    const val PARAM_EXPOSURE = "exposure"             // 感光度 (-300 ~ +300)
    const val PARAM_CONTRAST = "contrast"             // 对比度 (-100 ~ +100)
    const val PARAM_HIGHLIGHTS = "highlights"         // 高光 (-100 ~ +100)
    const val PARAM_SHADOWS = "shadows"               // 阴影 (-100 ~ +100)
    const val PARAM_MIDTONES = "midtones"             // 中间调 (-100 ~ +100)
    const val PARAM_BLACKS = "blacks"                 // 黑点 (-100 ~ +100)
    const val PARAM_WHITES = "whites"                 // 白点 (-100 ~ +100)
    
    // ========== 色彩参数 (8 维) ==========
    const val PARAM_SATURATION = "saturation"         // 饱和度 (-100 ~ +100)
    const val PARAM_VIBRANCE = "vibrance"             // 鲜艳度 (-100 ~ +100)
    const val PARAM_HUE = "hue"                       // 色调 (-180 ~ +180)
    const val PARAM_TEMPERATURE = "temperature"       // 色温 (-50 ~ +50)
    const val PARAM_TINT = "tint"                     // 色彩偏移 (-50 ~ +50)
    const val PARAM_RED_CHANNEL = "red_channel"       // 红色通道 (-100 ~ +100)
    const val PARAM_GREEN_CHANNEL = "green_channel"   // 绿色通道 (-100 ~ +100)
    const val PARAM_BLUE_CHANNEL = "blue_channel"     // 蓝色通道 (-100 ~ +100)
    
    // ========== 清晰度参数 (6 维) ==========
    const val PARAM_CLARITY = "clarity"               // 清晰度 (-100 ~ +100)
    const val PARAM_SHARPNESS = "sharpness"           // 锐度 (-100 ~ +100)
    const val PARAM_TEXTURE = "texture"               // 纹理 (-100 ~ +100)
    const val PARAM_DETAIL = "detail"                 // 细节 (-100 ~ +100)
    const val PARAM_DEHAZE = "dehaze"                 // 去雾 (-100 ~ +100)
    const val PARAM_VIBRATION = "vibration"           // 振动感 (-100 ~ +100)
    
    // ========== 特效参数 (3 维) ==========
    const val PARAM_STARLIGHT_INTENSITY = "starlight_intensity"  // 星光强度 (0 ~ 100)
    const val PARAM_SOFT_FOCUS_RADIUS = "soft_focus_radius"      // 柔焦半径 (0 ~ 100)
    const val PARAM_BLOOM_STRENGTH = "bloom_strength"            // 光晕强度 (0 ~ 100)
    
    /**
     * 获取所有参数列表
     */
    fun getAllParams(): List<ParamDefinition> = listOf(
        // 肤质参数
        ParamDefinition(PARAM_SOFT_SKIN, "奶油肌", -100, 100, 0),
        ParamDefinition(PARAM_TRANSPARENCY, "通透感", -100, 100, 0),
        ParamDefinition(PARAM_GLOW, "光泽度", -100, 100, 0),
        ParamDefinition(PARAM_SMOOTHNESS, "平滑度", -100, 100, 0),
        ParamDefinition(PARAM_PORE_REFINE, "毛孔细致", -100, 100, 0),
        
        // 光影参数
        ParamDefinition(PARAM_EXPOSURE, "感光度", -300, 300, 0),
        ParamDefinition(PARAM_CONTRAST, "对比度", -100, 100, 0),
        ParamDefinition(PARAM_HIGHLIGHTS, "高光", -100, 100, 0),
        ParamDefinition(PARAM_SHADOWS, "阴影", -100, 100, 0),
        ParamDefinition(PARAM_MIDTONES, "中间调", -100, 100, 0),
        ParamDefinition(PARAM_BLACKS, "黑点", -100, 100, 0),
        ParamDefinition(PARAM_WHITES, "白点", -100, 100, 0),
        
        // 色彩参数
        ParamDefinition(PARAM_SATURATION, "饱和度", -100, 100, 0),
        ParamDefinition(PARAM_VIBRANCE, "鲜艳度", -100, 100, 0),
        ParamDefinition(PARAM_HUE, "色调", -180, 180, 0),
        ParamDefinition(PARAM_TEMPERATURE, "色温", -50, 50, 0),
        ParamDefinition(PARAM_TINT, "色彩偏移", -50, 50, 0),
        ParamDefinition(PARAM_RED_CHANNEL, "红色通道", -100, 100, 0),
        ParamDefinition(PARAM_GREEN_CHANNEL, "绿色通道", -100, 100, 0),
        ParamDefinition(PARAM_BLUE_CHANNEL, "蓝色通道", -100, 100, 0),
        
        // 清晰度参数
        ParamDefinition(PARAM_CLARITY, "清晰度", -100, 100, 0),
        ParamDefinition(PARAM_SHARPNESS, "锐度", -100, 100, 0),
        ParamDefinition(PARAM_TEXTURE, "纹理", -100, 100, 0),
        ParamDefinition(PARAM_DETAIL, "细节", -100, 100, 0),
        ParamDefinition(PARAM_DEHAZE, "去雾", -100, 100, 0),
        ParamDefinition(PARAM_VIBRATION, "振动感", -100, 100, 0),
        
        // 特效参数
        ParamDefinition(PARAM_STARLIGHT_INTENSITY, "星光强度", 0, 100, 50),
        ParamDefinition(PARAM_SOFT_FOCUS_RADIUS, "柔焦半径", 0, 100, 30),
        ParamDefinition(PARAM_BLOOM_STRENGTH, "光晕强度", 0, 100, 40)
    )
    
    /**
     * 获取参数分类
     */
    fun getParamsByCategory(category: String): List<ParamDefinition> {
        return when (category) {
            "skin" -> getAllParams().take(5)
            "light" -> getAllParams().drop(5).take(7)
            "color" -> getAllParams().drop(12).take(8)
            "clarity" -> getAllParams().drop(20).take(6)
            "effects" -> getAllParams().drop(26).take(3)
            else -> emptyList()
        }
    }
    
    /**
     * 获取 Shader Uniform 映射
     */
    fun getShaderUniformMapping(): Map<String, String> = mapOf(
        // 肤质参数 -> Shader Uniform
        PARAM_SOFT_SKIN to "u_SoftSkin",
        PARAM_TRANSPARENCY to "u_Transparency",
        PARAM_GLOW to "u_Glow",
        PARAM_SMOOTHNESS to "u_Smoothness",
        PARAM_PORE_REFINE to "u_PoreRefine",
        
        // 光影参数 -> Shader Uniform
        PARAM_EXPOSURE to "u_Exposure",
        PARAM_CONTRAST to "u_Contrast",
        PARAM_HIGHLIGHTS to "u_Highlights",
        PARAM_SHADOWS to "u_Shadows",
        PARAM_MIDTONES to "u_Midtones",
        PARAM_BLACKS to "u_Blacks",
        PARAM_WHITES to "u_Whites",
        
        // 色彩参数 -> Shader Uniform
        PARAM_SATURATION to "u_Saturation",
        PARAM_VIBRANCE to "u_Vibrance",
        PARAM_HUE to "u_Hue",
        PARAM_TEMPERATURE to "u_Temperature",
        PARAM_TINT to "u_Tint",
        PARAM_RED_CHANNEL to "u_RedChannel",
        PARAM_GREEN_CHANNEL to "u_GreenChannel",
        PARAM_BLUE_CHANNEL to "u_BlueChannel",
        
        // 清晰度参数 -> Shader Uniform
        PARAM_CLARITY to "u_Clarity",
        PARAM_SHARPNESS to "u_Sharpness",
        PARAM_TEXTURE to "u_Texture",
        PARAM_DETAIL to "u_Detail",
        PARAM_DEHAZE to "u_Dehaze",
        PARAM_VIBRATION to "u_Vibration",
        
        // 特效参数 -> Shader Uniform
        PARAM_STARLIGHT_INTENSITY to "u_StarlightIntensity",
        PARAM_SOFT_FOCUS_RADIUS to "u_SoftFocusRadius",
        PARAM_BLOOM_STRENGTH to "u_BloomStrength"
    )
}

/**
 * 参数定义数据类
 */
data class ParamDefinition(
    val id: String,              // 参数 ID（英文）
    val name: String,            // 参数名称（中文）
    val minValue: Int,           // 最小值
    val maxValue: Int,           // 最大值
    val defaultValue: Int        // 默认值
)
