// API client for communicating with the backend service
const API_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost'
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      : '/api') // In production, use relative path for Netlify Functions
  : '/api';

// Define interface for image generation options
export interface StyleOptions {
  style?: string;
  color?: string;
  lighting?: string;
  composition?: string;
  quality?: boolean;
  aspectRatio?: 'square' | 'wide' | 'vertical';
}

// Interface for generated image data
export interface GeneratedImage {
  base64: string;
  seed: number;
  width: number;
  height: number;
}

// Interface for API error
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Enhanced error handling
class ApiClient {
  private static instance: ApiClient;
  private requestCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getCacheKey(url: string, body?: any): string {
    return `${url}_${body ? JSON.stringify(body) : ''}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit,
    retries = 3,
    useCache = false
  ): Promise<any> {
    const url = `${API_URL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options.body);

    // Check cache first
    if (useCache && this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey)!;
      if (this.isValidCache(cached.timestamp)) {
        return cached.data;
      }
      this.requestCache.delete(cacheKey);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'API request failed');
        }

        // Cache successful responses
        if (useCache) {
          this.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }

        return data;
      } catch (error) {
        console.error(`API request attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  async generateImage(prompt: string, styleOptions: StyleOptions): Promise<GeneratedImage | null> {
    try {
      const data = await this.makeRequest('/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          styleOptions
        }),
      });

      return data.images[0];
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }

  async analyzeImage(imageBase64: string, analysisType: 'detailed' | 'simple' | 'artistic' = 'detailed'): Promise<string | null> {
    try {
      const data = await this.makeRequest('/image-to-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          analysisType
        }),
      });

      return data.prompt;
    } catch (error) {
      console.error('Error analyzing image:', error);
      return null;
    }
  }

  async enhancePrompt(prompt: string): Promise<string[] | null> {
    try {
      const data = await this.makeRequest('/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }, 3, true); // Use cache for prompt enhancement

      return data.enhancedPrompts;
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      return null;
    }
  }

  clearCache(): void {
    this.requestCache.clear();
  }
}

// Export singleton instance methods
const apiClient = ApiClient.getInstance();

export const generateImage = (prompt: string, styleOptions: StyleOptions) => 
  apiClient.generateImage(prompt, styleOptions);

export const analyzeImage = (imageBase64: string, analysisType?: 'detailed' | 'simple' | 'artistic') => 
  apiClient.analyzeImage(imageBase64, analysisType);

export const enhancePrompt = (prompt: string) => 
  apiClient.enhancePrompt(prompt);

export const clearApiCache = () => apiClient.clearCache();

// Local storage utilities for client-side only code
const storageAvailable = () => {
  if (typeof window === 'undefined') return false;
  try {
    const storage = window.localStorage;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

// Enhanced history management
export interface HistoryItem {
  id: number;
  prompt: string;
  imageBase64: string;
  timestamp: string;
  styleOptions?: StyleOptions;
  tags?: string[];
}

// Local storage for user history
export function saveToHistory(prompt: string, imageBase64: string, styleOptions?: StyleOptions, tags?: string[]): HistoryItem[] {
  if (!storageAvailable()) return [];

  try {
    const historyString = localStorage.getItem('imageHistory');
    const history: HistoryItem[] = historyString ? JSON.parse(historyString) : [];

    const newEntry: HistoryItem = {
      id: Date.now(),
      prompt,
      imageBase64,
      timestamp: new Date().toISOString(),
      styleOptions,
      tags
    };

    // Keep only the most recent 50 entries
    const updatedHistory = [newEntry, ...history].slice(0, 50);

    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error saving to history:', error);
    return [];
  }
}

// Get user history with optional filtering
export function getHistory(filter?: { 
  searchTerm?: string; 
  tags?: string[]; 
  dateRange?: { start: Date; end: Date } 
}): HistoryItem[] {
  if (!storageAvailable()) return [];

  try {
    const historyString = localStorage.getItem('imageHistory');
    let history: HistoryItem[] = historyString ? JSON.parse(historyString) : [];

    if (filter) {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        history = history.filter(item => 
          item.prompt.toLowerCase().includes(term)
        );
      }

      if (filter.tags && filter.tags.length > 0) {
        history = history.filter(item => 
          item.tags && item.tags.some(tag => filter.tags!.includes(tag))
        );
      }

      if (filter.dateRange) {
        history = history.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= filter.dateRange!.start && itemDate <= filter.dateRange!.end;
        });
      }
    }

    return history;
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

// Clear user history
export function clearHistory(): boolean {
  if (!storageAvailable()) return false;

  try {
    localStorage.removeItem('imageHistory');
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

// Export/Import history
export function exportHistory(): string | null {
  if (!storageAvailable()) return null;

  try {
    const history = getHistory();
    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error('Error exporting history:', error);
    return null;
  }
}

export function importHistory(historyData: string): boolean {
  if (!storageAvailable()) return false;

  try {
    const history = JSON.parse(historyData);
    if (Array.isArray(history)) {
      localStorage.setItem('imageHistory', JSON.stringify(history));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
}

// Favorites management
export function saveFavoritePrompt(prompt: string, title?: string): boolean {
  if (!storageAvailable()) return false;

  try {
    const favoritesString = localStorage.getItem('favoritePrompts');
    const favorites = favoritesString ? JSON.parse(favoritesString) : [];

    const newFavorite = {
      id: Date.now(),
      prompt,
      title: title || prompt.slice(0, 50) + '...',
      timestamp: new Date().toISOString()
    };

    const updatedFavorites = [newFavorite, ...favorites].slice(0, 20);
    localStorage.setItem('favoritePrompts', JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error saving favorite prompt:', error);
    return false;
  }
}

export function getFavoritePrompts() {
  if (!storageAvailable()) return [];

  try {
    const favoritesString = localStorage.getItem('favoritePrompts');
    return favoritesString ? JSON.parse(favoritesString) : [];
  } catch (error) {
    console.error('Error getting favorite prompts:', error);
    return [];
  }
}

// Settings management
export interface UserSettings {
  defaultQuality: 'standard' | 'high' | 'ultra';
  defaultAspectRatio: 'square' | 'wide' | 'vertical';
  autoSaveHistory: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
}

export function saveSettings(settings: Partial<UserSettings>): boolean {
  if (!storageAvailable()) return false;

  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

export function getSettings(): UserSettings {
  const defaultSettings: UserSettings = {
    defaultQuality: 'standard',
    defaultAspectRatio: 'square',
    autoSaveHistory: true,
    theme: 'auto',
    language: 'zh'
  };

  if (!storageAvailable()) return defaultSettings;

  try {
    const settingsString = localStorage.getItem('userSettings');
    return settingsString ? { ...defaultSettings, ...JSON.parse(settingsString) } : defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
}
