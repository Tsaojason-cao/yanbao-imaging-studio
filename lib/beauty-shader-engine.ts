/**
 * 12维美颜 Shader 引擎
 * 
 * 核心功能：
 * - 基于 WebGL/OpenGL ES 的实时人脸美颜
 * - 12个维度的骨相级调优
 * - 实时预览与渲染
 * 
 * 技术栈：
 * - expo-gl (OpenGL ES bindings)
 * - expo-gl-cpp (C++ accelerated processing)
 * - @tensorflow/tfjs (人脸检测)
 * 
 * by Jason Tsao ❤️
 */

import { GLView } from 'expo-gl';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

/**
 * 12维美颜参数接口
 */
export interface BeautyParams {
  eyes: number;           // 大眼 (0-100)
  face: number;           // 瘦脸 (0-100)
  narrow: number;         // 窄脸 (0-100)
  chin: number;           // 下巴 (0-100)
  forehead: number;       // 额头 (0-100)
  philtrum: number;       // 人中 (0-100)
  nose: number;           // 瘦鼻 (0-100)
  noseLength: number;     // 鼻长 (0-100)
  mouth: number;          // 嘴型 (0-100)
  eyeCorner: number;      // 眼角 (0-100)
  eyeDistance: number;    // 眼距 (0-100)
  skinBrightness: number; // 肤色亮度 (0-100)
}

/**
 * 人脸关键点（68点标准）
 */
export interface FaceLandmarks {
  leftEye: { x: number; y: number }[];      // 左眼轮廓 (6点)
  rightEye: { x: number; y: number }[];     // 右眼轮廓 (6点)
  nose: { x: number; y: number }[];         // 鼻子轮廓 (9点)
  mouth: { x: number; y: number }[];        // 嘴巴轮廓 (20点)
  jawline: { x: number; y: number }[];      // 下颌线 (17点)
  leftEyebrow: { x: number; y: number }[];  // 左眉毛 (5点)
  rightEyebrow: { x: number; y: number }[]; // 右眉毛 (5点)
}

/**
 * 顶点着色器（Vertex Shader）
 * 用于处理顶点位置变换
 */
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

/**
 * 片段着色器（Fragment Shader）
 * 用于处理像素颜色和美颜效果
 */
const FRAGMENT_SHADER = `
  precision highp float;
  
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  
  // 人脸关键点
  uniform vec2 u_leftEyeCenter;
  uniform vec2 u_rightEyeCenter;
  uniform vec2 u_noseCenter;
  uniform vec2 u_mouthCenter;
  uniform vec2 u_chinPoint;
  uniform vec2 u_foreheadCenter;
  
  // 12维美颜参数
  uniform float u_eyesSize;          // 大眼
  uniform float u_faceSlim;          // 瘦脸
  uniform float u_faceNarrow;        // 窄脸
  uniform float u_chinAdjust;        // 下巴
  uniform float u_foreheadAdjust;    // 额头
  uniform float u_philtrumAdjust;    // 人中
  uniform float u_noseSlim;          // 瘦鼻
  uniform float u_noseLengthAdjust;  // 鼻长
  uniform float u_mouthAdjust;       // 嘴型
  uniform float u_eyeCornerAdjust;   // 眼角
  uniform float u_eyeDistanceAdjust; // 眼距
  uniform float u_skinBrightness;    // 肤色亮度
  
  varying vec2 v_texCoord;
  
  /**
   * 计算两点之间的距离
   */
  float distance2D(vec2 p1, vec2 p2) {
    return sqrt(pow(p1.x - p2.x, 2.0) + pow(p1.y - p2.y, 2.0));
  }
  
  /**
   * 大眼效果
   * 使用径向扭曲算法，将眼睛周围的像素向外推
   */
  vec2 applyEyesEnlargement(vec2 coord, vec2 eyeCenter, float intensity) {
    float radius = 0.08 * intensity; // 影响半径
    float dist = distance2D(coord, eyeCenter);
    
    if (dist < radius) {
      float scale = 1.0 + (radius - dist) / radius * 0.5 * intensity;
      vec2 direction = coord - eyeCenter;
      return eyeCenter + direction * scale;
    }
    
    return coord;
  }
  
  /**
   * 瘦脸效果
   * 使用挤压算法，将脸颊两侧的像素向内推
   */
  vec2 applyFaceSlimming(vec2 coord, float intensity) {
    vec2 faceCenter = vec2(0.5, 0.5);
    float dist = abs(coord.x - faceCenter.x);
    
    if (dist > 0.15 && dist < 0.35) {
      float squeeze = (dist - 0.15) / 0.2 * intensity * 0.05;
      if (coord.x < faceCenter.x) {
        coord.x += squeeze;
      } else {
        coord.x -= squeeze;
      }
    }
    
    return coord;
  }
  
  /**
   * 窄脸效果
   * 整体收缩脸部宽度
   */
  vec2 applyFaceNarrowing(vec2 coord, float intensity) {
    vec2 faceCenter = vec2(0.5, 0.5);
    float xOffset = (coord.x - faceCenter.x) * (1.0 - intensity * 0.1);
    return vec2(faceCenter.x + xOffset, coord.y);
  }
  
  /**
   * 下巴调整
   * 拉长或缩短下巴
   */
  vec2 applyChinAdjustment(vec2 coord, vec2 chinPoint, float intensity) {
    float dist = distance2D(coord, chinPoint);
    float radius = 0.12;
    
    if (dist < radius && coord.y > chinPoint.y - 0.1) {
      float scale = 1.0 + (radius - dist) / radius * intensity * 0.15;
      vec2 direction = coord - chinPoint;
      return chinPoint + direction * vec2(1.0, scale);
    }
    
    return coord;
  }
  
  /**
   * 额头调整
   * 增大或减小额头
   */
  vec2 applyForeheadAdjustment(vec2 coord, vec2 foreheadCenter, float intensity) {
    float dist = distance2D(coord, foreheadCenter);
    float radius = 0.1;
    
    if (dist < radius && coord.y < foreheadCenter.y + 0.1) {
      float scale = 1.0 + (radius - dist) / radius * intensity * 0.1;
      vec2 direction = coord - foreheadCenter;
      return foreheadCenter + direction * vec2(1.0, scale);
    }
    
    return coord;
  }
  
  /**
   * 人中调整
   * 缩短或拉长人中
   */
  vec2 applyPhiltrumAdjustment(vec2 coord, vec2 noseCenter, vec2 mouthCenter, float intensity) {
    float philtrumY = (noseCenter.y + mouthCenter.y) / 2.0;
    
    if (coord.y > noseCenter.y && coord.y < mouthCenter.y) {
      float offset = (coord.y - philtrumY) * (1.0 - intensity * 0.2);
      return vec2(coord.x, philtrumY + offset);
    }
    
    return coord;
  }
  
  /**
   * 瘦鼻效果
   * 收缩鼻子宽度
   */
  vec2 applyNoseSlimming(vec2 coord, vec2 noseCenter, float intensity) {
    float dist = abs(coord.x - noseCenter.x);
    
    if (dist < 0.08 && abs(coord.y - noseCenter.y) < 0.1) {
      float squeeze = dist * intensity * 0.3;
      if (coord.x < noseCenter.x) {
        coord.x += squeeze;
      } else {
        coord.x -= squeeze;
      }
    }
    
    return coord;
  }
  
  /**
   * 鼻长调整
   * 拉长或缩短鼻子
   */
  vec2 applyNoseLengthAdjustment(vec2 coord, vec2 noseCenter, float intensity) {
    if (abs(coord.x - noseCenter.x) < 0.05 && abs(coord.y - noseCenter.y) < 0.12) {
      float scale = 1.0 + (intensity - 0.5) * 0.3;
      float yOffset = (coord.y - noseCenter.y) * scale;
      return vec2(coord.x, noseCenter.y + yOffset);
    }
    
    return coord;
  }
  
  /**
   * 嘴型调整
   * 增大或减小嘴巴
   */
  vec2 applyMouthAdjustment(vec2 coord, vec2 mouthCenter, float intensity) {
    float dist = distance2D(coord, mouthCenter);
    float radius = 0.08;
    
    if (dist < radius) {
      float scale = 1.0 + (radius - dist) / radius * (intensity - 0.5) * 0.3;
      vec2 direction = coord - mouthCenter;
      return mouthCenter + direction * scale;
    }
    
    return coord;
  }
  
  /**
   * 眼角调整
   * 上挑或下垂眼角
   */
  vec2 applyEyeCornerAdjustment(vec2 coord, vec2 eyeCenter, float intensity) {
    float dist = abs(coord.x - eyeCenter.x);
    
    if (dist > 0.03 && dist < 0.06 && abs(coord.y - eyeCenter.y) < 0.03) {
      float lift = (intensity - 0.5) * 0.02;
      return vec2(coord.x, coord.y - lift);
    }
    
    return coord;
  }
  
  /**
   * 眼距调整
   * 增大或减小两眼间距
   */
  vec2 applyEyeDistanceAdjustment(vec2 coord, vec2 leftEyeCenter, vec2 rightEyeCenter, float intensity) {
    vec2 eyesMidpoint = (leftEyeCenter + rightEyeCenter) / 2.0;
    
    // 左眼区域
    if (distance2D(coord, leftEyeCenter) < 0.1) {
      float offset = (intensity - 0.5) * 0.05;
      return vec2(coord.x - offset, coord.y);
    }
    
    // 右眼区域
    if (distance2D(coord, rightEyeCenter) < 0.1) {
      float offset = (intensity - 0.5) * 0.05;
      return vec2(coord.x + offset, coord.y);
    }
    
    return coord;
  }
  
  /**
   * 磨皮与美白
   * 使用双边滤波和亮度调整
   */
  vec4 applySkinSmoothing(vec2 coord, float brightness) {
    vec4 color = texture2D(u_texture, coord);
    
    // 简化的磨皮算法（实际应使用双边滤波）
    vec4 blurred = vec4(0.0);
    float kernel[9];
    kernel[0] = 0.0625; kernel[1] = 0.125; kernel[2] = 0.0625;
    kernel[3] = 0.125;  kernel[4] = 0.25;  kernel[5] = 0.125;
    kernel[6] = 0.0625; kernel[7] = 0.125; kernel[8] = 0.0625;
    
    float pixelSize = 1.0 / u_resolution.x;
    int index = 0;
    
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(float(x), float(y)) * pixelSize;
        blurred += texture2D(u_texture, coord + offset) * kernel[index];
        index++;
      }
    }
    
    // 混合原图和模糊图
    color = mix(color, blurred, 0.3);
    
    // 亮度调整
    float brightnessAdjust = (brightness - 50.0) / 100.0;
    color.rgb += vec3(brightnessAdjust * 0.2);
    
    return color;
  }
  
  void main() {
    vec2 coord = v_texCoord;
    
    // 归一化参数（0-100 -> 0.0-1.0）
    float eyesIntensity = u_eyesSize / 100.0;
    float faceSlimIntensity = u_faceSlim / 100.0;
    float faceNarrowIntensity = u_faceNarrow / 100.0;
    float chinIntensity = (u_chinAdjust - 50.0) / 50.0;
    float foreheadIntensity = (u_foreheadAdjust - 50.0) / 50.0;
    float philtrumIntensity = u_philtrumAdjust / 100.0;
    float noseSlimIntensity = u_noseSlim / 100.0;
    float noseLengthIntensity = u_noseLengthAdjust / 100.0;
    float mouthIntensity = u_mouthAdjust / 100.0;
    float eyeCornerIntensity = u_eyeCornerAdjust / 100.0;
    float eyeDistanceIntensity = u_eyeDistanceAdjust / 100.0;
    
    // 按顺序应用12维美颜效果
    coord = applyEyesEnlargement(coord, u_leftEyeCenter, eyesIntensity);
    coord = applyEyesEnlargement(coord, u_rightEyeCenter, eyesIntensity);
    coord = applyFaceSlimming(coord, faceSlimIntensity);
    coord = applyFaceNarrowing(coord, faceNarrowIntensity);
    coord = applyChinAdjustment(coord, u_chinPoint, chinIntensity);
    coord = applyForeheadAdjustment(coord, u_foreheadCenter, foreheadIntensity);
    coord = applyPhiltrumAdjustment(coord, u_noseCenter, u_mouthCenter, philtrumIntensity);
    coord = applyNoseSlimming(coord, u_noseCenter, noseSlimIntensity);
    coord = applyNoseLengthAdjustment(coord, u_noseCenter, noseLengthIntensity);
    coord = applyMouthAdjustment(coord, u_mouthCenter, mouthIntensity);
    coord = applyEyeCornerAdjustment(coord, u_leftEyeCenter, eyeCornerIntensity);
    coord = applyEyeCornerAdjustment(coord, u_rightEyeCenter, eyeCornerIntensity);
    coord = applyEyeDistanceAdjustment(coord, u_leftEyeCenter, u_rightEyeCenter, eyeDistanceIntensity);
    
    // 应用磨皮和美白
    vec4 color = applySkinSmoothing(coord, u_skinBrightness);
    
    gl_FragColor = color;
  }
`;

/**
 * BeautyShaderEngine 类
 * 管理 WebGL 渲染和美颜效果
 */
export class BeautyShaderEngine {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private faceLandmarks: FaceLandmarks | null = null;
  private faceDetectionModel: any = null;

  /**
   * 初始化 WebGL 上下文和着色器程序
   */
  async initialize(gl: WebGLRenderingContext) {
    this.gl = gl;

    // 加载 TensorFlow.js 人脸检测模型
    await tf.ready();
    // 这里应该加载 BlazeFace 或 MediaPipe Face Mesh 模型
    // this.faceDetectionModel = await blazeface.load();

    // 创建着色器程序
    const vertexShader = this.createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    this.program = gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(this.program);
      throw new Error('Failed to link program: ' + info);
    }

    gl.useProgram(this.program);

    // 创建纹理
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // 设置顶点缓冲
    this.setupVertexBuffer();
  }

  /**
   * 创建着色器
   */
  private createShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;

    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      console.error('Shader compilation error:', info);
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * 设置顶点缓冲
   */
  private setupVertexBuffer() {
    if (!this.gl || !this.program) return;

    const vertices = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
       1,  1, 1, 0,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);

    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
  }

  /**
   * 检测人脸关键点
   */
  async detectFaceLandmarks(imageData: ImageData): Promise<FaceLandmarks | null> {
    // 这里应该使用 TensorFlow.js 的人脸检测模型
    // 返回68个关键点的坐标
    
    // 示例：返回模拟的关键点
    return {
      leftEye: [
        { x: 0.35, y: 0.4 },
        { x: 0.37, y: 0.38 },
        { x: 0.39, y: 0.38 },
        { x: 0.41, y: 0.4 },
        { x: 0.39, y: 0.42 },
        { x: 0.37, y: 0.42 },
      ],
      rightEye: [
        { x: 0.59, y: 0.4 },
        { x: 0.61, y: 0.38 },
        { x: 0.63, y: 0.38 },
        { x: 0.65, y: 0.4 },
        { x: 0.63, y: 0.42 },
        { x: 0.61, y: 0.42 },
      ],
      nose: [
        { x: 0.5, y: 0.45 },
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.55 },
        { x: 0.48, y: 0.57 },
        { x: 0.5, y: 0.58 },
        { x: 0.52, y: 0.57 },
        { x: 0.47, y: 0.55 },
        { x: 0.5, y: 0.56 },
        { x: 0.53, y: 0.55 },
      ],
      mouth: [
        { x: 0.42, y: 0.7 },
        { x: 0.45, y: 0.68 },
        { x: 0.48, y: 0.67 },
        { x: 0.5, y: 0.68 },
        { x: 0.52, y: 0.67 },
        { x: 0.55, y: 0.68 },
        { x: 0.58, y: 0.7 },
        { x: 0.55, y: 0.72 },
        { x: 0.52, y: 0.73 },
        { x: 0.5, y: 0.73 },
        { x: 0.48, y: 0.73 },
        { x: 0.45, y: 0.72 },
        { x: 0.43, y: 0.7 },
        { x: 0.48, y: 0.69 },
        { x: 0.5, y: 0.69 },
        { x: 0.52, y: 0.69 },
        { x: 0.57, y: 0.7 },
        { x: 0.52, y: 0.71 },
        { x: 0.5, y: 0.71 },
        { x: 0.48, y: 0.71 },
      ],
      jawline: Array.from({ length: 17 }, (_, i) => ({
        x: 0.2 + (i / 16) * 0.6,
        y: 0.3 + Math.sin((i / 16) * Math.PI) * 0.5,
      })),
      leftEyebrow: [
        { x: 0.32, y: 0.35 },
        { x: 0.35, y: 0.33 },
        { x: 0.38, y: 0.32 },
        { x: 0.41, y: 0.33 },
        { x: 0.43, y: 0.35 },
      ],
      rightEyebrow: [
        { x: 0.57, y: 0.35 },
        { x: 0.59, y: 0.33 },
        { x: 0.62, y: 0.32 },
        { x: 0.65, y: 0.33 },
        { x: 0.68, y: 0.35 },
      ],
    };
  }

  /**
   * 应用美颜效果并渲染
   */
  render(imageData: ImageData, params: BeautyParams) {
    if (!this.gl || !this.program || !this.texture) return;

    const gl = this.gl;

    // 上传图像到纹理
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageData
    );

    // 设置 uniform 变量
    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    gl.uniform2f(resolutionLocation, imageData.width, imageData.height);

    // 设置人脸关键点（如果已检测）
    if (this.faceLandmarks) {
      const leftEyeCenter = this.calculateCenter(this.faceLandmarks.leftEye);
      const rightEyeCenter = this.calculateCenter(this.faceLandmarks.rightEye);
      const noseCenter = this.calculateCenter(this.faceLandmarks.nose);
      const mouthCenter = this.calculateCenter(this.faceLandmarks.mouth);
      const chinPoint = this.faceLandmarks.jawline[8]; // 下巴中点
      const foreheadCenter = { x: 0.5, y: 0.2 }; // 估算额头中心

      gl.uniform2f(gl.getUniformLocation(this.program, 'u_leftEyeCenter'), leftEyeCenter.x, leftEyeCenter.y);
      gl.uniform2f(gl.getUniformLocation(this.program, 'u_rightEyeCenter'), rightEyeCenter.x, rightEyeCenter.y);
      gl.uniform2f(gl.getUniformLocation(this.program, 'u_noseCenter'), noseCenter.x, noseCenter.y);
      gl.uniform2f(gl.getUniformLocation(this.program, 'u_mouthCenter'), mouthCenter.x, mouthCenter.y);
      gl.uniform2f(gl.getUniformLocation(this.program, 'u_chinPoint'), chinPoint.x, chinPoint.y);
      gl.uniform2f(gl.getUniformLocation(this.program, 'u_foreheadCenter'), foreheadCenter.x, foreheadCenter.y);
    }

    // 设置12维美颜参数
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_eyesSize'), params.eyes);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_faceSlim'), params.face);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_faceNarrow'), params.narrow);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_chinAdjust'), params.chin);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_foreheadAdjust'), params.forehead);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_philtrumAdjust'), params.philtrum);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_noseSlim'), params.nose);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_noseLengthAdjust'), params.noseLength);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_mouthAdjust'), params.mouth);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_eyeCornerAdjust'), params.eyeCorner);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_eyeDistanceAdjust'), params.eyeDistance);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_skinBrightness'), params.skinBrightness);

    // 渲染
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();
  }

  /**
   * 计算关键点的中心
   */
  private calculateCenter(points: { x: number; y: number }[]): { x: number; y: number } {
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / points.length, y: sum.y / points.length };
  }

  /**
   * 更新人脸关键点
   */
  updateFaceLandmarks(landmarks: FaceLandmarks) {
    this.faceLandmarks = landmarks;
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
    }
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

// 导出单例
export const beautyShaderEngine = new BeautyShaderEngine();
