import React from 'react';
import { motion } from 'framer-motion';

interface CraveLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CraveLogo: React.FC<CraveLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-5xl sm:text-6xl'
  }[size];

  const badgeSizes = {
    sm: 'text-[9px] px-1.5 py-0.5 rounded-md',
    md: 'text-[11px] px-2 py-0.5 rounded-lg',
    lg: 'text-xs px-2.5 py-1 rounded-xl',
    xl: 'text-sm px-3.5 py-1.5 rounded-2xl'
  }[size];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`group inline-flex items-center gap-3 select-none cursor-pointer ${className}`}
    >
      {/* 3D Turbo Flame & Fork Emblem */}
      <div className={`relative ${iconDimensions} flex items-center justify-center`}>
        {/* Animated Ambient Energy Halo */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.75, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 rounded-2xl blur-lg pointer-events-none"
        />

        {/* 3D Metallic Beveled Outer Frame */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/30 via-red-500 to-orange-600 p-[1.5px] shadow-2xl shadow-red-500/40">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center overflow-hidden border border-white/10 relative">
            {/* Specular light highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

            {/* Futuristic Vector Emblem: 3D Flame + Turbo Dash */}
            <svg
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4/5 h-4/5 drop-shadow-[0_4px_8px_rgba(239,68,68,0.5)] group-hover:rotate-6 transition-transform duration-300"
            >
              <defs>
                <linearGradient id="craveRed" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF3B30" />
                  <stop offset="50%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#FFAA00" />
                </linearGradient>
                <linearGradient id="turboStream" x1="0" y1="22" x2="44" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="sparkle" x1="16" y1="12" x2="28" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FED7AA" />
                </linearGradient>
              </defs>

              {/* Main Curving Flame Silhouette */}
              <path
                d="M14 32C11 23 18 16 22 7C25 15 34 19 32 31C30 38 16 38 14 32Z"
                fill="url(#craveRed)"
              />

              {/* Inner White-Hot Ignition Core */}
              <path
                d="M20 30C19 25 22 22 23 16C25 20 28 23 27 30C26 33 21 33 20 30Z"
                fill="url(#sparkle)"
              />

              {/* Turbo Dash Lines */}
              <path
                d="M6 26L14 26"
                stroke="url(#turboStream)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M4 31L11 31"
                stroke="url(#turboStream)"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Wordmark with Figma-grade Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-black tracking-tight ${textSizes} text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors`}>
            Crave
          </span>
          <span className={`font-black uppercase tracking-wider bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-md shadow-red-500/30 ${badgeSizes}`}>
            GO
          </span>
        </div>

        {showTagline && (
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mt-1">
            Flash Gourmet Delivery
          </span>
        )}
      </div>
    </motion.div>
  );
};
