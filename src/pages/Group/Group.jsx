import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { modeOf, totalOf } from '../../utils/counter'
import Icon from '../../components/Icon/Icon'
import './Group.css'

export default function Group() {
  const { id } = useParams()

  const group = useLiveQuery(
    () => db.groups.get(id).then((g) => (g && !g.deleted ? g : null)),
    [id]
  )
  const counters = useLiveQuery(
    () => db.counters.where('groupId').equals(id).filter((c) => !c.deleted).sortBy('name'),
    [id]
  )

  if (group === undefined || counters === undefined) return null

  if (group === null) {
    return (
      <main className="group">
        <p>Group not found.</p>
        <Link to="/" className="primary-btn group__new">Back to home</Link>
      </main>
    )
  }

  return (
    <main className="group">
      <header className="group__header">
        <Link to="/" className="glass-btn" aria-label="Back to home">
          <Icon name="back" />
        </Link>
        <div className="group__title">
          <span className="group__kicker">Group</span>
          <h1>{group.name}</h1>
        </div>
        <span className="group__spacer" />
      </header>

      {counters.length === 0 && (
        <p className="group__empty">No counters in this group yet.</p>
      )}

      <ul className="counter-list">
        {counters.map((c) => (
          <li key={c.id}>
            <Link to={`/counter/${c.id}`} className="counter-item">
              <span className="counter-item__icon">
                <Icon name={modeOf(c)} size={20} />
              </span>
              <span className="counter-item__info">
                <span className="counter-item__name">{c.name}</span>
                <span className="counter-item__meta">
                  {modeOf(c)}{c.limit ? ` · goal ${c.limit}` : ''}
                </span>
              </span>
              <span className="counter-item__total">{totalOf(c)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to={`/group/${id}/new`} className="primary-btn group__new">
        <Icon name="plus" size={20} /> New counter
      </Link>
    </main>
  )
}