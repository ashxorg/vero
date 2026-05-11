import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { useToast, type Toast as ToastItem } from '../context/ToastContext'

const config = {
  success: {
    icon: CheckCircle2,
    border: 'border-l-success-500',
    bg: 'bg-success-50',
    text: 'text-success-700',
    iconColor: 'text-success-500',
  },
  error: {
    icon: AlertCircle,
    border: 'border-l-danger-500',
    bg: 'bg-danger-50',
    text: 'text-danger-700',
    iconColor: 'text-danger-500',
  },
  info: {
    icon: Info,
    border: 'border-l-brand-500',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    iconColor: 'text-brand-500',
  },
}

function ToastItem({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToast()
  const { icon: Icon, border, bg, text, iconColor } = config[toast.type]

  return (
    <div
      className={clsx(
        'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-72 max-w-sm animate-slide-in',
        border,
        bg,
      )}
    >
      <Icon size={18} className={clsx('mt-0.5 shrink-0', iconColor)} />
      <p className={clsx('text-sm font-medium flex-1', text)}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
