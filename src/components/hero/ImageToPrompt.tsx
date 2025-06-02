"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import DynamicLogo from "@/components/logo/DynamicLogo";
import { PromptContext } from "@/app/ClientBody";
import ImageGenerator from "./ImageGenerator";
import { analyzeImage } from "@/lib/api";
import { toast } from "sonner";

const ImageToPrompt = () => {
  const { prompt, setPrompt } = useContext(PromptContext);
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'detailed' | 'simple' | 'artistic'>('detailed');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const validateImageFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("请上传图像文件 (JPEG, PNG, GIF, WebP)");
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("图像文件大小不能超过 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = async (file: File) => {
    if (!validateImageFile(file)) {
      return;
    }

    setImageFile(file);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Set the image preview
          setImage(e.target.result as string);
          setIsGenerating(true);
          setShowGenerator(false);
          setAnalysisProgress(0);

          try {
            // Simulate progress
            const progressInterval = setInterval(() => {
              setAnalysisProgress(prev => {
                if (prev >= 90) {
                  clearInterval(progressInterval);
                  return 90;
                }
                return prev + Math.random() * 10;
              });
            }, 300);

            // Get base64 string without the data URL prefix
            const base64String = (e.target.result as string).split(',')[1];

            // Call API to analyze image
            const result = await analyzeImage(base64String);

            clearInterval(progressInterval);
            setAnalysisProgress(100);

            if (result) {
              setGeneratedPrompt(result);
              toast.success("图像分析完成！");
            } else {
              setErrorMessage("图像分析失败，请尝试其他图像或稍后重试");
              toast.error("图像分析失败");
            }
          } catch (error) {
            console.error("Error analyzing image:", error);
            setErrorMessage("分析图像时发生错误，请检查网络连接");
            toast.error("分析图像时发生错误");
          } finally {
            setIsGenerating(false);
            setAnalysisProgress(0);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      setErrorMessage("读取文件时发生错误");
      toast.error("读取文件时发生错误");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const useGeneratedPrompt = () => {
    setPrompt(generatedPrompt);
    setShowGenerator(true);
  };

  const resetImage = () => {
    setImage(null);
    setImageFile(null);
    setGeneratedPrompt("");
    setShowGenerator(false);
    setErrorMessage(null);
    setAnalysisProgress(0);
  };

  const retryAnalysis = () => {
    if (imageFile) {
      handleFileChange(imageFile);
    }
  };

  const getAnalysisTypeDescription = (type: string) => {
    switch (type) {
      case 'detailed':
        return '详细分析 - 包含风格、构图、颜色等完整描述';
      case 'simple':
        return '简单分析 - 基础的主题和对象描述';
      case 'artistic':
        return '艺术分析 - 专注于艺术风格和创作技法';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {!showGenerator ? (
        <>
          <div className="flex justify-center mb-4">
            <DynamicLogo />
          </div>

          {/* Analysis Type Selection */}
          {!image && (
            <div className="bg-card/30 border border-border rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-medium text-foreground/90 mb-3 flex items-center">
                <span className="mr-2">🔍</span>
                分析类型
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'detailed', label: '详细分析', icon: '📝' },
                  { id: 'simple', label: '简单分析', icon: '🎯' },
                  { id: 'artistic', label: '艺术分析', icon: '🎨' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAnalysisType(type.id as any)}
                    className={`flex items-center justify-center p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      analysisType === type.id
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-background border border-border hover:border-primary/30 text-foreground/70'
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-foreground/60 mt-2">
                {getAnalysisTypeDescription(analysisType)}
              </p>
            </div>
          )}

          {/* Enhanced Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
              dragging 
                ? "border-primary border-solid bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50"
            } p-4 sm:p-6 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px] cursor-pointer group`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!image ? (
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full transition-all duration-200 ${
                    dragging ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'
                  }`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={`transition-colors duration-200 ${
                        dragging ? 'text-primary' : 'text-foreground/50 group-hover:text-primary'
                      }`}
                    >
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                      <line x1="16" y1="5" x2="22" y2="5" />
                      <line x1="19" y1="2" x2="19" y2="8" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-foreground/70 text-sm sm:text-base mb-1 font-medium">
                    {dragging ? '释放以上传图像' : '拖拽图像到此处或点击上传'}
                  </p>
                  <p className="text-foreground/50 text-xs sm:text-sm">
                    支持 JPG, PNG, GIF, WebP 格式，最大 10MB
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-foreground/40">
                  <span className="px-2 py-1 bg-muted rounded">📷 照片</span>
                  <span className="px-2 py-1 bg-muted rounded">🎨 艺术作品</span>
                  <span className="px-2 py-1 bg-muted rounded">🖼️ 插画</span>
                  <span className="px-2 py-1 bg-muted rounded">📱 截图</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative max-h-[400px]">
                <img 
                  src={image} 
                  alt="Uploaded" 
                  className="w-full h-full object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetImage();
                    }}
                    className="p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image Info */}
          {imageFile && (
            <div className="bg-card/30 border border-border rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-foreground/70">📁 {imageFile.name}</span>
                </div>
                <div className="flex items-center space-x-4 text-foreground/60">
                  <span>{(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{analysisType === 'detailed' ? '详细' : analysisType === 'simple' ? '简单' : '艺术'} 分析</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center text-red-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
                {imageFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={retryAnalysis}
                  >
                    重试
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {image && (
            <div className="space-y-4">
              <div className="bg-card/30 border border-border rounded-lg p-3 sm:p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-12 h-12 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                      ></div>
                      <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{Math.round(analysisProgress)}%</span>
                      </div>
                    </div>
                    <span className="text-foreground/70 font-medium">正在分析图像...</span>
                    <span className="text-xs text-foreground/50 mt-1">AI 正在理解图像内容</span>
                    <div className="w-full max-w-xs mt-3">
                      <div className="bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : generatedPrompt ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground/90 flex items-center">
                      <span className="mr-2">🎯</span>
                      生成的提示词
                      <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                        {analysisType === 'detailed' ? '详细' : analysisType === 'simple' ? '简单' : '艺术'}
                      </span>
                    </h3>
                    <div className="p-3 rounded-md bg-background border border-border">
                      <p className="text-sm leading-relaxed">{generatedPrompt}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="text-xs text-foreground/60">
                        💡 您可以编辑这个提示词来生成类似的图像
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm rounded-full border-primary text-primary hover:bg-primary/10"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPrompt);
                            toast.success("提示词已复制到剪贴板");
                          }}
                        >
                          📋 复制
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm rounded-full"
                          onClick={() => {
                            // Edit prompt functionality
                            const editedPrompt = prompt(
                              "编辑提示词:", 
                              generatedPrompt
                            );
                            if (editedPrompt !== null) {
                              setGeneratedPrompt(editedPrompt);
                            }
                          }}
                        >
                          ✏️ 编辑
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-sm text-foreground/80 hover:text-foreground cursor-glow transition-colors"
                  onClick={resetImage}
                >
                  🗑️ 清除图像
                </Button>
                <div className="flex space-x-2 w-full sm:w-auto">
                  {imageFile && !isGenerating && (
                    <Button
                      variant="outline"
                      className="rounded-full flex-1 sm:flex-none"
                      onClick={retryAnalysis}
                    >
                      🔄 重新分析
                    </Button>
                  )}
                  <Button
                    className="gradient-button text-white font-medium shadow-md rounded-full px-4 sm:px-6 flex-1 sm:flex-none"
                    onClick={useGeneratedPrompt}
                    disabled={isGenerating || !generatedPrompt}
                  >
                    {generatedPrompt ? "🎨 用此提示词生成图像" : "等待分析完成"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center">
              <span className="mr-2">🎨</span>
              基于提示词生成图像
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm rounded-full"
              onClick={() => setShowGenerator(false)}
            >
              ← 返回分析
            </Button>
          </div>
          
          {/* Show the original image for reference */}
          {image && (
            <div className="bg-card/30 border border-border rounded-lg p-3 mb-4">
              <h3 className="text-sm font-medium text-foreground/90 mb-2 flex items-center">
                <span className="mr-2">📷</span>
                参考图像
              </h3>
              <div className="relative w-full max-w-xs mx-auto">
                <img 
                  src={image} 
                  alt="Reference" 
                  className="w-full h-auto object-contain rounded border border-border"
                />
              </div>
            </div>
          )}
          
          <ImageGenerator />
        </>
      )}
    </div>
  );
};

export default ImageToPrompt;
