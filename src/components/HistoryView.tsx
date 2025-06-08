"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory, type GeneratedImage } from "@/lib/api";
import { toast } from "sonner";
import { Locale, getTranslation } from '@/lib/i18n';

interface HistoryViewProps {
  setPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
  locale: Locale;
}

const HistoryView = ({ setPrompt, setActiveTab, locale }: HistoryViewProps) => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'prompt'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'style' | 'quality' | 'aspect'>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  useEffect(() => {
    const loadHistoryData = async () => {
      setIsLoading(true);
      try {
        const historyData = await getHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load history:', error);
        toast.error(locale === 'zh' ? '加载历史记录失败' : 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoryData();
  }, [locale]);

  const getFilterOptions = () => {
    if (filterBy === 'style') {
      const styles = [...new Set(history.map(item => item.style).filter(Boolean))];
      return styles.map(style => ({ value: style!, label: style! }));
    }
    if (filterBy === 'quality') {
      const qualities = [...new Set(history.map(item => item.quality).filter(Boolean))];
      return qualities.map(quality => ({ value: quality!, label: quality! }));
    }
    if (filterBy === 'aspect') {
      const aspects = [...new Set(history.map(item => item.aspectRatio).filter(Boolean))];
      return aspects.map(aspect => ({ value: aspect!, label: aspect! }));
    }
    return [];
  };

  // 将多图片记录展开为单图片记录
  const expandedHistory = history.flatMap(item => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      // 如果有多张图片，为每张图片创建一个独立的记录
      return item.imageUrls.map((imageUrl, index) => ({
        ...item,
        id: `${item.id}-${index}`,
        imageUrl: imageUrl,
        imageUrls: undefined, // 清除多图片数组
        prompt: `${item.prompt} (${index + 1}/4)` // 添加图片编号
      }));
    } else {
      // 如果只有单张图片，保持原样
      return [item];
    }
  });

  const filteredAndSortedHistory = expandedHistory
    .filter(item => {
      // Search filter
      const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      if (filterBy === 'all' || selectedFilter === 'all') return matchesSearch;
      if (filterBy === 'style') return matchesSearch && item.style === selectedFilter;
      if (filterBy === 'quality') return matchesSearch && item.quality === selectedFilter;
      if (filterBy === 'aspect') return matchesSearch && item.aspectRatio === selectedFilter;
      
      return matchesSearch;
    })
    .sort((a, b) => {
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

  const handleClearHistory = async () => {
    if (window.confirm(locale === 'zh' ? '确定要清空所有历史记录吗？此操作不可撤销。' : 'Are you sure you want to clear all history? This action cannot be undone.')) {
      try {
        await clearHistory();
        setHistory([]);
        setSelectedItems(new Set());
        toast.success(locale === 'zh' ? '历史记录已清空' : 'History cleared');
      } catch (error) {
        toast.error(locale === 'zh' ? '清空失败' : 'Failed to clear history');
      }
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedHistory.map(item => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;
    
    if (window.confirm(locale === 'zh' ? `确定要删除选中的 ${selectedItems.size} 个项目吗？` : `Delete ${selectedItems.size} selected items?`)) {
      const newHistory = history.filter(item => !selectedItems.has(item.id));
      setHistory(newHistory);
      setSelectedItems(new Set());
      toast.success(locale === 'zh' ? '已删除选中项目' : 'Selected items deleted');
    }
  };

  const handleExportHistory = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalItems: history.length,
        items: history.map(item => ({
          prompt: item.prompt,
          timestamp: item.timestamp,
          style: item.style,
          quality: item.quality,
          aspectRatio: item.aspectRatio,
        }))
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `refill-ai-history-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(locale === 'zh' ? '历史记录已导出' : 'History exported');
    } catch (error) {
      toast.error(locale === 'zh' ? '导出失败' : 'Export failed');
    }
  };

  const handleBatchDownload = () => {
    if (selectedItems.size === 0) return;
    
    const selectedHistory = history.filter(item => selectedItems.has(item.id));
    selectedHistory.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.imageUrl;
        link.download = `refill-ai-${item.id}.png`;
        link.click();
      }, index * 500); // Stagger downloads
    });
    
    toast.success(locale === 'zh' ? `开始下载 ${selectedItems.size} 张图像` : `Starting download of ${selectedItems.size} images`);
  };



  const handleDownloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.click();
    toast.success(t('imageDownloaded'));
  };

  const handleDownloadAllImages = (imageUrls: string[], prompt: string) => {
    imageUrls.forEach((imageUrl, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}-${index + 1}-${Date.now()}.png`;
        link.click();
      }, index * 500); // 延迟下载避免浏览器阻止
    });
    toast.success(locale === 'zh' ? `开始下载 ${imageUrls.length} 张图片` : `Starting download of ${imageUrls.length} images`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return locale === 'zh' ? '刚刚' : 'Just now';
    } else if (diffInHours < 24) {
      return locale === 'zh' ? `${Math.floor(diffInHours)}小时前` : `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return locale === 'zh' ? `${Math.floor(diffInHours / 24)}天前` : `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(date);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">{locale === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">{t('noHistory')}</h3>
          <p className="text-muted-foreground mb-6">{t('noHistoryDescription')}</p>
          <Button onClick={() => setActiveTab('text-to-image')} className="mt-4">
            <span className="mr-2">🎨</span>
            {locale === 'zh' ? '开始创作' : 'Start Creating'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('generationHistory')}</h2>
            <p className="text-sm text-muted-foreground">
              {locale === 'zh' ? `共 ${history.length} 个项目` : `${history.length} items total`}
              {filteredAndSortedHistory.length !== history.length && 
                ` (${locale === 'zh' ? '显示' : 'showing'} ${filteredAndSortedHistory.length})`
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
            >
              {viewMode === 'grid' ? '📋' : '⊞'}
            </Button>
            <Button onClick={handleExportHistory} variant="outline" size="sm">
              <span className="mr-1">📤</span>
              {locale === 'zh' ? '导出' : 'Export'}
            </Button>
            <Button onClick={handleClearHistory} variant="outline" size="sm">
              <span className="mr-1">🗑️</span>
              {t('clearHistory')}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder={t('searchHistory')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'prompt')}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="newest">{locale === 'zh' ? '最新' : 'Newest'}</option>
                <option value="oldest">{locale === 'zh' ? '最旧' : 'Oldest'}</option>
                <option value="prompt">{locale === 'zh' ? '提示词' : 'Prompt'}</option>
              </select>
              <select
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value as 'all' | 'style' | 'quality' | 'aspect');
                  setSelectedFilter('all');
                }}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">{locale === 'zh' ? '全部' : 'All'}</option>
                <option value="style">{locale === 'zh' ? '风格' : 'Style'}</option>
                <option value="quality">{locale === 'zh' ? '质量' : 'Quality'}</option>
                <option value="aspect">{locale === 'zh' ? '比例' : 'Aspect'}</option>
              </select>
            </div>
          </div>

          {/* Filter Options */}
          {filterBy !== 'all' && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedFilter('all')}
                variant={selectedFilter === 'all' ? "default" : "outline"}
                size="sm"
              >
                {locale === 'zh' ? '全部' : 'All'}
              </Button>
              {getFilterOptions().map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  variant={selectedFilter === option.value ? "default" : "outline"}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          {/* Batch Operations */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              onClick={handleSelectAll}
              variant="outline"
              size="sm"
            >
              {selectedItems.size === filteredAndSortedHistory.length ? 
                (locale === 'zh' ? '取消全选' : 'Deselect All') : 
                (locale === 'zh' ? '全选' : 'Select All')
              }
            </Button>
            {selectedItems.size > 0 && (
              <>
                <Button
                  onClick={handleDeleteSelected}
                  variant="destructive"
                  size="sm"
                >
                  <span className="mr-1">🗑️</span>
                  {t('deleteSelected')} ({selectedItems.size})
                </Button>
                <Button
                  onClick={handleBatchDownload}
                  variant="outline"
                  size="sm"
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path 
                      d="M12 3V16M12 16L8 12M12 16L16 12M4 21H20" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  {locale === 'zh' ? '批量下载' : 'Batch Download'} ({selectedItems.size})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* History Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredAndSortedHistory.map((item) => (
              <div
                key={item.id}
                className={`group bg-background/50 rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden ${
                  selectedItems.has(item.id) ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
              >
                {/* 图片区域 */}
                <div className="relative">
                  {/* 选择框 */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 rounded border-2 border-white/70 bg-black/20 backdrop-blur-sm"
                    />
                  </div>
                  
                  {/* 时间标签 */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {getRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  
                  {/* 显示单张图片 */}
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt="Generated"
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    
                    {/* 悬停时显示的操作按钮 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownloadImage(item.imageUrl, item.prompt);
                          }}
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-lg"
                          title={locale === 'zh' ? '下载图片' : 'Download image'}
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-700"
                          >
                            <path 
                              d="M12 3V16M12 16L8 12M12 16L16 12M4 21H20" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Button>
                        <Button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await navigator.clipboard.writeText(item.imageUrl);
                              toast.success(locale === 'zh' ? '图片链接已复制' : 'Image link copied');
                            } catch (error) {
                              const textArea = document.createElement('textarea');
                              textArea.value = item.imageUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              toast.success(locale === 'zh' ? '图片链接已复制' : 'Image link copied');
                            }
                          }}
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-lg"
                          title={locale === 'zh' ? '分享图片' : 'Share image'}
                        >
                          <span className="text-gray-700 text-xs">🔗</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-4 space-y-3">
                  {/* 标签区域 */}
                  <div className="flex flex-wrap gap-1">
                    {item.style && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {item.style}
                      </span>
                    )}
                    {item.quality && (
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                        {item.quality}
                      </span>
                    )}
                    {item.aspectRatio && (
                      <span className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-full">
                        {item.aspectRatio}
                      </span>
                    )}
                  </div>
                  
                  {/* 提示词 */}
                  <p className="text-sm line-clamp-3 leading-relaxed text-foreground/80">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedHistory.map((item) => (
              <div
                key={item.id}
                className={`group p-4 bg-background/50 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  selectedItems.has(item.id) ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mt-1 flex-shrink-0 w-4 h-4"
                  />
                  
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt="Generated"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm leading-relaxed flex-1 text-foreground/90">{item.prompt}</p>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-muted-foreground block mb-2">
                          {getRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* 标签和操作区域 */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {item.style && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {item.style}
                          </span>
                        )}
                        {item.quality && (
                          <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                            {item.quality}
                          </span>
                        )}
                        {item.aspectRatio && (
                          <span className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-full">
                            {item.aspectRatio}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          onClick={() => {
                            handleDownloadImage(item.imageUrl, item.prompt);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                        >
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1"
                          >
                            <path 
                              d="M12 3V16M12 16L8 12M12 16L16 12M4 21H20" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                          {t('downloadImage')}
                        </Button>
                        <Button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(item.imageUrl);
                              toast.success(locale === 'zh' ? '图片链接已复制' : 'Image link copied');
                            } catch (error) {
                              const textArea = document.createElement('textarea');
                              textArea.value = item.imageUrl;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              toast.success(locale === 'zh' ? '图片链接已复制' : 'Image link copied');
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                        >
                          🔗 {locale === 'zh' ? '分享' : 'Share'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedHistory.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground">
              {locale === 'zh' ? '没有找到匹配的历史记录' : 'No matching history found'}
            </p>
            <Button 
              onClick={() => setSearchTerm("")} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              {locale === 'zh' ? '清除搜索' : 'Clear Search'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView; 
 