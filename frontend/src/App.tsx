import { useState } from 'react'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/Toast'
import { Header } from './components/Header'
import { BookingWizard } from './pages/BookingWizard'
import { AdminDashboard } from './pages/AdminDashboard'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <Header isAdmin={isAdmin} onToggle={() => setIsAdmin((v) => !v)} />
        <main className="pt-16">
          {isAdmin ? <AdminDashboard /> : <BookingWizard />}
        </main>
      </div>
      <ToastContainer />
    </ToastProvider>
  )
}
