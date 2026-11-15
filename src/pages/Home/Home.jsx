import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { createGroup } from '../../db/actions'
import { modeOf } from '../../utils/counter'
import Icon from '../../components/Icon/Icon'
import PromptDialog from '../../components/PromptDialog/PromptDialog'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [addingGroup, setAddingGroup] = useState(false)

  const groups = useLiveQuery(
    () => db.groups.orderBy('name').filter((g) => !g.deleted).toArray(),
    []
  )
  const counters = useLiveQuery(
    () => db.counters.filter((c) => !c.deleted).toArray(),
    []
  )

  if (groups === undefined || counters === undefined) return null

  const countersOf = (groupId) => counters.filter((c) => c.groupId === groupId)

  const handleAddGroup = async (name) => {
    const id = await createGroup(name)
    setAddingGroup(false)
    navigate(`/group/${id}`)
  }

  return (
    <main className="home">
      <header className="home__header">
        <h1>Easy-Count</h1>
      </header>

      {groups.length === 0 && (
        <section className="home__empty">
          <p>No groups yet.</p>
          <p>Create a group, then add counters inside it.</p>
        </section>
      )}

      <div className="group-grid">
        {groups.map((g) => {
          const items = countersOf(g.id)
          return (
            <Link key={g.id} to={`/group/${g.id}`} className="group-tile">
              <span className="group-tile__icons">
                {items.slice(0, 4).map((c) => (
                  <span key={c.id} className="group-tile__icon">
                    <Icon name={modeOf(c)} size={16} />
                  </span>
                ))}
              </span>
              <span className="group-tile__name">{g.name}</span>
              <span className="group-tile__meta">
                {items.length} {items.length === 1 ? 'counter' : 'counters'}
              </span>
            </Link>
          )
        })}

        <button className="group-tile group-tile--add" onClick={() => setAddingGroup(true)}>
          <Icon name="plus" size={28} />
          <span className="group-tile__name">Add group</span>
        </button>
      </div>

      <PromptDialog
        open={addingGroup}
        title="New group"
        label="Group name"
        placeholder="e.g. Magazijn 1"
        submitLabel="Create"
        onSubmit={handleAddGroup}
        onCancel={() => setAddingGroup(false)}
      />
    </main>
  )
}