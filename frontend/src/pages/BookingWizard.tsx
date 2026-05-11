import { useCallback, useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Stethoscope, Clock, ArrowLeft, ChevronRight } from 'lucide-react'
import { BookingStepIndicator } from '../components/BookingStepIndicator'
import { PhysicianCard } from '../components/PhysicianCard'
import { DatePicker } from '../components/DatePicker'
import { TimeSlotGrid } from '../components/TimeSlotGrid'
import { PatientForm } from '../components/PatientForm'
import { SuccessScreen } from '../components/SuccessScreen'
import { Spinner } from '../components/Spinner'
import { useToast } from '../context/ToastContext'
import { createAppointment, fetchAvailableSlots, fetchPhysicians } from '../api'
import type { Appointment, BookingState, Physician } from '../types'

const initialState: BookingState = {
  physician: null,
  selectedDate: null,
  selectedSlot: null,
  patientName: '',
  contactInfo: '',
  reason: '',
}

export function BookingWizard() {
  const { addToast } = useToast()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [booking, setBooking] = useState<BookingState>(initialState)
  const [physicians, setPhysicians] = useState<Physician[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [completed, setCompleted] = useState<Appointment | null>(null)

  const [loadingPhysicians, setLoadingPhysicians] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [errors, setErrors] = useState<{ patientName?: string; contactInfo?: string }>({})

  useEffect(() => {
    setLoadingPhysicians(true)
    fetchPhysicians()
      .then(setPhysicians)
      .catch((err: Error) => addToast(err.message || 'Failed to load physicians', 'error'))
      .finally(() => setLoadingPhysicians(false))
  }, [addToast])

  const loadSlots = useCallback(
    (physicianId: number, date: string) => {
      setLoadingSlots(true)
      setSlots([])
      fetchAvailableSlots(physicianId, date)
        .then((data) => setSlots(data.slots))
        .catch((err: Error) => addToast(err.message || 'Failed to load time slots', 'error'))
        .finally(() => setLoadingSlots(false))
    },
    [addToast],
  )

  function selectPhysician(physician: Physician) {
    setBooking((b) => ({ ...b, physician, selectedDate: null, selectedSlot: null }))
    setSlots([])
    setStep(2)
  }

  function selectDate(date: string) {
    setBooking((b) => ({ ...b, selectedDate: date, selectedSlot: null }))
    if (booking.physician) loadSlots(booking.physician.id, date)
  }

  function selectSlot(slot: string) {
    setBooking((b) => ({ ...b, selectedSlot: slot }))
  }

  function handleFormChange(field: 'patientName' | 'contactInfo' | 'reason', value: string) {
    setBooking((b) => ({ ...b, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((e) => ({ ...e, [field]: undefined }))
    }
  }

  function goBack() {
    if (step === 2) {
      setStep(1)
      setBooking((b) => ({ ...b, selectedDate: null, selectedSlot: null }))
      setSlots([])
    } else if (step === 3) {
      setStep(2)
    }
  }

  function canAdvanceStep2() {
    return !!booking.selectedSlot
  }

  async function handleSubmit() {
    const newErrors: typeof errors = {}
    if (!booking.patientName.trim()) newErrors.patientName = 'Full name is required'
    if (!booking.contactInfo.trim()) newErrors.contactInfo = 'Email or phone is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!booking.physician || !booking.selectedSlot) return

    setSubmitting(true)
    try {
      const appointment = await createAppointment({
        patient_name: booking.patientName.trim(),
        contact_info: booking.contactInfo.trim(),
        physician_id: booking.physician.id,
        date_time: booking.selectedSlot,
        reason: booking.reason.trim(),
      })
      setCompleted(appointment)
      addToast('Appointment booked successfully!', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to book appointment'
      addToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setBooking(initialState)
    setCompleted(null)
    setStep(1)
    setSlots([])
    setErrors({})
  }

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SuccessScreen appointment={completed} onBookAnother={reset} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Book an <em className="italic">Appointment</em>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Choose a physician and pick a time that works for you
        </p>
      </div>

      <BookingStepIndicator currentStep={step} />

      {/* Step 1: Physician Selection */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose your physician</h2>
          {loadingPhysicians ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {physicians.map((p) => (
                <PhysicianCard
                  key={p.id}
                  physician={p}
                  selected={booking.physician?.id === p.id}
                  onSelect={() => selectPhysician(p)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-semibold text-gray-800">Select a date and time</h2>
          </div>
          {booking.physician && (
            <p className="text-sm text-gray-500 mb-5 flex items-center gap-1.5">
              <Stethoscope size={14} />
              {booking.physician.name} — {booking.physician.specialty}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Pick a date</p>
              <DatePicker selectedDate={booking.selectedDate} onSelect={selectDate} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Available times
                {booking.selectedDate && (
                  <span className="font-normal text-gray-400 ml-2">
                    {format(new Date(booking.selectedDate + 'T00:00:00'), 'MMM d')}
                  </span>
                )}
              </p>
              {!booking.selectedDate ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                  Select a date first
                </div>
              ) : (
                <TimeSlotGrid
                  slots={slots}
                  selectedSlot={booking.selectedSlot}
                  onSelect={selectSlot}
                  loading={loadingSlots}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              disabled={!canAdvanceStep2()}
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white rounded-full font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 active:scale-95 transition-all duration-150"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Patient Details */}
      {step === 3 && (
        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Your details</h2>
            <PatientForm
              values={{
                patientName: booking.patientName,
                contactInfo: booking.contactInfo,
                reason: booking.reason,
              }}
              onChange={handleFormChange}
              errors={errors}
            />
          </div>

          {/* Booking summary aside */}
          <div className="md:col-span-2">
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100 sticky top-24">
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
                Your Booking
              </p>
              {booking.physician && (
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope size={15} className="text-brand-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{booking.physician.name}</p>
                    <p className="text-xs text-gray-500">{booking.physician.specialty}</p>
                  </div>
                </div>
              )}
              {booking.selectedSlot && (
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-brand-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {format(parseISO(booking.selectedSlot), 'EEEE, MMM d')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(parseISO(booking.selectedSlot), 'h:mm a')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-5 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-7 py-2.5 bg-brand-500 text-white rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:bg-brand-600 active:scale-95 transition-all duration-150"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
