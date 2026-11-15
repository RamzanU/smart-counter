import { db } from './db'
import { supabase } from './supabase'

const TABLES = ['groups', 'counters', 'events', 'reports']

const versionOf = (row) => row.updatedAt ?? row.endedAt ?? row.at ?? 0

let running = false

export async function pushChanges() {
 if (!supabase || running || !navigator.onLine) return
  running = true

  try {
    for (const table of TABLES) {
      const rows = await db[table].where('synced').equals(0).toArray()
      if (rows.length === 0) continue

      const payload = rows.map((row) => {
        const data = { ...row }
        delete data.synced
        return { id: row.id, data, updated_at: versionOf(row) }
      })

      const { error } = await supabase.from(table).upsert(payload)
      if (error) throw error

      await db.transaction('rw', db[table], async () => {
        for (const row of rows) {
          await db[table].where('id').equals(row.id).modify((current) => {
            if (versionOf(current) === versionOf(row)) current.synced = 1
          })
        }
      })
    }
  } catch (err) {
    console.warn('Sync failed, will retry later', err)
  } finally {
    running = false
  }
}

export async function pullChanges() {
  if (!supabase || running || !navigator.onLine) return

  try {
    for (const table of TABLES) {
      const { data: remote, error } = await supabase.from(table).select('id, data, updated_at')
      if (error) throw error

      await db.transaction('rw', db[table], async () => {
        for (const row of remote) {
          const local = await db[table].get(row.id)
          const isNew = !local
          const isNewer = local && local.synced === 1 && row.updated_at > versionOf(local)
          if (isNew || isNewer) {
            await db[table].put({ ...row.data, synced: 1 })
          }
        }
      })
    }
  } catch (err) {
    console.warn('Pull failed, will retry later', err)
  }
}