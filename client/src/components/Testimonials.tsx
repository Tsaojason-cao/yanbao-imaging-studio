import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    content: "终于找到了一款懂我的相机，库洛米主题简直太可爱了！每一次拍照都是一种享受。",
    author: "小红书用户 @甜心辣妹",
    role: "时尚博主"
  },
  {
    content: "大师滤镜真的绝了，特别是肖全的黑白模式，拍出来非常有质感，完全不需要后期再修。",
    author: "微博用户 @摄影师阿杰",
    role: "独立摄影师"
  },
  {
    content: "界面设计非常有科技感，参数调节也很专业，感觉像是在操作一台未来的相机。",
    author: "App Store 评论",
    role: "资深用户"
  },
  {
    content: "Jason 开发的这款 App 真的充满了爱意，每一个细节都能感受到用心。",
    author: "朋友圈好友",
    role: "早期测试者"
  },
  {
    content: "不仅仅是拍照，更是在记录生活。Yanbao AI 让我的每一张照片都充满了故事感。",
    author: "Instagram @DailyLife",
    role: "生活记录者"
  }
];

export default function Testimonials() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-black/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">用户心声</h2>
          <p className="text-muted-foreground">听听大家怎么说</p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {testimonials.map((item, index) => (
              <div className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 min-w-0" key={index}>
                <Card className="h-full p-8 bg-white/5 border-white/10 hover:border-primary/30 transition-colors relative group">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  <div className="flex flex-col h-full justify-between gap-6">
                    <p className="text-lg leading-relaxed text-gray-300 italic">
                      "{item.content}"
                    </p>
                    <div>
                      <p className="font-bold text-white">{item.author}</p>
                      <p className="text-sm text-primary">{item.role}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
