# EVER to EVM direction code samples

The current folder contains a comprehensive collection of code samples and scripts that cover and handle all the cases mentioned in the EVER to EVM [documentation](../docs/EVER-to-EVM.md).

# Table of Contents

- Auto transfers

  - [EVER Alien Token](./scripts/autoTransfer/transferEverAlienToken.ts)
  - [EVER Native Token](./scripts/autoTransfer/transferEverNativeToken.ts)
  - [EVER Native Coin](./scripts/autoTransfer/transferEverNativeCoin.ts)

- Manual Transfer

  - [EVER and EVM Alien Token](./scripts/manualTransfer/transferEverAlienEvmAlienToken.ts)
  - [EVER Alien EVM Native Token](./scripts/manualTransfer/transferEverAlienEvmNativeToken.ts)
  - [EVER Native EVM Alien Token](./scripts/manualTransfer/transferEverNativeEvmAlienToken.ts)
  - [EVER Native Coin EVM Alien Token](./scripts/manualTransfer/transferEverNativeCoinEvmAlienToken.ts)

- Deploy EVM to EVER Events

  - [deploy Alien Event](./scripts/deployEvents/1-DeployEvmEverAlienEvent.ts)
  - [deploy Native Event](./scripts/deployEvents/2-DeployEvmEverNativeEvent.ts)

- Payloads builders

  - [Burn Payload](./scripts/helpers/buildBurnPayload.ts)
  - [Transfer Payload](./scripts/helpers/buildTransferPayload.ts)
  - [Wrap Payload](./scripts/helpers/buildWrapPayload.ts)
  - [SaveWithdraw Payload](./scripts/helpers/buildSaveWithdrawPayload.ts)

- Utils

  - [Derive Event Address](./scripts/helpers/deriveEverEvmEventAddress.ts)

- successful Transaction Hashes :
  - [Auto Transfer](./scripts/autoTransfer/TRANSACTIONS.md)
  - [Manual Transfer](./scripts/manualTransfer/TRANSACTIONS.md)
