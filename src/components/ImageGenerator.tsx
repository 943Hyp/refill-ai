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
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [selectedStyle, setSelectedStyle] = useState("none");
    const [selectedQuality, setSelectedQuality] = useState("standard");
    const [selectedAspect, setSelectedAspect] = useState("square");
    const [retryCount, setRetryCount] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [usageInfo, setUsageInfo] = useState<{ count: number; nextCooldown?: string }>({ count: 0 });
    const [rateLimitInfo, setRateLimitInfo] = useState<{ waitTime?: number; message?: string } | null>(null);
    const [debugInfo, setDebugInfo] = useState<{
      timestamp: string;
      result: { imageUrl: string; model?: string; enhancedPrompt?: string };
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

    const qualityOptions = [
      { id: "standard", label: locale === 'zh' ? "标准" : "Standard", desc: locale === 'zh' ? "快速生成" : "Fast generation" },
      { id: "high", label: locale === 'zh' ? "高质量" : "High Quality", desc: locale === 'zh' ? "更多细节" : "More details" },
      { id: "ultra", label: locale === 'zh' ? "超高清" : "Ultra HD", desc: locale === 'zh' ? "最佳质量" : "Best quality" },
    ];

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

    // Calculate estimated time based on quality
    useEffect(() => {
      const timeMap = { standard: 15, high: 30, ultra: 45 };
      setEstimatedTime(timeMap[selectedQuality as keyof typeof timeMap] || 15);
    }, [selectedQuality]);

    const handleEnhancePrompt = async () => {
      if (!prompt.trim()) {
        toast.error(t('enterPrompt'));
        return;
      }

      setIsEnhancing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const enhanced = `${prompt}, masterpiece, best quality, ultra detailed, 8k resolution, professional photography`;
        setPrompt(enhanced);
        toast.success(locale === 'zh' ? '提示词已优化' : 'Prompt enhanced');
      } catch (error) {
        toast.error(t('enhanceFailed'));
      } finally {
        setIsEnhancing(false);
      }
    };

    const handleClear = () => {
      setPrompt("");
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
        
        if (!result.imageUrl) {
          throw new Error('No image URL returned from API');
        }
        
        // 验证图像URL是否可访问
        try {
          const imageResponse = await fetch(result.imageUrl, { method: 'HEAD' });
          if (!imageResponse.ok) {
            throw new Error(`Image URL not accessible: ${imageResponse.status}`);
          }
        } catch (urlError) {
          console.warn('Image URL validation failed:', urlError);
          // 继续尝试显示，可能是CORS问题
        }
        
        setGeneratedImage(result.imageUrl);
        
        // Save to history
        await saveToHistory({
          id: Date.now().toString(),
          prompt,
          imageUrl: result.imageUrl,
          timestamp: new Date(),
          style: selectedStyle,
          quality: selectedQuality,
          aspectRatio: selectedAspect,
        });

        toast.success(locale === 'zh' ? '图像生成成功！' : 'Image generated successfully!');
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

    const downloadImage = () => {
      if (generatedImage) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `refill-ai-${Date.now()}.png`;
        link.click();
        toast.success(t('imageDownloaded'));
      }
    };

    const shareImage = async () => {
      if (generatedImage) {
        try {
          await navigator.clipboard.writeText(generatedImage);
          toast.success(locale === 'zh' ? '图像链接已复制到剪贴板' : 'Image link copied to clipboard');
        } catch (error) {
          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = generatedImage;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success(locale === 'zh' ? '图像链接已复制' : 'Image link copied');
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

          {/* Quality Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{locale === 'zh' ? '图像质量' : 'Image Quality'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {qualityOptions.map((quality) => (
                <Button
                  key={quality.id}
                  onClick={() => setSelectedQuality(quality.id)}
                  variant={selectedQuality === quality.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-auto py-3 flex flex-col items-center gap-1"
                >
                  <span className="font-medium">{quality.label}</span>
                  <span className="text-[10px] text-muted-foreground">{quality.desc}</span>
                </Button>
              ))}
            </div>
          </div>

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
            </div>
          )}

          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full rounded-lg border border-border shadow-lg"
                  loading="lazy"
                  onLoad={() => {
                    console.log('Image loaded successfully:', generatedImage);
                    toast.success(locale === 'zh' ? '图像加载完成！' : 'Image loaded successfully!');
                  }}
                  onError={(e) => {
                    console.error('Image load error:', e, 'URL:', generatedImage);
                    toast.error(locale === 'zh' ? '图像加载失败，请重试' : 'Image failed to load, please retry');
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                
                {/* 显示图像URL用于调试 */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {generatedImage.substring(0, 50)}...
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadImage} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="mr-1">📥</span>
                  {t('downloadImage')}
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