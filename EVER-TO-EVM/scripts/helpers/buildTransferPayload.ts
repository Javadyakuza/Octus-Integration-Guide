import { getRandomUint } from "./randuint";
/**
 * buildTransferPayload function prepares the payload to be used in TokenWalletUpgradable.transfer in order to transfer a native token from everscale to an evm network.
 * @param evmRecipient receiver EvmAddress
 * @param chainId target evm network chainId
 * @returns transfer payload string
 */
export async function buildTransferPayload(evmRecipient: string, chainId: string): Promise<[string, string]> {
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
  let randomNonce = getRandomUint();
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
  return [data.boc, randomNonce];
}
