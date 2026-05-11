import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 16, md: 24, lg: 40 }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return <Loader2 size={sizes[size]} className={clsx('animate-spin text-brand-500', className)} />
}
