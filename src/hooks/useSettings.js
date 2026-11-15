import { useSyncExternalStore } from 'react'
import { getSettings, subscribeSettings } from '../utils/settings'

export default function useSettings() {
  return useSyncExternalStore(subscribeSettings, getSettings)
}