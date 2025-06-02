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

// Generate image API call
export async function generateImage(prompt: string, styleOptions: StyleOptions): Promise<GeneratedImage | null> {
  try {
    const response = await fetch(`${API_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        styleOptions
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Error generating image:', data.error);
      return null;
    }

    // Return the first generated image
    return data.images[0];
  } catch (error) {
    console.error('API error when generating image:', error);
    return null;
  }
}

// Analyze image and get prompt
export async function analyzeImage(imageBase64: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/image-to-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Error analyzing image:', data.error);
      return null;
    }

    return data.prompt;
  } catch (error) {
    console.error('API error when analyzing image:', error);
    return null;
  }
}

// Local storage utilities for client-side only code
// These functions are only used in the browser
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

// Local storage for user history
export function saveToHistory(prompt: string, imageBase64: string) {
  if (!storageAvailable()) return [];

  try {
    // Get existing history
    const historyString = localStorage.getItem('imageHistory');
    const history = historyString ? JSON.parse(historyString) : [];

    // Add new entry at beginning (most recent first)
    const newEntry = {
      id: Date.now(),
      prompt,
      imageBase64,
      timestamp: new Date().toISOString()
    };

    // Keep only the most recent 10 entries
    const updatedHistory = [newEntry, ...history].slice(0, 10);

    // Save back to localStorage
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));

    return updatedHistory;
  } catch (error) {
    console.error('Error saving to history:', error);
    return [];
  }
}

// Get user history
export function getHistory() {
  if (!storageAvailable()) return [];

  try {
    const historyString = localStorage.getItem('imageHistory');
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

// Clear user history
export function clearHistory() {
  if (!storageAvailable()) return false;

  try {
    localStorage.removeItem('imageHistory');
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}
