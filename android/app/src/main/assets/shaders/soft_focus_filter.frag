#version 300 es
precision highp float;

uniform sampler2D u_Texture;
uniform float u_BlurRadius;
uniform float u_Intensity;

in vec2 v_TexCoord;
out vec4 FragColor;

void main() {
    vec4 color = texture(u_Texture, v_TexCoord);
    
    // 柔焦效果：高斯模糊采样
    vec4 blurred = vec4(0.0);
    float totalWeight = 0.0;
    
    for (int i = -3; i <= 3; i++) {
        for (int j = -3; j <= 3; j++) {
            vec2 offset = vec2(float(i), float(j)) * u_BlurRadius / 100.0;
            float distance = length(offset);
            float weight = exp(-distance * distance / (2.0 * u_Intensity * u_Intensity));
            
            blurred += texture(u_Texture, v_TexCoord + offset) * weight;
            totalWeight += weight;
        }
    }
    
    blurred /= totalWeight;
    
    // 混合原始颜色和模糊颜色
    vec4 result = mix(color, blurred, u_Intensity * 0.5);
    
    // 保留高光和边缘的锐度
    result = mix(result, color, 0.3);
    
    FragColor = result;
}
