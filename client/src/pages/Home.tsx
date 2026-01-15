import Features from "@/components/Features";
import ParameterViz from "@/components/ParameterViz";
import LoveStory from "@/components/LoveStory";
import Testimonials from "@/components/Testimonials";
import WhitePaper from "@/components/WhitePaper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Heart, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Yanbao AI Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">
              YanBao AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">功能</a>
            <a href="#showcase" className="hover:text-primary transition-colors">展示</a>
            <a href="#story" className="hover:text-primary transition-colors">故事</a>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
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
              <span className="block text-white">为爱而生的</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-500 to-purple-500">
                AI 影像工作室
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              融合 31 位大师影调与 12 维美颜参数，专为 Yanbao 打造的极致摄影体验。
              不仅仅是相机，更是深情的注视。
            </p>
          </motion.div>

          {/* Video Showcase - C Position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 mt-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
            <video 
              src="/hero_video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">库洛米主题界面</h3>
                <p className="text-white/80">沉浸式暗黑少女风体验</p>
              </div>
              <div className="flex gap-4">
                 {/* Controls placeholder */}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-full shadow-lg shadow-primary/25">
              <Download className="w-5 h-5 mr-2" />
              立即下载 Android 版
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white px-8 h-14 text-lg rounded-full">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              阅读深情告白
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Parameter Visualization */}
      <ParameterViz />

      {/* White Paper */}
      <WhitePaper />

      {/* Testimonials */}
      <Testimonials />

      {/* Love Story & Footer */}
      <LoveStory />
    </div>
  );
}
