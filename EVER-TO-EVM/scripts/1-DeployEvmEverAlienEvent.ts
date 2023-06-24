import * as EVER from "everscale-standalone-client";
import { Address, Contract, Signer } from "locklift";
import { FactorySource } from "../build/factorySource";
import { EncodeMultiVaultAlienEVMEverscaleParam, EventVoteDataParam } from "../types/index";
import {
  EthereumEverscaleEventConfigurationA,
  EthereumEverscaleEventConfigurationN,
  CellEncoderStandalone,
} from "../constants";
import { CreateAccountOutput } from "locklift/types";
/**
 * @description at this module we will deploy MultiVaultEVMEverscaleEventAlien contract in order to complete the deposit proccess on
 * evm network in order to perform a transfer a ever alien token from evm network to ever.
 * USDT token is used in this particualr example
 */
async function deployAlieEvent() {
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
  // deploying the event contract
  let cellEncoder: Contract<FactorySource["CellEncoderStandalone"]> = await locklift.factory.getDeployedContract(
    "CellEncoderStandalone",
    CellEncoderStandalone,
  );

  let eventDataStructure: EncodeMultiVaultAlienEVMEverscaleParam;

  let eventVoteData: EventVoteDataParam;

  let eventDataEncoded: string;

  const alienTokenBase = {
    chainId: "56",
    token: "55d398326f99059ff775485246999027b3197955",
  };

  const alienTokenMeta = {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 18,
  };

  eventDataStructure = {
    base_chainId: alienTokenBase.chainId,
    base_token: alienTokenBase.token,
    ...alienTokenMeta,

    amount: 10 ** 17,
    recipient_wid: everWallet.address.toString().split(":")[0],
    recipient_addr: `0x${everWallet.address.toString().split(":")[1]}`,

    value: 1500000000000000,
    expected_evers: 4000000000, // if 5000000000 or more event will be deployed autimatically.
    payload: "",
  };

  eventDataEncoded = await cellEncoder.methods
    .encodeMultiVaultAlienEVMEverscale(eventDataStructure)
    .call()
    .then(t => t.value0);

  eventVoteData = {
    eventTransaction: 111,
    eventIndex: 222,
    eventData: eventDataEncoded,
    eventBlockNumber: 333,
    eventBlock: 444,
  };
}

deployAlieEvent()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
