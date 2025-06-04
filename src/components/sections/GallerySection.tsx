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
}

const artworks: Artwork[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1707344088547-3cf7cea5ca49?w=800&h=800&fit=crop',
    title: '赛博朋克城市',
    prompt: 'Cyberpunk city at night, neon lights, futuristic architecture, rain reflections',
    style: 'Cyberpunk',
    likes: 1247,
    author: 'AI艺术家'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=800&fit=crop',
    title: '梦幻森林',
    prompt: 'Magical forest with glowing mushrooms, fairy lights, mystical atmosphere',
    style: 'Fantasy',
    likes: 892,
    author: 'Dream Creator'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&h=800&fit=crop',
    title: '未来机器人',
    prompt: 'Advanced humanoid robot, sleek design, glowing blue eyes, sci-fi',
    style: '3D Render',
    likes: 1456,
    author: 'Tech Visionary'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1688891584219-6e753d5acef8?w=800&h=800&fit=crop',
    title: '水彩花园',
    prompt: 'Beautiful garden with colorful flowers, watercolor painting style, soft brushstrokes',
    style: 'Watercolor',
    likes: 734,
    author: 'Art Lover'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1682695796497-31a44224d6d6?w=800&h=800&fit=crop',
    title: '太空探索',
    prompt: 'Astronaut floating in space, Earth in background, cosmic nebula, photorealistic',
    style: 'Photorealistic',
    likes: 2103,
    author: 'Space Explorer'
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?w=800&h=800&fit=crop',
    title: '动漫少女',
    prompt: 'Anime girl with blue hair, cherry blossoms, spring atmosphere, detailed',
    style: 'Anime',
    likes: 1678,
    author: 'Anime Fan'
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1682687982183-c2937a37a21a?w=800&h=800&fit=crop',
    title: '古典建筑',
    prompt: 'Ancient Greek temple, marble columns, golden hour lighting, architectural photography',
    style: 'Classical',
    likes: 567,
    author: 'History Buff'
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1688891584184-6ab9738bd13d?w=800&h=800&fit=crop',
    title: '抽象艺术',
    prompt: 'Abstract digital art, flowing colors, geometric patterns, modern design',
    style: 'Digital Art',
    likes: 923,
    author: 'Digital Artist'
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer"
              style={{
                transformStyle: 'preserve-3d'
              }}
              onClick={() => setSelectedArtwork(artwork)}
            >
              {/* 图片容器 */}
              <div className="relative aspect-square overflow-hidden">
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
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4"
                >
                  <div className="text-white">
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-2">{artwork.prompt}</p>
                  </div>
                </motion.div>

                {/* 风格标签 */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                    {artwork.style}
                  </span>
                </div>

                {/* 点赞数 */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-red-400">❤️</span>
                  <span className="text-white text-xs font-medium">{artwork.likes}</span>
                </div>
              </div>

              {/* 作品信息 */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{artwork.author}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="text-lg">🔍</span>
                  </motion.button>
                </div>
              </div>

              {/* 3D 边框效果 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* 查看更多按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold rounded-full hover:shadow-lg transition-all duration-300"
          >
            {locale === 'zh' ? '查看更多作品 →' : 'View More Artworks →'}
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
                className="w-full aspect-square object-cover rounded-xl mb-4"
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
                    <span>{selectedArtwork.likes}</span>
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