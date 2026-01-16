import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart, Flower } from "lucide-react";
import { useState, useEffect } from "react";

// 粒子组件
const Particle = ({ x, y, type, onComplete }: { x: number; y: number; type: 'heart' | 'flower'; onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 0.5, rotate: Math.random() * 360 }}
      animate={{ 
        y: y + 200 + Math.random() * 100, 
        x: x + (Math.random() - 0.5) * 100,
        opacity: 0,
        rotate: Math.random() * 720 
      }}
      transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-50"
    >
      {type === 'heart' ? (
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
      ) : (
        <Flower className="w-6 h-6 text-pink-300 fill-pink-200" />
      )}
    </motion.div>
  );
};

export default function LoveStory() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: 'heart' | 'flower' }[]>([]);

  const addParticle = (e: React.MouseEvent | MouseEvent) => {
    const id = Date.now() + Math.random();
    const type = Math.random() > 0.5 ? 'heart' : 'flower';
    setParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY, type }]);
  };

  const removeParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  // 全局点击监听（仅在组件可见时）
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 检查点击是否在 LoveStory 区域内
      const section = document.getElementById('story');
      if (section && section.contains(e.target as Node)) {
        addParticle(e);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <section id="story" className="py-32 relative overflow-hidden cursor-pointer">
      {/* 粒子容器 */}
      <AnimatePresence>
        {particles.map(p => (
          <Particle 
            key={p.id} 
            x={p.x} 
            y={p.y} 
            type={p.type} 
            onComplete={() => removeParticle(p.id)} 
          />
        ))}
      </AnimatePresence>

      {/* Background Heart Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: -100,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            <Heart size={Math.random() * 50 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block p-4 rounded-full bg-pink-500/10 mb-6"
            >
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                深藏功名，极简外露
              </span>
              <br />
              <span className="text-white mt-2 block">
                Sanmu AI 品牌故事
              </span>
            </h2>
            <p className="text-sm text-emerald-400/60 animate-pulse mb-8">
              ( 点击 Logo 10 次解锁专业开发者模式 )
            </p>
          </div>

          <div className="prose prose-invert prose-lg mx-auto text-left space-y-8 bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl select-none">
            <p className="text-xl text-white/90 leading-relaxed font-medium">
              Sanmu AI 诞生于对卓越的追求，成长于对细节的执着。
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              我们相信，真正的专业工具不需要繁复的界面，也不需要给人留下深刻印象。它应该像一把精工打磨的工艺刀，静静躺在那里，等待懂它的人拿起。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              从 31 位大师的影调指纹，到 29 维精密参数的隐藏调整，每一个功能都经过了数百次打磨。我们不追求“看起来很厉害”，只在乎“用起来很顺手”。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              极简的界面下，隐藏着复杂的算法。森林深绿的配色，传递着沉稳与专业。每一次快门，都是对光影的致敬；每一次调整，都是对美学的探索。
            </p>

            <p className="text-xl text-white/90 leading-relaxed font-medium border-l-4 border-emerald-500 pl-6 my-8 bg-emerald-500/5 py-4 rounded-r-lg">
              深藏功名，极简外露。这不仅是设计哲学，更是 Sanmu AI 的品牌精神。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              我们不制造噪音，只交付价值。当你打开 Sanmu AI，你会发现，最好的工具，就是让你忘记它的存在。
            </p>
          </div>

          <div className="mt-24 pt-12 border-t border-white/10">
            <div className="flex flex-col items-center gap-8">
              <div className="w-48 h-48 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-primary/20 relative overflow-hidden group p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img src="/images/download-qr.png" alt="Download QR Code" className="w-full h-full object-contain relative z-10" />
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FF69B4] to-[#A33BFF] hover:from-[#FF1493] hover:to-[#9400D3] text-white px-12 h-16 text-xl rounded-full shadow-lg shadow-pink-500/25 animate-pulse transition-all hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发背景特效
                  const link = document.createElement('a');
                  link.href = '/sanmu-ai-release.apk';
                  link.download = 'sanmu-ai-release.apk';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="w-6 h-6 mr-3" />
                下载 Android 纪念版
              </Button>
              
              <p className="text-sm text-muted-foreground">
                v2.4.1 Gold Master · Build 20250824
              </p>
            </div>


          </div>
        </motion.div>
      </div>
    </section>
  );
}
