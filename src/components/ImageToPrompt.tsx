"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { analyzeImage } from "@/lib/api";
import { toast } from "sonner";
import { Locale, getTranslation } from '@/lib/i18n';

interface ImageToPromptProps {
  locale: Locale;
}

export interface ImageToPromptRef {
  handleClear: () => void;
}

const ImageToPrompt = forwardRef<ImageToPromptRef, ImageToPromptProps>(
  ({ locale }, ref) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisType, setAnalysisType] = useState("detailed");
    const [isDragOver, setIsDragOver] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [retryCount, setRetryCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      handleClear: () => handleClear()
    }));

    const handleClear = () => {
      setUploadedImage(null);
      setGeneratedPrompt("");
      setAnalysisProgress(0);
      setRetryCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleUsePrompt = () => {
      // Since we removed setPrompt prop, we'll just copy to clipboard
      handleCopyPrompt();
      toast.success(locale === 'zh' ? '提示词已复制，请手动粘贴到生成页面' : 'Prompt copied, please paste to generate page');
    };

    const analysisTypes = [
      { 
        id: "detailed", 
        label: locale === 'zh' ? "详细描述" : "Detailed",
        desc: locale === 'zh' ? "完整的场景描述" : "Complete scene description",
        icon: "🔍"
      },
      { 
        id: "simple", 
        label: locale === 'zh' ? "简单描述" : "Simple",
        desc: locale === 'zh' ? "基础元素识别" : "Basic elements",
        icon: "📝"
      },
      { 
        id: "artistic", 
        label: locale === 'zh' ? "艺术风格" : "Artistic",
        desc: locale === 'zh' ? "风格和技法分析" : "Style and technique",
        icon: "🎨"
      },
      { 
        id: "technical", 
        label: locale === 'zh' ? "技术参数" : "Technical",
        desc: locale === 'zh' ? "摄影参数分析" : "Photography settings",
        icon: "📷"
      },
    ];

    const validateFile = (file: File): string | null => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        return locale === 'zh' ? '请上传图像文件' : 'Please upload an image file';
      }

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return locale === 'zh' ? '文件大小不能超过 10MB' : 'File size cannot exceed 10MB';
      }

      // Check file format
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return locale === 'zh' ? '支持的格式: JPG, PNG, GIF, WebP' : 'Supported formats: JPG, PNG, GIF, WebP';
      }

      return null;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setGeneratedPrompt("");
        setRetryCount(0);
      };
      reader.onerror = () => {
        toast.error(locale === 'zh' ? '文件读取失败' : 'Failed to read file');
      };
      reader.readAsDataURL(file);
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
      
      const file = event.dataTransfer.files[0];
      if (file) {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          return;
        }

        const fakeEvent = {
          target: { files: [file] }
        } as React.ChangeEvent<HTMLInputElement>;
        handleFileSelect(fakeEvent);
      }
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const handleAnalyze = async (isRetry = false) => {
      if (!uploadedImage) {
        toast.error(t('uploadImageFile'));
        return;
      }

      if (!isRetry) {
        setRetryCount(0);
      }

      setIsAnalyzing(true);
      setAnalysisProgress(0);

      try {
        // Progress simulation
        const progressInterval = setInterval(() => {
          setAnalysisProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 300);

        const result = await analyzeImage({
          imageData: uploadedImage,
          analysisType,
        });

        clearInterval(progressInterval);
        setAnalysisProgress(100);
        setGeneratedPrompt(result.prompt);
        setRetryCount(0);
        toast.success(locale === 'zh' ? '图像分析完成！' : 'Image analysis completed!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`${t('analyzeFailed')}: ${errorMessage}`);
        
        // Show retry option
        if (retryCount < 3) {
          setTimeout(() => {
            toast.info(locale === 'zh' ? '点击重试按钮再次尝试' : 'Click retry button to try again');
          }, 1000);
        }
      } finally {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }
    };

    const handleRetry = () => {
      setRetryCount(prev => prev + 1);
      handleAnalyze(true);
    };

    const handleCopyPrompt = async () => {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        toast.success(t('promptCopied'));
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = generatedPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success(t('promptCopied'));
      }
    };

    const getFileSizeText = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
        <div className="space-y-6">
          {/* Analysis Type Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">{locale === 'zh' ? '分析类型' : 'Analysis Type'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {analysisTypes.map((type) => (
                <Button
                  key={type.id}
                  onClick={() => setAnalysisType(type.id)}
                  variant={analysisType === type.id ? "default" : "outline"}
                  size="sm"
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <span className="text-base">{type.icon}</span>
                  <span className="font-medium text-xs">{type.label}</span>
                  <span className="text-[10px] text-muted-foreground text-center">{type.desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragOver 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : uploadedImage 
                  ? 'border-border hover:border-primary/50' 
                  : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {locale === 'zh' ? '图像已上传' : 'Image uploaded'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'zh' ? '点击或拖拽新图像替换' : 'Click or drag to replace image'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl sm:text-6xl">
                  {isDragOver ? '📤' : '📸'}
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragOver 
                      ? (locale === 'zh' ? '释放以上传图像' : 'Release to upload image')
                      : t('dragAndDrop')
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('supportedFormats')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'zh' ? '最大文件大小: 10MB' : 'Maximum file size: 10MB'}
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Analyze Button */}
          <div className="space-y-3">
            <Button
              onClick={() => handleAnalyze(false)}
              disabled={!uploadedImage || isAnalyzing}
              className="w-full py-4 text-base font-medium"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2">🔍</span>
                  {t('analyzing')}
                </>
              ) : (
                <>
                  <span className="mr-2">🔍</span>
                  {locale === 'zh' ? '分析图像' : 'Analyze Image'}
                </>
              )}
            </Button>

            {/* Retry Button */}
            {retryCount > 0 && retryCount < 3 && !isAnalyzing && (
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
          {isAnalyzing && (
            <div className="space-y-3">
              <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${analysisProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {locale === 'zh' ? '正在分析图像...' : 'Analyzing image...'} {Math.round(analysisProgress)}%
                </span>
                <span className="text-muted-foreground">
                  {locale === 'zh' ? '请稍候...' : 'Please wait...'}
                </span>
              </div>
            </div>
          )}

          {/* Generated Prompt */}
          {generatedPrompt && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('generatedPrompt')}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{analysisTypes.find(t => t.id === analysisType)?.icon}</span>
                  <span>{analysisTypes.find(t => t.id === analysisType)?.label}</span>
                </div>
              </div>
              <div className="relative">
                <div className="p-4 bg-muted/50 rounded-lg border min-h-[100px]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
                </div>
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={handleCopyPrompt}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    📋
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopyPrompt} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="mr-1">📋</span>
                  {t('copyPrompt')}
                </Button>
                <Button onClick={handleUsePrompt} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="mr-1">🎨</span>
                  {t('usePrompt')}
                </Button>
                <Button
                  onClick={() => handleAnalyze(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  disabled={isAnalyzing}
                >
                  <span className="mr-1">🔄</span>
                  {locale === 'zh' ? '重新分析' : 'Re-analyze'}
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <span>💡</span>
              {locale === 'zh' ? '使用技巧' : 'Tips'}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {locale === 'zh' ? '清晰的图像能获得更准确的分析结果' : 'Clear images provide more accurate analysis'}</li>
              <li>• {locale === 'zh' ? '不同分析类型适用于不同的创作需求' : 'Different analysis types suit different creative needs'}</li>
              <li>• {locale === 'zh' ? '可以多次分析同一图像获得不同角度的描述' : 'Analyze the same image multiple times for different perspectives'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

ImageToPrompt.displayName = 'ImageToPrompt';

export default ImageToPrompt; 