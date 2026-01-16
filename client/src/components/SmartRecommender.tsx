import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Sparkles, Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

// 场景-大师映射逻辑
const SCENE_MAPPING = {
  portrait: ['肖全', '林海音', '陈漫'],
  landscape: ['Ansel Adams', '范毅舜'],
  nature: ['孙郡', 'Ansel Adams'],
  urban: ['阮义忠', '肖全'],
  food: ['陈漫', '孙郡'],
  object: ['陈漫', '范毅舜']
};

// MobileNet 类别关键词映射
const KEYWORD_MAPPING: Record<string, string> = {
  'person': 'portrait',
  'man': 'portrait',
  'woman': 'portrait',
  'girl': 'portrait',
  'boy': 'portrait',
  'face': 'portrait',
  'hair': 'portrait',
  'seashore': 'landscape',
  'lakeside': 'landscape',
  'mountain': 'landscape',
  'valley': 'landscape',
  'volcano': 'landscape',
  'flower': 'nature',
  'tree': 'nature',
  'plant': 'nature',
  'garden': 'nature',
  'street': 'urban',
  'building': 'urban',
  'city': 'urban',
  'bridge': 'urban',
  'food': 'food',
  'fruit': 'food',
  'vegetable': 'food',
  'dish': 'food',
  'plate': 'food',
  'cat': 'nature',
  'dog': 'nature',
  'bird': 'nature'
};

export default function SmartRecommender({ onRecommend }: { onRecommend: (master: string) => void }) {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{ scene: string; master: string; confidence: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 加载模型
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setIsModelLoading(false);
      }
    }
    loadModel();
  }, []);

  // 处理图片上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResult(null);
    
    // 稍微延迟一下等待图片加载，然后开始分析
    setTimeout(() => analyzeImage(url), 100);
  };

  // 分析图片
  const analyzeImage = async (url: string) => {
    if (!model || !imageRef.current) return;

    setIsAnalyzing(true);
    try {
      // 确保图片已加载
      if (!imageRef.current.complete) {
        await new Promise((resolve) => {
          if (imageRef.current) imageRef.current.onload = resolve;
        });
      }

      const predictions = await model.classify(imageRef.current);
      console.log('Predictions:', predictions);

      if (predictions.length > 0) {
        // 获取最高置信度的结果
        const topPrediction = predictions[0];
        const keywords = topPrediction.className.toLowerCase().split(', ');
        
        // 匹配场景
        let matchedScene = 'object'; // 默认场景
        for (const keyword of keywords) {
          for (const [key, scene] of Object.entries(KEYWORD_MAPPING)) {
            if (keyword.includes(key)) {
              matchedScene = scene;
              break;
            }
          }
          if (matchedScene !== 'object') break;
        }

        // 推荐大师
        const masters = SCENE_MAPPING[matchedScene as keyof typeof SCENE_MAPPING];
        const recommendedMaster = masters[Math.floor(Math.random() * masters.length)];

        setResult({
          scene: matchedScene,
          master: recommendedMaster,
          confidence: topPrediction.probability
        });

        // 触发回调
        onRecommend(recommendedMaster);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-white">
        <Sparkles className="w-5 h-5 text-pink-500" />
        <h3 className="font-bold">AI 智能选片 (Smart Match)</h3>
      </div>

      <AnimatePresence mode="wait">
        {!previewUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              {isModelLoading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-300 font-medium">
              {isModelLoading ? '正在加载 AI 引擎...' : '上传照片，自动推荐大师影调'}
            </p>
            <p className="text-xs text-gray-500 mt-1">支持 JPG, PNG, WebP</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden aspect-video mb-4 bg-black/50">
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">AI 正在分析画面内容...</p>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-500 rounded-lg shrink-0">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-300 font-medium mb-1">
                      识别场景: {result.scene.toUpperCase()} ({(result.confidence * 100).toFixed(0)}%)
                    </p>
                    <h4 className="text-white font-bold text-lg">
                      推荐大师：{result.master}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      根据画面构图与光影，为您匹配了最适合的艺术风格。
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
