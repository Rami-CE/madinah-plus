import React, { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function AnimatedNumber({ value, duration = 0.8, className = '', suffix = '' }) {
  const spring = useSpring(value, { stiffness: 80, damping: 20, duration: duration * 1000 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [shown, setShown] = useState(value)

  useEffect(() => {
    spring.set(value)
    const unsub = display.on('change', (v) => setShown(v))
    return unsub
  }, [value, spring, display])

  return (
    <span className={`font-mono-data tabular-nums ${className}`}>
      {shown}{suffix}
    </span>
  )
}

export function FadeIn({ children, delay = 0, className = '', as: Tag = motion.div }) {
  return (
    <Tag
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Tag>
  )
}

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      key={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export function Modal({ open, onClose, children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-lg ${className}`}
        ref={ref}
      >
        {children}
      </motion.div>
    </div>
  )
}
