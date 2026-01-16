import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Swords, Zap, Heart, Shield, Palette, Crown, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// 竞品数据配置
const competitors = [
  {
    id: 'pixel_cake',
    name: '像素蛋糕',
    color: '#FFD700', // 金色代表昂贵/专业
    icon: <Palette className="w-6 h-6" />,
    slogan: "昂贵的工业流水线",
    features: [
      {
        title: "核心算法",
        opponent: "通用商业算法，冷冰冰的数据堆砌",
        yanbao: "情感计算引擎，基于「雁宝记忆」的审美沉淀",
        icon: <Heart className="w-4 h-4" />
      },
      {
        title: "交互体验",
        opponent: "复杂的参数面板，工具属性强",
        yanbao: "专属库洛米 UI 与头像快门，满满的仪式感",
        icon: <Crown className="w-4 h-4" />
      },
      {
        title: "服务承诺",
        opponent: "商业客服，按流程办事",
        yanbao: "Jason Tsao 跨越 22 年与 2200 公里的技术守护",
        icon: <Clock className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'meitu',
    name: '美图秀秀',
    color: '#FF69B4', // 粉色代表大众
    icon: <Palette className="w-6 h-6" />,
    slogan: "臃肿的广告集合体",
    features: [
      {
        title: "审美高度",
        opponent: "迎合大众的网红滤镜，千篇一律",
        yanbao: "31位大师影调，私人定制的艺术级审美",
        icon: <Palette className="w-4 h-4" />
      },
      {
        title: "使用体验",
        opponent: "广告弹窗多，功能冗余",
        yanbao: "纯净无广，只为摄影而生",
        icon: <Shield className="w-4 h-4" />
      },
      {
        title: "情感连接",
        opponent: "工具人属性，用完即走",
        yanbao: "每一次快门都是一次深情的告白",
        icon: <Heart className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'beauty_cam',
    name: '美颜相机',
    color: '#FF1493', // 深粉代表美颜
    icon: <Palette className="w-6 h-6" />,
    slogan: "失真的过度磨皮",
    features: [
      {
        title: "真实质感",
        opponent: "过度磨皮，丢失皮肤纹理细节",
        yanbao: "保留真实质感，还原你眼中的美",
        icon: <Zap className="w-4 h-4" />
      },
      {
        title: "个性化",
        opponent: "标准化的蛇精脸模板",
        yanbao: "微调骨相，保留个人特色与辨识度",
        icon: <Palette className="w-4 h-4" />
      },
      {
        title: "安全隐私",
        opponent: "云端处理，存在隐私泄露风险",
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
              yanbao AI 综合PK：<br className="md:hidden" />私人定制的极致巅峰
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              不只是工具的较量，更是<span className="text-pink-500 font-semibold">爱与技术</span>的降维打击。
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
                      <p className="text-purple-300 text-sm">私人定制 · 极致巅峰</p>
                    </div>
                  </div>

                  <div className="space-y-8 flex-1">
                    {activeCompetitor.features.map((feature, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center gap-2 text-purple-300 text-sm mb-2 font-medium">
                          {feature.icon}
                          {feature.title}
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors shadow-lg shadow-purple-900/20">
                          <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-white font-medium leading-relaxed">{feature.yanbao}</span>
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

                  <div className="space-y-8 flex-1">
                    {activeCompetitor.features.map((feature, idx) => (
                      <div key={idx} className="group text-right">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2 font-medium justify-end">
                          {feature.title}
                          {feature.icon}
                        </div>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors justify-end">
                          <span className="text-gray-400 leading-relaxed">{feature.opponent}</span>
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
