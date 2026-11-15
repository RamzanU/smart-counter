import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon/Icon'
import './AmountDialog.css'

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export default function AmountDialog({ open, title, onSubmit, onCancel }) {
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

  const press = (digit) => {
    navigator.vibrate?.(5)
    setValue((v) => (v.length >= 4 ? v : (v + digit).replace(/^0+/, '')))
  }

  const backspace = () => setValue((v) => v.slice(0, -1))

  const amount = Number(value)

  return (
    <dialog ref={ref} className="confirm amount" onCancel={(e) => { e.preventDefault(); onCancel() }}>
      <h2 className="confirm__title">{title}</h2>

      <div className="amount__display">
        <span className="amount__value">{value || '0'}</span>
        <button className="amount__back" onClick={backspace} disabled={!value} aria-label="Delete last digit">
          <Icon name="backspace" />
        </button>
      </div>

      <div className="amount__pad">
        {DIGITS.map((d) => (
          <button key={d} className="key" onClick={() => press(d)}>{d}</button>
        ))}
        <button className="key key--zero" onClick={() => press('0')}>0</button>
      </div>

      <div className="confirm__actions">
        <button className="ghost-btn" onClick={onCancel}>Cancel</button>
        <button className="primary-btn" onClick={() => onSubmit(amount)} disabled={amount < 1}>
          {amount > 0 ? `Add +${amount}` : 'Add'}
        </button>
      </div>
    </dialog>
  )
}