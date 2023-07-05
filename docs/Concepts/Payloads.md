## PAYLOADS

#### OctusBridge provides a feature to attach payload to bridge transfer's in order to perform various operations such as swapping, arbitrage, and more.

For token transfers at EVM -> EVER direction payloads can be empty.

For token transfers at EVER -> EVM payloads are needed, their recipe's can be found below :

- Transfer EVER : [wrap payload](../../scripts/EVER-TO-EVM/scripts/helpers/buildWrapPayload.ts)
- Transfer Native Token : [transfer payload](../../scripts/EVER-TO-EVM/scripts/helpers/buildTransferPayload.ts)
- Transfer Alien Token : [burn payload](../../scripts/EVER-TO-EVM/scripts/helpers/buildBurnPayload.ts)
- saveWithdrawAlien & saveWithdrawNative :

  Mentioned function's have two inputs (payload, signatures)

- [payload](../../scripts/EVER-TO-EVM/scripts/helpers/buildSaveWithdrawPayload.ts)
- [signatures](../../scripts/EVER-TO-EVM/scripts/helpers/getSignatures.ts)
