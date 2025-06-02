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
  const optionsRef = useRef<HTMLDivElement>(null);

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
    quality: "highquality",
    aspect: "square",
  });

  // Style options definition
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
    ],
    color: [
      { id: "none", icon: "⊘", label: "None" },
      { id: "warm", icon: "🔥", label: "Warm" },
      { id: "cold", icon: "❄️", label: "Cold" },
      { id: "harmonious", icon: "⚛️", label: "Harmonious" },
      { id: "vibrant", icon: "✨", label: "Vibrant" },
      { id: "pastel", icon: "🎨", label: "Pastel" },
      { id: "bnw", icon: "⚪", label: "Black & White" },
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
    ],
    quality: [
      { id: "none", icon: "⊘", label: "Normal" },
      { id: "highquality", icon: "✨", label: "High Quality" },
    ],
    aspect: [
      { id: "square", icon: "◼️", label: "Square" },
      { id: "wide", icon: "▬", label: "Wide" },
      { id: "vertical", icon: "▯", label: "Vertical" },
    ]
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);

    // Simulate API call to generate enhanced prompts
    setTimeout(() => {
      const enhanced = [
        `${prompt.trim()}, ultra high resolution, exquisite details, dreamy lighting effects, professional photography, 8K`,
        `${prompt.trim()}, artistic style, rich colors, strong contrast, fine texture, depth of field effect`,
        `${prompt.trim()}, sci-fi style, futuristic, metallic texture, neon lighting effects, cinematic quality`
      ];
      setEnhancedPrompts(enhanced);
      setIsEnhancing(false);
    }, 1000);
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
      setOptions(prev => ({ ...prev, highQuality: optionId === "highquality" }));
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

  // Generate image function
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Prepare style options from selected values
      const styleOptions: StyleOptions = {
        style: selectedValues.style !== "none" ? selectedValues.style : undefined,
        color: selectedValues.color !== "none" ? selectedValues.color : undefined,
        lighting: selectedValues.lighting !== "none" ? selectedValues.lighting : undefined,
        composition: selectedValues.composition !== "none" ? selectedValues.composition : undefined,
        quality: selectedValues.quality === "highquality",
        aspectRatio: selectedValues.aspect as "square" | "wide" | "vertical"
      };

      // Call API to generate image
      const result = await generateImage(prompt, styleOptions);

      if (result) {
        // Show the generated image
        setGeneratedImage(result.base64);

        // Save to history
        saveToHistory(prompt, result.base64);

        toast.success("Image generated successfully!");
      } else {
        toast.error("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred while generating the image");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate random image with random prompt
  const handleRandomImage = () => {
    const randomPrompts = [
      "A serene landscape with mountains and a lake at sunset",
      "A futuristic city with flying cars and neon lights",
      "A cute cat playing with a ball of yarn in a cozy living room",
      "An underwater scene with colorful coral and tropical fish",
      "A majestic castle on a hilltop surrounded by fog",
      "A starry night sky over a desert landscape",
      "A fantasy dragon soaring through cloudy skies",
      "A cozy cabin in the woods during winter with snow falling",
      "A vibrant farmers market with fresh produce and flowers"
    ];

    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    setPrompt(randomPrompts[randomIndex]);

    // Reset image and prompts
    setGeneratedImage(null);
    setEnhancedPrompts([]);
    setSelectedEnhancedPrompt(null);
  };

  // Helper for style toggle button appearance
  const styleButtonClass = (
    isActive: boolean,
    gradient: string,
  ) =>
    `rounded-full py-1.5 px-3 text-sm font-medium transition-all duration-200 flex items-center border
    ${
      isActive
        ? `${gradient} text-white shadow-md border-transparent`
        : "border border-gray-600 bg-gray-800/80 text-gray-200 hover:border-gray-400"
    }`;

  // Helper for style toggle indicator
  const styleIndicator = (isActive: boolean) => (
    <div
      className={`w-4 h-4 flex items-center justify-center border ${
        isActive ? "border-white/50" : "border-gray-500"
      } rounded mr-2`}
    >
      {isActive && <div className="w-2 h-2 bg-white rounded-sm" />}
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
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <textarea
            className="w-full h-24 rounded-lg border border-border bg-background p-4 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="What do you want to see?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button className="text-primary/60 hover:text-primary cursor-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            <div className="h-5 w-px bg-border" />
            <button className="text-primary/60 hover:text-primary cursor-glow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>

        {prompt.trim() && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-sm rounded-full border-primary text-primary hover:bg-primary/10"
              onClick={handleEnhancePrompt}
              disabled={isEnhancing}
            >
              {isEnhancing ? "Enhancing..." : "Enhance Prompt"}
            </Button>
          </div>
        )}

        {enhancedPrompts.length > 0 && (
          <div className="space-y-3 bg-card/30 p-4 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-foreground/90">
              Enhanced Prompt Versions{" "}
              <span className="text-xs text-foreground/60">(click to select)</span>
            </h3>
            <div className="grid gap-2">
              {enhancedPrompts.map((enhancedPrompt, index) => (
                <div
                  key={`prompt-${index}-${enhancedPrompt.substring(0, 10).replace(/\s+/g, '-')}`}
                  className={`p-3 rounded-md text-sm cursor-pointer transition-colors ${
                    selectedEnhancedPrompt === index
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-background hover:bg-primary/10 border border-border"
                  }`}
                  onClick={() => selectEnhancedPrompt(index)}
                >
                  {enhancedPrompt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options Bar with Categories */}
        <div className="bg-gray-800/60 rounded-xl p-3 backdrop-blur-sm" ref={optionsRef}>
          <div className="flex flex-col space-y-4">
            {/* Category Toggle Buttons */}
            <div className="flex items-center flex-wrap gap-3">
              {/* Aspect Ratio Button */}
              <button
                type="button"
                onClick={() => toggleCategory("aspect")}
                className={styleButtonClass(
                  activeCategory === "aspect" || selectedValues.aspect !== "none",
                  getCategoryGradient("aspect")
                )}
              >
                {styleIndicator(selectedValues.aspect !== "none")}
                <span>
                  {getSelectedOptionLabel("aspect")}
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
                <span>{getSelectedOptionLabel("style")}</span>
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
                <span>{getSelectedOptionLabel("color")}</span>
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
                <span>{getSelectedOptionLabel("lighting")}</span>
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
                <span>{getSelectedOptionLabel("composition")}</span>
              </button>

              {/* Quality Button */}
              <button
                type="button"
                onClick={() => toggleCategory("quality")}
                className={styleButtonClass(
                  activeCategory === "quality" || selectedValues.quality === "highquality",
                  getCategoryGradient("quality")
                )}
              >
                {styleIndicator(selectedValues.quality === "highquality")}
                <span>{getSelectedOptionLabel("quality")}</span>
              </button>
            </div>

            {/* Options Panel - Shows when category is active */}
            {activeCategory && (
              <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700 transition-all duration-200">
                <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
                  <span className="mr-2">{`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Options`}</span>
                  <button
                    className="ml-auto text-gray-400 hover:text-white"
                    onClick={() => setActiveCategory(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </h3>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {styleOptions[activeCategory as keyof typeof styleOptions]?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(activeCategory, option.id)}
                      className={`flex items-center rounded-full py-1.5 px-3 text-sm transition-all duration-150 ${
                        selectedValues[activeCategory] === option.id
                          ? `${getCategoryGradient(activeCategory)} text-white shadow-sm`
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-1 text-sm text-foreground/80 bg-muted rounded-full px-3 py-1">
            <span>Negative Prompt</span>
            <span className="text-xs bg-muted-foreground/20 rounded-full px-2">0</span>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImage && (
          <div className="mt-6 p-4 bg-card/30 border border-border rounded-lg">
            <h3 className="text-sm font-medium text-foreground/90 mb-3">Generated Image</h3>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-end mt-3 space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm rounded-full"
                onClick={() => {
                  // Create a link to download the image
                  const link = document.createElement('a');
                  link.href = `data:image/png;base64,${generatedImage}`;
                  link.download = `refill-ai-${Date.now()}.png`;
                  link.click();
                  toast.success("Image downloaded successfully!");
                }}
              >
                Download
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 p-8 bg-card/30 border border-border rounded-lg flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4" />
            <p className="text-center text-foreground/80">Generating your image...</p>
            <p className="text-center text-xs text-foreground/60 mt-2">This may take up to 30 seconds</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            className="text-sm text-foreground/80 hover:text-foreground cursor-glow"
            onClick={handleClear}
          >
            Clear
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="rounded-full bg-muted text-foreground/80 border-none hover:bg-muted/80 cursor-glow"
              onClick={handleRandomImage}
            >
              Random
            </Button>
            <Button
              className="gradient-button text-white font-medium shadow-md rounded-full px-6"
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
