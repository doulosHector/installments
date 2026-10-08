import { useMoney } from '../../hooks/useMoney'
import type { Cents } from '../../types'

/** Big amount with the cents in a smaller, muted style. */
export function Money({ cents }: { cents: Cents }) {
  const { main, fraction } = useMoney().parts(cents)
  return (
    <>
      <span>{main}</span>
      {fraction && <span className="cents">{fraction}</span>}
    </>
  )
}
