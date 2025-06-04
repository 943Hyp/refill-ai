"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Locale, getTranslation } from '@/lib/i18n';

interface PromptTemplatesProps {
  setPrompt: (prompt: string) => void;
  setActiveTab: (tab: string) => void;
  locale: Locale;
}

const PromptTemplates = ({ setPrompt, setActiveTab, locale }: PromptTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  const categories = [
    { id: "all", label: locale === 'zh' ? "全部" : "All", icon: "🌟" },
    { id: "portrait", label: locale === 'zh' ? "人像" : "Portrait", icon: "👤" },
    { id: "landscape", label: locale === 'zh' ? "风景" : "Landscape", icon: "🏞️" },
    { id: "anime", label: locale === 'zh' ? "动漫" : "Anime", icon: "🌸" },
    { id: "art", label: locale === 'zh' ? "艺术" : "Art", icon: "🎨" },
    { id: "fantasy", label: locale === 'zh' ? "奇幻" : "Fantasy", icon: "🧙" },
    { id: "sci-fi", label: locale === 'zh' ? "科幻" : "Sci-Fi", icon: "🚀" },
    { id: "architecture", label: locale === 'zh' ? "建筑" : "Architecture", icon: "🏛️" },
  ];

  const templates = [
    {
      id: 1,
      category: "portrait",
      title: locale === 'zh' ? "专业人像摄影" : "Professional Portrait",
      prompt: locale === 'zh' 
        ? "专业人像摄影，柔和光线，浅景深，高质量，8K分辨率，完美构图"
        : "Professional portrait photography, soft lighting, shallow depth of field, high quality, 8K resolution, perfect composition",
      tags: ["portrait", "professional", "photography"],
      difficulty: "beginner",
      likes: 245
    },
    {
      id: 2,
      category: "landscape",
      title: locale === 'zh' ? "壮丽山水风景" : "Majestic Mountain Landscape",
      prompt: locale === 'zh'
        ? "壮丽的山脉风景，日出时分，云雾缭绕，超高清，自然光线，风景摄影杰作"
        : "Majestic mountain landscape, sunrise, misty clouds, ultra HD, natural lighting, landscape photography masterpiece",
      tags: ["landscape", "nature", "mountains"],
      difficulty: "beginner",
      likes: 189
    },
    {
      id: 3,
      category: "anime",
      title: locale === 'zh' ? "可爱动漫角色" : "Cute Anime Character",
      prompt: locale === 'zh'
        ? "可爱的动漫女孩，大眼睛，彩色头发，日式动画风格，高质量，细节丰富"
        : "Cute anime girl, big eyes, colorful hair, Japanese animation style, high quality, detailed",
      tags: ["anime", "character", "cute"],
      difficulty: "intermediate",
      likes: 312
    },
    {
      id: 4,
      category: "art",
      title: locale === 'zh' ? "古典油画风格" : "Classical Oil Painting",
      prompt: locale === 'zh'
        ? "古典油画风格，厚重笔触，丰富色彩，艺术大师作品，博物馆级别质量"
        : "Classical oil painting style, thick brushstrokes, rich colors, masterpiece artwork, museum quality",
      tags: ["art", "painting", "classical"],
      difficulty: "advanced",
      likes: 156
    },
    {
      id: 5,
      category: "fantasy",
      title: locale === 'zh' ? "神秘奇幻城堡" : "Mystical Fantasy Castle",
      prompt: locale === 'zh'
        ? "神秘的奇幻城堡，魔法光芒，云端之上，梦幻色彩，史诗级场景"
        : "Mystical fantasy castle, magical glow, above the clouds, dreamy colors, epic scene",
      tags: ["fantasy", "castle", "magical"],
      difficulty: "intermediate",
      likes: 278
    },
    {
      id: 6,
      category: "art",
      title: locale === 'zh' ? "水彩画艺术" : "Watercolor Art",
      prompt: locale === 'zh'
        ? "水彩画风格，柔和色彩，流动笔触，艺术感强，透明质感，纸质纹理"
        : "Watercolor painting style, soft colors, flowing brushstrokes, artistic, transparent texture, paper texture",
      tags: ["art", "watercolor", "soft"],
      difficulty: "intermediate",
      likes: 134
    },
    {
      id: 7,
      category: "landscape",
      title: locale === 'zh' ? "梦幻海边日落" : "Dreamy Beach Sunset",
      prompt: locale === 'zh'
        ? "美丽的海边日落，金色天空，波浪轻拍，宁静祥和，暖色调，浪漫氛围"
        : "Beautiful beach sunset, golden sky, gentle waves, peaceful and serene, warm tones, romantic atmosphere",
      tags: ["landscape", "sunset", "beach"],
      difficulty: "beginner",
      likes: 201
    },
    {
      id: 8,
      category: "fantasy",
      title: locale === 'zh' ? "史诗龙与骑士" : "Epic Dragon and Knight",
      prompt: locale === 'zh'
        ? "勇敢的骑士面对巨龙，史诗般的战斗场面，戏剧性光线，中世纪风格"
        : "Brave knight facing a dragon, epic battle scene, dramatic lighting, medieval style",
      tags: ["fantasy", "dragon", "knight", "epic"],
      difficulty: "advanced",
      likes: 167
    },
    {
      id: 9,
      category: "sci-fi",
      title: locale === 'zh' ? "未来科幻城市" : "Futuristic Sci-Fi City",
      prompt: locale === 'zh'
        ? "未来科幻城市，霓虹灯光，飞行汽车，摩天大楼，赛博朋克风格，夜景"
        : "Futuristic sci-fi city, neon lights, flying cars, skyscrapers, cyberpunk style, night scene",
      tags: ["sci-fi", "city", "cyberpunk"],
      difficulty: "intermediate",
      likes: 289
    },
    {
      id: 10,
      category: "architecture",
      title: locale === 'zh' ? "现代建筑设计" : "Modern Architecture Design",
      prompt: locale === 'zh'
        ? "现代建筑设计，简约风格，玻璃幕墙，几何形状，建筑摄影，专业照明"
        : "Modern architecture design, minimalist style, glass facade, geometric shapes, architectural photography, professional lighting",
      tags: ["architecture", "modern", "design"],
      difficulty: "intermediate",
      likes: 98
    },
    {
      id: 11,
      category: "portrait",
      title: locale === 'zh' ? "时尚肖像摄影" : "Fashion Portrait Photography",
      prompt: locale === 'zh'
        ? "时尚肖像摄影，专业模特，时尚造型，工作室灯光，高端时尚杂志风格"
        : "Fashion portrait photography, professional model, stylish makeup, studio lighting, high-end fashion magazine style",
      tags: ["portrait", "fashion", "studio"],
      difficulty: "advanced",
      likes: 223
    },
    {
      id: 12,
      category: "anime",
      title: locale === 'zh' ? "机甲动漫风格" : "Mecha Anime Style",
      prompt: locale === 'zh'
        ? "机甲动漫风格，巨型机器人，未来战士，动作场面，日式机甲设计"
        : "Mecha anime style, giant robot, futuristic warrior, action scene, Japanese mecha design",
      tags: ["anime", "mecha", "robot"],
      difficulty: "advanced",
      likes: 176
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return locale === 'zh' ? '初级' : 'Beginner';
      case 'intermediate': return locale === 'zh' ? '中级' : 'Intermediate';
      case 'advanced': return locale === 'zh' ? '高级' : 'Advanced';
      default: return difficulty;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedTemplates = filteredTemplates.sort((a, b) => b.likes - a.likes);

  const handleUseTemplate = (template: typeof templates[0]) => {
    setPrompt(template.prompt);
    setActiveTab('text-to-image');
    toast.success(t('templateApplied'));
  };

  const handleCopyTemplate = async (template: typeof templates[0]) => {
    try {
      await navigator.clipboard.writeText(template.prompt);
      toast.success(t('promptCopied'));
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = template.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(t('promptCopied'));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>📝</span>
            {t('promptTemplates')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('templatesDescription')}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>📊</span>
              {locale === 'zh' ? `${templates.length} 个模板` : `${templates.length} templates`}
            </span>
            <span className="flex items-center gap-1">
              <span>❤️</span>
              {locale === 'zh' ? `${templates.reduce((sum, t) => sum + t.likes, 0)} 次使用` : `${templates.reduce((sum, t) => sum + t.likes, 0)} uses`}
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <input
              placeholder={t('searchTemplates')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              🔍
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm leading-tight">{template.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>❤️</span>
                    <span>{template.likes}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {getDifficultyLabel(template.difficulty)}
                  </span>
                  <span className="px-2 py-1 bg-secondary/50 text-xs rounded-full">
                    {categories.find(c => c.id === template.category)?.icon}
                    {categories.find(c => c.id === template.category)?.label}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {template.prompt}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted/50 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-muted/50 text-xs rounded-full">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <span className="mr-1">✨</span>
                    {t('useTemplate')}
                  </Button>
                  <Button
                    onClick={() => handleCopyTemplate(template)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    📋
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground mb-4">
              {locale === 'zh' ? '没有找到匹配的模板' : 'No matching templates found'}
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }} 
              variant="outline"
            >
              {locale === 'zh' ? '重置筛选' : 'Reset Filters'}
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <span>💡</span>
            {locale === 'zh' ? '使用技巧' : 'Pro Tips'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="space-y-1">
              <p>• {locale === 'zh' ? '可以修改模板中的关键词来个性化' : 'Modify keywords in templates for personalization'}</p>
              <p>• {locale === 'zh' ? '组合多个模板的元素创造独特效果' : 'Combine elements from multiple templates'}</p>
            </div>
            <div className="space-y-1">
              <p>• {locale === 'zh' ? '初级模板适合新手快速上手' : 'Beginner templates are perfect for quick starts'}</p>
              <p>• {locale === 'zh' ? '高级模板包含更多专业术语' : 'Advanced templates include professional terminology'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptTemplates; 
