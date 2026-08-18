export type AdjustKey =
  | 'exposure'
  | 'contrast'
  | 'saturation'
  | 'warmth'
  | 'tint'
  | 'highlights'
  | 'shadows'
  | 'fade'
  | 'vignette'
  | 'grain'

export type Adjustments = Record<AdjustKey, number>

export interface AdjustMeta {
  key: AdjustKey
  label: string
  min: number
  max: number
}

/** 調整項目。min が 0 のものは片方向スライダー。 */
export const ADJUST_META: AdjustMeta[] = [
  { key: 'exposure', label: '露出', min: -100, max: 100 },
  { key: 'contrast', label: 'コントラスト', min: -100, max: 100 },
  { key: 'highlights', label: 'ハイライト', min: -100, max: 100 },
  { key: 'shadows', label: 'シャドウ', min: -100, max: 100 },
  { key: 'saturation', label: '彩度', min: -100, max: 100 },
  { key: 'warmth', label: '色温度', min: -100, max: 100 },
  { key: 'tint', label: '色かぶり', min: -100, max: 100 },
  { key: 'fade', label: 'フェード', min: 0, max: 100 },
  { key: 'vignette', label: '周辺光量', min: 0, max: 100 },
  { key: 'grain', label: '粒状感', min: 0, max: 100 },
]

export const ADJUST_KEYS = ADJUST_META.map((m) => m.key)

export const ZERO_ADJUST: Adjustments = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  fade: 0,
  vignette: 0,
  grain: 0,
}

export type Rotation = 0 | 90 | 180 | 270

export interface Crop {
  /** 出力の縦横比 (幅/高さ)。null は元画像の比率。 */
  aspect: number | null
  zoom: number
  offsetX: number
  offsetY: number
  rotation: Rotation
  flipH: boolean
}

export const DEFAULT_CROP: Crop = {
  aspect: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  flipH: false,
}

export interface Edit {
  presetId: string
  strength: number
  adjust: Adjustments
  crop: Crop
}

export const DEFAULT_EDIT: Edit = {
  presetId: 'original',
  strength: 100,
  adjust: ZERO_ADJUST,
  crop: DEFAULT_CROP,
}
