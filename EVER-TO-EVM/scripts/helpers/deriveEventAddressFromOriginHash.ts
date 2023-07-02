import { Address, Contract, EventsBatch } from "locklift";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
export async function fetchAlienEventAddressFromOriginTxHash(txHash: string): Promise<Address | undefined> {
  // fetching the tx receipt
  const originTxReceipt = (await locklift.provider.getTransaction({ hash: txHash })).transaction;
  // fetching the conf contract
  const EverEvmAlienEventConfig: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConfigurationA,
    );
  // getting the pastEvents
  const pastEvents: EventsBatch<
    FactorySource["EverscaleEthereumEventConfiguration"],
    FactorySource["EverscaleEthereumEventConfiguration"]["events"][1]["name"]
  > = await EverEvmAlienEventConfig.getPastEvents({
    filter: event => event.event === "NewEventContract",
    limit: 100,
  });

  for (const event in pastEvents.events) {
    if (pastEvents.events[event].transaction.createdAt == originTxReceipt?.createdAt) {
      console.log(pastEvents.events[event].data.eventContract);
      return pastEvents.events[event].data.eventContract;
    }
  }
}
//--//
export async function fetchNativeEventAddressFromOriginTxHash(txHash: string): Promise<Address | undefined> {
  // fetching the tx receipt
  const originTxReceipt = (await locklift.provider.getTransaction({ hash: txHash })).transaction;
  // fetching the conf contract
  const EverEvmAlienEventConfig: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      constants.EverscaleEthereumEventConfigurationN,
    );
  // getting the pastEvents
  const pastEvents: EventsBatch<
    FactorySource["EverscaleEthereumEventConfiguration"],
    FactorySource["EverscaleEthereumEventConfiguration"]["events"][1]["name"]
  > = await EverEvmAlienEventConfig.getPastEvents({
    filter: event => event.event === "NewEventContract",
    limit: 100,
  });

  for (const event in pastEvents.events) {
    if (pastEvents.events[event].transaction.createdAt == originTxReceipt?.createdAt) {
      console.log(pastEvents.events[event].data.eventContract);
      return pastEvents.events[event].data.eventContract;
    }
  }
}
