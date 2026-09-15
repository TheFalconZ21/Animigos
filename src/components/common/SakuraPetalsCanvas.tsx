"use client";

import { useEffect, useRef } from "react";

interface SakuraPetalsCanvasProps {
  petalColor?: "pink" | "violet" | "red" | "cyan" | "gold" | "emerald";
  petalCount?: number;
}

export default function SakuraPetalsCanvas({
  petalColor = "pink",
  petalCount = 35,
}: SakuraPetalsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic Petal Palette
    const colorPalettes: Record<string, string[]> = {
      pink: [
        "rgba(255, 182, 193, 0.75)",
        "rgba(255, 192, 203, 0.65)",
        "rgba(244, 114, 182, 0.70)",
        "rgba(236, 72, 153, 0.60)",
        "rgba(251, 207, 232, 0.80)",
      ],
      violet: [
        "rgba(192, 132, 252, 0.75)",
        "rgba(168, 85, 247, 0.65)",
        "rgba(139, 92, 246, 0.70)",
        "rgba(216, 180, 254, 0.80)",
        "rgba(129, 140, 248, 0.60)",
      ],
      red: [
        "rgba(252, 165, 165, 0.70)",
        "rgba(248, 113, 113, 0.65)",
        "rgba(239, 68, 68, 0.60)",
        "rgba(254, 202, 202, 0.80)",
      ],
      cyan: [
        "rgba(165, 243, 252, 0.70)",
        "rgba(103, 232, 249, 0.65)",
        "rgba(6, 182, 212, 0.60)",
        "rgba(207, 250, 254, 0.80)",
      ],
      gold: [
        "rgba(253, 230, 138, 0.75)",
        "rgba(252, 211, 77, 0.65)",
        "rgba(245, 158, 11, 0.60)",
        "rgba(254, 243, 199, 0.80)",
      ],
      emerald: [
        "rgba(167, 243, 208, 0.70)",
        "rgba(110, 231, 183, 0.65)",
        "rgba(16, 185, 129, 0.60)",
        "rgba(209, 250, 229, 0.80)",
      ],
    };

    const palette = colorPalettes[petalColor] || colorPalettes.pink;

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      swing: number;
      swingSpeed: number;
      color: string;
      opacity: number;
    }

    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        color: palette[Math.floor(Math.random() * palette.length)],
        opacity: Math.random() * 0.4 + 0.4,
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, 0.6); // Slightly flattened organic petal shape

      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);

      ctx.fillStyle = p.color;
      ctx.fill();

      // Subtle petal vein highlight
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.8);
      ctx.lineTo(0, p.size * 0.6);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.swing += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swing) * 0.8;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset when out of bounds
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [petalColor, petalCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-70 transition-opacity duration-1000"
    />
  );
}
