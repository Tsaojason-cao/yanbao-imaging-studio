/**
 * 相册系统与社区互通引擎
 * 
 * 核心功能：
 * - 与系统相册双向同步（MediaStore/PHPhotoLibrary）
 * - 一键生成分享海报
 * - 社交平台分享
 * - 照片元数据管理
 * 
 * by Jason Tsao ❤️
 */

import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import type { BeautyParams } from './beauty-shader-engine';
import type { MasterPreset } from '../constants/master-presets';

/**
 * 照片资产接口
 */
export interface PhotoAsset {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration: number;
  mediaType: 'photo' | 'video';
  albumId?: string;
}

/**
 * 分享海报配置
 */
export interface SharePosterConfig {
  photoUri: string;
  masterPreset: MasterPreset;
  beautyParams: BeautyParams;
  intensity: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: number;
  watermark?: string;
}

/**
 * 社交平台枚举
 */
export enum SocialPlatform {
  WECHAT = 'wechat',
  WEIBO = 'weibo',
  DOUYIN = 'douyin',
  XIAOHONGSHU = 'xiaohongshu',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}

/**
 * 相册系统与社区互通引擎
 */
export class GallerySocialEngine {
  private static instance: GallerySocialEngine;
  private hasMediaLibraryPermission: boolean = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): GallerySocialEngine {
    if (!GallerySocialEngine.instance) {
      GallerySocialEngine.instance = new GallerySocialEngine();
    }
    return GallerySocialEngine.instance;
  }

  /**
   * 请求媒体库权限
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Media library permission denied');
        this.hasMediaLibraryPermission = false;
        return false;
      }

      this.hasMediaLibraryPermission = true;
      return true;
    } catch (error) {
      console.error('Failed to request media library permission:', error);
      return false;
    }
  }

  /**
   * 从系统相册读取照片
   */
  async getPhotosFromSystemGallery(
    first: number = 20,
    after?: string
  ): Promise<{ assets: PhotoAsset[]; endCursor: string; hasNextPage: boolean }> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return { assets: [], endCursor: '', hasNextPage: false };
      }

      const result = await MediaLibrary.getAssetsAsync({
        first,
        after,
        mediaType: ['photo'],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      const assets: PhotoAsset[] = result.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        filename: asset.filename,
        width: asset.width,
        height: asset.height,
        creationTime: asset.creationTime,
        modificationTime: asset.modificationTime,
        duration: asset.duration,
        mediaType: asset.mediaType,
        albumId: asset.albumId,
      }));

      return {
        assets,
        endCursor: result.endCursor,
        hasNextPage: result.hasNextPage,
      };
    } catch (error) {
      console.error('Failed to get photos from system gallery:', error);
      return { assets: [], endCursor: '', hasNextPage: false };
    }
  }

  /**
   * 保存照片到系统相册
   */
  async savePhotoToSystemGallery(uri: string, albumName: string = 'YanBao AI'): Promise<boolean> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return false;
      }

      // 创建或获取相册
      let album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return true;
    } catch (error) {
      console.error('Failed to save photo to system gallery:', error);
      return false;
    }
  }

  /**
   * 从系统相册删除照片
   */
  async deletePhotoFromSystemGallery(assetId: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return false;
      }

      await MediaLibrary.deleteAssetsAsync([assetId]);
      return true;
    } catch (error) {
      console.error('Failed to delete photo from system gallery:', error);
      return false;
    }
  }

  /**
   * 生成分享海报
   * 
   * 海报布局：
   * - 顶部：照片
   * - 中部：大师名称和风格
   * - 底部：参数矩阵（12维美颜 + 10维影调）
   * - 水印：YanBao AI Logo + 库洛米
   */
  async generateSharePoster(config: SharePosterConfig, viewRef: any): Promise<string | null> {
    try {
      // 使用 react-native-view-shot 捕获海报视图
      const posterUri = await captureRef(viewRef, {
        format: 'png',
        quality: 1.0,
      });

      return posterUri;
    } catch (error) {
      console.error('Failed to generate share poster:', error);
      return null;
    }
  }

  /**
   * 创建分享海报的HTML内容（用于渲染）
   */
  generateSharePosterHTML(config: SharePosterConfig): string {
    const {
      photoUri,
      masterPreset,
      beautyParams,
      intensity,
      location,
      timestamp,
      watermark,
    } = config;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          
          .poster {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          
          .photo {
            width: 100%;
            height: auto;
            display: block;
          }
          
          .content {
            padding: 30px;
          }
          
          .master-info {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .master-name {
            font-size: 32px;
            font-weight: bold;
            color: ${masterPreset.color};
            margin-bottom: 8px;
          }
          
          .master-style {
            font-size: 16px;
            color: #666;
          }
          
          .params-section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${masterPreset.color};
          }
          
          .params-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          
          .param-item {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }
          
          .param-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
          }
          
          .param-value {
            font-size: 18px;
            font-weight: bold;
            color: ${masterPreset.color};
          }
          
          .location-info {
            background: linear-gradient(135deg, ${masterPreset.color}20, ${masterPreset.color}10);
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .location-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          
          .location-text {
            font-size: 14px;
            color: #666;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .watermark {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .slogan {
            font-size: 14px;
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="poster">
          <img src="${photoUri}" alt="Photo" class="photo">
          
          <div class="content">
            <div class="master-info">
              <div class="master-name">${masterPreset.icon} ${masterPreset.name}</div>
              <div class="master-style">${masterPreset.style}</div>
            </div>
            
            ${location ? `
            <div class="location-info">
              <div class="location-icon">📍</div>
              <div class="location-text">${location.address}</div>
            </div>
            ` : ''}
            
            <div class="params-section">
              <div class="section-title">✨ 12维美颜参数</div>
              <div class="params-grid">
                <div class="param-item">
                  <div class="param-label">大眼</div>
                  <div class="param-value">${beautyParams.eyes}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">瘦脸</div>
                  <div class="param-value">${beautyParams.face}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">窄脸</div>
                  <div class="param-value">${beautyParams.narrow}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">下巴</div>
                  <div class="param-value">${beautyParams.chin}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">额头</div>
                  <div class="param-value">${beautyParams.forehead}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">人中</div>
                  <div class="param-value">${beautyParams.philtrum}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">瘦鼻</div>
                  <div class="param-value">${beautyParams.nose}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">鼻长</div>
                  <div class="param-value">${beautyParams.noseLength}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">嘴型</div>
                  <div class="param-value">${beautyParams.mouth}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">眼角</div>
                  <div class="param-value">${beautyParams.eyeCorner}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">眼距</div>
                  <div class="param-value">${beautyParams.eyeDistance}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">肤色亮度</div>
                  <div class="param-value">${beautyParams.skinBrightness}</div>
                </div>
              </div>
            </div>
            
            <div class="params-section">
              <div class="section-title">🎨 影调参数</div>
              <div class="params-grid">
                <div class="param-item">
                  <div class="param-label">曝光</div>
                  <div class="param-value">${masterPreset.params.exposure.toFixed(1)}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">对比度</div>
                  <div class="param-value">${masterPreset.params.contrast}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">饱和度</div>
                  <div class="param-value">${masterPreset.params.saturation}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">高光</div>
                  <div class="param-value">${masterPreset.params.highlights}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">阴影</div>
                  <div class="param-value">${masterPreset.params.shadows}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">色温</div>
                  <div class="param-value">${masterPreset.params.temperature}K</div>
                </div>
                <div class="param-item">
                  <div class="param-label">色调</div>
                  <div class="param-value">${masterPreset.params.tint}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">颗粒</div>
                  <div class="param-value">${masterPreset.params.grain}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">暗角</div>
                  <div class="param-value">${masterPreset.params.vignette}</div>
                </div>
                <div class="param-item">
                  <div class="param-label">锐度</div>
                  <div class="param-value">${masterPreset.params.sharpness}</div>
                </div>
              </div>
            </div>
            
            <div class="param-item" style="margin-top: 20px;">
              <div class="param-label">强度</div>
              <div class="param-value">${intensity}%</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="watermark">🐰 ${watermark || 'YanBao AI'}</div>
            <div class="slogan">每一个参数，都是我为你精心调校的爱意</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 分享到社交平台
   */
  async shareToSocialPlatform(
    posterUri: string,
    platform: SocialPlatform,
    message?: string
  ): Promise<boolean> {
    try {
      // 检查是否支持分享
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        console.warn('Sharing is not available on this device');
        return false;
      }

      // 使用系统分享对话框
      await Sharing.shareAsync(posterUri, {
        mimeType: 'image/png',
        dialogTitle: message || '分享我的 YanBao AI 作品',
        UTI: 'public.png',
      });

      return true;
    } catch (error) {
      console.error('Failed to share to social platform:', error);
      return false;
    }
  }

  /**
   * 保存分享海报到相册
   */
  async saveSharePosterToGallery(posterUri: string): Promise<boolean> {
    return this.savePhotoToSystemGallery(posterUri, 'YanBao AI - Share Posters');
  }

  /**
   * 批量导入照片到应用
   */
  async batchImportPhotos(assetIds: string[]): Promise<PhotoAsset[]> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return [];
      }

      const assets = await MediaLibrary.getAssetsAsync({
        first: assetIds.length,
        mediaType: ['photo'],
      });

      return assets.assets
        .filter((asset) => assetIds.includes(asset.id))
        .map((asset) => ({
          id: asset.id,
          uri: asset.uri,
          filename: asset.filename,
          width: asset.width,
          height: asset.height,
          creationTime: asset.creationTime,
          modificationTime: asset.modificationTime,
          duration: asset.duration,
          mediaType: asset.mediaType,
          albumId: asset.albumId,
        }));
    } catch (error) {
      console.error('Failed to batch import photos:', error);
      return [];
    }
  }

  /**
   * 批量导出照片到系统相册
   */
  async batchExportPhotos(photoUris: string[]): Promise<boolean> {
    try {
      for (const uri of photoUris) {
        await this.savePhotoToSystemGallery(uri);
      }
      return true;
    } catch (error) {
      console.error('Failed to batch export photos:', error);
      return false;
    }
  }

  /**
   * 获取相册列表
   */
  async getAlbums(): Promise<MediaLibrary.Album[]> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return [];
      }

      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    } catch (error) {
      console.error('Failed to get albums:', error);
      return [];
    }
  }

  /**
   * 创建自定义相册
   */
  async createCustomAlbum(albumName: string, assetUri: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(assetUri);
      await MediaLibrary.createAlbumAsync(albumName, asset, false);
      return true;
    } catch (error) {
      console.error('Failed to create custom album:', error);
      return false;
    }
  }
}

// 导出单例
export const gallerySocialEngine = GallerySocialEngine.getInstance();
