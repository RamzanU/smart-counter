import { useRef } from 'react'

export default function useLongPress(onLongPress, onClick, ms = 500) {
  const timer = useRef(null)
  const fired = useRef(false)

  const start = () => {
    fired.current = false
    timer.current = setTimeout(() => {
      fired.current = true
      navigator.vibrate?.(30)
      onLongPress()
    }, ms)
  }

  const cancel = () => clearTimeout(timer.current)

  const click = () => {
    if (!fired.current) onClick()
  }

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onClick: click,
    onContextMenu: (e) => e.preventDefault(),
  }
}