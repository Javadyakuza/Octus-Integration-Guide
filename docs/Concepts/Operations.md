# OPERATIONS

## EVM OPERATIONS

At the EVER -> EVM direction the operation's on the EVM network are as follows :

- Minting: If the token is an EVM MultiVault token.

- Releasing: If the token is an alien or native token. For native tokens, they will be released as their wrapped versions.

### Approving Alien ERC-20 Tokens

If the token being transferred from EVM to EVERSCALE is a non-EVERSCALE native MultiVault token and an ERC-20 token, it is necessary to approve the "MultiVault" contract first in order to transfer the amount of the token to itself. If the transferable token is the EVM network's native coin, the desired amount of the native coin should be attached to the transaction and the depositByNativeCoin function should be called.

### Event Contract Deploy Value (expected_evers)

The expected amount of EVER that is expected to be seen after event deployment and confirmation.

Note that in the EVM to EVER direction, if you want to pay the EVERSCALE operations in the sender's EVM network native coin, you need to set this parameter to a certain amount. \
User must set it to zero if paying the fees with EVER. \
 For more information on setting expected_evers, see [how to set expected_evers](../FAQ.md##how-to-set-expected_evers)

## EVERSCALE OPERATIONS

n the EVM to EVER direction, the following operations are performed on EVERSCALE:

- Deploying the event contract referring to token deposits on the EVM network.
- Releasing tokens if they are EVERSCALE native tokens.
- Minting tokens if they are EVM alien tokens.

## Operational Differences Between Alien Tokens and Native Tokens in EVERSCALE

- EVER -> EVM \
  When transferring a EVERSCALE native token, it will be locked on EVERSCALE and minted on evm network because its and MultiVault token on evm.\
  When transferring a EVERSCALE alien token it will be burnt on EVERSCALE and released on evm network, in case the token be evm native coin it will be released as its wrapped version.

- EVM -> EVER \
  When transferring the evm native coin, it will be wrapped into a ERC-20 (WETH, WBNB and etc), then will be locked on evm network and minted on EVERSCALE network.
  When transferring an evm alien and non-multivault token it will be locked on evm and minted on EVERSCALE network.
  When transferring an evm MultiVault Token (WEVER, BRIDGE and QUBE), it will be burnt on evm network and released on EVERSCALE network.

## Manual Asset releasing

- In the EVER to EVM direction, if the payment for the EVM network operations is in its native coin, the target assets need to be manually released or minted. Calling saveWithdrawNative will perform this operation for EVERSCALE native tokens/coins(MultiVault tokens), while calling saveWithdrawAlien will perform it for EVERSCALE alien tokens.

- In the EVM to EVER direction, if the payment for EVERSCALE operations is in EVER, the assets on EVERSCALE need to be manually released or minted by deploying event contract. \
  see [Event contract deployment](../scripts/deployEvents/).

## Automatic Asset releasing

- In EVER -> EVM direction assets will be released or minted on evm side by attaching enough EVER and proper [payload](./Payloads.md) to tx.

- In EVM -> EVER direction assets will be released or minted on EVERSCALE by attaching enough evm native coin to tx and setting the expected_ever to event contract initial balance. see [how to set expected_evers](../FAQ.md#how-to-set-expected_evers)

## Directions

Following table contains operations that are done at each network to perform Cross Chain transfer

| Direction   | What happens on EVERSCALE                    | What happens on EVM                                                             |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| EVM -> EVER | Release(Native Token/Coin) Mint(Alien Token) | Burn(MultiVault Token) - Wrap and Lock(Native Coin) - Lock(Aline token)         |
| EVER -> EVM | Lock(Native Token/Coin) Burn(Alien Token)    | Mint(MultiVault Token) - Unwrap and Release(Native Coin) - Release(Aline token) |
