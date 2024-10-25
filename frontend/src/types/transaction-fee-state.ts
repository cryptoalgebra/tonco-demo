export enum TransactionFeeStatus {
  NONE = 0,
  LOADING = 1,
  SUCCESS = 2,
}

export interface TransactionFeeState {
  status: TransactionFeeStatus;
  fee: string | undefined;
  gasForward: string | undefined;
  gasLimit: string | undefined;
}
