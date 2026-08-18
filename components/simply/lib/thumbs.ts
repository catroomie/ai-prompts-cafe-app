'use client'

import { useEffect, useState } from 'react'
import { PRESETS } from './presets'
import { processImageData } from './render'
import { ZERO_ADJUST } from './types'

const SIZE = 112

export type ThumbMap = Record<string, string>

/** 正方形の見本を各プリセットで現像して data URL にする。 */
function build(draw: (ctx: CanvasRenderingContext2D) => void): ThumbMap {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return {}
  draw(ctx)
  const base = ctx.getImageData(0, 0, SIZE, SIZE)
  const thumbs: ThumbMap = {}
  for (const preset of PRESETS) {
    const image = new ImageData(new Uint8ClampedArray(base.data), base.width, base.height)
    processImageData(image, preset, 100, ZERO_ADJUST)
    ctx.putImageData(image, 0, 0)
    thumbs[preset.id] = canvas.toDataURL('image/jpeg', 0.82)
  }
  return thumbs
}

function drawCoverSquare(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number,
) {
  const side = Math.min(width, height)
  ctx.drawImage(source, (width - side) / 2, (height - side) / 2, side, side, 0, 0, SIZE, SIZE)
}

export function thumbsFromImage(
  source: CanvasImageSource,
  width: number,
  height: number,
): ThumbMap {
  if (!width || !height) return {}
  return build((ctx) => drawCoverSquare(ctx, source, width, height))
}

/** カメラ映像から見本を作る。まだ映像が来ていなければ null。 */
export function thumbsFromVideo(video: HTMLVideoElement | null): ThumbMap | null {
  if (!video || !video.videoWidth || !video.videoHeight) return null
  return thumbsFromImage(video, video.videoWidth, video.videoHeight)
}

/** カメラのライブ映像から一定間隔で見本を更新する。 */
export function useLiveThumbs(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  active: boolean,
  intervalMs = 4000,
): ThumbMap {
  const [thumbs, setThumbs] = useState<ThumbMap>({})

  useEffect(() => {
    if (!active) return
    let cancelled = false
    const update = () => {
      if (cancelled || document.hidden) return
      const next = thumbsFromVideo(videoRef.current)
      if (next) setThumbs(next)
    }
    const first = setTimeout(update, 400)
    const timer = setInterval(update, intervalMs)
    return () => {
      cancelled = true
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [active, intervalMs, videoRef])

  return thumbs
}
