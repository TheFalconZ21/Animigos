"use client";

import React, { useEffect, useRef } from "react";
import { ThemeAnimationType } from "@/core/utils/score-theme";

interface DynamicThemeBackgroundProps {
  animationType: ThemeAnimationType;
  primaryColor?: string;
  themeId?: string;
  opacity?: number;
  fireworksSpeed?: number;
}

export default function DynamicThemeBackground({
  animationType,
  primaryColor = "#A855F7",
  themeId = "Default",
  opacity = 0.7,
  fireworksSpeed = 0.45,
}: DynamicThemeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. PETALS (Romance Yuri / Yaoi / Romance)
    // ==========================================
    const isYaoi = themeId === "RomanceYaoi";
    const petalPalette = isYaoi
      ? [
          "rgba(225, 29, 72, 0.75)",
          "rgba(190, 18, 60, 0.70)",
          "rgba(244, 63, 94, 0.65)",
          "rgba(136, 19, 55, 0.80)",
          "rgba(251, 113, 133, 0.60)",
        ]
      : [
          "rgba(255, 182, 193, 0.80)",
          "rgba(244, 114, 182, 0.75)",
          "rgba(236, 72, 153, 0.70)",
          "rgba(251, 207, 232, 0.85)",
          "rgba(253, 164, 175, 0.75)",
        ];

    const petals = Array.from({ length: 38 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.1 + 0.7,
      speedX: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
      color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
    }));

    // ==========================================
    // 2. SPACESHIPS (Sci-Fi / Mecha)
    // ==========================================
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
    }));

    interface Ship {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      blur: number;
      color: string;
      trailLength: number;
    }

    const ships: Ship[] = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * -width,
      y: height * 0.15 + Math.random() * (height * 0.7),
      length: Math.random() * 26 + 18,
      speed: Math.random() * 3.5 + 2.5 + (i % 2 === 0 ? 1.5 : 0),
      angle: (Math.random() - 0.5) * 0.15,
      blur: Math.random() * 2 + 1.2,
      color: i % 2 === 0 ? "rgba(6, 182, 212, 0.9)" : "rgba(56, 189, 248, 0.85)",
      trailLength: Math.random() * 120 + 80,
    }));

    // ==========================================
    // 3. WIND & GREEN LEAVES & RIVERBANK (Slice of Life)
    // ==========================================
    const windStreaks = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 250 + 150,
      speed: Math.random() * 3 + 2,
      alpha: Math.random() * 0.12 + 0.04,
    }));

    // Warm watercolor sunset clouds (Toki wo Kakeru Shoujo aesthetic)
    const sunsetClouds = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: height * 0.04 + Math.random() * (height * 0.36),
      width: Math.random() * 260 + 160,
      height: Math.random() * 48 + 32,
      speed: Math.random() * 0.18 + 0.06,
      alpha: Math.random() * 0.35 + 0.25,
      colorBase: Math.random() > 0.5 ? "251, 146, 60" : "253, 186, 116",
    }));

    // Glowing river horizontal ripple glints & wavelets
    const riverShimmers = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: height * 0.55 + Math.random() * (height * 0.14),
      length: Math.random() * 55 + 24,
      speedX: Math.random() * 0.45 + 0.25,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      alpha: Math.random() * 0.5 + 0.25,
    }));

    // Distant silhouettes of vehicles moving on elevated expressway viaduct
    const expresswayCars = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * width,
      speed: (i % 2 === 0 ? 1 : -1) * (Math.random() * 1.4 + 0.8),
      size: Math.random() * 14 + 10,
      color: ["#F97316", "#38BDF8", "#FFFFFF", "#FACC15", "#CBD5E1"][i % 5],
    }));

    // Bicycle with 2 riders (Toki wo Kakeru Shoujo riverbank path)
    const bicycle = {
      x: -140,
      speed: 1.55,
      wheelAngle: 0,
      pedalAngle: 0,
      status: "riding" as "riding" | "waiting",
      waitTimer: 50,
      direction: 1 as 1 | -1,
    };

    // ==========================================
    // 4. FLAMES (Acción / Shonen)
    // ==========================================
    interface FlameParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      life: number;
      maxLife: number;
      color: string;
      blur: number;
    }

    const flameColors = [
      "rgba(254, 240, 138, 0.5)",
      "rgba(251, 146, 60, 0.45)",
      "rgba(239, 68, 68, 0.4)",
      "rgba(185, 28, 28, 0.35)",
    ];

    const flames: FlameParticle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 60,
      radius: Math.random() * 45 + 25,
      speedY: Math.random() * 2.2 + 1.2,
      speedX: (Math.random() - 0.5) * 1.0,
      life: Math.random() * 80,
      maxLife: Math.random() * 90 + 70,
      color: flameColors[Math.floor(Math.random() * flameColors.length)],
      blur: Math.random() * 12 + 10,
    }));

    const embers = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 20,
      radius: Math.random() * 2 + 1,
      speedY: Math.random() * 2.8 + 1.5,
      speedX: (Math.random() - 0.5) * 1.2,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    // ==========================================
    // 5. FIREWORKS & LATERAL CONFETTI (Comedia)
    // ==========================================
    interface FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      decay: number;
      radius: number;
    }

    interface Firework {
      x: number;
      y: number;
      targetY: number;
      speedY: number;
      color: string;
      state: "rising" | "exploded";
      particles: FireworkParticle[];
    }

    const fireworkColors = [
      "#FBBF24", // vivid amber gold
      "#00E5FF", // electric cyan
      "#EC4899", // bright magenta
      "#A855F7", // vivid violet
      "#10B981", // bright emerald green
      "#F97316", // vivid orange
      "#F43F5E", // vibrant rose
      "#38BDF8", // sky blue
    ];

    const fwSpeed = Math.max(0.1, fireworksSpeed || 0.45);

    const spawnFirework = (): Firework => {
      const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
      return {
        x: Math.random() * (width * 0.64) + width * 0.18,
        y: height + 20,
        targetY: height * 0.12 + Math.random() * (height * 0.38),
        speedY: (Math.random() * 2.5 + 4.2) * fwSpeed,
        color,
        state: "rising",
        particles: [],
      };
    };

    const fireworks: Firework[] = Array.from({ length: 4 }, (_, i) => {
      const fw = spawnFirework();
      fw.y = height + 20 + (i * 100) / fwSpeed;
      return fw;
    });

    // Static Night Sky Stars for Comedia festival
    const festivalStars = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      radius: Math.random() * 1.3 + 0.6,
      baseAlpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    // Post Lanterns (Tōrō / 燈籠) flanking the festival avenue
    const toroLanterns = [
      { x: width * 0.18, y: height * 0.78, scale: 0.88 },
      { x: width * 0.27, y: height * 0.80, scale: 0.96 },
      { x: width * 0.38, y: height * 0.83, scale: 1.08 },
      { x: width * 0.62, y: height * 0.83, scale: 1.08 },
      { x: width * 0.73, y: height * 0.80, scale: 0.96 },
      { x: width * 0.82, y: height * 0.78, scale: 0.88 },
    ];

    // Festival crowd silhouettes walking towards the Torii gate
    const crowdPeople = [
      { x: width * 0.29, y: height * 0.88, h: 48, yukataColor: "#0E1726", sashColor: "#F59E0B" },
      { x: width * 0.32, y: height * 0.87, h: 44, yukataColor: "#0A101D", sashColor: "#EF4444" },
      { x: width * 0.42, y: height * 0.84, h: 36, yukataColor: "#0E1726", sashColor: "#10B981" },
      { x: width * 0.45, y: height * 0.835, h: 32, yukataColor: "#080E1A", sashColor: "#FBBF24" },
      { x: width * 0.48, y: height * 0.83, h: 34, yukataColor: "#0E1726", sashColor: "#EC4899" },
      { x: width * 0.52, y: height * 0.83, h: 33, yukataColor: "#080E1A", sashColor: "#38BDF8" },
      { x: width * 0.55, y: height * 0.838, h: 37, yukataColor: "#0E1726", sashColor: "#F59E0B" },
      { x: width * 0.67, y: height * 0.87, h: 42, yukataColor: "#0A101D", sashColor: "#EF4444" },
      { x: width * 0.71, y: height * 0.885, h: 49, yukataColor: "#0E1726", sashColor: "#FBBF24" },
      { x: width * 0.86, y: height * 0.89, h: 46, yukataColor: "#080E1A", sashColor: "#10B981" },
      { x: width * 0.89, y: height * 0.895, h: 47, yukataColor: "#0E1726", sashColor: "#F59E0B" },
    ];

    // Japanese Festival Lanterns (Chōchin / 提灯) hanging along the shrine rooflines
    interface FestivalLantern {
      anchorX: number;
      anchorY: number;
      cordLength: number;
      swayPhase: number;
      swaySpeed: number;
      radiusX: number;
      radiusY: number;
      color: string;
      glowColor: string;
      label: string;
    }

    const lanternCount = 9;
    const festivalLanterns: FestivalLantern[] = Array.from({ length: lanternCount }, (_, i) => {
      const normX = (i + 0.5) / lanternCount;
      const x = width * (0.07 + normX * 0.86);
      const sag = Math.sin(normX * Math.PI) * (height * 0.08);
      const anchorY = height * 0.035 + sag;

      return {
        anchorX: x,
        anchorY,
        cordLength: 22 + (i % 3) * 8,
        swayPhase: i * 0.75,
        swaySpeed: 0.018 + (i % 2) * 0.007,
        radiusX: 16 + (i % 2) * 3,
        radiusY: 22 + (i % 2) * 4,
        color: i % 2 === 0 ? "#DC2626" : "#F59E0B",
        glowColor: i % 2 === 0 ? "#EF4444" : "#FBBF24",
        label: ["祭", "福", "寿", "春", "喜", "賀", "吉", "祝", "祭"][i % 9],
      };
    });

    // Japanese festival yatai food stall roofs along bottom
    const yataiStallCount = 6;
    const festivalStalls = Array.from({ length: yataiStallCount }, (_, i) => {
      const stallWidth = width / yataiStallCount;
      return {
        x: i * stallWidth,
        width: stallWidth,
        height: height * 0.16,
        awningColor1: i % 2 === 0 ? "#DC2626" : "#1E3A8A",
        awningColor2: "#F8FAFC",
        lanternColor: i % 2 === 0 ? "#FBBF24" : "#F43F5E",
      };
    });

    // ==========================================
    // 6. HORROR FOREST & GLOWING PEEPING EYES (Terror)
    // ==========================================
    interface Bat {
      x: number;
      y: number;
      vx: number;
      vy: number;
      wingAngle: number;
      wingSpeed: number;
      size: number;
    }

    const bats: Bat[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      vx: (Math.random() * 2.5 + 1.5) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() - 0.5) * 1.0,
      wingAngle: 0,
      wingSpeed: Math.random() * 0.2 + 0.15,
      size: Math.random() * 6 + 7,
    }));

    const fireflies = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: height - Math.random() * (height * 0.4),
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random(),
      alphaSpeed: Math.random() * 0.03 + 0.01,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    // Intermittent Glowing Eyes lurking in the dark woods
    interface SpookyEyePair {
      x: number;
      y: number;
      eyeDist: number;
      radiusX: number;
      radiusY: number;
      color: string;
      glowColor: string;
      state: "hidden" | "fadeIn" | "staring" | "blinking" | "fadeOut";
      timer: number;
      stareDuration: number;
      alpha: number;
      blinkScale: number;
      blinkProgress: number;
      zone: "left" | "right" | "deep";
    }

    const eyeColors = [
      { color: "#FF1E56", glow: "#FF0033" }, // intense crimson blood red
      { color: "#FF9900", glow: "#FF6600" }, // toxic predator orange
      { color: "#FFE600", glow: "#FFCC00" }, // eerie yellow
      { color: "#E0AAFF", glow: "#C77DFF" }, // ghostly soul violet
      { color: "#FFFFFF", glow: "#FF3366" }, // piercing white with red halo
    ];

    const pickEyePosition = (zone: "left" | "right" | "deep") => {
      if (zone === "left") {
        return {
          x: Math.random() * (width * 0.22) + 24,
          y: height * 0.14 + Math.random() * (height * 0.74),
        };
      } else if (zone === "right") {
        return {
          x: width - (Math.random() * (width * 0.22) + 24),
          y: height * 0.14 + Math.random() * (height * 0.74),
        };
      }
      return {
        x: width * 0.2 + Math.random() * (width * 0.6),
        y: height * 0.06 + Math.random() * (height * 0.25),
      };
    };

    // Initialize 16 spooky eye pairs with 4 pairs ALREADY visible/staring immediately!
    const eyePairs: SpookyEyePair[] = Array.from({ length: 16 }, (_, i) => {
      const zone: "left" | "right" | "deep" = i < 7 ? "left" : i < 14 ? "right" : "deep";
      const pos = pickEyePosition(zone);
      const col = eyeColors[Math.floor(Math.random() * eyeColors.length)];
      const startVisible = i < 5;
      return {
        x: pos.x,
        y: pos.y,
        eyeDist: Math.random() * 8 + 14,
        radiusX: Math.random() * 3 + 6.5,
        radiusY: Math.random() * 2 + 3.2,
        color: col.color,
        glowColor: col.glow,
        state: startVisible ? "staring" : "hidden",
        timer: startVisible ? Math.floor(Math.random() * 160) + 80 : Math.floor(Math.random() * 120) + 15,
        stareDuration: Math.floor(Math.random() * 140) + 120,
        alpha: startVisible ? 1 : 0,
        blinkScale: 1,
        blinkProgress: 0,
        zone,
      };
    });

    // Low creeping ground fog banks in the spooky woods
    interface GroundFogBank {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      alpha: number;
      pulse: number;
    }

    const groundFog: GroundFogBank[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * (width + 400) - 200,
      y: height * 0.72 + Math.random() * (height * 0.26),
      width: Math.random() * 380 + 260,
      height: Math.random() * 75 + 40,
      speed: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.28 + 0.14,
      pulse: Math.random() * Math.PI * 2,
    }));

    // ==========================================
    // 7. MAGIC CIRCLES & ARCANE GLYPHS (Fantasía)
    // ==========================================
    interface MagicParticle {
      angle: number;
      radius: number;
      targetRadius: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }

    let magicRotation = 0;
    const magicParticles: MagicParticle[] = Array.from({ length: 130 }, (_, i) => ({
      angle: (i / 130) * Math.PI * 2,
      radius: 80 + (i % 3) * 60 + Math.random() * 20,
      targetRadius: 80 + (i % 3) * 60,
      speed: 0.006 * (i % 2 === 0 ? 1 : -1) + (Math.random() - 0.5) * 0.002,
      size: Math.random() * 2.8 + 1.2,
      alpha: Math.random() * 0.7 + 0.3,
      color:
        i % 3 === 0
          ? "rgba(192, 132, 252, 0.9)"
          : i % 3 === 1
          ? "rgba(168, 85, 247, 0.85)"
          : "rgba(253, 224, 71, 0.9)",
    }));

    const magicMotes = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vy: -(Math.random() * 0.7 + 0.3),
      vx: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Intermittent Arcane Glyphs / Runes
    interface ArcaneGlyph {
      x: number;
      y: number;
      size: number;
      glyphType: number; // 0..4
      angle: number;
      rotSpeed: number;
      state: "dormant" | "fadeIn" | "active" | "fadeOut";
      timer: number;
      alpha: number;
      maxAlpha: number;
      pulse: number;
      color: string;
      zone: "left" | "right" | "center";
    }

    const glyphColors = [
      "#C084FC", // luminous violet
      "#67E8F9", // arcane cyan
      "#FDE047", // solar mana gold
      "#E9D5FF", // astral light
      "#A855F7", // deep arcane purple
    ];

    const pickGlyphPosition = (zone: "left" | "right" | "center") => {
      if (zone === "left") {
        return {
          x: Math.random() * (width * 0.22) + 20,
          y: height * 0.12 + Math.random() * (height * 0.76),
        };
      } else if (zone === "right") {
        return {
          x: width - (Math.random() * (width * 0.22) + 20),
          y: height * 0.12 + Math.random() * (height * 0.76),
        };
      }
      return {
        x: Math.random() * (width * 0.6) + width * 0.2,
        y: Math.random() * (height * 0.75) + height * 0.12,
      };
    };

    // 12 Arcane Glyphs with 4 starting active immediately
    const arcaneGlyphs: ArcaneGlyph[] = Array.from({ length: 12 }, (_, i) => {
      const zone: "left" | "right" | "center" = i % 3 === 0 ? "left" : i % 3 === 1 ? "right" : "center";
      const pos = pickGlyphPosition(zone);
      const startActive = i < 4;
      return {
        x: pos.x,
        y: pos.y,
        size: Math.random() * 16 + 28,
        glyphType: i % 5,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        state: startActive ? "active" : "dormant",
        timer: startActive ? Math.floor(Math.random() * 160) + 90 : Math.floor(Math.random() * 120) + 15,
        alpha: startActive ? 0.75 : 0,
        maxAlpha: Math.random() * 0.25 + 0.65,
        pulse: Math.random() * Math.PI * 2,
        color: glyphColors[i % glyphColors.length],
        zone,
      };
    });

    // Grand Arcane Library Bookshelf Structures (flanking left and right)
    interface BookItem {
      width: number;
      height: number;
      color: string;
      ribColor: string;
      titleGold: boolean;
      tilted: boolean;
      tiltAngle: number;
    }

    interface ShelfTier {
      y: number;
      height: number;
      books: BookItem[];
    }

    const bookPalette = [
      "#1E1B4B", // midnight indigo
      "#4C1D95", // royal imperial violet
      "#064E3B", // deep emerald green
      "#831843", // rich wine ruby
      "#78350F", // antique amber leather
      "#1E293B", // dark slate
      "#881337", // crimson leather
      "#312E81", // sapphire leather
    ];

    const generateShelfBooks = (shelfWidth: number, shelfHeight: number): BookItem[] => {
      const items: BookItem[] = [];
      let currentX = 14;
      while (currentX < shelfWidth - 24) {
        const bWidth = Math.random() * 12 + 10;
        const bHeight = shelfHeight * (Math.random() * 0.28 + 0.68);
        const isTilted = Math.random() > 0.88 && currentX < shelfWidth - 45;
        items.push({
          width: bWidth,
          height: bHeight,
          color: bookPalette[Math.floor(Math.random() * bookPalette.length)],
          ribColor: Math.random() > 0.4 ? "rgba(253, 224, 71, 0.7)" : "rgba(233, 213, 255, 0.5)",
          titleGold: Math.random() > 0.5,
          tilted: isTilted,
          tiltAngle: isTilted ? Math.random() * 0.16 + 0.12 : 0,
        });
        currentX += bWidth + (isTilted ? 14 : 2);
      }
      return items;
    };

    const shelfTierCount = 5;
    const shelfTiersLeft: ShelfTier[] = [];
    const shelfTiersRight: ShelfTier[] = [];
    const stackWidth = width * 0.26;

    for (let t = 0; t < shelfTierCount; t++) {
      const tierH = height * 0.16;
      const tierY = height * 0.14 + t * tierH;
      shelfTiersLeft.push({
        y: tierY,
        height: tierH,
        books: generateShelfBooks(stackWidth, tierH),
      });
      shelfTiersRight.push({
        y: tierY,
        height: tierH,
        books: generateShelfBooks(stackWidth, tierH),
      });
    }

    // Pilaster crystal candle sconces
    const librarySconces = [
      { x: width * 0.255, y: height * 0.32, phase: 0 },
      { x: width * 0.255, y: height * 0.65, phase: 2.1 },
      { x: width * 0.745, y: height * 0.32, phase: 4.2 },
      { x: width * 0.745, y: height * 0.65, phase: 1.5 },
    ];

    // ==========================================
    // 8. RAIN & NOIR CITY (Drama)
    // ==========================================
    interface Raindrop {
      x: number;
      y: number;
      speedY: number;
      speedX: number;
      length: number;
      alpha: number;
      thickness: number;
    }

    interface RainSplash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      decay: number;
    }

    const raindrops: Raindrop[] = Array.from({ length: 240 }, () => ({
      x: Math.random() * (width + 250) - 100,
      y: Math.random() * height - height,
      speedY: Math.random() * 10 + 18,
      speedX: -(Math.random() * 2.8 + 3.5),
      length: Math.random() * 18 + 20,
      alpha: Math.random() * 0.45 + 0.35,
      thickness: Math.random() * 0.8 + 0.9,
    }));

    const splashes: RainSplash[] = [];

    // Noir city skyline buildings (taller, atmospheric)
    const cityBuildingsBack = Array.from({ length: 20 }, (_, i) => {
      const bWidth = Math.random() * 60 + 65;
      return {
        x: (i / 20) * (width + 120) - 60,
        w: bWidth,
        h: Math.random() * (height * 0.32) + height * 0.24,
        hasAntenna: Math.random() > 0.4,
        antennaHeight: Math.random() * 45 + 25,
      };
    });

    const cityBuildingsFront = Array.from({ length: 16 }, (_, i) => {
      const bWidth = Math.random() * 80 + 85;
      return {
        x: (i / 16) * (width + 120) - 60,
        w: bWidth,
        h: Math.random() * (height * 0.24) + height * 0.16,
        hasWaterTower: Math.random() > 0.5,
        windows: Array.from({ length: 18 }, () => ({
          col: Math.random() > 0.3,
          alpha: Math.random() * 0.35 + 0.12,
        })),
      };
    });

    // ==========================================
    // 9. STADIUM FLASHES & CONFETTI (Deportes)
    // ==========================================
    interface CameraFlash {
      x: number;
      y: number;
      life: number;
      maxLife: number;
      size: number;
      spikeLength: number;
      intensity: number;
      color: string;
    }

    const cameraFlashes: CameraFlash[] = [];

    // Pre-populate with 4 initial flashes
    for (let f = 0; f < 4; f++) {
      cameraFlashes.push({
        x: Math.random() * (width * 0.9) + width * 0.05,
        y: height * 0.42 + Math.random() * (height * 0.52),
        life: Math.floor(Math.random() * 4),
        maxLife: Math.floor(Math.random() * 6) + 10,
        size: Math.random() * 3 + 3,
        spikeLength: Math.random() * 12 + 8,
        intensity: Math.random() * 0.2 + 0.5,
        color: Math.random() > 0.3 ? "#FFFFFF" : "#FED7AA",
      });
    }

    interface StadiumConfettiPiece {
      x: number;
      y: number;
      vy: number;
      vx: number;
      sway: number;
      swaySpeed: number;
      w: number;
      h: number;
      rotation: number;
      rotSpeed: number;
      tumble: number;
      tumbleSpeed: number;
      color: string;
    }

    const stadiumColors = [
      "#F97316", // vivid sports orange
      "#EA580C", // deep stadium orange
      "#FBBF24", // champion gold
      "#FED7AA", // soft light orange
      "#FFFFFF", // sparkling white
      "#F59E0B", // energetic amber
      "#FB923C", // bright tangerine
    ];

    const stadiumConfetti: StadiumConfettiPiece[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      vy: Math.random() * 1.6 + 1.2,
      vx: (Math.random() - 0.5) * 0.6,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.035 + 0.015,
      w: Math.random() * 7 + 6,
      h: Math.random() * 5 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      tumble: Math.random() * Math.PI * 2,
      tumbleSpeed: Math.random() * 0.06 + 0.025,
      color: stadiumColors[Math.floor(Math.random() * stadiumColors.length)],
    }));

    // ==========================================
    // RENDER LOOP
    // ==========================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------
      // 1. PETALS
      // ----------------------------------------
      if (animationType === "petals") {
        petals.forEach((p) => {
          p.y += p.speedY;
          p.swing += p.swingSpeed;
          p.x += p.speedX + Math.sin(p.swing) * 0.7;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // ----------------------------------------
      // 2. SPACESHIPS
      // ----------------------------------------
      else if (animationType === "spaceships") {
        stars.forEach((s) => {
          s.x -= s.speed;
          if (s.x < 0) s.x = width;
          ctx.fillStyle = `rgba(224, 242, 254, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ships.forEach((ship) => {
          ship.x += ship.speed;
          ship.y += Math.sin(ship.angle) * ship.speed * 0.3;

          if (ship.x > width + ship.trailLength + 50) {
            ship.x = -ship.trailLength - Math.random() * 300;
            ship.y = height * 0.15 + Math.random() * (height * 0.7);
          }

          ctx.save();
          const grad = ctx.createLinearGradient(
            ship.x - ship.trailLength,
            ship.y,
            ship.x,
            ship.y
          );
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.7, "rgba(6, 182, 212, 0.25)");
          grad.addColorStop(1, "rgba(56, 189, 248, 0.95)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = ship.length * 0.18;
          ctx.beginPath();
          ctx.moveTo(ship.x - ship.trailLength, ship.y);
          ctx.lineTo(ship.x, ship.y);
          ctx.stroke();

          ctx.fillStyle = ship.color;
          ctx.shadowColor = "#06B6D4";
          ctx.shadowBlur = ship.blur * 5;
          ctx.beginPath();
          ctx.moveTo(ship.x + ship.length * 0.6, ship.y);
          ctx.lineTo(ship.x - ship.length * 0.4, ship.y - ship.length * 0.22);
          ctx.lineTo(ship.x - ship.length * 0.2, ship.y);
          ctx.lineTo(ship.x - ship.length * 0.4, ship.y + ship.length * 0.22);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      }

      // ----------------------------------------
      // 3. WIND & LEAVES & JAPANESE RIVERBANK PATH (Slice of Life)
      // ----------------------------------------
      else if (animationType === "wind_leaves") {
        const crestY = height * 0.69;
        const riverTopY = height * 0.54;
        const viaductY = height * 0.47;

        // A. Sunset Sky Gradient (Toki wo Kakeru Shoujo golden-hour atmosphere)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, riverTopY);
        skyGrad.addColorStop(0, "rgba(124, 58, 237, 0.22)"); // dusky lilac
        skyGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.28)"); // golden amber
        skyGrad.addColorStop(0.7, "rgba(249, 115, 22, 0.35)"); // warm sunset orange
        skyGrad.addColorStop(1.0, "rgba(254, 215, 170, 0.42)"); // peach glow above river
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, riverTopY);

        // B. Fluffy Watercolor Sunset Clouds
        sunsetClouds.forEach((c) => {
          c.x += c.speed;
          if (c.x > width + c.width) c.x = -c.width;
          ctx.save();
          const cGrad = ctx.createRadialGradient(
            c.x + c.width * 0.5,
            c.y,
            8,
            c.x + c.width * 0.5,
            c.y,
            c.width * 0.52
          );
          cGrad.addColorStop(0, `rgba(${c.colorBase}, ${c.alpha})`);
          cGrad.addColorStop(0.5, `rgba(${c.colorBase}, ${c.alpha * 0.55})`);
          cGrad.addColorStop(1, "transparent");
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.ellipse(c.x + c.width * 0.5, c.y, c.width * 0.5, c.height * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // C. Far Bank Silhouette (distant trees & city skyline)
        ctx.fillStyle = "rgba(26, 46, 36, 0.72)";
        ctx.beginPath();
        ctx.moveTo(0, riverTopY);
        const farSteps = 28;
        const stepW = width / farSteps;
        for (let i = 0; i <= farSteps; i++) {
          const fx = i * stepW;
          const treeH = 7 + Math.sin(i * 1.8) * 5 + (i % 3 === 0 ? 6 : 0);
          ctx.lineTo(fx, riverTopY - treeH);
        }
        ctx.lineTo(width, riverTopY);
        ctx.closePath();
        ctx.fill();

        // D. Elevated Expressway / Viaduct Bridge
        // Support piers
        ctx.fillStyle = "rgba(35, 45, 42, 0.88)";
        const pierInterval = Math.max(140, width * 0.14);
        for (let px = pierInterval * 0.5; px < width; px += pierInterval) {
          ctx.fillRect(px - 6, viaductY, 12, riverTopY - viaductY);
          // Pier cap
          ctx.fillRect(px - 10, viaductY, 20, 4);
        }
        // Expressway deck girder
        ctx.fillStyle = "rgba(42, 54, 50, 0.95)";
        ctx.fillRect(0, viaductY - 6, width, 8);
        // Sound barriers / railing
        ctx.fillStyle = "rgba(56, 72, 66, 0.8)";
        ctx.fillRect(0, viaductY - 14, width, 8);

        // Distant vehicles moving on overpass
        expresswayCars.forEach((car) => {
          car.x += car.speed;
          if (car.speed > 0 && car.x > width + 30) car.x = -30;
          if (car.speed < 0 && car.x < -30) car.x = width + 30;
          ctx.fillStyle = car.color;
          ctx.fillRect(car.x, viaductY - 12, car.size, 5);
          // Headlight/taillight glint
          ctx.fillStyle = car.speed > 0 ? "rgba(254, 240, 138, 0.9)" : "rgba(239, 68, 68, 0.9)";
          ctx.fillRect(car.speed > 0 ? car.x + car.size - 2 : car.x, viaductY - 11, 2, 3);
        });

        // E. Shimmering Golden Sunset River
        const riverGrad = ctx.createLinearGradient(0, riverTopY, 0, crestY);
        riverGrad.addColorStop(0, "rgba(217, 119, 6, 0.85)"); // amber
        riverGrad.addColorStop(0.4, "rgba(245, 158, 11, 0.9)"); // golden orange
        riverGrad.addColorStop(1.0, "rgba(251, 191, 36, 0.95)"); // radiant gold
        ctx.fillStyle = riverGrad;
        ctx.fillRect(0, riverTopY, width, crestY - riverTopY);

        // Animated river ripples & sunlight sparkles
        riverShimmers.forEach((s) => {
          s.x += s.speedX;
          s.pulse += s.pulseSpeed;
          if (s.x > width + s.length) s.x = -s.length;
          const currentAlpha = (Math.sin(s.pulse) * 0.35 + 0.65) * s.alpha;
          ctx.strokeStyle = `rgba(254, 252, 232, ${currentAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y);
          ctx.stroke();
        });

        // F. Grassy Riverbank Embankment Slope (Dote)
        const bankGrad = ctx.createLinearGradient(0, crestY, 0, height);
        bankGrad.addColorStop(0, "#193B2B"); // deep lush crest green
        bankGrad.addColorStop(0.3, "#132F22");
        bankGrad.addColorStop(1.0, "#0A1B13"); // dark foreground earth
        ctx.fillStyle = bankGrad;
        ctx.fillRect(0, crestY, width, height - crestY);

        // Grass blades along crest path for realistic texture
        ctx.strokeStyle = "#276247";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let gx = 0; gx < width; gx += 6) {
          const bladeH = 3 + Math.sin(gx * 0.4) * 2;
          ctx.moveTo(gx, crestY);
          ctx.lineTo(gx + 1, crestY - bladeH);
        }
        ctx.stroke();

        // G. Bicycle with 2 Riders (Crossing the embankment crest path)
        if (bicycle.status === "riding") {
          bicycle.x += bicycle.speed * bicycle.direction;
          bicycle.wheelAngle += 0.08 * bicycle.direction;
          bicycle.pedalAngle += 0.07 * bicycle.direction;

          // Check screen boundary exit
          if (bicycle.direction === 1 && bicycle.x > width + 140) {
            bicycle.status = "waiting";
            bicycle.waitTimer = Math.floor(Math.random() * 220) + 160;
            bicycle.direction = Math.random() > 0.35 ? 1 : -1;
            bicycle.x = bicycle.direction === 1 ? -140 : width + 140;
          } else if (bicycle.direction === -1 && bicycle.x < -140) {
            bicycle.status = "waiting";
            bicycle.waitTimer = Math.floor(Math.random() * 220) + 160;
            bicycle.direction = 1;
            bicycle.x = -140;
          }

          // Draw the Bicycle and both anime riders in detailed silhouette
          ctx.save();
          ctx.translate(bicycle.x, crestY - 1);
          if (bicycle.direction === -1) {
            ctx.scale(-1, 1);
          }

          const bikeDark = "#111827"; // solid silhouette charcoal
          const skinTone = "#FDE68A"; // warm anime skin tone highlight

          // 1. Bicycle Wheels (radius 15)
          const rearHub = { x: -28, y: -15 };
          const frontHub = { x: 28, y: -15 };

          [rearHub, frontHub].forEach((hub) => {
            // Tire & Rim
            ctx.strokeStyle = bikeDark;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(hub.x, hub.y, 14, 0, Math.PI * 2);
            ctx.stroke();

            // Spokes rotating
            ctx.save();
            ctx.translate(hub.x, hub.y);
            ctx.rotate(bicycle.wheelAngle);
            ctx.strokeStyle = "rgba(75, 85, 99, 0.85)";
            ctx.lineWidth = 1;
            for (let sp = 0; sp < 6; sp++) {
              const spAngle = (sp * Math.PI) / 3;
              ctx.beginPath();
              ctx.moveTo(-Math.cos(spAngle) * 13, -Math.sin(spAngle) * 13);
              ctx.lineTo(Math.cos(spAngle) * 13, Math.sin(spAngle) * 13);
              ctx.stroke();
            }
            ctx.restore();

            // Center hub cap
            ctx.fillStyle = bikeDark;
            ctx.beginPath();
            ctx.arc(hub.x, hub.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // 2. Bicycle Frame & Rack
          ctx.strokeStyle = bikeDark;
          ctx.lineWidth = 2.4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          const bottomBracket = { x: 0, y: -15 };
          const seatLug = { x: -14, y: -35 };
          const headTube = { x: 18, y: -38 };
          const handleGrip = { x: 16, y: -48 };

          // Chainstay & Seatstay
          ctx.beginPath();
          ctx.moveTo(rearHub.x, rearHub.y);
          ctx.lineTo(bottomBracket.x, bottomBracket.y);
          ctx.lineTo(seatLug.x, seatLug.y);
          ctx.lineTo(rearHub.x, rearHub.y);
          // Main diamond frame
          ctx.moveTo(bottomBracket.x, bottomBracket.y);
          ctx.lineTo(headTube.x, headTube.y);
          ctx.lineTo(seatLug.x, seatLug.y);
          // Front fork
          ctx.moveTo(headTube.x, headTube.y);
          ctx.lineTo(frontHub.x, frontHub.y);
          // Handlebar stem
          ctx.moveTo(headTube.x, headTube.y);
          ctx.lineTo(handleGrip.x, handleGrip.y);
          ctx.stroke();

          // Rear luggage rack (where passenger sits)
          ctx.beginPath();
          ctx.moveTo(-8, -34);
          ctx.lineTo(-34, -34);
          ctx.lineTo(rearHub.x, rearHub.y);
          ctx.stroke();

          // Front basket
          ctx.fillStyle = "rgba(31, 41, 55, 0.9)";
          ctx.fillRect(20, -42, 11, 8);

          // Saddle
          ctx.fillStyle = bikeDark;
          ctx.beginPath();
          ctx.ellipse(-14, -37, 7, 2.5, -0.1, 0, Math.PI * 2);
          ctx.fill();

          // Animated pedals & crank
          const pedalR = 7;
          const pX = Math.cos(bicycle.pedalAngle) * pedalR;
          const pY = Math.sin(bicycle.pedalAngle) * pedalR;
          ctx.strokeStyle = bikeDark;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(bottomBracket.x - pX, bottomBracket.y - pY);
          ctx.lineTo(bottomBracket.x + pX, bottomBracket.y + pY);
          ctx.stroke();

          // 3. FRONT RIDER (Driver Pedaling)
          // Hip & Torso
          const driverHip = { x: -12, y: -38 };
          const driverShoulder = { x: 8, y: -52 };
          ctx.strokeStyle = bikeDark;
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(driverHip.x, driverHip.y);
          ctx.lineTo(driverShoulder.x, driverShoulder.y);
          ctx.stroke();

          // Driver Head & Anime Hair
          ctx.fillStyle = bikeDark;
          ctx.beginPath();
          ctx.arc(8, -63, 6.5, 0, Math.PI * 2);
          ctx.fill();
          // Hair strands blown in wind
          ctx.beginPath();
          ctx.moveTo(3, -66);
          ctx.lineTo(-4, -68);
          ctx.lineTo(4, -62);
          ctx.fill();

          // Driver Arms to Handlebar
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(driverShoulder.x, driverShoulder.y);
          ctx.lineTo(handleGrip.x, handleGrip.y);
          ctx.stroke();

          // Driver Legs (Animated pedaling)
          const pedalPos = { x: bottomBracket.x + pX, y: bottomBracket.y + pY };
          ctx.lineWidth = 4;
          // Thigh & Shin
          const kneeX = (driverHip.x + pedalPos.x) / 2 + 5;
          const kneeY = (driverHip.y + pedalPos.y) / 2 - 4;
          ctx.beginPath();
          ctx.moveTo(driverHip.x, driverHip.y);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(pedalPos.x, pedalPos.y);
          ctx.stroke();

          // 4. REAR PASSENGER (Seated on rack holding waist)
          const passSeat = { x: -24, y: -36 };
          const passShoulder = { x: -14, y: -51 };

          // Passenger Torso
          ctx.lineWidth = 6.5;
          ctx.beginPath();
          ctx.moveTo(passSeat.x, passSeat.y);
          ctx.lineTo(passShoulder.x, passShoulder.y);
          ctx.stroke();

          // Passenger Head & Hair
          ctx.fillStyle = bikeDark;
          ctx.beginPath();
          ctx.arc(-15, -60, 6, 0, Math.PI * 2);
          ctx.fill();
          // Fluttering hair / ponytail
          ctx.beginPath();
          ctx.moveTo(-20, -62);
          ctx.quadraticCurveTo(-30, -64, -28, -56);
          ctx.lineTo(-20, -58);
          ctx.fill();

          // Passenger Arms reaching forward, holding driver's waist
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(passShoulder.x, passShoulder.y);
          ctx.lineTo(-1, -44);
          ctx.stroke();

          // Passenger dangling legs beside rear wheel
          ctx.lineWidth = 3.8;
          ctx.beginPath();
          ctx.moveTo(passSeat.x, passSeat.y);
          ctx.lineTo(-16, -30); // Knee
          ctx.lineTo(-15, -18); // Foot
          ctx.stroke();

          ctx.restore();
        } else {
          // Waiting timer countdown
          bicycle.waitTimer--;
          if (bicycle.waitTimer <= 0) {
            bicycle.status = "riding";
          }
        }

        // H. Floating Wind Streaks across the scene
        windStreaks.forEach((w) => {
          w.x += w.speed;
          if (w.x > width + w.length) {
            w.x = -w.length;
            w.y = Math.random() * height;
          }
          ctx.strokeStyle = `rgba(167, 243, 208, ${w.alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(w.x - w.length, w.y);
          ctx.bezierCurveTo(
            w.x - w.length * 0.5,
            w.y - 15,
            w.x - w.length * 0.2,
            w.y + 15,
            w.x,
            w.y
          );
          ctx.stroke();
        });
      }

      // ----------------------------------------
      // 4. FLAMES
      // ----------------------------------------
      else if (animationType === "flames") {
        flames.forEach((f) => {
          f.y -= f.speedY;
          f.x += f.speedX;
          f.life++;

          const progress = f.life / f.maxLife;
          const currentRadius = f.radius * (1 - progress * 0.4);
          const currentAlpha = (1 - progress) * 0.45;

          if (f.life >= f.maxLife || f.y < height * 0.55) {
            f.y = height + Math.random() * 40;
            f.x = Math.random() * width;
            f.life = 0;
          }

          ctx.save();
          ctx.shadowBlur = f.blur * 2;
          ctx.shadowColor = "#EF4444";
          const radial = ctx.createRadialGradient(
            f.x,
            f.y,
            0,
            f.x,
            f.y,
            currentRadius
          );
          radial.addColorStop(0, f.color);
          radial.addColorStop(1, "transparent");
          ctx.fillStyle = radial;
          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(f.x, f.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        embers.forEach((e) => {
          e.y -= e.speedY;
          e.x += e.speedX;
          if (e.y < height * 0.4) {
            e.y = height + 10;
            e.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(254, 240, 138, ${e.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#F97316";
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------
      // 5. FIREWORKS & JAPANESE FESTIVAL (Comedia)
      // Reference: Japanese New Year Matsuri under Midnight Sky
      // ----------------------------------------
      else if (animationType === "fireworks") {
        const nowTime = Date.now() * 0.002;

        // A. Deep Midnight Night Sky Gradient (STABLE: never tints with explosions)
        const festSky = ctx.createLinearGradient(0, 0, 0, height);
        festSky.addColorStop(0, "#04090F"); // zenith deep midnight navy
        festSky.addColorStop(0.5, "#08131E"); // deep slate navy
        festSky.addColorStop(0.78, "#0B1C28"); // subtle atmospheric teal-navy horizon
        festSky.addColorStop(1.0, "#050C14"); // ground base
        ctx.fillStyle = festSky;
        ctx.fillRect(0, 0, width, height);

        // B. Distant Twinkling Stars in Upper Sky
        ctx.save();
        festivalStars.forEach((star) => {
          const alpha =
            star.baseAlpha +
            Math.sin(nowTime * star.twinkleSpeed * 40 + star.phase) * 0.22;
          ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.12, Math.min(1, alpha))})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // C. Distant Mountain Ridges (Layered dark silhouettes on the horizon)
        // Far mountain ridge
        ctx.fillStyle = "#091722";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        ctx.quadraticCurveTo(width * 0.22, height * 0.67, width * 0.42, height * 0.73);
        ctx.quadraticCurveTo(width * 0.58, height * 0.76, width * 0.76, height * 0.68);
        ctx.quadraticCurveTo(width * 0.9, height * 0.65, width, height * 0.71);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Nearer mountain ridge
        ctx.fillStyle = "#061019";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.76);
        ctx.quadraticCurveTo(width * 0.28, height * 0.72, width * 0.5, height * 0.77);
        ctx.quadraticCurveTo(width * 0.75, height * 0.81, width, height * 0.75);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // D. Japanese Pine Trees (Matsu / 松) Framing Left & Right Borders
        ctx.save();
        ctx.fillStyle = "#040B11"; // deep pine silhouette
        // Left Pine Trees
        // Trunk & branches
        ctx.beginPath();
        ctx.moveTo(0, height * 0.9);
        ctx.quadraticCurveTo(width * 0.05, height * 0.65, width * 0.03, height * 0.35);
        ctx.lineTo(width * 0.045, height * 0.35);
        ctx.quadraticCurveTo(width * 0.07, height * 0.65, width * 0.03, height * 0.9);
        ctx.closePath();
        ctx.fill();

        // Horizontal needle pads on left
        const leftPinePads = [
          { cx: width * 0.03, cy: height * 0.36, rx: width * 0.06, ry: 16 },
          { cx: width * 0.07, cy: height * 0.44, rx: width * 0.075, ry: 18 },
          { cx: width * 0.04, cy: height * 0.53, rx: width * 0.08, ry: 20 },
          { cx: width * 0.09, cy: height * 0.62, rx: width * 0.09, ry: 22 },
          { cx: width * 0.05, cy: height * 0.72, rx: width * 0.1, ry: 24 },
        ];
        leftPinePads.forEach((pad) => {
          ctx.beginPath();
          ctx.ellipse(pad.cx, pad.cy, pad.rx, pad.ry, -0.08, 0, Math.PI * 2);
          ctx.fill();
        });

        // Right Pine Trees
        const rightPinePads = [
          { cx: width * 0.97, cy: height * 0.42, rx: width * 0.065, ry: 16 },
          { cx: width * 0.94, cy: height * 0.51, rx: width * 0.075, ry: 19 },
          { cx: width * 0.96, cy: height * 0.61, rx: width * 0.08, ry: 21 },
          { cx: width * 0.92, cy: height * 0.70, rx: width * 0.095, ry: 23 },
        ];
        rightPinePads.forEach((pad) => {
          ctx.beginPath();
          ctx.ellipse(pad.cx, pad.cy, pad.rx, pad.ry, 0.08, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // E. Central Festival Avenue & Approach Path
        const roadBaseY = height * 0.81;
        ctx.save();
        const roadGrad = ctx.createLinearGradient(0, roadBaseY, 0, height);
        roadGrad.addColorStop(0, "#08111B");
        roadGrad.addColorStop(1, "#03080E");
        ctx.fillStyle = roadGrad;
        ctx.beginPath();
        ctx.moveTo(width * 0.44, roadBaseY);
        ctx.lineTo(width * 0.56, roadBaseY);
        ctx.lineTo(width * 0.78, height);
        ctx.lineTo(width * 0.22, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // F. Festival Stalls & Traditional Shrine Pavilions (Left & Right Flanks)
        // Left Festival Pavilion & Stalls
        ctx.save();
        // Warm interior glow under left stalls
        const leftStallGlow = ctx.createRadialGradient(
          width * 0.16,
          height * 0.84,
          10,
          width * 0.16,
          height * 0.84,
          width * 0.18
        );
        leftStallGlow.addColorStop(0, "rgba(245, 158, 11, 0.24)");
        leftStallGlow.addColorStop(0.6, "rgba(245, 158, 11, 0.08)");
        leftStallGlow.addColorStop(1, "transparent");
        ctx.fillStyle = leftStallGlow;
        ctx.fillRect(0, height * 0.74, width * 0.32, height * 0.26);

        // Curved Japanese Roof Eaves (Left)
        ctx.fillStyle = "#050D14";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.76);
        ctx.quadraticCurveTo(width * 0.12, height * 0.73, width * 0.24, height * 0.77);
        ctx.lineTo(width * 0.24, height * 0.79);
        ctx.quadraticCurveTo(width * 0.12, height * 0.75, 0, height * 0.78);
        ctx.closePath();
        ctx.fill();

        // Left building structures & stall counters
        ctx.fillStyle = "#060E16";
        ctx.fillRect(0, height * 0.78, width * 0.23, height * 0.22);
        // Warm stall counter opening
        ctx.fillStyle = "rgba(251, 191, 36, 0.18)";
        ctx.fillRect(width * 0.03, height * 0.81, width * 0.18, height * 0.05);

        // Right Festival Pavilions & Temple Roofs (Right)
        const rightStallGlow = ctx.createRadialGradient(
          width * 0.84,
          height * 0.84,
          10,
          width * 0.84,
          height * 0.84,
          width * 0.18
        );
        rightStallGlow.addColorStop(0, "rgba(245, 158, 11, 0.24)");
        rightStallGlow.addColorStop(0.6, "rgba(245, 158, 11, 0.08)");
        rightStallGlow.addColorStop(1, "transparent");
        ctx.fillStyle = rightStallGlow;
        ctx.fillRect(width * 0.68, height * 0.74, width * 0.32, height * 0.26);

        // Right curved Japanese eaves
        ctx.fillStyle = "#050D14";
        ctx.beginPath();
        ctx.moveTo(width, height * 0.74);
        ctx.quadraticCurveTo(width * 0.88, height * 0.71, width * 0.76, height * 0.76);
        ctx.lineTo(width * 0.76, height * 0.78);
        ctx.quadraticCurveTo(width * 0.88, height * 0.73, width, height * 0.76);
        ctx.closePath();
        ctx.fill();

        // Lower right eave
        ctx.beginPath();
        ctx.moveTo(width, height * 0.80);
        ctx.quadraticCurveTo(width * 0.89, height * 0.78, width * 0.77, height * 0.82);
        ctx.lineTo(width * 0.77, height * 0.835);
        ctx.quadraticCurveTo(width * 0.89, height * 0.795, width, height * 0.815);
        ctx.closePath();
        ctx.fill();

        // Right stall counter base
        ctx.fillStyle = "#060E16";
        ctx.fillRect(width * 0.77, height * 0.82, width * 0.23, height * 0.18);
        ctx.fillStyle = "rgba(251, 191, 36, 0.18)";
        ctx.fillRect(width * 0.79, height * 0.83, width * 0.18, height * 0.05);
        ctx.restore();

        // G. Traditional Wooden Post Lanterns (Tōrō / 燈籠) Lining the Avenue
        toroLanterns.forEach((tl) => {
          ctx.save();
          const s = tl.scale;
          const lx = tl.x;
          const ly = tl.y;

          // Ground light puddle
          const groundGlow = ctx.createRadialGradient(lx, ly + 25 * s, 2, lx, ly + 25 * s, 32 * s);
          groundGlow.addColorStop(0, "rgba(245, 158, 11, 0.35)");
          groundGlow.addColorStop(1, "transparent");
          ctx.fillStyle = groundGlow;
          ctx.beginPath();
          ctx.ellipse(lx, ly + 25 * s, 28 * s, 9 * s, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wooden post
          ctx.fillStyle = "#09121B";
          ctx.fillRect(lx - 2.5 * s, ly - 8 * s, 5 * s, 32 * s);
          // Stone pediment
          ctx.fillRect(lx - 7 * s, ly + 22 * s, 14 * s, 4 * s);

          // Warm Glowing Paper Window Box (Hibukuro)
          const lampGlow = ctx.createRadialGradient(lx, ly - 16 * s, 2, lx, ly - 16 * s, 24 * s);
          lampGlow.addColorStop(0, "rgba(254, 240, 138, 0.95)");
          lampGlow.addColorStop(0.4, "rgba(245, 158, 11, 0.75)");
          lampGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = lampGlow;
          ctx.beginPath();
          ctx.arc(lx, ly - 16 * s, 22 * s, 0, Math.PI * 2);
          ctx.fill();

          // Paper window core
          ctx.fillStyle = "#FEF08A";
          ctx.fillRect(lx - 7 * s, ly - 23 * s, 14 * s, 14 * s);

          // Wood lattice frame
          ctx.strokeStyle = "#081018";
          ctx.lineWidth = 1.6 * s;
          ctx.strokeRect(lx - 7 * s, ly - 23 * s, 14 * s, 14 * s);
          ctx.beginPath();
          ctx.moveTo(lx, ly - 23 * s);
          ctx.lineTo(lx, ly - 9 * s);
          ctx.moveTo(lx - 7 * s, ly - 16 * s);
          ctx.lineTo(lx + 7 * s, ly - 16 * s);
          ctx.stroke();

          // Wooden Roof Cap (Kasa) with flared corners
          ctx.fillStyle = "#09121B";
          ctx.beginPath();
          ctx.moveTo(lx - 12 * s, ly - 22 * s);
          ctx.quadraticCurveTo(lx, ly - 28 * s, lx + 12 * s, ly - 22 * s);
          ctx.lineTo(lx + 10 * s, ly - 26 * s);
          ctx.quadraticCurveTo(lx, ly - 32 * s, lx - 10 * s, ly - 26 * s);
          ctx.closePath();
          ctx.fill();

          // Top jewel finial (Hōju)
          ctx.beginPath();
          ctx.arc(lx, ly - 31 * s, 2.5 * s, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // H. Traditional Japanese Torii Gate (Centrally Framed in Avenue)
        const toriiX = width * 0.5;
        const toriiBaseY = height * 0.815;
        const toriiW = Math.min(200, width * 0.25);
        const toriiH = Math.min(135, height * 0.18);
        const pillarW = Math.max(6.5, toriiW * 0.05);

        ctx.save();
        // Torii Vermilion Red Pillars (Hashira)
        ctx.fillStyle = "#991B1B";
        // Left pillar
        ctx.beginPath();
        ctx.moveTo(toriiX - toriiW * 0.38 - pillarW * 0.5, toriiBaseY);
        ctx.lineTo(toriiX - toriiW * 0.35 - pillarW * 0.4, toriiBaseY - toriiH);
        ctx.lineTo(toriiX - toriiW * 0.35 + pillarW * 0.4, toriiBaseY - toriiH);
        ctx.lineTo(toriiX - toriiW * 0.38 + pillarW * 0.5, toriiBaseY);
        ctx.closePath();
        ctx.fill();

        // Right pillar
        ctx.beginPath();
        ctx.moveTo(toriiX + toriiW * 0.38 - pillarW * 0.5, toriiBaseY);
        ctx.lineTo(toriiX + toriiW * 0.35 - pillarW * 0.4, toriiBaseY - toriiH);
        ctx.lineTo(toriiX + toriiW * 0.35 + pillarW * 0.4, toriiBaseY - toriiH);
        ctx.lineTo(toriiX + toriiW * 0.38 + pillarW * 0.5, toriiBaseY);
        ctx.closePath();
        ctx.fill();

        // Stone base pediments (Kamebara)
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(toriiX - toriiW * 0.4 - 2, toriiBaseY - 5, pillarW + 5, 5);
        ctx.fillRect(toriiX + toriiW * 0.36 - 2, toriiBaseY - 5, pillarW + 5, 5);

        // Lower Tie Beam (Nuki)
        ctx.fillStyle = "#B91C1C";
        ctx.fillRect(
          toriiX - toriiW * 0.44,
          toriiBaseY - toriiH * 0.74,
          toriiW * 0.88,
          pillarW * 0.9
        );

        // Upper Lintel (Kasagi & Shimaki) with upward curved ends
        ctx.fillStyle = "#991B1B";
        ctx.beginPath();
        ctx.moveTo(toriiX - toriiW * 0.54, toriiBaseY - toriiH - 6);
        ctx.quadraticCurveTo(
          toriiX,
          toriiBaseY - toriiH - 1,
          toriiX + toriiW * 0.54,
          toriiBaseY - toriiH - 6
        );
        ctx.lineTo(toriiX + toriiW * 0.56, toriiBaseY - toriiH - 14);
        ctx.quadraticCurveTo(
          toriiX,
          toriiBaseY - toriiH - 8,
          toriiX - toriiW * 0.56,
          toriiBaseY - toriiH - 14
        );
        ctx.closePath();
        ctx.fill();

        // Black roof cap ridge
        ctx.fillStyle = "#090F17";
        ctx.beginPath();
        ctx.moveTo(toriiX - toriiW * 0.57, toriiBaseY - toriiH - 14);
        ctx.quadraticCurveTo(
          toriiX,
          toriiBaseY - toriiH - 8,
          toriiX + toriiW * 0.57,
          toriiBaseY - toriiH - 14
        );
        ctx.lineTo(toriiX + toriiW * 0.57, toriiBaseY - toriiH - 17);
        ctx.quadraticCurveTo(
          toriiX,
          toriiBaseY - toriiH - 11,
          toriiX - toriiW * 0.57,
          toriiBaseY - toriiH - 17
        );
        ctx.closePath();
        ctx.fill();

        // Central Shrine Plaque (Gakuzuka)
        ctx.fillStyle = "#0A101D";
        ctx.fillRect(toriiX - 5, toriiBaseY - toriiH - 4, 10, toriiH * 0.28);
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1;
        ctx.strokeRect(toriiX - 4, toriiBaseY - toriiH - 3, 8, toriiH * 0.26);
        ctx.restore();

        // I. Festival Visitors in Yukata (Silhouettes Walking the Avenue)
        ctx.save();
        crowdPeople.forEach((p) => {
          const px = p.x;
          const py = p.y;
          const ph = p.h;

          // Yukata Body & Robe
          ctx.fillStyle = p.yukataColor;
          ctx.beginPath();
          ctx.moveTo(px - ph * 0.16, py);
          ctx.lineTo(px - ph * 0.12, py - ph * 0.55);
          ctx.lineTo(px - ph * 0.2, py - ph * 0.72); // sleeve flare
          ctx.lineTo(px - ph * 0.08, py - ph * 0.78); // shoulder
          ctx.lineTo(px + ph * 0.08, py - ph * 0.78);
          ctx.lineTo(px + ph * 0.2, py - ph * 0.72);
          ctx.lineTo(px + ph * 0.12, py - ph * 0.55);
          ctx.lineTo(px + ph * 0.16, py);
          ctx.closePath();
          ctx.fill();

          // Obi Sash
          ctx.fillStyle = p.sashColor;
          ctx.fillRect(px - ph * 0.13, py - ph * 0.55, ph * 0.26, ph * 0.1);

          // Head & Hair
          ctx.fillStyle = "#04080F";
          ctx.beginPath();
          ctx.arc(px, py - ph * 0.88, ph * 0.11, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // J. Multi-colored Fireworks Display in Upper Sky
        // (ISOLATED: Particles only, strictly NO canvas background flash/tint, adjusted by fwSpeed)
        fireworks.forEach((fw, idx) => {
          if (fw.state === "rising") {
            fw.y -= fw.speedY;

            ctx.save();
            ctx.fillStyle = fw.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = fw.color;
            ctx.beginPath();
            ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Rising spark trail
            ctx.fillStyle = "#FEF08A";
            ctx.beginPath();
            ctx.arc(fw.x, fw.y + 6, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (fw.y <= fw.targetY) {
              fw.state = "exploded";
              const pCount = 52; // dense chrysanthemum burst
              for (let i = 0; i < pCount; i++) {
                const angle = (i / pCount) * Math.PI * 2;
                const speed = (Math.random() * 3.6 + 1.8) * fwSpeed;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: fw.color,
                  alpha: 1.0,
                  decay: (Math.random() * 0.012 + 0.009) * fwSpeed,
                  radius: Math.random() * 2.6 + 1.6,
                });
              }
            }
          } else if (fw.state === "exploded") {
            let living = 0;
            fw.particles.forEach((p) => {
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.030 * fwSpeed; // slow realistic gentle gravity drop
              p.vx *= (1 - 0.025 * fwSpeed);
              p.alpha -= p.decay;

              if (p.alpha > 0) {
                living++;
                ctx.save();
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Spark twinkle core
                if (p.alpha > 0.4) {
                  ctx.fillStyle = "#FFFFFF";
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
                  ctx.fill();
                }
                ctx.restore();
              }
            });

            if (living === 0) {
              fireworks[idx] = spawnFirework();
            }
          }
        });
      }

      // ----------------------------------------
      // 6. HORROR FOREST & GLOWING PEEPING EYES
      // ----------------------------------------
      else if (animationType === "horror_forest") {
        // A. Distant misty forest background
        const mistSky = ctx.createLinearGradient(0, 0, 0, height);
        mistSky.addColorStop(0, "rgba(20, 2, 6, 0.6)");
        mistSky.addColorStop(0.6, "rgba(40, 4, 12, 0.65)");
        mistSky.addColorStop(1.0, "rgba(10, 1, 4, 0.95)");
        ctx.fillStyle = mistSky;
        ctx.fillRect(0, 0, width, height);

        // Function to draw an authentic organic gnarled bare dead tree with buttress roots and skeletal twigs
        const drawDeadTree = (
          rootX: number,
          rootY: number,
          treeH: number,
          scale: number,
          flip: 1 | -1,
          baseColor: string,
          glowColor?: string
        ) => {
          ctx.save();
          ctx.translate(rootX, rootY);
          if (flip === -1) ctx.scale(-1, 1);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Helper for drawing a tapered branch segment with optional glow
          const drawLimb = (
            x1: number,
            y1: number,
            cx: number,
            cy: number,
            x2: number,
            y2: number,
            w: number
          ) => {
            if (glowColor) {
              ctx.strokeStyle = glowColor;
              ctx.lineWidth = w * scale + 4;
              ctx.shadowColor = "#991B1B";
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.moveTo(x1 * scale, y1 * scale);
              ctx.quadraticCurveTo(cx * scale, cy * scale, x2 * scale, y2 * scale);
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
            ctx.strokeStyle = baseColor;
            ctx.lineWidth = Math.max(1.2, w * scale);
            ctx.beginPath();
            ctx.moveTo(x1 * scale, y1 * scale);
            ctx.quadraticCurveTo(cx * scale, cy * scale, x2 * scale, y2 * scale);
            ctx.stroke();
          };

          // 1. Buttress Roots (flared claw roots gripping the ground)
          drawLimb(0, -18, -25, -6, -42, 0, 14);
          drawLimb(0, -18, -12, -4, -22, 0, 10);
          drawLimb(0, -18, 14, -5, 26, 0, 11);
          drawLimb(0, -18, 28, -6, 44, 0, 15);

          // 2. Main Gnarled Tapered Trunk (S-curved, thick and weathered)
          drawLimb(0, 0, 4, -treeH * 0.18, -6, -treeH * 0.35, 26);
          drawLimb(-6, -treeH * 0.35, -12, -treeH * 0.46, -2, -treeH * 0.58, 20);

          // 3. Lower Major Bough (Reaching outward horizontally then crook-elbow upward)
          drawLimb(-6, -treeH * 0.35, -35, -treeH * 0.38, -65, -treeH * 0.44, 14);
          drawLimb(-65, -treeH * 0.44, -85, -treeH * 0.54, -98, -treeH * 0.68, 9);
          // Sub-twigs off lower bough
          drawLimb(-65, -treeH * 0.44, -72, -treeH * 0.36, -88, -treeH * 0.32, 6);
          drawLimb(-88, -treeH * 0.32, -100, -treeH * 0.34, -112, -treeH * 0.38, 3.5);
          drawLimb(-88, -treeH * 0.32, -94, -treeH * 0.24, -104, -treeH * 0.2, 2.5);
          drawLimb(-98, -treeH * 0.68, -112, -treeH * 0.74, -124, -treeH * 0.82, 4);
          drawLimb(-98, -treeH * 0.68, -92, -treeH * 0.76, -96, -treeH * 0.86, 3);
          drawLimb(-124, -treeH * 0.82, -135, -treeH * 0.86, -142, -treeH * 0.92, 1.8);
          drawLimb(-124, -treeH * 0.82, -128, -treeH * 0.92, -132, -treeH * 0.98, 1.8);

          // 4. Middle Major Fork (Curving inward across the sky)
          drawLimb(-2, -treeH * 0.58, 22, -treeH * 0.64, 48, -treeH * 0.72, 13);
          drawLimb(48, -treeH * 0.72, 68, -treeH * 0.8, 86, -treeH * 0.88, 8);
          drawLimb(86, -treeH * 0.88, 104, -treeH * 0.94, 118, -treeH * 1.02, 4.5);
          // Finger twigs
          drawLimb(118, -treeH * 1.02, 128, -treeH * 1.05, 136, -treeH * 1.1, 2);
          drawLimb(118, -treeH * 1.02, 124, -treeH * 0.98, 132, -treeH * 0.95, 2);
          drawLimb(86, -treeH * 0.88, 88, -treeH * 0.96, 94, -treeH * 1.04, 3);
          drawLimb(48, -treeH * 0.72, 54, -treeH * 0.66, 68, -treeH * 0.62, 5.5);
          drawLimb(68, -treeH * 0.62, 82, -treeH * 0.6, 92, -treeH * 0.56, 3);

          // 5. Crown Spire & Claw Branches (Reaching high up)
          drawLimb(-2, -treeH * 0.58, -8, -treeH * 0.72, -14, -treeH * 0.85, 12);
          drawLimb(-14, -treeH * 0.85, -28, -treeH * 0.95, -38, -treeH * 1.06, 7);
          drawLimb(-38, -treeH * 1.06, -46, -treeH * 1.15, -54, -treeH * 1.22, 3.8);
          // Crown skeletal twigs
          drawLimb(-54, -treeH * 1.22, -62, -treeH * 1.28, -70, -treeH * 1.34, 1.8);
          drawLimb(-54, -treeH * 1.22, -48, -treeH * 1.3, -52, -treeH * 1.38, 1.8);
          drawLimb(-38, -treeH * 1.06, -26, -treeH * 1.14, -22, -treeH * 1.22, 3);
          drawLimb(-22, -treeH * 1.22, -16, -treeH * 1.28, -12, -treeH * 1.34, 1.8);

          // Side sharp splinter branch
          drawLimb(-14, -treeH * 0.85, 4, -treeH * 0.92, 18, -treeH * 0.98, 6);
          drawLimb(18, -treeH * 0.98, 28, -treeH * 1.04, 36, -treeH * 1.12, 3);
          drawLimb(36, -treeH * 1.12, 42, -treeH * 1.18, 48, -treeH * 1.24, 1.8);

          ctx.restore();
        };

        // B. Deep Background Dead Trees (Hazy misty silhouettes)
        drawDeadTree(width * 0.22, height * 0.88, 200, 0.75, 1, "rgba(42, 6, 14, 0.42)");
        drawDeadTree(width * 0.5, height * 0.84, 180, 0.65, -1, "rgba(48, 8, 18, 0.38)");
        drawDeadTree(width * 0.78, height * 0.88, 210, 0.78, -1, "rgba(42, 6, 14, 0.42)");

        // C. Midground Gnarled Trees
        drawDeadTree(width * 0.14, height * 0.96, 260, 0.95, 1, "rgba(28, 4, 10, 0.75)", "rgba(160, 20, 50, 0.22)");
        drawDeadTree(width * 0.86, height * 0.96, 270, 0.98, -1, "rgba(28, 4, 10, 0.75)", "rgba(160, 20, 50, 0.22)");

        // D. Foreground Massive Dead Trees (Framing Left and Right with Crimson Rim Glow)
        drawDeadTree(
          width * 0.02,
          height,
          360,
          1.35,
          1,
          "rgba(14, 2, 5, 0.98)",
          "rgba(185, 28, 60, 0.42)"
        );
        drawDeadTree(
          width * 0.98,
          height,
          370,
          1.38,
          -1,
          "rgba(14, 2, 5, 0.98)",
          "rgba(185, 28, 60, 0.42)"
        );

        // E. Creeping Ground Fog Banks rolling through the forest floor
        groundFog.forEach((fog) => {
          fog.x += fog.speed;
          fog.pulse += 0.02;
          if (fog.x > width + fog.width) fog.x = -fog.width;
          const fogAlpha = (Math.sin(fog.pulse) * 0.25 + 0.75) * fog.alpha;
          const fogGrad = ctx.createRadialGradient(
            fog.x + fog.width * 0.5,
            fog.y,
            12,
            fog.x + fog.width * 0.5,
            fog.y,
            fog.width * 0.5
          );
          fogGrad.addColorStop(0, `rgba(76, 5, 20, ${fogAlpha * 0.9})`);
          fogGrad.addColorStop(0.5, `rgba(45, 4, 12, ${fogAlpha * 0.5})`);
          fogGrad.addColorStop(1, "transparent");
          ctx.fillStyle = fogGrad;
          ctx.beginPath();
          ctx.ellipse(
            fog.x + fog.width * 0.5,
            fog.y,
            fog.width * 0.5,
            fog.height * 0.5,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        // C. INTERMITTENT GLOWING PEEPING EYES IN THE WOODS
        eyePairs.forEach((ep) => {
          if (ep.state === "hidden") {
            ep.timer--;
            if (ep.timer <= 0) {
              ep.state = "fadeIn";
              ep.alpha = 0;
            }
          } else if (ep.state === "fadeIn") {
            ep.alpha += 0.035;
            if (ep.alpha >= 1) {
              ep.alpha = 1;
              ep.state = "staring";
              ep.timer = ep.stareDuration;
            }
          } else if (ep.state === "staring") {
            ep.timer--;
            // Trigger eye blink
            if (ep.timer === Math.floor(ep.stareDuration / 2)) {
              ep.state = "blinking";
              ep.blinkProgress = 0;
            } else if (ep.timer <= 0) {
              ep.state = "fadeOut";
            }
          } else if (ep.state === "blinking") {
            ep.blinkProgress += 0.22;
            ep.blinkScale = Math.abs(Math.cos(ep.blinkProgress));
            if (ep.blinkProgress >= Math.PI) {
              ep.blinkScale = 1;
              ep.state = "staring";
            }
          } else if (ep.state === "fadeOut") {
            ep.alpha -= 0.025;
            if (ep.alpha <= 0) {
              ep.alpha = 0;
              ep.state = "hidden";
              const nextPos = pickEyePosition(ep.zone);
              ep.x = nextPos.x;
              ep.y = nextPos.y;
              ep.timer = Math.floor(Math.random() * 120) + 40;
            }
          }

          if (ep.alpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = ep.alpha;

            // Intense outer menacing radial aura
            const glowGrad = ctx.createRadialGradient(
              ep.x,
              ep.y,
              3,
              ep.x,
              ep.y,
              ep.radiusX * 5
            );
            glowGrad.addColorStop(0, `${ep.glowColor}BB`);
            glowGrad.addColorStop(0.4, `${ep.glowColor}55`);
            glowGrad.addColorStop(1, "transparent");
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(ep.x, ep.y, ep.radiusX * 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw Left & Right Eyes
            [-ep.eyeDist / 2, ep.eyeDist / 2].forEach((offset) => {
              const eyeX = ep.x + offset;
              const eyeY = ep.y;
              const scaledRadiusY = Math.max(0.6, ep.radiusY * ep.blinkScale);

              // Eye Sclera with strong neon glow
              ctx.save();
              ctx.shadowColor = ep.glowColor;
              ctx.shadowBlur = 18;
              ctx.fillStyle = ep.color;
              ctx.beginPath();
              ctx.ellipse(eyeX, eyeY, ep.radiusX, scaledRadiusY, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Vertical Slit Predator Pupil
              if (ep.blinkScale > 0.25) {
                ctx.fillStyle = "#050102";
                ctx.beginPath();
                ctx.ellipse(
                  eyeX,
                  eyeY,
                  ep.radiusX * 0.24,
                  scaledRadiusY * 0.88,
                  0,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            });

            ctx.restore();
          }
        });

        // D. Bats flapping across
        bats.forEach((b) => {
          b.x += b.vx;
          b.y += b.vy;
          b.wingAngle += b.wingSpeed;

          if (b.vx > 0 && b.x > width + 40) {
            b.x = -40;
            b.y = Math.random() * (height * 0.6);
          } else if (b.vx < 0 && b.x < -40) {
            b.x = width + 40;
            b.y = Math.random() * (height * 0.6);
          }

          ctx.save();
          ctx.translate(b.x, b.y);
          if (b.vx < 0) ctx.scale(-1, 1);
          ctx.fillStyle = "rgba(22, 4, 8, 0.95)";
          const wingSpan = Math.sin(b.wingAngle) * b.size;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(b.size * 0.8, -wingSpan, b.size * 1.5, -wingSpan * 0.4);
          ctx.quadraticCurveTo(b.size * 0.9, 0, 0, b.size * 0.4);
          ctx.quadraticCurveTo(-b.size * 0.9, 0, -b.size * 1.5, -wingSpan * 0.4);
          ctx.quadraticCurveTo(-b.size * 0.8, -wingSpan, 0, 0);
          ctx.fill();
          ctx.restore();
        });

        // E. Floating Wisps / Fireflies
        fireflies.forEach((ff) => {
          ff.x += ff.vx;
          ff.y += ff.vy;
          ff.alpha += ff.alphaSpeed;
          if (ff.alpha > 1 || ff.alpha < 0.2) ff.alphaSpeed *= -1;

          ctx.save();
          ctx.fillStyle = `rgba(244, 63, 94, ${ff.alpha * 0.85})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#F43F5E";
          ctx.beginPath();
          ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // ----------------------------------------
      // 7. GRAND ARCANE LIBRARY & MAGIC CIRCLES (Fantasía)
      // ----------------------------------------
      else if (animationType === "magic_circles") {
        const cx = width * 0.5;
        const cy = height * 0.5;
        const stackW = width * 0.26;

        // A. Grand Library Twilight Interior Background
        const libBg = ctx.createLinearGradient(0, 0, 0, height);
        libBg.addColorStop(0, "rgba(10, 6, 20, 0.75)"); // deep nocturnal violet
        libBg.addColorStop(0.5, "rgba(23, 11, 38, 0.68)"); // arcane plum
        libBg.addColorStop(1.0, "rgba(12, 5, 24, 0.85)"); // dark stone floor
        ctx.fillStyle = libBg;
        ctx.fillRect(0, 0, width, height);

        // B. Far Background Gothic Cathedral Lancet Window (casting ethereal moonbeams)
        const winW = Math.min(180, width * 0.2);
        const winTopY = height * 0.05;
        const winBottomY = height * 0.48;
        const winH = winBottomY - winTopY;

        ctx.save();
        // Ethereal celestial moonbeam gradient cone
        const beamGrad = ctx.createRadialGradient(
          cx,
          winTopY + winH * 0.3,
          10,
          cx,
          winBottomY + height * 0.2,
          winW * 2.2
        );
        beamGrad.addColorStop(0, "rgba(192, 132, 252, 0.18)");
        beamGrad.addColorStop(0.4, "rgba(147, 51, 234, 0.08)");
        beamGrad.addColorStop(1, "transparent");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(cx - winW * 0.5, winTopY);
        ctx.lineTo(cx + winW * 0.5, winTopY);
        ctx.lineTo(cx + winW * 1.8, height);
        ctx.lineTo(cx - winW * 1.8, height);
        ctx.closePath();
        ctx.fill();

        // Window Lancet Arch Shape
        ctx.fillStyle = "rgba(40, 15, 60, 0.35)";
        ctx.strokeStyle = "#4C1D95";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - winW * 0.5, winBottomY);
        ctx.lineTo(cx - winW * 0.5, winTopY + winW * 0.7);
        // Pointed Gothic Arch
        ctx.quadraticCurveTo(cx - winW * 0.2, winTopY, cx, winTopY);
        ctx.quadraticCurveTo(cx + winW * 0.2, winTopY, cx + winW * 0.5, winTopY + winW * 0.7);
        ctx.lineTo(cx + winW * 0.5, winBottomY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Window Stone Mullions (Vertical and Tracery)
        ctx.strokeStyle = "rgba(76, 29, 149, 0.6)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, winTopY + 12);
        ctx.lineTo(cx, winBottomY);
        ctx.moveTo(cx - winW * 0.25, winTopY + winW * 0.5);
        ctx.lineTo(cx - winW * 0.25, winBottomY);
        ctx.moveTo(cx + winW * 0.25, winTopY + winW * 0.5);
        ctx.lineTo(cx + winW * 0.25, winBottomY);
        ctx.stroke();
        ctx.restore();

        // C. Towering Bookshelves on Left & Right Flanks
        const drawBookshelfStack = (
          startX: number,
          tiers: ShelfTier[],
          isLeftStack: boolean
        ) => {
          ctx.save();
          // Shelf Stack Mahogany Backing Panel
          const woodGrad = ctx.createLinearGradient(startX, 0, startX + stackW, 0);
          woodGrad.addColorStop(0, isLeftStack ? "#170A26" : "#24103A");
          woodGrad.addColorStop(0.5, "#1F0D33");
          woodGrad.addColorStop(1, isLeftStack ? "#24103A" : "#170A26");
          ctx.fillStyle = woodGrad;
          ctx.fillRect(startX, height * 0.08, stackW, height * 0.92);

          // Render Bookshelf Tiers & Books
          tiers.forEach((tier) => {
            const shelfLedgeY = tier.y + tier.height;

            // Books on this shelf
            let bookX = startX + (isLeftStack ? 12 : 24);
            tier.books.forEach((book) => {
              const bookTopY = shelfLedgeY - book.height;

              ctx.save();
              if (book.tilted) {
                ctx.translate(bookX, shelfLedgeY);
                ctx.rotate(book.tiltAngle * (isLeftStack ? 1 : -1));
                ctx.translate(-bookX, -shelfLedgeY);
              }

              // Book Spine Body
              ctx.fillStyle = book.color;
              ctx.beginPath();
              // Rounded top corners for bound leather volume
              const r = 2.5;
              ctx.moveTo(bookX + r, bookTopY);
              ctx.lineTo(bookX + book.width - r, bookTopY);
              ctx.quadraticCurveTo(bookX + book.width, bookTopY, bookX + book.width, bookTopY + r);
              ctx.lineTo(bookX + book.width, shelfLedgeY);
              ctx.lineTo(bookX, shelfLedgeY);
              ctx.lineTo(bookX, bookTopY + r);
              ctx.quadraticCurveTo(bookX, bookTopY, bookX + r, bookTopY);
              ctx.closePath();
              ctx.fill();

              // Leather spine highlight/shadow bevel
              ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
              ctx.fillRect(bookX, bookTopY, book.width * 0.28, book.height);
              ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
              ctx.fillRect(bookX + book.width * 0.75, bookTopY, book.width * 0.25, book.height);

              // Gold foil ribs on spine (3 horizontal gold bands)
              ctx.strokeStyle = book.ribColor;
              ctx.lineWidth = 1.0;
              [0.2, 0.5, 0.8].forEach((fraction) => {
                const ribY = bookTopY + book.height * fraction;
                ctx.beginPath();
                ctx.moveTo(bookX + 1.5, ribY);
                ctx.lineTo(bookX + book.width - 1.5, ribY);
                ctx.stroke();
              });

              // Gold title emblem impression
              if (book.titleGold) {
                ctx.fillStyle = "rgba(253, 224, 71, 0.75)";
                ctx.fillRect(
                  bookX + book.width * 0.35,
                  bookTopY + book.height * 0.32,
                  book.width * 0.3,
                  book.height * 0.12
                );
              }

              ctx.restore();
              bookX += book.width + (book.tilted ? 14 : 2);
            });

            // Heavy Wood Shelf Ledge Beam (Drop shadow + polished wood highlight)
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(startX, shelfLedgeY, stackW, 5); // cast shadow
            ctx.fillStyle = "#381855"; // polished mahogany ledge
            ctx.fillRect(startX, shelfLedgeY, stackW, 8);
            ctx.fillStyle = "rgba(253, 224, 71, 0.3)"; // golden bevel edge line
            ctx.fillRect(startX, shelfLedgeY, stackW, 1.2);
          });

          // Outer Vertical Pilaster Column (fluted architectural frame)
          const colX = isLeftStack ? startX + stackW - 14 : startX;
          ctx.fillStyle = "#2D1244";
          ctx.fillRect(colX, height * 0.06, 14, height * 0.94);
          ctx.fillStyle = "rgba(168, 85, 247, 0.35)";
          ctx.fillRect(colX + 2, height * 0.06, 2, height * 0.94);
          ctx.fillRect(colX + 9, height * 0.06, 2, height * 0.94);

          // Pilaster Capital & Base
          ctx.fillStyle = "#4C1D95";
          ctx.fillRect(colX - 4, height * 0.06, 22, 10);
          ctx.fillRect(colX - 4, height - 14, 22, 14);

          ctx.restore();
        };

        // Draw Left & Right Bookshelf Stacks
        drawBookshelfStack(0, shelfTiersLeft, true);
        drawBookshelfStack(width - stackW, shelfTiersRight, false);

        // D. Gothic Pointed Ceiling Arches linking left and right stacks
        ctx.strokeStyle = "rgba(76, 29, 149, 0.55)";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        // Left vault rib
        ctx.moveTo(stackW - 14, height * 0.06);
        ctx.quadraticCurveTo(width * 0.38, height * 0.01, cx, height * 0.05);
        // Right vault rib
        ctx.quadraticCurveTo(width * 0.62, height * 0.01, width - stackW + 14, height * 0.06);
        ctx.stroke();

        // E. Crystal Candle Sconces (flickering warm mystic amber/violet glow)
        const sconceTime = Date.now() * 0.003;
        librarySconces.forEach((sc) => {
          const flicker = Math.sin(sconceTime * 5 + sc.phase) * 0.15 + 0.85;

          ctx.save();
          // Warm radial candlelight aura
          const auraGrad = ctx.createRadialGradient(sc.x, sc.y, 2, sc.x, sc.y, 45);
          auraGrad.addColorStop(0, `rgba(253, 224, 71, ${0.45 * flicker})`);
          auraGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.2 * flicker})`);
          auraGrad.addColorStop(1, "transparent");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(sc.x, sc.y, 45, 0, Math.PI * 2);
          ctx.fill();

          // Brass wall bracket
          ctx.fillStyle = "#D97706";
          ctx.fillRect(sc.x - 3, sc.y + 6, 6, 8);
          // Candle stem
          ctx.fillStyle = "#FEF3C7";
          ctx.fillRect(sc.x - 2, sc.y - 4, 4, 10);
          // Candle flame
          ctx.fillStyle = "#F59E0B";
          ctx.beginPath();
          ctx.ellipse(sc.x, sc.y - 7, 2.5, 4 * flicker, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(sc.x, sc.y - 6, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // F. Concentric Magic Rune Rings (Rotating in center)
        magicRotation += 0.005;

        // Concentric Magic Rune Rings
        [90, 160, 240].forEach((r, idx) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(magicRotation * (idx % 2 === 0 ? 1 : -1));
          ctx.strokeStyle =
            idx % 2 === 0 ? "rgba(168, 85, 247, 0.3)" : "rgba(192, 132, 252, 0.22)";
          ctx.lineWidth = 1.8;
          ctx.setLineDash([8, 12]);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          const nodeCount = idx === 0 ? 6 : idx === 1 ? 8 : 12;
          for (let n = 0; n < nodeCount; n++) {
            const na = (n / nodeCount) * Math.PI * 2;
            const nx = Math.cos(na) * r;
            const ny = Math.sin(na) * r;
            ctx.fillStyle = "rgba(233, 213, 255, 0.6)";
            ctx.beginPath();
            ctx.arc(nx, ny, 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        // Orbiting rune particles
        magicParticles.forEach((mp) => {
          mp.angle += mp.speed;
          const px = cx + Math.cos(mp.angle) * mp.radius;
          const py = cy + Math.sin(mp.angle) * mp.radius;

          ctx.save();
          ctx.fillStyle = mp.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#A855F7";
          ctx.globalAlpha = mp.alpha * 0.85;
          ctx.beginPath();
          ctx.arc(px, py, mp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Floating ambient magic motes
        magicMotes.forEach((m) => {
          m.y += m.vy;
          m.x += m.vx;
          m.pulse += 0.04;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
          const alpha = (Math.sin(m.pulse) * 0.3 + 0.5) * m.alpha;
          ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Intermittent Glowing Arcane Glyphs (clearly visible, prominent)
        arcaneGlyphs.forEach((g) => {
          g.angle += g.rotSpeed;
          g.pulse += 0.03;

          if (g.state === "dormant") {
            g.timer--;
            if (g.timer <= 0) {
              g.state = "fadeIn";
              g.alpha = 0;
            }
          } else if (g.state === "fadeIn") {
            g.alpha += 0.02;
            if (g.alpha >= g.maxAlpha) {
              g.alpha = g.maxAlpha;
              g.state = "active";
              g.timer = Math.floor(Math.random() * 140) + 140;
            }
          } else if (g.state === "active") {
            g.timer--;
            if (g.timer <= 0) {
              g.state = "fadeOut";
            }
          } else if (g.state === "fadeOut") {
            g.alpha -= 0.015;
            if (g.alpha <= 0) {
              g.alpha = 0;
              g.state = "dormant";
              const nextPos = pickGlyphPosition(g.zone);
              g.x = nextPos.x;
              g.y = nextPos.y;
              g.timer = Math.floor(Math.random() * 120) + 40;
            }
          }

          if (g.alpha > 0.01) {
            const glowStrength = Math.sin(g.pulse) * 0.2 + 0.85;
            ctx.save();
            ctx.translate(g.x, g.y);
            ctx.rotate(g.angle);
            ctx.globalAlpha = g.alpha * glowStrength;
            ctx.strokeStyle = g.color;
            ctx.fillStyle = g.color;
            ctx.lineWidth = 2.0;
            ctx.shadowBlur = 18;
            ctx.shadowColor = g.color;

            const s = g.size;

            if (g.glyphType === 0) {
              // Arcane Triquetra / Triangular Sigil
              ctx.beginPath();
              ctx.moveTo(0, -s);
              ctx.lineTo(s * 0.86, s * 0.5);
              ctx.lineTo(-s * 0.86, s * 0.5);
              ctx.closePath();
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(0, 0, 3, 0, Math.PI * 2);
              ctx.fill();
            } else if (g.glyphType === 1) {
              // 5-Point Mystic Seal / Pentagram Ring
              ctx.beginPath();
              ctx.arc(0, 0, s, 0, Math.PI * 2);
              ctx.stroke();

              ctx.beginPath();
              for (let i = 0; i < 5; i++) {
                const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                const px = Math.cos(a) * (s * 0.9);
                const py = Math.sin(a) * (s * 0.9);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.stroke();
            } else if (g.glyphType === 2) {
              // Hermetic Solar/Lunar Sigil
              ctx.beginPath();
              ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(0, -s * 0.2, s * 0.8, 0.2 * Math.PI, 0.8 * Math.PI);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(0, -s);
              ctx.lineTo(0, s);
              ctx.moveTo(-s, 0);
              ctx.lineTo(s, 0);
              ctx.stroke();
            } else if (g.glyphType === 3) {
              // Runic Diamond
              ctx.beginPath();
              ctx.moveTo(0, -s);
              ctx.lineTo(s * 0.7, 0);
              ctx.lineTo(0, s);
              ctx.lineTo(-s * 0.7, 0);
              ctx.closePath();
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(0, -s * 0.5);
              ctx.lineTo(s * 0.35, 0);
              ctx.lineTo(0, s * 0.5);
              ctx.lineTo(-s * 0.35, 0);
              ctx.closePath();
              ctx.stroke();

              [
                [0, -s],
                [s * 0.7, 0],
                [0, s],
                [-s * 0.7, 0],
              ].forEach(([px, py]) => {
                ctx.beginPath();
                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                ctx.fill();
              });
            } else {
              // Eldritch Astrolabe Sigil
              ctx.beginPath();
              ctx.arc(0, 0, s * 0.85, 0, Math.PI * 2);
              ctx.stroke();

              ctx.setLineDash([4, 6]);
              ctx.beginPath();
              ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);

              const d = s * 0.9;
              ctx.beginPath();
              ctx.moveTo(-d * 0.7, -d * 0.7);
              ctx.lineTo(d * 0.7, d * 0.7);
              ctx.moveTo(d * 0.7, -d * 0.7);
              ctx.lineTo(-d * 0.7, d * 0.7);
              ctx.stroke();
            }

            ctx.restore();
          }
        });
      }

      // ----------------------------------------
      // 8. RAIN & NOIR CITY (Drama)
      // ----------------------------------------
      else if (animationType === "rain_city") {
        // A. Distant Skyline with blinking antenna beacons
        ctx.fillStyle = "rgba(20, 28, 48, 0.85)";
        cityBuildingsBack.forEach((b) => {
          ctx.fillRect(b.x, height - b.h, b.w, b.h);
          if (b.hasAntenna) {
            ctx.strokeStyle = "rgba(71, 85, 105, 0.9)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(b.x + b.w / 2, height - b.h);
            ctx.lineTo(b.x + b.w / 2, height - b.h - b.antennaHeight);
            ctx.stroke();

            const beaconAlpha = Math.sin(Date.now() * 0.003 + b.x) > 0.1 ? 0.95 : 0.15;
            ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2, height - b.h - b.antennaHeight, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(20, 28, 48, 0.85)";
          }
        });

        // B. Near Noir City Skyline with lit windows
        ctx.fillStyle = "rgba(10, 14, 22, 0.96)";
        cityBuildingsFront.forEach((b) => {
          ctx.fillRect(b.x, height - b.h, b.w, b.h);

          // Roof edge cornice
          ctx.fillStyle = "rgba(51, 65, 85, 0.7)";
          ctx.fillRect(b.x - 2, height - b.h, b.w + 4, 3);
          ctx.fillStyle = "rgba(10, 14, 22, 0.96)";

          // Water tank
          if (b.hasWaterTower) {
            ctx.fillStyle = "rgba(20, 28, 48, 0.95)";
            ctx.fillRect(b.x + 14, height - b.h - 20, 18, 16);
            ctx.strokeStyle = "rgba(71, 85, 105, 0.85)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(b.x + 16, height - b.h);
            ctx.lineTo(b.x + 16, height - b.h - 4);
            ctx.moveTo(b.x + 30, height - b.h);
            ctx.lineTo(b.x + 30, height - b.h - 4);
            ctx.stroke();
            ctx.fillStyle = "rgba(10, 14, 22, 0.96)";
          }

          // Lit windows
          b.windows.forEach((win, wIdx) => {
            const row = Math.floor(wIdx / 4);
            const col = wIdx % 4;
            const wx = b.x + 12 + col * 16;
            const wy = height - b.h + 14 + row * 18;
            if (wx < b.x + b.w - 12 && wy < height - 12) {
              ctx.fillStyle = win.col
                ? `rgba(226, 232, 240, ${win.alpha})`
                : "rgba(15, 23, 42, 0.7)";
              ctx.fillRect(wx, wy, 5, 7);
            }
          });
          ctx.fillStyle = "rgba(10, 14, 22, 0.96)";
        });

        // Bottom Street Mist
        const mistGrad = ctx.createLinearGradient(0, height - 110, 0, height);
        mistGrad.addColorStop(0, "transparent");
        mistGrad.addColorStop(1, "rgba(4, 5, 8, 0.95)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, height - 110, width, 110);

        // C. Dynamic Slanted Raindrops
        ctx.lineCap = "round";
        raindrops.forEach((r) => {
          r.x += r.speedX;
          r.y += r.speedY;

          ctx.strokeStyle = `rgba(241, 245, 249, ${r.alpha})`;
          ctx.lineWidth = r.thickness;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x + r.speedX * 1.8, r.y + r.length);
          ctx.stroke();

          // Spawn splash on ground
          if (r.y > height - Math.random() * 50) {
            if (splashes.length < 45 && Math.random() > 0.35) {
              splashes.push({
                x: r.x,
                y: height - Math.random() * 30,
                radius: 2,
                maxRadius: Math.random() * 10 + 6,
                alpha: 0.65,
                decay: Math.random() * 0.04 + 0.03,
              });
            }
            r.y = -30;
            r.x = Math.random() * (width + 250) - 50;
          }
          if (r.x < -60) r.x = width + 60;
        });

        // D. Expanding Water Ripples
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.radius += 0.7;
          s.alpha -= s.decay;

          if (s.alpha <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(226, 232, 240, ${s.alpha * 0.75})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 2, s.radius * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ----------------------------------------
      // 9. STADIUM FLASHES & CONFETTI (Deportes)
      // ----------------------------------------
      else if (animationType === "stadium_flashes") {
        // A. Stadium Floodlight Beams
        const leftBeam = ctx.createRadialGradient(
          width * 0.06,
          height * 0.08,
          5,
          width * 0.45,
          height * 0.75,
          width * 0.7
        );
        leftBeam.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        leftBeam.addColorStop(0.2, "rgba(249, 115, 22, 0.08)");
        leftBeam.addColorStop(1, "transparent");
        ctx.fillStyle = leftBeam;
        ctx.beginPath();
        ctx.moveTo(width * 0.06, height * 0.08);
        ctx.lineTo(width * 0.75, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        const rightBeam = ctx.createRadialGradient(
          width * 0.94,
          height * 0.08,
          5,
          width * 0.55,
          height * 0.75,
          width * 0.7
        );
        rightBeam.addColorStop(0, "rgba(255, 255, 255, 0.12)");
        rightBeam.addColorStop(0.2, "rgba(249, 115, 22, 0.08)");
        rightBeam.addColorStop(1, "transparent");
        ctx.fillStyle = rightBeam;
        ctx.beginPath();
        ctx.moveTo(width * 0.94, height * 0.08);
        ctx.lineTo(width, height);
        ctx.lineTo(width * 0.25, height);
        ctx.closePath();
        ctx.fill();

        // Floodlight Pylons
        [width * 0.06, width * 0.94].forEach((px) => {
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#F97316";
          ctx.beginPath();
          ctx.arc(px, height * 0.08, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px, height * 0.08);
          ctx.lineTo(px, height * 0.24);
          ctx.stroke();
        });

        // B. Tiered Grandstand Silhouette
        ctx.fillStyle = "rgba(24, 10, 3, 0.9)";
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.quadraticCurveTo(width * 0.5, height * 0.7, width, height * 0.6);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        [0.66, 0.74, 0.82, 0.9].forEach((ratio) => {
          ctx.strokeStyle = "rgba(249, 115, 22, 0.18)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(0, height * ratio);
          ctx.quadraticCurveTo(width * 0.5, height * (ratio + 0.06), width, height * ratio);
          ctx.stroke();
        });

        // C. Camera Flashes (Subtle, soft background stadium flashes)
        if (Math.random() > 0.40 && cameraFlashes.length < 14) {
          const spawnCount = 1;
          for (let sc = 0; sc < spawnCount; sc++) {
            cameraFlashes.push({
              x: Math.random() * (width * 0.92) + width * 0.04,
              y: height * 0.44 + Math.random() * (height * 0.52),
              life: 0,
              maxLife: Math.floor(Math.random() * 6) + 10,
              size: Math.random() * 2 + 3,
              spikeLength: Math.random() * 12 + 8,
              intensity: Math.random() * 0.2 + 0.5,
              color: Math.random() > 0.25 ? "#FFFFFF" : "#FED7AA",
            });
          }
        }

        // Render Flashes
        for (let i = cameraFlashes.length - 1; i >= 0; i--) {
          const f = cameraFlashes[i];
          f.life++;

          const progress = f.life / f.maxLife;
          const flashAlpha = (1 - progress) * f.intensity;

          if (f.life >= f.maxLife) {
            cameraFlashes.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = flashAlpha;

          // Radial flash burst halo
          const haloGrad = ctx.createRadialGradient(
            f.x,
            f.y,
            2,
            f.x,
            f.y,
            f.spikeLength * 1.5
          );
          haloGrad.addColorStop(0, "rgba(255, 255, 255, 0.55)");
          haloGrad.addColorStop(0.3, "rgba(249, 115, 22, 0.35)");
          haloGrad.addColorStop(1, "transparent");
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.spikeLength * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // 4-point starburst cross rays
          ctx.strokeStyle = f.color;
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#F97316";
          ctx.beginPath();
          ctx.moveTo(f.x - f.spikeLength, f.y);
          ctx.lineTo(f.x + f.spikeLength, f.y);
          ctx.moveTo(f.x, f.y - f.spikeLength);
          ctx.lineTo(f.x, f.y + f.spikeLength);
          ctx.stroke();

          // 4-point diagonal rays
          const diag = f.spikeLength * 0.5;
          ctx.beginPath();
          ctx.moveTo(f.x - diag, f.y - diag);
          ctx.lineTo(f.x + diag, f.y + diag);
          ctx.moveTo(f.x + diag, f.y - diag);
          ctx.lineTo(f.x - diag, f.y + diag);
          ctx.stroke();

          // Bright center point
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // D. Celebratory Stadium Confetti
        stadiumConfetti.forEach((c) => {
          c.y += c.vy;
          c.sway += c.swaySpeed;
          c.x += c.vx + Math.sin(c.sway) * 1.0;
          c.rotation += c.rotSpeed;
          c.tumble += c.tumbleSpeed;

          if (c.y > height + 20) {
            c.y = -20;
            c.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);
          ctx.scale(Math.cos(c.tumble), 1);
          ctx.fillStyle = c.color;
          ctx.shadowBlur = 5;
          ctx.shadowColor = c.color;
          ctx.beginPath();
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          ctx.restore();
        });
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [animationType, themeId, fireworksSpeed]);

  if (animationType === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      style={{ opacity }}
    />
  );
}
