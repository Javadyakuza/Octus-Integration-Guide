import { getRandomUint } from "./randuint";
import { Address } from "locklift";
import * as constants from "../../constants";
import * as Web3 from "web3";
/**
 * buildBurnPayloadForEvmAlienToken function prepares the payload to be used in TokenWalletUpgradable.burn in order to transfer a token from everscale and to an evm network.
 * @param evmRecipient receiver EvmAddress
 * @returns burn payload string
 */
export async function buildBurnPayloadForEvmAlienToken(
  evmRecipient: string,
  TargetTokenRootAlienEvm: Address,
): Promise<[string, string]> {
  const operationPayload = await locklift.provider.packIntoCell({
    data: {
      addr: evmRecipient,
      callback: {
        recipient: "0x0000000000000000000000000000000000000000",
        payload: "",
        strict: false,
      },
    },
    structure: [
      { name: "addr", type: "uint160" },
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

  const payload = await locklift.provider.packIntoCell({
    data: {
      network: 1,
      withdrawPayload: operationPayload.boc,
    },
    structure: [
      { name: "network", type: "uint8" },
      { name: "withdrawPayload", type: "cell" },
    ] as const,
  });
  let randNonce = getRandomUint();
  const data = await locklift.provider.packIntoCell({
    data: {
      nonce: randNonce,
      type: 0,
      targetToken: TargetTokenRootAlienEvm, // TokenRootAlienEvm, different with normal tip3 tokens in everscale.
      operationPayload: payload.boc,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "type", type: "uint8" },
      { name: "targetToken", type: "address" },
      { name: "operationPayload", type: "cell" },
    ] as const,
  });
  return [data.boc, randNonce];
}
/**
 * buildBurnPayloadForEvmNativeToken function prepares the payload to be used in TokenWalletUpgradable.burn in order to transfer a token from everscale and to an evm network.
 * @param evmRecipient receiver EvmAddress
 * @returns burn payload string
 */
export async function buildBurnPayloadForEvmNativeToken(evmRecipient: string): Promise<[string, string]> {
  const burnPayload = await locklift.provider.packIntoCell({
    data: {
      addr: constants.unWrapper,
      callback: {
        recipient: constants.unWrapper,
        payload: Web3.eth.abi.encodeParameters(["address"], [evmRecipient]) ?? "",
        strict: false,
      },
    },
    structure: [
      { name: "addr", type: "uint160" },
      {
        name: "callback",
        type: "tuple",
        components: [
          { name: "recipient", type: "uint160" },
          { name: "payload", type: "bytes" },
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
      burnPayload: burnPayload.boc,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "network", type: "uint8" },
      { name: "burnPayload", type: "cell" },
    ] as const,
  });

  return [data.boc, randomNonce];
}
