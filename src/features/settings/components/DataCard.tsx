import { useInstallments } from '../../../context/installments'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { backupToJson, exportCsv } from '../../../services/backup'
import { copyText } from '../../../utils/clipboard'
import { todayKey } from '../../../utils/date'
import { downloadTextFile } from '../../../utils/download'

/** Backup export (JSON, CSV, clipboard) and import. */
export function DataCard() {
  const { state } = useInstallments()
  const { today, openSheet } = useUi()
  const { showToast } = useToast()
  const count = state.purchases.length

  const save = (filename: string, data: string, type: string) =>
    showToast(
      downloadTextFile(filename, data, type)
        ? 'Download started. If nothing happens, use Copy backup.'
        : 'Download is not available here. Use Copy backup.',
    )

  const copy = async () =>
    showToast(
      (await copyText(backupToJson(state)))
        ? 'Backup copied. Paste it in a note or file.'
        : 'Copy is not available here',
    )

  return (
    <div className="group">
      <h3>Your data</h3>
      <p>
        {count}
        {count === 1 ? ' purchase' : ' purchases'}. Export a backup or import
        one from a JSON file.
      </p>
      <div className="btns">
        <button
          type="button"
          className="btn"
          onClick={() =>
            save(
              `installments-backup-${todayKey()}.json`,
              backupToJson(state),
              'application/json',
            )
          }
        >
          Export backup (JSON)
        </button>
        <button
          type="button"
          className="btn"
          onClick={() =>
            save(
              `installments-${todayKey()}.csv`,
              exportCsv(state.purchases, today),
              'text/csv',
            )
          }
        >
          Export table (CSV)
        </button>
        <button type="button" className="btn" onClick={copy}>
          Copy backup to clipboard
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => openSheet({ type: 'importGuide' })}
        >
          Import backup
        </button>
      </div>
    </div>
  )
}
