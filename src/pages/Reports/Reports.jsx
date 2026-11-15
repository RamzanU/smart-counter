import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { formatDateTime } from '../../utils/format'
import './Reports.css'

export default function Reports() {
  const reports = useLiveQuery(() => db.reports.orderBy('endedAt').reverse().toArray(), [])
  const groups = useLiveQuery(() => db.groups.toArray(), [])

  if (reports === undefined || groups === undefined) return null

  const groupName = (id) => groups.find((g) => g.id === id)?.name ?? 'No group'

  const sections = []
  for (const r of reports) {
    let section = sections.find((s) => s.groupId === r.groupId)
    if (!section) {
      section = { groupId: r.groupId, name: groupName(r.groupId), items: [] }
      sections.push(section)
    }
    section.items.push(r)
  }

  return (
    <main className="reports">
      <h1>Reports</h1>

      {reports.length === 0 && (
        <p className="reports__empty">No reports yet. Use “Save as report” on a counter.</p>
      )}

      {sections.map((s) => (
        <section key={s.groupId ?? 'none'} className="reports__section">
          <h2>{s.name}</h2>
          <ul className="report-list">
            {s.items.map((r) => (
              <li key={r.id}>
                <Link to={`/report/${r.id}`} className="report-item">
                  <span className="report-item__info">
                    <span className="report-item__title">{r.title}</span>
                    <span className="report-item__meta">
                      {formatDateTime(r.endedAt)}{r.by ? ` · ${r.by}` : ''}
                    </span>
                  </span>
                  <span className="report-item__total">{r.total}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}