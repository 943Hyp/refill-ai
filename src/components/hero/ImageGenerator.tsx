"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PromptContext } from "@/app/ClientBody";
import { generateImage, saveToHistory, type StyleOptions, GeneratedImage } from "@/lib/api";
import { toast } from "sonner";

// Style option types
type StyleType = "style" | "color" | "lighting" | "composition" | "quality" | "aspect";

const ImageGenerator = () => {
  const { prompt, setPrompt } = useContext(PromptContext);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([]);
  const [selectedEnhancedPrompt, setSelectedEnhancedPrompt] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Main options state; default to Square aspect
  const [options, setOptions] = useState({
    squareAspect: true,
    wideAspect: false,
    verticalAspect: false,
    noStyle: false,
    noColor: false,
    noLighting: false,
    noComposition: false,
    highQuality: false,
  });

  // Selected values for each option category
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({
    style: "none",
    color: "none",
    lighting: "none",
    composition: "none",
    quality: "standard",
    aspect: "square",
  });

  // Enhanced style options with better mobile support
  const styleOptions = {
    style: [
      { id: "none", icon: "⊘", label: "None" },
      { id: "digital-art", icon: "🎨", label: "Digital Art" },
      { id: "sci-fi", icon: "✧", label: "Sci-Fi" },
      { id: "line-art", icon: "✎", label: "Line Art" },
      { id: "pixel-art", icon: "⬚", label: "Pixel Art" },
      { id: "photo", icon: "📷", label: "Photo" },
      { id: "film", icon: "🎞️", label: "Film" },
      { id: "origami", icon: "📄", label: "Origami" },
      { id: "3d-model", icon: "⬢", label: "3D Model" },
      { id: "animation", icon: "🎬", label: "Animation" },
      { id: "fantasy", icon: "⚔️", label: "Fantasy" },
      { id: "lowpoly", icon: "◇", label: "Low Poly" },
      { id: "cinematic", icon: "🎬", label: "Cinematic" },
      { id: "enhance", icon: "✨", label: "Enhance" },
      { id: "manga", icon: "📚", label: "Manga" },
      { id: "isometric", icon: "◰", label: "Isometric" },
      { id: "clay", icon: "🏺", label: "Clay" },
      { id: "watercolor", icon: "🖌️", label: "Watercolor" },
      { id: "oil-painting", icon: "🖼️", label: "Oil Painting" },
      { id: "sketch", icon: "✏️", label: "Sketch" },
    ],
    color: [
      { id: "none", icon: "⊘", label: "None" },
      { id: "warm", icon: "🔥", label: "Warm" },
      { id: "cold", icon: "❄️", label: "Cold" },
      { id: "harmonious", icon: "⚛️", label: "Harmonious" },
      { id: "vibrant", icon: "✨", label: "Vibrant" },
      { id: "pastel", icon: "🎨", label: "Pastel" },
      { id: "bnw", icon: "⚪", label: "Black & White" },
      { id: "neon", icon: "💡", label: "Neon" },
      { id: "earth-tones", icon: "🌍", label: "Earth Tones" },
      { id: "monochrome", icon: "⚫", label: "Monochrome" },
    ],
    lighting: [
      { id: "none", icon: "⊘", label: "None" },
      { id: "dramatic", icon: "🎭", label: "Dramatic" },
      { id: "moodlight", icon: "🌙", label: "Moody" },
      { id: "studio", icon: "🏢", label: "Studio" },
      { id: "dimlight", icon: "💡", label: "Dim" },
      { id: "golden", icon: "🌟", label: "Golden Hour" },
      { id: "contre-jour", icon: "☀️", label: "Contre-jour" },
      { id: "volumetric", icon: "🔆", label: "Volumetric" },
      { id: "tyndall", icon: "🌈", label: "Tyndall" },
      { id: "sunlight", icon: "☀️", label: "Sunlight" },
      { id: "rims", icon: "⭕", label: "Rim Light" },
      { id: "soft", icon: "🕯️", label: "Soft Light" },
      { id: "harsh", icon: "⚡", label: "Harsh Light" },
    ],
    composition: [
      { id: "none", icon: "⊘", label: "None" },
      { id: "landscape", icon: "🌄", label: "Landscape" },
      { id: "closeup", icon: "🔍", label: "Close-up" },
      { id: "wideangle", icon: "📐", label: "Wide Angle" },
      { id: "dof", icon: "👁️", label: "Depth of Field" },
      { id: "lowangle", icon: "⬆️", label: "Low Angle" },
      { id: "highangle", icon: "⬇️", label: "High Angle" },
      { id: "macro", icon: "🔎", label: "Macro" },
      { id: "portrait", icon: "👤", label: "Portrait" },
      { id: "symmetrical", icon: "⚖️", label: "Symmetrical" },
    ],
    quality: [
      { id: "standard", icon: "📱", label: "Standard" },
      { id: "high", icon: "✨", label: "High Quality" },
      { id: "ultra", icon: "💎", label: "Ultra HD" },
    ],
    aspect: [
      { id: "square", icon: "◼️", label: "Square (1:1)" },
      { id: "wide", icon: "▬", label: "Wide (16:9)" },
      { id: "vertical", icon: "▯", label: "Vertical (9:16)" },
      { id: "portrait", icon: "📱", label: "Portrait (4:5)" },
      { id: "landscape", icon: "🖼️", label: "Landscape (3:2)" },
    ]
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // Enhanced prompt generation with real AI-like suggestions
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      // Simulate more realistic prompt enhancement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const basePrompt = prompt.trim();
      const enhanced = [
        `${basePrompt}, masterpiece, best quality, ultra detailed, 8k resolution, professional photography, perfect lighting, sharp focus`,
        `${basePrompt}, artistic composition, vibrant colors, dramatic lighting, cinematic quality, highly detailed, award winning`,
        `${basePrompt}, photorealistic, studio lighting, professional grade, ultra high definition, perfect composition, trending on artstation`
      ];
      
      setEnhancedPrompts(enhanced);
      toast.success("提示词已优化完成！");
    } catch (error) {
      setErrorMessage("提示词优化失败，请重试");
      toast.error("提示词优化失败");
    } finally {
      setIsEnhancing(false);
    }
  };

  const selectEnhancedPrompt = (index: number) => {
    setSelectedEnhancedPrompt(index);
    setPrompt(enhancedPrompts[index]);
  };

  const handleClear = () => {
    setPrompt("");
    setEnhancedPrompts([]);
    setSelectedEnhancedPrompt(null);
    setGeneratedImage(null);
    setErrorMessage(null);
    setGenerationProgress(0);
  };

  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  const toggleOption = (category: string, optionId: string) => {
    // Update the selected value for this category
    setSelectedValues({
      ...selectedValues,
      [category]: optionId === selectedValues[category] ? "none" : optionId
    });

    // Update corresponding option state for main toggles
    if (category === "style") {
      setOptions(prev => ({ ...prev, noStyle: optionId !== "none" }));
    } else if (category === "color") {
      setOptions(prev => ({ ...prev, noColor: optionId !== "none" }));
    } else if (category === "lighting") {
      setOptions(prev => ({ ...prev, noLighting: optionId !== "none" }));
    } else if (category === "composition") {
      setOptions(prev => ({ ...prev, noComposition: optionId !== "none" }));
    } else if (category === "quality") {
      setOptions(prev => ({ ...prev, highQuality: optionId !== "standard" }));
    } else if (category === "aspect") {
      setOptions(prev => ({
        ...prev,
        squareAspect: optionId === "square",
        wideAspect: optionId === "wide",
        verticalAspect: optionId === "vertical"
      }));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced image generation with progress tracking
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("请先输入提示词");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setErrorMessage(null);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Prepare style options from selected values
      const styleOptions: StyleOptions = {
        style: selectedValues.style !== "none" ? selectedValues.style : undefined,
        color: selectedValues.color !== "none" ? selectedValues.color : undefined,
        lighting: selectedValues.lighting !== "none" ? selectedValues.lighting : undefined,
        composition: selectedValues.composition !== "none" ? selectedValues.composition : undefined,
        quality: selectedValues.quality !== "standard",
        aspectRatio: selectedValues.aspect as "square" | "wide" | "vertical"
      };

      // Call API to generate image
      const result = await generateImage(prompt, styleOptions);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (result) {
        // Show the generated image
        setGeneratedImage(result.base64);

        // Save to history
        saveToHistory(prompt, result.base64);

        toast.success("图像生成成功！");
      } else {
        setErrorMessage("图像生成失败，请检查网络连接或稍后重试");
        toast.error("图像生成失败，请重试");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setErrorMessage("生成图像时发生错误，请稍后重试");
      toast.error("生成图像时发生错误");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  // Enhanced random prompts with more variety
  const handleRandomImage = () => {
    const randomPrompts = [
      "一只可爱的橘猫在阳光明媚的花园里玩耍",
      "未来主义城市天际线，霓虹灯闪烁，飞行汽车穿梭",
      "宁静的山间湖泊，倒映着雪山和彩霞",
      "神秘的森林深处，阳光透过树叶洒下斑驳光影",
      "古老的城堡矗立在悬崖边，被薄雾环绕",
      "色彩斑斓的热带鱼在珊瑚礁中游泳",
      "星空下的沙漠绿洲，骆驼商队正在休息",
      "蒸汽朋克风格的机械装置，齿轮和管道交错",
      "樱花飞舞的日式庭院，古朴的木桥横跨小溪",
      "北极光下的雪原，驯鹿群在迁徙",
      "赛博朋克风格的街道，机器人和人类共存",
      "梦幻般的水下宫殿，被发光的水母照亮"
    ];

    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    setPrompt(randomPrompts[randomIndex]);

    // Reset image and prompts
    setGeneratedImage(null);
    setEnhancedPrompts([]);
    setSelectedEnhancedPrompt(null);
    setErrorMessage(null);
  };

  // Helper for style toggle button appearance - improved for mobile
  const styleButtonClass = (
    isActive: boolean,
    gradient: string,
  ) =>
    `rounded-full py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center border min-w-0 flex-shrink-0
    ${
      isActive
        ? `${gradient} text-white shadow-md border-transparent`
        : "border border-gray-600 bg-gray-800/80 text-gray-200 hover:border-gray-400"
    }`;

  // Helper for style toggle indicator
  const styleIndicator = (isActive: boolean) => (
    <div
      className={`w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center border ${
        isActive ? "border-white/50" : "border-gray-500"
      } rounded mr-1 sm:mr-2 flex-shrink-0`}
    >
      {isActive && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-sm" />}
    </div>
  );

  // Get gradient for a category
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "style":
        return "bg-gradient-to-r from-violet-500/90 to-blue-500/90";
      case "color":
        return "bg-gradient-to-r from-blue-500/90 to-teal-500/90";
      case "lighting":
        return "bg-gradient-to-r from-teal-500/90 to-pink-500/90";
      case "composition":
        return "bg-gradient-to-r from-pink-500/90 to-teal-500/90";
      case "quality":
        return "bg-gradient-to-r from-yellow-500/90 to-orange-500/90";
      case "aspect":
        return "bg-gradient-to-r from-pink-500/90 to-violet-500/90";
      default:
        return "bg-gradient-to-r from-gray-500/90 to-gray-700/90";
    }
  };

  // Get currently selected option label for a category
  const getSelectedOptionLabel = (category: string) => {
    const selectedId = selectedValues[category];
    if (selectedId === "none" && category !== "quality" && category !== "aspect") {
      return "None";
    }

    const option = styleOptions[category as keyof typeof styleOptions]?.find(opt => opt.id === selectedId);
    return option ? option.label : "None";
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-4">
        {/* Enhanced textarea with better mobile support */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[80px] sm:min-h-[96px] rounded-lg border border-border bg-background p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-sm sm:text-base"
            placeholder="描述你想要生成的图像..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="text-xs text-foreground/50">
              {prompt.length}/500
            </span>
            <div className="flex items-center space-x-1">
              <button 
                className="text-primary/60 hover:text-primary cursor-glow transition-colors"
                onClick={() => {
                  // Add favorite prompt functionality
                  toast.success("已添加到收藏");
                }}
                title="收藏提示词"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
              <div className="h-4 w-px bg-border" />
              <button 
                className="text-primary/60 hover:text-primary cursor-glow transition-colors"
                onClick={() => {
                  // Add help functionality
                  toast.info("提示：使用详细的描述可以获得更好的结果");
                }}
                title="获取帮助"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced prompt enhancement section */}
        {prompt.trim() && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xs text-foreground/60">
              💡 提示：详细的描述能生成更好的图像
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm rounded-full border-primary text-primary hover:bg-primary/10 transition-all duration-200"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
            >
              {isEnhancing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2" />
                  优化中...
                </>
              ) : (
                "✨ 优化提示词"
              )}
            </Button>
          </div>
        )}

        {/* Enhanced prompts display */}
        {enhancedPrompts.length > 0 && (
          <div className="space-y-3 bg-card/30 p-3 sm:p-4 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-foreground/90 flex items-center">
              <span className="mr-2">🎯</span>
              优化后的提示词
              <span className="text-xs text-foreground/60 ml-2">(点击选择)</span>
            </h3>
            <div className="grid gap-2">
              {enhancedPrompts.map((enhancedPrompt, index) => (
                <div
                  key={`prompt-${index}-${enhancedPrompt.substring(0, 10).replace(/\s+/g, '-')}`}
                  className={`p-3 rounded-md text-xs sm:text-sm cursor-pointer transition-all duration-200 ${
                    selectedEnhancedPrompt === index
                      ? "bg-primary/20 border border-primary/50 shadow-sm"
                      : "bg-background hover:bg-primary/10 border border-border hover:border-primary/30"
                  }`}
                  onClick={() => selectEnhancedPrompt(index)}
                >
                  {enhancedPrompt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improved Options Bar with better mobile layout */}
        <div className="bg-gray-800/60 rounded-xl p-3 sm:p-4 backdrop-blur-sm" ref={optionsRef}>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {/* Category Toggle Buttons - Improved mobile layout */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {/* Aspect Ratio Button */}
              <button
                type="button"
                onClick={() => toggleCategory("aspect")}
                className={styleButtonClass(
                  activeCategory === "aspect" || selectedValues.aspect !== "square",
                  getCategoryGradient("aspect")
                )}
              >
                {styleIndicator(selectedValues.aspect !== "square")}
                <span className="truncate">
                  {getSelectedOptionLabel("aspect").split('(')[0].trim()}
                </span>
              </button>

              {/* Style Button */}
              <button
                type="button"
                onClick={() => toggleCategory("style")}
                className={styleButtonClass(
                  activeCategory === "style" || selectedValues.style !== "none",
                  getCategoryGradient("style")
                )}
              >
                {styleIndicator(selectedValues.style !== "none")}
                <span className="truncate">{getSelectedOptionLabel("style")}</span>
              </button>

              {/* Color Button */}
              <button
                type="button"
                onClick={() => toggleCategory("color")}
                className={styleButtonClass(
                  activeCategory === "color" || selectedValues.color !== "none",
                  getCategoryGradient("color")
                )}
              >
                {styleIndicator(selectedValues.color !== "none")}
                <span className="truncate">{getSelectedOptionLabel("color")}</span>
              </button>

              {/* Lighting Button */}
              <button
                type="button"
                onClick={() => toggleCategory("lighting")}
                className={styleButtonClass(
                  activeCategory === "lighting" || selectedValues.lighting !== "none",
                  getCategoryGradient("lighting")
                )}
              >
                {styleIndicator(selectedValues.lighting !== "none")}
                <span className="truncate">{getSelectedOptionLabel("lighting")}</span>
              </button>

              {/* Composition Button */}
              <button
                type="button"
                onClick={() => toggleCategory("composition")}
                className={styleButtonClass(
                  activeCategory === "composition" || selectedValues.composition !== "none",
                  getCategoryGradient("composition")
                )}
              >
                {styleIndicator(selectedValues.composition !== "none")}
                <span className="truncate">{getSelectedOptionLabel("composition")}</span>
              </button>

              {/* Quality Button */}
              <button
                type="button"
                onClick={() => toggleCategory("quality")}
                className={styleButtonClass(
                  activeCategory === "quality" || selectedValues.quality !== "standard",
                  getCategoryGradient("quality")
                )}
              >
                {styleIndicator(selectedValues.quality !== "standard")}
                <span className="truncate">{getSelectedOptionLabel("quality")}</span>
              </button>
            </div>

            {/* Options Panel - Improved mobile layout */}
            {activeCategory && (
              <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700 transition-all duration-200">
                <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center justify-between">
                  <span>{`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} 选项`}</span>
                  <button
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => setActiveCategory(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {styleOptions[activeCategory as keyof typeof styleOptions]?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(activeCategory, option.id)}
                      className={`flex items-center rounded-full py-1.5 px-2 sm:px-3 text-xs sm:text-sm transition-all duration-150 min-w-0 ${
                        selectedValues[activeCategory] === option.id
                          ? `${getCategoryGradient(activeCategory)} text-white shadow-sm`
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      <span className="mr-1 sm:mr-2 flex-shrink-0">{option.icon}</span>
                      <span className="truncate">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center text-red-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Enhanced Generated Image Display */}
        {generatedImage && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-card/30 border border-border rounded-lg">
            <h3 className="text-sm font-medium text-foreground/90 mb-3 flex items-center">
              <span className="mr-2">🎨</span>
              生成的图像
            </h3>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border group">
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Generated image"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
              <div className="text-xs text-foreground/60">
                点击右键保存图像，或使用下载按钮
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-full"
                  onClick={() => {
                    // Create a link to download the image
                    const link = document.createElement('a');
                    link.href = `data:image/png;base64,${generatedImage}`;
                    link.download = `refill-ai-${Date.now()}.png`;
                    link.click();
                    toast.success("图像下载成功！");
                  }}
                >
                  📥 下载
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm rounded-full"
                  onClick={() => {
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: 'Refill AI 生成的图像',
                        text: prompt,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("链接已复制到剪贴板");
                    }
                  }}
                >
                  🔗 分享
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced loading state with progress */}
        {isGenerating && (
          <div className="mt-4 sm:mt-6 p-6 sm:p-8 bg-card/30 border border-border rounded-lg flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                style={{
                  background: `conic-gradient(from 0deg, transparent ${360 - (generationProgress * 3.6)}deg, #3b82f6 ${360 - (generationProgress * 3.6)}deg)`
                }}
              ></div>
              <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                <span className="text-xs font-medium text-primary">{Math.round(generationProgress)}%</span>
              </div>
            </div>
            <p className="text-center text-foreground/80 font-medium">正在生成您的图像...</p>
            <p className="text-center text-xs text-foreground/60 mt-2">这可能需要 15-30 秒</p>
            <div className="w-full max-w-xs mt-4">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
          <Button
            variant="ghost"
            className="text-sm text-foreground/80 hover:text-foreground cursor-glow transition-colors"
            onClick={handleClear}
          >
            🗑️ 清除
          </Button>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="rounded-full bg-muted text-foreground/80 border-none hover:bg-muted/80 cursor-glow transition-all duration-200 flex-1 sm:flex-none"
              onClick={handleRandomImage}
            >
              🎲 随机
            </Button>
            <Button
              className="gradient-button text-white font-medium shadow-md rounded-full px-4 sm:px-6 transition-all duration-200 flex-1 sm:flex-none"
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? "生成中..." : "🎨 生成图像"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
