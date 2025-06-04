import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refill AI - Free AI Image Generator & Image to Text',
  description: 'Generate stunning AI images from text prompts and extract text descriptions from images. Free, no login required.',
  keywords: 'AI image generator, text to image, image to text, free AI art, no login',
  openGraph: {
    title: 'Refill AI - Free AI Image Generator',
    description: 'Generate stunning AI images from text prompts and extract text descriptions from images.',
    type: 'website',
  },
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 