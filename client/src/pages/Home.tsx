import Features from "@/components/Features";
import ParameterViz from "@/components/ParameterViz";
import LoveStory from "@/components/LoveStory";

import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import InteractiveDemo from "@/components/InteractiveDemo";
import WhitePaper from "@/components/WhitePaper";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleReveal = () => {
    setIsRevealed(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-pink-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Yanbao AI Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-pink-500/20" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              YanBao AI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {isRevealed && (
              <>
                <a href="#story" className="hover:text-primary transition-colors text-pink-400">深情告白</a>
                <a href="#features" className="hover:text-primary transition-colors">功能</a>
                <a href="#demo" className="hover:text-primary transition-colors">展示</a>
              </>
            )}
          </div>

          <Button 
            variant="default" 
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 rounded-full px-6 shadow-lg shadow-primary/25"
            onClick={() => window.open('#download', '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            下载 App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-pink-400">
              <Sparkles className="w-4 h-4" />
              <span>v2.4.1 Gold Master 现已发布</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="block text-white">你眼中的美，</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-purple-500">
                从此有了最温柔的注脚
              </span>
            </h1>
            
            {!isRevealed && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              >
                点击下方视频，开启属于你的故事
              </motion.p>
            )}
          </motion.div>

          {/* Hero Video Container - Trigger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: isRevealed ? "0 0 0 0 transparent" : "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 35px 60px -15px rgba(236, 72, 153, 0.3)"
            }}
            transition={{ duration: 0.5 }}
            onClick={handleReveal}
            className={`relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-pointer transition-all duration-500 ${isRevealed ? 'ring-0' : 'ring-4 ring-pink-500/20'}`}
          >
            <div className={`absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-20 flex items-center justify-center ${isRevealed ? 'hidden' : 'flex'}`}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 flex items-center gap-3"
              >
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
                <span className="text-white font-medium text-lg">点击开启深情告白</span>
              </motion.div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero_video.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-left pointer-events-none">
              <h3 className="text-2xl font-bold text-white mb-2">雁宝 AI 私人影像工作室</h3>
              <p className="text-white/80">记录每一个心动瞬间</p>
            </div>
          </motion.div>
        </div>
        
        {!isRevealed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        )}
      </section>

      {/* Revealed Content */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Love Story - First to appear */}
            <LoveStory />

            {/* Features Grid */}
            <Features />

            {/* Parameter Visualization */}
            <ParameterViz />

            {/* White Paper */}
            <WhitePaper />

            {/* Competitor Analysis */}
            <CompetitorAnalysis />

            {/* Interactive Demo */}
            <InteractiveDemo />

            {/* Testimonials */}
            <Testimonials />

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
