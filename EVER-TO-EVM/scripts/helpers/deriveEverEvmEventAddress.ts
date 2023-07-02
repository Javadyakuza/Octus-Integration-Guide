import { Address, Transaction, Contract } from "locklift";
import { FactorySource } from "../../build/factorySource";
import * as constants from "../../constants";

export async function deriveEverEvmAlienEventAddress(
  txHash: string, // deployEvent tx hash (eventConfig.deployEvent)
  nonce: string | number,
  AlienTokenWallet: Address,
  tokens: string | number,
  ethereum_address: string | number,
  ever_sender_address: Address,
  TargetTokenRootAlienEvm: Address,
): Promise<Address> {
  const tx: Transaction = (
    await locklift.provider.getTransaction({
      hash: txHash,
    })
  ).transaction!;
  const timestamp: number = tx.createdAt;
  const lt: string = tx.id.lt;
  const eventData = await locklift.provider.packIntoCell({
    data: {
      nonce: nonce,
      proxy: constants.ProxyMultivaultAlienV_7,
      token: TargetTokenRootAlienEvm,
      remainingGasTo: ever_sender_address,
      amount: tokens,
      recipient: ethereum_address,
      sender: AlienTokenWallet,
      Recipient: "0",
      Payload: "",
      Strict: false,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "proxy", type: "address" },
      { name: "token", type: "address" },
      { name: "remainingGasTo", type: "address" },
      { name: "amount", type: "uint128" },
      { name: "recipient", type: "uint160" },
      { name: "sender", type: "address" },
      { name: "Recipient", type: "uint160" },
      { name: "Payload", type: "bytes" },
      { name: "Strict", type: "bool" },
    ] as const,
  });
  console.log(eventData, timestamp, lt);
  const EverEvmAlienEventConf: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConfigurationA,
    );
  const eventContractAddress: Address = (
    await EverEvmAlienEventConf.methods
      .deriveEventAddress({
        answerId: 0,
        eventVoteData: {
          eventTimestamp: timestamp,
          eventData: eventData.boc,
          eventTransactionLt: lt,
        },
      })
      .call({})
  ).eventContract;
  console.log("alien event Contract", eventContractAddress);
  return eventContractAddress;
}
export async function deriveEverEvmNativeEventAddress(
  txHash: string, // deployEvent tx hash (eventConfig.deployEvent)
  nonce: string | number,
  AlienTokenWallet: Address,
  tokens: string | number,
  ethereum_address: string | number,
  ever_sender_address: Address,
  TargetTokenRootAlienEvm: Address,
): Promise<Address> {
  const tx: Transaction = (
    await locklift.provider.getTransaction({
      hash: txHash,
    })
  ).transaction!;
  const timestamp: number = tx.createdAt;
  const lt: string = tx.id.lt;
  const eventData = await locklift.provider.packIntoCell({
    data: {
      nonce: nonce,
      proxy: constants.ProxyMultiVaultNativeV_4,
      token: TargetTokenRootAlienEvm,
      remainingGasTo: ever_sender_address,
      amount: tokens,
      recipient: ethereum_address,
      sender: AlienTokenWallet,
      Recipient: "0",
      Payload: "",
      Strict: false,
    },
    structure: [
      { name: "nonce", type: "uint32" },
      { name: "proxy", type: "address" },
      { name: "token", type: "address" },
      { name: "remainingGasTo", type: "address" },
      { name: "amount", type: "uint128" },
      { name: "recipient", type: "uint160" },
      { name: "sender", type: "address" },
      { name: "Recipient", type: "uint160" },
      { name: "Payload", type: "bytes" },
      { name: "Strict", type: "bool" },
    ] as const,
  });
  console.log(eventData, timestamp, lt);
  const EverEvmAlienEventConf: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConfigurationN,
    );
  const eventContractAddress: Address = (
    await EverEvmAlienEventConf.methods
      .deriveEventAddress({
        answerId: 0,
        eventVoteData: {
          eventTimestamp: timestamp,
          eventData: eventData.boc,
          eventTransactionLt: lt,
        },
      })
      .call({})
  ).eventContract;
  console.log("native event Contract", eventContractAddress);
  return eventContractAddress;
}
