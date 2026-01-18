#version 300 es
precision highp float;

uniform sampler2D u_Texture;
uniform float u_Time;
uniform float u_Intensity;

in vec2 v_TexCoord;
out vec4 FragColor;

void main() {
    vec4 texColor = texture(u_Texture, v_TexCoord);
    
    // 星光动效：基于时间的闪烁效果
    float flicker = 0.5 + 0.5 * sin(u_Time * 3.0);
    
    // 添加库洛米粉色星光
    vec3 starlight = vec3(1.0, 0.08, 0.58) * flicker * u_Intensity;
    
    // 混合原始颜色和星光效果
    vec3 result = texColor.rgb + starlight * 0.3;
    
    // 添加高光晕
    float glow = 0.2 * sin(u_Time * 2.0 + length(v_TexCoord - 0.5) * 10.0);
    result += vec3(1.0) * glow * u_Intensity;
    
    FragColor = vec4(result, texColor.a);
}
