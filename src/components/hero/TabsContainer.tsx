"use client";

import { useState } from "react";
import ImageGenerator from "./ImageGenerator";
import ImageToPrompt from "./ImageToPrompt";
import HistoryView from "./HistoryView";
import PromptTemplates from "../prompt-templates/PromptTemplates";
import { Button } from "@/components/ui/button";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'reverse' | 'templates' | 'history'>('generate');

  const tabs = [
    {
      id: 'generate',
      label: '文生图',
      icon: '🎨',
      gradient: 'from-pink-500/20 to-violet-500/20',
      border: 'border-primary'
    },
    {
      id: 'reverse',
      label: '图生文',
      icon: '🔍',
      gradient: 'from-blue-500/20 to-teal-500/20',
      border: 'border-secondary'
    },
    {
      id: 'templates',
      label: '模板',
      icon: '📝',
      gradient: 'from-green-500/20 to-blue-500/20',
      border: 'border-green-500'
    },
    {
      id: 'history',
      label: '历史',
      icon: '📚',
      gradient: 'from-violet-500/20 to-orange-500/20',
      border: 'border-tertiary'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto border border-border rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm glow-effect">
      {/* Desktop Tabs */}
      <div className="hidden sm:flex border-b border-border">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            variant="ghost"
            className={`flex-1 rounded-none py-3 transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.gradient} text-white border-b-2 ${tab.border}`
                : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Mobile Tabs */}
      <div className="sm:hidden border-b border-border">
        <div className="grid grid-cols-2 gap-0">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant="ghost"
              className={`rounded-none py-3 text-xs transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white border-b-2 ${tab.border}`
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-1">
        {activeTab === 'generate' ? (
          <ImageGenerator />
        ) : activeTab === 'reverse' ? (
          <ImageToPrompt />
        ) : activeTab === 'templates' ? (
          <PromptTemplates />
        ) : (
          <HistoryView />
        )}
      </div>
    </div>
  );
};

export default TabsContainer;
