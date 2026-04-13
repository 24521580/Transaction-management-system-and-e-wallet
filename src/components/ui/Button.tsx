import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

const styles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110',
  secondary: 'bg-white/70 text-slate-800 hover:bg-white border border-white/70',
  danger: 'bg-danger text-white hover:brightness-110',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
}

export function Button({ children, className, variant = 'primary', fullWidth, disabled, ...props }: PropsWithChildren<Props>) {
  return (
    <motion.div whileTap={{ scale: disabled ? 1 : 0.98 }} className={fullWidth ? 'w-full' : undefined}>
      <button
        disabled={disabled}
        className={cn(
          'ios-pill inline-flex items-center justify-center gap-2 font-semibold shadow-soft duration-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-50',
          fullWidth && 'w-full',
          styles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  )
}
