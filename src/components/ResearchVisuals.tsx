import React from 'react';
import { motion } from 'motion/react';

export const TriaxialSchematic = () => (
  <svg viewBox="0 0 200 240" className="w-full h-full opacity-60">
    <defs>
      <linearGradient id="sampleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
      </linearGradient>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
      </marker>
    </defs>
    
    <motion.rect 
      x="50" y="40" width="100" height="150" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    
    <line x1="50" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="3" />
    <line x1="50" y1="190" x2="150" y2="190" stroke="currentColor" strokeWidth="3" />
    
    <motion.rect 
      x="75" y="70" width="50" height="90" 
      fill="url(#sampleGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
      animate={{ scaleY: [1, 1.02, 1], y: [0, -1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Axial Load Arrows */}
    <motion.path 
      d="M100 10 L100 35" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path 
      d="M100 220 L100 195" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Confining Pressure Arrows */}
    <motion.path 
      d="M15 115 L40 115" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
    <motion.path 
      d="M185 115 L160 115" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"
      animate={{ x: [0, -5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
  </svg>
);

export const MicroCTVisual = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <radialGradient id="scanGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" className="animate-[spin_30s_linear_infinite]" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    
    <motion.circle 
      cx="100" cy="100" r="40" 
      fill="url(#scanGradient)"
      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />

    {[...Array(32)].map((_, i) => (
      <motion.rect 
        key={i} 
        x={100 + Math.cos(i * 11.25 * Math.PI / 180) * 55 - 1.5} 
        y={100 + Math.sin(i * 11.25 * Math.PI / 180) * 55 - 1.5} 
        width="3" 
        height="3" 
        rx="1"
        fill="currentColor" 
        animate={{ 
          opacity: [0.1, 0.6, 0.1],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2 + Math.random() * 3, 
          repeat: Infinity, 
          delay: Math.random() * 2 
        }}
      />
    ))}
    
    <motion.line 
      x1="20" y1="100" x2="180" y2="100" 
      stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"
      animate={{ y1: [40, 160, 40], y2: [40, 160, 40] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

export const NanoporeSchematic = () => {
  const path = "M30 30 C 50 120, 150 20, 170 170";
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <path 
        d={path}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="round" 
        opacity="0.1"
      />
      <path 
        d={path}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        opacity="0.5"
      />
      
      {[...Array(12)].map((_, i) => (
        <motion.circle 
          key={i} 
          r="2.5" 
          fill="currentColor" 
          filter="url(#glow)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ 
            duration: 3 + Math.random() * 4, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 4
          }}
          style={{ offsetPath: `path("${path}")` }}
        />
      ))}
    </svg>
  );
};

export const FlowSchematic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <marker id="arrowFlow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
      </marker>
    </defs>
    
    <rect x="25" y="80" width="150" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
    <rect x="75" y="80" width="50" height="40" fill="currentColor" opacity="0.1" />
    
    {[...Array(6)].map((_, i) => (
      <motion.line 
        key={i}
        x1="35" 
        y1={86 + i * 6} 
        x2="65" 
        y2={86 + i * 6} 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ x1: [35, 145], x2: [65, 175], opacity: [0, 1, 0] }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "linear",
          delay: i * 0.4
        }}
      />
    ))}
    
    <text x="100" y="65" textAnchor="middle" className="text-[9px] fill-current uppercase font-bold tracking-[0.2em] opacity-40">Dynamic Flow</text>
  </svg>
);

export const CarbonSchematic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <path d="M10 130 Q 100 110 190 130" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
    <path d="M10 160 Q 100 140 190 160" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    
    <motion.line 
      x1="100" y1="20" x2="100" y2="135" 
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      animate={{ strokeDasharray: ["0 200", "200 0"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
    />
    
    <motion.circle 
      cx="100" cy="135" r="30" 
      fill="currentColor" 
      animate={{ opacity: [0.05, 0.15, 0.05], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    
    {[...Array(15)].map((_, i) => (
      <motion.circle 
        key={i} r="2" fill="currentColor"
        animate={{ 
          cx: [100, 100 + (Math.random() - 0.5) * 80],
          cy: [135, 135 + (Math.random() - 0.5) * 80],
          opacity: [0, 0.8, 0],
          scale: [1, 0.5, 0]
        }}
        transition={{ 
          duration: 3 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeOut",
          delay: Math.random() * 3
        }}
      />
    ))}
  </svg>
);

export const PetrophysicsVisual = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <rect x="40" y="40" width="120" height="120" rx="8" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" opacity="0.3" />
    
    <motion.circle 
      cx="70" cy="70" r="18" 
      fill="none" stroke="currentColor" strokeWidth="1.5"
      animate={{ r: [18, 20, 18], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.circle 
      cx="130" cy="130" r="22" 
      fill="none" stroke="currentColor" strokeWidth="1.5"
      animate={{ r: [22, 25, 22], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
    />
    
    <motion.path 
      d="M70 70 L130 130" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="6 6"
      animate={{ strokeDashoffset: [0, -24] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    
    <motion.circle 
      cx="100" cy="100" r="45" 
      fill="currentColor" 
      animate={{ opacity: [0.02, 0.08, 0.02] }}
      transition={{ duration: 6, repeat: Infinity }}
    />
    
    {[...Array(40)].map((_, i) => (
      <motion.circle 
        key={i} 
        cx={50 + Math.random() * 100} 
        cy={50 + Math.random() * 100} 
        r="1.2" 
        fill="currentColor" 
        animate={{ 
          opacity: [0.1, 0.4, 0.1],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2 + Math.random() * 3, 
          repeat: Infinity,
          delay: Math.random() * 5
        }}
      />
    ))}
  </svg>
);
