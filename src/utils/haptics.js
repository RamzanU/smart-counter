import { getSettings } from './settings'

export function vibrate(pattern) {
  if (!getSettings().vibration) return
  if ('vibrate' in navigator) navigator.vibrate(pattern)
}