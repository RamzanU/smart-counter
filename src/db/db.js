import Dexie from 'dexie'

export const db = new Dexie('easy-count')

db.version(1).stores({
  counters: 'id, updatedAt, synced',
  events: 'id, counterId, at, synced',
  reports: 'id, counterId, groupId, endedAt, synced',
  groups: 'id, synced',
})

db.version(2).stores({
  counters: 'id, updatedAt, synced, groupId',
  groups: 'id, name, synced',
})