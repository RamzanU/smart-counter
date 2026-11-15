import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Group from './pages/Group/Group'
import NewCounter from './pages/NewCounter/NewCounter'
import Counter from './pages/Counter/Counter'
import Reports from './pages/Reports/Reports'
import ReportDetail from './pages/ReportDetail/ReportDetail'
import Settings from './pages/Settings/Settings'
import BottomNav from './components/BottomNav/BottomNav'
import UpdatePrompt from './components/UpdatePrompt/UpdatePrompt'
import useSync from './hooks/useSync'
import useSettings from './hooks/useSettings'
import './App.css'

export default function App() {
  useSync()
  const { pathname } = useLocation()
  const { leftHanded } = useSettings()

  const showNav = !pathname.startsWith('/counter/') && !pathname.endsWith('/new')
  const appClass = ['app', showNav && 'app--with-nav', leftHanded && 'app--lefty']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={appClass}>
      <UpdatePrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group/:id" element={<Group />} />
        <Route path="/group/:groupId/new" element={<NewCounter />} />
        <Route path="/counter/:id" element={<Counter />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/report/:id" element={<ReportDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}