import { cx } from '../../utils/style'
import './Toast.css'

export interface ToastAction {
  label: string
  run: () => void
}

interface ToastProps {
  message: string
  action: ToastAction | null
  visible: boolean
  onAction: () => void
}

export function Toast({ message, action, visible, onAction }: ToastProps) {
  return (
    <div
      className={cx('toast', visible && 'in')}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      {action && (
        <button type="button" onClick={onAction} tabIndex={visible ? 0 : -1}>
          {action.label}
        </button>
      )}
    </div>
  )
}
