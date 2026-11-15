import { useEffect, useRef } from 'react'
import './ActionSheet.css'

export default function ActionSheet({ title, actions, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="sheet"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="sheet__body">
        {title && <p className="sheet__title">{title}</p>}
        <ul className="sheet__list">
          {actions.map((a) => (
            <li key={a.label}>
              <button
                type="button"
                className={a.danger ? 'sheet__item sheet__item--danger' : 'sheet__item'}
                onClick={a.onClick}
              >
                {a.label}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="sheet__cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </dialog>
  )
}