import { count } from '../../db/actions'
import useLongPress from '../../hooks/useLongPress'
import Icon from '../../components/Icon/Icon'
import './MultiView.css'

const TILE_COLORS = ['#4b6fd1', '#e98a9b', '#3e9c82', '#e6aa5a', '#8b6fd1', '#5ab4e6']

function CounterRow({ counter, type, color, total, onResetType, onCustomAmount }) {
  const step = counter.step

  const tap = (delta) => {
    navigator.vibrate?.(10)
    count(counter.id, type.id, delta)
  }

  const pressHandlers = useLongPress(() => onCustomAmount(type), () => tap(step))

  return (
    <div className="row" style={{ '--tile-color': color }}>
      <button
        className="row__reset"
        onClick={() => onResetType(type)}
        disabled={type.count === 0}
        aria-label={`Reset ${type.name}`}
      >
        <Icon name="reset" size={18} />
      </button>
      <button
        className="row__minus"
        onClick={() => tap(-step)}
        aria-label={`Subtract ${step} from ${type.name}`}
      >
        <Icon name="minus" size={18} />
      </button>
      <button
        className="row__tap"
        {...pressHandlers}
        aria-label={`Add ${step} to ${type.name}. Hold for a custom amount.`}
      >
        <span className="row__info">
          <span className="row__name">{type.name}</span>
          <span className="row__pct">
            {total ? Math.round((type.count / total) * 100) : 0}%
          </span>
        </span>
        <span className="row__count">{type.count}</span>
      </button>
    </div>
  )
}

export default function MultiView({ counter, onResetType, onAddType, onCustomAmount }) {
  const total = counter.types.reduce((sum, t) => sum + t.count, 0)

  return (
    <section className="multi">
      <div className="multi__total">
        <span className="multi__total-number">{total}</span>
        <span className="multi__total-label">total</span>
      </div>

      <div className={counter.types.length > 5 ? 'multi__list multi__list--compact' : 'multi__list'}>
        {counter.types.map((type, i) => (
          <CounterRow
            key={type.id}
            counter={counter}
            type={type}
            color={TILE_COLORS[i % TILE_COLORS.length]}
            total={total}
            onResetType={onResetType}
            onCustomAmount={onCustomAmount}
          />
        ))}
      </div>

      <p className="multi__hint">Tap to count · hold for a custom amount</p>

      <button className="add-row" onClick={onAddType}>
        <Icon name="plus" size={18} /> Add type
      </button>
    </section>
  )
}