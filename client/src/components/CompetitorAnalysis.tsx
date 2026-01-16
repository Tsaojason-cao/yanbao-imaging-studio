import { motion } from "framer-motion";
import { Check, Zap, Heart, Shield, Sparkles, Crown } from "lucide-react";

const advantages = [
  {
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    title: "情感算法",
    desc: "不仅仅是滤镜，更是基于「雁宝记忆」的审美沉淀。每一款影调都蕴含着对生活的热爱与感悟，让照片有了温度。",
    highlight: "独家首创"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    title: "交互美学",
    desc: "专属库洛米 UI 与头像快门，打破工具的冰冷感。每一次点击都是一次心动的交互，赋予摄影满满的仪式感。",
    highlight: "极致体验"
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "技术守护",
    desc: "Jason Tsao 跨越 22 年与 2200 公里的技术守护。用最硬核的代码，守护最柔软的梦，只为那个不爱葱姜蒜的小女孩。",
    highlight: "深情承诺"
  },
  {
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    title: "大师复刻",
    desc: "31 位摄影大师参数全收录。从森山大道的粗颗粒到蜷川实花的绚烂色彩，一键复刻经典，让你的照片瞬间拥有大师灵魂。",
    highlight: "专业级"
  },
  {
    icon: <Zap className="w-6 h-6 text-green-500" />,
    title: "极致性能",
    desc: "本地化 AI 引擎，毫秒级响应。无需上传云端，保护隐私的同时，享受丝滑流畅的修图体验。",
    highlight: "快如闪电"
  },
  {
    icon: <Check className="w-6 h-6 text-cyan-500" />,
    title: "持续进化",
    desc: "不仅仅是一个 App，更是一个不断成长的生命体。随着你们的故事继续，Yanbao AI 也将不断解锁新的惊喜。",
    highlight: "未来可期"
  }
];

export default function CompetitorAnalysis() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Yanbao AI 综合PK：
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                私人定制的极致巅峰
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              我们不与平庸为伍，只为极致而生。在这里，你将体验到前所未有的影像魅力。
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-white/10 to-transparent w-16 h-16 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-black/50 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30">
                  {item.highlight}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
