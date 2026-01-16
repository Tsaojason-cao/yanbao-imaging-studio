// lib/beauty-shader-engine.ts

/**
 * 15维骨相美颜矩阵 (Facial Reconstruction Matrix) 参数接口
 * 所有参数均需与 UI 滑块 1:1 强绑定
 */
export interface FacialReconstructionMatrix {
  // 基础 12 维
  faceSlim: number; // 颧骨收缩: 0-100
  jawline: number; // 下颌线: 0-100
  eyeEnlarge: number; // 径向放大: 0-100
  noseNarrow: number; // 鼻翼压缩: 0-100
  noseLength: number; // 鼻长/人中: -50 to 50 (负值为人中缩短)
  forehead: number; // 额头: -50 to 50
  mouthSize: number; // 嘴型: -50 to 50
  eyeDistance: number; // 眼距: -50 to 50
  cheekbone: number; // 脸颊收缩: 0-100
  chinLength: number; // 下巴长度: -50 to 50
  eyeHeight: number; // 眼睛高度: -50 to 50
  eyeAngle: number; // 眼睛角度: -50 to 50

  // 进阶 3 维
  philtrumDepth: number; // 人中深度: 0-100 (增加立体感)
  templeFill: number; // 太阳穴填充: 0-100
  nasolabialFolds: number; // 法令纹淡化: 0-100
}

/**
 * 14维专业影调与质感阵列 (Professional Tone & Texture Array) 参数接口
 */
export interface ProfessionalToneArray {
  // 基础 10 维
  exposure: number; // 曝光: -2.0 to 2.0
  contrast: number; // 对比度: 50-150
  saturation: number; // 饱和度: 0-200
  vibrance: number; // 鲜艳度: 0-100
  highlights: number; // 高光: 0-100
  shadows: number; // 阴影: 0-100
  temperature: number; // 色温: 2000K-10000K
  tint: number; // 色调: -50 to 50
  sharpness: number; // 锐度: 0-100
  grain: number; // 颗粒: 0-100

  // 进阶 4 维
  bloomIntensity: number; // 柔光/朦胧感: 0-100
  dehaze: number; // 去雾/通透度: 0-100
  skinTexture: number; // 皮肤质感保留: 0-100
  hslSkinHue: number; // 肤色色相: -50 to 50
  hslSkinSat: number; // 肤色饱和度: 50 to 150
  hslSkinLum: number; // 肤色亮度: -50 to 50
}

/**
 * 29维核心参数的联合类型
 */
export type Core29Params = FacialReconstructionMatrix & ProfessionalToneArray;

// 默认参数 (所有美颜参数归零，影调参数为中性)
export const DEFAULT_PARAMS: Core29Params = {
  faceSlim: 0,
  jawline: 0,
  eyeEnlarge: 0,
  noseNarrow: 0,
  noseLength: 0,
  forehead: 0,
  mouthSize: 0,
  eyeDistance: 0,
  cheekbone: 0,
  chinLength: 0,
  eyeHeight: 0,
  eyeAngle: 0,
  philtrumDepth: 0, // New
  templeFill: 0, // New
  nasolabialFolds: 0, // New

  exposure: 0.0,
  contrast: 100,
  saturation: 100,
  vibrance: 100,
  highlights: 100,
  shadows: 0,
  temperature: 6500,
  tint: 0,
  sharpness: 0,
  grain: 0,
  bloomIntensity: 0, // New
  dehaze: 0, // New
  skinTexture: 0, // New
  hslSkinHue: 0, // New
  hslSkinSat: 100, // New
  hslSkinLum: 0, // New
};

/**
 * 图像处理引擎类
 * 负责将参数映射到底层 Shader Uniforms
 */
export class BeautyShaderEngine {
  private currentParams: Core29Params;
  private shaderInstance: any; // 假设这是底层 WebGL/Metal Shader 实例

  constructor(initialParams: Core29Params = DEFAULT_PARAMS) {
    this.currentParams = initialParams;
    // 初始化 Shader 实例
    this.shaderInstance = this.initializeShader();
    this.updateAllUniforms();
  }

  private initializeShader(): any {
    // 实际项目中会加载 GLSL/Metal Shaders
    console.log("Initializing core image processing shader for 29 dimensions...");
    return {
      // 模拟 setUniform 方法
      setUniform: (name: string, value: number) => {
        // console.log(`[Shader] Setting ${name} to ${value}`);
      }
    };
  }

  /**
   * 核心：将参数映射到底层 Shader Uniforms
   */
  private setUniform<K extends keyof Core29Params>(key: K, value: Core29Params[K]): void {
    const uniformName = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
    let mappedValue: number;

    // --- 骨相美颜矩阵映射 ---
    if (key === 'faceSlim' || key === 'jawline' || key === 'eyeEnlarge' || key === 'noseNarrow' || key === 'cheekbone' || key === 'philtrumDepth' || key === 'templeFill' || key === 'nasolabialFolds' || key === 'vibrance' || key === 'highlights' || key === 'shadows' || key === 'sharpness' || key === 'grain' || key === 'bloomIntensity' || key === 'dehaze' || key === 'skinTexture') {
      mappedValue = value as number / 100.0; // 映射到 0.0-1.0
    }
    // 关键：支持负值位移的参数
    else if (key === 'noseLength' || key === 'forehead' || key === 'mouthSize' || key === 'eyeDistance' || key === 'chinLength' || key === 'eyeHeight' || key === 'eyeAngle' || key === 'tint' || key === 'hslSkinHue' || key === 'hslSkinLum') {
      mappedValue = value as number / 50.0; // 映射到 -1.0 到 1.0
    }
    // --- 影调映射映射 ---
    else if (key === 'exposure') {
      mappedValue = value as number; // 保持 -2.0 到 2.0
    } else if (key === 'contrast' || key === 'hslSkinSat') {
      mappedValue = value as number / 100.0; // 映射到 0.5-1.5 或 0.5-2.0 (假设 100 是中性)
    } else if (key === 'saturation') {
      mappedValue = value as number / 100.0; // 映射到 0.0-2.0 (假设 100 是中性)
    } else if (key === 'temperature') {
      mappedValue = (value as number - 2000) / 8000; // 映射 2000K-10000K 到 0-1
    } else {
      mappedValue = value as number;
    }

    this.shaderInstance.setUniform(uniformName, mappedValue);
  }

  /**
   * 更新所有 Uniforms
   */
  private updateAllUniforms(): void {
    for (const key in this.currentParams) {
      if (this.currentParams.hasOwnProperty(key)) {
        this.setUniform(key as keyof Core29Params, this.currentParams[key as keyof Core29Params]);
      }
    }
  }

  /**
   * UI 滑块值变化时调用，实时更新画面
   * @param key 参数键名
   * @param value 新的滑块值
   */
  public onSliderChange<K extends keyof Core29Params>(key: K, value: Core29Params[K]): void {
    this.currentParams[key] = value;
    this.setUniform(key, value);
  }

  /**
   * 获取当前所有参数，用于数据存取
   */
  public getCurrentParams(): Core29Params {
    return this.currentParams;
  }

  /**
   * 从 JSON 还原所有参数
   * @param params JSON 解析后的参数对象
   */
  public loadParams(params: Core29Params): void {
    this.currentParams = params;
    this.updateAllUniforms();
  }
}

// ------------------------------------------------------------------
// GLSL Fragment Shader (仅为示例，需在实际项目中实现复杂的图像处理逻辑)
// ------------------------------------------------------------------
const FRAGMENT_SHADER = `
  precision highp float;
  
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  
  // 29维核心参数 Uniforms
  // 骨相美颜
  uniform float uFaceSlim;
  uniform float uJawline;
  uniform float uEyeEnlarge;
  uniform float uNoseNarrow;
  uniform float uNoseLength; // -1.0 to 1.0
  uniform float uForehead;
  uniform float uMouthSize;
  uniform float uEyeDistance;
  uniform float uCheekbone;
  uniform float uChinLength;
  uniform float uEyeHeight;
  uniform float uEyeAngle;
  uniform float uPhiltrumDepth; // New
  uniform float uTempleFill; // New
  uniform float uNasolabialFolds; // New

  // 影调与质感
  uniform float uExposure;
  uniform float uContrast;
  uniform float uSaturation;
  uniform float uVibrance;
  uniform float uHighlights;
  uniform float uShadows;
  uniform float uTemperature;
  uniform float uTint;
  uniform float uSharpness;
  uniform float uGrain;
  uniform float uBloomIntensity; // New
  uniform float uDehaze; // New
  uniform float uSkinTexture; // New
  uniform float uHslSkinHue; // New
  uniform float uHslSkinSat; // New
  uniform float uHslSkinLum; // New
  
  varying vec2 v_texCoord;

  // ... (此处省略了 applyEyesEnlargement, applyFaceSlimming 等复杂的 GLSL 函数)

  void main() {
    vec2 coord = v_texCoord;
    vec4 color = texture2D(u_texture, coord);

    // 1. 骨相美颜处理 (使用 uNoseLength, uPhiltrumDepth, uNasolabialFolds 等)
    // 假设 coord = applyFacialReconstruction(coord, uNoseLength, uPhiltrumDepth, uNasolabialFolds, ...);

    // 2. 质感处理 (uSkinTexture, uNasolabialFolds)
    // 假设 color = applyTextureAndSmoothing(color, uSkinTexture, uNasolabialFolds);

    // 3. 影调处理 (uExposure, uContrast, uSaturation, uBloomIntensity, uDehaze, uHslSkin...)
    // 假设 color = applyToneMapping(color, uExposure, uContrast, uSaturation, uBloomIntensity, uDehaze, uHslSkinHue, uHslSkinSat, uHslSkinLum, ...);

    // 示例：应用柔光效果 (Bloom)
    if (uBloomIntensity > 0.0) {
      // 简化的柔光效果：与模糊后的图像混合
      vec4 blurred = vec4(0.0); // 实际应通过多通道渲染实现
      color = mix(color, blurred, uBloomIntensity * 0.3);
    }

    // 示例：应用去雾效果 (Dehaze)
    if (uDehaze > 0.0) {
      // 简化的去雾：增加对比度和饱和度
      color.rgb = (color.rgb - 0.5) * (1.0 + uDehaze * 0.5) + 0.5;
      color.rgb = mix(color.rgb, vec3(dot(color.rgb, vec3(0.2126, 0.7152, 0.0722))), -uDehaze * 0.2);
    }

    // 示例：应用肤色 HSL 调节
    if (uHslSkinHue != 0.0 || uHslSkinSat != 0.0 || uHslSkinLum != 0.0) {
      // 实际应通过肤色蒙版和 HSL 转换实现
      // color = applyHslSkinCorrection(color, uHslSkinHue, uHslSkinSat, uHslSkinLum);
    }

    gl_FragColor = color;
  }
`;
