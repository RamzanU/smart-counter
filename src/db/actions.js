import { db } from './db'

const uuid = () => crypto.randomUUID()

// Create a counter: 1 type = single, several = multi, limit = number or null
export async function createCounter({ name, types, limit = null, by = '', trackLocation = true }) {
  const now = Date.now()
  const counter = {
    id: uuid(),
    name,
    types: types.map((typeName) => ({ id: uuid(), name: typeName, count: 0 })),
    limit,
    step: 1,
    by,
    trackLocation,
    sessionStart: now,
    createdAt: now,
    updatedAt: now,
    synced: 0,
  }
  await db.counters.add(counter)
  return counter.id
}