import type { ReactNode } from 'react'

/** Interface icons, drawn on a 24×24 grid with strokes. */
export const UI_ICONS = {
  purchases: (
    <>
      <path d="M8 7h12M8 12h12M8 17h12" />
      <circle cx="4" cy="7" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="17" r="1" />
    </>
  ),
  add: <path d="M12 5v14M5 12h14" />,
  projection: <path d="M5 20V11M10 20V6M15 20v-8M20 20v-5" />,
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
} satisfies Record<string, ReactNode>

export type UiIconName = keyof typeof UI_ICONS

export const isUiIconName = (value: unknown): value is UiIconName =>
  typeof value === 'string' && Object.hasOwn(UI_ICONS, value)
