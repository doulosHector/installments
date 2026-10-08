import { useEffect, useRef, type ReactNode } from 'react'
import { cx } from '../../utils/style'
import { Icon } from './Icon'
import './BottomSheet.css'

const TITLE_ID = 'sheet-title'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * Modal panel that slides up from the bottom. It stays mounted while closed
 * so the exit transition can play; it is `inert` in that state. Locks the
 * page scroll while open and gives focus back to the opener on close.
 */
export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement
    document.body.classList.add('sheet-open')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('sheet-open')
      const target = opener.current
      if (target instanceof HTMLElement && target.isConnected)
        target.focus({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <>
      <div className={cx('scrim', open && 'in')} onClick={onClose} />
      <div
        className={cx('sheet', open && 'in')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        inert={!open}
      >
        {children}
      </div>
    </>
  )
}

interface SheetContentProps {
  title: ReactNode
  onClose: () => void
  children: ReactNode
}

/** Header (title + close button) and body of a bottom sheet. */
export function SheetContent({ title, onClose, children }: SheetContentProps) {
  return (
    <>
      <div className="sheet-head">
        <h2 id={TITLE_ID}>{title}</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>
      </div>
      {children}
    </>
  )
}
