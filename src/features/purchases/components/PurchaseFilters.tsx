import { useMemo } from 'react'
import { useInstallments } from '../../../context/installments'
import { useUi } from '../../../context/ui'
import { allTags } from '../../../services/purchases'
import type { StatusFilter } from '../../../types'

const STATUS_OPTIONS: [StatusFilter, string][] = [
  ['active', 'Current'],
  ['done', 'Finished'],
  ['all', 'All'],
]

export function PurchaseFilters() {
  const { purchases } = useInstallments().state
  const { filters, updateFilters } = useUi()
  const tags = useMemo(() => allTags(purchases), [purchases])

  return (
    <>
      <div className="seg-ctl" role="group" aria-label="Show">
        {STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            type="button"
            aria-pressed={filters.status === status}
            onClick={() => updateFilters({ status })}
          >
            {label}
          </button>
        ))}
      </div>
      {tags.length > 0 && (
        <div className="chips scroll" role="group" aria-label="Filter by tag">
          <button
            type="button"
            className="chip"
            aria-pressed={!filters.tag}
            onClick={() => updateFilters({ tag: null })}
          >
            All tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="chip"
              aria-pressed={filters.tag === tag}
              onClick={() => updateFilters({ tag })}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <input
        className="search"
        type="search"
        placeholder="Search purchases"
        aria-label="Search purchases"
        value={filters.query}
        onChange={(event) => updateFilters({ query: event.target.value })}
      />
    </>
  )
}
