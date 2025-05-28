export const RaceType = {
  SWIM: 'SWIM',
  BIKE: 'BIKE',
  RUN: 'RUN',
} as const;

export type RaceType = (typeof RaceType)[keyof typeof RaceType]
