import { NavLink, Link } from 'react-router-dom'
import Icon from '../Icon/Icon'
import './BottomNav.css'

export default function BottomNav() {
  const tabClass = ({ isActive }) => (isActive ? 'tab tab--active' : 'tab')

  return (
    <nav className="bottom-nav" aria-label="Main">
      <NavLink to="/" end className={tabClass}>
        <Icon name="home" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/reports" className={tabClass}>
        <Icon name="chart" />
        <span>Reports</span>
      </NavLink>
      <NavLink to="/settings" className={tabClass}>
        <Icon name="settings" />
        <span>Settings</span>
      </NavLink>
    </nav>
  )
}