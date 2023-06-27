import * as EVER from "everscale-standalone-client";
import { Contract, Signer, Transaction } from "locklift";
import { EverAbi } from "../../abi/WEVERVault";
import { buildWrapPayload } from "../helpers/buildWrapPayload";
import * as constants from "../../constants";

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
  const wrapPayload = await buildWrapPayload(everWallet.address, constants.EvmReceiver, EverTransferAmount, "56", true);
  // wrapping
  try {
    const res: Transaction = await WEVERVaultContract.methods
      .wrap({
        tokens: locklift.utils.toNano(EverTransferAmount),
        owner_address: constants.Compounder,
        gas_back_address: everWallet.address,
        payload: wrapPayload,
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
