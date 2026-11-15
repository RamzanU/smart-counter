import { useEffect, useRef, useState } from 'react'
import useSettings from '../../hooks/useSettings'
import useOnline from '../../hooks/useOnline'
import { setSetting } from '../../utils/settings'
import { syncNow, getLastSync } from '../../db/sync'
import { supabase } from '../../db/supabase'
import { exportBackup, importBackup } from '../../db/backup'
import SyncStatus from '../../components/SyncStatus/SyncStatus'
import './Settings.css'

const APP_VERSION = '1.0.0'

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const formatWhen = (ts) =>
  ts ? new Date(ts).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="settings__row">
      <div>
        <div className="settings__label">{label}</div>
        {hint && <div className="settings__hint">{hint}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? 'switch switch--on' : 'switch'}
        onClick={() => onChange(!checked)}
      >
        <span className="switch__thumb" />
      </button>
    </div>
  )
}

export default function Settings() {
  const settings = useSettings()
  const online = useOnline()
  const fileInput = useRef(null)

  const [lastSync, setLastSync] = useState(getLastSync)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [storage, setStorage] = useState(null)

  const standalone =
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true

  async function loadStorage() {
    if (!navigator.storage?.estimate) return
    const { usage, quota } = await navigator.storage.estimate()
    const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false
    setStorage({ usage, quota, persisted })
  }

  useEffect(() => {
    loadStorage()
  }, [])

  async function handleSync() {
    setSyncing(true)
    await syncNow()
    setLastSync(getLastSync())
    setSyncing(false)
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const count = await importBackup(file)
      setMessage(`Imported ${count} records`)
      loadStorage()
    } catch (err) {
      setMessage(err.message)
    }
  }

  async function handlePersist() {
    const granted = await navigator.storage.persist()
    setMessage(granted ? 'Data will be kept on this device' : 'The browser declined the request')
    loadStorage()
  }

  return (
    <main className="settings">
      <header className="settings__header">
        <h1>Settings</h1>
      </header>

      <section className="settings__section">
        <h2>Profile</h2>
        <div className="settings__card">
          <label className="settings__field">
            <span className="settings__label">Your name</span>
            <span className="settings__hint">Saved as “counted by” on new counters and reports</span>
            <input
              type="text"
              value={settings.by}
              placeholder="e.g. Ramzan"
              onChange={(e) => setSetting('by', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="settings__section">
        <h2>Counting</h2>
        <div className="settings__card">
          <Toggle
            label="Left-handed mode"
            hint="Puts the minus and reset buttons on the left"
            checked={settings.leftHanded}
            onChange={(value) => setSetting('leftHanded', value)}
          />
          <Toggle
            label="Vibration"
            hint="Short vibration on long press and when a limit is reached"
            checked={settings.vibration}
            onChange={(value) => setSetting('vibration', value)}
          />
        </div>
      </section>

      <section className="settings__section">
        <h2>Sync</h2>
        <div className="settings__card">
          <div className="settings__row">
            <div>
              <div className="settings__label">Status</div>
              <div className="settings__hint">Last sync: {formatWhen(lastSync)}</div>
            </div>
            <SyncStatus />
          </div>
          <button
            type="button"
            className="settings__btn"
            disabled={!supabase || !online || syncing}
            onClick={handleSync}
          >
            {syncing ? 'Syncing…' : 'Sync now'}
          </button>
        </div>
      </section>

      <section className="settings__section">
        <h2>Data</h2>
        <div className="settings__card">
          <div className="settings__hint">
            Download all groups, counters and reports as one file, or restore them on another device.
          </div>
          <div className="settings__actions">
            <button type="button" className="settings__btn" onClick={exportBackup}>
              Export backup
            </button>
            <button type="button" className="settings__btn" onClick={() => fileInput.current.click()}>
              Import backup
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImport}
          />
        </div>
      </section>

      {storage && (
        <section className="settings__section">
          <h2>Storage</h2>
          <div className="settings__card">
            <div className="settings__row">
              <div className="settings__label">Used on this device</div>
              <div className="settings__value">
                {formatBytes(storage.usage)} of {formatBytes(storage.quota)}
              </div>
            </div>
            <div className="settings__row">
              <div>
                <div className="settings__label">Persistent storage</div>
                <div className="settings__hint">
                  {storage.persisted
                    ? 'The browser will not clear your data'
                    : 'The browser may clear data when space runs low'}
                </div>
              </div>
              {!storage.persisted && (
                <button type="button" className="settings__btn settings__btn--small" onClick={handlePersist}>
                  Keep data
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="settings__section">
        <h2>About</h2>
        <div className="settings__card">
          <div className="settings__row">
            <div className="settings__label">Version</div>
            <div className="settings__value">{APP_VERSION}</div>
          </div>
          <div className="settings__row">
            <div className="settings__label">Running as</div>
            <div className="settings__value">{standalone ? 'Installed app' : 'Browser tab'}</div>
          </div>
          <div className="settings__row">
            <div className="settings__label">Connection</div>
            <div className="settings__value">{online ? 'Online' : 'Offline'}</div>
          </div>
        </div>
      </section>

      {message && (
        <p className="settings__message" role="status">
          {message}
        </p>
      )}
    </main>
  )
}