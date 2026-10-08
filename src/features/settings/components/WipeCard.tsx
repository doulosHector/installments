import { ConfirmButton } from '../../../components/ui'
import { useInstallments } from '../../../context/installments'
import { useToast } from '../../../context/toast'

export function WipeCard() {
  const { state, actions } = useInstallments()
  const { showToast } = useToast()

  const wipe = () => {
    const backup = state.purchases
    actions.replacePurchases([])
    showToast('All purchases deleted', {
      label: 'Undo',
      run: () => actions.replacePurchases(backup),
    })
  }

  return (
    <div className="group">
      <h3>Delete everything</h3>
      <p>
        Removes all purchases. Export a backup first if you want to keep them.
      </p>
      <ConfirmButton
        className="btn danger"
        confirmLabel="Tap again to delete all"
        onConfirm={wipe}
      >
        Delete all purchases
      </ConfirmButton>
    </div>
  )
}
