"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DynamicLogo from '@/components/logo/DynamicLogo';
import { useState } from 'react';
import { Locale, getTranslation } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
}

const Header = ({ locale }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  const navigationItems = [
    { href: "#features", label: t('features'), icon: "✨" },
    { href: "#gallery", label: t('gallery'), icon: "🖼️" },
    { href: "#faq", label: t('faq'), icon: "❓" },
    { href: "#about", label: t('about'), icon: "ℹ️" },
  ];

  return (
    <header className="w-full py-4 px-4 sm:px-6 md:px-10 border-b border-[#3b2d60] fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <DynamicLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow flex items-center gap-2"
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          <div aria-hidden="true" className="h-6 w-px bg-border" />
          
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
              <span>🌐</span>
              <span>{t('language')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-glow">
              <Link href="/" className="block px-4 py-3 text-sm hover:bg-secondary/20 transition-colors cursor-glow flex items-center gap-2">
                <span>🇨🇳</span>
                中文
              </Link>
              <Link href="/en" className="block px-4 py-3 text-sm hover:bg-secondary/20 transition-colors cursor-glow flex items-center gap-2">
                <span>🇺🇸</span>
                English
              </Link>
            </div>
          </div>

          {/* Free Badge */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full px-3 py-1 text-xs font-medium">
            <span className="mr-1">🆓</span>
            {locale === 'zh' ? '完全免费' : '100% Free'}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Mobile Free Badge */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full px-2 py-1 text-xs font-medium">
            <span className="mr-1">🆓</span>
            {locale === 'zh' ? '免费' : 'Free'}
          </div>
          
          <Button 
            className="bg-secondary/10 border-none text-foreground hover:bg-secondary/20 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`h-5 w-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16"/>
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg">
          <nav className="flex flex-col p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center gap-3 p-3 text-foreground hover:text-primary hover:bg-secondary/10 rounded-lg transition-all duration-200 cursor-glow"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-border my-2"></div>
            
            {/* Mobile Language Selector */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 text-sm text-foreground/70">
                <span className="text-lg">🌐</span>
                <span>{locale === 'zh' ? '语言选择' : 'Language'}</span>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-3 p-3 ml-6 text-sm text-primary hover:text-primary/80 hover:bg-secondary/10 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🇨🇳</span>
                中文
              </Link>
              <Link 
                href="/en" 
                className="flex items-center gap-3 p-3 ml-6 text-sm text-foreground/70 hover:text-primary hover:bg-secondary/10 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🇺🇸</span>
                English
              </Link>
            </div>

            <div className="border-t border-border my-2"></div>

            {/* Mobile Features */}
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>🎉</span>
                {locale === 'zh' ? '免费特性' : 'Free Features'}
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• {locale === 'zh' ? '无需注册登录' : 'No registration required'}</li>
                <li>• {locale === 'zh' ? '无限制使用' : 'Unlimited usage'}</li>
                <li>• {locale === 'zh' ? '高质量图像生成' : 'High-quality image generation'}</li>
                <li>• {locale === 'zh' ? '多种艺术风格' : 'Multiple art styles'}</li>
              </ul>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header; 