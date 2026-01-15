import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    id: "home",
    title: "首页",
    desc: "库洛米主题沉浸式体验，核心功能一触即达",
    image: "/images/screenshots/01_Home.png",
    colSpan: "md:col-span-2",
  },
  {
    id: "camera",
    title: "专业相机",
    desc: "31位大师影调实时预览，所见即所得",
    image: "/images/screenshots/02_Camera.png",
    colSpan: "md:col-span-1",
  },
  {
    id: "gallery",
    title: "智能相册",
    desc: "AI 自动整理，美好回忆井井有条",
    image: "/images/screenshots/04_Gallery.png",
    colSpan: "md:col-span-1",
  },
  {
    id: "edit",
    title: "精细修图",
    desc: "12维美颜参数，打造专属你的美",
    image: "/images/screenshots/03_Edit.png",
    colSpan: "md:col-span-2",
  },
  {
    id: "spots",
    title: "机位推荐",
    desc: "发现城市中最美的拍摄角落",
    image: "/images/screenshots/06_Spots_Map.png",
    colSpan: "md:col-span-1",
  },
  {
    id: "settings",
    title: "个性设定",
    desc: "完全自定义的 App 体验",
    image: "/images/screenshots/07_Settings.png",
    colSpan: "md:col-span-1",
  },
  {
    id: "stats",
    title: "数据统计",
    desc: "记录你的每一次创作与成长",
    image: "/images/screenshots/05_Stats.png",
    colSpan: "md:col-span-1",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-purple-500">
            七大核心模块
          </h2>
          <p className="text-xl md:text-2xl font-serif italic text-pink-400/90 mb-4 tracking-wide">
            —— 私人影像工作室 ——
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            每一个像素都经过精心打磨，只为呈现最完美的影像体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${feature.colSpan} group`}
            >
              <Card className="h-full overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
