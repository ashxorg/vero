import { Heart, Calendar, LayoutDashboard } from 'lucide-react'
import { clsx } from 'clsx'

interface HeaderProps {
  isAdmin: boolean
  onToggle: () => void
}

export function Header({ isAdmin, onToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-500 text-white rounded-lg p-1.5">
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Vero Health</span>
        </div>

        <div className="bg-gray-100 rounded-full p-1 flex items-center gap-1">
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
