// Decision mode color schemes
export const MODE_COLORS = {
  speed: {
    primary: '#F59E0B',      // Amber
    light: '#FEF3C7',
    dark: '#D97706',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    glow: 'shadow-amber-500/20'
  },
  balanced: {
    primary: '#8B5CF6',      // Purple
    light: '#EDE9FE',
    dark: '#7C3AED',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    glow: 'shadow-purple-500/20'
  },
  compliance: {
    primary: '#3B82F6',      // Blue
    light: '#DBEAFE',
    dark: '#2563EB',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    glow: 'shadow-blue-500/20'
  },
  customer: {
    primary: '#EC4899',      // Pink
    light: '#FCE7F3',
    dark: '#DB2777',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-500',
    glow: 'shadow-pink-500/20'
  }
} as const

export type ModeId = keyof typeof MODE_COLORS
