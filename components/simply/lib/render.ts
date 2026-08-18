import { ADJUST_META, ZERO_ADJUST } from './types'
import type { Adjustments, Crop, Edit } from './types'
import { getPreset } from './presets'
import type { Preset } from './presets'

export interface SourceImage {
  el: CanvasImageSource
  width: number
  height: number
}

export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** プリセット (強度つき) とユーザー調整を合成した最終的な調整値。 */
export function effectiveAdjust(preset: Preset, strength: number, user: Adjustments): Adjustments {
  const k = clamp(strength, 0, 100) / 100
  const out = { ...user }
  for (const meta of ADJUST_META) {
    const p = preset.adjust[meta.key]
    if (p) out[meta.key] = clamp(out[meta.key] + p * k, meta.min, meta.max)
  }
  return out
}

export function isNeutral(adjust: Adjustments, preset: Preset, strength: number): boolean {
  if (preset.id !== 'original' && strength > 0) return false
  return ADJUST_META.every((m) => adjust[m.key] === 0)
}

const NOISE_SIZE = 8192
const NOISE_MASK = NOISE_SIZE - 1
const noiseTable = (() => {
  const table = new Float32Array(NOISE_SIZE)
  let seed = 2463534242
  for (let i = 0; i < NOISE_SIZE; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    table[i] = (seed / 4294967295) * 2 - 1
  }
  return table
})()

/**
 * ピクセル処理の本体。ImageData を直接書き換える。
 * 露出 → 色温度 → ハイライト/シャドウ → コントラスト → フェード →
 * モノクロ/彩度 → スプリットトーン → 周辺光量 → 粒状感 の順に適用する。
 */
export function processImageData(
  image: ImageData,
  preset: Preset,
  strength: number,
  user: Adjustments,
): void {
  const a = effectiveAdjust(preset, strength, user)
  const k = clamp(strength, 0, 100) / 100
  const data = image.data
  const width = image.width
  const height = image.height

  const exposure = Math.pow(2, (a.exposure / 100) * 1.15)
  const warm = a.warmth / 100
  const tint = a.tint / 100
  const rGain = exposure * (1 + warm * 0.22 + tint * 0.06)
  const gGain = exposure * (1 - tint * 0.14)
  const bGain = exposure * (1 - warm * 0.22 + tint * 0.06)

  const hi = a.highlights / 100
  const sh = a.shadows / 100
  const contrast = 1 + (a.contrast / 100) * 0.55
  const fade = a.fade / 100
  const sat = 1 + a.saturation / 100
  const mono = clamp((preset.mono ?? 0) * k, 0, 1)
  const vignette = (a.vignette / 100) * 0.85
  const grain = (a.grain / 100) * 0.22

  const st = preset.shadowTint
  const ht = preset.highlightTint
  const stAmount = st ? st.amount * k : 0
  const htAmount = ht ? ht.amount * k : 0
  const stR = st ? st.color[0] / 255 : 0
  const stG = st ? st.color[1] / 255 : 0
  const stB = st ? st.color[2] / 255 : 0
  const htR = ht ? ht.color[0] / 255 : 0
  const htG = ht ? ht.color[1] / 255 : 0
  const htB = ht ? ht.color[2] / 255 : 0

  const useToneRange = hi !== 0 || sh !== 0
  const useFade = fade > 0
  const useSat = sat !== 1 || mono > 0
  const useSplit = stAmount > 0 || htAmount > 0
  const useVignette = vignette > 0
  const useGrain = grain > 0

  const halfW = width / 2
  const halfH = height / 2
  const diagonal = Math.sqrt(halfW * halfW + halfH * halfH) || 1

  let i = 0
  for (let y = 0; y < height; y++) {
    const dy = (y + 0.5 - halfH) / diagonal
    for (let x = 0; x < width; x++, i += 4) {
      let r = (data[i] / 255) * rGain
      let g = (data[i + 1] / 255) * gGain
      let b = (data[i + 2] / 255) * bGain

      if (useToneRange) {
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        if (hi !== 0) {
          const w = smoothstep(0.45, 1.05, lum)
          const f = hi * 0.42 * w
          r += f
          g += f
          b += f
        }
        if (sh !== 0) {
          const w = smoothstep(0.55, -0.05, lum)
          const f = sh * 0.42 * w
          r += f
          g += f
          b += f
        }
      }

      if (contrast !== 1) {
        r = (r - 0.5) * contrast + 0.5
        g = (g - 0.5) * contrast + 0.5
        b = (b - 0.5) * contrast + 0.5
      }

      if (useFade) {
        const lift = 0.19 * fade
        const gainF = 1 - 0.26 * fade
        r = r * gainF + lift
        g = g * gainF + lift
        b = b * gainF + lift
      }

      if (useSat) {
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        if (mono > 0) {
          r += (lum - r) * mono
          g += (lum - g) * mono
          b += (lum - b) * mono
        }
        if (sat !== 1) {
          r = lum + (r - lum) * sat
          g = lum + (g - lum) * sat
          b = lum + (b - lum) * sat
        }
      }

      if (useSplit) {
        const lum = clamp(0.2126 * r + 0.7152 * g + 0.0722 * b, 0, 1)
        if (stAmount > 0) {
          const w = stAmount * (1 - smoothstep(0.0, 0.62, lum))
          r += (stR - r) * w
          g += (stG - g) * w
          b += (stB - b) * w
        }
        if (htAmount > 0) {
          const w = htAmount * smoothstep(0.42, 1.0, lum)
          r += (htR - r) * w
          g += (htG - g) * w
          b += (htB - b) * w
        }
      }

      if (useVignette) {
        const dx = (x + 0.5 - halfW) / diagonal
        const dist = Math.sqrt(dx * dx + dy * dy) * 2
        const falloff = 1 - vignette * smoothstep(0.45, 1.15, dist)
        r *= falloff
        g *= falloff
        b *= falloff
      }

      if (useGrain) {
        const n = noiseTable[(i + Math.imul(y, 104729)) & NOISE_MASK] * grain
        r += n
        g += n
        b += n
      }

      data[i] = r <= 0 ? 0 : r >= 1 ? 255 : (r * 255 + 0.5) | 0
      data[i + 1] = g <= 0 ? 0 : g >= 1 ? 255 : (g * 255 + 0.5) | 0
      data[i + 2] = b <= 0 ? 0 : b >= 1 ? 255 : (b * 255 + 0.5) | 0
    }
  }
}

function rotatedSize(width: number, height: number, rotation: number): [number, number] {
  return rotation % 180 === 0 ? [width, height] : [height, width]
}

/** トリミング後の出力サイズ (maxDim で長辺を制限)。 */
export function outputSize(src: SourceImage, crop: Crop, maxDim: number): { width: number; height: number } {
  const [rw, rh] = rotatedSize(src.width, src.height, crop.rotation)
  const aspect = crop.aspect ?? rw / rh
  let w = aspect >= 1 ? rw : rh * aspect
  let h = aspect >= 1 ? rw / aspect : rh
  const scale = Math.min(1, maxDim / Math.max(w, h))
  return {
    width: Math.max(1, Math.round(w * scale)),
    height: Math.max(1, Math.round(h * scale)),
  }
}

/** 画像をフレーム全体に「カバー」させるときの余白 (パン可能量、出力ピクセル単位)。 */
export function panRange(
  src: SourceImage,
  crop: Crop,
  outW: number,
  outH: number,
): { x: number; y: number; drawW: number; drawH: number } {
  const [rw, rh] = rotatedSize(src.width, src.height, crop.rotation)
  const scale = Math.max(outW / rw, outH / rh) * crop.zoom
  const drawW = rw * scale
  const drawH = rh * scale
  return {
    x: Math.max(0, (drawW - outW) / 2),
    y: Math.max(0, (drawH - outH) / 2),
    drawW,
    drawH,
  }
}

/** トリミング・回転・反転を適用して描画する。 */
export function drawSource(
  ctx: CanvasRenderingContext2D,
  src: SourceImage,
  crop: Crop,
  outW: number,
  outH: number,
): void {
  const [rw, rh] = rotatedSize(src.width, src.height, crop.rotation)
  const scale = Math.max(outW / rw, outH / rh) * crop.zoom
  const pan = panRange(src, crop, outW, outH)
  const cx = outW / 2 + clamp(crop.offsetX, -1, 1) * pan.x
  const cy = outH / 2 + clamp(crop.offsetY, -1, 1) * pan.y

  ctx.save()
  ctx.imageSmoothingQuality = 'high'
  ctx.translate(cx, cy)
  if (crop.rotation) ctx.rotate((crop.rotation * Math.PI) / 180)
  if (crop.flipH) ctx.scale(-1, 1)
  const dw = src.width * scale
  const dh = src.height * scale
  ctx.drawImage(src.el, -dw / 2, -dh / 2, dw, dh)
  ctx.restore()
}

export interface RenderOptions {
  /** 出力の長辺の上限。プレビューは小さく、書き出しは元サイズ。 */
  maxDim: number
  /** true のときフィルターと調整を無視して元画像を描く (比較用)。 */
  bypass?: boolean
}

/** 編集内容をキャンバスに描画する。 */
export function renderEdit(
  canvas: HTMLCanvasElement,
  src: SourceImage,
  edit: Edit,
  options: RenderOptions,
): void {
  const { width, height } = outputSize(src, edit.crop, options.maxDim)
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  drawSource(ctx, src, edit.crop, width, height)

  const preset = getPreset(edit.presetId)
  const adjust = options.bypass ? ZERO_ADJUST : edit.adjust
  const strength = options.bypass ? 0 : edit.strength
  const activePreset = options.bypass ? getPreset('original') : preset
  if (isNeutral(adjust, activePreset, strength)) return

  const image = ctx.getImageData(0, 0, width, height)
  processImageData(image, activePreset, strength, adjust)
  ctx.putImageData(image, 0, 0)
}
