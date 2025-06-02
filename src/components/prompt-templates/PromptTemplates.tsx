"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { PromptContext } from "@/app/ClientBody";
import { toast } from "sonner";

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  icon: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "portrait-1",
    title: "专业人像摄影",
    description: "高质量的专业人像照片风格",
    prompt: "professional portrait photography, studio lighting, high resolution, detailed facial features, soft shadows, elegant pose, neutral background",
    category: "人像",
    tags: ["摄影", "人像", "专业"],
    icon: "👤"
  },
  {
    id: "landscape-1",
    title: "自然风景",
    description: "壮丽的自然风景摄影",
    prompt: "breathtaking landscape photography, golden hour lighting, dramatic sky, mountains and valleys, vibrant colors, wide angle view, professional photography",
    category: "风景",
    tags: ["自然", "风景", "摄影"],
    icon: "🏔️"
  },
  {
    id: "anime-1",
    title: "动漫风格",
    description: "日式动漫插画风格",
    prompt: "anime style illustration, vibrant colors, detailed character design, manga art style, cel shading, expressive eyes, dynamic pose",
    category: "动漫",
    tags: ["动漫", "插画", "日式"],
    icon: "🎨"
  },
  {
    id: "cyberpunk-1",
    title: "赛博朋克",
    description: "未来主义赛博朋克风格",
    prompt: "cyberpunk style, neon lights, futuristic cityscape, dark atmosphere, high tech low life, digital art, synthwave colors, urban decay",
    category: "科幻",
    tags: ["科幻", "未来", "赛博朋克"],
    icon: "🌃"
  },
  {
    id: "watercolor-1",
    title: "水彩画",
    description: "柔和的水彩画风格",
    prompt: "watercolor painting style, soft brushstrokes, flowing colors, artistic texture, delicate details, traditional art medium, pastel colors",
    category: "艺术",
    tags: ["水彩", "绘画", "艺术"],
    icon: "🖌️"
  },
  {
    id: "minimalist-1",
    title: "极简主义",
    description: "简洁的极简主义设计",
    prompt: "minimalist design, clean lines, simple composition, negative space, modern aesthetic, geometric shapes, monochromatic color scheme",
    category: "设计",
    tags: ["极简", "设计", "现代"],
    icon: "⚪"
  },
  {
    id: "fantasy-1",
    title: "奇幻世界",
    description: "魔幻奇幻风格场景",
    prompt: "fantasy art, magical landscape, mystical creatures, enchanted forest, dramatic lighting, epic composition, detailed fantasy illustration",
    category: "奇幻",
    tags: ["奇幻", "魔法", "插画"],
    icon: "🧙‍♂️"
  },
  {
    id: "vintage-1",
    title: "复古风格",
    description: "怀旧复古摄影风格",
    prompt: "vintage photography style, retro aesthetic, film grain, warm tones, nostalgic atmosphere, classic composition, aged look",
    category: "复古",
    tags: ["复古", "怀旧", "胶片"],
    icon: "📷"
  }
];

const categories = ["全部", "人像", "风景", "动漫", "科幻", "艺术", "设计", "奇幻", "复古"];

const PromptTemplates = () => {
  const { setPrompt } = useContext(PromptContext);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = promptTemplates.filter(template => {
    const matchesCategory = selectedCategory === "全部" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    toast.success(`已应用模板: ${template.title}`);
  };

  const handleCopyTemplate = (template: PromptTemplate) => {
    navigator.clipboard.writeText(template.prompt);
    toast.success("提示词已复制到剪贴板");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl font-bold flex items-center justify-center">
          <span className="mr-2">📝</span>
          提示词模板
        </h2>
        <p className="text-sm text-foreground/60">
          选择预设模板快速开始创作，或获取灵感
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索模板..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-foreground/70 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-foreground/60">
        {searchTerm || selectedCategory !== "全部" ? (
          `找到 ${filteredTemplates.length} 个模板`
        ) : (
          `共 ${promptTemplates.length} 个模板`
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/40">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground/80 mb-2">未找到匹配的模板</h3>
          <p className="text-sm text-foreground/60">
            尝试调整搜索条件或选择其他分类
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-card/30 border border-border rounded-lg p-4 space-y-3 transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{template.icon}</span>
                  <div>
                    <h3 className="font-medium text-foreground">{template.title}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/70 leading-relaxed">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-muted text-foreground/60 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prompt Preview */}
              <div className="bg-background border border-border rounded p-2">
                <p className="text-xs text-foreground/60 line-clamp-2">
                  {template.prompt}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleCopyTemplate(template)}
                >
                  📋 复制
                </Button>
                <Button
                  className="flex-1 text-xs gradient-button text-white"
                  onClick={() => handleUseTemplate(template)}
                >
                  ✨ 使用
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-medium text-primary mb-2 flex items-center">
          <span className="mr-2">💡</span>
          使用提示
        </h4>
        <ul className="text-sm text-foreground/70 space-y-1">
          <li>• 模板提供了基础结构，您可以根据需要进行修改</li>
          <li>• 尝试组合不同模板的元素来创造独特效果</li>
          <li>• 添加具体的描述词可以让结果更符合预期</li>
          <li>• 使用英文提示词通常能获得更好的效果</li>
        </ul>
      </div>
    </div>
  );
};

export default PromptTemplates; 