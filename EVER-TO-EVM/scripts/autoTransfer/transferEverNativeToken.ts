import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction } from "locklift";
import { buildTransferPayload } from "../helpers/buildTransferPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";

async function transferEverNativeCoin(): Promise<Transaction | unknown> {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contracts
  const BRIDGETokenRoot: Contract<FactorySource["TokenRoot"]> = await locklift.factory.getDeployedContract(
    "TokenRoot",
    constants.EVERBRIDGE,
  );
  const AlienTokenWalletUpgradable: Contract<FactorySource["AlienTokenWalletUpgradeable"]> =
    locklift.factory.getDeployedContract(
      "AlienTokenWalletUpgradeable",
      (await BRIDGETokenRoot.methods.walletOf({ answerId: 0, walletOwner: everWallet.address }).call({})).value0,
    );
  // getting the payload
  const BRIDGETransferAmount: number = 0.1;
  const transferPayload = await buildTransferPayload(constants.EvmReceiver, "56");

  // wrapping
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .transfer({
        amount: locklift.utils.toNano(BRIDGETransferAmount),
        deployWalletValue: "200000000",
        notify: true,
        payload: transferPayload,
        recipient: constants.ProxyMultiVaultNativeV_4,
        remainingGasTo: constants.EventCloser,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.WEVERAutoRelease, bounce: true });

    console.log("succesfull, tx hash : ", res.id.hash);
    return res;
  } catch (e) {
    console.log("an error accures while wrapping : ", e);
    return e;
  }
}

transferEverNativeCoin()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
