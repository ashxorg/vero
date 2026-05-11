export interface Physician {
  id: number
  name: string
  specialty: string
  bio: string | null
}

export interface Patient {
  id: number
  name: string
  contact_info: string
}

export interface Appointment {
  id: number
  patient: Patient
  physician: Physician
  date_time: string
  status: AppointmentStatus
  reason: string | null
}

export interface AppointmentCreate {
  patient_name: string
  contact_info: string
  physician_id: number
  date_time: string
  reason: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export interface BookingState {
  physician: Physician | null
  selectedDate: string | null
  selectedSlot: string | null
  patientName: string
  contactInfo: string
  reason: string
}
