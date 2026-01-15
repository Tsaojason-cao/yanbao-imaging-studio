import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Cpu, Fingerprint, Layers } from "lucide-react";

export default function WhitePaper() {
  return (
    <section className="py-24 bg-black/30 relative overflow-hidden">
      {/* Background Abstract Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Title & Intro */}
          <div className="lg:w-1/3 sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
                <BookOpen className="w-3 h-3" />
                <span>Technical White Paper</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                不仅仅是算法，<br />
                更是<span className="text-pink-500">爱的数字化</span>
              </h2>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Yanbao AI 的核心不仅仅在于图像处理，而在于对“美”的个性化理解。我们构建了一套独特的双层架构，将客观的光影参数与主观的情感偏好完美融合。
              </p>
              
              <Button variant="outline" className="group border-white/20 hover:bg-white/5 text-white">
                阅读完整白皮书
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Core Technologies */}
          <div className="lg:w-2/3 grid gap-8">
            {[
              {
                icon: <Fingerprint className="w-8 h-8 text-primary" />,
                title: "情感指纹识别 (Emotional Fingerprint)",
                desc: "不同于传统的面部识别，我们的算法会学习用户的审美偏好。通过分析用户对不同影调的停留时间和使用频率，构建出独一无二的“情感指纹”，自动推荐最符合当下的滤镜组合。"
              },
              {
                icon: <Layers className="w-8 h-8 text-pink-500" />,
                title: "双层渲染引擎 (Dual-Layer Rendering)",
                desc: "底层采用基于物理的渲染 (PBR) 还原真实光影，顶层叠加风格化滤镜 (Stylized Filter)。这种分离式架构确保了照片既有胶片的质感，又保留了数码的清晰度，完美复刻大师级影调。"
              },
              {
                icon: <Cpu className="w-8 h-8 text-purple-500" />,
                title: "本地化隐私计算 (On-Device AI)",
                desc: "所有的面部特征分析与美颜计算均在本地完成，无需上传云端。我们深知每一张照片都是私密的记忆，Yanbao AI 承诺永远守护这份安全感。"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/[0.07]">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="shrink-0 p-4 bg-black/20 rounded-2xl h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
