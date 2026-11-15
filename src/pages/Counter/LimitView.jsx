import { useState } from 'react'
import { count } from '../../db/actions'
import Icon from '../../components/Icon/Icon'
import BigCircleButton from '../../components/BigCircleButton/BigCircleButton'
import './LimitView.css'

export default function LimitView({ counter, onCustomAmount }) {
  const [blocked, setBlocked] = useState(false)
  const type = counter.types[0]
  const step = counter.step
  const goal = counter.limit
  const total = counter.types.reduce((sum, t) => sum + t.count, 0)
  const left = goal - total
  const done = total >= goal

  const tap = async (delta) => {
    const ok = await count(counter.id, type.id, delta)
    if (ok) {
      navigator.vibrate?.(10)
      if (delta > 0 && total + delta === goal) navigator.vibrate?.([200, 100, 200])
    } else {
      navigator.vibrate?.([60, 40, 60, 40, 60])
      setBlocked(true)
      setTimeout(() => setBlocked(false), 1500)
    }
  }

  const status = done
    ? 'Goal reached ✓'
    : blocked
      ? `Only ${left} left`
      : `${left} to go`

  return (
    <section className="limit">
      <p
        className={[
          'limit__status',
          done && 'limit__status--done',
          blocked && !done && 'limit__status--blocked',
        ].filter(Boolean).join(' ')}
        role="status"
      >
        {status}
      </p>
      <BigCircleButton
        label={type.name}
        value={total}
        sub={`of ${goal}`}
        progress={total / goal}
        ringColor={done ? '#4ade80' : '#ffffff'}
        shake={blocked}
        onTap={() => tap(step)}
        onLongPress={() => onCustomAmount(type)}
        ariaLabel={`Add ${step}. ${total} of ${goal}. Hold for a custom amount.`}
      />
      <div className="limit__controls">
        <button
          className="ring-btn"
          onClick={() => tap(-step)}
          disabled={total === 0}
          aria-label={`Subtract ${step}`}
        >
          <Icon name="minus" />
        </button>
      </div>
    </section>
  )
}