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
export type EverscaleEvent = {
  eventTransactionLt: number;
  eventTimestamp: number;
  eventData: string;
  configurationWid: number;
  configurationAddress: number;
  eventContractWid: number;
  eventContractAddress: number;
  proxy: string;
  round: number;
};
