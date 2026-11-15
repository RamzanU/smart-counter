const KEY = 'easy-count-settings'
const DEFAULTS = { by: '', leftHanded: false, vibration: true }

const listeners = new Set()
let cache = load()

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY)) || {}
    return { ...DEFAULTS, by: localStorage.getItem('by') || '', ...saved }
  } catch {
    return { ...DEFAULTS }
  }
}

export const getSettings = () => cache

export function setSetting(key, value) {
  cache = { ...cache, [key]: value }
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* storage unavailable: keep the value in memory */
  }
  listeners.forEach((listener) => listener())
}

export function subscribeSettings(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}