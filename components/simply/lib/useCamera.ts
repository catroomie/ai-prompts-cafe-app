'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Facing = 'user' | 'environment'
export type CameraStatus = 'idle' | 'starting' | 'ready' | 'error'

export interface Range {
  min: number
  max: number
  step: number
}

export interface CameraCapabilities {
  zoom: Range | null
  exposure: Range | null
  torch: boolean
}

interface ExtendedCapabilities extends MediaTrackCapabilities {
  zoom?: Range
  torch?: boolean
  exposureCompensation?: Range
}

const EMPTY_CAPS: CameraCapabilities = { zoom: null, exposure: null, torch: false }

function messageFor(err: unknown): string {
  const name = (err as DOMException)?.name
  if (name === 'NotAllowedError' || name === 'SecurityError')
    return 'カメラへのアクセスが許可されていません。ブラウザの設定で許可してから再読み込みしてください。'
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return '使用できるカメラが見つかりませんでした。'
  if (name === 'NotReadableError')
    return 'カメラを他のアプリが使用中の可能性があります。他のアプリを閉じてお試しください。'
  return 'カメラを起動できませんでした。写真を読み込んで編集することはできます。'
}

/** getUserMedia のライフサイクルと、端末が対応していれば光学ズーム・トーチ・露出補正を扱う。 */
export function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [facing, setFacing] = useState<Facing>('environment')
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [caps, setCaps] = useState<CameraCapabilities>(EMPTY_CAPS)
  const [zoom, setZoomState] = useState(1)
  const [torch, setTorchState] = useState(false)
  const [exposure, setExposureState] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const startTokenRef = useRef(0)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const start = useCallback(
    async (next: Facing) => {
      const token = ++startTokenRef.current
      setStatus('starting')
      setError(null)
      stop()

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setStatus('error')
        setError(
          window.isSecureContext === false
            ? 'カメラは HTTPS の接続でのみ利用できます。'
            : 'この環境ではカメラを利用できません。写真を読み込んで編集することはできます。',
        )
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: next },
            width: { ideal: 4096 },
            height: { ideal: 4096 },
          },
          audio: false,
        })
        if (token !== startTokenRef.current) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          try {
            await video.play()
          } catch {
            // 自動再生がブロックされてもタップで再開できる
          }
        }

        const track = stream.getVideoTracks()[0]
        const c = (track?.getCapabilities?.() ?? {}) as ExtendedCapabilities
        setCaps({
          zoom: c.zoom ? { min: c.zoom.min, max: c.zoom.max, step: c.zoom.step || 0.1 } : null,
          exposure: c.exposureCompensation
            ? {
                min: c.exposureCompensation.min,
                max: c.exposureCompensation.max,
                step: c.exposureCompensation.step || 0.1,
              }
            : null,
          torch: Boolean(c.torch),
        })
        setZoomState(1)
        setTorchState(false)
        setExposureState(0)
        setStatus('ready')
      } catch (err) {
        if (token !== startTokenRef.current) return
        setStatus('error')
        setError(messageFor(err))
        setCaps(EMPTY_CAPS)
      }
    },
    [stop, videoRef],
  )

  useEffect(() => {
    start(facing)
    return () => {
      startTokenRef.current++
      stop()
    }
  }, [facing, start, stop])

  const applyAdvanced = useCallback(async (constraint: Record<string, number | boolean>) => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return false
    try {
      await track.applyConstraints({ advanced: [constraint] } as MediaTrackConstraints)
      return true
    } catch {
      return false
    }
  }, [])

  /** 端末が光学ズームに対応していれば実際に寄せる。非対応なら値だけ保持し、描画側でデジタルズームする。 */
  const setZoom = useCallback(
    (value: number) => {
      setZoomState(value)
      if (caps.zoom) {
        const v = Math.min(caps.zoom.max, Math.max(caps.zoom.min, value))
        void applyAdvanced({ zoom: v })
      }
    },
    [applyAdvanced, caps.zoom],
  )

  const setTorch = useCallback(
    (value: boolean) => {
      if (!caps.torch) return
      setTorchState(value)
      void applyAdvanced({ torch: value })
    },
    [applyAdvanced, caps.torch],
  )

  /** EV。ハードウェアが対応していない場合は編集側の露出として引き継ぐ。 */
  const setExposure = useCallback(
    (value: number) => {
      setExposureState(value)
      if (caps.exposure) {
        const span = caps.exposure.max - caps.exposure.min
        const v = caps.exposure.min + ((value + 2) / 4) * span
        void applyAdvanced({ exposureCompensation: v })
      }
    },
    [applyAdvanced, caps.exposure],
  )

  const toggleFacing = useCallback(() => {
    setFacing((f) => (f === 'user' ? 'environment' : 'user'))
  }, [])

  const retry = useCallback(() => {
    void start(facing)
  }, [facing, start])

  /** 光学ズームが効いている分はプレビュー側で拡大しない。 */
  const digitalZoom = caps.zoom ? 1 : zoom

  return {
    facing,
    status,
    error,
    caps,
    zoom,
    digitalZoom,
    torch,
    exposure,
    setZoom,
    setTorch,
    setExposure,
    toggleFacing,
    retry,
    stop,
  }
}
