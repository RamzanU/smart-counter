import { count } from '../../db/actions'
import Icon from '../../components/Icon/Icon'
import './MultiView.css'

const TILE_COLORS = ['#4b6fd1', '#e98a9b', '#3e9c82', '#e6aa5a', '#8b6fd1', '#5ab4e6']

export default function MultiView({ counter }) {
  const total = counter.types.reduce((sum, t) => sum + t.count, 0)
  const step = counter.step

  const tap = (typeId, delta) => {
    navigator.vibrate?.(10)
    count(counter.id, typeId, delta)
  }

  return (
    <section className="multi">
      <div className="multi__total">
        <span className="multi__total-number">{total}</span>
        <span className="multi__total-label">total</span>
      </div>

      <div className={counter.types.length > 5 ? 'multi__list multi__list--compact' : 'multi__list'}>
        {counter.types.map((type, i) => (
          <div
            key={type.id}
            className="row"
            style={{ '--tile-color': TILE_COLORS[i % TILE_COLORS.length] }}
          >
            <button
              className="row__minus"
              onClick={() => tap(type.id, -step)}
              aria-label={`Subtract ${step} from ${type.name}`}
            >
              <Icon name="minus" size={18} />
            </button>
            <button
              className="row__tap"
              onClick={() => tap(type.id, step)}
              aria-label={`Add ${step} to ${type.name}`}
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
        ))}
      </div>
    </section>
  )
}