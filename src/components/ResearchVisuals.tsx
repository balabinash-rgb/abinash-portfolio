import React from 'react';

export const TriaxialSchematic = () => (
  <svg viewBox="0 0 200 240" className="w-full h-full opacity-60">
    <rect x="50" y="40" width="100" height="150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="50" y1="40" x2="150" y2="40" stroke="currentColor" strokeWidth="3" />
    <line x1="50" y1="190" x2="150" y2="190" stroke="currentColor" strokeWidth="3" />
    
    <rect x="75" y="70" width="50" height="90" fill="white" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" />
    
    <path d="M100 10 L100 35" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    <path d="M100 220 L100 195" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    
    <path d="M20 115 L45 115" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
    <path d="M180 115 L155 115" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />

    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);

export const MicroCTVisual = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 4" className="animate-[spin_20s_linear_infinite]" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    
    {[...Array(24)].map((_, i) => (
      <rect 
        key={i} 
        x={100 + Math.cos(i * 15 * Math.PI / 180) * 50 - 2} 
        y={100 + Math.sin(i * 15 * Math.PI / 180) * 50 - 2} 
        width="4" 
        height="4" 
        fill="currentColor" 
        opacity={Math.random() * 0.5 + 0.2}
      />
    ))}
    
    <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
      <animate attributeName="y1" values="20;180;20" dur="5s" repeatCount="indefinite" />
      <animate attributeName="y2" values="20;180;20" dur="5s" repeatCount="indefinite" />
    </line>
  </svg>
);

export const NanoporeSchematic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <path 
      d="M30 30 C 50 120, 150 20, 170 170" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="10" 
      strokeLinecap="round" 
      opacity="0.2"
    />
    <path 
      d="M30 30 C 50 120, 150 20, 170 170" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="5 5"
    />
    
    {[...Array(8)].map((_, i) => (
      <circle key={i} r="3" fill="currentColor">
        <animateMotion 
          dur={`${3 + Math.random() * 3}s`} 
          repeatCount="indefinite" 
          path="M30 30 C 50 120, 150 20, 170 170" 
          keyPoints={`${Math.random()};${1}`}
          keyTimes="0;1"
        />
      </circle>
    ))}
  </svg>
);

export const FlowSchematic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <rect x="20" y="80" width="160" height="40" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="80" y="80" width="40" height="40" fill="currentColor" opacity="0.2" />
    
    {[...Array(5)].map((_, i) => (
      <line 
        key={i}
        x1="30" 
        y1={85 + i * 7} 
        x2="70" 
        y2={85 + i * 7} 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <animate attributeName="x1" values="30;40;30" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
        <animate attributeName="x2" values="70;80;70" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
      </line>
    ))}
    
    <path d="M40 60 L60 60" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrow)" />
    <text x="50" y="50" textAnchor="middle" className="text-[10px] fill-current uppercase font-mono">Flow</text>
    
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);

export const CarbonSchematic = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <path d="M0 120 Q 100 100 200 120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M0 150 Q 100 130 200 150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    
    <line x1="100" y1="20" x2="100" y2="135" stroke="currentColor" strokeWidth="3" />
    
    <circle cx="100" cy="135" r="30" fill="currentColor" opacity="0.1">
      <animate attributeName="r" values="20;40;20" dur="4s" repeatCount="indefinite" />
    </circle>
    
    {[...Array(10)].map((_, i) => (
      <circle key={i} r="1.5" fill="currentColor">
        <animate attributeName="cx" values="100;80;120;100" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values="135;125;145;135" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
      </circle>
    ))}
  </svg>
);

export const PetrophysicsVisual = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
    
    <circle cx="70" cy="70" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="130" cy="130" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
    
    <path d="M70 70 L130 130" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2">
      <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
    </path>
    
    <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.05" />
    
    {[...Array(30)].map((_, i) => (
      <circle 
        key={i} 
        cx={50 + Math.random() * 100} 
        cy={50 + Math.random() * 100} 
        r="1" 
        fill="currentColor" 
        opacity={Math.random() * 0.5} 
      />
    ))}
  </svg>
);
