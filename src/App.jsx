import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import UpdatePrompt from './components/UpdatePrompt/UpdatePrompt'
import BottomNav from './components/BottomNav/BottomNav'
import Home from './pages/Home/Home'
import Group from './pages/Group/Group'
import NewCounter from './pages/NewCounter/NewCounter'
import Counter from './pages/Counter/Counter'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import './App.css'

export default function App() {
  const { pathname } = useLocation()
  const showNav = !pathname.startsWith('/counter/') && !pathname.endsWith('/new')

  return (
    <div className={showNav ? 'app app--with-nav' : 'app'}>
      <UpdatePrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group/:id" element={<Group />} />
        <Route path="/group/:groupId/new" element={<NewCounter />} />
        <Route path="/counter/:id" element={<Counter />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}