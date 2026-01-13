/**
 * 渐进式渲染引擎
 * 
 * 功能：
 * - 为 AI 处理添加低分辨率预览
 * - 先显示快速预览，后显示高质量结果
 * - 改善用户体验和响应感
 * 
 * 作者：Manus AI
 * 日期：2026-01-13
 */

export interface ProgressiveRenderingConfig {
  previewQuality: number;     // 预览质量（0.25-1.0）
  previewDelay: number;       // 预览延迟（ms）
  finalQuality: number;       // 最终质量（0.5-1.0）
  enablePreview: boolean;     // 是否启用预览
  previewTimeout: number;     // 预览超时时间（ms）
}

export interface RenderingResult {
  preview?: string;           // 预览 URI
  final: string;              // 最终结果 URI
  totalTime: number;          // 总处理时间（ms）
  previewTime: number;        // 预览显示时间（ms）
}

export class ProgressiveRenderingEngine {
  private config: ProgressiveRenderingConfig;

  constructor(config: Partial<ProgressiveRenderingConfig> = {}) {
    this.config = {
      previewQuality: 0.4,
      previewDelay: 100,
      finalQuality: 1.0,
      enablePreview: true,
      previewTimeout: 5000,
      ...config
    };
  }

  /**
   * 为 AI 消除添加渐进式渲染
   */
  async renderInpaintingProgressively(
    imageUri: string,
    maskUri: string,
    onPreview: (previewUri: string) => void,
    onFinal: (finalUri: string) => void,
    onError?: (error: Error) => void
  ): Promise<RenderingResult> {
    const startTime = Date.now();
    let previewTime = 0;

    try {
      if (!this.config.enablePreview) {
        // 直接处理，不显示预览
        console.log('[ProgressiveRenderingEngine] Preview disabled, processing directly');
        const result = await this.processInpainting(imageUri, maskUri, 1.0);
        onFinal(result);
        
        return {
          final: result,
          totalTime: Date.now() - startTime,
          previewTime: 0
        };
      }

      // 第一步：生成低分辨率预览
      const previewPromise = this.generatePreview(imageUri, maskUri);

      // 第二步：显示预览
      const previewStartTime = Date.now();
      const previewTimeout = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Preview timeout')), this.config.previewTimeout);
      });

      try {
        const preview = await Promise.race([previewPromise, previewTimeout]);
        previewTime = Date.now() - previewStartTime;
        
        console.log('[ProgressiveRenderingEngine] Preview ready in', previewTime, 'ms');
        onPreview(preview);
      } catch (error) {
        console.warn('[ProgressiveRenderingEngine] Preview generation failed:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }

      // 第三步：处理高质量结果
      const final = await this.processInpainting(imageUri, maskUri, this.config.finalQuality);
      onFinal(final);

      return {
        preview: undefined, // 预览已通过回调返回
        final,
        totalTime: Date.now() - startTime,
        previewTime
      };
    } catch (error) {
      console.error('[ProgressiveRenderingEngine] Inpainting rendering failed:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  }

  /**
   * 为 AI 扩图添加渐进式渲染
   */
  async renderOutpaintingProgressively(
    imageUri: string,
    direction: string,
    scale: number,
    onPreview: (previewUri: string) => void,
    onFinal: (finalUri: string) => void,
    onError?: (error: Error) => void
  ): Promise<RenderingResult> {
    const startTime = Date.now();
    let previewTime = 0;

    try {
      if (!this.config.enablePreview) {
        console.log('[ProgressiveRenderingEngine] Preview disabled, processing directly');
        const result = await this.processOutpainting(imageUri, direction, scale, 1.0);
        onFinal(result);
        
        return {
          final: result,
          totalTime: Date.now() - startTime,
          previewTime: 0
        };
      }

      // 第一步：生成低分辨率预览
      const previewPromise = this.generateOutpaintingPreview(imageUri, direction, scale);

      // 第二步：显示预览
      const previewStartTime = Date.now();
      const previewTimeout = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Preview timeout')), this.config.previewTimeout);
      });

      try {
        const preview = await Promise.race([previewPromise, previewTimeout]);
        previewTime = Date.now() - previewStartTime;
        
        console.log('[ProgressiveRenderingEngine] Outpainting preview ready in', previewTime, 'ms');
        onPreview(preview);
      } catch (error) {
        console.warn('[ProgressiveRenderingEngine] Outpainting preview generation failed:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }

      // 第三步：处理高质量结果
      const final = await this.processOutpainting(imageUri, direction, scale, this.config.finalQuality);
      onFinal(final);

      return {
        preview: undefined,
        final,
        totalTime: Date.now() - startTime,
        previewTime
      };
    } catch (error) {
      console.error('[ProgressiveRenderingEngine] Outpainting rendering failed:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      throw error;
    }
  }

  /**
   * 设置预览质量
   */
  setPreviewQuality(quality: number): void {
    this.config.previewQuality = Math.max(0.25, Math.min(quality, 1.0));
  }

  /**
   * 设置最终质量
   */
  setFinalQuality(quality: number): void {
    this.config.finalQuality = Math.max(0.5, Math.min(quality, 1.0));
  }

  /**
   * 启用/禁用预览
   */
  setPreviewEnabled(enabled: boolean): void {
    this.config.enablePreview = enabled;
  }

  // ============ 私有方法 ============

  private async generatePreview(imageUri: string, maskUri: string): Promise<string> {
    // 生成低分辨率预览（缩小到原始大小的 40%）
    return this.processInpainting(imageUri, maskUri, this.config.previewQuality);
  }

  private async generateOutpaintingPreview(
    imageUri: string,
    direction: string,
    scale: number
  ): Promise<string> {
    return this.processOutpainting(imageUri, direction, scale, this.config.previewQuality);
  }

  private async processInpainting(
    imageUri: string,
    maskUri: string,
    quality: number
  ): Promise<string> {
    try {
      // 调用后端 API 处理 AI 消除
      // quality 参数控制输出分辨率
      // 0.4 = 40% 分辨率（快速预览）
      // 1.0 = 100% 分辨率（最终结果）
      
      console.log('[ProgressiveRenderingEngine] Processing inpainting with quality:', quality);

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg'
      } as any);
      formData.append('mask', {
        uri: maskUri,
        type: 'image/png',
        name: 'mask.png'
      } as any);
      formData.append('quality', quality.toString());

      // 这里应该使用真实的后端 API 地址
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/v1/inpaint`, {
        method: 'POST',
        body: formData,
        timeout: 60000
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.resultUri || imageUri;
    } catch (error) {
      console.error('[ProgressiveRenderingEngine] Inpainting processing failed:', error);
      // 返回原始图像作为降级方案
      return imageUri;
    }
  }

  private async processOutpainting(
    imageUri: string,
    direction: string,
    scale: number,
    quality: number
  ): Promise<string> {
    try {
      // 调用后端 API 处理 AI 扩图
      
      console.log('[ProgressiveRenderingEngine] Processing outpainting with quality:', quality);

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg'
      } as any);
      formData.append('direction', direction);
      formData.append('scale', scale.toString());
      formData.append('quality', quality.toString());

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/v1/outpaint`, {
        method: 'POST',
        body: formData,
        timeout: 60000
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.resultUri || imageUri;
    } catch (error) {
      console.error('[ProgressiveRenderingEngine] Outpainting processing failed:', error);
      return imageUri;
    }
  }
}

export default ProgressiveRenderingEngine;
