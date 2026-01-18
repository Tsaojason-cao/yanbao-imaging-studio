package com.yanbaoai.graphics

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import kotlin.math.cos
import kotlin.math.sin

class KuromiWatermarkRenderer {

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val pathPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 2f
    }

    fun drawKuromiWatermark(canvas: Canvas, x: Float, y: Float, size: Float = 80f) {
        // 绘制库洛米头像圆形背景
        paint.color = Color.parseColor("#FF1493") // 库洛米粉色
        paint.style = Paint.Style.FILL
        canvas.drawCircle(x, y, size / 2, paint)

        // 绘制白色内圆
        paint.color = Color.WHITE
        canvas.drawCircle(x, y, size / 2 - 4, paint)

        // 绘制眼睛
        paint.color = Color.parseColor("#1A1A1A")
        val eyeRadius = size / 12
        canvas.drawCircle(x - size / 6, y - size / 8, eyeRadius, paint)
        canvas.drawCircle(x + size / 6, y - size / 8, eyeRadius, paint)

        // 绘制眼睛高光
        paint.color = Color.WHITE
        canvas.drawCircle(x - size / 6 + eyeRadius / 3, y - size / 8 - eyeRadius / 3, eyeRadius / 3, paint)
        canvas.drawCircle(x + size / 6 + eyeRadius / 3, y - size / 8 - eyeRadius / 3, eyeRadius / 3, paint)

        // 绘制嘴巴（弧形）
        paint.color = Color.parseColor("#1A1A1A")
        pathPaint.color = Color.parseColor("#1A1A1A")
        val mouthPath = Path()
        mouthPath.moveTo(x - size / 8, y + size / 6)
        mouthPath.quadTo(x, y + size / 4, x + size / 8, y + size / 6)
        canvas.drawPath(mouthPath, pathPaint)

        // 绘制库洛米标志性的角（小恶魔角）
        drawKuromiHorns(canvas, x, y, size)

        // 绘制星光装饰
        drawStarDecorations(canvas, x, y, size)
    }

    private fun drawKuromiHorns(canvas: Canvas, x: Float, y: Float, size: Float) {
        paint.color = Color.parseColor("#FF1493")
        paint.style = Paint.Style.FILL

        // 左角
        val leftHornPath = Path()
        leftHornPath.moveTo(x - size / 4, y - size / 2)
        leftHornPath.lineTo(x - size / 3, y - size / 1.5f)
        leftHornPath.lineTo(x - size / 5, y - size / 2.2f)
        leftHornPath.close()
        canvas.drawPath(leftHornPath, paint)

        // 右角
        val rightHornPath = Path()
        rightHornPath.moveTo(x + size / 4, y - size / 2)
        rightHornPath.lineTo(x + size / 3, y - size / 1.5f)
        rightHornPath.lineTo(x + size / 5, y - size / 2.2f)
        rightHornPath.close()
        canvas.drawPath(rightHornPath, paint)
    }

    private fun drawStarDecorations(canvas: Canvas, x: Float, y: Float, size: Float) {
        paint.color = Color.parseColor("#FFD700") // 金色星星
        paint.style = Paint.Style.FILL

        val starRadius = size / 20
        val distance = size / 1.5f

        // 绘制 4 个星星装饰
        for (i in 0 until 4) {
            val angle = (i * 90f + 45f) * Math.PI / 180.0
            val starX = x + (distance * cos(angle)).toFloat()
            val starY = y + (distance * sin(angle)).toFloat()
            drawStar(canvas, starX, starY, starRadius)
        }
    }

    private fun drawStar(canvas: Canvas, x: Float, y: Float, radius: Float) {
        val path = Path()
        val points = 5
        val outerRadius = radius
        val innerRadius = radius / 2.4f

        for (i in 0 until points * 2) {
            val angle = (i * 18f - 90f) * Math.PI / 180.0
            val r = if (i % 2 == 0) outerRadius else innerRadius
            val px = x + (r * cos(angle)).toFloat()
            val py = y + (r * sin(angle)).toFloat()

            if (i == 0) {
                path.moveTo(px, py)
            } else {
                path.lineTo(px, py)
            }
        }
        path.close()
        canvas.drawPath(path, paint)
    }

    fun drawAnimatedWatermark(canvas: Canvas, x: Float, y: Float, size: Float, time: Long) {
        // 基于时间的动画效果
        val pulse = 0.95f + 0.05f * sin((time % 1000) / 1000f * 2 * Math.PI).toFloat()
        drawKuromiWatermark(canvas, x, y, size * pulse)

        // 绘制旋转的光晕
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 2f
        paint.color = Color.parseColor("#FF1493")
        paint.alpha = (128 * (0.5f + 0.5f * cos((time % 2000) / 2000f * 2 * Math.PI))).toInt()

        val glowRadius = size / 1.8f
        canvas.drawCircle(x, y, glowRadius, paint)
    }
}
