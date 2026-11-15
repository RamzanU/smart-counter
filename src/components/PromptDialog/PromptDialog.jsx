import { useEffect, useRef, useState } from 'react'
import './PromptDialog.css'

export default function PromptDialog({
  open,
  title,
  label,
  type = 'text',
  placeholder = '',
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}) {
  const ref = useRef(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) {
      setValue('')
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const isNumber = type === 'number'
  const valid = isNumber ? Number(value) > 0 : value.trim() !== ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    onSubmit(isNumber ? Number(value) : value.trim())
  }

  return (
    <dialog ref={ref} className="confirm" onCancel={(e) => { e.preventDefault(); onCancel() }}>
      <form onSubmit={handleSubmit}>
        <h2 className="confirm__title">{title}</h2>
        <label className="prompt__field">
          <span>{label}</span>
          <input
            type={type}
            inputMode={isNumber ? 'numeric' : undefined}
            min={isNumber ? 1 : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </label>
        <div className="confirm__actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={!valid}>{submitLabel}</button>
        </div>
      </form>
    </dialog>
  )
}