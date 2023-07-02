import { mapTonCellIntoEthBytes } from "eth-ton-abi-converter";
import { Address, Contract } from "locklift";
import { ethers } from "hardhat";
import * as web3 from "web3";
import { FactorySource } from "../../build/factorySource";
export async function buildSaveWithdraw(EverEvmAlienEventContractAddress: Address): Promise<string> {
  // fetching the contracts
  const EverEvmEventContract: Contract<FactorySource["EverscaleEthereumBaseEvent"]> =
    await locklift.factory.getDeployedContract("EverscaleEthereumBaseEvent", EverEvmAlienEventContractAddress);
  const eventDetails = await EverEvmEventContract.methods.getDetails({ answerId: 0 }).call({});
  const EverEvmAlienEventConf: Contract<FactorySource["EverscaleEthereumEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EverscaleEthereumEventConfiguration",
      eventDetails._eventInitData.configuration,
    );
  const [eventConfigDetails, flags] = await Promise.all([
    await EverEvmAlienEventConf.methods.getDetails({ answerId: 0 }).call({}),
    (await EverEvmAlienEventConf.methods.getFlags({ answerId: 0 }).call({}))._flags,
  ]);
  // preparing the payload

  const eventDataEncoded = mapTonCellIntoEthBytes(
    Buffer.from(
      (await EverEvmAlienEventConf.methods.getDetails({ answerId: 0 }).call({}))._basicConfiguration.eventABI,
      "base64",
    ).toString(),
    eventDetails._eventInitData.voteData.eventData,
    flags,
  );
  const roundNumber = (await EverEvmEventContract.methods.round_number({}).call({})).round_number;

  const encodedEvent = web3.eth.abi.encodeParameters(
    [
      {
        EverscaleEvent: {
          eventTransactionLt: "uint64",
          eventTimestamp: "uint32",
          eventData: "bytes",
          configurationWid: "int8",
          configurationAddress: "uint256",
          eventContractWid: "int8",
          eventContractAddress: "uint256",
          proxy: "address",
          round: "uint32",
        },
      },
    ],
    [
      {
        eventTransactionLt: eventDetails._eventInitData.voteData.eventTransactionLt,
        eventTimestamp: eventDetails._eventInitData.voteData.eventTimestamp,
        eventData: eventDataEncoded,
        configurationWid: eventDetails._eventInitData.configuration.toString().split(":")[0],
        configurationAddress: `0x${eventDetails._eventInitData.configuration.toString().split(":")[1]}`,
        eventContractWid: EverEvmAlienEventContractAddress.toString().split(":")[0],
        eventContractAddress: `0x${EverEvmAlienEventContractAddress.toString().split(":")[1]}`,
        proxy: `0x${ethers.toBigInt(eventConfigDetails._networkConfiguration.proxy).toString(16).padStart(40, "0")}`,
        round: roundNumber,
      },
    ],
  );
  return encodedEvent;
}
