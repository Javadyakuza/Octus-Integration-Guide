export type MultiTokenAlienWithdrawalData = {
  token: number;
  amount: number;
  recipient: number;
  chainId: number;
  callback: {
    recipient: number;
    payload: string;
    strict: boolean;
  };
};
