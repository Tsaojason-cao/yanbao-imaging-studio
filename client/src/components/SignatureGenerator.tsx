import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Download, PenTool, Sparkles } from "lucide-react";

export default function SignatureGenerator() {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 引入 Google Fonts 中的手写字体
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const generateSignature = () => {
    if (!text || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = 800;
    canvas.height = 400;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景（透明，但为了预览效果，我们在组件中会给 img 加背景）
    // 这里只绘制文字

    // 绘制发光效果
    ctx.shadowColor = '#A33BFF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FF69B4';
    ctx.font = '120px "Ma Shan Zheng", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 绘制多次以增强发光感
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // 生成图片 URL
    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  const downloadSignature = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `yanbao-signature-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-black/50">
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-500/10 mb-6">
            <PenTool className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-purple-300 font-medium">专属定制</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            霓虹签名生成器
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            输入你的名字，生成专属的赛博朋克风格电子签名。
            <br />
            <span className="text-sm opacity-70">支持中文/英文，透明背景，适用于社交媒体或水印。</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 输入区 */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10"
          >
            <div className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="输入你的名字..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-16 text-xl bg-black/20 border-white/10 focus:border-purple-500 text-center text-white placeholder:text-white/20"
                  maxLength={10}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
                  {text.length}/10
                </div>
              </div>

              <Button 
                size="lg"
                onClick={generateSignature}
                disabled={!text}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                立即生成
              </Button>
            </div>
          </motion.div>

          {/* 预览区 */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="relative group"
          >
            <div className="aspect-video bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden relative">
              {/* 网格背景 */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Signature Preview" 
                  className="max-w-[90%] max-h-[80%] object-contain relative z-10 drop-shadow-[0_0_15px_rgba(163,59,255,0.5)]" 
                />
              ) : (
                <div className="text-center text-white/20">
                  <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>预览区域</p>
                </div>
              )}
            </div>

            {previewUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2"
              >
                <Button 
                  onClick={downloadSignature}
                  className="rounded-full bg-white text-black hover:bg-gray-200 shadow-xl px-8"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载签名
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 隐藏的 Canvas 用于绘图 */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
