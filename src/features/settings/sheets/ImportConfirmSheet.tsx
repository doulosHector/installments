import { SheetContent } from '../../../components/ui'
import { useInstallments } from '../../../context/installments'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { mergePurchases } from '../../../services/backup'
import type { ParsedBackup } from '../../../types'

/** Asks whether to add the backup's purchases or replace the current ones. */
export function ImportConfirmSheet({ backup }: { backup: ParsedBackup }) {
  const { state, actions } = useInstallments()
  const { closeSheet } = useUi()
  const { showToast } = useToast()
  const n = backup.purchases.length

  const merge = () => {
    const { purchases, added, updated } = mergePurchases(
      state.purchases,
      backup.purchases,
    )
    actions.replacePurchases(purchases)
    closeSheet()
    showToast(`${added} added${updated ? `, ${updated} updated` : ''}`)
  }

  const replace = () => {
    actions.replacePurchases(backup.purchases)
    if (backup.settings) actions.setCurrency(backup.settings.currency)
    closeSheet()
    showToast('Backup imported')
  }

  return (
    <SheetContent title="Import backup" onClose={closeSheet}>
      <div className="confirm">
        <p>
          Found {n}
          {n === 1 ? ' purchase' : ' purchases'}
          {backup.skipped > 0 &&
            ` (${backup.skipped} skipped because data was missing)`}
          . You have {state.purchases.length} now.
        </p>
        <div className="btns">
          <button type="button" className="btn primary" onClick={merge}>
            Add to my purchases
          </button>
          <button type="button" className="btn danger" onClick={replace}>
            Replace all my purchases
          </button>
          <button type="button" className="btn" onClick={closeSheet}>
            Cancel
          </button>
        </div>
      </div>
    </SheetContent>
  )
}
