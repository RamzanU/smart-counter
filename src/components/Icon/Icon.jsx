const ICONS = {
  back: <path d="m15 18-6-6 6-6" />,
  forward: <path d="m9 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M20 6 9 17l-5-5" />,
  undo: (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20l4-1 11-11-3-3L5 16z" />
      <path d="M14 6l3 3" />
    </>
  ),
  wand: (
    <>
      <path d="M4 20 15 9" />
      <path d="m14 6 4 4" />
      <path d="M6 4v3M4.5 5.5h3M18 15v3M16.5 16.5h3M11 3v2M10 4h2" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,

  reset: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
}

export default function Icon({ name, size = 22, strokeWidth = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

