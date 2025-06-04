export const defaultLocale = 'zh';
export const locales = ['zh', 'en'] as const;
export type Locale = typeof locales[number];

export const translations = {
  zh: {
    // Header
    features: '功能特点',
    gallery: '作品展示',
    faq: '常见问题',
    about: '关于我们',
    language: '中文',
    
    // Tabs
    textToImage: '文生图',
    imageToText: '图生文',
    templates: '模板',
    history: '历史',
    
    // Image Generator
    placeholder: '描述你想要生成的图像...',
    enhancePrompt: '✨ 优化提示词',
    enhancing: '优化中...',
    clear: '🗑️ 清除',
    random: '🎲 随机',
    generate: '🎨 生成图像',
    generating: '生成中...',
    generatingImage: '正在生成您的图像...',
    downloadImage: '📥 下载',
    shareImage: '🔗 分享',
    
    // Image to Prompt
    dragAndDrop: '拖拽图像到此处或点击上传',
    supportedFormats: '支持 JPG, PNG, GIF, WebP 格式，最大 10MB',
    analyzing: '正在分析图像...',
    generatedPrompt: '生成的提示词',
    copyPrompt: '📋 复制',
    editPrompt: '✏️ 编辑',
    usePrompt: '🎨 用此提示词生成图像',
    
    // Templates
    promptTemplates: '提示词模板',
    templatesDescription: '选择预设模板快速开始创作，或获取灵感',
    searchTemplates: '搜索模板...',
    useTemplate: '✨ 使用',
    copyTemplate: '📋 复制',
    
    // History
    generationHistory: '生成历史',
    noHistory: '暂无历史记录',
    noHistoryDescription: '开始生成图像后，您的创作历史将显示在这里。所有记录都保存在本地，保护您的隐私。',
    searchHistory: '搜索提示词...',
    clearHistory: '🗑️ 清空',
    exportHistory: '📤 导出',
    deleteSelected: '🗑️ 删除',
    
    // Messages
    promptCopied: '提示词已复制到剪贴板',
    imageCopied: '图像已复制',
    imageDownloaded: '图像下载成功',
    promptApplied: '提示词已应用到生成器',
    templateApplied: '已应用模板',
    
    // Errors
    enterPrompt: '请先输入提示词',
    generateFailed: '图像生成失败，请重试',
    analyzeFailed: '图像分析失败，请重试',
    enhanceFailed: '提示词优化失败，请重试',
    uploadImageFile: '请上传图像文件',
    fileSizeLimit: '图像文件大小不能超过 10MB',
  },
  
  en: {
    // Header
    features: 'Features',
    gallery: 'Gallery',
    faq: 'FAQ',
    about: 'About',
    language: 'English',
    
    // Tabs
    textToImage: 'Text to Image',
    imageToText: 'Image to Text',
    templates: 'Templates',
    history: 'History',
    
    // Image Generator
    placeholder: 'Describe what you want to see...',
    enhancePrompt: '✨ Enhance Prompt',
    enhancing: 'Enhancing...',
    clear: '🗑️ Clear',
    random: '🎲 Random',
    generate: '🎨 Generate Image',
    generating: 'Generating...',
    generatingImage: 'Generating your image...',
    downloadImage: '📥 Download',
    shareImage: '🔗 Share',
    
    // Image to Prompt
    dragAndDrop: 'Drag and drop an image here or click to upload',
    supportedFormats: 'Supports JPG, PNG, GIF, WebP formats, max 10MB',
    analyzing: 'Analyzing image...',
    generatedPrompt: 'Generated Prompt',
    copyPrompt: '📋 Copy',
    editPrompt: '✏️ Edit',
    usePrompt: '🎨 Generate Image From This Prompt',
    
    // Templates
    promptTemplates: 'Prompt Templates',
    templatesDescription: 'Choose preset templates to start creating quickly, or get inspiration',
    searchTemplates: 'Search templates...',
    useTemplate: '✨ Use',
    copyTemplate: '📋 Copy',
    
    // History
    generationHistory: 'Generation History',
    noHistory: 'No History Yet',
    noHistoryDescription: 'Generate some images and they will appear here. Your history is stored locally in your browser.',
    searchHistory: 'Search prompts...',
    clearHistory: '🗑️ Clear',
    exportHistory: '📤 Export',
    deleteSelected: '🗑️ Delete',
    
    // Messages
    promptCopied: 'Prompt copied to clipboard',
    imageCopied: 'Image copied',
    imageDownloaded: 'Image downloaded successfully',
    promptApplied: 'Prompt applied to generator',
    templateApplied: 'Template applied',
    
    // Errors
    enterPrompt: 'Please enter a prompt first',
    generateFailed: 'Failed to generate image. Please try again.',
    analyzeFailed: 'Failed to analyze image. Please try again.',
    enhanceFailed: 'Failed to enhance prompt. Please try again.',
    uploadImageFile: 'Please upload an image file',
    fileSizeLimit: 'Image file size cannot exceed 10MB',
  }
};

export function getTranslation(locale: Locale, key: keyof typeof translations.zh): string {
  // 安全检查：确保locale存在且有效
  const safeLocale = locale && translations[locale] ? locale : defaultLocale;
  
  // 安全检查：确保key存在
  if (!key || !translations[safeLocale] || !translations[safeLocale][key]) {
    console.warn(`Translation missing for key: ${key} in locale: ${safeLocale}`);
    return key; // 返回key本身作为fallback
  }
  
  return translations[safeLocale][key];
} 