import { db } from './db'

const uuid = () => crypto.randomUUID()

// Create a counter: 1 type = single, several = multi, limit = number or null
export async function createCounter({ name, types, limit = null, by = '', trackLocation = true, groupId = null }) {
  const now = Date.now()
  const counter = {
    id: uuid(),
    name,
    types: types.map((typeName) => ({ id: uuid(), name: typeName, count: 0 })),
    limit,
    step: 1,
    steps: [1, 5, 10],
    by,
    trackLocation,
    groupId,
    sessionStart: now,
    createdAt: now,
    updatedAt: now,
    synced: 0,
  }
  await db.counters.add(counter)
  return counter.id
}

// One tap: +delta or -delta on one type, logged as an event.
// Returns false if blocked (below 0 or over the limit).
export async function count(counterId, typeId, delta, position = null, extra = {}) {
  return db.transaction('rw', db.counters, db.events, async () => {
    const counter = await db.counters.get(counterId)
    const type = counter.types.find((t) => t.id === typeId)
    if (type.count + delta < 0) return false

    if (counter.limit && delta > 0) {
      const total = counter.types.reduce((sum, t) => sum + t.count, 0)
      if (total + delta > counter.limit) return false
    }

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
    return true
  })
}

// Reset one type to 0 (logged as a 'reset' event)
export async function resetType(counterId, typeId) {
  const counter = await db.counters.get(counterId)
  const type = counter.types.find((t) => t.id === typeId)
  if (type.count === 0) return
  await count(counterId, typeId, -type.count, null, { kind: 'reset' })
}

// Reset all types to 0 (each logged as a 'reset' event)
export async function resetAll(counterId) {
  const counter = await db.counters.get(counterId)
  for (const type of counter.types) {
    if (type.count > 0) {
      await count(counterId, type.id, -type.count, null, { kind: 'reset' })
    }
  }
}

// Change active step
export async function setStep(counterId, step) {
  await db.counters.update(counterId, { step, updatedAt: Date.now(), synced: 0 })
}

// Save custom step presets, e.g. [1, 12, 24]
export async function setStepPresets(counterId, steps) {
  await db.counters.update(counterId, { steps, step: 1, updatedAt: Date.now(), synced: 0 })
}

// Add a type to an existing counter (single becomes multi)
export async function addType(counterId, name) {
  const counter = await db.counters.get(counterId)
  const types = [...counter.types, { id: uuid(), name, count: 0 }]
  await db.counters.update(counterId, { types, updatedAt: Date.now(), synced: 0 })
}

// Save current session as a report, then start a new session
export async function saveReport(counterId) {
  const counter = await db.counters.get(counterId)
  const now = Date.now()
  const reportId = uuid()

  await db.transaction('rw', db.reports, db.counters, async () => {
    await db.reports.add({
      id: reportId,
      counterId,
      title: counter.name,
      by: counter.by,
      startedAt: counter.sessionStart,
      endedAt: now,
      totals: counter.types.map((t) => ({ typeId: t.id, name: t.name, count: t.count })),
      total: counter.types.reduce((sum, t) => sum + t.count, 0),
      limit: counter.limit,
      groupId: null,
      synced: 0,
    })
    await db.counters.update(counterId, {
      types: counter.types.map((t) => ({ ...t, count: 0 })),
      sessionStart: now,
      updatedAt: now,
      synced: 0,
    })
  })
  return reportId
}

// Create a group (folder of counters)
export async function createGroup(name) {
  const now = Date.now()
  const id = uuid()
  await db.groups.add({ id, name, createdAt: now, updatedAt: now, synced: 0 })
  return id
}

// Move a counter into a group (or out of it with groupId = null)
export async function setCounterGroup(counterId, groupId) {
  await db.counters.update(counterId, { groupId, updatedAt: Date.now(), synced: 0 })
}

// Soft delete a counter (kept with deleted: 1 so sync can see it)
export async function deleteCounter(counterId) {
  await db.counters.update(counterId, { deleted: 1, updatedAt: Date.now(), synced: 0 })
}

// Soft delete a group and all its counters
export async function deleteGroup(groupId) {
  const now = Date.now()
  await db.transaction('rw', db.groups, db.counters, async () => {
    await db.groups.update(groupId, { deleted: 1, updatedAt: now, synced: 0 })
    await db.counters
      .where('groupId').equals(groupId)
      .modify({ deleted: 1, updatedAt: now, synced: 0 })
  })
}