import { clsx } from 'clsx'

interface PatientFormValues {
  patientName: string
  contactInfo: string
  reason: string
}

interface PatientFormProps {
  values: PatientFormValues
  onChange: (field: keyof PatientFormValues, value: string) => void
  errors: Partial<Record<keyof PatientFormValues, string>>
}

const inputBase =
  'w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150 focus:ring-2 focus:ring-brand-400 focus:border-transparent'

export function PatientForm({ values, onChange, errors }: PatientFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          value={values.patientName}
          onChange={(e) => onChange('patientName', e.target.value)}
          placeholder="Jane Smith"
          className={clsx(inputBase, errors.patientName ? 'border-danger-500' : 'border-gray-200')}
        />
        {errors.patientName && (
          <p className="mt-1 text-xs text-danger-500">{errors.patientName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email or Phone <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          value={values.contactInfo}
          onChange={(e) => onChange('contactInfo', e.target.value)}
          placeholder="jane@example.com or (555) 000-0000"
          className={clsx(inputBase, errors.contactInfo ? 'border-danger-500' : 'border-gray-200')}
        />
        {errors.contactInfo && (
          <p className="mt-1 text-xs text-danger-500">{errors.contactInfo}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Reason for Visit <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={values.reason}
          onChange={(e) => onChange('reason', e.target.value)}
          rows={3}
          placeholder="Briefly describe your symptoms or reason for the visit..."
          className={clsx(inputBase, 'resize-none', 'border-gray-200')}
        />
      </div>
    </div>
  )
}
