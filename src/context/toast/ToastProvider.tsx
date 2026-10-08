import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Toast, type ToastAction } from '../../components/ui'
import { ToastContext } from './ToastContext'

const TOAST_MS = 2600
const TOAST_WITH_ACTION_MS = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<ToastAction | null>(null)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback((text: string, next?: ToastAction) => {
    setMessage(text)
    setAction(next ?? null)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(
      () => setVisible(false),
      next ? TOAST_WITH_ACTION_MS : TOAST_MS,
    )
  }, [])

  const runAction = useCallback(() => {
    action?.run()
    setVisible(false)
  }, [action])

  useEffect(() => () => clearTimeout(timer.current), [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext value={value}>
      {children}
      <Toast
        message={message}
        action={action}
        visible={visible}
        onAction={runAction}
      />
    </ToastContext>
  )
}
