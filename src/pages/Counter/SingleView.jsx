import { count } from '../../db/actions'
import Icon from '../../components/Icon/Icon'
import BigCircleButton from '../../components/BigCircleButton/BigCircleButton'
import './SingleView.css'

export default function SingleView({ counter, onCustomAmount, onAddType }) {
  const type = counter.types[0]
  const step = counter.step

  const tap = (delta) => {
    navigator.vibrate?.(10)
    count(counter.id, type.id, delta)
  }

  return (
    <section className="single">
      <BigCircleButton
        label={type.name}
        value={type.count}
        sub="tap to count · hold for amount"
        onTap={() => tap(step)}
        onLongPress={() => onCustomAmount(type)}
        ariaLabel={`Add ${step} to ${type.name}. Hold for a custom amount.`}
      />
      <div className="single__controls">
        <button className="ghost-btn single__add" onClick={onAddType}>
          <Icon name="plus" size={18} /> Add type
        </button>
        <button
          className="ring-btn"
          onClick={() => tap(-step)}
          disabled={type.count === 0}
          aria-label={`Subtract ${step}`}
        >
          <Icon name="minus" />
        </button>
      </div>
    </section>
  )
}