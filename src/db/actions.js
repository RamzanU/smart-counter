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

// One tap: +step or -step on one type, logged as an event
export async function count(counterId, typeId, delta, position = null, extra = {}) {
  await db.transaction('rw', db.counters, db.events, async () => {
    const counter = await db.counters.get(counterId)
    const type = counter.types.find((t) => t.id === typeId)
    if (type.count + delta < 0) return

    const now = Date.now()
    type.count += delta
    await db.counters.update(counterId, { types: counter.types, updatedAt: now, synced: 0 })
    await db.events.add({
      id: uuid(),
      counterId,
      typeId,
      delta,
      at: now,
      lat: position?.lat ?? null,
      lng: position?.lng ?? null,
      synced: 0,
      ...extra,
    })
  })
}