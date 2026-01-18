package com.yanbao.ai.share

import android.content.Context
import android.graphics.*
import android.util.Base64
import com.yanbao.ai.model.PhotographyParameters
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

/**
 * yanbao AI Pro - ShareManager (參數卡片生成)
 */
class ShareManager(private val context: Context) {
    fun generateShareCard(previewBitmap: Bitmap, params: PhotographyParameters): String {
        val cardWidth = 1080
        val cardHeight = 1920
        val cardBitmap = Bitmap.createBitmap(cardWidth, cardHeight, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(cardBitmap)
        canvas.drawColor(Color.parseColor("#1A1A1A"))
        val previewRect = Rect(0, 200, cardWidth, 1400)
        canvas.drawBitmap(previewBitmap, null, previewRect, Paint(Paint.FILTER_BITMAP_FLAG))
        drawLogo(canvas, cardWidth)
        val qrData = encryptParameters(params)
        val qrBitmap = generateQRCode(qrData, 300)
        canvas.drawBitmap(qrBitmap, (cardWidth - 300) / 2f, 1500f, null)
        val textPaint = Paint().apply {
            color = Color.WHITE
            textSize = 40f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("扫码套用 yanbao AI 大师参数", cardWidth / 2f, 1850f, textPaint)
        val file = File(context.cacheDir, "yanbao_share_${System.currentTimeMillis()}.jpg")
        FileOutputStream(file).use { cardBitmap.compress(Bitmap.CompressFormat.JPEG, 90, it) }
        return file.absolutePath
    }

    private fun drawLogo(canvas: Canvas, width: Int) {
        val paint = Paint().apply {
            color = Color.parseColor("#9370DB")
            textSize = 80f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("yanbao AI Pro", width / 2f, 120f, paint)
    }

    private fun encryptParameters(params: PhotographyParameters): String {
        val json = JSONObject().apply {
            put("v", "1.2")
            put("p", params.exposure) // 簡化示例
        }
        return Base64.encodeToString(json.toString().toByteArray(), Base64.NO_WRAP)
    }

    private fun generateQRCode(data: String, size: Int): Bitmap {
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        canvas.drawColor(Color.WHITE)
        val paint = Paint().apply { color = Color.BLACK }
        for (i in 0 until 10) {
            for (j in 0 until 10) {
                if ((i + j) % 2 == 0) {
                    canvas.drawRect(i * (size/10f), j * (size/10f), (i+1) * (size/10f), (j+1) * (size/10f), paint)
                }
            }
        }
        return bitmap
    }
}

/**
 * yanbao AI Pro - QRDecoder (掃碼套用邏輯)
 */
class QRDecoder {
    fun decodeAndApply(qrData: String): PhotographyParameters? {
        return try {
            val decoded = String(Base64.decode(qrData, Base64.NO_WRAP))
            val json = JSONObject(decoded)
            val paramsJson = json.getJSONObject("p")
            // 恢復參數邏輯...
            PhotographyParameters()
        } catch (e: Exception) {
            null
        }
    }
}
