'use client'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (value: number) => string
  onChange: (value: number) => void
  onReset?: () => void
}

export default function Slider({ label, value, min, max, step = 1, format, onChange, onReset }: Props) {
  const display = format ? format(value) : `${value > 0 && min < 0 ? '+' : ''}${Math.round(value)}`
  return (
    <div className="sy-slider-block">
      <div className="sy-slider-head">
        <span>{label}</span>
        <span className="sy-slider-value" onDoubleClick={onReset}>
          {display}
        </span>
      </div>
      <input
        className="sy-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={onReset}
      />
    </div>
  )
}
