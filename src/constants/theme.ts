import type { ThemePreference } from '../types'

/** Browser UI (status bar) color for each resolved theme; matches `--bg`. */
export const THEME_COLORS: Record<
  Exclude<ThemePreference, 'system'>,
  string
> = {
  light: '#ECEEF2',
  dark: '#13151B',
}

export const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark']
