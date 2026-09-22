'use client'
import { useState, useCallback } from 'react'

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [pointer, setPointer] = useState(0)

  const current = history[pointer]

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev[pointer]) : next
      const newHistory = prev.slice(0, pointer + 1)
      newHistory.push(value)
      // cap at 30 steps
      if (newHistory.length > 30) newHistory.shift()
      return newHistory
    })
    setPointer(prev => Math.min(prev + 1, 29))
  }, [pointer])

  const undo = useCallback(() => {
    setPointer(prev => Math.max(0, prev - 1))
  }, [])

  const redo = useCallback(() => {
    setPointer(prev => Math.min(history.length - 1, prev + 1))
  }, [history.length])

  const reset = useCallback((state: T) => {
    setHistory([state])
    setPointer(0)
  }, [])

  return {
    state: current,
    set,
    undo,
    redo,
    reset,
    canUndo: pointer > 0,
    canRedo: pointer < history.length - 1,
  }
}
