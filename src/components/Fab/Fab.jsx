import { Link } from 'react-router-dom'
import Icon from '../Icon/Icon'
import './Fab.css'

export default function Fab({ label, to, onClick }) {
  const content = (
    <>
      <Icon name="plus" size={22} />
      <span>{label}</span>
    </>
  )

  if (to) {
    return <Link to={to} className="fab">{content}</Link>
  }

  return (
    <button className="fab" onClick={onClick}>
      {content}
    </button>
  )
}