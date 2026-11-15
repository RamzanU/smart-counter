import { Routes, Route, Navigate } from 'react-router-dom'
import UpdatePrompt from './components/UpdatePrompt/UpdatePrompt'
import Home from './pages/Home/Home'
import NewCounter from './pages/NewCounter/NewCounter'
import Counter from './pages/Counter/Counter'
import './App.css'

export default function App() {
  return (
    <>
      <UpdatePrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewCounter />} />
        <Route path="/counter/:id" element={<Counter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}