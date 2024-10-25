export const PoolState = {
  LOADING: 'LOADING',
  NOT_EXISTS: 'NOT_EXISTS',
  EXISTS: 'EXISTS',
  INVALID: 'INVALID',
} as const;

export type PoolStateType = (typeof PoolState)[keyof typeof PoolState];
