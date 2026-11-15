import useLongPress from '../../hooks/useLongPress'
import './BigCircleButton.css'

export default function BigCircleButton({
  label,
  value,
  sub,
  onTap,
  onLongPress,
  progress = null,
  ringColor = '#fff',
  ariaLabel,
  shake = false,
}) {
  const handlers = useLongPress(onLongPress, onTap)
  const withProgress = progress !== null

  const style = withProgress
    ? { '--progress': `${Math.min(progress, 1) * 360}deg`, '--ring': ringColor }
    : undefined

    return (
    <div
      className={[
        'big-circle',
        withProgress && 'big-circle--progress',
        shake && 'big-circle--shake',
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <button className="big-circle__btn" {...handlers} aria-label={ariaLabel}>
        <span className="big-circle__label">{label}</span>
        <span className="big-circle__value">{value}</span>
        {sub && <span className="big-circle__sub">{sub}</span>}
      </button>
    </div>
  )
}