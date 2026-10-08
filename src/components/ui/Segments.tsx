import type { Schedule } from '../../types'
import { cx } from '../../utils/style'
import './Segments.css'

/** Above this many payments, a plain progress bar replaces the segments. */
const MAX_SEGMENTS = 36
/** Above this many payments, segments get tighter. */
const DENSE_FROM = 18

/**
 * One segment per payment: paid ones filled, the one paid this month
 * outlined. Decorative: the text next to it says the same.
 */
export function Segments({ schedule }: { schedule: Schedule }) {
  const { count, paidCount, status, progress } = schedule
  if (count > MAX_SEGMENTS) {
    return (
      <span className="segs bar" aria-hidden="true">
        <b style={{ width: `${(progress * 100).toFixed(1)}%` }} />
      </span>
    )
  }
  const paying = status === 'active' || status === 'last'
  return (
    <span
      className={cx('segs', count > DENSE_FROM && 'dense')}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const n = i + 1
        const className =
          n < paidCount
            ? 'p'
            : n === paidCount
              ? paying
                ? 'c'
                : 'p'
              : undefined
        return <i key={n} className={className} />
      })}
    </span>
  )
}
