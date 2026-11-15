import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { deleteCounter, deleteGroup } from '../../db/actions'
import { modeOf, totalOf } from '../../utils/counter'
import Icon from '../../components/Icon/Icon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import './Group.css'

export default function Group() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState(null)

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

  const confirmDelete = async () => {
    if (pendingDelete.kind === 'group') {
      await deleteGroup(id)
      navigate('/')
    } else {
      await deleteCounter(pendingDelete.id)
      setPendingDelete(null)
    }
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
        <button
          className="glass-btn"
          onClick={() => setPendingDelete({ kind: 'group' })}
          aria-label="Delete group"
        >
          <Icon name="trash" />
        </button>
      </header>

      {counters.length === 0 && (
        <p className="group__empty">No counters in this group yet.</p>
      )}

      <ul className="counter-list">
        {counters.map((c) => (
          <li key={c.id} className="counter-row">
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
            <button
              className="counter-row__delete"
              onClick={() => setPendingDelete({ kind: 'counter', id: c.id, name: c.name })}
              aria-label={`Delete ${c.name}`}
            >
              <Icon name="trash" size={18} />
            </button>
          </li>
        ))}
      </ul>

      <Link to={`/group/${id}/new`} className="primary-btn group__new">
        <Icon name="plus" size={20} /> New counter
      </Link>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.kind === 'group' ? `Delete ${group.name}?` : `Delete ${pendingDelete?.name}?`}
        message={
          pendingDelete?.kind === 'group'
            ? `The group and its ${counters.length} ${counters.length === 1 ? 'counter' : 'counters'} will be deleted.`
            : 'This counter will be deleted. Its saved reports stay available.'
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </main>
  )
}