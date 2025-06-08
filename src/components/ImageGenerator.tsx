"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { generateImage, saveToHistory } from "@/lib/api";
import { toast } from "sonner";
import { Locale, getTranslation } from '@/lib/i18n';
import { rateLimiter } from '@/lib/rateLimiter';

interface ImageGeneratorProps {
  locale: Locale;
}

export interface ImageGeneratorRef {
  handleGenerate: () => void;
  handleClear: () => void;
  setPrompt: (prompt: string) => void;
}

const ImageGenerator = forwardRef<ImageGeneratorRef, ImageGeneratorProps>(
  ({ locale }, ref) => {
    const [prompt, setPrompt] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [selectedStyle, setSelectedStyle] = useState("none");
    const [selectedQuality] = useState("high"); // 固定使用高质量
    const [selectedAspect, setSelectedAspect] = useState("square");
    const [retryCount, setRetryCount] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [usageInfo, setUsageInfo] = useState<{ count: number; nextCooldown?: string }>({ count: 0 });
    const [rateLimitInfo, setRateLimitInfo] = useState<{ waitTime?: number; message?: string } | null>(null);
    const [debugInfo, setDebugInfo] = useState<{
      timestamp: string;
      result: { imageUrl: string; imageUrls?: string[]; model?: string; enhancedPrompt?: string };
      prompt: string;
      style: string;
      quality: string;
      aspectRatio: string;
    } | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

    // Update usage info on component mount and after each generation
    useEffect(() => {
      updateUsageInfo();
    }, []);

    // Countdown timer for rate limit
    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (rateLimitInfo?.waitTime && rateLimitInfo.waitTime > 0) {
        interval = setInterval(() => {
          setRateLimitInfo(prev => {
            if (!prev || !prev.waitTime || prev.waitTime <= 1) {
              // Time's up, clear the rate limit
              return null;
            }
            return {
              ...prev,
              waitTime: prev.waitTime - 1
            };
          });
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [rateLimitInfo?.waitTime]);

    const updateUsageInfo = () => {
      const info = rateLimiter.getUsageInfo();
      setUsageInfo(info);
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      handleGenerate: () => handleGenerateImage(),
      handleClear: () => handleClear(),
      setPrompt: (prompt: string) => setPrompt(prompt)
    }));

    const styleOptions = [
      { id: "none", icon: "⊘", label: locale === 'zh' ? "无风格" : "None" },
      { id: "digital-art", icon: "🎨", label: locale === 'zh' ? "数字艺术" : "Digital Art" },
      { id: "watercolor", icon: "🖌️", label: locale === 'zh' ? "水彩画" : "Watercolor" },
      { id: "oil-painting", icon: "🖼️", label: locale === 'zh' ? "油画" : "Oil Painting" },
      { id: "sketch", icon: "✏️", label: locale === 'zh' ? "素描" : "Sketch" },
      { id: "anime", icon: "🌸", label: locale === 'zh' ? "动漫" : "Anime" },
      { id: "photorealistic", icon: "📷", label: locale === 'zh' ? "写实" : "Photo" },
      { id: "3d-render", icon: "⬢", label: locale === 'zh' ? "3D渲染" : "3D Render" },
      { id: "cyberpunk", icon: "🌆", label: locale === 'zh' ? "赛博朋克" : "Cyberpunk" },
      { id: "fantasy", icon: "🧙", label: locale === 'zh' ? "奇幻" : "Fantasy" },
    ];

    // 移除质量选项，固定使用高质量

    const aspectOptions = [
      { id: "square", icon: "◼️", label: "1:1", desc: locale === 'zh' ? "正方形" : "Square" },
      { id: "wide", icon: "▬", label: "16:9", desc: locale === 'zh' ? "宽屏" : "Widescreen" },
      { id: "vertical", icon: "▯", label: "9:16", desc: locale === 'zh' ? "竖屏" : "Vertical" },
      { id: "portrait", icon: "📱", label: "4:5", desc: locale === 'zh' ? "肖像" : "Portrait" },
      { id: "landscape", icon: "🖼️", label: "3:2", desc: locale === 'zh' ? "风景" : "Landscape" },
    ];

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [prompt]);

    // 固定估算时间为30秒（高质量）
    useEffect(() => {
      setEstimatedTime(30);
    }, []);

    const handleEnhancePrompt = async () => {
      if (!prompt.trim()) {
        toast.error(t('enterPrompt'));
        return;
      }

      setIsEnhancing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 检测是否为中文提示词
        const hasChinese = /[\u4e00-\u9fa5]/.test(prompt);
        
        let enhanced: string;
        if (hasChinese) {
          // 中文增强
          enhanced = `${prompt}，高质量，精美细节，专业摄影，8K分辨率，杰作级作品，完美构图，自然光线，艺术感强`;
        } else {
          // 英文增强
          enhanced = `${prompt}, masterpiece, best quality, ultra detailed, 8k resolution, professional photography, perfect composition, natural lighting, highly artistic`;
        }
        
        setPrompt(enhanced);
        toast.success(locale === 'zh' ? '提示词已优化增强' : 'Prompt enhanced successfully');
      } catch (error) {
        toast.error(t('enhanceFailed'));
      } finally {
        setIsEnhancing(false);
      }
    };

    const handleClear = () => {
      setPrompt("");
      setGeneratedImages([]);
      setGeneratedImage(null);
      setGenerationProgress(0);
      setRetryCount(0);
    };

    const handleGenerateImage = async (isRetry = false) => {
      if (!prompt.trim()) {
        toast.error(t('enterPrompt'));
        return;
      }

      // Check rate limit before generating - Silent limiting
      const limitCheck = rateLimiter.checkLimit();
      if (!limitCheck.allowed) {
        setRateLimitInfo({
          waitTime: limitCheck.waitTime,
          // 简化消息，不暴露具体限制规则
          message: locale === 'zh' ? '请求过于频繁，请稍后再试' : 'Too many requests, please try again later'
        });
        toast.error(locale === 'zh' ? '请求过于频繁，请稍后再试' : 'Too many requests, please try again later');
        return;
      }

      // Clear any previous rate limit info
      setRateLimitInfo(null);

      if (!isRetry) {
        setRetryCount(0);
      }

      setIsGenerating(true);
      setGenerationProgress(0);
      if (!isRetry) {
        setGeneratedImages([]);
        setGeneratedImage(null);
      }

      try {
        // Enhanced progress simulation with more realistic timing
        const progressInterval = setInterval(() => {
          setGenerationProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 10;
          });
        }, estimatedTime * 10);

        const result = await generateImage({
          prompt,
          style: selectedStyle,
          quality: selectedQuality,
          aspectRatio: selectedAspect,
        });

        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        // 增强调试信息
        console.log('Generation result:', result);
        setDebugInfo({
          timestamp: new Date().toISOString(),
          result,
          prompt,
          style: selectedStyle,
          quality: selectedQuality,
          aspectRatio: selectedAspect
        });
        
        // 处理多张图片或单张图片
        const imageUrls = result.imageUrls || (result.imageUrl ? [result.imageUrl] : []);
        
        if (imageUrls.length === 0) {
          throw new Error('No image URLs returned from API');
        }
        
        // 验证第一张图像URL是否可访问
        try {
          const imageResponse = await fetch(imageUrls[0], { method: 'HEAD' });
          if (!imageResponse.ok) {
            throw new Error(`Image URL not accessible: ${imageResponse.status}`);
          }
        } catch (urlError) {
          console.warn('Image URL validation failed:', urlError);
          // 继续尝试显示，可能是CORS问题
        }
        
        setGeneratedImages(imageUrls);
        setGeneratedImage(imageUrls[0]); // 保持向后兼容
        
        // Save to history (保存所有图片)
        await saveToHistory({
          id: Date.now().toString(),
          prompt,
          imageUrl: imageUrls[0], // 主图片（向后兼容）
          imageUrls: imageUrls, // 所有图片
          timestamp: new Date(),
          style: selectedStyle,
          quality: selectedQuality,
          aspectRatio: selectedAspect,
        });

        toast.success(locale === 'zh' ? '图像生成成功！请向下滚动查看生成的图片' : 'Image generated successfully! Scroll down to view the generated image');
        
        // 自动滚动到生成的图片位置
        setTimeout(() => {
          const imageElement = document.querySelector('[data-generated-image]');
          if (imageElement) {
            imageElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 500);
        setRetryCount(0);
        
        // Update usage info after successful generation
        updateUsageInfo();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`${t('generateFailed')}: ${errorMessage}`);
        
        // Show retry option for network errors
        if (retryCount < 3) {
          setTimeout(() => {
            toast.info(locale === 'zh' ? '点击重试按钮再次尝试' : 'Click retry button to try again');
          }, 1000);
        }
      } finally {
        setIsGenerating(false);
        setGenerationProgress(0);
      }
    };

    const handleRetry = () => {
      setRetryCount(prev => prev + 1);
      handleGenerateImage(true);
    };

    const handleRandomPrompt = () => {
      const randomPrompts = locale === 'zh' ? [
        "一只可爱的小猫在花园里玩耍，阳光明媚",
        "未来城市的夜景，霓虹灯闪烁，赛博朋克风格",
        "宁静的湖泊，倒映着雪山，日出时分",
        "神秘的森林，阳光透过树叶，魔幻氛围",
        "太空中的宇宙飞船，星空背景，科幻风格",
        "古老的城堡，云雾缭绕，奇幻风格",
        "美丽的花田，蝴蝶飞舞，春天的气息",
        "海边的灯塔，暴风雨来临，戏剧性光线"
      ] : [
        "A cute kitten playing in a sunny garden",
        "Futuristic city at night with neon lights, cyberpunk style",
        "Peaceful lake reflecting snow mountains at sunrise",
        "Mysterious forest with sunlight through leaves, magical atmosphere",
        "Spaceship in outer space with starry background, sci-fi style",
        "Ancient castle surrounded by mist, fantasy style",
        "Beautiful flower field with butterflies, spring atmosphere",
        "Lighthouse by the sea during storm, dramatic lighting"
      ];
      
      const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
      setPrompt(randomPrompt);
    };

    const downloadImage = async (imageUrl?: string, index?: number) => {
      const urlToDownload = imageUrl || generatedImage;
      console.log('downloadImage called with:', { imageUrl, index, urlToDownload });
      
      if (!urlToDownload) {
        console.error('No URL to download');
        toast.error(locale === 'zh' ? '没有可下载的图片' : 'No image to download');
        return;
      }

      try {
        console.log('Attempting direct download...');
        // 尝试直接下载
        const link = document.createElement('a');
        link.href = urlToDownload;
        link.download = `refill-ai-${Date.now()}${index !== undefined ? `-${index + 1}` : ''}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Direct download initiated successfully');
        toast.success(t('imageDownloaded'));
      } catch (error) {
        console.error('Direct download error:', error);
        // 如果直接下载失败，尝试通过fetch下载
        try {
          console.log('Attempting fetch download...');
          const response = await fetch(urlToDownload);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `refill-ai-${Date.now()}${index !== undefined ? `-${index + 1}` : ''}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('Fetch download completed successfully');
          toast.success(t('imageDownloaded'));
        } catch (fetchError) {
          console.error('Fetch download error:', fetchError);
          // 最后的备选方案：在新窗口打开图片
          console.log('Opening image in new window as fallback...');
          window.open(urlToDownload, '_blank');
          toast.info(locale === 'zh' ? '图片已在新窗口打开，请右键保存' : 'Image opened in new window, right-click to save');
        }
      }
    };

    const downloadAllImages = async () => {
      if (generatedImages.length > 0) {
        toast.success(locale === 'zh' ? `开始下载 ${generatedImages.length} 张图片` : `Starting download of ${generatedImages.length} images`);
        
        for (let index = 0; index < generatedImages.length; index++) {
          try {
            await new Promise(resolve => setTimeout(resolve, index * 500)); // 延迟下载避免浏览器阻止
            await downloadImage(generatedImages[index], index);
          } catch (error) {
            console.error(`Error downloading image ${index + 1}:`, error);
          }
        }
      }
    };

    const shareImage = async (imageUrl?: string, index?: number) => {
      const urlToShare = imageUrl || generatedImage;
      console.log('shareImage called with:', { imageUrl, index, urlToShare });
      
      if (!urlToShare) {
        console.error('No URL to share');
        toast.error(locale === 'zh' ? '没有可分享的图片' : 'No image to share');
        return;
      }

      try {
        console.log('Attempting clipboard write...');
        await navigator.clipboard.writeText(urlToShare);
        const message = index !== undefined 
          ? (locale === 'zh' ? `图片${index + 1}链接已复制到剪贴板` : `Image ${index + 1} link copied to clipboard`)
          : (locale === 'zh' ? '图像链接已复制到剪贴板' : 'Image link copied to clipboard');
        console.log('Clipboard write successful');
        toast.success(message);
      } catch (error) {
        console.error('Clipboard error:', error);
        // Fallback for browsers that don't support clipboard API
        try {
          console.log('Attempting fallback copy method...');
          const textArea = document.createElement('textarea');
          textArea.value = urlToShare;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            const message = index !== undefined 
              ? (locale === 'zh' ? `图片${index + 1}链接已复制` : `Image ${index + 1} link copied`)
              : (locale === 'zh' ? '图像链接已复制' : 'Image link copied');
            console.log('Fallback copy successful');
            toast.success(message);
          } else {
            throw new Error('execCommand copy failed');
          }
        } catch (fallbackError) {
          console.error('Fallback copy error:', fallbackError);
          toast.error(locale === 'zh' ? '复制失败，请手动复制链接' : 'Copy failed, please copy link manually');
        }
      }
    };

    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground/80">
              {locale === 'zh' ? '描述你想要的图像' : 'Describe your image'}
            </label>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('placeholder')}
              className="flex min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isGenerating}
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{prompt.length}/500</span>
              <span>{locale === 'zh' ? '预计生成时间: ' : 'Estimated time: '}{estimatedTime}s</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || isGenerating || !prompt.trim()}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {isEnhancing ? (
                  <>
                    <span className="animate-spin mr-1">⚡</span>
                    {t('enhancing')}
                  </>
                ) : (
                  <>
                    <span className="mr-1">✨</span>
                    {t('enhancePrompt')}
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <span className="mr-1">🗑️</span>
                {t('clear')}
              </Button>
              <Button
                onClick={handleRandomPrompt}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <span className="mr-1">🎲</span>
                {t('random')}
              </Button>
              
              {/* 调试按钮 */}
              <Button
                onClick={() => setShowDebug(!showDebug)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <span className="mr-1">🔧</span>
                调试
              </Button>
            </div>
            
            {/* 调试面板 */}
            {showDebug && debugInfo && (
              <div className="bg-muted/20 border border-muted rounded-lg p-3 text-xs">
                <div className="font-medium mb-2">调试信息:</div>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Style Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{locale === 'zh' ? '艺术风格' : 'Art Style'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {styleOptions.map((style) => (
                <Button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  variant={selectedStyle === style.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-2 px-2 flex flex-col items-center gap-1"
                >
                  <span className="text-base">{style.icon}</span>
                  <span className="text-[10px] leading-tight text-center">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* 质量选项已移除，固定使用高质量 */}

          {/* Aspect Ratio Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{locale === 'zh' ? '画面比例' : 'Aspect Ratio'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {aspectOptions.map((aspect) => (
                <Button
                  key={aspect.id}
                  onClick={() => setSelectedAspect(aspect.id)}
                  variant={selectedAspect === aspect.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-2 flex flex-col items-center gap-1"
                >
                  <span className="text-base">{aspect.icon}</span>
                  <span className="font-medium">{aspect.label}</span>
                  <span className="text-[10px] text-muted-foreground">{aspect.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* No usage info shown to users - silent rate limiting */}

          {/* Rate Limit Warning */}
          {rateLimitInfo && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <span>⏰</span>
                <span>{rateLimitInfo.message}</span>
              </div>
              {rateLimitInfo.waitTime && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {locale === 'zh' ? '剩余等待时间: ' : 'Remaining wait time: '}{rateLimitInfo.waitTime}{locale === 'zh' ? '秒' : 's'}
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <div className="space-y-3">
            <Button
              onClick={() => handleGenerateImage(false)}
              disabled={isGenerating || !prompt.trim() || Boolean(rateLimitInfo?.waitTime && rateLimitInfo.waitTime > 0)}
              className="w-full py-4 text-base font-medium relative overflow-hidden"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">🎨</span>
                  {t('generating')}
                </>
              ) : rateLimitInfo?.waitTime && rateLimitInfo.waitTime > 0 ? (
                <>
                  <span className="mr-2">⏰</span>
                  {locale === 'zh' ? '请等待' : 'Please wait'}
                </>
              ) : (
                <>
                  <span className="mr-2">🎨</span>
                  {t('generate')}
                </>
              )}
            </Button>
            
            {/* 生成提示信息 */}
            {generatedImages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span>👇</span>
                  <span>{locale === 'zh' ? '将生成4张图片显示在下方' : '4 images will be generated and displayed below'}</span>
                  <span>👇</span>
                </div>
                <div className="text-xs opacity-70">
                  {locale === 'zh' ? '点击生成按钮后，4张图片会自动滚动到视图中' : 'After clicking generate, 4 images will automatically scroll into view'}
                </div>
              </div>
            )}
            
            {/* Retry Button */}
            {retryCount > 0 && retryCount < 3 && !isGenerating && (
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <span className="mr-2">🔄</span>
                {locale === 'zh' ? `重试 (${retryCount}/3)` : `Retry (${retryCount}/3)`}
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${generationProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {t('generatingImage')} {Math.round(generationProgress)}%
                </span>
                <span className="text-muted-foreground">
                  {locale === 'zh' ? '请稍候...' : 'Please wait...'}
                </span>
              </div>
              
              {/* 生成中的占位区域 */}
              <div className="mt-6 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border-2 border-dashed border-primary/30 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl animate-spin">🎨</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-primary">
                      {locale === 'zh' ? '正在生成4张图片...' : 'Generating 4 images...'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'zh' ? '4张图片将在此处显示' : '4 images will appear here'}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Images - 4张图片网格显示 */}
          {generatedImages.length > 0 && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20 shadow-lg" data-generated-image>
              {/* 明显的标题提示 */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {locale === 'zh' ? `🎨 生成的图片 (${generatedImages.length}张)` : `🎨 Generated Images (${generatedImages.length})`}
                </h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* 4张图片网格 */}
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border-2 border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                      loading="lazy"
                      onLoad={() => {
                        console.log(`Image ${index + 1} loaded successfully:`, imageUrl);
                        if (index === 0) {
                          toast.success(locale === 'zh' ? '图像加载完成！' : 'Images loaded successfully!');
                        }
                      }}
                      onError={(e) => {
                        console.error(`Image ${index + 1} load error:`, e, 'URL:', imageUrl);
                        toast.error(locale === 'zh' ? `图像${index + 1}加载失败` : `Image ${index + 1} failed to load`);
                      }}
                    />
                    
                    {/* 图片编号 */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
                      {index + 1}
                    </div>
                    

                    {/* 单张图片下载按钮 - 始终可见 */}
                    <div className="absolute top-2 right-2 z-20">
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Download button clicked for image:', index + 1);
                          await downloadImage(imageUrl, index);
                        }}
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-black/70 hover:bg-black/90 border-0 shadow-lg pointer-events-auto"
                        title={locale === 'zh' ? `下载图片 ${index + 1}` : `Download image ${index + 1}`}
                      >
                        <svg 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
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
                    </div>
                    
                    {/* 分享单张图片按钮 */}
                    <div className="absolute bottom-2 right-2 z-20">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Share button clicked for image:', index + 1);
                          shareImage(imageUrl, index);
                        }}
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-black/70 hover:bg-black/90 border-0 shadow-lg pointer-events-auto"
                        title={locale === 'zh' ? `分享图片 ${index + 1}` : `Share image ${index + 1}`}
                      >
                        <span className="text-white text-xs">🔗</span>
                      </Button>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none"></div>
                  </div>
                ))}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                <Button onClick={downloadAllImages} variant="outline" size="sm" className="flex-1 sm:flex-none">
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
                  {locale === 'zh' ? '下载全部' : 'Download All'}
                </Button>
                <Button onClick={shareImage} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="mr-1">🔗</span>
                  {t('shareImage')}
                </Button>
                <Button
                  onClick={() => handleGenerateImage(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={isGenerating}
                >
                  <span className="mr-1">🔄</span>
                  {locale === 'zh' ? '重新生成' : 'Regenerate'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ImageGenerator.displayName = 'ImageGenerator';

export default ImageGenerator; 