import React from 'react';

interface NeceraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark-only' | 'stacked';
  showSubtext?: boolean;
  subtext?: string;
  className?: string;
  glow?: boolean;
}

export const NeceraLogo: React.FC<NeceraLogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtext = true,
  subtext = 'AI Learning Ecosystem',
  className = '',
  glow = true,
}) => {
  // Size dimensions for the SVG icon
  const iconDimensions = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Typography scaling
  const textSizes = {
    xs: 'text-sm font-bold tracking-wider',
    sm: 'text-base font-extrabold tracking-wider',
    md: 'text-lg font-black tracking-wider',
    lg: 'text-2xl font-black tracking-widest',
    xl: 'text-4xl font-black tracking-widest',
  };

  const subtextSizes = {
    xs: 'text-[9px] tracking-widest',
    sm: 'text-[10px] tracking-wider',
    md: 'text-xs tracking-wider',
    lg: 'text-sm tracking-widest',
    xl: 'text-base tracking-widest',
  };

  const svgSize = {
    xs: 24,
    sm: 32,
    md: 36,
    lg: 48,
    xl: 64,
  }[size];

  // The distinctive NECERA Architectural Emblem:
  // An interlocking quantum neural prism with faceted facets forming an architectural 'N'
  // surrounded by subtle circuit tracks and glowing connection pins.
  const LogoMark = (
    <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions[size]}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-indigo-600/40 via-cyan-500/30 to-emerald-500/20 blur-md transition-all duration-300 group-hover:blur-lg"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_2px_8px_rgba(79,70,229,0.35)]"
        aria-hidden="true"
      >
        <defs>
          {/* Main Primary Gradient: Deep Indigo to Luminous Azure */}
          <linearGradient id="necera_grad_primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Accent Neon Gradient: Emerald to Cyan */}
          <linearGradient id="necera_grad_accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Facet Light Gradient */}
          <linearGradient id="necera_grad_facet" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#312E81" stopOpacity="0.4" />
          </linearGradient>

          {/* Core Core Glow */}
          <radialGradient id="necera_core_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Isometric Hexagonal Shield Frame */}
        <polygon
          points="50,6 88,26 88,74 50,94 12,74 12,26"
          fill="#0B0F19"
          stroke="url(#necera_grad_primary)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ambient Subtle Geometric Inner Guides */}
        <polygon
          points="50,14 80,31 80,69 50,86 20,69 20,31"
          fill="url(#necera_grad_facet)"
          fillOpacity="0.25"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Stylized Architectural 'N' Monogram Facets */}
        {/* Left Column of 'N' */}
        <path
          d="M26 30 L38 23 L38 77 L26 70 Z"
          fill="url(#necera_grad_primary)"
          filter="drop-shadow(0 0 3px rgba(99,102,241,0.5))"
        />

        {/* Diagonal Crossbar of 'N' */}
        <path
          d="M38 23 L44 26 L64 77 L58 74 Z"
          fill="url(#necera_grad_accent)"
          filter="drop-shadow(0 0 4px rgba(6,182,212,0.6))"
        />

        {/* Right Column of 'N' */}
        <path
          d="M62 23 L74 30 L74 70 L62 77 Z"
          fill="url(#necera_grad_primary)"
          filter="drop-shadow(0 0 3px rgba(99,102,241,0.5))"
        />

        {/* Circuit Interconnects & Neural Node Points */}
        {/* Top Node */}
        <circle cx="50" cy="6" r="3.5" fill="#38BDF8" />
        <circle cx="50" cy="6" r="1.5" fill="#FFFFFF" />

        {/* Bottom Core Node */}
        <circle cx="50" cy="94" r="3.5" fill="#10B981" />
        <circle cx="50" cy="94" r="1.5" fill="#FFFFFF" />

        {/* Lateral Anchor Nodes */}
        <circle cx="12" cy="26" r="2.5" fill="#6366F1" />
        <circle cx="88" cy="26" r="2.5" fill="#06B6D4" />
        <circle cx="12" cy="74" r="2.5" fill="#6366F1" />
        <circle cx="88" cy="74" r="2.5" fill="#10B981" />

        {/* Central Core AI Spark */}
        <circle cx="50" cy="50" r="4.5" fill="url(#necera_core_glow)" />
        <polygon
          points="50,44 54,50 50,56 46,50"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center group ${className}`}>
        {LogoMark}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group ${className}`}>
        {LogoMark}
        <div className="mt-2">
          <span
            className={`${textSizes[size]} bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200 block`}
          >
            NECERA
          </span>
          {showSubtext && (
            <span
              className={`${subtextSizes[size]} uppercase font-mono font-semibold tracking-widest text-indigo-400 block mt-0.5`}
            >
              {subtext}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full Horizontal Brand Display (Default)
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {LogoMark}
      <div className="flex flex-col leading-none">
        <span
          className={`${textSizes[size]} bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 font-extrabold tracking-wider transition-colors group-hover:from-white group-hover:to-indigo-300`}
        >
          NECERA
        </span>
        {showSubtext && (
          <span
            className={`${subtextSizes[size]} font-mono font-medium tracking-wider text-slate-400 mt-0.5 hidden xs:inline-block`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
