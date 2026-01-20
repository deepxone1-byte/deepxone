'use client'

import { motion } from 'framer-motion'

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Sophisticated decision node icon */}
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Outer glow circle */}
        <circle cx="22" cy="22" r="20" fill="url(#logoGradient)" opacity="0.1" />

        {/* Decision paths - elegant intersecting lines */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Top-left to bottom-right */}
          <path
            d="M 8 8 L 22 22 L 36 36"
            stroke="url(#logoGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top-right to bottom-left */}
          <path
            d="M 36 8 L 22 22 L 8 36"
            stroke="url(#logoGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Decision node circles at endpoints */}
        <motion.circle
          cx="8" cy="8" r="2.5"
          fill="#3B82F6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
        <motion.circle
          cx="36" cy="8" r="2.5"
          fill="#3B82F6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />
        <motion.circle
          cx="8" cy="36" r="2.5"
          fill="#3B82F6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        <motion.circle
          cx="36" cy="36" r="2.5"
          fill="#3B82F6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />

        {/* Central decision point - larger, pulsing */}
        <motion.circle
          cx="22" cy="22" r="5"
          fill="url(#logoGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />

        {/* Inner glow */}
        <motion.circle
          cx="22" cy="22" r="3"
          fill="#E5E7EB"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        />
      </svg>

      <div>
        <h1 className="text-2xl font-semibold tracking-wide text-text-primary">
          DeepXone
        </h1>
        <p className="text-xs text-primary tracking-[0.2em] font-medium">DECISIONS</p>
      </div>
    </div>
  )
}
