import * as EVER from "everscale-standalone-client";
import { Contract, Signer } from "locklift";
import { mapEthBytesIntoTonCell } from "eth-ton-abi-converter";
import { buildAlienEventVoteData } from "../../../evm/scripts/helpers/buildEventVoteData";
import Event from "../../../evm/interfaces/voteData";
import { FactorySource } from "../../../build/factorySource";
import { EventVoteDataParam } from "../../../types/index";
import { EthereumEverscaleEventConfigurationA } from "../../../constants";
/**
 * @description at this module we will deploy MultiVaultEVMEverscaleEventAlienEvent contract in order to complete the deposit proccess on
 * evm network in order to perform a transfer a ever alien token from evm network to ever.
 * USDT token is used in this particualr example
 */
export async function deployAlienEvent(evmTxHash: string) {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contract
  const EvmEverEventConf: Contract<FactorySource["EthereumEverscaleEventConfiguration"]> =
    await locklift.factory.getDeployedContract(
      "EthereumEverscaleEventConfiguration",
      EthereumEverscaleEventConfigurationA,
    );
  console.log(
    "conf details : ",
    (await EvmEverEventConf.methods.getDetails({ answerId: 0 }).call({}))._basicConfiguration,
  );
  // deploying the event contract
  let eventLog: Event = await buildAlienEventVoteData(evmTxHash);
  let eventVoteData: EventVoteDataParam;

  let eventData: string | undefined;

  const ethConfigDetails = await EvmEverEventConf.methods.getDetails({ answerId: 0 }).call({});
  const flags = (await EvmEverEventConf.methods.getFlags({ answerId: 0 }).call({}))._flags;

  eventData = await mapEthBytesIntoTonCell(
    Buffer.from(ethConfigDetails._basicConfiguration.eventABI, "base64").toString(),
    eventLog.eventData,
    flags,
  );
  eventVoteData = {
    eventTransaction: eventLog.eventTransaction,
    eventIndex: eventLog.eventIndex,
    eventData: eventData,
    eventBlockNumber: eventLog.eventBlockNumber,
    eventBlock: eventLog.eventBlock,
  };
  console.log("this is the event log ", eventVoteData);

  // await EvmEverEventConf.methods
  //   .deployEvent({ eventVoteData: eventVoteData })
  //   .send({
  //     from: await everWallet.address,
  //     amount: locklift.utils.toNano(6),
  //     bounce: true,
  //   })
  //   .then(res => {
  //     console.log("this is the res : ", res);
  //   });
}

deployAlienEvent("")
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
