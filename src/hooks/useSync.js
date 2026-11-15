import { useEffect } from 'react'
import { pushChanges, pullChanges } from '../db/sync'

export default function useSync() {
  useEffect(() => {
    const syncAll = async () => {
      await pushChanges()
      await pullChanges()
    }

    syncAll()

    const onOnline = () => syncAll()
    const onHide = () => {
      if (document.visibilityState === 'hidden') pushChanges()
    }

    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onHide)
    const timer = setInterval(pushChanges, 15000)

    return () => {
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onHide)
      clearInterval(timer)
    }
  }, [])
}