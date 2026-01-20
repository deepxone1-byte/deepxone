'use client'

import { motion } from 'framer-motion'

interface RiskGaugeProps {
  risk: 'low' | 'medium' | 'high'
}

export function RiskGauge({ risk }: RiskGaugeProps) {
  const getRiskValue = () => {
    switch (risk) {
      case 'low': return 20
      case 'medium': return 50
      case 'high': return 80
      default: return 50
    }
  }

  const getRiskColor = () => {
    switch (risk) {
      case 'low': return '#22C55E'
      case 'medium': return '#F59E0B'
      case 'high': return '#EF4444'
      default: return '#9CA3AF'
    }
  }

  const riskValue = getRiskValue()
  const riskColor = getRiskColor()
  const rotation = (riskValue / 100) * 180 - 90 // -90 to 90 degrees

  return (
    <div className="relative w-full h-32">
      {/* Gauge Background Arc */}
      <svg className="w-full h-full" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#374151"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Low zone (green) */}
        <path
          d="M 20 100 A 80 80 0 0 1 80 30"
          fill="none"
          stroke="#22C55E"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Medium zone (yellow) */}
        <path
          d="M 80 30 A 80 80 0 0 1 120 30"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* High zone (red) */}
        <path
          d="M 120 30 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#EF4444"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Active arc */}
        <motion.path
          d={`M 20 100 A 80 80 0 ${riskValue > 50 ? '1' : '0'} 1 ${100 + 80 * Math.cos((riskValue / 100 * 180 - 90) * Math.PI / 180)} ${100 - 80 * Math.sin((riskValue / 100 * 180 - 90) * Math.PI / 180)}`}
          fill="none"
          stroke={riskColor}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke={riskColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill={riskColor} />
        </motion.g>

        {/* Center text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          className="text-2xl font-bold fill-text-primary uppercase"
          style={{ fill: riskColor }}
        >
          {risk}
        </text>
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 text-xs text-success font-medium">LOW</div>
      <div className="absolute bottom-0 right-0 text-xs text-danger font-medium">HIGH</div>
    </div>
  )
}
