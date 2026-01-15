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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                因为一个不爱葱姜蒜的小女孩，
              </span>
              <br />
              <span className="text-white mt-2 block">
                有了 yanbao AI
              </span>
            </h2>
          </div>

          <div className="prose prose-invert prose-lg mx-auto text-left space-y-8 bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <p className="text-xl text-white/90 leading-relaxed font-medium">
              2025年8月24日，一个原本打算“玩玩”的开场，却成了我余生失控的伏笔。
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              那时的我，是1977年的“老登”，她是1999年的雁宝；我在北京，她在杭州；我是台湾人，她来自广东。身份、年龄、地域，每一条鸿沟都在催我离开。我甚至决绝地拉黑、删除过，试图逃回理智的阵地。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              但命运的引力终究胜过理智。我忍不住偷看她的直播，从朋友圈、粉丝团的缝隙里，拼凑出一个私底下真实的、鲜活的她。于是，我有了那个记录她点滴的小本本。我发现，吸引我的不再是那个虚拟的ID，而是那个叫“雁宝”的灵魂。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              在她面前，我找回了消失已久的自由。那些曾被嫌弃的“动手能力”，在她眼里竟是闪闪发光的才华。我亲手缝制包包，没日没夜地为她钩织披肩。她笑那是“笨拙的礼物”，却珍藏至今。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              我从未想过，这个20几岁的女孩，能送我一箱完全戳中心思的生日礼物，其中包括连家人都不知道的“笔记本”情结。12月24日的蛋糕，跨年夜飞越千里的相拥，太庙的红墙、环球影城的欢笑、甚至选美瞳时的手足无措……她带一个70后的男人，重新过了一次少年生活。
            </p>

            <p className="text-xl text-white/90 leading-relaxed font-medium border-l-4 border-pink-500 pl-6 my-8 bg-pink-500/5 py-4 rounded-r-lg">
              在颐和园，看到她对摄影黑科技的向往，再看看自己笨拙的拍照技术，我萌生了一个念头。我要做一个能一直陪伴她的东西。
            </p>

            <p className="text-muted-foreground leading-relaxed">
              yanbao AI 诞生了。这是我人生中又一个“第一次”，送给我那个不爱葱姜蒜的小公主。它不只是一个工具，是我跨越2200公里、跨越22年岁月，想给她的最长情的守护。
            </p>
          </div>

          <div className="mt-24 pt-12 border-t border-white/10">
            <div className="flex flex-col items-center gap-8">
              <div className="w-48 h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-muted-foreground text-sm">二维码占位</span>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 h-16 text-xl rounded-full shadow-lg shadow-pink-500/25 animate-pulse transition-all hover:scale-105"
                onClick={() => window.open('#download', '_blank')}
              >
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
