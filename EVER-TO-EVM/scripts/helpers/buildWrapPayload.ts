import { getRandomUint } from "./randuint";
import * as constants from "../../constants";
import { Address } from "locklift";
/**
 * buildWrapPayload function prepares the payload to be used in Vault.wrap in order to transfer Ever from everscale to an evm network.
 * @param everSender sender ever account wallet address
 * @param evmRecipient receiver EvmAddress
 * @param amount target token amount without decimals
 * @param chainId target evm network chainId
 * @param releaseByEver this parameter specifies if the credit backend should release the assets in the target evm network(true), or user must release them manually(false)
 * @returns wrap payload string
 */
export async function buildWrapPayload(
  everSender: Address,
  evmRecipient: string,
  amount: string | number,
  chainId: string,
  releaseByEver: boolean,
): Promise<[string, string]> {
  const transferPayload = await locklift.provider.packIntoCell({
    data: {
      addr: evmRecipient,
      chainId: chainId,
      callback: {
        recipient: "0x0000000000000000000000000000000000000000",
        payload: "",
        strict: false,
      },
    },
    structure: [
      { name: "addr", type: "uint160" },
      { name: "chainId", type: "uint256" },
      {
        name: "callback",
        type: "tuple",
        components: [
          { name: "recipient", type: "uint160" },
          { name: "payload", type: "cell" },
          { name: "strict", type: "bool" },
        ] as const,
      },
    ] as const,
  });
  let randomNonce: string = getRandomUint();
  const data = await locklift.provider.packIntoCell({
    data: {
      nonce: randomNonce,
      network: 1,
      transferPayload: transferPayload.boc,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "network", type: "uint8" },
      { name: "transferPayload", type: "cell" },
    ] as const,
  });

  const remainingGasTo = releaseByEver ? constants.EventCloser : everSender;

  const compounderPayload = await locklift.provider.packIntoCell({
    data: {
      to: constants.ProxyMultiVaultNativeV_4,
      amount: locklift.utils.toNano(amount),
      remainingGasTo,
      payload: data.boc,
    },
    structure: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint128" },
      { name: "remainingGasTo", type: "address" },
      { name: "payload", type: "cell" },
    ] as const,
  });
  return [compounderPayload.boc, randomNonce];
}
