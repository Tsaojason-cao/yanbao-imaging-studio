import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "磨皮", xiaoquan: 20, chenman: 85, full: 100 },
  { name: "美白", xiaoquan: 30, chenman: 90, full: 100 },
  { name: "瘦脸", xiaoquan: 10, chenman: 75, full: 100 },
  { name: "大眼", xiaoquan: 15, chenman: 80, full: 100 },
  { name: "锐化", xiaoquan: 90, chenman: 40, full: 100 },
  { name: "对比度", xiaoquan: 85, chenman: 50, full: 100 },
  { name: "饱和度", xiaoquan: 40, chenman: 70, full: 100 },
  { name: "色温", xiaoquan: 35, chenman: 60, full: 100 },
  { name: "颗粒", xiaoquan: 80, chenman: 10, full: 100 },
  { name: "暗角", xiaoquan: 70, chenman: 20, full: 100 },
  { name: "高光", xiaoquan: 40, chenman: 80, full: 100 },
  { name: "阴影", xiaoquan: 60, chenman: 50, full: 100 },
];

export default function ParameterViz() {
  return (
    <section className="py-24 bg-black/40 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-primary">31位大师影调</span>
                <br />
                <span className="text-white">参数可视化</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                从“肖全”的深邃纪实到“陈漫”的时尚光影，Yanbao AI 精确捕捉每一位大师的参数指纹。
                12维美颜参数动态映射，让每一次快门都充满艺术灵魂。
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="text-white font-medium">陈漫 (时尚/糖水)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-pink-500" />
                  <span className="text-white font-medium">肖全 (纪实/黑白)</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-2/3 h-[400px]">
            <Card className="h-full p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorChenman" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorXiaoquan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#666" tick={{ fill: '#999' }} />
                  <YAxis stroke="#666" tick={{ fill: '#999' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <Area 
                    type="monotone" 
                    dataKey="chenman" 
                    stroke="var(--primary)" 
                    fillOpacity={1} 
                    fill="url(#colorChenman)" 
                    strokeWidth={3}
                    name="陈漫风格"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xiaoquan" 
                    stroke="#ec4899" 
                    fillOpacity={1} 
                    fill="url(#colorXiaoquan)" 
                    strokeWidth={3}
                    name="肖全风格"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
