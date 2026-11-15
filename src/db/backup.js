import { db } from './db'

const TABLES = ['groups', 'counters', 'events', 'reports']

export async function exportBackup() {
  const data = {}
  for (const table of TABLES) data[table] = await db[table].toArray()

  const backup = { app: 'easy-count', version: 1, exportedAt: new Date().toISOString(), data }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `easy-count-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function importBackup(file) {
  const backup = JSON.parse(await file.text())
  if (backup?.app !== 'easy-count' || !backup.data) {
    throw new Error('This is not an Easy-Count backup file')
  }

  let count = 0
  await db.transaction('rw', TABLES.map((t) => db[t]), async () => {
    for (const table of TABLES) {
      const rows = (backup.data[table] || []).map((row) => ({ ...row, synced: 0 }))
      await db[table].bulkPut(rows)
      count += rows.length
    }
  })
  return count
}