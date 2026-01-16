import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Sparkles, Split, Sliders, Aperture, Sun, Contrast, Droplets, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import SmartRecommender from './SmartRecommender';

// 样片数据 - 包含七位大师参数
const galleryItems = [
  {
    id: 1,
    image: "/images/samples/sample-1.webp",
    original: "/images/samples/sample-1.webp",
    master: "Tone by 肖全 (Xiao Quan)",
    title: "时代的肖像",
    desc: "极致黑白影调，模拟胶片质感，保留人像的岁月刻痕",
    filter: "grayscale(100%) contrast(140%) brightness(90%)",
    params: [
      { name: "曝光 (Exposure)", value: -0.1, display: "-0.1", icon: <Sun className="w-4 h-4" />, color: "bg-yellow-500" },
      { name: "对比度 (Contrast)", value: 0.4, display: "+0.4", icon: <Contrast className="w-4 h-4" />, color: "bg-purple-500" },
      { name: "饱和度 (Saturation)", value: -1.0, display: "-1.0", icon: <Droplets className="w-4 h-4" />, color: "bg-blue-500" },
      { name: "颗粒度 (Grain)", value: 0.2, display: "+0.2", icon: <Layers className="w-4 h-4" />, color: "bg-gray-400" }
    ]
  },
  {
    id: 2,
    image: "/images/samples/sample-2.webp",
    original: "/images/samples/sample-2.webp",
    master: "Aesthetic by 孙郡 (Sun Jun)",
    title: "新文人画摄影",
    desc: "仿工笔画风格，采用低反差暖色调，营造古典、静谧的意境",
    filter: "brightness(120%) contrast(80%) saturate(70%) sepia(20%)",
    params: [
      { name: "曝光 (Exposure)", value: 0.2, display: "+0.2", icon: <Sun className="w-4 h-4" />, color: "bg-yellow-500" },
      { name: "对比度 (Contrast)", value: -0.2, display: "-0.2", icon: <Contrast className="w-4 h-4" />, color: "bg-purple-500" },
      { name: "饱和度 (Saturation)", value: -0.3, display: "-0.3", icon: <Droplets className="w-4 h-4" />, color: "bg-blue-500" },
      { name: "色温 (Warmth)", value: 0.2, display: "+0.2", icon: <Sun className="w-4 h-4" />, color: "bg-orange-500" }
    ]
  },
  {
    id: 3,
    image: "/images/samples/sample-3.webp",
    original: "/images/samples/sample-3.webp",
    master: "Color by 陈漫 (Chen Man)",
    title: "视觉艺术",
    desc: "商业高保真风格，色彩浓郁且具有高锐度",
    filter: "brightness(110%) contrast(130%) saturate(120%)",
    params: [
      { name: "曝光 (Exposure)", value: 0.1, display: "+0.1", icon: <Sun className="w-4 h-4" />, color: "bg-yellow-500" },
      { name: "对比度 (Contrast)", value: 0.3, display: "+0.3", icon: <Contrast className="w-4 h-4" />, color: "bg-purple-500" },
      { name: "饱和度 (Saturation)", value: 0.2, display: "+0.2", icon: <Droplets className="w-4 h-4" />, color: "bg-blue-500" },
      { name: "锐度 (Sharpness)", value: 0.3, display: "+0.3", icon: <Aperture className="w-4 h-4" />, color: "bg-red-500" }
    ]
  },
  {
    id: 4,
    image: "/images/samples/sample-4.webp",
    original: "/images/samples/sample-4.webp",
    master: "Zone System by Ansel Adams",
    title: "区域曝光法",
    desc: "极致黑白细节，精准控制高光与阴影的层次",
    filter: "grayscale(100%) contrast(120%) brightness(110%)",
    params: [
      { name: "灰度 (Grayscale)", value: 1.0, display: "100%", icon: <Droplets className="w-4 h-4" />, color: "bg-gray-500" },
      { name: "高光 (Highlights)", value: 0.3, display: "+0.3", icon: <Sun className="w-4 h-4" />, color: "bg-white" },
      { name: "阴影 (Shadows)", value: -0.4, display: "-0.4", icon: <Contrast className="w-4 h-4" />, color: "bg-black" },
      { name: "清晰度 (Clarity)", value: 0.5, display: "+0.5", icon: <Aperture className="w-4 h-4" />, color: "bg-blue-400" }
    ]
  },
  {
    id: 5,
    image: "/images/samples/sample-5.webp",
    original: "/images/samples/sample-5.webp",
    master: "Pure by 林海音 (Lin Haiyin)",
    title: "原生质感",
    desc: "台湾式纯净原生，柔和肤色与自然光的完美融合",
    filter: "brightness(115%) saturate(105%) sepia(10%)",
    params: [
      { name: "亮度 (Brightness)", value: 0.15, display: "+0.15", icon: <Sun className="w-4 h-4" />, color: "bg-yellow-400" },
      { name: "红润 (Rosy)", value: 0.2, display: "+0.2", icon: <Heart className="w-4 h-4" />, color: "bg-pink-400" },
      { name: "美白 (Whitening)", value: 0.3, display: "+0.3", icon: <Sparkles className="w-4 h-4" />, color: "bg-white" },
      { name: "纹理 (Texture)", value: 0.4, display: "+0.4", icon: <Layers className="w-4 h-4" />, color: "bg-orange-300" }
    ]
  },
  {
    id: 6,
    image: "/images/samples/sample-6.webp",
    original: "/images/samples/sample-6.webp",
    master: "Dramatic by 范毅舜 (Nicholas Fan)",
    title: "光影戏剧",
    desc: "浓郁光影与戏剧化色彩，赋予画面强烈的故事感",
    filter: "contrast(130%) saturate(125%) sepia(15%)",
    params: [
      { name: "饱和度 (Saturation)", value: 0.25, display: "+0.25", icon: <Droplets className="w-4 h-4" />, color: "bg-red-500" },
      { name: "对比度 (Contrast)", value: 0.3, display: "+0.3", icon: <Contrast className="w-4 h-4" />, color: "bg-purple-600" },
      { name: "暖调 (Warmth)", value: 0.1, display: "+0.1", icon: <Sun className="w-4 h-4" />, color: "bg-orange-500" },
      { name: "暗角 (Vignette)", value: 0.2, display: "+0.2", icon: <Layers className="w-4 h-4" />, color: "bg-black" }
    ]
  },
  {
    id: 7,
    image: "/images/samples/sample-7.webp",
    original: "/images/samples/sample-7.webp",
    master: "Documentary by 阮义忠 (Juan I-Jong)",
    title: "人文纪实",
    desc: "高反差黑白，记录最真实的人文瞬间",
    filter: "grayscale(100%) contrast(140%)",
    params: [
      { name: "灰度 (Grayscale)", value: 1.0, display: "100%", icon: <Droplets className="w-4 h-4" />, color: "bg-gray-600" },
      { name: "对比度 (Contrast)", value: 0.4, display: "+0.4", icon: <Contrast className="w-4 h-4" />, color: "bg-white" },
      { name: "颗粒 (Grain)", value: 0.2, display: "+0.2", icon: <Layers className="w-4 h-4" />, color: "bg-gray-400" },
      { name: "锐度 (Sharpness)", value: 0.1, display: "+0.1", icon: <Aperture className="w-4 h-4" />, color: "bg-blue-500" }
    ]
  }
];

import { Heart } from 'lucide-react'; // 补充导入 Heart 图标

export default function MasterGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isComparing, setIsComparing] = useState(true);

  const handleRecommendation = (masterName: string) => {
    const index = galleryItems.findIndex(item => item.master.includes(masterName));
    if (index !== -1 && emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

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

  const currentItem = galleryItems[selectedIndex];

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

        {/* 智能推荐模块 */}
        <div className="mb-12">
          <SmartRecommender onRecommend={handleRecommendation} />
        </div>

        {/* 轮播主体 */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/50 backdrop-blur-sm" ref={emblaRef}>
            <div className="flex">
              {galleryItems.map((item) => (
                <div key={item.id} className="flex-[0_0_100%] min-w-0 relative aspect-[4/3] md:aspect-[16/9]">
                  {isComparing ? (
                    <ReactCompareSlider
                      itemOne={<ReactCompareSliderImage src={item.original} alt="Original" />}
                      itemTwo={
                        <div className="w-full h-full relative overflow-hidden">
                           <img 
                            src={item.image} 
                            alt="Processed" 
                            className="w-full h-full object-cover"
                            style={{ filter: item.filter }}
                          />
                          {/* 颗粒感叠加层 (仅肖全/阮义忠模式) */}
                          {(item.master.includes("肖全") || item.master.includes("阮义忠")) && (
                            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" 
                                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                            />
                          )}
                        </div>
                      }
                      className="w-full h-full"
                      position={50}
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        loading="lazy"
                        className="w-full h-full object-cover"
                        style={{ filter: item.filter }}
                      />
                       {(item.master.includes("肖全") || item.master.includes("阮义忠")) && (
                            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" 
                                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                            />
                          )}
                    </div>
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
                  </div>
                  
                  {isComparing && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-xs text-white/80 pointer-events-none border border-white/10 z-20">
                      ← 原图 | 大师调优 →
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
        </div>

        {/* 参数仪表盘 - 动态渲染 */}
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Sliders className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-white">大师参数矩阵 (Parameter Matrix)</h3>
            <span className="text-xs text-gray-500 ml-auto font-mono">Real-time Rendering</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentItem.params.map((param, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    {param.icon}
                    <span className="text-xs">{param.name.split(' ')[0]}</span>
                  </div>
                  <span className={`font-mono text-xs ${param.value > 0 ? 'text-green-400' : param.value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {param.display}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                  {/* 中心基准线 */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 z-10" />
                  <motion.div 
                    className={`h-full ${param.color} absolute top-0 bottom-0`}
                    initial={{ width: "0%", left: "50%" }}
                    animate={{ 
                      width: `${Math.abs(param.value) * 50}%`,
                      left: param.value >= 0 ? "50%" : `${50 - Math.abs(param.value) * 50}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 指示器 */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap px-4">
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
    </section>
  );
}
