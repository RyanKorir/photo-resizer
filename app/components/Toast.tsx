'use client'
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info
  const color = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent)'

  return (
    <div className="toast">
      <Icon size={16} color={color} />
      <span>{message}</span>
    </div>
  )
}
