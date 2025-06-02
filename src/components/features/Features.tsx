"use client";

// 移除 Next.js Image 导入
import { useEffect, useState } from 'react';

// 转为英文
const featuresData = [
  {
    id: 1,
    icon: '/icons/icon-1.svg',
    title: 'Zero-Cost Creation',
    color: 'from-pink-500 to-purple-500',
    description: 'Completely free and unlimited AI image generation with no watermarks, daily limits, registration, or payment requirements.'
  },
  {
    id: 2,
    icon: '/icons/icon-2.svg',
    title: 'Top-Tier Image Quality',
    color: 'from-blue-500 to-cyan-400',
    description: 'Powered by cutting-edge AI models, delivering stunning image quality for portraits, landscapes, or abstract art.'
  },
  {
    id: 3,
    icon: '/icons/icon-3.svg',
    title: 'Advanced Text Understanding',
    color: 'from-teal-400 to-green-500',
    description: 'Advanced natural language processing that accurately transforms your descriptions and ideas into stunning images.'
  },
  {
    id: 4,
    icon: '/icons/icon-1.svg',
    title: 'Lightning-Fast Generation',
    color: 'from-amber-400 to-orange-500',
    description: 'Optimized performance ensures quick image creation, with each generation taking approximately 4 seconds, no long waits.'
  },
  {
    id: 5,
    icon: '/icons/icon-2.svg',
    title: 'Enhanced Privacy Protection',
    color: 'from-indigo-500 to-violet-600',
    description: 'Zero data retention policy - protects privacy, your prompts and generated images are not stored or used for training.'
  },
  {
    id: 6,
    icon: '/icons/icon-3.svg',
    title: 'Diverse Style Support',
    color: 'from-red-500 to-pink-500',
    description: 'Create images in a variety of styles, from realistic to cartoon, photorealistic to abstract, supporting all your creative needs.'
  }
];

const Features = () => {
  const [mounted, setMounted] = useState(false);

  // Only render images client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-card/30 to-background">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-glow text-center bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent">
          Key Features of Refill AI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center space-y-5 p-6 rounded-xl border border-border hover:border-primary/40 transition-colors cursor-glow"
            >
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                <div className="w-12 h-12 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center">
                  {mounted && (
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      width={24}
                      height={24}
                      className="invert opacity-90"
                    />
                  )}
                </div>
              </div>
              <h3 className="text-xl font-medium text-primary">{feature.title}</h3>
              <p className="text-foreground/70 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
