import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { resetType, resetAll } from '../../db/actions'
import Icon from '../../components/Icon/Icon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import MultiView from './MultiView'
import './Counter.css'

export default function Counter() {
  const { id } = useParams()
  const counter = useLiveQuery(() => db.counters.get(id).then((c) => c ?? null), [id])
  const [pendingReset, setPendingReset] = useState(null)

  if (counter === undefined) return null

  if (counter === null) {
    return (
      <main className="counter counter--empty">
        <p>Counter not found.</p>
        <Link to="/" className="primary-btn">Back to home</Link>
      </main>
    )
  }

  const mode = counter.limit ? 'limit' : counter.types.length > 1 ? 'multi' : 'single'
  const total = counter.types.reduce((sum, t) => sum + t.count, 0)

  const confirmReset = async () => {
    if (pendingReset.kind === 'all') {
      await resetAll(counter.id)
    } else {
      await resetType(counter.id, pendingReset.typeId)
    }
    setPendingReset(null)
  }

  return (
    <main className="counter">
      <header className="counter__header">
        <Link to="/" className="glass-btn" aria-label="Back to home">
          <Icon name="back" />
        </Link>
        <div className="counter__title">
          <span className="counter__mode">{mode} counter</span>
          <h1>{counter.name}</h1>
        </div>
        <button
          className="glass-btn"
          onClick={() => setPendingReset({ kind: 'all' })}
          disabled={total === 0}
          aria-label="Reset all counts"
        >
          <Icon name="reset" />
        </button>
      </header>

      <MultiView
        counter={counter}
        onResetType={(type) => setPendingReset({ kind: 'one', typeId: type.id, name: type.name })}
      />

      <ConfirmDialog
        open={pendingReset !== null}
        title={pendingReset?.kind === 'all' ? 'Reset all counts?' : `Reset ${pendingReset?.name}?`}
        message={
          pendingReset?.kind === 'all'
            ? 'All types will go back to 0. The resets stay visible in the action log.'
            : 'This type will go back to 0. The reset stays visible in the action log.'
        }
        confirmLabel="Reset"
        onConfirm={confirmReset}
        onCancel={() => setPendingReset(null)}
      />
    </main>
  )
}