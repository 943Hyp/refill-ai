"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale } from '@/lib/i18n';

interface TestimonialsSectionProps {
  locale: Locale;
}

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  date: string;
  platform: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: '张艺术',
    avatar: '🎨',
    role: '数字艺术家',
    content: 'Refill AI 完全改变了我的创作流程！生成的图像质量令人惊叹，FLUX SCHNELL 模型的效果超出了我的预期。现在我可以在几秒钟内将想法变成现实。',
    rating: 5,
    date: '2024-01-15',
    platform: 'Twitter'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: '🌟',
    role: 'UI/UX Designer',
    content: 'The image analysis feature is incredibly accurate! It helps me understand different art styles and generate better prompts. The interface is intuitive and the results are consistently high-quality.',
    rating: 5,
    date: '2024-01-12',
    platform: 'LinkedIn'
  },
  {
    id: '3',
    name: '李创意',
    avatar: '🚀',
    role: '内容创作者',
    content: '作为一个内容创作者，Refill AI 是我的秘密武器。多种艺术风格选择让我能为不同项目创造完美的视觉内容。客户都对结果非常满意！',
    rating: 5,
    date: '2024-01-10',
    platform: 'Instagram'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    avatar: '💡',
    role: 'Creative Director',
    content: 'The speed and quality of image generation is remarkable. What used to take hours now takes minutes. The AI understands complex prompts and delivers exactly what I envision.',
    rating: 5,
    date: '2024-01-08',
    platform: 'Behance'
  },
  {
    id: '5',
    name: '王设计师',
    avatar: '🎭',
    role: '平面设计师',
    content: '界面设计得非常用心，操作简单直观。图像分析功能特别实用，能够快速理解客户提供的参考图片并生成相似风格的作品。强烈推荐！',
    rating: 5,
    date: '2024-01-05',
    platform: 'Dribbble'
  },
  {
    id: '6',
    name: 'Emma Thompson',
    avatar: '🌈',
    role: 'Illustrator',
    content: 'The variety of art styles available is incredible. From watercolor to cyberpunk, every style produces stunning results. This tool has expanded my creative possibilities exponentially.',
    rating: 5,
    date: '2024-01-03',
    platform: 'ArtStation'
  },
  {
    id: '7',
    name: '陈摄影师',
    avatar: '📸',
    role: '摄影师',
    content: '虽然我主要做摄影，但 Refill AI 帮我为客户提供了概念设计服务。生成的图像质量堪比专业摄影作品，为我开辟了新的业务领域。',
    rating: 5,
    date: '2024-01-01',
    platform: '小红书'
  },
  {
    id: '8',
    name: 'David Kim',
    avatar: '🎮',
    role: 'Game Developer',
    content: 'Perfect for rapid prototyping game assets! The anime and fantasy styles are particularly impressive. Our team productivity has increased significantly since we started using Refill AI.',
    rating: 5,
    date: '2023-12-28',
    platform: 'Discord'
  }
];

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 自动滚动
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ⭐
      </motion.span>
    ));
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, 200, 0],
              y: [0, -150, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* 鼠标跟随光晕 */}
      <motion.div
        className="fixed w-80 h-80 bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent rounded-full pointer-events-none z-10"
        style={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-primary bg-clip-text text-transparent">
            {locale === 'zh' ? '💬 用户好评如潮' : '💬 What Users Say'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'zh' 
              ? '来自全球创作者的真实反馈，见证 Refill AI 如何改变他们的创作体验'
              : 'Real feedback from creators worldwide, see how Refill AI transforms their creative experience'
            }
          </p>
        </motion.div>

        {/* 评价卡片容器 */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="wait">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    scale: index === 1 ? 1.05 : 1 // 中间卡片稍大
                  }}
                  exit={{ opacity: 0, y: -50, rotateX: 15 }}
                  transition={{ 
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    rotateY: 5,
                    z: 50
                  }}
                  className={`
                    relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 
                    hover:border-primary/50 transition-all duration-500 cursor-pointer
                    ${index === 1 ? 'ring-2 ring-primary/20' : ''}
                  `}
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 平台标签 */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {testimonial.platform}
                    </span>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center text-2xl"
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* 评分 */}
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* 评价内容 */}
                  <motion.p 
                    className="text-muted-foreground leading-relaxed mb-4 line-clamp-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* 日期 */}
                  <div className="text-xs text-muted-foreground">
                    {new Date(testimonial.date).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                  </div>

                  {/* 悬停光效 */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* 进度指示器 */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { number: '50K+', label: locale === 'zh' ? '活跃用户' : 'Active Users' },
            { number: '1M+', label: locale === 'zh' ? '生成图片' : 'Images Generated' },
            { number: '4.9/5', label: locale === 'zh' ? '用户评分' : 'User Rating' },
            { number: '99.9%', label: locale === 'zh' ? '满意度' : 'Satisfaction' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 