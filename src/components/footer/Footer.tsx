"use client";

import Link from 'next/link';
import DynamicLogo from '@/components/logo/DynamicLogo';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-card/20 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <DynamicLogo />
            <p className="text-sm text-foreground/70">
              Refill AI 是免费无限制的 AI 图像生成器。100%免费，无需注册，无需登录，无限生成。
            </p>
            <p className="text-xs text-foreground/50">
              © {new Date().getFullYear()} • Refill AI 保留所有权利
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-glow">关于</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  博客
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  职业机会
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-glow">工具</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  图像生成
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  图片反推提示词
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  提示词优化
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  API集成
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-glow">隐私</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  Cookie 政策
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors cursor-glow">
                  内容政策
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
