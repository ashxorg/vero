import { UserRound } from 'lucide-react'
import { clsx } from 'clsx'
import type { Physician } from '../types'

interface PhysicianCardProps {
  physician: Physician
  selected: boolean
  onSelect: () => void
}

const SPECIALTY_COLORS: Record<string, string> = {
  Cardiology: 'bg-red-50 text-red-700',
  Orthopedics: 'bg-blue-50 text-blue-700',
  Dermatology: 'bg-pink-50 text-pink-700',
  Neurology: 'bg-purple-50 text-purple-700',
  Pediatrics: 'bg-green-50 text-green-700',
  'General Practice': 'bg-brand-50 text-brand-700',
}

export function PhysicianCard({ physician, selected, onSelect }: PhysicianCardProps) {
  const badgeColor = SPECIALTY_COLORS[physician.specialty] ?? 'bg-gray-100 text-gray-700'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        'text-left w-full rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer',
        'hover:shadow-md hover:-translate-y-0.5',
        selected
          ? 'border-brand-500 bg-brand-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-brand-300',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors',
            selected ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-600',
          )}
        >
          <UserRound size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{physician.name}</p>
          <span
            className={clsx(
              'inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
              badgeColor,
            )}
          >
            {physician.specialty}
          </span>
          {physician.bio && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {physician.bio}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
