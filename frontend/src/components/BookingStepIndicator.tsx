import { Check } from 'lucide-react'
import { clsx } from 'clsx'

interface BookingStepIndicatorProps {
  currentStep: 1 | 2 | 3
}

const STEPS = ['Choose Doctor', 'Pick Time', 'Your Details']

export function BookingStepIndicator({ currentStep }: BookingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const done = stepNum < currentStep
        const active = stepNum === currentStep

        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  done && 'bg-brand-500 text-white',
                  active && 'bg-brand-500 text-white ring-4 ring-brand-100',
                  !done && !active && 'bg-gray-200 text-gray-500',
                )}
              >
                {done ? <Check size={16} strokeWidth={2.5} /> : stepNum}
              </div>
              <span
                className={clsx(
                  'text-xs font-medium whitespace-nowrap',
                  active ? 'text-brand-700' : done ? 'text-brand-500' : 'text-gray-400',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  'h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-colors duration-300',
                  stepNum < currentStep ? 'bg-brand-500' : 'bg-gray-200',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
