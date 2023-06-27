import { getRandomUint } from "./randuint";
import { EventCloser, ProxyMultiVaultNativeV_4 } from "../../constants";
import { Address } from "locklift";
export async function buildWrapPayload(
  everSender: Address,
  evmRecipient: string,
  amount: string | number,
  chainId: string,
  releaseByEver: boolean,
): Promise<string> {
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

  const data = await locklift.provider.packIntoCell({
    data: {
      nonce: getRandomUint(),
      network: 1,
      transferPayload: transferPayload.boc,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "network", type: "uint8" },
      { name: "transferPayload", type: "cell" },
    ] as const,
  });

  const remainingGasTo = releaseByEver ? EventCloser : everSender;

  const compounderPayload = await locklift.provider.packIntoCell({
    data: {
      to: ProxyMultiVaultNativeV_4,
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
  return compounderPayload.boc;
}
