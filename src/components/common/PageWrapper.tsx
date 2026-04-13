import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export function PageWrapper({ children }: PropsWithChildren) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  )
}
