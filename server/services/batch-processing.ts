import express, { Router, Request, Response } from 'express';
import { db } from '@/db';
import { photos, editHistory, presets } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

const router: Router = express.Router();

/**
 * 接口1：批量应用预设
 * POST /api/batch/apply-preset
 * 
 * 请求体：
 * - photoIds: 照片ID数组
 * - presetId: 预设ID
 * - userId: 用户ID（可选，从JWT获取）
 * 
 * 返回：
 * - processedCount: 处理的照片数量
 * - results: 处理结果数组
 */
router.post('/apply-preset', async (req: Request, res: Response) => {
  try {
    const { photoIds, presetId, userId } = req.body;

    // 验证输入
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({
        error: 'photoIds must be a non-empty array',
        code: 'INVALID_INPUT'
      });
    }

    if (!presetId) {
      return res.status(400).json({
        error: 'presetId is required',
        code: 'MISSING_PRESET_ID'
      });
    }

    // 获取预设配置
    const preset = await db.query.presets.findFirst({
      where: (presets, { eq }) => eq(presets.id, presetId)
    });

    if (!preset) {
      return res.status(404).json({
        error: 'Preset not found',
        code: 'PRESET_NOT_FOUND'
      });
    }

    // 批量应用预设
    const results = await Promise.all(
      photoIds.map(async (photoId: string) => {
        try {
          // 获取照片
          const photo = await db.query.photos.findFirst({
            where: (photos, { eq }) => eq(photos.id, photoId)
          });

          if (!photo) {
            return {
              photoId,
              success: false,
              error: 'Photo not found'
            };
          }

          // 应用预设（这里应该调用图像处理服务）
          const editedPhotoUri = await applyPresetToPhoto(photo, preset);

          // 记录编辑历史
          if (userId) {
            await db.insert(editHistory).values({
              photoId,
              userId,
              presetId,
              action: 'apply_preset',
              timestamp: new Date()
            });
          }

          return {
            photoId,
            success: true,
            editedUri: editedPhotoUri
          };
        } catch (error) {
          console.error(`Error processing photo ${photoId}:`, error);
          return {
            photoId,
            success: false,
            error: 'Failed to process photo'
          };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;

    res.json({
      success: true,
      processedCount: successCount,
      totalCount: photoIds.length,
      results
    });
  } catch (error) {
    console.error('Batch preset application error:', error);
    res.status(500).json({
      error: 'Batch processing failed',
      code: 'BATCH_ERROR'
    });
  }
});

/**
 * 接口2：批量导出
 * POST /api/batch/export
 * 
 * 请求体：
 * - photoIds: 照片ID数组
 * - format: 导出格式 ('jpeg' | 'png' | 'heif')
 * - quality: 质量 (0-100)
 * - resolution: 分辨率 ('original' | '1080p' | '720p' | '480p')
 * 
 * 返回：
 * - exportedCount: 导出的照片数量
 * - exports: 导出结果数组
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const {
      photoIds,
      format = 'jpeg',
      quality = 90,
      resolution = 'original'
    } = req.body;

    // 验证输入
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({
        error: 'photoIds must be a non-empty array',
        code: 'INVALID_INPUT'
      });
    }

    // 验证格式
    const validFormats = ['jpeg', 'png', 'heif'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        error: `Invalid format. Must be one of: ${validFormats.join(', ')}`,
        code: 'INVALID_FORMAT'
      });
    }

    // 验证质量
    if (quality < 0 || quality > 100) {
      return res.status(400).json({
        error: 'Quality must be between 0 and 100',
        code: 'INVALID_QUALITY'
      });
    }

    // 批量导出
    const exports = await Promise.all(
      photoIds.map(async (photoId: string) => {
        try {
          // 获取照片
          const photo = await db.query.photos.findFirst({
            where: (photos, { eq }) => eq(photos.id, photoId)
          });

          if (!photo) {
            return {
              photoId,
              success: false,
              error: 'Photo not found'
            };
          }

          // 导出照片（调用图像处理服务）
          const exportedUri = await exportPhoto(photo, {
            format,
            quality,
            resolution
          });

          return {
            photoId,
            success: true,
            exportedUri,
            format,
            quality,
            resolution
          };
        } catch (error) {
          console.error(`Error exporting photo ${photoId}:`, error);
          return {
            photoId,
            success: false,
            error: 'Failed to export photo'
          };
        }
      })
    );

    const successCount = exports.filter((e) => e.success).length;

    res.json({
      success: true,
      exportedCount: successCount,
      totalCount: photoIds.length,
      exports
    });
  } catch (error) {
    console.error('Batch export error:', error);
    res.status(500).json({
      error: 'Batch export failed',
      code: 'EXPORT_ERROR'
    });
  }
});

/**
 * 接口3：批量删除
 * POST /api/batch/delete
 * 
 * 请求体：
 * - photoIds: 照片ID数组
 * - userId: 用户ID（用于权限验证）
 * 
 * 返回：
 * - deletedCount: 删除的照片数量
 */
router.post('/delete', async (req: Request, res: Response) => {
  try {
    const { photoIds, userId } = req.body;

    // 验证输入
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return res.status(400).json({
        error: 'photoIds must be a non-empty array',
        code: 'INVALID_INPUT'
      });
    }

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required',
        code: 'MISSING_USER_ID'
      });
    }

    // 验证权限（确保用户只能删除自己的照片）
    const userPhotos = await db.query.photos.findMany({
      where: (photos, { eq, and }) =>
        and(
          eq(photos.userId, userId),
          inArray(photos.id, photoIds)
        )
    });

    if (userPhotos.length !== photoIds.length) {
      return res.status(403).json({
        error: 'Permission denied. Some photos do not belong to this user.',
        code: 'PERMISSION_DENIED'
      });
    }

    // 删除照片
    await db.delete(photos).where(inArray(photos.id, photoIds));

    res.json({
      success: true,
      deletedCount: photoIds.length
    });
  } catch (error) {
    console.error('Batch delete error:', error);
    res.status(500).json({
      error: 'Batch delete failed',
      code: 'DELETE_ERROR'
    });
  }
});

/**
 * 接口4：获取批量处理历史
 * GET /api/batch/history
 * 
 * 查询参数：
 * - userId: 用户ID
 * - limit: 返回记录数（默认20）
 * - offset: 偏移量（默认0）
 * 
 * 返回：
 * - history: 编辑历史数组
 * - total: 总记录数
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const { userId, limit = 20, offset = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required',
        code: 'MISSING_USER_ID'
      });
    }

    // 获取编辑历史
    const history = await db.query.editHistory.findMany({
      where: (editHistory, { eq }) => eq(editHistory.userId, userId as string),
      limit: Math.min(parseInt(limit as string) || 20, 100),
      offset: parseInt(offset as string) || 0,
      orderBy: (editHistory, { desc }) => desc(editHistory.timestamp)
    });

    // 获取总数
    const total = await db.query.editHistory.findMany({
      where: (editHistory, { eq }) => eq(editHistory.userId, userId as string)
    });

    res.json({
      success: true,
      history,
      total: total.length,
      limit: Math.min(parseInt(limit as string) || 20, 100),
      offset: parseInt(offset as string) || 0
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      error: 'Failed to get history',
      code: 'HISTORY_ERROR'
    });
  }
});

/**
 * 辅助函数：应用预设到照片
 */
async function applyPresetToPhoto(photo: any, preset: any): Promise<string> {
  // 这里应该调用图像处理服务
  // 例如：调用后端的图像处理API或调用第三方服务
  
  // 模拟实现
  return new Promise((resolve) => {
    setTimeout(() => {
      // 返回处理后的照片URI
      resolve(`${photo.uri}?preset=${preset.id}`);
    }, 1000);
  });
}

/**
 * 辅助函数：导出照片
 */
async function exportPhoto(
  photo: any,
  options: {
    format: string;
    quality: number;
    resolution: string;
  }
): Promise<string> {
  // 这里应该调用图像处理服务进行导出
  // 例如：使用FFmpeg或ImageMagick进行格式转换和压缩
  
  // 模拟实现
  return new Promise((resolve) => {
    setTimeout(() => {
      const ext = options.format === 'jpeg' ? 'jpg' : options.format;
      resolve(`${photo.uri}.${ext}?quality=${options.quality}&resolution=${options.resolution}`);
    }, 500);
  });
}

export default router;
