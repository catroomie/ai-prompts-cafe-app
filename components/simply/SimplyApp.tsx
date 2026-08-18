'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CameraView from './CameraView'
import type { Shot } from './CameraView'
import EditorView from './EditorView'
import { canvasFromFile } from './lib/save'
import { DEFAULT_CROP, ZERO_ADJUST } from './lib/types'
import type { Edit } from './lib/types'

interface Loaded {
  canvas: HTMLCanvasElement
  key: number
}

export default function SimplyApp() {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [edit, setEdit] = useState<Edit | null>(null)
  const [presetId, setPresetId] = useState('original')
  const [toast, setToast] = useState<string | null>(null)
  const keyRef = useRef(0)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  const open = useCallback((canvas: HTMLCanvasElement, nextPresetId: string, exposure: number) => {
    keyRef.current += 1
    setLoaded({ canvas, key: keyRef.current })
    setEdit({
      presetId: nextPresetId,
      strength: 100,
      adjust: { ...ZERO_ADJUST, exposure },
      crop: DEFAULT_CROP,
    })
  }, [])

  const handleShot = useCallback(
    (shot: Shot) => open(shot.canvas, shot.presetId, shot.exposure),
    [open],
  )

  const handleFile = useCallback(
    async (file: File) => {
      try {
        const canvas = await canvasFromFile(file)
        open(canvas, presetId, 0)
      } catch (err) {
        setToast(err instanceof Error ? err.message : '画像を読み込めませんでした')
      }
    },
    [open, presetId],
  )

  const handleRetake = useCallback(() => {
    setLoaded(null)
    setEdit(null)
  }, [])

  return (
    <div className="sy-root">
      {loaded && edit ? (
        <EditorView
          source={{ el: loaded.canvas, width: loaded.canvas.width, height: loaded.canvas.height }}
          sourceKey={loaded.key}
          edit={edit}
          onEditChange={setEdit}
          onRetake={handleRetake}
        />
      ) : (
        <CameraView
          presetId={presetId}
          onPresetChange={setPresetId}
          onShot={handleShot}
          onPickFile={handleFile}
        />
      )}
      {toast && <div className="sy-toast">{toast}</div>}
    </div>
  )
}
