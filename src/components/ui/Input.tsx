import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, className, error, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        id={inputId}
        className={cn(
          'h-11 rounded-input border bg-white/75 px-4 text-sm outline-none transition-all duration-ios placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50',
          error ? 'border-danger focus:ring-danger/30' : 'border-white/60',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  )
}
