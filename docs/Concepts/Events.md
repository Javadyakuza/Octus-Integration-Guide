# EVENTS

## EVM TO EVER EVENTS

There is two types of event contracts at mentioned direction that will be deployed on EVERSCALE.

- `MultiVaultEVMEverscaleEventNative`
- `MultiVaultEVMEverscaleEventAlien`

Deployer of these event contract's is [`EthereumEverscaleEventConfiguration`](#ethereumEverscaleeventconfiguration) contract,\
which is deployed by [`EthereumEverscaleEventConfigurationFactory`](../addresses.md#contractaddresses).

### EthereumEverscaleEventConfiguration

This contract has two version, one deploys `MultiVaultEVMEverscaleEventNative` contracts and another one deploys `MultiVaultEVMEverscaleEventAlien`.

These contracts can be called by the user with `deployEvent` function or by the [credit backend](#credit-backend) with `deployEvents`.

`MultiVaultEVMEverscaleEventNative` is deployed when transferring a EVERSCALE native token and `MultiVaultEVMEverscaleEventAlien` are deployed when transferring EVERSCALE alien token.

#### `EthereumEverscaleEventConfiguration` contract has two deployed version for each network, OctusBridge support's 6 network's except EVERSCALE right now, so we have 12 `EthereumEverscaleEventConfiguration` contract's, all these addresses can be found [here](../addresses.md).

## EVER TO EVM EVENTS

There is two types of event contracts at this direction that will be deployed on EVERSCALE.

- `MultiVaultEverscaleEVMEventNative`
- `MultiVaultEverscaleEVMEventAlien`

Deployer of these contract's is [`EverscaleEthereumEventConfiguration`](#EverscaleEthereumeventconfiguration) contract, \
 Which is deployed by [`EverscaleEthereumEventConfigurationFactory`](../addresses.md#contractaddresses).

### EverscaleEthereumEventConfiguration

this contract has two versions, one deploys `MultiVaultEverscaleEVMEventNative` contracts and another one deploys `MultiVaultEverscaleEVMEventAlien`.

`MultiVaultEverscaleEVMEventNative` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultNative_V4`

`MultiVaultEverscaleEVMEventAlien` deployer is `EverscaleEthereumEventConfiguration` contract and it's `deployEvent` function is only callable by `ProxyMultiVaultAlien_V7`

`MultiVaultEverscaleEVMEventNative` is deployed when transferring a ever native token and `MultiVaultEverscaleEVMEventAlien` are deployed when transferring ever alien token.

> In the EVER -> EVM direction, event deploying is done automatically.
