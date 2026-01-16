import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Heart, Shield, Sparkles } from "lucide-react";

const comparisonData = [
  {
    feature: "核心算法",
    yanbao: { text: "情感计算引擎 (基于「雁宝记忆」)", highlight: true },
    others: { text: "通用商业算法 (冷冰冰的数据堆砌)", highlight: false }
  },
  {
    feature: "大师参数",
    yanbao: { text: "内置 31 位全球顶尖摄影大师参数矩阵", highlight: true },
    others: { text: "普通网红滤镜 (千篇一律)", highlight: false }
  },
  {
    feature: "交互体验",
    yanbao: { text: "专属库洛米 UI + 头像快门仪式感", highlight: true },
    others: { text: "复杂参数面板 (工具属性强)", highlight: false }
  },
  {
    feature: "技术守护",
    yanbao: { text: "Jason Tsao 跨越 22 年的技术守护", highlight: true },
    others: { text: "标准商业客服 (按流程办事)", highlight: false }
  },
  {
    feature: "隐私安全",
    yanbao: { text: "100% 本地运行 (无云端上传)", highlight: true },
    others: { text: "云端处理 (存在隐私风险)", highlight: false }
  },
  {
    feature: "广告干扰",
    yanbao: { text: "纯净无广 (只为摄影而生)", highlight: true },
    others: { text: "广告弹窗多 (臃肿冗余)", highlight: false }
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
              内置 31 位全球顶尖摄影大师参数矩阵，非滤镜式覆盖，而是基于专业影像逻辑的像素级重构。
            </p>
          </motion.div>
        </div>

        {/* PK 表格 */}
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* 表头 */}
          <div className="grid grid-cols-12 bg-white/5 border-b border-white/10 p-6 text-lg font-bold">
            <div className="col-span-3 text-gray-400 flex items-center">核心维度</div>
            <div className="col-span-4 text-gray-500 flex items-center justify-center opacity-50">普通修图 App</div>
            <div className="col-span-5 text-white flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30 py-4">
              <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Yanbao AI</span>
            </div>
          </div>

          {/* 表格内容 */}
          <div className="divide-y divide-white/5">
            {comparisonData.map((row, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-12 p-6 hover:bg-white/5 transition-colors group"
              >
                {/* 维度名称 */}
                <div className="col-span-3 flex items-center font-medium text-gray-300">
                  {row.feature}
                </div>

                {/* 普通 App */}
                <div className="col-span-4 flex items-center gap-3 text-gray-500 grayscale opacity-60 group-hover:opacity-80 transition-opacity border-r border-white/5 pr-4">
                  <X className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm">{row.others.text}</span>
                </div>

                {/* Yanbao AI */}
                <div className="col-span-5 flex items-center gap-3 pl-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/50">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium text-base relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-pink-200 group-hover:to-purple-200 transition-all">
                    {row.yanbao.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
