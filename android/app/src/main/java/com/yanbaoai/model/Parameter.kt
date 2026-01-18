package com.yanbaoai.model

data class Parameter(
    val id: String,
    val nameResId: Int,
    val minValue: Int = -100,
    val maxValue: Int = 100,
    val defaultValue: Int = 0,
    var currentValue: Int = 0
)

object ParameterDefaults {
    val PARAMETERS = listOf(
        Parameter(
            id = "exposure",
            nameResId = android.R.string.ok, // 占位符，实际使用 R.string.param_exposure
            minValue = -300,
            maxValue = 300,
            defaultValue = 0
        ),
        Parameter(
            id = "contrast",
            nameResId = android.R.string.ok,
            minValue = -100,
            maxValue = 100,
            defaultValue = 0
        ),
        Parameter(
            id = "highlights",
            nameResId = android.R.string.ok,
            minValue = -100,
            maxValue = 100,
            defaultValue = 0
        ),
        Parameter(
            id = "shadows",
            nameResId = android.R.string.ok,
            minValue = -100,
            maxValue = 100,
            defaultValue = 0
        ),
        Parameter(
            id = "saturation",
            nameResId = android.R.string.ok,
            minValue = -100,
            maxValue = 100,
            defaultValue = 0
        ),
        Parameter(
            id = "clarity",
            nameResId = android.R.string.ok,
            minValue = -100,
            maxValue = 100,
            defaultValue = 0
        ),
        Parameter(
            id = "temperature",
            nameResId = android.R.string.ok,
            minValue = -50,
            maxValue = 50,
            defaultValue = 0
        )
    )
}
