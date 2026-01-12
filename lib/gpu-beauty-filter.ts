/**
 * GPU加速美颜滤镜
 * 使用GLSL Shader实现实时美颜效果
 */

// 美颜参数接口
export interface BeautyParams {
  skin: number;      // 磨皮 0-100
  light: number;     // 光影 0-100
  bone: number;      // 骨相 0-100
  color: number;     // 色彩 0-100
  whitening: number; // 美白 0-100
  eye: number;       // 大眼 0-100
  face: number;      // 瘦脸 0-100
}

// 顶点着色器
export const vertexShader = `
  attribute vec2 position;
  varying vec2 uv;
  void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// 片段着色器 - 美颜效果
export const fragmentShader = `
  precision highp float;
  varying vec2 uv;
  uniform sampler2D texture;
  uniform float skin;       // 磨皮强度
  uniform float whitening;  // 美白强度
  uniform float light;      // 光影强度
  uniform float color;      // 色彩强度

  // 高斯模糊用于磨皮
  vec4 gaussianBlur(sampler2D tex, vec2 uv, float radius) {
    vec4 sum = vec4(0.0);
    float weights = 0.0;
    float pixelSize = 0.002 * radius;
    
    for (float x = -2.0; x <= 2.0; x++) {
      for (float y = -2.0; y <= 2.0; y++) {
        vec2 offset = vec2(x, y) * pixelSize;
        float weight = exp(-(x*x + y*y) / 4.0);
        sum += texture2D(tex, uv + offset) * weight;
        weights += weight;
      }
    }
    
    return sum / weights;
  }

  // 高反差保留（保留细节）
  vec4 highPass(vec4 original, vec4 blurred) {
    return original + (original - blurred) * 0.5;
  }

  void main() {
    vec4 originalColor = texture2D(texture, uv);
    vec4 color = originalColor;

    // 1. 磨皮效果（高斯模糊 + 高反差保留）
    if (skin > 0.01) {
      vec4 blurred = gaussianBlur(texture, uv, skin / 100.0);
      vec4 detail = highPass(originalColor, blurred);
      color = mix(originalColor, blurred, skin / 100.0 * 0.6);
      color = mix(color, detail, 0.3); // 保留部分细节
    }

    // 2. 美白效果
    if (whitening > 0.01) {
      float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      vec3 whitened = color.rgb + vec3(whitening / 100.0 * 0.15);
      color.rgb = mix(color.rgb, whitened, whitening / 100.0);
    }

    // 3. 光影调整（对比度）
    if (light > 0.01) {
      float contrast = 1.0 + (light - 50.0) / 100.0;
      color.rgb = ((color.rgb - 0.5) * contrast + 0.5);
    }

    // 4. 色彩饱和度
    if (abs(color - 50.0) > 0.01) {
      float saturation = 1.0 + (color - 50.0) / 50.0;
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(gray), color.rgb, saturation);
    }

    gl_FragColor = vec4(color.rgb, originalColor.a);
  }
`;

/**
 * 应用美颜滤镜到图像
 * @param gl WebGL上下文
 * @param texture 输入纹理
 * @param params 美颜参数
 */
export function applyBeautyFilter(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  params: BeautyParams
): void {
  // 编译着色器
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, vertexShader);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, fragmentShader);
  gl.compileShader(fs);

  // 创建程序
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  // 设置uniform变量
  gl.uniform1f(gl.getUniformLocation(program, "skin"), params.skin);
  gl.uniform1f(gl.getUniformLocation(program, "whitening"), params.whitening);
  gl.uniform1f(gl.getUniformLocation(program, "light"), params.light);
  gl.uniform1f(gl.getUniformLocation(program, "color"), params.color);

  // 绑定纹理
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

  // 绘制
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * 创建纹理从图像URI
 */
export function createTextureFromImage(
  gl: WebGLRenderingContext,
  imageUri: string
): Promise<WebGLTexture> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const texture = gl.createTexture();
      if (!texture) {
        reject(new Error("Failed to create texture"));
        return;
      }

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      resolve(texture);
    };
    image.onerror = reject;
    image.src = imageUri;
  });
}
