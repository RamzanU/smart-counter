import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { formatDateTime, formatTime, formatDuration } from '../../utils/format'
import { fileName, reportToCsv, reportToJson, downloadFile, shareFile, canShareFiles } from '../../utils/export'
import Icon from '../../components/Icon/Icon'
import './ReportDetail.css'

export default function ReportDetail() {
  const { id } = useParams()
  const [tab, setTab] = useState('counts')

  const report = useLiveQuery(() => db.reports.get(id).then((r) => r ?? null), [id])
  const events = useLiveQuery(async () => {
    const r = await db.reports.get(id)
    if (!r) return []
    return db.events
      .where('counterId').equals(r.counterId)
      .filter((e) => e.at >= r.startedAt && e.at <= r.endedAt)
      .sortBy('at')
  }, [id])

  if (report === undefined || events === undefined) return null

  if (report === null) {
    return (
      <main className="report">
        <p>Report not found.</p>
        <Link to="/reports" className="primary-btn">Back to reports</Link>
      </main>
    )
  }

  const typeName = (typeId) => report.totals.find((t) => t.typeId === typeId)?.name ?? 'Unknown'
  const csv = () => reportToCsv(events, typeName)
  const json = () => reportToJson(report, events, typeName)

  return (
    <main className="report">
      <header className="report__header">
        <Link to="/reports" className="glass-btn" aria-label="Back to reports">
          <Icon name="back" />
        </Link>
        <div className="report__title">
          <h1>{report.title}</h1>
          <p>
            {formatDateTime(report.startedAt)} · {formatDuration(report.endedAt - report.startedAt)}
            {report.by ? ` · ${report.by}` : ''}
          </p>
        </div>
      </header>

      <div className="report__total">
        <span className="report__total-number">{report.total}</span>
        <span className="report__total-label">
          {report.limit ? `of ${report.limit}` : 'total'}
        </span>
      </div>

      <div className="report__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'counts'}
          className={tab === 'counts' ? 'report__tab report__tab--active' : 'report__tab'}
          onClick={() => setTab('counts')}
        >
          Counts
        </button>
        <button
          role="tab"
          aria-selected={tab === 'actions'}
          className={tab === 'actions' ? 'report__tab report__tab--active' : 'report__tab'}
          onClick={() => setTab('actions')}
        >
          Actions ({events.length})
        </button>
      </div>

      {tab === 'counts' && (
        <ul className="totals">
          {report.totals.map((t) => {
            const pct = report.total ? Math.round((t.count / report.total) * 100) : 0
            return (
              <li key={t.typeId ?? t.name} className="totals__row">
                <div className="totals__line">
                  <span>{t.name}</span>
                  <span className="totals__value">{t.count} · {pct}%</span>
                </div>
                <div className="totals__bar">
                  <div className="totals__fill" style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {tab === 'actions' && (
        <ol className="log">
          {events.length === 0 && <li className="log__empty">No actions recorded.</li>}
          {events.map((e) => (
            <li key={e.id} className={e.kind === 'reset' ? 'log__row log__row--reset' : 'log__row'}>
              <span className="log__time">{formatTime(e.at)}</span>
              <span className="log__type">{typeName(e.typeId)}</span>
              <span className="log__delta">
                {e.kind === 'reset' ? 'reset ' : ''}{e.delta > 0 ? `+${e.delta}` : e.delta}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="report__export">
        <button className="ghost-btn" onClick={() => downloadFile(fileName(report, 'csv'), csv(), 'text/csv')}>
          <Icon name="download" size={18} /> CSV
        </button>
        <button className="ghost-btn" onClick={() => downloadFile(fileName(report, 'json'), json(), 'application/json')}>
          <Icon name="download" size={18} /> JSON
        </button>
        {canShareFiles() && (
          <button className="primary-btn" onClick={() => shareFile(fileName(report, 'csv'), csv(), 'text/csv')}>
            Share
          </button>
        )}
      </div>
    </main>
  )
}