# EVM to Ever Transfer Mechanics Overview

1. Deposit desired amount of the target token that is going to be transferred to the EVERSCALE in a contract named `MultiVault` which is in the origin EVM network.

2. Through the previous operation, two events will be emitted. one of them is always `Deposit` and another one depended on the situation is either `AlienTransfer` or `NativeTransfer`.\
   see [alien ERC-20 token approve ](./concepts.md#approving-alien-erc-20-tokens).
3. Once depositing the target token to MultiVault is done, it's time for deploying an event Contract on the Everscale network.\
   relayers will vote on event contract and confirm the deposit in evm network.\
   Now the event contract is confirmed, following steps can be performed based on the situation :

   - 3.1: If the user at the time of deposit wanted to pay the EVERSCALE [operations](./concepts.md#ever-network-operations) gas fees with the origin EVM network native coin, user must attach enough evm native coin to tx, the [credit backend](./concepts.md#credit-backend) will equalizes balances on both sides and deploys the event contract.
     In order to perform such a operation, besides attaching sufficient value to tx, we must set [expexte_evers](./concepts.md#event-contract-deploy-value-expected_evers) to a [certain amount](FAQ.md#how-to-set-expected_evers).

   - 3.2: If the user has chosen to pay the EVERSCALE [operations](./concepts.md#ever-network-operations) gas fee with ever, which is operable by not attaching enough evm native coin and setting expected_evers to zero, it's time for the user to deploy the event contract manually. Such an operation will be done calling `deployEvent` on `EthereumEverscaleEventConfiguration` which deploys an event contract and after exceeding the quorum confirm votes by relayers the token will be released if ever native Token and minted if ever alien token.

> NOTICE : All of the referenced contracts addresses can be found at [addresses.md](./addresses.md).

# EVM to EVER Transfer Integration Step-by-Step

1. Deposit the desired amount of target token to `MultiVault` contract, which has two ways:

   ## Function

- 1.1: If target token was an ERC-20 token we must use the `deposit` function on `MultiVault` contract,
  but before that we must approve [MultiVault](./addresses.md#evm-smart-contracts) for desired token amount if token is not non-multiVault token, once approved deposit function can be called.

  ```solidity
  function deposit(depositParams memory d) external payable override;
  ```

  ## Parameters

  ```solidity
  struct DepositParams {
      IEverscale.EverscaleAddress recipient;
      address token;
      uint amount;
      uint expected_evers;
      bytes payload;
  }
  ```

  | param          | description                                                                    |
  | -------------- | ------------------------------------------------------------------------------ |
  | recipient      | ever address of recipient                                                      |
  | token          | target token                                                                   |
  | amount         | amount of the target token                                                     |
  | expected_evers | see [expected_evers](./concepts.md#event-contract-deploy-value-expected_evers) |
  | payload        | operational payload, see [payloads](./concepts.md#payloads)                    |

- 1.2: If target token was the EVM network native coin, we must use `depositByNativeToken` on `MultiVault` contract and attach the desired amount of the native coin equal to it's amount parameter to tx:

  > NOTE : In `MultiVault` the native coin will be converted to its wrapped version and then rest of the operation will be resumed.

## Function

```solidity
function depositByNativeToken(DepositNativeTokenParams memory d) external payable override;
```

## Parameters

```solidity
struct DepositNativeTokenParams {
    IEverscale.EverscaleAddress recipient;
    uint amount;
    uint expected_evers;
    bytes payload;
}
```

| param          | description                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| recipient      | ever address of recipient                                                      |
| amount         | amount of native coin                                                          |
| expected_evers | see [expected_evers](./concepts.md#event-contract-deploy-value-expected_evers) |
| payload        | operational payload, see [payloads](./concepts.md#payloads)                    |

### NOTE : Continue if paying the EVERSCALE network operations with its native coin !!

2. Now it's time to deploy the event contract which has two ways:

- 2.1: See {[EVM to Ever Transfer Mechanics Overview : 3.1](#31-if-the-user-at-the-time-of-deposit-accepted-to-pay-the-event-contract-deployment-fee-with-the-origin-evm-network-native-coin-the-relayers-will-automatically-swap-that-to-ever-which-is-the-everscale-native-coin-and-deploy-the-event-contract-themselves)}. at this step we just have to wait.

- 2.2: Deploy event contract manually by calling `deployEvent` function:

## Function

```solidity
function deployEvent(IEthereumEverscaleEvent.EthereumEverscaleEventVoteData eventVoteData) external override;
```

## Parameters

- 2.2.1

```solidity
struct EthereumEverscaleEventVoteData {
    uint eventTransaction;
    uint32 eventIndex;
    TvmCell eventData;
    uint32 eventBlockNumber;
    uint eventBlock;
}
```

The previous deposit functions emit `AlienTransfer` or `NativeTransfer` events. following parameters can be fetched and prepared from event data and its root tx. see [Deploy Events](../EVER-TO-EVM/scripts/deployEvents/).

| param            | description           |
| ---------------- | --------------------- |
| eventTransaction | eventTransaction Hash |
| eventIndex       | eventIndex            |
| eventData        | eventData             |
| eventBlockNumber | eventBlockNumber      |
| eventBlock       | eventBlock Hash       |

3. After this step tokens must be deposited to recipient EverWallet.
