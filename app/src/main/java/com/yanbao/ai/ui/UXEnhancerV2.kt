package com.yanbao.ai.ui

import android.animation.ValueAnimator
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.view.animation.DecelerateInterpolator
import android.widget.SeekBar

/**
 * yanbao AI Pro - UXEnhancerV2 (品牌質感打磨)
 */
class UXEnhancerV2 {

    /**
     * 動態水印切換：根據大師預設自動變換風格
     */
    fun drawDynamicWatermark(canvas: Canvas, presetName: String, width: Int, height: Int) {
        val paint = Paint().apply {
            isAntiAlias = true
            textSize = 40f
        }

        when (presetName) {
            "Steve McCurry" -> {
                paint.color = Color.parseColor("#FFD700") // 金色
                paint.setShadowLayer(5f, 0f, 0f, Color.BLACK)
            }
            "Ansel Adams" -> {
                paint.color = Color.WHITE
                paint.letterSpacing = 0.2f
            }
            else -> {
                paint.color = Color.parseColor("#9370DB") // 庫洛米紫
            }
        }

        canvas.drawText("yanbao AI | $presetName", width - 400f, height - 100f, paint)
    }

    /**
     * 磁吸感滑塊：當接近推薦數值時自動吸附
     */
    fun applyMagneticSnap(seekBar: SeekBar, recommendedValue: Int) {
        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(sb: SeekBar?, progress: Int, fromUser: Boolean) {
                if (fromUser && Math.abs(progress - recommendedValue) < 5) {
                    // 觸發吸附動畫
                    val animator = ValueAnimator.ofInt(progress, recommendedValue)
                    animator.duration = 150
                    animator.interpolator = DecelerateInterpolator()
                    animator.addUpdateListener { 
                        seekBar.progress = it.animatedValue as Int 
                    }
                    animator.start()
                }
            }
            override fun onStartTrackingTouch(sb: SeekBar?) {}
            override fun onStopTrackingTouch(sb: SeekBar?) {}
        })
    }
}
