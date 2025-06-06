"use client";

import { Button } from "@/components/ui/button";
import { Locale } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

const Footer = ({ locale }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: locale === 'zh' ? '产品' : 'Product',
      links: [
        { name: locale === 'zh' ? 'AI图像生成' : 'AI Image Generation', href: '#generate' },
        { name: locale === 'zh' ? '图像分析' : 'Image Analysis', href: '#analyze' },
        { name: locale === 'zh' ? '历史记录' : 'History', href: '#history' }
      ]
    },
    resources: {
      title: locale === 'zh' ? '资源' : 'Resources',
      links: [
        { name: locale === 'zh' ? '使用指南' : 'User Guide', href: '#guide' },
        { name: locale === 'zh' ? '常见问题' : 'FAQ', href: '#faq' },
        { name: locale === 'zh' ? '提示词技巧' : 'Prompt Tips', href: '#tips' },
        { name: locale === 'zh' ? '更新日志' : 'Changelog', href: '#changelog' }
      ]
    },
    company: {
      title: locale === 'zh' ? '公司' : 'Company',
      links: [
        { name: locale === 'zh' ? '关于我们' : 'About Us', href: '#about' },
        { name: locale === 'zh' ? '联系我们' : 'Contact', href: '#contact' },
        { name: locale === 'zh' ? '隐私政策' : 'Privacy Policy', href: '#privacy' },
        { name: locale === 'zh' ? '服务条款' : 'Terms of Service', href: '#terms' }
      ]
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', href: 'https://github.com' },
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
    { name: 'Discord', icon: '💬', href: 'https://discord.com' },
    { name: 'Email', icon: '📧', href: 'mailto:contact@refill-ai.com' }
  ];

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold">Refill AI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {locale === 'zh' 
                ? '免费的AI图像生成平台，让创意无限绽放。无需注册，即刻开始您的创作之旅。'
                : 'Free AI image generation platform that unleashes unlimited creativity. No registration required, start your creative journey now.'
              }
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0"
                  asChild
                >
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h3 className="font-semibold text-lg">
              {locale === 'zh' ? '获取最新更新' : 'Stay Updated'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {locale === 'zh' 
                ? '订阅我们的邮件列表，获取最新功能和更新通知'
                : 'Subscribe to our newsletter for the latest features and updates'
              }
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder={locale === 'zh' ? '输入您的邮箱' : 'Enter your email'}
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
              />
              <Button size="sm">
                {locale === 'zh' ? '订阅' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Refill AI. {locale === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span>🆓</span>
                {locale === 'zh' ? '完全免费' : 'Completely Free'}
              </span>
              <span className="flex items-center gap-1">
                <span>🔒</span>
                {locale === 'zh' ? '隐私保护' : 'Privacy Protected'}
              </span>
              <span className="flex items-center gap-1">
                <span>⚡</span>
                {locale === 'zh' ? '无需登录' : 'No Login Required'}
              </span>
            </div>
          </div>
        </div>

        {/* Free Notice */}
        <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-2xl">🎉</span>
            <span className="text-green-400 font-medium">
              {locale === 'zh' 
                ? '永久免费使用，无任何隐藏费用！'
                : 'Forever free to use, no hidden costs!'
              }
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 