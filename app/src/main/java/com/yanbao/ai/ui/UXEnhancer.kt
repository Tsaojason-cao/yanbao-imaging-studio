package com.yanbao.ai.ui

import android.view.HapticFeedbackConstants
import android.view.View
import android.view.animation.OvershootInterpolator
import android.widget.TextView

/**
 * yanbao AI Pro - UXEnhancer (極致細節打磨)
 */
class UXEnhancer {

    /**
     * 大師轉盤觸感：模擬物理轉盤感
     */
    fun applyDialHaptic(view: View) {
        view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)
    }

    /**
     * 高級面板彈出動畫：彈性動畫 (Overshoot Interpolator)
     */
    fun animatePanelSlideUp(panel: View) {
        panel.visibility = View.VISIBLE
        panel.translationY = 1000f
        panel.animate()
            .translationY(0f)
            .setDuration(500)
            .setInterpolator(OvershootInterpolator(1.2f))
            .start()
    }

    /**
     * 大師切換霓虹燈閃爍效果
     */
    fun playNeonFlickerEffect(view: View) {
        view.animate()
            .alpha(0.5f)
            .setDuration(50)
            .withEndAction {
                view.animate().alpha(1.0f).setDuration(50).start()
            }
            .start()
    }

    /**
     * 多語言修正：品牌名英文，功能文字簡體中文
     */
    fun applyLanguageRules(brandText: TextView, functionText: TextView, functionName: String) {
        brandText.text = "yanbao AI"
        functionText.text = functionName // 傳入簡體中文功能名
    }
}
