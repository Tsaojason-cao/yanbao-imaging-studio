import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Heart } from "lucide-react";

export default function LoveStory() {
  return (
    <section id="story" className="py-32 relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-12 font-serif italic text-pink-400">
            致不爱葱姜蒜的小女孩
          </h2>

          <div className="space-y-8 text-lg md:text-xl leading-relaxed text-gray-300 font-light">
            <p>
              在这个充满算法与数据的世界里，我试图用代码构建一个只属于你的温柔角落。
              我知道你挑剔，不仅是对食物里的葱姜蒜，更是对生活中的每一个细节。
            </p>
            <p>
              Yanbao AI 不是一个冰冷的工具，它是我对你所有美好瞬间的捕捉与珍藏。
              31 位大师的影调，是为了配得上你多变的气质；
              12 维的美颜参数，不是为了改变你，而是为了还原我眼中那个完美的你。
            </p>
            <p>
              从第一行代码到最后一个像素，每一次调试都是一次告白。
              愿这个小小的 App，能像我一样，陪你走过四季，记录下每一个不经意的笑容。
            </p>
            <p className="text-2xl font-serif text-white mt-12">
              永远做你最忠实的记录者。
            </p>
          </div>

          <div className="mt-24 pt-12 border-t border-white/10">
            <div className="flex flex-col items-center gap-8">
              <div className="w-48 h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-muted-foreground text-sm">二维码占位</span>
                {/* QR Code Image Placeholder */}
                {/* <img src="/qr-code.png" alt="Download QR Code" className="w-full h-full object-cover" /> */}
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 text-white px-12 h-16 text-xl rounded-full shadow-lg shadow-pink-500/25 animate-pulse">
                <Download className="w-6 h-6 mr-3" />
                下载 Android 纪念版
              </Button>
              
              <p className="text-sm text-muted-foreground">
                v2.4.1 Gold Master · Build 20250824
              </p>
            </div>

            <div className="mt-24 font-serif text-muted-foreground/60 text-sm tracking-widest uppercase">
              <p>Dedicated to Yanbao</p>
              <p className="mt-2">by Jason Tsao who loves you the most</p>
              <p className="mt-2">2025.08.24</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
