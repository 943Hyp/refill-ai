"use client";

import { Button } from "@/components/ui/button";
import { Locale, getTranslation } from '@/lib/i18n';

interface HeroSectionProps {
  locale: Locale;
  onGetStarted: () => void;
}

const HeroSection = ({ locale, onGetStarted }: HeroSectionProps) => {
  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  const features = [
    {
      icon: "🎨",
      title: locale === 'zh' ? "AI图像生成" : "AI Image Generation",
      desc: locale === 'zh' ? "文字转图像，创意无限" : "Text to image, unlimited creativity"
    },
    {
      icon: "🔍", 
      title: locale === 'zh' ? "图像分析" : "Image Analysis",
      desc: locale === 'zh' ? "图像转文字，智能识别" : "Image to text, smart recognition"
    },
    {
      icon: "📝",
      title: locale === 'zh' ? "提示词模板" : "Prompt Templates", 
      desc: locale === 'zh' ? "精选模板，快速上手" : "Curated templates, quick start"
    },
    {
      icon: "🆓",
      title: locale === 'zh' ? "完全免费" : "Completely Free",
      desc: locale === 'zh' ? "无需登录，无限使用" : "No login required, unlimited use"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        {/* Main Title */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium">
            <span className="animate-pulse">✨</span>
            <span>{locale === 'zh' ? '免费AI图像生成平台' : 'Free AI Image Generation Platform'}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
            {locale === 'zh' ? (
              <>
                让创意<br />
                <span className="text-primary">无限绽放</span>
              </>
            ) : (
              <>
                Unleash Your<br />
                <span className="text-primary">Creativity</span>
              </>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {locale === 'zh' 
              ? "使用最先进的AI技术，将您的想象转化为精美图像。完全免费，无需注册，即刻开始您的创作之旅。"
              : "Transform your imagination into stunning images with cutting-edge AI technology. Completely free, no registration required, start your creative journey now."
            }
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105"
          >
            <span className="mr-2">🚀</span>
            {locale === 'zh' ? '立即开始创作' : 'Start Creating Now'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="mr-2">📖</span>
            {locale === 'zh' ? '了解更多' : 'Learn More'}
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">{locale === 'zh' ? '完全免费' : 'Completely Free'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">{locale === 'zh' ? '无限使用' : 'Unlimited Usage'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">{locale === 'zh' ? '无需注册' : 'No Registration'}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 