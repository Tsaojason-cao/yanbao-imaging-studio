// GPU 加速美颜 Shader（GLSL ES）
// 实现 7 维美颜参数的实时渲染

export const vertexShader = `
  attribute vec2 position;
  varying vec2 uv;
  
  void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;
  
  varying vec2 uv;
  uniform sampler2D texture;
  
  // 美颜参数 (0.0 - 1.0)
  uniform float smoothing;    // 磨皮
  uniform float whitening;    // 美白
  uniform float faceSlim;     // 瘦脸
  uniform float eyeEnlarge;   // 大眼
  uniform float brightness;   // 亮度
  uniform float contrast;     // 对比度
  uniform float saturation;   // 饱和度
  
  // 高斯模糊（用于磨皮）
  vec4 gaussianBlur(sampler2D tex, vec2 uv, float radius) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    
    for (float x = -4.0; x <= 4.0; x++) {
      for (float y = -4.0; y <= 4.0; y++) {
        vec2 offset = vec2(x, y) * radius;
        float weight = exp(-(x*x + y*y) / 8.0);
        color += texture2D(tex, uv + offset) * weight;
        total += weight;
      }
    }
    
    return color / total;
  }
  
  // RGB 转 HSL
  vec3 rgb2hsl(vec3 color) {
    float maxVal = max(max(color.r, color.g), color.b);
    float minVal = min(min(color.r, color.g), color.b);
    float delta = maxVal - minVal;
    
    float h = 0.0;
    float s = 0.0;
    float l = (maxVal + minVal) / 2.0;
    
    if (delta > 0.0) {
      s = l < 0.5 ? delta / (maxVal + minVal) : delta / (2.0 - maxVal - minVal);
      
      if (maxVal == color.r) {
        h = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);
      } else if (maxVal == color.g) {
        h = (color.b - color.r) / delta + 2.0;
      } else {
        h = (color.r - color.g) / delta + 4.0;
      }
      h /= 6.0;
    }
    
    return vec3(h, s, l);
  }
  
  // HSL 转 RGB
  vec3 hsl2rgb(vec3 hsl) {
    float h = hsl.x;
    float s = hsl.y;
    float l = hsl.z;
    
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c / 2.0;
    
    vec3 rgb;
    if (h < 1.0/6.0) {
      rgb = vec3(c, x, 0.0);
    } else if (h < 2.0/6.0) {
      rgb = vec3(x, c, 0.0);
    } else if (h < 3.0/6.0) {
      rgb = vec3(0.0, c, x);
    } else if (h < 4.0/6.0) {
      rgb = vec3(0.0, x, c);
    } else if (h < 5.0/6.0) {
      rgb = vec3(x, 0.0, c);
    } else {
      rgb = vec3(c, 0.0, x);
    }
    
    return rgb + m;
  }
  
  void main() {
    // 原始颜色
    vec4 originalColor = texture2D(texture, uv);
    vec4 color = originalColor;
    
    // 1. 磨皮（高斯模糊 + 高通滤波）
    if (smoothing > 0.0) {
      vec4 blurred = gaussianBlur(texture, uv, 0.002 * smoothing);
      color = mix(color, blurred, smoothing * 0.6);
    }
    
    // 2. 美白
    if (whitening > 0.0) {
      color.rgb += vec3(whitening * 0.15);
    }
    
    // 3. 亮度调节
    float brightnessFactor = (brightness - 0.5) * 0.5;
    color.rgb += vec3(brightnessFactor);
    
    // 4. 对比度调节
    float contrastFactor = contrast * 2.0;
    color.rgb = (color.rgb - 0.5) * contrastFactor + 0.5;
    
    // 5. 饱和度调节
    vec3 hsl = rgb2hsl(color.rgb);
    hsl.y *= saturation * 2.0;
    color.rgb = hsl2rgb(hsl);
    
    // 瘦脸和大眼需要人脸检测，暂时跳过（需要额外的 landmark 数据）
    // TODO: 集成 MediaPipe Face Mesh 或 TensorFlow.js Face Landmarks
    
    // 输出最终颜色
    gl_FragColor = vec4(color.rgb, originalColor.a);
  }
`;

// Shader 程序配置
export interface ShaderUniforms {
  texture: WebGLTexture;
  smoothing: number;
  whitening: number;
  faceSlim: number;
  eyeEnlarge: number;
  brightness: number;
  contrast: number;
  saturation: number;
}
