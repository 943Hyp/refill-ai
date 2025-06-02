"use client";

import { useState } from "react";
import ImageGenerator from "./ImageGenerator";
import ImageToPrompt from "./ImageToPrompt";
import HistoryView from "./HistoryView";
import { Button } from "@/components/ui/button";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'reverse' | 'history'>('generate');

  return (
    <div className="w-full max-w-5xl mx-auto border border-border rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm glow-effect">
      <div className="flex border-b border-border">
        <Button
          onClick={() => setActiveTab('generate')}
          variant="ghost"
          className={`flex-1 rounded-none py-3 ${
            activeTab === 'generate'
              ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-white border-b-2 border-primary'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          AI Image Generator
        </Button>
        <Button
          onClick={() => setActiveTab('reverse')}
          variant="ghost"
          className={`flex-1 rounded-none py-3 ${
            activeTab === 'reverse'
              ? 'bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-white border-b-2 border-secondary'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          Image to Prompt
        </Button>
        <Button
          onClick={() => setActiveTab('history')}
          variant="ghost"
          className={`flex-1 rounded-none py-3 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-violet-500/20 to-orange-500/20 text-white border-b-2 border-tertiary'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          History
        </Button>
      </div>

      <div className="p-1">
        {activeTab === 'generate' ? (
          <ImageGenerator />
        ) : activeTab === 'reverse' ? (
          <ImageToPrompt />
        ) : (
          <HistoryView />
        )}
      </div>
    </div>
  );
};

export default TabsContainer;
