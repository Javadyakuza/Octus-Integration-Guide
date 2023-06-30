import { Transaction, Address, Contract, EventsBatch } from "locklift";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
export async function fetchAlienEventAddressFromOriginTxHash(txHash: string): Promise<Address> {
  // fetching the tx receipt
  const originTxReceipt = (await locklift.provider.getTransaction({ hash: txHash })).transaction;
  // fetching the conf contract
  const EverEvmAlienEventConfig: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConsigurationA,
    );
  // getting the pastEvents
  const pastEvents: EventsBatch<
    FactorySource["EverscaleEthereumEventConfiguration"],
    FactorySource["EverscaleEthereumEventConfiguration"]["events"][1]["name"]
  > = await EverEvmAlienEventConfig.getPastEvents({
    filter: event => event.event === "NewEventContract",
    limit: 10,
  });

  let eventAddress: Address = new Address("");
  for (const event in pastEvents.events) {
    if (pastEvents.events[event].transaction.createdAt == originTxReceipt?.createdAt) {
      console.log(pastEvents.events[event].data.eventContract);
      eventAddress = pastEvents.events[event].data.eventContract;
    }
  }
  return eventAddress;
}
export async function fetchNativeEventAddressFromOriginTxHash(txHash: string): Promise<Address> {
  // fetching the tx receipt
  const originTxReceipt = (await locklift.provider.getTransaction({ hash: txHash })).transaction;
  // fetching the conf contract
  const EverEvmAlienEventConfig: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConsigurationN,
    );
  // getting the pastEvents
  const pastEvents: EventsBatch<
    FactorySource["EverscaleEthereumEventConfiguration"],
    FactorySource["EverscaleEthereumEventConfiguration"]["events"][1]["name"]
  > = await EverEvmAlienEventConfig.getPastEvents({
    filter: event => event.event === "NewEventContract",
    limit: 10,
  });
  let eventAddress: Address = new Address("");
  for (const event in pastEvents.events) {
    if (pastEvents.events[event].transaction.createdAt == originTxReceipt?.createdAt) {
      console.log(pastEvents.events[event].data.eventContract);
      eventAddress = pastEvents.events[event].data.eventContract;
    }
  }
  return eventAddress;
}
