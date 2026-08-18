'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CAPTURE_ASPECTS, captureFrame, effectiveRatio } from './lib/capture'
import { fitBox, useBoxSize } from './lib/layout'
import { PRESETS } from './lib/presets'
import { clamp } from './lib/render'
import { useLiveThumbs } from './lib/thumbs'
import { useCamera } from './lib/useCamera'
import Slider from './ui/Slider'
import {
  IconBolt,
  IconBoltOff,
  IconFlip,
  IconGrid,
  IconImage,
  IconMirror,
  IconTimer,
} from './ui/Icons'

export interface Shot {
  canvas: HTMLCanvasElement
  presetId: string
  /** ハードウェアで露出を動かせなかった場合に現像側へ引き継ぐ露出補正。 */
  exposure: number
}

interface Props {
  presetId: string
  onPresetChange: (id: string) => void
  onShot: (shot: Shot) => void
  onPickFile: (file: File) => void
}

const TIMERS = [0, 3, 10]

export default function CameraView({ presetId, onPresetChange, onShot, onPickFile }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const camera = useCamera(videoRef)
  const stage = useBoxSize(stageRef)
  const thumbs = useLiveThumbs(videoRef, camera.status === 'ready')

  const [aspectId, setAspectId] = useState('4:3')
  const [showGrid, setShowGrid] = useState(false)
  const [timer, setTimer] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [mirrorSave, setMirrorSave] = useState(false)
  const [showExposure, setShowExposure] = useState(false)
  const [dims, setDims] = useState({ width: 0, height: 0 })
  const [flashing, setFlashing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const aspect = CAPTURE_ASPECTS.find((a) => a.id === aspectId) ?? CAPTURE_ASPECTS[0]
  const previewRatio = effectiveRatio(dims.width, dims.height, aspect.ratio)
  const frame = fitBox(previewRatio || 3 / 4, stage.width, stage.height)
  const isFront = camera.facing === 'user'
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  const zoomMin = camera.caps.zoom ? camera.caps.zoom.min : 1
  const zoomMax = camera.caps.zoom ? Math.min(camera.caps.zoom.max, 8) : 5
  const zoomStops = [zoomMin < 1 ? 0.5 : null, 1, 2].filter(
    (z): z is number => z !== null && z >= zoomMin && z <= zoomMax,
  )

  /** 露出はハードウェアで動かせないときだけ、プレビューと現像に反映する。 */
  const softExposure = camera.caps.exposure ? 0 : camera.exposure
  const previewFilter = [
    preset.css === 'none' ? '' : preset.css,
    softExposure ? `brightness(${Math.pow(2, softExposure * 0.62).toFixed(3)})` : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(null), 2200)
    return () => clearTimeout(id)
  }, [notice])

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const takeShot = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    try {
      const canvas = captureFrame(video, {
        ratio: aspect.ratio,
        zoom: camera.digitalZoom,
        mirror: isFront && mirrorSave,
      })
      setFlashing(true)
      setTimeout(() => setFlashing(false), 420)
      onShot({
        canvas,
        presetId,
        exposure: clamp((softExposure / 1.15) * 100, -100, 100),
      })
    } catch (err) {
      setNotice(err instanceof Error ? err.message : '撮影できませんでした')
    }
  }, [aspect.ratio, camera.digitalZoom, isFront, mirrorSave, onShot, presetId, softExposure])

  const handleShutter = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
      setCountdown(null)
      return
    }
    if (timer === 0) {
      takeShot()
      return
    }
    setCountdown(timer)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          countdownRef.current = null
          takeShot()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [takeShot, timer])

  // ピンチでズーム
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null)

  const distanceOf = () => {
    const [a, b] = Array.from(pointers.current.values())
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      pinchStart.current = { distance: distanceOf(), zoom: camera.zoom }
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2 && pinchStart.current) {
      const scale = distanceOf() / (pinchStart.current.distance || 1)
      camera.setZoom(clamp(pinchStart.current.zoom * scale, zoomMin, zoomMax))
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
  }

  const cameraLive = camera.status === 'ready'

  return (
    <>
      <div className="sy-topbar">
        <div className="sy-topbar-left">
          <button
            className="sy-icon-btn"
            data-active={camera.torch}
            disabled={!camera.caps.torch}
            onClick={() => camera.setTorch(!camera.torch)}
            aria-label={camera.torch ? 'ライトを消す' : 'ライトを点ける'}
            title={camera.caps.torch ? 'ライト' : 'この端末はライトに対応していません'}
          >
            {camera.torch ? <IconBolt /> : <IconBoltOff />}
          </button>
          <button
            className="sy-icon-btn"
            data-active={showGrid}
            onClick={() => setShowGrid((v) => !v)}
            aria-label="グリッド"
            title="グリッド"
          >
            <IconGrid />
          </button>
        </div>

        <span className="sy-wordmark">simply</span>

        <div className="sy-topbar-right">
          <button
            className="sy-icon-btn"
            data-active={timer > 0}
            onClick={() => setTimer((t) => TIMERS[(TIMERS.indexOf(t) + 1) % TIMERS.length])}
            aria-label="セルフタイマー"
            title="セルフタイマー"
          >
            {timer === 0 ? <IconTimer /> : <span style={{ fontSize: 13 }}>{timer}s</span>}
          </button>
          <button
            className="sy-icon-btn"
            data-active={mirrorSave}
            onClick={() => {
              setMirrorSave((v) => !v)
              setNotice(mirrorSave ? '左右反転せずに保存します' : '鏡像のまま保存します')
            }}
            aria-label="前面カメラの左右反転"
            title="前面カメラを鏡像で保存"
          >
            <IconMirror />
          </button>
        </div>
      </div>

      <div className="sy-stage" ref={stageRef}>
        {camera.status === 'error' ? (
          <div className="sy-message">
            <p>{camera.error}</p>
            <div className="sy-actions" style={{ marginTop: 18 }}>
              <button className="sy-action" onClick={camera.retry}>
                もう一度試す
              </button>
              <button className="sy-action" onClick={() => fileRef.current?.click()}>
                写真を読み込む
              </button>
            </div>
          </div>
        ) : (
          <div
            className="sy-frame"
            style={{ width: frame.width || undefined, height: frame.height || undefined }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <video
              ref={videoRef}
              className="sy-video"
              playsInline
              muted
              autoPlay
              onLoadedMetadata={(e) =>
                setDims({
                  width: e.currentTarget.videoWidth,
                  height: e.currentTarget.videoHeight,
                })
              }
              style={{
                filter: previewFilter || undefined,
                transform: `scale(${camera.digitalZoom}) scaleX(${isFront ? -1 : 1})`,
              }}
            />
            {showGrid && <div className="sy-grid" />}
            {flashing && <div className="sy-flash" />}
            {countdown !== null && <div className="sy-countdown">{countdown}</div>}
            {cameraLive && zoomStops.length > 1 && (
              <div className="sy-zoom-row">
                {zoomStops.map((z) => (
                  <button
                    key={z}
                    className="sy-zoom-btn"
                    data-active={Math.abs(camera.zoom - z) < 0.05}
                    onClick={() => camera.setZoom(z)}
                  >
                    {z}×
                  </button>
                ))}
              </div>
            )}
            {notice && <div className="sy-notice">{notice}</div>}
          </div>
        )}
      </div>

      <div className="sy-controls">
        <div className="sy-strip">
          {PRESETS.map((p) => (
            <div className="sy-strip-item" key={p.id} data-active={p.id === presetId}>
              <button
                className="sy-swatch"
                onClick={() => onPresetChange(p.id)}
                aria-label={`${p.name} ${p.caption}`}
                title={p.caption}
              >
                {thumbs[p.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbs[p.id]} alt="" />
                ) : (
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(150deg, #efe3d2 0%, #c9a583 32%, #7c5d4a 58%, #2c2724 100%)',
                      filter: p.css === 'none' ? undefined : p.css,
                    }}
                  />
                )}
              </button>
              <span className="sy-swatch-label">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="sy-chip-row">
          {CAPTURE_ASPECTS.map((a) => (
            <button
              key={a.id}
              className="sy-chip"
              data-active={a.id === aspectId}
              onClick={() => setAspectId(a.id)}
            >
              {a.label}
            </button>
          ))}
          <button
            className="sy-chip"
            data-active={showExposure}
            onClick={() => setShowExposure((v) => !v)}
          >
            露出
          </button>
        </div>

        {showExposure && (
          <Slider
            label="露出補正"
            value={camera.exposure}
            min={-2}
            max={2}
            step={0.1}
            format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)} EV`}
            onChange={camera.setExposure}
            onReset={() => camera.setExposure(0)}
          />
        )}

        <div className="sy-shutter-row">
          <button
            className="sy-side-btn"
            data-align="start"
            onClick={() => fileRef.current?.click()}
          >
            <IconImage size={22} />
            読み込む
          </button>
          <button
            className="sy-shutter"
            data-counting={countdown !== null}
            disabled={!cameraLive}
            onClick={handleShutter}
            aria-label={countdown !== null ? 'タイマーを取り消す' : '撮影'}
          />
          <button className="sy-side-btn" data-align="end" onClick={camera.toggleFacing}>
            <IconFlip size={22} />
            切り替え
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPickFile(file)
          e.target.value = ''
        }}
      />
    </>
  )
}
