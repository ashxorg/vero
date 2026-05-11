import { format, parseISO } from 'date-fns'
import { CalendarX } from 'lucide-react'
import { clsx } from 'clsx'
import { Spinner } from './Spinner'

interface TimeSlotGridProps {
  slots: string[]
  selectedSlot: string | null
  onSelect: (slot: string) => void
  loading: boolean
}

function formatSlot(iso: string): string {
  return format(parseISO(iso), 'h:mm a')
}

export function TimeSlotGrid({ slots, selectedSlot, onSelect, loading }: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner size="lg" />
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
        <CalendarX size={36} strokeWidth={1.5} />
        <p className="text-sm font-medium">No available slots for this date</p>
        <p className="text-xs">Try selecting a different day</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot
        return (
          <button
            type="button"
            key={slot}
            onClick={() => onSelect(slot)}
            className={clsx(
              'py-2 px-1 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150',
              isSelected
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white text-brand-700 border-brand-200 hover:bg-brand-50 hover:border-brand-400',
            )}
          >
            {formatSlot(slot)}
          </button>
        )
      })}
    </div>
  )
}
