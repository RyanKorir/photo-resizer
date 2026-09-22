'use client'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  onReset?: () => void
  formatValue?: (v: number) => string
}

export default function AdjustmentSlider({ label, value, min, max, step = 1, onChange, onReset, formatValue }: Props) {
  const display = formatValue ? formatValue(value) : (value > 0 ? `+${value}` : String(value))
  const isDefault = value === 0

  return (
    <div className="slider-row group">
      <span className="slider-label">{label}</span>
      <div style={{ flex: 1 }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%, var(--border) 100%)`
          }}
        />
      </div>
      <span
        className="slider-value"
        onClick={() => onReset && onReset()}
        style={{
          cursor: onReset && !isDefault ? 'pointer' : 'default',
          color: !isDefault ? 'var(--accent)' : 'var(--text-muted)',
        }}
        title={!isDefault ? 'Click to reset' : ''}
      >
        {display}
      </span>
    </div>
  )
}
