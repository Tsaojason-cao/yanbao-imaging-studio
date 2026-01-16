import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Sparkles, Split } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

// 样片数据
const galleryItems = [
  {
    id: 1,
    image: "/images/samples/sample-1.webp",
    original: "/images/samples/sample-1.webp", // 实际项目中应为原图，此处暂用同一张模拟
    master: "Aesthetic by 杉本博司",
    title: "时间的静止",
    desc: "通过长时间曝光与极简构图，捕捉超越现实的宁静感"
  },
  {
    id: 2,
    image: "/images/samples/sample-2.webp",
    original: "/images/samples/sample-2.webp",
    master: "Tone by 肖全",
    title: "时代的肖像",
    desc: "用镜头记录真实的人性与情感，黑白之间尽显张力"
  },
  {
    id: 3,
    image: "/images/samples/sample-3.webp",
    original: "/images/samples/sample-3.webp",
    master: "Color by 蜷川实花",
    title: "绚烂的梦境",
    desc: "高饱和度的色彩碰撞，营造出迷幻而华丽的视觉盛宴"
  },
  {
    id: 4,
    image: "/images/samples/sample-4.webp",
    original: "/images/samples/sample-4.webp",
    master: "Light by 滨田英明",
    title: "生活的温情",
    desc: "通透的空气感与柔和的光线，记录平凡生活中的小确幸"
  },
  {
    id: 5,
    image: "/images/samples/sample-5.webp",
    original: "/images/samples/sample-5.webp",
    master: "Mood by 王家卫",
    title: "光影的暧昧",
    desc: "独特的抽帧与色彩运用，讲述都市中流动的情绪故事"
  },
  {
    id: 6,
    image: "/images/samples/sample-6.webp",
    original: "/images/samples/sample-6.webp",
    master: "Style by 韦斯·安德森",
    title: "对称的童话",
    desc: "严谨的对称构图与复古配色，打造治愈系的视觉童话"
  },
  {
    id: 7,
    image: "/images/samples/sample-7.webp",
    original: "/images/samples/sample-7.webp",
    master: "Vision by 荒木经惟",
    title: "瞬间的真实",
    desc: "直面生与死的强烈情感，捕捉最原始的生命力"
  },
  {
    id: 8,
    image: "/images/samples/sample-8.webp",
    original: "/images/samples/sample-8.webp",
    master: "Art by 筱山纪信",
    title: "青春的悸动",
    desc: "细腻地捕捉少女的纯真与活力，定格最美好的年华"
  },
  {
    id: 9,
    image: "/images/samples/sample-9.webp",
    original: "/images/samples/sample-9.webp",
    master: "Soul by 森山大道",
    title: "街头的粗颗粒",
    desc: "高反差黑白与粗颗粒质感，展现街头摄影的野性与力量"
  }
];

export default function MasterGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

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
        <div className="text-center mb-12">
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
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              不仅仅是滤镜，更是对光影艺术的致敬。每一款影调都经过专业摄影师的逐像素调校。
            </p>
            
            <Button 
              variant="outline" 
              onClick={() => setIsComparing(!isComparing)}
              className={`rounded-full border-purple-500/50 hover:bg-purple-500/10 ${isComparing ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400'}`}
            >
              <Split className="w-4 h-4 mr-2" />
              {isComparing ? '关闭对比模式' : '开启原图对比'}
            </Button>
          </motion.div>
        </div>

        {/* 轮播主体 */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/50 backdrop-blur-sm" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0 relative aspect-[4/3] md:aspect-[16/9]">
                  {isComparing ? (
                    <ReactCompareSlider
                      itemOne={<ReactCompareSliderImage src={item.original} alt="Original" style={{ filter: 'grayscale(100%) opacity(0.8)' }} />}
                      itemTwo={<ReactCompareSliderImage src={item.image} alt="Processed" />}
                      className="w-full h-full"
                      position={50}
                    />
                  ) : (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* 底部信息栏 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-none">
                    <div>
                      <motion.div 
                        key={selectedIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-pink-500 font-medium mb-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-lg tracking-wide">{item.master}</span>
                      </motion.div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300 max-w-lg text-sm md:text-base">{item.desc}</p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-white/40 text-sm font-mono">YANBAO AI STUDIO</p>
                      <p className="text-white/40 text-sm font-mono">PRESET ID: 0{item.id}</p>
                    </div>
                  </div>
                  
                  {isComparing && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-xs text-white/80 pointer-events-none border border-white/10">
                      ← 原图 (模拟) | 大师调优 →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 导航按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 border border-white/10 backdrop-blur-md hidden md:flex z-20"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 border border-white/10 backdrop-blur-md hidden md:flex z-20"
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
