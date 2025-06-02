"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DynamicLogo from '@/components/logo/DynamicLogo';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 md:px-10 border-b border-[#3b2d60] fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <DynamicLogo />

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            特点
          </Link>
          <Link href="#faq" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            常见问题
          </Link>
          <Link href="#pricing" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            价格
          </Link>
          <Link href="#experimental" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            实验功能
          </Link>
          <div aria-hidden="true" className="h-6 w-px bg-border" />
          <div className="relative group">
            <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
              <span>中文</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-24 bg-card border border-border rounded-md shadow-lg hidden group-hover:block border-glow">
              <Link href="/en" className="block px-4 py-2 text-sm hover:bg-secondary/20 transition-colors cursor-glow">
                English
              </Link>
              <Link href="/zh" className="block px-4 py-2 text-sm hover:bg-secondary/20 transition-colors cursor-glow">
                中文
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <Button className="gradient-button text-white font-medium border-none rounded-full px-6 py-2 shadow-md">
            登录
          </Button>
          <Button className="md:hidden bg-secondary/10 border-none text-foreground hover:bg-secondary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M4 12h16M4 6h16M4 18h16"/>
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
