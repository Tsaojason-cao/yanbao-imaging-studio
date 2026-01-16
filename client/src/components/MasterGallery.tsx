import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// 样片数据
const galleryItems = [
  {
    id: 1,
    image: "/images/01_Home_Hero.png",
    master: "Style by 肖全",
    title: "人像的灵魂",
    desc: "捕捉眼神中的光芒，还原最真实的情感浓度"
  },
  {
    id: 2,
    image: "/images/02_Features_Grid.png",
    master: "Style by 蜷川实花",
    title: "色彩的盛宴",
    desc: "高饱和度的色彩碰撞，营造梦幻般的视觉冲击"
  },
  {
    id: 3,
    image: "/images/03_Parameter_Viz.png",
    master: "Style by 滨田英明",
    title: "日系的清新",
    desc: "通透的空气感，记录生活中的小确幸"
  },
  {
    id: 4,
    image: "/images/04_Competitor_Radar.png",
    master: "Style by 韦斯·安德森",
    title: "对称的美学",
    desc: "严谨的构图与复古配色，打造电影级质感"
  },
  {
    id: 5,
    image: "/images/05_Love_Story.png",
    master: "Style by 王家卫",
    title: "情绪的流动",
    desc: "抽帧与慢门，讲述光影里的暧昧故事"
  }
];

export default function MasterGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="demo" className="py-24 bg-black relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-purple-400 mb-6">
              <Camera className="w-4 h-4" />
              <span>大师级样片展示</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              31位大师影调，
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                一键复刻经典
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              不仅仅是滤镜，更是对光影艺术的致敬。每一款影调都经过专业摄影师的逐像素调校。
            </p>
          </motion.div>
        </div>

        {/* 轮播主体 */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/50 backdrop-blur-sm" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] md:aspect-[21/9]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                  />
                  
                  {/* 底部信息栏 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-pink-500 font-medium mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{item.master}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 max-w-lg">{item.desc}</p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-white/40 text-sm font-mono">YANBAO AI STUDIO</p>
                      <p className="text-white/40 text-sm font-mono">PRESET ID: 0{item.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 导航按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 border border-white/10 backdrop-blur-md hidden md:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 border border-white/10 backdrop-blur-md hidden md:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* 指示器 */}
          <div className="flex justify-center gap-2 mt-8">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'w-8 bg-pink-500' : 'bg-white/20 hover:bg-white/40'
                }`}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
