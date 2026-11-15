import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { createGroup, updateGroup, deleteGroup } from '../../db/actions'
import { modeOf } from '../../utils/counter'
import Icon from '../../components/Icon/Icon'
import Fab from '../../components/Fab/Fab'
import SyncStatus from '../../components/SyncStatus/SyncStatus'
import GroupDialog from '../../components/GroupDialog/GroupDialog'
import ActionSheet from '../../components/ActionSheet/ActionSheet'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import './Home.css'

const MODES = ['single', 'multi', 'limit']

function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [dialog, setDialog] = useState(null) // { mode: 'new' } | { mode: 'edit', group }
  const [menuGroup, setMenuGroup] = useState(null)
  const [deleting, setDeleting] = useState(null)

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

  const handleSave = async (name, color) => {
    if (dialog.mode === 'new') {
      const id = await createGroup(name, color)
      setDialog(null)
      navigate(`/group/${id}`)
    } else {
      await updateGroup(dialog.group.id, { name, color })
      setDialog(null)
    }
  }

  const handleDelete = async () => {
    await deleteGroup(deleting.id)
    setDeleting(null)
  }

  const openEdit = (group) => {
    setMenuGroup(null)
    setDialog({ mode: 'edit', group })
  }

  const deletingCount = deleting ? countersOf(deleting.id).length : 0

  return (
    <main className="home">
      <header className="home__header">
        <h1>Easy-Count</h1>
        <SyncStatus />
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
          const byMode = MODES
            .map((mode) => ({ mode, n: items.filter((c) => modeOf(c) === mode).length }))
            .filter((m) => m.n > 0)

          return (
            <div key={g.id} className="group-card">
              <Link
                to={`/group/${g.id}`}
                className={g.color ? 'group-tile group-tile--colored' : 'group-tile'}
                style={g.color ? { '--group-color': g.color } : undefined}
              >
                <span className="group-tile__icons">
                  {byMode.map((m) => (
                    <span key={m.mode} className="group-tile__icon">
                      <Icon name={m.mode} size={16} />
                      <span className="group-tile__count">{m.n}</span>
                    </span>
                  ))}
                </span>
                <span className="group-tile__name">{g.name}</span>
                <span className="group-tile__meta">
                  {items.length} {items.length === 1 ? 'counter' : 'counters'}
                </span>
              </Link>
              <button
                type="button"
                className="group-card__more"
                aria-label={`Options for ${g.name}`}
                onClick={() => setMenuGroup(g)}
              >
                <MoreIcon />
              </button>
            </div>
          )
        })}
      </div>

      <Fab label="New group" onClick={() => setDialog({ mode: 'new' })} />

      {menuGroup && (
        <ActionSheet
          title={menuGroup.name}
          onClose={() => setMenuGroup(null)}
          actions={[
            { label: 'Rename', onClick: () => openEdit(menuGroup) },
            { label: 'Change color', onClick: () => openEdit(menuGroup) },
            {
              label: 'Delete group',
              danger: true,
              onClick: () => {
                setDeleting(menuGroup)
                setMenuGroup(null)
              },
            },
          ]}
        />
      )}

      {dialog && (
        <GroupDialog
          title={dialog.mode === 'new' ? 'New group' : 'Edit group'}
          submitLabel={dialog.mode === 'new' ? 'Create' : 'Save'}
          initialName={dialog.group?.name}
          initialColor={dialog.group?.color || undefined}
          onSubmit={handleSave}
          onCancel={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.name}?`}
        message={`The group and its ${deletingCount} ${
          deletingCount === 1 ? 'counter' : 'counters'
        } will be deleted. Saved reports stay available.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </main>
  )
}