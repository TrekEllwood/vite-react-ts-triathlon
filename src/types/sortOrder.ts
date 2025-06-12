export const SortOrder = {
  NONE: 'none',
  BEST: 'best',
  WORST: 'worst',
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]
