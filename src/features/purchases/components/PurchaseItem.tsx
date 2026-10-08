import type { KeyboardEvent } from 'react'
import { Segments } from '../../../components/ui'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { ScheduledPurchase } from '../../../services/schedule'
import { formatDate } from '../../../utils/date'
import { monthLong, monthShortYear } from '../../../utils/month'

function Progress({ row }: { row: ScheduledPurchase }) {
  const { month } = useUi()
  const s = row.schedule
  switch (s.status) {
    case 'future':
      return (
        <>
          <span>Bought after {monthLong(month)}</span>
          <span />
        </>
      )
    case 'new':
      return (
        <>
          <span>
            Payment 0 of {s.count}, first in {monthShortYear(s.firstMonth)}
          </span>
          <span className="pct num">0%</span>
        </>
      )
    case 'done':
      return (
        <>
          <span>Paid off in {monthShortYear(s.lastMonth)}</span>
          <span className="pct num">100%</span>
        </>
      )
    default:
      return (
        <>
          <span>
            Payment {s.paidCount} of {s.count}
            {s.status === 'last' && <span className="badge">Last</span>}
          </span>
          <span className="pct num">{Math.round(s.progress * 100)}%</span>
        </>
      )
  }
}

/** A purchase card with its progress as of the browsed month. */
export function PurchaseItem({ row }: { row: ScheduledPurchase }) {
  const { openSheet } = useUi()
  const money = useMoney()
  const { purchase, schedule } = row
  const open = () =>
    openSheet({ type: 'purchaseForm', purchaseId: purchase.id })

  // A <div> (not a <button>) because it contains a description list.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  return (
    <div
      className="item"
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={onKeyDown}
    >
      <div className="item-top">
        <h3>{purchase.description}</h3>
        <span className="amt num">
          {money.format(schedule.base)}
          <small>/mo</small>
        </span>
      </div>
      <div className="item-meta">
        <span>{formatDate(purchase.date)}</span>
        {purchase.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <Segments schedule={schedule} />
      <div className="item-prog">
        <Progress row={row} />
      </div>
      <dl className="item-nums num">
        <div>
          <dt>Paid</dt>
          <dd>{money.format(schedule.paid)}</dd>
        </div>
        <div>
          <dt>Left</dt>
          <dd>{money.format(schedule.remaining)}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{money.format(schedule.cents)}</dd>
        </div>
      </dl>
    </div>
  )
}
