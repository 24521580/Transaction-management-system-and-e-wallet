import type { PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  className?: string
  title?: string
  subtitle?: string
}

export function Card({ title, subtitle, className, children }: PropsWithChildren<Props>) {
  return (
    <section className={cn('glass-card p-5', className)}>
      {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
      {subtitle ? <p className="mb-4 text-sm text-slate-500">{subtitle}</p> : null}
      {children}
    </section>
  )
}
