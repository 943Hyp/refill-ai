"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MousePosition {
  x: number;
  y: number;
}

interface Trail {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let trailId = 0;
    
    const updateMousePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setIsVisible(true);

      // 添加新的轨迹点
      setTrails(prev => {
        const newTrail: Trail = {
          x: newPosition.x,
          y: newPosition.y,
          id: trailId++,
          opacity: 1
        };
        
        // 保持最多20个轨迹点
        const updatedTrails = [newTrail, ...prev.slice(0, 19)];
        return updatedTrails;
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // 定期清理过期的轨迹点
    const cleanupInterval = setInterval(() => {
      setTrails(prev => prev.filter((_, index) => index < 20));
    }, 100);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(cleanupInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* 最外层超大光晕 */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.06) 30%, rgba(168, 85, 247, 0.04) 60%, transparent 100%)",
          filter: "blur(20px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.4, 1],
          rotate: [0, 360],
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* 外层大光晕 */}
      <motion.div
        className="absolute w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 40%, rgba(168, 85, 247, 0.05) 70%, transparent 100%)",
          filter: "blur(16px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 28,
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* 中层光晕 */}
      <motion.div
        className="absolute w-16 h-16 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 40%, rgba(168, 85, 247, 0.1) 70%, transparent 100%)",
          filter: "blur(12px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
          scale: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* 主光晕 */}
      <motion.div
        className="absolute w-12 h-12 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, rgba(168, 85, 247, 0.2) 60%, transparent 100%)",
          filter: "blur(8px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.2, 1],
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* 轨迹雾气效果 - 增强版 */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute w-10 h-10 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(99, 102, 241, ${0.4 * (1 - index / 20)}) 0%, rgba(139, 92, 246, ${0.3 * (1 - index / 20)}) 40%, rgba(168, 85, 247, ${0.2 * (1 - index / 20)}) 70%, transparent 100%)`,
            filter: "blur(8px)",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            x: trail.x,
            y: trail.y,
            scale: 0.8,
            opacity: trail.opacity,
          }}
          animate={{
            scale: [0.8, 2, 0],
            opacity: [trail.opacity, 0.3, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 额外的粒子效果 */}
      {trails.slice(0, 8).map((trail, index) => (
        <motion.div
          key={`particle-${trail.id}`}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: `rgba(255, 255, 255, ${0.6 * (1 - index / 8)})`,
            boxShadow: `0 0 ${6 + index}px rgba(99, 102, 241, ${0.8 * (1 - index / 8)})`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            x: trail.x + (Math.random() - 0.5) * 20,
            y: trail.y + (Math.random() - 0.5) * 20,
            scale: 1,
            opacity: 0.8,
          }}
          animate={{
            scale: [1, 0],
            opacity: [0.8, 0],
            x: trail.x + (Math.random() - 0.5) * 40,
            y: trail.y + (Math.random() - 0.5) * 40,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 中心点 */}
      <motion.div
        className="absolute w-3 h-3 rounded-full pointer-events-none"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 0 15px rgba(99, 102, 241, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
        }}
      />

      {/* 脉冲效果 - 增强版 */}
      <motion.div
        className="absolute w-20 h-20 rounded-full pointer-events-none border-2 border-indigo-400/20"
        style={{
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 3, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 第二个脉冲效果 */}
      <motion.div
        className="absolute w-16 h-16 rounded-full pointer-events-none border border-purple-400/30"
        style={{
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 2.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  );
} 