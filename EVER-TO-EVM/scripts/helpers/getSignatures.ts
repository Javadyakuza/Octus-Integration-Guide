import { Contract } from "locklift";
import { FactorySource } from "../../build/factorySource";
export async function getSignatures(
  eventContract: Contract<FactorySource["EverscaleEthereumBaseEvent"]>,
): Promise<string[]> {
  return new Promise(resolve => {
    let signatures: string[];
    setTimeout(async () => {
      signatures = (await eventContract.methods.getDetails({ answerId: 0 }).call({}))._signatures;
      resolve(signatures);
    }, 10000);
  });
}
