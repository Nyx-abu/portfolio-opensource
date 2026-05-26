"use client";

import { motion } from "framer-motion";
import { memo, useMemo, useState, useEffect } from "react";

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const ProjectsGraphic = memo(function ProjectsGraphic({ projectCount = 5, techStackCount = 15 }: { projectCount?: number, techStackCount?: number }) {
  const projectNodes = useMemo(() => {
    const count = Math.max(1, projectCount);
    return Array.from({ length: count }).map((_, i) => {
      const progress = (i + 1) / (count + 1); 
      
      const t = progress;
      const P0 = { x: 100, y: 900 };
      const P1 = { x: 800, y: 900 };
      const P2 = { x: 1300, y: 100 };
      
      const nodeX = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
      const nodeY = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;
      
      return { id: i, x: nodeX, y: nodeY, label: `STAGE 0${i + 1}` };
    });
  }, [projectCount]);

  const techNodes = useMemo(() => {
    if (projectNodes.length === 0) return [];
    return Array.from({ length: techStackCount }).map((_, i) => {
      const parentIndex = Math.floor(pseudoRandom(i * 20) * projectNodes.length);
      const parent = projectNodes[parentIndex];
      const angle = pseudoRandom(i * 20 + 1) * Math.PI * 2;
      const dist = 30 + pseudoRandom(i * 20 + 2) * 80; 
      const x = parent.x + Math.cos(angle) * dist;
      const y = parent.y + Math.sin(angle) * dist;
      return { id: i, x, y, parentX: parent.x, parentY: parent.y };
    });
  }, [techStackCount, projectNodes]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.08),_transparent_60%)]" />

      {/* SVG Canvas for Trajectory HUD */}
      <svg className="absolute w-full h-[120vh] min-h-[1000px] left-1/2 -translate-x-1/2 top-0" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* HUD Altitude/Atmosphere Lines */}
        <g stroke="#ffffff" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 8" className="font-mono text-[10px] fill-white">
          <line x1="0" y1="800" x2="1440" y2="800" />
          <text x="50" y="795" opacity="0.5">ALT: 10 KM - TROPOSPHERE</text>
          
          <line x1="0" y1="500" x2="1440" y2="500" />
          <text x="50" y="495" opacity="0.5">ALT: 50 KM - STRATOSPHERE</text>
          
          <line x1="0" y1="200" x2="1440" y2="200" />
          <text x="50" y="195" opacity="0.5">ALT: 100 KM - KARMAN LINE</text>
        </g>

        {/* Main Ascent Trajectory Curve */}
        <path 
           d="M 100 900 Q 800 900 1300 100" 
           stroke="#0ea5e9" 
           strokeWidth="1.5" 
           opacity="0.3"
           fill="none" 
        />
        {/* Animated thrust stream following the path */}
        <motion.path 
           d="M 100 900 Q 800 900 1300 100" 
           stroke="#7dd3fc" 
           strokeWidth="3" 
           fill="none" 
           strokeDasharray="200 2000"
           animate={{ strokeDashoffset: [2200, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           filter="url(#hud-glow)"
        />

        {/* Project Mission Stages (Nodes on trajectory) */}
        {projectNodes.map((node) => (
          <g key={`stage-${node.id}`}>
            {/* Crosshairs */}
            <line x1={node.x - 20} y1={node.y} x2={node.x + 20} y2={node.y} stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            <line x1={node.x} y1={node.y - 20} x2={node.x} y2={node.y + 20} stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
            
            {/* Core Node */}
            <circle cx={node.x} cy={node.y} r="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" filter="url(#hud-glow)" />
            <circle cx={node.x} cy={node.y} r="2" fill="#fff" />
            
            {/* HUD Text readout */}
            <text x={node.x + 15} y={node.y - 15} fill="#7dd3fc" fontSize="12" fontFamily="monospace" letterSpacing="0.1em" opacity="0.8">
              {node.label}
            </text>
            <text x={node.x + 15} y={node.y} fill="#ffffff" fontSize="10" fontFamily="monospace" opacity="0.4">
              VEL: {Math.floor(pseudoRandom(node.id * 5) * 10000 + 5000)} M/S
            </text>
          </g>
        ))}

        {/* Telemetry Links (Tech stacks) */}
        <g stroke="#38bdf8" strokeWidth="0.5" opacity="0.2">
          {techNodes.map((node) => (
            <line key={`tele-link-${node.id}`} x1={node.parentX} y1={node.parentY} x2={node.x} y2={node.y} strokeDasharray="2 2" />
          ))}
        </g>

        {/* Telemetry Nodes (Tech stacks) */}
        {techNodes.map((node) => (
          <g key={`tele-node-${node.id}`}>
            <circle cx={node.x} cy={node.y} r="2.5" fill="#bae6fd" opacity="0.6" />
            {/* Micro readouts for tech stacks */}
            <text x={node.x + 5} y={node.y + 3} fill="#bae6fd" fontSize="8" fontFamily="monospace" opacity="0.3">
              {(pseudoRandom(node.id) * 100).toFixed(2)}
            </text>
          </g>
        ))}

        {/* Telemetry Radar Ping */}
        <motion.g
          animate={{ scale: [0.5, 3], opacity: [0.3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
          style={{ originX: "100px", originY: "900px" }}
        >
          <circle cx="100" cy="900" r="300" fill="none" stroke="#0ea5e9" strokeWidth="1" />
          <circle cx="100" cy="900" r="150" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
        </motion.g>

      </svg>
    </div>
  );
});
