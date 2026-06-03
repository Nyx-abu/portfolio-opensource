"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface PhysicsStringsProps {
  className?: string;
  stringCount?: number;
  color?: string;
}

export function PhysicsStrings({ 
  className, 
  stringCount = 40, // Increased density
  color = "rgba(56, 189, 248, 0.3)" 
}: PhysicsStringsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Wilder Physics parameters
    const stiffness = 0.08; // Faster snap back
    const damping = 0.65; // More bouncy, less viscous when released
    const LATCH_DISTANCE = 60; // Distance to grab the string
    const MAX_STRETCH = 150; // How far before it snaps and breaks

    // State
    let mouseX = -1000;
    let mouseY = -1000;
    let width = svg.clientWidth;
    let height = svg.clientHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseleave", handleMouseLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        initStrings();
      }
    });
    resizeObserver.observe(svg);

    let strings: {
      path: SVGPathElement;
      y: number; 
      controlX: number; 
      controlY: number; 
      velocityX: number;
      velocityY: number;
      isLatched: boolean;
    }[] = [];

    const initStrings = () => {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      strings = [];

      const spacing = height / (stringCount + 1);

      for (let i = 1; i <= stringCount; i++) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("fill", "none");
        
        svg.appendChild(path);

        strings.push({
          path,
          y: i * spacing,
          controlX: width / 2, 
          controlY: i * spacing,
          velocityX: 0,
          velocityY: 0,
          isLatched: false,
        });
      }
    };

    initStrings();

    let animationFrame: number;
    
    const render = () => {
      strings.forEach((str) => {
        const distanceFromMouse = Math.sqrt((mouseX - str.controlX) ** 2 + (mouseY - str.controlY) ** 2);
        
        let targetX = width / 2;
        let targetY = str.y;
        
        let currentStiffness = stiffness;
        let currentDamping = damping;

        // Pluck logic
        if (!str.isLatched && distanceFromMouse < LATCH_DISTANCE && mouseX > 0 && mouseY > 0) {
          str.isLatched = true;
        }

        if (str.isLatched) {
          targetX = mouseX;
          targetY = mouseY;
          // When latched, the string tightly tracks the mouse
          currentStiffness = 0.5;
          currentDamping = 0.5;

          const stretchDistance = Math.abs(mouseY - str.y);
          if (stretchDistance > MAX_STRETCH || mouseX < 0 || mouseY < 0) {
            str.isLatched = false; // Snap!
          }
        }

        // Apply springs
        const accelX = (targetX - str.controlX) * currentStiffness;
        str.velocityX += accelX;
        str.velocityX *= currentDamping;
        str.controlX += str.velocityX;

        const accelY = (targetY - str.controlY) * currentStiffness;
        str.velocityY += accelY;
        str.velocityY *= currentDamping;
        str.controlY += str.velocityY;

        // Visual Reactivity: Velocity & Tension
        const velocityMag = Math.sqrt(str.velocityX ** 2 + str.velocityY ** 2);
        
        if (str.isLatched) {
          // Glows hotter (cyan to white) as it stretches
          const stretchPct = Math.min(Math.abs(mouseY - str.y) / MAX_STRETCH, 1);
          const r = Math.floor(56 + (255 - 56) * stretchPct);
          const g = Math.floor(189 + (255 - 189) * stretchPct);
          const b = Math.floor(248 + (255 - 248) * stretchPct);
          str.path.setAttribute("stroke", `rgba(${r}, ${g}, ${b}, ${0.5 + stretchPct * 0.5})`);
          str.path.setAttribute("stroke-width", (1.5 + stretchPct * 3).toString());
        } else if (velocityMag > 5) {
          // Violent snapping glow
          const intensity = Math.min(velocityMag / 25, 1);
          str.path.setAttribute("stroke", `rgba(255, 255, 255, ${0.3 + intensity * 0.7})`);
          str.path.setAttribute("stroke-width", (1.5 + intensity * 4).toString());
        } else {
          // Rest state
          str.path.setAttribute("stroke", color);
          str.path.setAttribute("stroke-width", "1.5");
        }

        // Draw path
        const d = `M 0 ${str.y} Q ${str.controlX} ${str.controlY} ${width} ${str.y}`;
        str.path.setAttribute("d", d);
      });
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [stringCount, color]);

  return (
    <div className={cn("relative w-full h-full min-h-[300px]", className)}>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
