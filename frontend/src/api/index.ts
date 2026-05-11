import type { Appointment, AppointmentCreate, AppointmentStatus, Physician } from '../types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export function fetchPhysicians(): Promise<Physician[]> {
  return request('/api/physicians')
}

export function fetchAvailableSlots(physicianId: number, date: string): Promise<{ slots: string[] }> {
  return request(`/api/appointments/available-slots?physician_id=${physicianId}&date=${date}`)
}

export function createAppointment(data: AppointmentCreate): Promise<Appointment> {
  return request('/api/appointments', { method: 'POST', body: JSON.stringify(data) })
}

export function fetchAppointments(): Promise<Appointment[]> {
  return request('/api/appointments')
}

export function updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
  return request(`/api/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
