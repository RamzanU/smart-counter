import { useRegisterSW } from 'virtual:pwa-register/react'
import './UpdatePrompt.css'

export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const closePrompt = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="update-prompt" role="status">
      <span>
        {needRefresh ? 'New version available' : 'App ready to work offline'}
      </span>
      {needRefresh && (
        <button className="update-prompt__reload" onClick={() => updateServiceWorker(true)}>
          Reload
        </button>
      )}
      <button className="update-prompt__close" onClick={closePrompt} aria-label="Close">
        ✕
      </button>
    </div>
  )
}