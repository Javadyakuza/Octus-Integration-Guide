# TOKEN TYPES

## EVER TOKEN TYPES

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

### Approving Alien ERC-20 Tokens

If the target token being transferred from EVM to Everscale is **non-everscale native** and **ERC-20 token**, it's necessary to approve the "Multivault" contract at the first in order to transfer the amount of target token to itself. If the transferable token is the EVM network's native coin, we must attach the desired amount of native coin to tx and call the `depositbyNativeCcoin`.

## Event Contract Deploy Value (Expected_Evers)

Amount of ever which we expect to see after event deployment and confirmation.

Note that in EVM -> EVER direction, if we want to pay the EVER network operations in sender evm network native coin, we have to detemine that by setting this parameter to a certain amount and viceversa. see [how to set expected_evers ?](./FAQ.md##how-to-set-expected_evers)

## Operational Differences Between Alien Tokens and Native Tokens in Everscale

- EVER -> EVM : When we transfer a ever native token, it will be locked on ever and released on evm network and when we want to transfer an alien token it will be burnt on ever and released on evm if alien evm token and minted if evm native token on evm network.

- EVM -> EVER : WHEN we transfer a evm native token, it will be burnt on evm network and minted on ever network and when we want to transfer an alien token it will be locked on evm and released on ever if ever native token and minted if ever alien token on ever network.

## EVER Network operations

at the EVM to EVER direction the operation's on the EVM network are as follows :

- deploying the event contract referring to token deposit on evm network.

- releasing token if ever native token and minting if evm alien token.

## EVM TO EVER EVENTS

there is two types of event contracts at this direction that will be deployed on everscale.

- `MultiVaultEVMEverscaleEventNative`
- `MultiVaultEVMEverscaleEventAlien`
  these type of evetns are made to emit the `Confirmed` event and release(ever native token) or mint(ever alien token) and then get closed.\

these event contracts are deployed by [`EthereumEverscaleEventConfiguration`](#ethereumeverscaleeventconfiguration) contract which is deployed by [`EthereumEverscaleEventConfigurationFactory`](./addresses.md#contractaddresses)

> see also [EVER TO EVM EVENTS](#ever-to-evm-events)

## EthereumEverscaleEventConfiguration

this contract has two types, one type deployes `MultiVaultEVMEverscaleEventNative` contracts and another type deploys `MultiVaultEVMEverscaleEventAlien`.

these contracts can be called by the user with `deploEvent` function or by the credit backend with `deploEvents`.

`MultiVaultEVMEverscaleEventNative` is deployed when transfering a ever native token and `MultiVaultEVMEverscaleEventAlien` are deployed when transfering ever alien token.

#### `EthereumEverscaleEventConfiguration` contract has two deployed version for each network, we are supporting 6 network's except evescale right now so we have 12 `EthereumEverscaleEventConfiguration` contrat's, all these addresses can be found [here](./addresses.md)

## credit backend

- Credit backends are a set of backend scripts that, in addition to their other responsibilities, are responsible for deploying event contracts, manually equalizing balances between associated networks during a transaction and [releasing or minting](#operational-differences-between-alien-tokens-and-native-tokens-in-everscale) tokens on recipient network.

### [EVM-to-EVER ⏎](./EVM-to-EVER.md)

# EVER to EVM Concepts

## EVM Network operations

at the EVER to EVM direction the operation's on the EVM network are as follows :

- minting if evm native token and releasing if alien token.

## EVER TO EVM EVENTS

there is two types of event contracts at this direction that will be deployed on everscale.

- `MultiVaultEverscaleEVMEventNative`
- `MultiVaultEverscaleEVMEventAlien`
  these type of evetns are made to emit the `Confirmed` event and then get closed.

these event contracts are deployed by [`EverscaleEthereumEventConfiguration`](#everscaleethereumeventconfiguration) contract which is deployed by [`EverscaleEthereumEventConfigurationFactory`](./addresses.md#contractaddresses)

> see also [EVM TO EVEVR EVENTS](#evm-to-ever-events)

## EverscaleEthereumEventConfiguration

this contract has two types, one type deployes `MultiVaultEverscaleEVMEventNative` contracts and another type deploys `MultiVaultEverscaleEVMEventAlien`.

`MultiVaultEverscaleEVMEventNative` deployer `EverscaleEthereumEventConfiguration` contract `deployEvent` function is only callable by `ProxyMultiVaultNative_V4`

`MultiVaultEverscaleEVMEventAlien` deployer `EverscaleEthereumEventConfiguration` contract `deployEvent` function is only callable by `ProxyMultiVaultAlien_V7`

`MultiVaultEverscaleEVMEventNative` is deployed when transfering a ever native token and `MultiVaultEverscaleEVMEventAlien` are deployed when transfering ever alien token.

> In the EVER -> EVM direction, only the ProxyMV's has the duty of deploying the event, and the user is not needed to do that.

### [EVER-to-EVM ⏎](./EVER-to-EVM.md)

# PAYLOADS

Octus Bridge provides a feature to attach payload to bridge transfer in order to perform many operations such as swapping, flash loans, and more.

For simple token transfers in EVM -> EVER direction payloads are not needed.

For token transfers in EVER -> EVM payloads are needed, their recipe's can be found below :

- ### Transfer EVER : [wrap payload](../EVER-TO-EVM/scripts/helpers/buildWrapPayload.ts)
- ### Transfer Native Token : [transer payload](../EVER-TO-EVM/scripts/helpers/buildTransferPayload.ts)
- ### Transfer Alien Token : [burn payload](../EVER-TO-EVM/scripts/helpers/buildBurnPayload.ts)
- ### Payload for saveWithdrawAlien and saveWithdrawNative :
  two mentioned functions have two inputs (payload, signatures).
  - [signatures](../EVER-TO-EVM/scripts/helpers/getSignatures.ts)
  - [payload](../EVER-TO-EVM/scripts/helpers/buildSaveWithdrawPayload.ts)
