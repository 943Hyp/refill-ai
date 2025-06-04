// Enhanced API functionality with retry, caching, and better error handling

export interface StyleOptions {
  style?: string;
  quality?: string;
  aspectRatio?: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  style?: string;
  quality?: string;
  aspectRatio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Enhanced mock images with better variety
const mockImages = [
  "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
  "https://images.unsplash.com/photo-1682687982183-c2937a37a21a", 
  "https://images.unsplash.com/photo-1682695796497-31a44224d6d6",
  "https://images.unsplash.com/photo-1688891584219-6e753d5acef8",
  "https://images.unsplash.com/photo-1688891584184-6ab9738bd13d",
  "https://images.unsplash.com/photo-1707343843437-caacff5cfa74",
  "https://images.unsplash.com/photo-1707343843982-f8275f3994c5",
  "https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49",
  "https://images.unsplash.com/photo-1707344213306-1b3971e2b9a5",
  "https://images.unsplash.com/photo-1707344088992-4b78e3b8f5e5"
];

// Storage keys
const HISTORY_STORAGE_KEY = 'refill-ai-history';
const FAVORITES_STORAGE_KEY = 'refill-ai-favorites';
const SETTINGS_STORAGE_KEY = 'refill-ai-settings';
const CACHE_STORAGE_KEY = 'refill-ai-cache';

// Cache management
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class ApiClient {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = localStorage.getItem(CACHE_STORAGE_KEY);
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        this.cache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load cache:', error);
    }
  }

  private saveCache() {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheObj = Object.fromEntries(this.cache);
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheObj));
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }

  private getCacheKey(operation: string, params: any): string {
    return `${operation}_${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      this.saveCache();
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.saveCache();
  }

  private async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  }

  async generateImage(params: { 
    prompt: string; 
    style?: string;
    quality?: string;
    aspectRatio?: string;
  }): Promise<{ imageUrl: string }> {
    const cacheKey = this.getCacheKey('generateImage', params);
    const cached = this.getFromCache<{ imageUrl: string }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    return this.retry(async () => {
      // Simulate network delay based on quality
      const delays = { standard: 2000, high: 3000, ultra: 4000 };
      const delay = delays[params.quality as keyof typeof delays] || 2000;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Simulate occasional failures for testing retry mechanism
      if (Math.random() < 0.1) {
        throw new Error('Network timeout - please try again');
      }
      
      // Select image based on style and other parameters
      let imageIndex = Math.floor(Math.random() * mockImages.length);
      
      // Style-based image selection (simplified)
      if (params.style === 'anime') imageIndex = imageIndex % 3;
      else if (params.style === 'photorealistic') imageIndex = (imageIndex % 3) + 3;
      else if (params.style === 'art') imageIndex = (imageIndex % 4) + 6;
      
      const baseUrl = mockImages[imageIndex];
      const imageUrl = `${baseUrl}?w=1024&h=1024&fit=crop&style=${params.style}&quality=${params.quality}&aspect=${params.aspectRatio}&prompt=${encodeURIComponent(params.prompt)}&t=${Date.now()}`;
      
      const result = { imageUrl };
      
      // Cache successful results
      this.setCache(cacheKey, result, 10 * 60 * 1000); // 10 minutes for images
      
      return result;
    });
  }

  async analyzeImage(params: { 
    imageData: string; 
    analysisType: string;
  }): Promise<{ prompt: string }> {
    const cacheKey = this.getCacheKey('analyzeImage', { 
      imageHash: params.imageData.slice(0, 100), // Use partial hash for caching
      analysisType: params.analysisType 
    });
    
    const cached = this.getFromCache<{ prompt: string }>(cacheKey);
    if (cached) {
      return cached;
    }

    return this.retry(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate occasional failures
      if (Math.random() < 0.05) {
        throw new Error('Image analysis service temporarily unavailable');
      }
      
      let prompt = '';
      
      const prompts = {
        detailed: [
          '高细节摄影作品，展现令人惊叹的构图和色彩，使用高端专业摄影设备拍摄，完美的光线条件，8K超高清分辨率，专业级后期处理',
          '精美的艺术作品，富有表现力的色彩搭配，独特的视觉构图，细腻的纹理细节，专业的光影处理，具有强烈的视觉冲击力',
          '专业级摄影作品，完美的曝光控制，丰富的色彩层次，精确的焦点控制，优秀的景深效果，展现了摄影师的高超技艺'
        ],
        simple: [
          '清晰的照片，良好的光线和构图，呈现主题的关键细节',
          '高质量图像，色彩鲜明，构图平衡，视觉效果良好',
          '专业摄影，清晰度高，色彩自然，整体效果出色'
        ],
        artistic: [
          '艺术风格的图像，富有表现力的色彩和构图，有着独特的视觉美感和创意表达',
          '创意艺术作品，独特的艺术风格，富有想象力的视觉表现，具有强烈的艺术感染力',
          '艺术摄影作品，创新的构图理念，独特的色彩运用，展现了艺术家的创作才华'
        ],
        technical: [
          '技术参数优秀的摄影作品，精确的曝光控制，完美的白平衡，专业的色彩管理，高质量的镜头表现',
          '专业摄影技术展示，精准的焦点控制，优秀的景深运用，完美的光线处理，展现了高超的摄影技巧',
          '高技术含量的图像，精确的参数设置，专业的后期处理，完美的技术执行，达到了专业摄影标准'
        ]
      };
      
      const typePrompts = prompts[params.analysisType as keyof typeof prompts] || prompts.detailed;
      prompt = typePrompts[Math.floor(Math.random() * typePrompts.length)];
      
      const result = { prompt };
      
      // Cache analysis results
      this.setCache(cacheKey, result, 30 * 60 * 1000); // 30 minutes
      
      return result;
    });
  }
}

// Singleton instance
const apiClient = new ApiClient();

// Public API functions
export async function generateImage(params: { 
  prompt: string; 
  style?: string;
  quality?: string;
  aspectRatio?: string;
}): Promise<{ imageUrl: string }> {
  return apiClient.generateImage(params);
}

export async function analyzeImage(params: { 
  imageData: string; 
  analysisType: string;
}): Promise<{ prompt: string }> {
  return apiClient.analyzeImage(params);
}

// Enhanced history management
export async function saveToHistory(image: GeneratedImage): Promise<void> {
  const history = await getHistory();
  
  // Avoid duplicates
  const existingIndex = history.findIndex(item => 
    item.prompt === image.prompt && 
    item.style === image.style && 
    item.quality === image.quality
  );
  
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  history.unshift(image);
  
  // Keep only the latest 200 items
  const limitedHistory = history.slice(0, 200);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
  }
}

export async function getHistory(): Promise<GeneratedImage[]> {
  if (typeof window === 'undefined') return [];
  
  const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!historyJson) return [];
  
  try {
    const history = JSON.parse(historyJson);
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to parse history:', error);
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const history = await getHistory();
  const filteredHistory = history.filter(item => item.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredHistory));
  }
}

// Favorites management
export async function addToFavorites(image: GeneratedImage): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const favorites = await getFavorites();
  const exists = favorites.some(item => item.id === image.id);
  
  if (!exists) {
    favorites.unshift(image);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.slice(0, 100)));
  }
}

export async function removeFromFavorites(id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const favorites = await getFavorites();
  const filtered = favorites.filter(item => item.id !== id);
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filtered));
}

export async function getFavorites(): Promise<GeneratedImage[]> {
  if (typeof window === 'undefined') return [];
  
  const favoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!favoritesJson) return [];
  
  try {
    const favorites = JSON.parse(favoritesJson);
    return favorites.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to parse favorites:', error);
    return [];
  }
}

// Settings management
export interface UserSettings {
  defaultStyle: string;
  defaultQuality: string;
  defaultAspectRatio: string;
  autoSaveHistory: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
}

export async function getSettings(): Promise<UserSettings> {
  if (typeof window === 'undefined') {
    return {
      defaultStyle: 'none',
      defaultQuality: 'standard',
      defaultAspectRatio: 'square',
      autoSaveHistory: true,
      theme: 'auto',
      language: 'zh'
    };
  }
  
  const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!settingsJson) {
    return {
      defaultStyle: 'none',
      defaultQuality: 'standard',
      defaultAspectRatio: 'square',
      autoSaveHistory: true,
      theme: 'auto',
      language: 'zh'
    };
  }
  
  try {
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Failed to parse settings:', error);
    return {
      defaultStyle: 'none',
      defaultQuality: 'standard',
      defaultAspectRatio: 'square',
      autoSaveHistory: true,
      theme: 'auto',
      language: 'zh'
    };
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }
}

// Data export/import
export async function exportData(): Promise<string> {
  const [history, favorites, settings] = await Promise.all([
    getHistory(),
    getFavorites(),
    getSettings()
  ]);
  
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    history,
    favorites,
    settings
  };
  
  return JSON.stringify(exportData, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.history) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data.history));
    }
    
    if (data.favorites) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data.favorites));
    }
    
    if (data.settings) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data.settings));
    }
  } catch (error) {
    throw new Error('Invalid data format');
  }
}

// Utility functions
export function getImageDimensions(aspectRatio: string): { width: number; height: number } {
  const ratios = {
    'square': { width: 1024, height: 1024 },
    'wide': { width: 1920, height: 1080 },
    'vertical': { width: 1080, height: 1920 },
    'portrait': { width: 1024, height: 1280 },
    'landscape': { width: 1536, height: 1024 }
  };
  
  return ratios[aspectRatio as keyof typeof ratios] || ratios.square;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
} 