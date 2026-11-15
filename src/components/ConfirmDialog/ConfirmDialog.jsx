import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleCancel = (e) => {
    e.preventDefault()
    onCancel()
  }

  return (
    <dialog ref={ref} className="confirm" onCancel={handleCancel}>
      <h2 className="confirm__title">{title}</h2>
      <p className="confirm__message">{message}</p>
      <div className="confirm__actions">
        <button className="ghost-btn" onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button className="danger-btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}