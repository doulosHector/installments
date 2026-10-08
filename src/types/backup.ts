import type { Purchase, Settings } from './installments'

/** A backup file that was read and validated, ready to import. */
export interface ParsedBackup {
  /** Valid purchases found in the file. */
  purchases: Purchase[]
  /** Entries dropped because data was missing or wrong. */
  skipped: number
  /** Settings stored in the file, when it is a full backup. */
  settings: Settings | null
}

export type BackupParseResult =
  { ok: true; backup: ParsedBackup } | { ok: false; error: string }
