"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory } from "@/lib/api";
import { PromptContext } from "@/app/ClientBody";
import { toast } from "sonner";

interface HistoryEntry {
  id: number;
  prompt: string;
  imageBase64: string;
  timestamp: string;
}

const HistoryView = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setPrompt } = useContext(PromptContext);

  useEffect(() => {
    // Load history when component mounts
    const loadHistory = () => {
      try {
        const historyData = getHistory();
        setHistory(historyData);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleReusePrompt = (entry: HistoryEntry) => {
    setPrompt(entry.prompt);
    toast.success("Prompt loaded!");
  };

  const handleClearHistory = () => {
    try {
      clearHistory();
      setHistory([]);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="p-8 bg-card/30 border border-border rounded-lg">
          <h3 className="text-lg font-medium text-foreground mb-2">No History Yet</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Generate some images and they will appear here. Your history is stored locally in your browser.
          </p>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground/30"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M21 9H3" />
              <path d="M9 21V9" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Generation History</h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleClearHistory}
        >
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="bg-card/30 border border-border rounded-lg p-4 space-y-3 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-md overflow-hidden border border-border flex-shrink-0">
                <img
                  src={`data:image/png;base64,${entry.imageBase64}`}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <p className="text-sm text-foreground/70 truncate">{entry.prompt}</p>
                  <p className="text-xs text-foreground/50 mt-1">{formatDate(entry.timestamp)}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={() => handleReusePrompt(entry)}
                  >
                    Use Prompt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-full"
                    onClick={() => {
                      // Create a link to download the image
                      const link = document.createElement("a");
                      link.href = `data:image/png;base64,${entry.imageBase64}`;
                      link.download = `refill-ai-${Date.now()}.png`;
                      link.click();
                      toast.success("Image downloaded successfully!");
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
