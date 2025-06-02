"use client";

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border py-4">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-primary">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`mt-2 text-primary/70 text-sm overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

const faqData = [
  {
    id: 1,
    question: '什么是 Raphael AI 以及它是如何工作的？',
    answer: 'Raphael AI 是一个完全免费、无限制的 AI 图像生成器，由 FLUX.1-Dev 模型提供支持。它使用先进的文本到图像生成技术，允许您通过文本描述创建高质量的图像，无需任何技术技能。'
  },
  {
    id: 2,
    question: 'Raphael AI 真的可以完全免费使用吗？',
    answer: '是的，Raphael AI 的承诺是完全免费。我们坚定致力于保持该工具对所有用户免费和无限制。没有隐藏费用，无需信用卡，没有每日限制，完全不收费。'
  },
  {
    id: 3,
    question: '为什么 Raphael AI 与其他 AI 图像生成器不同？',
    answer: 'Raphael AI 区别于其他工具的主要特点是它提供免费、无限制的访问，同时不妥协图像质量、生成速度和完整的隐私保护。所有这些功能通常只在付费服务中可用。'
  },
  {
    id: 4,
    question: '我能用 Raphael AI 创建什么样的图像？',
    answer: 'Raphael AI 可以创建各种各样的图像，从照片般逼真的肖像到抽象艺术，从风景到幻想场景。FLUX.1-Dev 模型在理解复杂的描述方面表现出色，使 Raphael 能够生成高质量、详细的图像。'
  },
  {
    id: 5,
    question: '什么是 FLUX.1-Dev 模型？',
    answer: 'FLUX.1-Dev 是一种先进的 AI 图像生成模型，专为高质量、多样化的图像生成而设计。它专注于创造性自由、易用性和速度。有了 FLUX.1-Dev，Raphael 使其变得容易使用和快速生成图像。'
  },
  {
    id: 6,
    question: '我可以将生成的图像用于商业用途吗？',
    answer: '是的，您生成的所有图像都可以用于个人和商业用途，无需归属，使其成为创作者、营销人员和企业的理想工具。始终确保遵守适用的法律和准则。'
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-primary">常见问题</h2>
          <p className="text-primary/70">
            有其他问题？请联系我们 support@raphael.app
          </p>
        </div>

        <div className="space-y-1">
          {faqData.map((faq) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
