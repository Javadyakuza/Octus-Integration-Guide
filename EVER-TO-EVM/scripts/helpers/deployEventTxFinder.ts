import { Transaction } from "locklift";
export async function deployEventTxFinder(txHash: string): Promise<string> {
  // fetching the tx receipt
  const originTxReceipt = await locklift.provider.getTransaction({ hash: txHash });
  return "";
}
