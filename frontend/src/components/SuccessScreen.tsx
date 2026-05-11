import { CheckCircle2, Calendar, Clock, User, Stethoscope } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Appointment } from '../types'

interface SuccessScreenProps {
  appointment: Appointment
  onBookAnother: () => void
}

export function SuccessScreen({ appointment, onBookAnother }: SuccessScreenProps) {
  const dateTime = parseISO(appointment.date_time)

  return (
    <div className="flex flex-col items-center py-12 px-4 animate-fade-in">
      <CheckCircle2 size={64} className="text-success-500 mb-4" strokeWidth={1.5} />
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
      <p className="text-gray-500 text-sm mb-8">
        Your appointment request has been submitted. You'll hear back shortly.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Appointment Summary
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
              <Stethoscope size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Physician</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.physician.name}</p>
              <p className="text-xs text-gray-500">{appointment.physician.specialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(dateTime, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
              <Clock size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Time</p>
              <p className="text-sm font-semibold text-gray-900">{format(dateTime, 'h:mm a')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
              <User size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Patient</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.patient.name}</p>
              <p className="text-xs text-gray-500">{appointment.patient.contact_info}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 px-3 py-2 bg-warning-50 rounded-lg">
          <span className="text-xs font-medium text-warning-700">Status: Pending confirmation</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBookAnother}
        className="mt-8 px-6 py-2.5 rounded-full border-2 border-brand-500 text-brand-600 font-semibold text-sm hover:bg-brand-50 active:scale-95 transition-all duration-150"
      >
        Book Another Appointment
      </button>
    </div>
  )
}
