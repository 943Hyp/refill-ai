"use client";

import { useEffect, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Michael Anderson',
    image: 'https://ext.same-assets.com/3344302163/3927233419.png',
    rating: 5,
    text: '"Refill AI image generator is a game changer. Unlike other tools that require subscriptions, Refill is completely free with no compromise on quality. I believe it will completely change the AI image generation space. This tool is a true gem that\'s free to use."'
  },
  {
    id: 2,
    name: 'Sarah Martinez',
    image: 'https://ext.same-assets.com/3344302163/1428026643.png',
    rating: 5,
    text: '"This is the best AI image generator I\'ve used. It understands my prompts precisely, generates amazing images, and I love its simplicity. Other AI generators charge or have limitations, but Refill is completely free and unlimited, allowing creativity to flow freely."'
  },
  {
    id: 3,
    name: 'Alex Johnson',
    image: 'https://ext.same-assets.com/3344302163/498075217.png',
    rating: 5,
    text: '"As a professional designer, I rely on high-quality images for inspiration. Refill AI delivers excellent results without any cost. The interface is intuitive and easy to use, and generation speed is fast. Highly recommended for anyone who needs quality AI images."'
  }
];

const Testimonials = () => {
  const [mounted, setMounted] = useState(false);

  // Only render images client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-16 px-6 bg-[#1a1913]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-semibold text-primary">What Users Say About Refill AI</h2>
          <p className="text-primary/70">
            See what users and professionals are saying about the Refill AI image generator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 rounded-lg border border-border bg-[#1d1c15]/50 flex flex-col"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  {mounted && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium text-primary">{testimonial.name}</div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={`star-${testimonial.id}-${i}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#a18c61"
                        stroke="#a18c61"
                        strokeWidth="1"
                        className="h-4 w-4"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-primary/70 text-sm">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
