import * as EVER from "everscale-standalone-client";
import { Address, Contract, Signer } from "locklift";
async function deployAlieEvent() {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet = await EVER.EverWalletAccount.fromPubkey({ publicKey: signer.publicKey, workchain: 0 });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contract
  const EvmEverEventConf = await locklift.factory.getDeployedContract(
    "EthereumEverscaleEventConfiguration",
    new Address("0:54f2bc1064cbe7d9b057808b8578e9b2f3ff54d27ef472ffbdb16b2e4461292a"),
  );
  console.log(" conf details :", await EvmEverEventConf.methods.getDetails({ answerId: 0 }).call({}));
}
deployAlieEvent()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
