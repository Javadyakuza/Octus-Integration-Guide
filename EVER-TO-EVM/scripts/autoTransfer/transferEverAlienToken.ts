import * as EVER from "everscale-standalone-client";
import { Contract, Signer } from "locklift";
import { mapEthBytesIntoTonCell } from "eth-ton-abi-converter";
import { buildAlienEventVoteData } from "../../EvmOperations/scripts/helpers/buildEventVoteData";
import Event from "../../EvmOperations/interfaces/voteData";
import { FactorySource } from "../../build/factorySource";
import { EventVoteDataParam } from "../../types/index";
import { EthereumEverscaleEventConfigurationA } from "../../constants";

async function transferEverAlienToken() {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
}

transferEverAlienToken()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
