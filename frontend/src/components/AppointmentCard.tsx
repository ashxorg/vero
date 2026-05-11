import { Clock, Stethoscope, FileText, CheckCircle, XCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Spinner } from './Spinner'
import type { Appointment, AppointmentStatus } from '../types'

interface AppointmentCardProps {
  appointment: Appointment
  onStatusChange: (status: AppointmentStatus) => Promise<void>
}

const statusBorder: Record<AppointmentStatus, string> = {
  pending: 'border-l-warning-500',
  confirmed: 'border-l-success-500',
  cancelled: 'border-l-danger-500',
}

export function AppointmentCard({ appointment, onStatusChange }: AppointmentCardProps) {
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const dateTime = parseISO(appointment.date_time)

  async function handleConfirm() {
    setConfirming(true)
    try {
      await onStatusChange('confirmed')
    } finally {
      setConfirming(false)
    }
  }

  async function handleCancel() {
    setCancelling(true)
    try {
      await onStatusChange('cancelled')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border-l-4 border border-gray-100 shadow-sm p-4 flex flex-col gap-3',
        statusBorder[appointment.status],
      )}
    >
      {/* Patient name */}
      <div>
        <p className="font-semibold text-gray-900 text-sm">{appointment.patient.name}</p>
        <p className="text-xs text-gray-400">{appointment.patient.contact_info}</p>
      </div>

      {/* Physician */}
      <div className="flex items-center gap-1.5 text-gray-500">
        <Stethoscope size={13} className="shrink-0" />
        <span className="text-xs">
          {appointment.physician.name} · {appointment.physician.specialty}
        </span>
      </div>

      {/* Date/time */}
      <div className="flex items-center gap-1.5 text-gray-500">
        <Clock size={13} className="shrink-0" />
        <span className="text-xs">{format(dateTime, 'MMM d, yyyy · h:mm a')}</span>
      </div>

      {/* Reason */}
      {appointment.reason && (
        <div className="flex items-start gap-1.5 text-gray-500">
          <FileText size={13} className="shrink-0 mt-0.5" />
          <span className="text-xs line-clamp-2">{appointment.reason}</span>
        </div>
      )}

      {/* Actions */}
      {appointment.status === 'pending' && (
        <div className="flex gap-2 mt-1 pt-2 border-t border-gray-100">
          <button
            type="button"
            disabled={confirming || cancelling}
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-success-50 text-success-700 text-xs font-semibold hover:bg-success-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {confirming ? <Spinner size="sm" className="text-current" /> : <CheckCircle size={13} />}
            Confirm
          </button>
          <button
            type="button"
            disabled={confirming || cancelling}
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-danger-50 text-danger-700 text-xs font-semibold hover:bg-danger-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelling ? <Spinner size="sm" className="text-current" /> : <XCircle size={13} />}
            Cancel
          </button>
        </div>
      )}

      {appointment.status === 'confirmed' && (
        <div className="mt-1 pt-2 border-t border-gray-100">
          <button
            type="button"
            disabled={cancelling}
            onClick={handleCancel}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-danger-50 text-danger-700 text-xs font-semibold hover:bg-danger-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelling ? <Spinner size="sm" className="text-current" /> : <XCircle size={13} />}
            Cancel Appointment
          </button>
        </div>
      )}
    </div>
  )
}
