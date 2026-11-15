import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { resetType, resetAll, addType, count, saveReport } from '../../db/actions'
import Icon from '../../components/Icon/Icon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import MultiView from './MultiView'
import './Counter.css'
import StepPicker from '../../components/StepPicker/StepPicker'
import PromptDialog from '../../components/PromptDialog/PromptDialog'
import AmountDialog from '../../components/AmountDialog/AmountDialog'

export default function Counter() {
  const { id } = useParams()
  const counter = useLiveQuery(() => db.counters.get(id).then((c) => c ?? null), [id])
  const [pendingReset, setPendingReset] = useState(null)
  const [addingType, setAddingType] = useState(false)
  const [customType, setCustomType] = useState(null)
  const [saved, setSaved] = useState(false)

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

    const handleSave = async () => {
    await saveReport(counter.id)
    navigator.vibrate?.([20, 40, 20])
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

      <StepPicker counter={counter} />

      <MultiView
        counter={counter}
        onResetType={(type) => setPendingReset({ kind: 'one', typeId: type.id, name: type.name })}
        onAddType={() => setAddingType(true)}
        onCustomAmount={(type) => setCustomType(type)}
      />

      <footer className="counter__actions">
        <button className="primary-btn" onClick={handleSave} disabled={total === 0}>
          {saved ? 'Saved ✓' : 'Save as report'}
        </button>
      </footer>

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

      <PromptDialog
        open={addingType}
        title="Add type"
        label="Type name"
        placeholder="e.g. Cargo bike"
        submitLabel="Add"
        onSubmit={async (name) => {
          await addType(counter.id, name)
          setAddingType(false)
        }}
        onCancel={() => setAddingType(false)}
      />
      <AmountDialog
        open={customType !== null}
        title={`Add to ${customType?.name}`}
        onSubmit={async (amount) => {
          await count(counter.id, customType.id, amount)
          setCustomType(null)
        }}
        onCancel={() => setCustomType(null)}
      />

    </main>
  )
}