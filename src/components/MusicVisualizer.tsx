"use client";

import { useState, useEffect, useRef } from "react";

interface MusicVisualizerProps {
  isPlaying?: boolean;
  className?: string;
}

export default function MusicVisualizer({ isPlaying = false, className = "" }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bars, setBars] = useState<Array<{ height: number; targetHeight: number; color: string }>>([]);

  // Initialize bars
  useEffect(() => {
    const newBars = Array.from({ length: 32 }, (_, i) => ({
      height: Math.random() * 20 + 10,
      targetHeight: Math.random() * 20 + 10,
      color: `hsl(${45 + Math.random() * 15}, 70%, ${50 + Math.random() * 20}%)` // Gold variations
    }));
    setBars(newBars);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update bars
      setBars(prevBars => 
        prevBars.map(bar => {
          let newTargetHeight = bar.targetHeight;
          
          if (isPlaying) {
            // Randomly change target height when playing
            if (Math.random() < 0.1) {
              newTargetHeight = Math.random() * 80 + 20;
            }
          } else {
            // Gradually return to base height when not playing
            newTargetHeight = Math.max(10, bar.targetHeight * 0.95);
          }

          // Smooth height transition
          const newHeight = bar.height + (newTargetHeight - bar.height) * 0.1;

          return {
            height: newHeight,
            targetHeight: newTargetHeight,
            color: bar.color
          };
        })
      );

      // Draw bars
      const barWidth = canvas.width / bars.length;
      bars.forEach((bar, index) => {
        const x = index * barWidth;
        const y = canvas.height - bar.height;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, bar.color);
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0.3)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, bar.height);

        // Add glow effect for taller bars
        if (bar.height > 50) {
          ctx.shadowColor = bar.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(x + 1, y, barWidth - 2, bar.height);
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, bars]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-full"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <p className="text-fantasy-gold text-sm">Click play to visualize</p>
        </div>
      )}
    </div>
  );
}