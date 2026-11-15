import { useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { createCounter } from '../../db/actions'
import './NewCounter.css'
import Icon from '../../components/Icon/Icon'

const MODES = [
  { id: 'single', label: 'Single', hint: 'one big button' },
  { id: 'multi', label: 'Multi', hint: 'several types' },
  { id: 'limit', label: 'Limit', hint: 'count up to N' },
]

export default function NewCounter() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [mode, setMode] = useState('multi')
  const [name, setName] = useState('')
  const [types, setTypes] = useState(['', ''])
  const [limit, setLimit] = useState('')
  const [by, setBy] = useState(() => localStorage.getItem('by') ?? '')
  const [trackLocation, setTrackLocation] = useState(true)

  const cleanTypes = mode === 'multi'
    ? types.map((t) => t.trim()).filter(Boolean)
    : [name.trim()]

  const canSubmit =
    name.trim() !== '' &&
    cleanTypes.length > 0 &&
    (mode !== 'limit' || Number(limit) > 0)

  const updateType = (index, value) =>
    setTypes(types.map((t, i) => (i === index ? value : t)))
  const removeType = (index) => setTypes(types.filter((_, i) => i !== index))
  const addTypeField = () => setTypes([...types, ''])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    localStorage.setItem('by', by.trim())
    const id = await createCounter({
      name: name.trim(),
      types: cleanTypes,
      limit: mode === 'limit' ? Number(limit) : null,
      by: by.trim(),
      trackLocation,
      groupId,
    })
    navigate(`/counter/${id}`)
  }

  return (
    <main className="new-counter">
      <header className="new-counter__header">
        <Link to={`/group/${groupId}`} className="glass-btn" aria-label="Back">
            <Icon name="back" />
        </Link>
        <h1>New counter</h1>
      </header>

      <form onSubmit={handleSubmit} className="new-counter__form">
        <fieldset className="mode-picker">
          <legend>Counter type</legend>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={mode === m.id ? 'mode mode--active' : 'mode'}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
            >
              <strong>{m.label}</strong>
              <span>{m.hint}</span>
            </button>
          ))}
        </fieldset>

        <label className="field">
          <span>What are we counting?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bike parking · Campus" />
        </label>

        {mode === 'multi' && (
          <div className="field">
            <span>Types</span>
            {types.map((t, i) => (
              <div key={i} className="type-row">
                <input
                  value={t}
                  onChange={(e) => updateType(i, e.target.value)}
                  placeholder={`Type ${i + 1}`}
                  aria-label={`Type ${i + 1}`}
                />
                {types.length > 1 && (
                  <button type="button" onClick={() => removeType(i)} aria-label={`Remove type ${i + 1}`}>✕</button>
                )}
              </div>
            ))}
            <button type="button" className="add-type" onClick={addTypeField}>+ Add type</button>
          </div>
        )}

        {mode === 'limit' && (
          <label className="field">
            <span>Limit</span>
            <input type="number" min="1" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g. 120" />
          </label>
        )}

        <label className="field">
          <span>Counted by</span>
          <input value={by} onChange={(e) => setBy(e.target.value)} placeholder="Your name" />
        </label>

        <label className="toggle">
          <span>Save location with each count</span>
          <input type="checkbox" checked={trackLocation} onChange={(e) => setTrackLocation(e.target.checked)} />
        </label>

        <button type="submit" className="primary-btn" disabled={!canSubmit}>Start counting</button>
      </form>
    </main>
  )
}