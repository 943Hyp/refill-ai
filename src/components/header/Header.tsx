"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DynamicLogo from '@/components/logo/DynamicLogo';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-6 md:px-10 border-b border-[#3b2d60] fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <DynamicLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            功能特点
          </Link>
          <Link href="#gallery" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            作品展示
          </Link>
          <Link href="#faq" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            常见问题
          </Link>
          <Link href="#about" className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow">
            关于我们
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

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Button 
            className="md:hidden bg-secondary/10 border-none text-foreground hover:bg-secondary/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M4 12h16M4 6h16M4 18h16"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border">
          <nav className="flex flex-col space-y-4 p-6">
            <Link 
              href="#features" 
              className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              功能特点
            </Link>
            <Link 
              href="#gallery" 
              className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              作品展示
            </Link>
            <Link 
              href="#faq" 
              className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              常见问题
            </Link>
            <Link 
              href="#about" 
              className="text-foreground hover:text-primary transition-colors duration-300 cursor-glow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              关于我们
            </Link>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground/70">语言:</span>
                <Link href="/zh" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  中文
                </Link>
                <Link href="/en" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  English
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
