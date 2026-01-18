#version 300 es
precision highp float;

uniform sampler2D inputTexture;
uniform float philtrumDepth;
uniform float ambientLight; // 環境光感應變量 [0-1]，0 為極暗，1 為極亮
uniform vec2 resolution;

in vec2 vTexCoord;
out vec4 fragColor;

void main() {
    vec2 uv = vTexCoord;
    vec4 color = texture(inputTexture, uv);
    
    // 環境光自適應補償：暗光下自動補償 15% 對比度
    float contrastComp = 1.0;
    if (ambientLight < 0.3) {
        contrastComp = 1.15;
    }
    
    // 應用對比度補償
    vec3 adjustedColor = (color.rgb - 0.5) * contrastComp + 0.5;
    
    // 人中深度算法邏輯 (簡化版)
    float depthEffect = philtrumDepth / 100.0;
    // ... 複雜的 3D 光影計算 ...
    
    fragColor = vec4(adjustedColor, color.a);
}
