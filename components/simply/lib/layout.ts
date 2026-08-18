'use client'

import { useEffect, useState } from 'react'

export interface Box {
  width: number
  height: number
}

/** 要素の実サイズを購読する。 */
export function useBoxSize(ref: React.RefObject<HTMLElement | null>): Box {
  const [size, setSize] = useState<Box>({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      setSize({ width: rect.width, height: rect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/** 縦横比を保ったまま枠に収める。 */
export function fitBox(aspect: number, maxWidth: number, maxHeight: number): Box {
  if (!maxWidth || !maxHeight || !aspect) return { width: 0, height: 0 }
  let width = maxWidth
  let height = width / aspect
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspect
  }
  return { width: Math.floor(width), height: Math.floor(height) }
}
