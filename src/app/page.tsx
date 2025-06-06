"use client";

import { useState, useRef } from 'react';
import { Toaster } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FAQSection from '@/components/sections/FAQSection';

import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TabsContainer from '@/components/TabsContainer';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import { Locale } from '@/lib/i18n';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('zh');
  const [showApp, setShowApp] = useState(false);
  const tabsRef = useRef<{ 
    handleGenerate: () => void;
    handleClear: () => void;
    handleToggleHistory: () => void;
  }>(null);

  const handleGetStarted = () => {
    setShowApp(true);
    // 滚动到应用区域
    setTimeout(() => {
      document.getElementById('app-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleKeyboardShortcuts = {
    onGenerate: () => tabsRef.current?.handleGenerate(),
    onClear: () => tabsRef.current?.handleClear(),
    onToggleHistory: () => tabsRef.current?.handleToggleHistory(),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header locale={locale} onLocaleChange={setLocale} />
      
      <main>
        {/* Hero Section */}
        {!showApp && (
          <HeroSection 
            locale={locale} 
            onGetStarted={handleGetStarted}
          />
        )}

        {/* App Section */}
        {showApp && (
          <section id="app-section" className="min-h-screen py-8">
            <div className="container mx-auto px-4">
              {/* Back to Home Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowApp(false)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>←</span>
                  <span>{locale === 'zh' ? '返回首页' : 'Back to Home'}</span>
                </button>
              </div>

              {/* Main App */}
              <TabsContainer 
                ref={tabsRef}
                locale={locale} 
              />
            </div>
          </section>
        )}



        {/* Features Section - Only show when not in app mode */}
        {!showApp && (
          <section id="features" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {locale === 'zh' ? '强大功能' : 'Powerful Features'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {locale === 'zh' 
                    ? '探索 Refill AI 的全部功能，释放您的创造力'
                    : 'Explore all features of Refill AI and unleash your creativity'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature Cards */}
                {[
                  {
                    icon: "🎨",
                    title: locale === 'zh' ? "AI图像生成" : "AI Image Generation",
                    desc: locale === 'zh' ? "使用先进的AI模型，将文字描述转换为精美图像" : "Use advanced AI models to convert text descriptions into stunning images"
                  },
                  {
                    icon: "🔍",
                    title: locale === 'zh' ? "图像智能分析" : "Smart Image Analysis",
                    desc: locale === 'zh' ? "上传图片，AI自动生成详细的文字描述" : "Upload images and AI automatically generates detailed text descriptions"
                  },
                  {
                    icon: "📝",
                    title: locale === 'zh' ? "提示词模板" : "Prompt Templates",
                    desc: locale === 'zh' ? "丰富的预设模板，帮助您快速创建专业提示词" : "Rich preset templates to help you quickly create professional prompts"
                  },
                  {
                    icon: "📱",
                    title: locale === 'zh' ? "响应式设计" : "Responsive Design",
                    desc: locale === 'zh' ? "完美适配各种设备，随时随地创作" : "Perfect adaptation to various devices, create anytime, anywhere"
                  },
                  {
                    icon: "⚡",
                    title: locale === 'zh' ? "快速生成" : "Fast Generation",
                    desc: locale === 'zh' ? "优化的生成流程，通常10-30秒完成" : "Optimized generation process, usually completed in 10-30 seconds"
                  },
                  {
                    icon: "🔒",
                    title: locale === 'zh' ? "隐私保护" : "Privacy Protection",
                    desc: locale === 'zh' ? "所有数据本地存储，关闭页面自动清除" : "All data stored locally, automatically cleared when page is closed"
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="text-4xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
                    <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section - 用户评价 */}
        {!showApp && <TestimonialsSection locale={locale} />}

        {/* FAQ Section - Only show when not in app mode */}
        {!showApp && <FAQSection locale={locale} />}
      </main>

      {/* Footer - Only show when not in app mode */}
      {!showApp && <Footer locale={locale} />}

      {/* Keyboard Shortcuts - Always available */}
      <KeyboardShortcuts 
        locale={locale}
        {...handleKeyboardShortcuts}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      </div>
  );
}
