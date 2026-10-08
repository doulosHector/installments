/** Short unique id: timestamp plus random suffix, both in base 36. */
export const createId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
