import { useRef, type ChangeEvent } from 'react'
import { SheetContent } from '../../../components/ui'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { parseBackup } from '../../../services/backup'

const EXAMPLE = `{
  "purchases": [
    {
      "description": "New phone",
      "amount": 15000,
      "date": "2026-10-05",
      "installments": 12,
      "tags": ["tech"]
    }
  ]
}`

/** Explains the backup format and lets the user pick a JSON file. */
export function ImportGuideSheet() {
  const { openSheet, closeSheet } = useUi()
  const { showToast } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)

  const choose = () => {
    if (!fileInput.current) return
    fileInput.current.value = ''
    fileInput.current.click()
  }

  const read = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    let text: string
    try {
      text = await file.text()
    } catch {
      showToast('Could not read this file')
      return
    }
    const result = parseBackup(text)
    if (result.ok) openSheet({ type: 'importConfirm', backup: result.backup })
    else showToast(result.error)
  }

  return (
    <SheetContent title="Import backup" onClose={closeSheet}>
      <div className="confirm">
        <p>Choose a JSON file. Each purchase needs these fields:</p>
        <div className="fields">
          <div>
            <b>description</b>
            <span>Text. The name of the purchase.</span>
          </div>
          <div>
            <b>amount</b>
            <span>
              Number greater than 0. The total price, without the currency
              symbol.
            </span>
          </div>
          <div>
            <b>date</b>
            <span>Purchase date as YYYY-MM-DD.</span>
          </div>
          <div>
            <b>installments</b>
            <span>Whole number from 1 to 360. The number of payments.</span>
          </div>
          <div>
            <b>
              tags<em>optional</em>
            </b>
            <span>A list of words.</span>
          </div>
        </div>
        <p>Example with one purchase:</p>
        <pre className="example num">{EXAMPLE}</pre>
        <p className="hint">
          A file exported from this app already has this format. A plain list of
          purchases, without "purchases", also works. Purchases with missing or
          wrong data are skipped.
        </p>
        <div className="btns">
          <button type="button" className="btn primary" onClick={choose}>
            Choose file
          </button>
          <button type="button" className="btn" onClick={closeSheet}>
            Cancel
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={read}
        />
      </div>
    </SheetContent>
  )
}
