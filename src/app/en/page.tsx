"use client";

import { Suspense } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import TabsContainer from '@/components/TabsContainer';
import FAQSection from '@/components/sections/FAQSection';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';

export default function EnglishPage() {
  const handleGetStarted = () => {
    const tabsElement = document.querySelector('[data-tabs-container]');
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <HeroSection locale="en" onGetStarted={handleGetStarted} />
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <div data-tabs-container>
            <TabsContainer locale="en" />
          </div>
        </Suspense>
        
        <FAQSection locale="en" />
        <KeyboardShortcuts locale="en" />
      </main>
    </div>
  );
} 