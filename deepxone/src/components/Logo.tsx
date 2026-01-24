'use client'

import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/deepxone_white_logo.png"
        alt="DeepXone"
        width={120}
        height={34}
        priority
      />
      <p className="text-sm text-primary tracking-[0.2em] font-medium">DECISIONS</p>
    </div>
  )
}
