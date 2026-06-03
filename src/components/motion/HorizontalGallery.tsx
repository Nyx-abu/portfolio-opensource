"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HorizontalGallery({ images, title }: { images: string[], title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate total width based on number of images
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${100 - (100 / images.length)}%`]);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${images.length * 75}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-ink-950">
        <motion.div style={{ x }} className="flex gap-8 px-[10vw]">
          {images.map((img, i) => (
            <div key={i} className="relative h-[60vh] w-[80vw] max-w-[1200px] shrink-0 overflow-hidden rounded-2xl md:h-[75vh] md:w-[70vw]">
              <div className="absolute inset-0 bg-ink-900 animate-pulse" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img} 
                alt={`${title} Gallery Image ${i + 1}`} 
                className="absolute inset-0 h-full w-full object-cover rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-ink-800"
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
                  {i + 1} / {images.length}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
