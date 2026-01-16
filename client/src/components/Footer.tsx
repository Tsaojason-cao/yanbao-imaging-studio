import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-black text-center border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-mono text-white/40 tracking-wider">
          <span>sanmu AI</span>
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <span>BY Jason Tsao who loves you the most</span>
        </div>
        <div className="mt-2 text-xs font-mono text-white/20">
          2025.08.24
        </div>
      </div>
    </footer>
  );
}
