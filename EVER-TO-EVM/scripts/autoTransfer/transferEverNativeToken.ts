import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction } from "locklift";
import { buildTransferPayload } from "../helpers/buildTransferPayload";
import * as constants from "../../constants";
import { FactorySource } from "../../build/factorySource";
/**
 * this module performs transferring an ever native, evm alien token from everscale network to an evm network using transferEverNativeToken function.
 * BRIDGE is used as token and receiver evm network is BSC at this particular example.
 * @notice releasing assets on evm network is done automatically by attaching enough ever to tx.{see ../../constants.ts:32}
 * @returns ContractTransactionResponse returned data about the tx
 */
async function transferEverNativeToken(): Promise<Transaction | unknown> {
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
  const transferPayload: [string, string] = await buildTransferPayload(constants.EvmReceiver, "56");

  // transferring
  try {
    const res: Transaction = await AlienTokenWalletUpgradable.methods
      .transfer({
        amount: locklift.utils.toNano(BRIDGETransferAmount),
        deployWalletValue: "200000000",
        notify: true,
        payload: transferPayload[0],
        recipient: constants.ProxyMultiVaultNativeV_4,
        remainingGasTo: constants.EventCloser,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmAutoRelease, bounce: true });

    console.log("successful, tx hash : ", res.id.hash);
    return res;
  } catch (e) {
    console.log("an error accrued while wrapping : ", e);
    return e;
  }
}

transferEverNativeToken()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
