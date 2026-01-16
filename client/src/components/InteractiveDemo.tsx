import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon, Sparkles, Upload, Wand2 } from "lucide-react";
import { useRef, useState } from "react";

const DEMO_IMAGES = [
  "/images/demo/01.jpg",
  "/images/demo/02.jpg",
  "/images/demo/03.jpg",
  "/images/demo/04.jpg",
  "/images/demo/05.jpg",
  "/images/demo/06.jpg",
  "/images/demo/07.jpg",
  "/images/demo/08.jpg",
];

const FILTERS = [
  {
    id: "original",
    name: "原图",
    style: {},
  },
  {
    id: "xiaoquan",
    name: "肖全黑白",
    style: { filter: "grayscale(100%) contrast(120%) brightness(90%)" },
  },
  {
    id: "chenman",
    name: "陈漫时尚",
    style: { filter: "saturate(130%) contrast(110%) brightness(105%) hue-rotate(-5deg)" },
  },
  {
    id: "film",
    name: "日系胶片",
    style: { filter: "sepia(20%) contrast(95%) brightness(110%) saturate(85%)" },
  },
  {
    id: "cyber",
    name: "赛博朋克",
    style: { filter: "contrast(120%) saturate(150%) hue-rotate(10deg) brightness(110%)" },
  },
];

export default function InteractiveDemo() {
  const [selectedImage, setSelectedImage] = useState(DEMO_IMAGES[0]);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [intensity, setIntensity] = useState(100);
  const [isComparing, setIsComparing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pink-500 mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Demo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            亲眼见证 <span className="text-primary">大师影调</span> 的魔力
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            无需下载，即刻体验。上传您的照片，或使用我们提供的样片，感受 Sanmu AI 带来的视觉蜕变。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Controls */}
          <div className="lg:col-span-1 space-y-8">
            {/* Image Selection */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> 选择样片
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {DEMO_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? "border-primary" : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img src={img} alt={`Demo ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-white/20 hover:bg-white/5 hover:border-primary/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传自己的照片
                </Button>
              </div>
            </Card>

            {/* Filter Selection */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> 选择影调
              </h3>
              <div className="space-y-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      activeFilter.id === filter.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "hover:bg-white/5 text-gray-400 border border-transparent"
                    }`}
                  >
                    <span>{filter.name}</span>
                    {activeFilter.id === filter.id && <ArrowRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
              
              {activeFilter.id !== 'original' && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>强度</span>
                    <span>{intensity}%</span>
                  </div>
                  <Slider
                    value={[intensity]}
                    onValueChange={(val) => setIntensity(val[0])}
                    max={100}
                    step={1}
                    className="py-2"
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Right: Preview Area */}
          <div className="lg:col-span-2">
            <Card className="relative aspect-[4/3] bg-black/50 border-white/10 overflow-hidden group rounded-2xl">
              {/* Image Container */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-all duration-300"
                  style={
                    isComparing
                      ? {} // Show original when comparing
                      : {
                          ...activeFilter.style,
                          opacity: 1, // Ensure visibility
                          // Apply intensity by blending with original (simplified simulation)
                          // In a real app, this would be WebGL or Canvas based
                        }
                  }
                />
              </div>

              {/* Compare Button (Mobile Friendly) */}
              <button
                className="absolute bottom-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-medium shadow-lg active:scale-95 transition-transform select-none touch-none"
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onMouseLeave={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
              >
                {isComparing ? "原始图像" : "按住对比"}
              </button>

              {/* Status Badge */}
              <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium text-white">
                {isComparing ? "Original" : activeFilter.name}
              </div>
            </Card>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              * 网页版仅为模拟效果，下载 App 体验完整的 AI 渲染引擎
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
