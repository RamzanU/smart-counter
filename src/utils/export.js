const slug = (text) => text.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()

export const fileName = (report, ext) =>
  `${slug(report.title)}-${new Date(report.endedAt).toISOString().slice(0, 10)}.${ext}`

const csvCell = (value) => {
  const s = String(value ?? '')
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function reportToCsv(events, typeName) {
  const rows = [['time', 'type', 'change', 'kind', 'lat', 'lng']]
  for (const e of events) {
    rows.push([
      new Date(e.at).toISOString(),
      typeName(e.typeId),
      e.delta,
      e.kind ?? 'count',
      e.lat ?? '',
      e.lng ?? '',
    ])
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\n')
}

export function reportToJson(report, events, typeName) {
  return JSON.stringify(
    {
      title: report.title,
      countedBy: report.by,
      startedAt: new Date(report.startedAt).toISOString(),
      endedAt: new Date(report.endedAt).toISOString(),
      total: report.total,
      limit: report.limit,
      totals: report.totals.map((t) => ({ type: t.name, count: t.count })),
      actions: events.map((e) => ({
        time: new Date(e.at).toISOString(),
        type: typeName(e.typeId),
        change: e.delta,
        kind: e.kind ?? 'count',
        lat: e.lat,
        lng: e.lng,
      })),
    },
    null,
    2
  )
}

export function downloadFile(name, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export async function shareFile(name, content, type) {
  const file = new File([content], name, { type })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: name })
  }
}

export const canShareFiles = () =>
  typeof navigator.canShare === 'function' &&
  navigator.canShare({ files: [new File([''], 'test.csv', { type: 'text/csv' })] })