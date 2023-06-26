# EVM to EVER scripts

## table of contents

- [auto transfering](#auto-transfering)
- [manual transfering](#auto-transfering)
- [manual](#auto-transfering)

## auto transfering

containing scripts for transfering EVM alien and native tokens to everscale with automatic event deploying on everscale network.

### usage

```shell
// transfering evm alien token
npx hardhat run scripts/autoTransfer/transferEvmAlienToken.ts --network BSC
// transfering evm native token
npx hardhat run scripts/autoTransfer/transferEvmNativeToken.ts --network BSC
```

> Note: The default tokens are USDT and BNB for the above code. Change the alien token address if needed.

## manual Transfering

containing scripts for transfering EVM alien and native tokens to everscale with manuall event deploying on everscale network.

### usage

```shell
// transfering evm alien token ever alien token
npx hardhat run scripts/autoTransfer/transferEvmAlienEverAlien.ts --network BSC
// deploying MultiVaultEVMEverscaleEventAlienEvent
// NOTICE : you must move to EVER-TO-EVM directory for following command and change the input of the deployAlienEvent to your tx hash
npx locklift run -s scripts/deployEvents/1-DeployEvmEverAlienEvent.ts -n everscale
```

```shell
// transfering evm alien token ever native token
npx hardhat run scripts/autoTransfer/transferEvmAlienEverNative.ts --network BSC
// deploying MultiVaultEVMEverscaleEventNativeEvent
// NOTICE : you must move to EVER-TO-EVM directory for following command and change the input of the deployNativeEvent to your tx hash
npx locklift run -s scripts/deployEvents/1-DeployEvmEverNativeEvent.ts -n everscale
```

```shell
// transfering evm native token ever alien token
npx hardhat run scripts/autoTransfer/transferEvmNativeEverAlien.ts --network BSC
// deploying MultiVaultEVMEverscaleEventAlienEvent
// NOTICE : you must move to EVER-TO-EVM directory for following command and change the input of the deployAlienEvent to your tx hash
npx locklift run -s scripts/deployEvents/1-DeployEvmEverAlienEvent.ts -n everscale
```

## helpers

containing scripts that uses evm tx hashes to prepares the EventVoteData param to be used in deploying everscale event.
