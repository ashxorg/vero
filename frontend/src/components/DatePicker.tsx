import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

interface DatePickerProps {
  selectedDate: string | null
  onSelect: (date: string) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const today = startOfDay(new Date())

  const days = eachDayOfInterval({ start: startOfMonth(viewMonth), end: endOfMonth(viewMonth) })
  const startOffset = getDay(startOfMonth(viewMonth))

  const selected = selectedDate ? startOfDay(new Date(selectedDate + 'T00:00:00')) : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const past = isBefore(day, today)
          const isSelected = selected ? isSameDay(day, selected) : false
          const todayMark = isToday(day)

          return (
            <button
              type="button"
              key={day.toISOString()}
              disabled={past}
              onClick={() => onSelect(format(day, 'yyyy-MM-dd'))}
              className={clsx(
                'mx-auto w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all duration-150',
                past && 'text-gray-300 cursor-not-allowed',
                !past && !isSelected && 'text-gray-700 hover:bg-brand-100 hover:text-brand-700',
                isSelected && 'bg-brand-500 text-white font-semibold shadow-sm',
                todayMark && !isSelected && 'font-semibold ring-1 ring-brand-300',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
