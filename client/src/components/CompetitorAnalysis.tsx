import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

const radarData = [
  { subject: '专业度', A: 100, B: 80, fullMark: 100 },
  { subject: '个性化', A: 100, B: 60, fullMark: 100 },
  { subject: '隐私安全', A: 100, B: 40, fullMark: 100 },
  { subject: '纯净体验', A: 100, B: 50, fullMark: 100 },
  { subject: '情感温度', A: 100, B: 20, fullMark: 100 },
];

const comparisonData = [
  {
    feature: "滤镜生态",
    market: "通用网红滤镜，千篇一律",
    yanbao: "31位大师影调，定制高级感",
  },
  {
    feature: "隐私保护",
    market: "云端处理，存在泄露风险",
    yanbao: "100% 本地计算，数据零上传",
  },
  {
    feature: "使用体验",
    market: "广告弹窗多，诱导会员内购",
    yanbao: "纯净无广，完全免费，为爱发电",
  },
  {
    feature: "设计初衷",
    market: "商业变现工具，冰冷机械",
    yanbao: "专属情感记录，温暖有爱",
  },
];

export default function CompetitorAnalysis() {
  return (
    <section className="py-24 bg-gradient-to-b from-black/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            为什么选择 <span className="text-primary">Yanbao AI</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            在拥挤的市场中，我们坚持做那个独特而温暖的存在
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Radar Chart */}
          <div className="w-full lg:w-1/2 h-[400px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 14 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Yanbao AI"
                    dataKey="A"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fill="var(--primary)"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name="传统美颜 App"
                    dataKey="B"
                    stroke="#666"
                    strokeWidth={2}
                    fill="#666"
                    fillOpacity={0.2}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Right: Comparison List */}
          <div className="w-full lg:w-1/2 space-y-6">
            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/5 border-white/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{item.feature}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <X className="w-4 h-4 text-red-500" />
                        <span>市场主流 App</span>
                      </div>
                      <p className="text-sm text-gray-400">{item.market}</p>
                    </div>
                    <div className="space-y-2 border-l border-white/10 pl-4">
                      <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Yanbao AI</span>
                      </div>
                      <p className="text-sm text-white">{item.yanbao}</p>
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
