"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Locale, getTranslation } from '@/lib/i18n';
import LoginModal from '@/components/auth/LoginModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const Header = ({ locale, onLocaleChange }: HeaderProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLoginButton] = useState(false); // 隐藏登录按钮，备用

  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Refill AI
            </span>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#generate" className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'zh' ? '图像生成' : 'Generate'}
            </a>
            <a href="#analyze" className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'zh' ? '图像分析' : 'Analyze'}
            </a>
            <a href="#history" className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'zh' ? '历史' : 'History'}
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              {locale === 'zh' ? '常见问题' : 'FAQ'}
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Free Badge */}
            <div className="hidden sm:flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium text-green-400">
              <span>🆓</span>
              <span>{locale === 'zh' ? '完全免费' : 'Free'}</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLocaleChange(locale === 'zh' ? 'en' : 'zh')}
              className="w-9 h-9 p-0 hover:bg-muted/50 transition-colors"
              title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <span className="text-sm font-medium">
                {locale === 'zh' ? 'EN' : '中'}
              </span>
            </Button>

            {/* Login Button - Hidden by default, for future use */}
            {showLoginButton && (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                size="sm"
                className="hidden sm:flex"
              >
                <span className="mr-1">👤</span>
                {locale === 'zh' ? '登录' : 'Login'}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-9 h-9 p-0"
            >
              <span className="text-lg">☰</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Can be expanded later */}
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#generate" className="font-medium hover:text-primary transition-colors">
                {locale === 'zh' ? '图像生成' : 'Generate'}
              </a>
              <a href="#analyze" className="font-medium hover:text-primary transition-colors">
                {locale === 'zh' ? '图像分析' : 'Analyze'}
              </a>
              <a href="#history" className="font-medium hover:text-primary transition-colors">
                {locale === 'zh' ? '历史' : 'History'}
              </a>
              <a href="#faq" className="font-medium hover:text-primary transition-colors">
                {locale === 'zh' ? '常见问题' : 'FAQ'}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        locale={locale}
      />
    </>
  );
};

export default Header; 