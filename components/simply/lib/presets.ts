import type { Adjustments } from './types'

export interface Tint {
  /** 0-255 の RGB */
  color: [number, number, number]
  /** 0-1 の混色量 */
  amount: number
}

export interface Preset {
  id: string
  name: string
  caption: string
  /** 0-1。1 で完全なモノクロ */
  mono?: number
  adjust: Partial<Adjustments>
  shadowTint?: Tint
  highlightTint?: Tint
  /** カメラのライブプレビュー用の近似 CSS フィルター */
  css: string
}

/**
 * 落ち着いた質感を狙ったプリセット群。
 * 彩度を上げる方向には振らず、光と褪色でトーンを作る。
 */
export const PRESETS: Preset[] = [
  {
    id: 'original',
    name: 'Original',
    caption: '無加工',
    adjust: {},
    css: 'none',
  },
  {
    id: 'linen',
    name: 'Linen',
    caption: '柔らかい自然光',
    adjust: { exposure: 7, contrast: -5, saturation: -8, warmth: 6, fade: 10, highlights: -6 },
    highlightTint: { color: [255, 246, 232], amount: 0.1 },
    css: 'brightness(1.05) contrast(0.97) saturate(0.92)',
  },
  {
    id: 'ash',
    name: 'Ash',
    caption: 'くすんだニュートラル',
    adjust: { saturation: -34, contrast: 8, shadows: 10, fade: 14 },
    shadowTint: { color: [96, 104, 116], amount: 0.16 },
    css: 'saturate(0.66) contrast(1.05) brightness(1.02)',
  },
  {
    id: 'clay',
    name: 'Clay',
    caption: '温度のあるマット',
    adjust: { warmth: 18, saturation: -12, highlights: -12, fade: 18, shadows: 6 },
    shadowTint: { color: [92, 72, 60], amount: 0.18 },
    css: 'sepia(0.16) saturate(0.9) contrast(0.96) brightness(1.03)',
  },
  {
    id: 'umber',
    name: 'Umber',
    caption: '深い褐色',
    adjust: { warmth: 12, contrast: 14, shadows: -14, saturation: -18, vignette: 14 },
    shadowTint: { color: [58, 44, 34], amount: 0.22 },
    css: 'sepia(0.22) saturate(0.85) contrast(1.1) brightness(0.98)',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    caption: '静かな青の影',
    adjust: { warmth: -14, saturation: -14, highlights: -8, contrast: 6 },
    shadowTint: { color: [52, 66, 102], amount: 0.2 },
    css: 'saturate(0.85) contrast(1.05) hue-rotate(-6deg) brightness(0.99)',
  },
  {
    id: 'ember',
    name: 'Ember',
    caption: '夕暮れの残光',
    adjust: { warmth: 24, saturation: -4, shadows: 8, highlights: -8, fade: 8 },
    highlightTint: { color: [255, 206, 150], amount: 0.18 },
    shadowTint: { color: [74, 56, 52], amount: 0.12 },
    css: 'sepia(0.2) saturate(1.02) brightness(1.03) hue-rotate(-8deg)',
  },
  {
    id: 'fog',
    name: 'Fog',
    caption: '霞んだ静けさ',
    adjust: { exposure: 8, contrast: -14, saturation: -22, fade: 28 },
    highlightTint: { color: [236, 238, 240], amount: 0.12 },
    css: 'brightness(1.08) contrast(0.86) saturate(0.78)',
  },
  {
    id: 'noir',
    name: 'Noir',
    caption: '硬いモノクロ',
    mono: 1,
    adjust: { contrast: 26, shadows: -14, highlights: 6, vignette: 18 },
    css: 'grayscale(1) contrast(1.24) brightness(0.98)',
  },
  {
    id: 'silver',
    name: 'Silver',
    caption: '柔らかいモノクロ',
    mono: 1,
    adjust: { contrast: -6, exposure: 5, fade: 16, shadows: 8 },
    css: 'grayscale(1) contrast(0.94) brightness(1.05)',
  },
]

export const PRESET_MAP: Record<string, Preset> = Object.fromEntries(
  PRESETS.map((p) => [p.id, p]),
)

export function getPreset(id: string): Preset {
  return PRESET_MAP[id] ?? PRESETS[0]
}
