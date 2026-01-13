import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置multer用于文件上传
const upload = multer({
  dest: path.join(__dirname, '../../tmp/uploads'),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB限制
});

// 配置API密钥
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || '';
const LAMA_SERVICE_URL = process.env.LAMA_SERVICE_URL || 'http://localhost:8000';
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || '';

const router: Router = express.Router();

/**
 * 接口1：使用LAMA本地模型移除对象
 * POST /api/ai/removal/remove-lama
 * 
 * 请求体：
 * - image: 原始图片文件
 * - mask: 掩码文件（白色区域为要移除的部分）
 * 
 * 返回：
 * - result: 处理后的图片base64
 * - processingTime: 处理时间（毫秒）
 */
router.post(
  '/remove-lama',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mask', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      const imageFile = files?.image?.[0];
      const maskFile = files?.mask?.[0];

      if (!imageFile || !maskFile) {
        return res.status(400).json({
          error: 'Image and mask files are required',
          code: 'MISSING_FILES'
        });
      }

      const startTime = Date.now();

      // 调用LAMA服务
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imageFile.path));
      formData.append('mask', fs.createReadStream(maskFile.path));

      const response = await axios.post(
        `${LAMA_SERVICE_URL}/api/v1/inpaint`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 60000
        }
      );

      const processingTime = Date.now() - startTime;

      // 清理临时文件
      fs.unlinkSync(imageFile.path);
      fs.unlinkSync(maskFile.path);

      res.json({
        success: true,
        result: response.data.image,
        processingTime,
        engine: 'lama'
      });
    } catch (error) {
      console.error('LAMA removal error:', error);

      // 清理临时文件
      if (req.files) {
        const files = req.files as { [key: string]: Express.Multer.File[] };
        Object.values(files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            try {
              fs.unlinkSync(file.path);
            } catch (e) {
              // 忽略删除错误
            }
          });
        });
      }

      res.status(500).json({
        error: 'Failed to remove object with LAMA',
        code: 'LAMA_ERROR'
      });
    }
  }
);

/**
 * 接口2：使用Remove.bg API移除背景
 * POST /api/ai/removal/remove-removebg
 * 
 * 请求体：
 * - image: 图片文件
 * 
 * 返回：
 * - result: 处理后的图片（PNG格式，透明背景）
 */
router.post(
  '/remove-removebg',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!REMOVE_BG_API_KEY) {
        return res.status(400).json({
          error: 'Remove.bg API key not configured',
          code: 'API_KEY_MISSING'
        });
      }

      const imageFile = req.file;
      if (!imageFile) {
        return res.status(400).json({
          error: 'Image file is required',
          code: 'MISSING_FILE'
        });
      }

      const startTime = Date.now();

      const formData = new FormData();
      formData.append('image_file', fs.createReadStream(imageFile.path));

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'X-API-Key': REMOVE_BG_API_KEY
          },
          responseType: 'arraybuffer',
          timeout: 30000
        }
      );

      const processingTime = Date.now() - startTime;

      // 清理临时文件
      fs.unlinkSync(imageFile.path);

      // 转换为base64
      const base64Result = Buffer.from(response.data).toString('base64');

      res.json({
        success: true,
        result: `data:image/png;base64,${base64Result}`,
        processingTime,
        engine: 'removebg'
      });
    } catch (error) {
      console.error('Remove.bg error:', error);

      // 清理临时文件
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          // 忽略删除错误
        }
      }

      res.status(500).json({
        error: 'Failed to remove background',
        code: 'REMOVEBG_ERROR'
      });
    }
  }
);

/**
 * 接口3：使用Stable Diffusion进行智能修复
 * POST /api/ai/removal/remove-inpaint
 * 
 * 请求体：
 * - image: 原始图片（base64）
 * - mask: 掩码（base64）
 * - prompt: 修复提示词（可选）
 * 
 * 返回：
 * - result: 修复后的图片
 */
router.post('/remove-inpaint', async (req: Request, res: Response) => {
  try {
    if (!STABILITY_API_KEY) {
      return res.status(400).json({
        error: 'Stability API key not configured',
        code: 'API_KEY_MISSING'
      });
    }

    const { imageBase64, maskBase64, prompt = 'Remove the masked area naturally' } = req.body;

    if (!imageBase64 || !maskBase64) {
      return res.status(400).json({
        error: 'Image and mask base64 data are required',
        code: 'MISSING_DATA'
      });
    }

    const startTime = Date.now();

    const response = await axios.post(
      'https://api.stability.ai/v1/generate/stable-diffusion-xl-1024-v1-0',
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        init_image: imageBase64,
        mask: maskBase64,
        cfg_scale: 7,
        steps: 30,
        seed: 0,
        samples: 1
      },
      {
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const processingTime = Date.now() - startTime;

    if (response.data.artifacts && response.data.artifacts.length > 0) {
      res.json({
        success: true,
        result: `data:image/png;base64,${response.data.artifacts[0].base64}`,
        processingTime,
        engine: 'stable-diffusion'
      });
    } else {
      res.status(500).json({
        error: 'No result from Stable Diffusion',
        code: 'NO_RESULT'
      });
    }
  } catch (error) {
    console.error('Stable Diffusion inpaint error:', error);
    res.status(500).json({
      error: 'Failed to inpaint image',
      code: 'INPAINT_ERROR'
    });
  }
});

/**
 * 接口4：智能选择引擎
 * POST /api/ai/removal/remove-smart
 * 
 * 自动选择最合适的引擎：
 * - 简单场景：使用LAMA（快速）
 * - 复杂场景：使用Remove.bg或Stable Diffusion（质量优先）
 * 
 * 请求体：
 * - image: 图片文件
 * - mask: 掩码文件（可选）
 * - engine: 指定引擎 ('lama' | 'removebg' | 'stable-diffusion' | 'auto')
 * - quality: 质量优先级 ('speed' | 'balanced' | 'quality')
 */
router.post(
  '/remove-smart',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mask', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [key: string]: Express.Multer.File[] };
      const { engine = 'auto', quality = 'balanced' } = req.body;
      const imageFile = files?.image?.[0];

      if (!imageFile) {
        return res.status(400).json({
          error: 'Image file is required',
          code: 'MISSING_FILE'
        });
      }

      let selectedEngine = engine;

      // 自动选择引擎
      if (engine === 'auto') {
        if (quality === 'speed') {
          selectedEngine = 'lama';
        } else if (quality === 'balanced') {
          selectedEngine = 'removebg';
        } else {
          selectedEngine = 'stable-diffusion';
        }
      }

      // 根据选择的引擎调用相应的处理
      if (selectedEngine === 'lama') {
        const maskFile = files?.mask?.[0];
        if (!maskFile) {
          return res.status(400).json({
            error: 'Mask file is required for LAMA engine',
            code: 'MISSING_MASK'
          });
        }

        // 调用LAMA处理
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imageFile.path));
        formData.append('mask', fs.createReadStream(maskFile.path));

        const response = await axios.post(
          `${LAMA_SERVICE_URL}/api/v1/inpaint`,
          formData,
          {
            headers: formData.getHeaders(),
            timeout: 60000
          }
        );

        fs.unlinkSync(imageFile.path);
        fs.unlinkSync(maskFile.path);

        return res.json({
          success: true,
          result: response.data.image,
          engine: 'lama'
        });
      } else if (selectedEngine === 'removebg') {
        // 调用Remove.bg处理
        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(imageFile.path));

        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'X-API-Key': REMOVE_BG_API_KEY
            },
            responseType: 'arraybuffer'
          }
        );

        fs.unlinkSync(imageFile.path);

        const base64Result = Buffer.from(response.data).toString('base64');
        return res.json({
          success: true,
          result: `data:image/png;base64,${base64Result}`,
          engine: 'removebg'
        });
      }

      res.status(400).json({
        error: 'Invalid engine selection',
        code: 'INVALID_ENGINE'
      });
    } catch (error) {
      console.error('Smart removal error:', error);

      // 清理临时文件
      if (req.files) {
        const files = req.files as { [key: string]: Express.Multer.File[] };
        Object.values(files).forEach((fileArray) => {
          fileArray.forEach((file) => {
            try {
              fs.unlinkSync(file.path);
            } catch (e) {
              // 忽略删除错误
            }
          });
        });
      }

      res.status(500).json({
        error: 'Smart removal failed',
        code: 'SMART_REMOVAL_ERROR'
      });
    }
  }
);

/**
 * 健康检查接口
 * GET /api/ai/removal/health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const status = {
      lama: 'unknown',
      removebg: 'unknown',
      stable_diffusion: 'unknown'
    };

    // 检查LAMA服务
    try {
      await axios.get(`${LAMA_SERVICE_URL}/api/v1/health`, { timeout: 5000 });
      status.lama = 'ok';
    } catch {
      status.lama = 'unavailable';
    }

    // 检查Remove.bg API
    if (REMOVE_BG_API_KEY) {
      status.removebg = 'configured';
    } else {
      status.removebg = 'not-configured';
    }

    // 检查Stability API
    if (STABILITY_API_KEY) {
      status.stable_diffusion = 'configured';
    } else {
      status.stable_diffusion = 'not-configured';
    }

    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      code: 'HEALTH_CHECK_ERROR'
    });
  }
});

export default router;
