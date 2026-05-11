import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { KanbanBoard } from '../components/KanbanBoard'
import { useToast } from '../context/ToastContext'
import { fetchAppointments, updateAppointmentStatus } from '../api'
import type { Appointment, AppointmentStatus } from '../types'

export function AdminDashboard() {
  const { addToast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<number, AppointmentStatus>>({})

  const load = useCallback(() => {
    setLoading(true)
    fetchAppointments()
      .then(setAppointments)
      .catch((err: Error) => addToast(err.message || 'Failed to load appointments', 'error'))
      .finally(() => setLoading(false))
  }, [addToast])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatusChange(id: number, newStatus: AppointmentStatus) {
    setOptimisticUpdates((prev) => ({ ...prev, [id]: newStatus }))
    try {
      const updated = await updateAppointmentStatus(id, newStatus)
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      addToast(
        `Appointment ${newStatus === 'confirmed' ? 'confirmed' : 'cancelled'} successfully`,
        'success',
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status'
      addToast(msg, 'error')
    } finally {
      setOptimisticUpdates((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const displayedAppointments = appointments.map((a) => ({
    ...a,
    status: optimisticUpdates[a.id] ?? a.status,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage and update patient appointment statuses
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <KanbanBoard
        appointments={displayedAppointments}
        onStatusChange={handleStatusChange}
        loading={loading && appointments.length === 0}
      />
    </div>
  )
}
