"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageGenerator from '@/components/ImageGenerator';
import ImageToPrompt from '@/components/ImageToPrompt';
import HistoryView from '@/components/HistoryView';
import PromptTemplates from '@/components/PromptTemplates';
import UsageLimitsInfo from '@/components/UsageLimitsInfo';
import { Locale, getTranslation } from '@/lib/i18n';

interface TabsContainerProps {
  locale: Locale;
}

export interface TabsContainerRef {
  handleGenerate: () => void;
  handleClear: () => void;
  handleToggleHistory: () => void;
}

const TabsContainer = forwardRef<TabsContainerRef, TabsContainerProps>(
  ({ locale }, ref) => {
    const [activeTab, setActiveTab] = useState('generate');
    const imageGeneratorRef = useRef<{ 
      handleGenerate: () => void; 
      handleClear: () => void; 
      setPrompt: (prompt: string) => void;
    }>(null);
    const imageToPromptRef = useRef<{ 
      handleClear: () => void; 
    }>(null);

    const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

    useImperativeHandle(ref, () => ({
      handleGenerate: () => {
        if (activeTab === 'generate') {
          imageGeneratorRef.current?.handleGenerate();
        }
      },
      handleClear: () => {
        if (activeTab === 'generate') {
          imageGeneratorRef.current?.handleClear();
        } else if (activeTab === 'analyze') {
          imageToPromptRef.current?.handleClear();
        }
      },
      handleToggleHistory: () => {
        setActiveTab(activeTab === 'history' ? 'generate' : 'history');
      }
    }));

    const tabs = [
      {
        id: 'generate',
        label: locale === 'zh' ? '图像生成' : 'Generate',
        icon: '🎨'
      },
      {
        id: 'analyze', 
        label: locale === 'zh' ? '图像分析' : 'Analyze',
        icon: '🔍'
      },
      {
        id: 'templates',
        label: locale === 'zh' ? '模板' : 'Templates', 
        icon: '📝'
      },
      {
        id: 'history',
        label: locale === 'zh' ? '历史' : 'History',
        icon: '📚'
      }
    ];

    return (
      <div className="w-full max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-muted/50 backdrop-blur-sm">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Usage Limits Info - Hidden from users */}

          {/* Tab Content */}
          <div className="min-h-[600px]">
            <TabsContent value="generate" className="mt-0">
              <ImageGenerator 
                ref={imageGeneratorRef}
                locale={locale} 
              />
            </TabsContent>

            <TabsContent value="analyze" className="mt-0">
              <ImageToPrompt 
                ref={imageToPromptRef}
                locale={locale} 
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <PromptTemplates 
                locale={locale}
                setPrompt={(prompt) => {
                  // Switch to generate tab and set the prompt
                  setActiveTab('generate');
                  // Pass the prompt to ImageGenerator
                  if (imageGeneratorRef.current) {
                    imageGeneratorRef.current.setPrompt(prompt);
                  }
                }}
                setActiveTab={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <HistoryView 
                locale={locale}
                setPrompt={(prompt) => {
                  // Switch to generate tab and set the prompt
                  setActiveTab('generate');
                  // Pass the prompt to ImageGenerator
                  if (imageGeneratorRef.current) {
                    imageGeneratorRef.current.setPrompt(prompt);
                  }
                }}
                setActiveTab={setActiveTab}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }
);

TabsContainer.displayName = 'TabsContainer';

export default TabsContainer; 