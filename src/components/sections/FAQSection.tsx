"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Locale } from '@/lib/i18n';

interface FAQSectionProps {
  locale: Locale;
}

const FAQSection = ({ locale }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = locale === 'zh' ? [
    {
      question: "Refill AI 是完全免费的吗？",
      answer: "是的！Refill AI 目前完全免费使用，无需注册账号，无需付费，您可以无限制地生成图像和分析图片。我们致力于为所有用户提供免费的AI创作工具。"
    },
    {
      question: "需要注册账号才能使用吗？",
      answer: "不需要！这是我们的核心特色之一。您可以直接访问网站并开始使用所有功能，无需提供任何个人信息或创建账号。关闭页面后，所有数据将被清除，保护您的隐私。"
    },
    {
      question: "支持哪些类型的图像生成？",
      answer: "我们支持多种风格的图像生成，包括：写实风格、动漫风格、油画风格、水彩风格、素描风格、科幻风格等。您可以通过详细的提示词描述来获得更精准的结果。"
    },
    {
      question: "生成的图像质量如何？",
      answer: "我们使用最先进的AI模型，支持多种分辨率输出，包括512x512、768x768、1024x1024等。图像质量高，细节丰富，适合各种用途。"
    },
    {
      question: "图像生成需要多长时间？",
      answer: "通常情况下，图像生成需要10-30秒，具体时间取决于图像复杂度和当前服务器负载。我们会显示实时进度，让您了解生成状态。"
    },
    {
      question: "可以上传图片进行分析吗？",
      answer: "是的！我们的图生文功能可以分析您上传的图片，生成详细的描述文字。支持JPG、PNG、WebP等常见格式，文件大小限制为10MB。"
    },
    {
      question: "生成的图像可以商用吗？",
      answer: "根据我们使用的AI模型条款，生成的图像可以用于个人和商业用途。但请注意避免生成涉及版权、暴力、色情等不当内容。"
    },
    {
      question: "如何写出更好的提示词？",
      answer: "我们提供了丰富的提示词模板和优化建议。建议使用具体、详细的描述，包含风格、颜色、构图等元素。您也可以参考我们的模板库快速开始。"
    },
    {
      question: "数据会被保存吗？",
      answer: "不会！我们不会保存您的任何数据。所有生成的图像和历史记录仅存储在您的浏览器本地，关闭页面后自动清除，完全保护您的隐私。"
    },
    {
      question: "遇到问题如何获得帮助？",
      answer: "如果您遇到任何问题，可以通过页面底部的联系方式与我们取得联系。我们会尽快为您解决问题并持续改进服务质量。"
    }
  ] : [
    {
      question: "Is Refill AI completely free?",
      answer: "Yes! Refill AI is currently completely free to use, no registration required, no payment needed. You can generate images and analyze pictures without any restrictions. We're committed to providing free AI creative tools for all users."
    },
    {
      question: "Do I need to register an account?",
      answer: "No! This is one of our core features. You can directly access the website and start using all functions without providing any personal information or creating an account. All data will be cleared when you close the page, protecting your privacy."
    },
    {
      question: "What types of image generation are supported?",
      answer: "We support various styles of image generation, including: Realistic, Anime, Oil painting, Watercolor, Sketch, Sci-fi, and more. You can get more precise results through detailed prompt descriptions."
    },
    {
      question: "What's the quality of generated images?",
      answer: "We use state-of-the-art AI models, supporting multiple resolution outputs including 512x512, 768x768, 1024x1024, etc. Images are high quality with rich details, suitable for various purposes."
    },
    {
      question: "How long does image generation take?",
      answer: "Typically, image generation takes 10-30 seconds, depending on image complexity and current server load. We display real-time progress to keep you informed of the generation status."
    },
    {
      question: "Can I upload images for analysis?",
      answer: "Yes! Our image-to-text feature can analyze your uploaded images and generate detailed text descriptions. Supports common formats like JPG, PNG, WebP with a 10MB file size limit."
    },
    {
      question: "Can generated images be used commercially?",
      answer: "According to the terms of the AI models we use, generated images can be used for personal and commercial purposes. However, please avoid generating content involving copyright, violence, pornography, or other inappropriate content."
    },
    {
      question: "How to write better prompts?",
      answer: "We provide rich prompt templates and optimization suggestions. We recommend using specific, detailed descriptions including style, color, composition, and other elements. You can also refer to our template library to get started quickly."
    },
    {
      question: "Will my data be saved?",
      answer: "No! We don't save any of your data. All generated images and history are only stored locally in your browser and automatically cleared when you close the page, completely protecting your privacy."
    },
    {
      question: "How to get help when encountering problems?",
      answer: "If you encounter any problems, you can contact us through the contact information at the bottom of the page. We will solve your problems as soon as possible and continuously improve service quality."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {locale === 'zh' 
              ? '解答您关于 Refill AI 的疑问'
              : 'Get answers to your questions about Refill AI'
            }
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className={`transform transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">
              {locale === 'zh' ? '还有其他问题？' : 'Have more questions?'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {locale === 'zh' 
                ? '我们很乐意为您提供帮助'
                : "We're happy to help you"
              }
            </p>
            <Button variant="outline">
              <span className="mr-2">📧</span>
              {locale === 'zh' ? '联系我们' : 'Contact Us'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 