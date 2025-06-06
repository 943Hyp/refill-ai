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
        
        // 保持最多15个轨迹点
        const updatedTrails = [newTrail, ...prev.slice(0, 14)];
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
      setTrails(prev => prev.filter((_, index) => index < 15));
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
      {/* 主光晕 */}
      <motion.div
        className="absolute w-8 h-8 rounded-full pointer-events-none"
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

      {/* 外层光晕 */}
      <motion.div
        className="absolute w-16 h-16 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          filter: "blur(12px)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
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

      {/* 轨迹雾气效果 */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute w-6 h-6 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(99, 102, 241, ${0.3 * (1 - index / 15)}) 0%, rgba(139, 92, 246, ${0.2 * (1 - index / 15)}) 50%, transparent 100%)`,
            filter: "blur(6px)",
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            x: trail.x,
            y: trail.y,
            scale: 1,
            opacity: trail.opacity,
          }}
          animate={{
            scale: [1, 1.5, 0],
            opacity: [trail.opacity, 0.5, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 中心点 */}
      <motion.div
        className="absolute w-2 h-2 rounded-full pointer-events-none"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.6)",
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

      {/* 脉冲效果 */}
      <motion.div
        className="absolute w-12 h-12 rounded-full pointer-events-none border border-indigo-400/30"
        style={{
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: [1, 2, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
} 