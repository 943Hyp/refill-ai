"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { PromptContext } from "@/app/ClientBody";
import { getHistory, clearHistory } from "@/lib/api";
import { toast } from "sonner";

interface HistoryItem {
  id: number;
  prompt: string;
  imageBase64: string;
  timestamp: string;
}

const HistoryView = () => {
  const { setPrompt } = useContext(PromptContext);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'prompt'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, sortBy]);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const historyData = getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("加载历史记录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = history;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = history.filter(item =>
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'prompt':
          return a.prompt.localeCompare(b.prompt);
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const handleClearHistory = () => {
    if (window.confirm("确定要清除所有历史记录吗？此操作无法撤销。")) {
      try {
        clearHistory();
        setHistory([]);
        setSelectedItems(new Set());
        toast.success("历史记录已清除");
      } catch (error) {
        console.error("Error clearing history:", error);
        toast.error("清除历史记录失败");
      }
    }
  };

  const handleUsePrompt = (prompt: string) => {
    setPrompt(prompt);
    toast.success("提示词已应用到生成器");
  };

  const handleDownloadImage = (imageBase64: string, prompt: string) => {
    try {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${imageBase64}`;
      link.download = `refill-ai-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.png`;
      link.click();
      toast.success("图像下载成功");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("下载失败");
    }
  };

  const handleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map(item => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;

    if (window.confirm(`确定要删除选中的 ${selectedItems.size} 个项目吗？`)) {
      try {
        const newHistory = history.filter(item => !selectedItems.has(item.id));
        // Update localStorage
        localStorage.setItem('imageHistory', JSON.stringify(newHistory));
        setHistory(newHistory);
        setSelectedItems(new Set());
        toast.success(`已删除 ${selectedItems.size} 个项目`);
      } catch (error) {
        console.error("Error deleting items:", error);
        toast.error("删除失败");
      }
    }
  };

  const handleExportSelected = () => {
    if (selectedItems.size === 0) return;

    try {
      const selectedData = history.filter(item => selectedItems.has(item.id));
      const dataStr = JSON.stringify(selectedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `refill-ai-history-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast.success("历史记录导出成功");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("导出失败");
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
        <p className="text-foreground/70">加载历史记录中...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center">
            <span className="mr-2">📚</span>
            生成历史
          </h2>
          <p className="text-sm text-foreground/60 mt-1">
            {history.length > 0 ? `共 ${history.length} 个项目` : "暂无历史记录"}
          </p>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClearHistory}
            >
              🗑️ 清空
            </Button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground/80 mb-2">暂无历史记录</h3>
          <p className="text-sm text-foreground/60 max-w-sm">
            开始生成图像后，您的创作历史将显示在这里。所有记录都保存在本地，保护您的隐私。
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索提示词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="newest">最新优先</option>
              <option value="oldest">最旧优先</option>
              <option value="prompt">按提示词排序</option>
            </select>
          </div>

          {/* Batch Actions */}
          {selectedItems.size > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-sm text-primary font-medium">
                  已选择 {selectedItems.size} 个项目
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleExportSelected}
                  >
                    📤 导出
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={handleDeleteSelected}
                  >
                    🗑️ 删除
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Info */}
          {searchTerm && (
            <div className="text-sm text-foreground/60">
              {filteredHistory.length > 0 
                ? `找到 ${filteredHistory.length} 个匹配项目` 
                : "未找到匹配的项目"
              }
            </div>
          )}

          {/* Select All */}
          {filteredHistory.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {selectedItems.size === filteredHistory.length ? "取消全选" : "全选"}
              </button>
            </div>
          )}

          {/* History Items */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">没有找到匹配的历史记录</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`group relative border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg ${
                    selectedItems.has(item.id) ? 'ring-2 ring-primary/50 border-primary' : ''
                  } ${viewMode === 'list' ? 'flex items-center space-x-4 p-3' : 'bg-card/30'}`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => handleSelectItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedItems.has(item.id)
                          ? 'bg-primary border-primary'
                          : 'border-gray-400 bg-background/80 hover:border-primary'
                      }`}
                    >
                      {selectedItems.has(item.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {viewMode === 'grid' ? (
                    <>
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={`data:image/png;base64,${item.imageBase64}`}
                          alt="Generated image"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-2">
                        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                          {item.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-foreground/60">
                          <span>{formatDate(item.timestamp)}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleUsePrompt(item.prompt)}
                              className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                              title="使用此提示词"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h6v6" />
                                <path d="M10 14 21 3" />
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownloadImage(item.imageBase64, item.prompt)}
                              className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                              title="下载图像"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded border border-border ml-7">
                        <img
                          src={`data:image/png;base64,${item.imageBase64}`}
                          alt="Generated image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/80 line-clamp-2 mb-1">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <div className="flex space-x-1 flex-shrink-0">
                        <button
                          onClick={() => handleUsePrompt(item.prompt)}
                          className="p-2 hover:bg-primary/10 rounded transition-colors"
                          title="使用此提示词"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownloadImage(item.imageBase64, item.prompt)}
                          className="p-2 hover:bg-primary/10 rounded transition-colors"
                          title="下载图像"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryView;
