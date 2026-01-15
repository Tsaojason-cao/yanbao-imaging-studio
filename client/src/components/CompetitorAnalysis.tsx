import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Swords, Zap, Heart, Shield, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

// 竞品数据配置
const competitors = [
  {
    id: 'pixel_cake',
    name: '像素蛋糕',
    color: '#FFD700', // 金色代表昂贵/专业
    icon: <Palette className="w-6 h-6" />,
    slogan: "昂贵的工业修图",
    features: [
      {
        title: "付费模式",
        opponent: "昂贵订阅制 / 按张收费",
        yanbao: "完全免费 / 为爱发电",
        icon: <Shield className="w-4 h-4" />
      },
      {
        title: "审美风格",
        opponent: "标准化影楼风，千人一面",
        yanbao: "31位大师影调，独家定制",
        icon: <Heart className="w-4 h-4" />
      },
      {
        title: "处理效率",
        opponent: "需上传云端，等待排队",
        yanbao: "本地实时计算，毫秒级响应",
        icon: <Zap className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'meitu',
    name: '美图秀秀',
    color: '#FF69B4', // 粉色代表大众
    icon: <Palette className="w-6 h-6" />,
    slogan: "臃肿的工具集合",
    features: [
      {
        title: "操作体验",
        opponent: "功能繁杂，广告弹窗多",
        yanbao: "极简设计，纯净无广",
        icon: <Shield className="w-4 h-4" />
      },
      {
        title: "成片效果",
        opponent: "网红滤镜，缺乏质感",
        yanbao: "电影级色彩，高级耐看",
        icon: <Heart className="w-4 h-4" />
      },
      {
        title: "智能程度",
        opponent: "手动参数多，调节复杂",
        yanbao: "AI 一键成片，自动优化",
        icon: <Zap className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'beauty_cam',
    name: '美颜相机',
    color: '#FF1493', // 深粉代表美颜
    icon: <Palette className="w-6 h-6" />,
    slogan: "过度的磨皮滤镜",
    features: [
      {
        title: "皮肤质感",
        opponent: "过度磨皮，丢失细节",
        yanbao: "保留毛孔纹理，真实自然",
        icon: <Heart className="w-4 h-4" />
      },
      {
        title: "五官调整",
        opponent: "蛇精脸，比例失真",
        yanbao: "微调骨相，保留个人特色",
        icon: <Palette className="w-4 h-4" />
      },
      {
        title: "隐私安全",
        opponent: "云端处理，有泄露风险",
        yanbao: "100% 本地运行，绝对安全",
        icon: <Shield className="w-4 h-4" />
      }
    ]
  }
];

export default function CompetitorAnalysis() {
  const [activeCompetitor, setActiveCompetitor] = useState(competitors[0]);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              不惧对比，实力碾压
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              在拥挤的修图赛道，我们选择了一条少有人走的路：<br/>
              <span className="text-white font-semibold">极致纯净，大师审美，情感温度。</span>
            </p>
          </motion.div>
        </div>

        {/* 顶部切换栏 */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {competitors.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActiveCompetitor(comp)}
              className={cn(
                "px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 flex items-center gap-2 border",
                activeCompetitor.id === comp.id
                  ? "bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              {comp.name}
            </button>
          ))}
        </div>

        {/* PK 擂台 */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCompetitor.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* VS 标志 */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-full bg-black border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <Swords className="w-10 h-10 text-white" />
                <span className="text-xs font-bold text-purple-400 mt-1">VS</span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-0">
                {/* 左侧：Yanbao AI */}
                <Card className="p-8 md:pr-16 bg-gradient-to-br from-purple-900/40 to-black border-purple-500/30 relative overflow-hidden md:rounded-r-none md:border-r-0 h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Yanbao AI</h3>
                      <p className="text-purple-300 text-sm">大师级私人影像工作室</p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    {activeCompetitor.features.map((feature, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center gap-2 text-purple-300 text-sm mb-1 font-medium">
                          {feature.icon}
                          {feature.title}
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                          <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-white font-medium">{feature.yanbao}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 右侧：竞品 */}
                <Card className="p-8 md:pl-16 bg-gradient-to-bl from-gray-900/40 to-black border-white/10 relative overflow-hidden md:rounded-l-none h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-20" />
                  
                  <div className="flex items-center gap-4 mb-8 justify-end text-right">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-200">{activeCompetitor.name}</h3>
                      <p className="text-gray-500 text-sm">{activeCompetitor.slogan}</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: activeCompetitor.color }}
                    >
                      <span className="text-black font-bold text-xl">{activeCompetitor.name[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    {activeCompetitor.features.map((feature, idx) => (
                      <div key={idx} className="group text-right">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 font-medium justify-end">
                          {feature.title}
                          {feature.icon}
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors justify-end">
                          <span className="text-gray-400">{feature.opponent}</span>
                          <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
