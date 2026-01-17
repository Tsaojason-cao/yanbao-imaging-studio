import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, X, Camera, Aperture, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Membership() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const toggleBilling = () => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-8 px-6 text-center flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2D5F3F]" />
          <span className="text-[10px] tracking-widest text-gray-400 font-medium">SANMU AI COMMERCIAL V1.0</span>
        </div>
        
        <h1 className="text-4xl font-light leading-tight mb-2">
          深藏功名，
        </h1>
        <h1 className="text-4xl font-medium leading-tight mb-4 text-white">
          极简外露
        </h1>
        
        <p className="text-sm text-gray-400 font-light max-w-xs mx-auto leading-relaxed">
          Unlock the Leica-inspired minimalist workflow. Join the Sanmu Club.
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        <span className={`text-sm transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
        <Switch 
          checked={billingCycle === 'yearly'} 
          onCheckedChange={toggleBilling}
          className="data-[state=checked]:bg-[#2D5F3F]"
        />
        <span className={`text-sm transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly</span>
        {billingCycle === 'yearly' && (
          <span className="text-[10px] font-bold text-[#2D5F3F] bg-[#2D5F3F]/10 px-2 py-0.5 rounded">SAVE 15%</span>
        )}
      </motion.div>

      {/* Pricing Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 space-y-6 max-w-md mx-auto"
      >
        {/* Free Tier */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] text-white overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 rounded-lg bg-[#333333] flex items-center justify-center mb-4">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-light">Free</CardTitle>
              <CardDescription className="text-gray-500 text-xs">For casual photographers.</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-medium">¥0</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              <div className="space-y-3">
                <FeatureItem text="3 Master Filters" active />
                <FeatureItem text="12 Basic Params" active />
                <FeatureItem text="Advanced Params" active={false} disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-[#444444] text-white hover:bg-[#333333] hover:text-white bg-transparent h-12 rounded-xl">
                Current Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Pro Tier */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#222222] border-[#2D5F3F] text-white relative overflow-hidden shadow-[0_0_30px_rgba(45,95,63,0.15)] transform scale-[1.02]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2D5F3F] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg tracking-wider shadow-lg">
              MOST POPULAR
            </div>
            <CardHeader className="pb-4 pt-8">
              <div className="w-10 h-10 rounded-lg bg-[#2D5F3F]/20 flex items-center justify-center mb-4">
                <Aperture className="w-5 h-5 text-[#2D5F3F]" />
              </div>
              <CardTitle className="text-xl font-medium">Pro (森友)</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Unlock full potential.</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-medium">¥{billingCycle === 'monthly' ? '98' : '83'}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-gray-500 mb-6">Billed ¥998 yearly</p>
              )}
              <div className={`space-y-3 ${billingCycle === 'monthly' ? 'mt-6' : ''}`}>
                <FeatureItem text="All 31 Master Filters" active highlight />
                <FeatureItem text="29 Advanced Params" active highlight />
                <FeatureItem text="Cloud Sync (50GB)" active highlight />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2D5F3F] hover:bg-[#234b31] text-white h-12 rounded-xl shadow-[0_4px_14px_rgba(45,95,63,0.4)]">
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Master Tier */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#1E1E1E] border-[#333333] text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 border border-[#2D5F3F] text-[#2D5F3F] text-[10px] px-1.5 py-0.5 rounded">
              LIMITED
            </div>
            <CardHeader className="pb-4">
              <div className="w-10 h-10 rounded-lg bg-[#333333] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-light">Master (大师)</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Ultimate control.</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-medium">¥{billingCycle === 'monthly' ? '298' : '250'}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-gray-500 mb-6">Billed ¥2998 yearly</p>
              )}
              <div className={`space-y-3 ${billingCycle === 'monthly' ? 'mt-6' : ''}`}>
                <FeatureItem text="Everything in Pro" active />
                <FeatureItem text="Custom Matrix" active />
                <FeatureItem text="Priority Queue" active />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-[#444444] text-white hover:bg-[#333333] hover:text-white bg-transparent h-12 rounded-xl">
                Become a Master
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-600 flex justify-center gap-4">
        <button className="hover:text-gray-400 transition-colors">Restore Purchase</button>
        <span>|</span>
        <button className="hover:text-gray-400 transition-colors">Terms of Service</button>
      </div>
    </div>
  );
}

function FeatureItem({ text, active, disabled, highlight }: { text: string, active: boolean, disabled?: boolean, highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-sm ${disabled ? 'text-gray-600' : 'text-gray-300'}`}>
      {active ? (
        <Check className={`w-4 h-4 ${highlight ? 'text-[#2D5F3F]' : 'text-[#2D5F3F]'}`} />
      ) : (
        <X className="w-4 h-4 text-gray-600" />
      )}
      <span>{text}</span>
    </div>
  );
}
