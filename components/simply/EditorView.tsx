'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBoxSize } from './lib/layout'
import { PRESETS, getPreset } from './lib/presets'
import { clamp, outputSize, panRange, renderEdit } from './lib/render'
import type { SourceImage } from './lib/render'
import { thumbsFromImage } from './lib/thumbs'
import type { ThumbMap } from './lib/thumbs'
import { canvasToBlob, fileName, saveImage } from './lib/save'
import { ADJUST_META, DEFAULT_CROP, ZERO_ADJUST } from './lib/types'
import type { AdjustKey, Crop, Edit, Rotation } from './lib/types'
import Slider from './ui/Slider'
import { IconCompare, IconFlip, IconReset, IconRotate } from './ui/Icons'

const MAX_EXPORT = 4096

type Tab = 'filter' | 'adjust' | 'crop'

const TABS: { id: Tab; label: string }[] = [
  { id: 'filter', label: 'フィルター' },
  { id: 'adjust', label: '調整' },
  { id: 'crop', label: '構図' },
]

const ASPECT_OPTIONS: { id: string; label: string; ratio: number | null }[] = [
  { id: 'original', label: 'オリジナル', ratio: null },
  { id: '1:1', label: '1:1', ratio: 1 },
  { id: '4:5', label: '4:5', ratio: 4 / 5 },
  { id: '3:2', label: '3:2', ratio: 2 / 3 },
  { id: '16:9', label: '16:9', ratio: 9 / 16 },
]

interface Props {
  source: SourceImage
  sourceKey: number
  edit: Edit
  onEditChange: (edit: Edit) => void
  onRetake: () => void
}

export default function EditorView({ source, sourceKey, edit, onEditChange, onRetake }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)
  const stage = useBoxSize(stageRef)

  const [tab, setTab] = useState<Tab>('filter')
  const [activeKey, setActiveKey] = useState<AdjustKey>('exposure')
  const [compare, setCompare] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [thumbs, setThumbs] = useState<ThumbMap>({})

  const preset = getPreset(edit.presetId)

  /** プレビューは画面解像度に合わせた縮小版で処理する。 */
  const previewMax = useMemo(() => {
    const dpr = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    const longest = Math.max(stage.width, stage.height) * dpr
    return clamp(Math.round(longest || 900), 480, 1600)
  }, [stage.width, stage.height])

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(null), 2200)
    return () => clearTimeout(id)
  }, [notice])

  // プレビュー描画 (フレームごとに 1 回だけ)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      renderEdit(canvas, source, edit, { maxDim: previewMax, bypass: compare })
    })
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [source, edit, previewMax, compare])

  // フィルター見本
  useEffect(() => {
    setThumbs(thumbsFromImage(source.el, source.width, source.height))
  }, [source, sourceKey])

  const patchCrop = useCallback(
    (patch: Partial<Crop>) => onEditChange({ ...edit, crop: { ...edit.crop, ...patch } }),
    [edit, onEditChange],
  )

  // 構図タブでのドラッグ移動 / ピンチ拡大
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null)
  const editRef = useRef(edit)
  editRef.current = edit

  const spread = () => {
    const [a, b] = Array.from(pointers.current.values())
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tab !== 'crop') return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      pinchRef.current = { distance: spread(), zoom: editRef.current.crop.zoom }
      dragRef.current = null
    } else {
      dragRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tab !== 'crop' || !pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchRef.current) {
      const scale = spread() / (pinchRef.current.distance || 1)
      patchCrop({ zoom: clamp(pinchRef.current.zoom * scale, 1, 4) })
      return
    }
    if (!dragRef.current) return

    const canvas = e.currentTarget
    const current = editRef.current
    const out = outputSize(source, current.crop, previewMax)
    const pan = panRange(source, current.crop, out.width, out.height)
    const displayed = canvas.clientWidth || out.width
    const ratio = out.width / displayed

    const dx = (e.clientX - dragRef.current.x) * ratio
    const dy = (e.clientY - dragRef.current.y) * ratio
    dragRef.current = { x: e.clientX, y: e.clientY }

    patchCrop({
      offsetX: pan.x > 0 ? clamp(current.crop.offsetX + dx / pan.x, -1, 1) : 0,
      offsetY: pan.y > 0 ? clamp(current.crop.offsetY + dy / pan.y, -1, 1) : 0,
    })
  }

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchRef.current = null
    if (pointers.current.size === 0) dragRef.current = null
  }

  const rotate = () => {
    const rotation = (((edit.crop.rotation + 90) % 360) as Rotation)
    patchCrop({
      rotation,
      aspect: edit.crop.aspect ? 1 / edit.crop.aspect : null,
      offsetX: 0,
      offsetY: 0,
    })
  }

  const resetAll = () => {
    onEditChange({ ...edit, strength: 100, adjust: ZERO_ADJUST, crop: DEFAULT_CROP })
    setNotice('編集をリセットしました')
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    // スピナーを描画してから重い処理に入る
    await new Promise((resolve) => setTimeout(resolve, 24))
    try {
      const out = document.createElement('canvas')
      renderEdit(out, source, edit, { maxDim: MAX_EXPORT })
      const blob = await canvasToBlob(out, 'image/jpeg', 0.92)
      const result = await saveImage(blob, fileName())
      if (result === 'shared') setNotice('共有しました')
      else if (result === 'downloaded') setNotice('画像を保存しました')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : '保存できませんでした')
    } finally {
      setSaving(false)
    }
  }

  const activeMeta = ADJUST_META.find((m) => m.key === activeKey) ?? ADJUST_META[0]
  const touched =
    edit.presetId !== 'original' ||
    ADJUST_META.some((m) => edit.adjust[m.key] !== 0) ||
    edit.crop.zoom !== 1 ||
    edit.crop.aspect !== null ||
    edit.crop.rotation !== 0 ||
    edit.crop.flipH

  return (
    <>
      <div className="sy-topbar">
        <div className="sy-topbar-left">
          <button className="sy-text-btn" onClick={onRetake}>
            撮り直す
          </button>
        </div>
        <span className="sy-wordmark">simply</span>
        <div className="sy-topbar-right">
          <button
            className="sy-icon-btn"
            data-active={compare}
            aria-label="加工前と比べる"
            title="押している間だけ元の写真を表示"
            onPointerDown={() => setCompare(true)}
            onPointerUp={() => setCompare(false)}
            onPointerLeave={() => setCompare(false)}
            onPointerCancel={() => setCompare(false)}
          >
            <IconCompare />
          </button>
          <button
            className="sy-icon-btn"
            onClick={resetAll}
            disabled={!touched}
            aria-label="編集をリセット"
            title="編集をリセット"
          >
            <IconReset />
          </button>
          <button className="sy-text-btn" data-primary="true" onClick={handleSave} disabled={saving}>
            {saving ? '書き出し中' : '保存'}
          </button>
        </div>
      </div>

      <div className="sy-stage" ref={stageRef}>
        <canvas
          ref={canvasRef}
          className="sy-canvas"
          style={{ cursor: tab === 'crop' ? 'grab' : 'default' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {saving && (
          <div className="sy-notice">
            <span className="sy-spinner" />
          </div>
        )}
        {notice && !saving && <div className="sy-notice">{notice}</div>}
      </div>

      <div className="sy-panel">
        <div className="sy-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className="sy-tab"
              data-active={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sy-panel-body">
          {tab === 'filter' && (
            <>
              <div className="sy-strip">
                {PRESETS.map((p) => (
                  <div className="sy-strip-item" key={p.id} data-active={p.id === edit.presetId}>
                    <button
                      className="sy-swatch"
                      onClick={() => onEditChange({ ...edit, presetId: p.id, strength: 100 })}
                      aria-label={`${p.name} ${p.caption}`}
                      title={p.caption}
                    >
                      {thumbs[p.id] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbs[p.id]} alt="" />
                      ) : null}
                    </button>
                    <span className="sy-swatch-label">{p.name}</span>
                  </div>
                ))}
              </div>
              {preset.id === 'original' ? (
                <p className="sy-hint">写真の質感を選ぶ</p>
              ) : (
                <Slider
                  label={`${preset.name}　${preset.caption}`}
                  value={edit.strength}
                  min={0}
                  max={100}
                  onChange={(strength) => onEditChange({ ...edit, strength })}
                  onReset={() => onEditChange({ ...edit, strength: 100 })}
                />
              )}
            </>
          )}

          {tab === 'adjust' && (
            <>
              <div className="sy-strip">
                {ADJUST_META.map((m) => (
                  <button
                    key={m.key}
                    className="sy-chip"
                    data-active={m.key === activeKey}
                    onClick={() => setActiveKey(m.key)}
                  >
                    {m.label}
                    {edit.adjust[m.key] !== 0 && ' ·'}
                  </button>
                ))}
              </div>
              <Slider
                label={activeMeta.label}
                value={edit.adjust[activeMeta.key]}
                min={activeMeta.min}
                max={activeMeta.max}
                onChange={(value) =>
                  onEditChange({ ...edit, adjust: { ...edit.adjust, [activeMeta.key]: value } })
                }
                onReset={() =>
                  onEditChange({ ...edit, adjust: { ...edit.adjust, [activeMeta.key]: 0 } })
                }
              />
            </>
          )}

          {tab === 'crop' && (
            <>
              <div className="sy-chip-row">
                {ASPECT_OPTIONS.map((option) => {
                  const portrait =
                    (edit.crop.rotation % 180 === 0 ? source.height : source.width) >
                    (edit.crop.rotation % 180 === 0 ? source.width : source.height)
                  const ratio =
                    option.ratio === null || option.ratio === 1
                      ? option.ratio
                      : portrait
                        ? Math.min(option.ratio, 1 / option.ratio)
                        : Math.max(option.ratio, 1 / option.ratio)
                  const active =
                    ratio === null
                      ? edit.crop.aspect === null
                      : edit.crop.aspect !== null && Math.abs(edit.crop.aspect - ratio) < 0.001
                  return (
                    <button
                      key={option.id}
                      className="sy-chip"
                      data-active={active}
                      onClick={() => patchCrop({ aspect: ratio, offsetX: 0, offsetY: 0 })}
                    >
                      {option.label}
                    </button>
                  )
                })}
                <button className="sy-icon-btn" onClick={rotate} aria-label="90度回転" title="90度回転">
                  <IconRotate />
                </button>
                <button
                  className="sy-icon-btn"
                  data-active={edit.crop.flipH}
                  onClick={() => patchCrop({ flipH: !edit.crop.flipH })}
                  aria-label="左右反転"
                  title="左右反転"
                >
                  <IconFlip />
                </button>
              </div>
              <Slider
                label="拡大"
                value={edit.crop.zoom}
                min={1}
                max={4}
                step={0.01}
                format={(v) => `${v.toFixed(2)}×`}
                onChange={(zoom) => patchCrop({ zoom })}
                onReset={() => patchCrop({ zoom: 1, offsetX: 0, offsetY: 0 })}
              />
              <p className="sy-hint">写真をドラッグして位置を決める</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
