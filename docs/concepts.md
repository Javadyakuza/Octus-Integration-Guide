# TOKEN TYPES

## EVERSCALE TOKEN TYPES

### Alien Tokens

Tokens that are not originally from EVERSCALE are known as alien tokens. Examples include [WETH](./addresses.md#weth), [WBTC](./addresses.md#wbtc), [USDT](./addresses.md#usdt) and others.

### Native Tokens

Tokens that are originally from EVERSCALE are known as native tokens. Examples include [WEVER](./addresses.md#wever). [BRIDGE](./addresses.md#bridge) and [QUBE](./addresses.md#qube).

## EVM TOKEN TYPES

### Alien Tokens

Tokens that are ERC-20 and non-native EVERSCALE token and non-native coin in target evm network(ETH, BNB, FTM and etc), are known as alien tokens. Examples include **USDT**, **USDC**, **WBTC** and etc.

### Native Tokens

Tokens that are target's evm network native coin. Examples include **MATIC**, **BNB** and **ETH** and etc.

### MultiVault Tokens

Tokens that are EVERSCALE native token or coin. Examples include **WEVER**, **BRIDGE** and **QUBE**.

---

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
 For more information on setting expected_evers, see [how to set expected_evers](./FAQ.md##how-to-set-expected_evers)

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

### Manual Asset releasing

- In the EVER to EVM direction, if the payment for the EVM network operations is in its native coin, the target assets need to be manually released or minted. Calling saveWithdrawNative will perform this operation for EVERSCALE native tokens/coins(MultiVault tokens), while calling saveWithdrawAlien will perform it for EVERSCALE alien tokens.

- In the EVM to EVER direction, if the payment for EVERSCALE operations is in EVER, the assets on EVERSCALE need to be manually released or minted by deploying event contract. \
  see [Event contract deployment](../EVER-TO-EVM/scripts/deployEvents/).

### Automatic Asset releasing

- In EVER -> EVM direction assets will be released or minted on evm side by attaching enough EVER and proper [payload](#payloads) to tx.

- In EVM -> EVER direction assets will be released or minted on EVERSCALE by attaching enough evm native coin to tx and setting the expected_ever to event contract initial balance. see [how to set expected_evers](./FAQ.md#how-to-set-expected_evers)

### Directions

Following table contains operations that are done at each network to perform Cross Chain transfer

| Direction   | What happens on EVERSCALE                    | What happens on EVM                                                             |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| EVM -> EVER | Release(Native Token/Coin) Mint(Alien Token) | Burn(MultiVault Token) - Wrap and Lock(Native Coin) - Lock(Aline token)         |
| EVER -> EVM | Lock(Native Token/Coin) Burn(Alien Token)    | Mint(MultiVault Token) - Unwrap and Release(Native Coin) - Release(Aline token) |

---

# EVENTS

## EVM TO EVER EVENTS

There is two types of event contracts at mentioned direction that will be deployed on EVERSCALE.

- `MultiVaultEVMEverscaleEventNative`
- `MultiVaultEVMEverscaleEventAlien`

Deployer of these event contract's is [`EthereumEverscaleEventConfiguration`](#ethereumEverscaleeventconfiguration) contract,\
which is deployed by [`EthereumEverscaleEventConfigurationFactory`](./addresses.md#contractaddresses).

### EthereumEverscaleEventConfiguration

This contract has two version, one deploys `MultiVaultEVMEverscaleEventNative` contracts and another one deploys `MultiVaultEVMEverscaleEventAlien`.

These contracts can be called by the user with `deployEvent` function or by the [credit backend](#credit-backend) with `deployEvents`.

`MultiVaultEVMEverscaleEventNative` is deployed when transferring a EVERSCALE native token and `MultiVaultEVMEverscaleEventAlien` are deployed when transferring EVERSCALE alien token.

#### `EthereumEverscaleEventConfiguration` contract has two deployed version for each network, OctusBridge support's 6 network's except EVERSCALE right now, so we have 12 `EthereumEverscaleEventConfiguration` contract's, all these addresses can be found [here](./addresses.md).

## EVER TO EVM EVENTS

There is two types of event contracts at this direction that will be deployed on EVERSCALE.

- `MultiVaultEverscaleEVMEventNative`
- `MultiVaultEverscaleEVMEventAlien`

Deployer of these contract's is [`EverscaleEthereumEventConfiguration`](#EverscaleEthereumeventconfiguration) contract, \
 Which is deployed by [`EverscaleEthereumEventConfigurationFactory`](./addresses.md#contractaddresses).

### EverscaleEthereumEventConfiguration

this contract has two versions, one deploys `MultiVaultEverscaleEVMEventNative` contracts and another one deploys `MultiVaultEverscaleEVMEventAlien`.

`MultiVaultEverscaleEVMEventNative` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultNative_V4`

`MultiVaultEverscaleEVMEventAlien` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultAlien_V7`

`MultiVaultEverscaleEVMEventNative` is deployed when transferring a ever native token and `MultiVaultEverscaleEVMEventAlien` are deployed when transferring ever alien token.

> In the EVER -> EVM direction, event deploying is done automatically.

## credit backend

- Credit backends are a set of backend scripts that, in addition to their other responsibilities, are responsible for deploying event contracts, manually equalizing balances between associated networks during a transaction and [releasing or minting](#operational-differences-between-alien-tokens-and-native-tokens-in-EVERSCALE) tokens on recipient network.

---

# PAYLOADS

### OctusBridge provides a feature to attach payload to bridge transfer's in order to perform various operations such as swapping, arbitrage, and more.

### For token transfers at EVM -> EVER direction payloads can be empty.

### For token transfers at EVER -> EVM payloads are needed, their recipe's can be found below :

- ### Transfer EVER : [wrap payload](../EVER-TO-EVM/scripts/helpers/buildWrapPayload.ts)
- ### Transfer Native Token : [transfer payload](../EVER-TO-EVM/scripts/helpers/buildTransferPayload.ts)
- ### Transfer Alien Token : [burn payload](../EVER-TO-EVM/scripts/helpers/buildBurnPayload.ts)
- ### Payload for saveWithdrawAlien and saveWithdrawNative :
  Mentioned function's have two inputs (payload, signatures)
  - [payload](../EVER-TO-EVM/scripts/helpers/buildSaveWithdrawPayload.ts)
  - [signatures](../EVER-TO-EVM/scripts/helpers/getSignatures.ts)
