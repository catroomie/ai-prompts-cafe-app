export interface CaptureAspect {
  id: string
  label: string
  /** 横向き基準の比率。縦向きのプレビューでは自動で反転する。 */
  ratio: number
}

export const CAPTURE_ASPECTS: CaptureAspect[] = [
  { id: '4:3', label: '4:3', ratio: 4 / 3 },
  { id: '1:1', label: '1:1', ratio: 1 },
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
]

/** プレビューの向きに合わせた実効の縦横比 (幅/高さ)。 */
export function effectiveRatio(videoW: number, videoH: number, ratio: number): number {
  if (!videoW || !videoH) return ratio
  return videoW >= videoH ? ratio : 1 / ratio
}

export interface CaptureOptions {
  ratio: number
  /** デジタルズーム倍率 (光学ズームが効いている場合は 1)。 */
  zoom: number
  /** 前面カメラを鏡像のまま保存するか。 */
  mirror: boolean
}

/** 現在のフレームを、指定の比率・ズームで切り出したキャンバスとして取り出す。 */
export function captureFrame(video: HTMLVideoElement, options: CaptureOptions): HTMLCanvasElement {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) throw new Error('カメラの映像をまだ取得できていません')

  const zoom = Math.max(1, options.zoom)
  let sw = vw / zoom
  let sh = vh / zoom

  const target = effectiveRatio(vw, vh, options.ratio)
  if (sw / sh > target) sw = sh * target
  else sh = sw / target

  const sx = (vw - sw) / 2
  const sy = (vh - sh) / 2

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(sw))
  canvas.height = Math.max(1, Math.round(sh))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('写真を作成できませんでした')
  ctx.imageSmoothingQuality = 'high'
  if (options.mirror) {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  return canvas
}
