// CHANGE: Using a string literal type instead of enum to avoid extra JS at runtime
export const RaceType = {
  SWIM: 'SWIM',
  BIKE: 'BIKE',
  RUN: 'RUN',
} as const;

export type RaceType = (typeof RaceType)[keyof typeof RaceType]
