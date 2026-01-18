package com.yanbaoai.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.SeekBar
import androidx.recyclerview.widget.RecyclerView
import com.yanbaoai.databinding.ItemParameterSliderBinding
import com.yanbaoai.model.Parameter

class ParameterSliderAdapter(
    private val parameters: List<Parameter>,
    private val onParameterChanged: (Parameter) -> Unit
) : RecyclerView.Adapter<ParameterSliderAdapter.ParameterViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ParameterViewHolder {
        val binding = ItemParameterSliderBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ParameterViewHolder(binding, onParameterChanged)
    }

    override fun onBindViewHolder(holder: ParameterViewHolder, position: Int) {
        holder.bind(parameters[position])
    }

    override fun getItemCount() = parameters.size

    class ParameterViewHolder(
        private val binding: ItemParameterSliderBinding,
        private val onParameterChanged: (Parameter) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        private var isUserInteracting = false

        fun bind(parameter: Parameter) {
            binding.apply {
                // 设置参数名称
                parameterName.text = parameter.id.replaceFirstChar { it.uppercase() }

                // 设置初始值
                val progress = mapValueToProgress(parameter.currentValue, parameter.minValue, parameter.maxValue)
                parameterSlider.max = 100
                parameterSlider.progress = progress
                parameterValue.text = parameter.currentValue.toString()

                // 设置最小和最大值标签
                minValue.text = parameter.minValue.toString()
                maxValue.text = parameter.maxValue.toString()

                // 设置滑块监听器（优化性能）
                parameterSlider.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                    override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                        if (fromUser) {
                            isUserInteracting = true
                            val newValue = mapProgressToValue(progress, parameter.minValue, parameter.maxValue)
                            parameter.currentValue = newValue
                            parameterValue.text = newValue.toString()
                        }
                    }

                    override fun onStartTrackingTouch(seekBar: SeekBar?) {
                        isUserInteracting = true
                    }

                    override fun onStopTrackingTouch(seekBar: SeekBar?) {
                        isUserInteracting = false
                        onParameterChanged(parameter)
                    }
                })
            }
        }

        private fun mapValueToProgress(value: Int, min: Int, max: Int): Int {
            return ((value - min) * 100) / (max - min)
        }

        private fun mapProgressToValue(progress: Int, min: Int, max: Int): Int {
            return min + (progress * (max - min)) / 100
        }
    }
}
