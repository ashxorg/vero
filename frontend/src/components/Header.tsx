import { Calendar, LayoutDashboard } from 'lucide-react'
import { clsx } from 'clsx'
import veroLogo from '../assets/v-logo.svg'

interface HeaderProps {
  isAdmin: boolean
  onToggle: () => void
}

export function Header({ isAdmin, onToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <img src={veroLogo} alt="Vero" className="h-7 w-auto" />
        </div>

        <div className="bg-gray-100/80 rounded-full p-1 flex items-center gap-1">
          <button
            onClick={() => isAdmin && onToggle()}
            className={clsx(
              'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              !isAdmin
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <Calendar size={15} />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Patient</span>
          </button>
          <button
            onClick={() => !isAdmin && onToggle()}
            className={clsx(
              'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              isAdmin
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Admin Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </div>
    </header>
  )
}
