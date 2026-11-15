import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { supabase } from '../../db/supabase';
import useOnline from '../../hooks/useOnline'
import './SyncStatus.css'

const TABLES = ['groups', 'counters', 'events', 'reports']

export default function SyncStatus() {
  const online = useOnline()
  const pending = useLiveQuery(async () => {
    const counts = await Promise.all(TABLES.map((t) => db[t].where('synced').equals(0).count()))
    return counts.reduce((a, b) => a + b, 0)
  }, [])

  let state = 'synced'
  let text = 'Synced'
  if (!supabase) {
    state = 'local'
    text = 'Local only'
  } else if (!online) {
    state = 'offline'
    text = pending ? `Offline · ${pending} pending` : 'Offline'
  } else if (pending) {
    state = 'syncing'
    text = `Syncing ${pending}…`
  }

  return (
    <span className={`sync-status sync-status--${state}`} role="status">
      <span className="sync-status__dot" />
      {text}
    </span>
  )
}