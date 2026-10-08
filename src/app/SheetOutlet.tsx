import { BottomSheet } from '../components/ui'
import { useUi } from '../context/ui'
import { PurchaseSheet } from '../features/purchases'
import { ImportConfirmSheet, ImportGuideSheet } from '../features/settings'
import type { SheetState } from '../types'

function SheetBody({ sheet }: { sheet: SheetState }) {
  switch (sheet.type) {
    case 'purchaseForm':
      return <PurchaseSheet purchaseId={sheet.purchaseId} />
    case 'importGuide':
      return <ImportGuideSheet />
    case 'importConfirm':
      return <ImportConfirmSheet backup={sheet.backup} />
  }
}

/** Renders the active sheet inside the single, app-wide bottom sheet. */
export function SheetOutlet() {
  const { sheet, isSheetOpen, closeSheet } = useUi()
  return (
    <BottomSheet open={isSheetOpen} onClose={closeSheet}>
      {sheet && <SheetBody key={sheet.key} sheet={sheet.state} />}
    </BottomSheet>
  )
}
