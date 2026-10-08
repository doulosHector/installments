import './EmptyState.css'

/** Shown by every view while there are no purchases. */
export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="empty">
      <h2>No purchases yet</h2>
      <p>Add a purchase to see your monthly payment.</p>
      <button type="button" className="btn primary" onClick={onAdd}>
        Add purchase
      </button>
    </div>
  )
}
