import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction } from "locklift";
import { EverAbi } from "../../abi/WEVERVault";
import { buildWrapPayload } from "../helpers/buildWrapPayload";
import * as constants from "../../constants";
/**
 * this module performs transfering an ever native, evm alien token from everscale network to an evm network using transferEverNativeCoin funtcion.
 * EVER is used as token and receiver evm network is BSC at this praticular example.
 * @notice releasing assets on evm network is done automatically by attaching enough ever to tx.{see ../../constants.ts:32}
 * @returns ContractTransactionResponse returned data about the tx
 */
async function transferEverNativeCoin(): Promise<Transaction | unknown> {
  // setting ever wallet
  const signer: Signer = (await locklift.keystore.getSigner("0"))!;
  const everWallet: EVER.EverWalletAccount = await EVER.EverWalletAccount.fromPubkey({
    publicKey: signer.publicKey,
    workchain: 0,
  });
  console.log("ever wallet address : ", await everWallet.address.toString());
  // fetching the contracts
  const WEVERVaultContract: Contract<typeof EverAbi.WeverVault> = await new locklift.provider.Contract(
    EverAbi.WeverVault,
    constants.WEVERVault,
  );
  // getting the payload
  const EverTransferAmount: number = 1;
  const wrapPayload: string = await buildWrapPayload(
    everWallet.address,
    constants.EvmReceiver,
    EverTransferAmount,
    "56",
    true,
  );
  // wrapping
  try {
    const res: Transaction = await WEVERVaultContract.methods
      .wrap({
        tokens: locklift.utils.toNano(EverTransferAmount),
        owner_address: constants.Compounder,
        gas_back_address: everWallet.address,
        payload: wrapPayload,
      })
      .send({ from: everWallet.address, amount: constants.transfer_fees.EverToEvmAutoRelease, bounce: true });
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
