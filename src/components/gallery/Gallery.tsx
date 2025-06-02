"use client";

import { useContext } from 'react';
import { PromptContext } from '@/app/ClientBody';
import { useRouter } from 'next/navigation';

// 扩展画廊图片数组
const GALLERY_IMAGES = [
  {
    id: 1,
    src: '/images/gallery/image1.jpg',
    alt: 'Futuristic winter cityscape with tall buildings reflecting on a frozen lake surface',
    width: 800,
    height: 533,
    aspect: 'aspect-[3/2]'
  },
  {
    id: 2,
    src: '/images/gallery/image2.jpg',
    alt: 'Dreamy city silhouette under a purple sunset with atmospheric ambiance',
    width: 700,
    height: 700,
    aspect: 'aspect-square'
  },
  {
    id: 3,
    src: '/images/gallery/image3.jpg',
    alt: 'Futuristic city with massive spacecraft, science fiction style',
    width: 800,
    height: 533,
    aspect: 'aspect-[3/2]'
  },
  {
    id: 4,
    src: '/images/gallery/image4.jpg',
    alt: 'Dreamlike landscape with snow-capped mountains and lake under red clouds',
    width: 626,
    height: 351,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 5,
    src: '/images/gallery/image5.jpg',
    alt: 'Ancient Asian-style architecture in a valley surrounded by autumn-colored trees',
    width: 2048,
    height: 2048,
    aspect: 'aspect-square'
  },
  {
    id: 6,
    src: '/images/gallery/image6.jpg',
    alt: 'Majestic and mysterious ancient temple on a mountaintop',
    width: 1800,
    height: 960,
    aspect: 'aspect-[15/8]'
  },
  // New images
  {
    id: 7,
    src: '/images/gallery/new/image7.jpg',
    alt: 'Fantasy pixel world with floating cities and a giant planet in the sky',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 8,
    src: '/images/gallery/new/image8.jpg',
    alt: 'Futuristic moonlit ocean with glowing waves and multiple moons in the night sky',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 9,
    src: '/images/gallery/new/image9.jpg',
    alt: 'Cosmic landscape with moon, comets and stars reflected in still water',
    width: 3840,
    height: 2160,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 10,
    src: '/images/gallery/new/image10.jpg',
    alt: 'Fantasy mountain range with rainbow, waterfalls and vibrant landscape',
    width: 740,
    height: 493,
    aspect: 'aspect-[3/2]'
  },
  {
    id: 11,
    src: '/images/gallery/new/image11.jpg',
    alt: 'Abstract colorful waves with vibrant gradient layers',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 12,
    src: '/images/gallery/new/image12.jpg',
    alt: 'Minimalist blue abstract background with smooth flowing curves',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 13,
    src: '/images/gallery/new/image13.jpg',
    alt: 'Fluid abstract color waves with pink and blue gradient transitions',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 14,
    src: '/images/gallery/new/image14.jpg',
    alt: 'Abstract glass-like waves with purple and blue gradient',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 15,
    src: '/images/gallery/new/image15.jpg',
    alt: 'Dynamic colorful vector artwork with flowing paint-like elements',
    width: 1081,
    height: 608,
    aspect: 'aspect-[16/9]'
  },
  {
    id: 16,
    src: '/images/gallery/new/image16.jpg',
    alt: 'Dark navy abstract texture with gold accents and flowing organic patterns',
    width: 714,
    height: 400,
    aspect: 'aspect-[16/9]'
  }
];

const Gallery = () => {
  const { setPrompt } = useContext(PromptContext);
  const router = useRouter();

  const handleImageClick = (prompt: string) => {
    // Set the prompt
    setPrompt(prompt);

    // Scroll to top/generator section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-10 px-6 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-glow bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent">
            Get Inspired
          </h2>
          <p className="text-foreground/90">
            Explore stunning images created by Refill AI to spark your creativity
          </p>
        </div>

        {/* Masonry layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {GALLERY_IMAGES.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image.alt)}
              className="break-inside-avoid mb-4 overflow-hidden rounded-lg relative group cursor-pointer border-glow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              <div className={`relative ${image.aspect} overflow-hidden`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white text-sm font-medium">{image.alt}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
