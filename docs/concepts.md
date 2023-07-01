# TOKEN TYPES

## EVERSCALE TOKEN TYPES

### Alien Tokens

Tokens that are not originally from Everscale are known as "alien" tokens. Examples include [WETH](./addresses.md#weth), [WBTC](./addresses.md#wbtc), [USDT](./addresses.md#usdt) and etc.

### Native Tokens

Tokens that are originally from Everscale are known as "native" tokens. Examples include [WEVER](./addresses.md#wever). [BRIDGE](./addresses.md#bridge) and [QUBE](./addresses.md#qube).

## EVM TOKEN TYPES

### Alien Tokens

Tokens that are ERC-20 and non-native everscale token and non-native coin in target evm network(ETH, BNB, FTM and etc), are known as alien tokens, Examples include **USDT**, **USDC**, **WBTC** and etc.

### Native Tokens

Tokens that are target's evm network native coin. Examples include **MATIC**, **BNB** and **ETH** and etc.

### MultiVault Tokens

Tokens that are everscale native token or coin. Examples include **WEVER**, **BRIDGE** and **QUBE**.

---

# OPERATIONS

## EVM OPERATIONS

at the EVER -> EVM direction the operation's on the EVM network are as follows :

- minting if evm MultiVault token and releasing if alien or native token, native token will be released as its wrapped version.

### Approving Alien ERC-20 Tokens

If the target token being transferred from EVM to Everscale is **non-everscale native** (MultiVault Token) and **ERC-20 token**, it's necessary to approve the "Multivault" contract at the first in order to transfer the amount of target token to itself. If the transferable token is the EVM network's native coin, we must attach the desired amount of native coin to tx and call the `depositbyNativeCoin`.

### Event Contract Deploy Value (Expected_Evers)

Amount of ever which we expect to see after event deployment and confirmation.

Note that in EVM -> EVER direction, if we want to pay the everscale operations in sender evm network native coin, we have to detemine that by setting this parameter to a certain amount and viceversa. see [how to set expected_evers ?](./FAQ.md##how-to-set-expected_evers)

## EVERSCALE OPERATIONS

at the EVM -> EVER direction the operation's on the everscale as follows :

- deploying the event contract referring to token deposit on evm network.

- releasing token if ever native token and minting if evm alien token.

## Operational Differences Between Alien Tokens and Native Tokens in Everscale

- EVER -> EVM \
  When transfering a everscale native token, it will be locked on everscale and minted on evm network because its and MultiVault token on evm.\
  when transfering a everscale alien token it will be burnt on everscale and released on evm network, in case the token be evm native coin it will be released as its wrapped version.

- EVM -> EVER \
  When transfering the evm native coin, it will be wrapped into a ERC-20 (WETH, WBNB and etc), then will be locked on evm network and minted on everscale network.
  when transfering an evm alien and non-multivault token it will be locked on evm and minted on everscale network.
  When transfering an evm MultiVault Token (WEVER, BRIDGE and QUBE), it will be burnt on evm network and released on everscale network.

### Manual Asset releasing

- In EVER -> EVM direction, if paying the evm network operations in its native coin, we have to manually release or mint target assets. calling `saveWithdrawNative` if transfering an everscale native token/coin and calling `saveWithdrawAlien` if transfering a everscale alien token will perform such a operation.

- In EVM -> EVER direction, if paying the everscal operations with EVER, we have to manually release assets on everscale by [deploying event contracts](../EVER-TO-EVM/scripts/deployEvents/).

### Automatic Asset releasing

- In EVER -> EVM direction assets will be released or minted on evm side by attaching enough EVER and propoer [payload](#payloads) to tx.

- In EVM -> EVER direction assets will be released or minted on everscale by attaching enough evm native coin to tx and setting the expected_ever to event contract initial balance. how to set [expected_evers](./FAQ.md#how-to-set-expected_evers)

---

# EVENTS

## EVM TO EVER EVENTS

there is two types of event contracts at mentioned direction that will be deployed on everscale.

- `MultiVaultEVMEverscaleEventNative`
- `MultiVaultEVMEverscaleEventAlien`

Deployer of these event contract's is [`EthereumEverscaleEventConfiguration`](#ethereumeverscaleeventconfiguration) contract,\
which is deployed by [`EthereumEverscaleEventConfigurationFactory`](./addresses.md#contractaddresses).

### EthereumEverscaleEventConfiguration

this contract has two version, one deploys `MultiVaultEVMEverscaleEventNative` contracts and another one deploys `MultiVaultEVMEverscaleEventAlien`.

these contracts can be called by the user with `deploEvent` function or by the [credit backend](#credit-backend) with `deploEvents`.

`MultiVaultEVMEverscaleEventNative` is deployed when transfering a everscale native token and `MultiVaultEVMEverscaleEventAlien` are deployed when transfering everscale alien token.

#### `EthereumEverscaleEventConfiguration` contract has two deployed version for each network, OctusBridge support's 6 network's except evescale right now, so we have 12 `EthereumEverscaleEventConfiguration` contract's, all these addresses can be found [here](./addresses.md).

## EVER TO EVM EVENTS

there is two types of event contracts at this direction that will be deployed on everscale.

- `MultiVaultEverscaleEVMEventNative`
- `MultiVaultEverscaleEVMEventAlien`

deployer of these contract's is [`EverscaleEthereumEventConfiguration`](#everscaleethereumeventconfiguration) contract, \
 which is deployed by [`EverscaleEthereumEventConfigurationFactory`](./addresses.md#contractaddresses).

### EverscaleEthereumEventConfiguration

this contract has two versions, one deployes `MultiVaultEverscaleEVMEventNative` contracts and another one deploys `MultiVaultEverscaleEVMEventAlien`.

`MultiVaultEverscaleEVMEventNative` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultNative_V4`

`MultiVaultEverscaleEVMEventAlien` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultAlien_V7`

`MultiVaultEverscaleEVMEventNative` is deployed when transfering a ever native token and `MultiVaultEverscaleEVMEventAlien` are deployed when transfering ever alien token.

> In the EVER -> EVM direction, event deploying is done automatically.

## credit backend

- Credit backends are a set of backend scripts that, in addition to their other responsibilities, are responsible for deploying event contracts, manually equalizing balances between associated networks during a transaction and [releasing or minting](#operational-differences-between-alien-tokens-and-native-tokens-in-everscale) tokens on recipient network.

---

# PAYLOADS

Octus Bridge provides a feature to attach payload to bridge transfer's in order to perform many operations such as swapping, arbitrage, and more.

For token transfers at EVM -> EVER direction payloads can be empty.

For token transfers in EVER -> EVM payloads are needed, their recipe's can be found below :

- ### Transfer EVER : [wrap payload](../EVER-TO-EVM/scripts/helpers/buildWrapPayload.ts)
- ### Transfer Native Token : [transer payload](../EVER-TO-EVM/scripts/helpers/buildTransferPayload.ts)
- ### Transfer Alien Token : [burn payload](../EVER-TO-EVM/scripts/helpers/buildBurnPayload.ts)
- ### Payload for saveWithdrawAlien and saveWithdrawNative :
  mentioned function's have two inputs (payload, signatures)
  - [payload](../EVER-TO-EVM/scripts/helpers/buildSaveWithdrawPayload.ts)
  - [signatures](../EVER-TO-EVM/scripts/helpers/getSignatures.ts)
