import * as EVER from "everscale-standalone-client";
import { Contract, Signer } from "locklift";
import { mapEthBytesIntoTonCell } from "eth-ton-abi-converter";
import { buildAlienEventVoteData } from "../../EvmOperations/scripts/helpers/buildEventVoteData";
import Event from "../../EvmOperations/interfaces/voteData";
import { FactorySource } from "../../build/factorySource";
import { EventVoteDataParam } from "../../types/index";
import { EthereumEverscaleEventConfigurationA } from "../../constants";

async function transferEverNativeTokenEvmAlien() {}

transferEverNativeTokenEvmAlien()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
