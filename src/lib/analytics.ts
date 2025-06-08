// Professional Plausible Analytics integration for Refill AI
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

class RefillAnalytics {
  private isPlausibleLoaded = false;
  private debugMode = false;

  constructor() {
    this.checkPlausibleLoaded();
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  // Check if Plausible is loaded
  private checkPlausibleLoaded() {
    if (typeof window !== 'undefined') {
      // Check immediately
      if (typeof window.plausible !== 'undefined') {
        this.isPlausibleLoaded = true;
        this.log('✅ Plausible Analytics loaded successfully');
      } else {
        // Check again after a delay
        setTimeout(() => {
          if (typeof window.plausible !== 'undefined') {
            this.isPlausibleLoaded = true;
            this.log('✅ Plausible Analytics loaded successfully (delayed)');
          } else {
            this.log('⚠️ Plausible Analytics not loaded');
          }
        }, 1000);
      }
    }
  }

  // Debug logging
  private log(message: string, data?: unknown) {
    if (this.debugMode) {
      console.log(`[RefillAnalytics] ${message}`, data || '');
    }
  }

  // Track custom event
  trackEvent(eventName: string, props: Record<string, string | number> = {}) {
    if (typeof window !== 'undefined' && this.isPlausibleLoaded && window.plausible) {
      window.plausible(eventName, { props });
      this.log(`📊 Event tracked: ${eventName}`, props);
    } else {
      this.log(`📊 Event would be tracked: ${eventName}`, props);
    }
  }

  // Track page views
  trackPageView(page: string) {
    this.trackEvent('Page View', {
      page,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct'
    });
  }

  // Track image generation
  trackImageGeneration(prompt: string, style: string, quality: string, aspectRatio: string) {
    this.trackEvent('Image Generated', {
      style,
      quality,
      aspect_ratio: aspectRatio,
      prompt_length: prompt.length.toString(),
      timestamp: new Date().toISOString()
    });
  }

  // Track image downloads
  trackImageDownload(source: 'single' | 'history', imageIndex?: number) {
    this.trackEvent('Image Downloaded', {
      source,
      image_index: imageIndex?.toString() || '0',
      timestamp: new Date().toISOString()
    });
  }

  // Track image sharing
  trackImageShare(method: 'native' | 'fallback', success: boolean) {
    this.trackEvent('Image Shared', {
      method,
      success: success.toString(),
      timestamp: new Date().toISOString()
    });
  }

  // Track image analysis
  trackImageAnalysis(fileSize: number, fileType: string) {
    this.trackEvent('Image Analyzed', {
      file_size: Math.round(fileSize / 1024).toString(), // KB
      file_type: fileType,
      timestamp: new Date().toISOString()
    });
  }

  // Track language change
  trackLanguageChange(from: string, to: string) {
    this.trackEvent('Language Changed', {
      from_language: from,
      to_language: to,
      timestamp: new Date().toISOString()
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string) {
    this.trackEvent('Feature Used', {
      feature,
      action,
      timestamp: new Date().toISOString()
    });
  }

  // Track errors
  trackError(error: string, context: string) {
    this.trackEvent('Error Occurred', {
      error_type: error,
      context,
      timestamp: new Date().toISOString()
    });
  }

  // Track user engagement
  trackEngagement(action: string, value?: number) {
    this.trackEvent('User Engagement', {
      action,
      value: value?.toString() || '1',
      timestamp: new Date().toISOString()
    });
  }

  // Track search and filters
  trackSearch(query: string, resultsCount: number) {
    this.trackEvent('Search Performed', {
      query_length: query.length.toString(),
      results_count: resultsCount.toString(),
      timestamp: new Date().toISOString()
    });
  }

  // Track history actions
  trackHistoryAction(action: 'view' | 'clear' | 'filter' | 'sort', details?: string) {
    this.trackEvent('History Action', {
      action,
      details: details || 'none',
      timestamp: new Date().toISOString()
    });
  }

  // Track app mode changes
  trackAppModeChange(mode: 'home' | 'app') {
    this.trackEvent('App Mode Change', {
      mode,
      timestamp: new Date().toISOString()
    });
  }

  // Track tab switches
  trackTabSwitch(from: string, to: string) {
    this.trackEvent('Tab Switch', {
      from_tab: from,
      to_tab: to,
      timestamp: new Date().toISOString()
    });
  }

  // Track button clicks
  trackButtonClick(buttonName: string, location: string) {
    this.trackEvent('Button Click', {
      button_name: buttonName,
      location,
      timestamp: new Date().toISOString()
    });
  }

  // Track form submissions
  trackFormSubmission(formType: string, success: boolean) {
    this.trackEvent('Form Submission', {
      form_type: formType,
      success: success.toString(),
      timestamp: new Date().toISOString()
    });
  }

  // Track page time
  trackPageTime(pageName: string) {
    if (typeof window === 'undefined') return;
    
    const startTime = Date.now();
    
    const trackTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
      this.trackEvent('Page Time', {
        page: pageName,
        time_spent: timeSpent.toString()
      });
    };

    // Track on page unload
    window.addEventListener('beforeunload', trackTime);
    
    // Track on visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackTime();
      }
    });
  }

  // Initialize analytics
  init() {
    if (typeof window === 'undefined') return;

    // Track initial page load
    this.trackPageView(window.location.pathname);
    
    // Track user agent info
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.trackEngagement('session_start', isMobile ? 1 : 0);

    // Start page time tracking
    this.trackPageTime(document.title || window.location.pathname);

    // Track errors globally
    window.addEventListener('error', (event) => {
      this.trackError('JavaScript Error', event.message);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Promise Rejection', event.reason?.toString() || 'Unknown');
    });

    this.log('🚀 RefillAnalytics initialized');
  }

  // Test function for debugging
  test() {
    this.log('🧪 Running analytics test...');
    
    // Test basic event
    this.trackEvent('Analytics Test', {
      test_type: 'basic',
      timestamp: new Date().toISOString()
    });

    // Test image generation
    this.trackImageGeneration('test prompt', 'realistic', 'standard', '1:1');

    // Test feature usage
    this.trackFeatureUsage('Analytics', 'test');

    this.log('✅ Analytics test completed');
  }
}

// Create global analytics instance
export const analytics = new RefillAnalytics();

// Initialize analytics (for client-side)
export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    analytics.init();
  }
};

// Export for testing
export { RefillAnalytics }; 