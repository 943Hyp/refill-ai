"use client";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-24 pb-6 md:pt-28 md:pb-8 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-glow bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent">
          Create stunning AI-generated images in seconds
        </h1>
        <p className="text-lg md:text-xl text-foreground/90">
          <span className="inline-block px-3 py-1 m-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full text-white font-semibold shadow-lg">100% Free</span>
          <span className="inline-block px-3 py-1 m-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full text-white font-semibold shadow-lg">No Sign-up</span>
          <span className="inline-block px-3 py-1 m-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full text-white font-semibold shadow-lg">No Login</span>
          <span className="inline-block px-3 py-1 m-1 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full text-white font-semibold shadow-lg">Unlimited</span>
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <Button className="gradient-button text-white font-medium rounded-full px-8 py-6 text-lg shadow-lg">
            Start Creating
          </Button>
          <Button variant="outline" className="rounded-full border-primary text-primary bg-transparent hover:bg-primary/10 px-8 py-6 text-lg border-glow">
            Browse Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
