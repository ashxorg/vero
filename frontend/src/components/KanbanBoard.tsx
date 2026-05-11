import { clsx } from 'clsx'
import { AppointmentCard } from './AppointmentCard'
import { Spinner } from './Spinner'
import type { Appointment, AppointmentStatus } from '../types'

interface Column {
  status: AppointmentStatus
  label: string
  headerBg: string
  badgeBg: string
  badgeText: string
  emptyText: string
}

const COLUMNS: Column[] = [
  {
    status: 'pending',
    label: 'Pending',
    headerBg: 'bg-warning-50 border-warning-100',
    badgeBg: 'bg-warning-500',
    badgeText: 'text-white',
    emptyText: 'No pending appointments',
  },
  {
    status: 'confirmed',
    label: 'Confirmed',
    headerBg: 'bg-success-50 border-success-100',
    badgeBg: 'bg-success-500',
    badgeText: 'text-white',
    emptyText: 'No confirmed appointments',
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    headerBg: 'bg-danger-50 border-danger-100',
    badgeBg: 'bg-danger-500',
    badgeText: 'text-white',
    emptyText: 'No cancelled appointments',
  },
]

interface KanbanBoardProps {
  appointments: Appointment[]
  onStatusChange: (id: number, status: AppointmentStatus) => Promise<void>
  loading: boolean
}

export function KanbanBoard({ appointments, onStatusChange, loading }: KanbanBoardProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const colAppts = appointments.filter((a) => a.status === col.status)
        return (
          <div key={col.status} className="flex flex-col gap-3">
            {/* Column header */}
            <div
              className={clsx(
                'flex items-center justify-between px-4 py-3 rounded-xl border',
                col.headerBg,
              )}
            >
              <span className="font-semibold text-gray-800 text-sm">{col.label}</span>
              <span
                className={clsx(
                  'text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.5rem] text-center',
                  col.badgeBg,
                  col.badgeText,
                )}
              >
                {colAppts.length}
              </span>
            </div>

            {/* Cards */}
            {colAppts.length === 0 ? (
              <div className="flex items-center justify-center h-28 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                {col.emptyText}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {colAppts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onStatusChange={(status) => onStatusChange(appt.id, status)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
