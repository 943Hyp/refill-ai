"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/lib/i18n';

interface GallerySectionProps {
  locale: Locale;
}

interface Artwork {
  id: string;
  imageUrl: string;
  title: string;
  prompt: string;
  style: string;
  likes: number;
  author: string;
  height: number; // 用于瀑布流布局
}

const artworks: Artwork[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/400/380?random=1',
    title: '赛博朋克女战士',
    prompt: 'Cyberpunk female warrior with neon blue armor, glowing circuits, futuristic cityscape background, dramatic lighting, ultra detailed 8K',
    style: 'Cyberpunk',
    likes: 12847,
    author: 'MidjourneyAI',
    height: 380
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/400/460?random=2',
    title: '魔法师召唤仪式',
    prompt: 'Powerful wizard casting spell, purple magical energy, floating runes, mystical forest, ethereal atmosphere, fantasy art style',
    style: 'Fantasy',
    likes: 15623,
    author: 'DALL-E 3',
    height: 460
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    title: '火星殖民基地',
    prompt: 'Mars colony base with glass domes, red planet landscape, futuristic architecture, space exploration, sci-fi concept art',
    style: 'Sci-Fi',
    likes: 9834,
    author: 'StableDiffusion',
    height: 300
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/400/260?random=4',
    title: '凤凰重生',
    prompt: 'Majestic phoenix rising from golden flames, detailed feathers, fire effects, mythical creature, dramatic composition',
    style: 'Mythical',
    likes: 18234,
    author: 'MidjourneyAI',
    height: 260
  },
  {
    id: '5',
    imageUrl: 'https://picsum.photos/400/360?random=5',
    title: '机械天使',
    prompt: 'Cybernetic angel with metallic wings, glowing blue circuits, heavenly light, fusion of divine and technology',
    style: 'Cyberpunk',
    likes: 14567,
    author: 'DALL-E 3',
    height: 360
  },
  {
    id: '6',
    imageUrl: 'https://picsum.photos/400/280?random=6',
    title: '翡翠龙宫',
    prompt: 'Underwater dragon palace with emerald crystals, bioluminescent coral, mystical sea creatures, fantasy underwater world',
    style: 'Fantasy',
    likes: 11456,
    author: 'StableDiffusion',
    height: 280
  },
  {
    id: '7',
    imageUrl: 'https://picsum.photos/400/400?random=7',
    title: '星云漫步者',
    prompt: 'Astronaut floating in purple nebula, cosmic dust, distant galaxies, space exploration, photorealistic sci-fi art',
    style: 'Space',
    likes: 16789,
    author: 'MidjourneyAI',
    height: 400
  },
  {
    id: '8',
    imageUrl: 'https://picsum.photos/400/240?random=8',
    title: '黄金神殿守护者',
    prompt: 'Ancient temple guardian statue, golden armor, mystical runes, divine light rays, epic fantasy architecture',
    style: 'Fantasy',
    likes: 8934,
    author: 'DALL-E 3',
    height: 240
  },
  {
    id: '9',
    imageUrl: 'https://picsum.photos/400/320?random=9',
    title: '樱花武士',
    prompt: 'Samurai warrior in pink armor, cherry blossom petals falling, katana sword, anime art style, dramatic pose',
    style: 'Anime',
    likes: 19876,
    author: 'NovalAI',
    height: 320
  },
  {
    id: '10',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    title: '蒸汽朋克飞艇',
    prompt: 'Victorian steampunk airship with brass gears, copper pipes, steam engines, flying through cloudy skies',
    style: 'Steampunk',
    likes: 7623,
    author: 'StableDiffusion',
    height: 300
  },
  {
    id: '11',
    imageUrl: 'https://picsum.photos/400/420?random=11',
    title: '霓虹都市猎人',
    prompt: 'Neon-lit cyberpunk bounty hunter, purple and pink lighting, futuristic weapons, rain-soaked streets',
    style: 'Cyberpunk',
    likes: 13245,
    author: 'MidjourneyAI',
    height: 420
  },
  {
    id: '12',
    imageUrl: 'https://picsum.photos/400/260?random=12',
    title: '森林精灵',
    prompt: 'Ethereal forest elf with glowing green eyes, nature magic, luminescent flowers, mystical woodland setting',
    style: 'Fantasy',
    likes: 10567,
    author: 'DALL-E 3',
    height: 260
  },
  {
    id: '13',
    imageUrl: 'https://picsum.photos/400/360?random=13',
    title: '冰霜法师',
    prompt: 'Ice mage with crystal staff, frozen magic effects, blue and white palette, detailed robes, winter landscape',
    style: 'Fantasy',
    likes: 12890,
    author: 'StableDiffusion',
    height: 360
  },
  {
    id: '14',
    imageUrl: 'https://picsum.photos/400/280?random=14',
    title: '烈焰战神',
    prompt: 'Fire warrior god with flaming sword, molten armor, volcanic background, epic battle scene, divine power',
    style: 'Mythical',
    likes: 17234,
    author: 'MidjourneyAI',
    height: 280
  },
  {
    id: '15',
    imageUrl: 'https://picsum.photos/400/380?random=15',
    title: '量子实验室',
    prompt: 'Futuristic quantum physics laboratory, holographic displays, energy particles, scientific equipment, neon lighting',
    style: 'Sci-Fi',
    likes: 8765,
    author: 'DALL-E 3',
    height: 380
  },
  {
    id: '16',
    imageUrl: 'https://picsum.photos/400/240?random=16',
    title: '梦境花园',
    prompt: 'Surreal dream garden with floating flowers, pastel colors, dreamy atmosphere, soft lighting, whimsical design',
    style: 'Surreal',
    likes: 9456,
    author: 'StableDiffusion',
    height: 240
  },
  {
    id: '17',
    imageUrl: 'https://picsum.photos/400/320?random=17',
    title: '数字女神',
    prompt: 'Digital goddess with holographic dress, data streams, virtual reality, cybernetic beauty, futuristic portrait',
    style: 'Digital Art',
    likes: 15678,
    author: 'MidjourneyAI',
    height: 320
  },
  {
    id: '18',
    imageUrl: 'https://picsum.photos/400/300?random=18',
    title: '水晶龙',
    prompt: 'Majestic crystal dragon with transparent scales, rainbow reflections, magical cave, fantasy creature art',
    style: 'Fantasy',
    likes: 14123,
    author: 'DALL-E 3',
    height: 300
  },
  {
    id: '19',
    imageUrl: 'https://picsum.photos/400/420?random=19',
    title: '沙漠机甲',
    prompt: 'Giant desert mecha warrior, sand storm, post-apocalyptic landscape, detailed mechanical design, epic scale',
    style: 'Mecha',
    likes: 11789,
    author: 'StableDiffusion',
    height: 420
  },
  {
    id: '20',
    imageUrl: 'https://picsum.photos/400/360?random=20',
    title: '时空旅行者',
    prompt: 'Time traveler with glowing portal, swirling energy, multiple dimensions, sci-fi concept, dramatic lighting',
    style: 'Sci-Fi',
    likes: 16234,
    author: 'MidjourneyAI',
    height: 360
  }
];

export default function GallerySection({ locale }: GallerySectionProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* 动态背景粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* 鼠标跟随光效 */}
      <motion.div
        className="fixed w-96 h-96 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full pointer-events-none z-10"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {locale === 'zh' ? '🎨 精选作品展览' : '🎨 Featured Gallery'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'zh' 
              ? '探索由 Refill AI 创造的令人惊叹的艺术作品，每一件都展现了 AI 的无限创造力'
              : 'Explore stunning artworks created by Refill AI, each showcasing the limitless creativity of AI'
            }
          </p>
        </motion.div>

        {/* 瀑布流布局 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer break-inside-avoid mb-6"
              style={{ height: `${artwork.height}px` }}
              onClick={() => setSelectedArtwork(artwork)}
            >
              {/* 图片容器 */}
              <div className="relative w-full h-full overflow-hidden">
                <motion.img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                />
                
                {/* 悬停遮罩 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4"
                >
                  {/* 顶部信息 */}
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                      {artwork.style}
                    </span>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-red-400">❤️</span>
                      <span className="text-white text-xs font-medium">{artwork.likes.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 底部信息 */}
                  <div className="text-white">
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-2 mb-2">{artwork.prompt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-80">{artwork.author}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-primary transition-colors"
                      >
                        <span className="text-lg">🔍</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* 3D 边框效果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 查看更多按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold rounded-full hover:shadow-lg transition-all duration-300"
          >
            {locale === 'zh' ? '开始创作您的作品 →' : 'Start Creating Your Art →'}
          </motion.button>
        </motion.div>
      </div>

      {/* 作品详情模态框 */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedArtwork.title}</h3>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-full aspect-auto object-cover rounded-xl mb-4"
              />
              
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">{locale === 'zh' ? '提示词：' : 'Prompt: '}</span>
                  <p className="text-muted-foreground">{selectedArtwork.prompt}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{locale === 'zh' ? '作者：' : 'Author: '}{selectedArtwork.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">❤️</span>
                    <span>{selectedArtwork.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 