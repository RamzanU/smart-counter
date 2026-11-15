import { useParams, Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import Icon from '../../components/Icon/Icon'
import MultiView from './MultiView'
import './Counter.css'

export default function Counter() {
  const { id } = useParams()
  const counter = useLiveQuery(() => db.counters.get(id).then((c) => c ?? null), [id])

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
        <span className="counter__spacer" />
      </header>

      <MultiView counter={counter} />
    </main>
  )
}