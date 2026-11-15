import { useEffect, useRef, useState } from 'react'

export default function StepsDialog({ open, steps, onSave, onCancel }) {
  const ref = useRef(null)
  const [second, setSecond] = useState(String(steps[1]))
  const [third, setThird] = useState(String(steps[2]))

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) {
      setSecond(String(steps[1]))
      setThird(String(steps[2]))
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open, steps])

  const valid = Number(second) > 1 && Number(third) > 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    const values = [1, Number(second), Number(third)]
    onSave([...new Set(values)].sort((a, b) => a - b))
  }

  return (
    <dialog ref={ref} className="confirm" onCancel={(e) => { e.preventDefault(); onCancel() }}>
      <form onSubmit={handleSubmit}>
        <h2 className="confirm__title">Step values</h2>
        <p className="confirm__message">+1 is always available. Set two quick steps, e.g. 12 for a pack.</p>
        <div className="steps-dialog__fields">
          <label>
            <span>Step 2</span>
            <input type="number" min="2" inputMode="numeric" value={second} onChange={(e) => setSecond(e.target.value)} />
          </label>
          <label>
            <span>Step 3</span>
            <input type="number" min="2" inputMode="numeric" value={third} onChange={(e) => setThird(e.target.value)} />
          </label>
        </div>
        <div className="confirm__actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={!valid}>Save</button>
        </div>
      </form>
    </dialog>
  )
}