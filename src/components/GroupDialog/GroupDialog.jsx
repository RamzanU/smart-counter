import { useEffect, useRef, useState } from 'react'
import { GROUP_COLORS } from '../../utils/colors'
import './GroupDialog.css'

export default function GroupDialog({
  title,
  submitLabel,
  initialName = '',
  initialColor = GROUP_COLORS[0].value,
  onSubmit,
  onCancel,
}) {
  const ref = useRef(null)
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) onSubmit(name.trim(), color)
  }

  return (
    <dialog
      ref={ref}
      className="group-dialog"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2 className="group-dialog__title">{title}</h2>

        <label className="group-dialog__field">
          <span>Group name</span>
          <input
            autoFocus
            value={name}
            maxLength={40}
            placeholder="e.g. Magazijn 1"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <fieldset className="group-dialog__colors">
          <legend>Color</legend>
          <div className="swatches">
            {GROUP_COLORS.map((c) => (
              <label key={c.value} className="swatch" style={{ '--swatch': c.value }}>
                <input
                  type="radio"
                  name="group-color"
                  value={c.value}
                  checked={color === c.value}
                  onChange={() => setColor(c.value)}
                  aria-label={c.name}
                />
                <span className="swatch__dot" />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="group-dialog__actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-btn" disabled={!name.trim()}>
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  )
}