import { useEffect, type RefObject } from 'react'

/** Focuses an element after a delay (e.g. once a sheet finished sliding in). */
export function useDelayedFocus(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
  delayMs = 260,
) {
  useEffect(() => {
    if (!enabled) return
    const timer = setTimeout(() => ref.current?.focus(), delayMs)
    return () => clearTimeout(timer)
  }, [ref, enabled, delayMs])
}
