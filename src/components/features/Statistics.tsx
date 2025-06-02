"use client";

import { useEffect, useState } from "react";

// 数字动画函数，从0到目标值平滑过渡
interface AnimatedNumberProps {
  value: string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedNumber = ({ value, duration = 2000, suffix = "", prefix = "" }: AnimatedNumberProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number.parseInt(value);
    const increment = end / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="text-glow">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const Statistics = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-card/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-glow bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-teal-400 text-transparent mb-16">
          数百万用户的信赖
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center space-y-2 cursor-glow">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              <AnimatedNumber value="300" suffix=" 万+" />
            </div>
            <div className="text-foreground/70 text-center font-medium">活跃用户</div>
          </div>

          <div className="flex flex-col items-center space-y-2 cursor-glow">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              <AnimatedNumber value="1530" />
            </div>
            <div className="text-foreground/70 text-center font-medium">每分钟创建的图像</div>
          </div>

          <div className="flex flex-col items-center space-y-2 cursor-glow">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
              <AnimatedNumber value="4.9" />
            </div>
            <div className="text-foreground/70 text-center font-medium">平均图像质量评分</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
