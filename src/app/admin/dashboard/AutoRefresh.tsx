'use client'

import { useEffect } from 'react'

export default function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload()
    }, intervalMs)

    return () => clearTimeout(timer)
  }, [intervalMs])

  return null
}
