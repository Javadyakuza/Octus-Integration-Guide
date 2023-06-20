## EVM to Ever Transfer Mechanics Overview

1. The user must deposit the desired amount of the target token that is going to be transferred to the Everscale in a contract named `MultiVaultFacetDeposit` which is in the origin EVM network.

2. Through the previous operation, two events will be emitted which one of them is always `Deposit` and another one depended on the situation is either `AlienTransfer` or `NativeTransfer` {see [concepts.md : alien ERC-20 token approve ](./concepts.md#approving-alien-erc-20-tokens)}.
3. Once the depositing the target token to MultiVault is done, it's time for deploying an event Contract on the Everscale network in order to relayers confirm the deposit in evm network and releasing if ever native token and minting if alien token:

   - 3.1: If the user at the time of deposit accepted to pay the everscale [operations](./concepts.md#ever-network-operations) gas fees with the origin EVM network native coin, the [credit backend](./concepts.md#credit-backend) will equalizes balances on both sides and deploys the event contract.

   - 3.2: If the user has chosen to pay the everscale [operations](./concepts.md#ever-network-operations) gas fee with ever, now it's time for the user to deploy the event contract itself. Such an operation will be done calling `deployEvent` on `EthereumEverscaleEventConfiguration` which deploys an event contract and after exceeding the quorum confirm votes by relayers the token will be released if ever native Token and minted if ever alien token.

4. After the event contract is successfully deployed on the Everscale bridge, the token will automatically be released and transferred to the recipient Everscale address.

> ### NOTICE : all fo the refrenced contracts addresses can be found at [addresses.md](./addresses.md).

## EVM to Ever Transfer Integration Step-by-Step

1. To deposit the target token to `MultiVaultFacetDeposit`, we have two options:

   - 1.1: If our token was an ERC-20 token we must use the `deposit` function on `MultiVaultFacetDeposit` contract:

   ```solidity
   function deposit(depositParams memory d) external payable override;
   ```

   ### Parameters

   ```solidity
   struct DepositParams {
       IEverscale.EverscaleAddress recipient;
       address token;
       uint amount;
       uint expected_evers;
       bytes payload;
   }
   ```

   | param          | descrition                                                                     |
   | -------------- | ------------------------------------------------------------------------------ |
   | recipient      | ever address of the token receiver                                             |
   | token          | target token                                                                   |
   | amount         | amount of the target token                                                     |
   | expected_evers | see [expected_evers](./concepts.md#event-contract-deploy-value-expected_evers) |
   | payload        | operational payload, see [payloads](./concepts.md#payloads)                    |

   - 1.2: If our token was the EVM network native coin, we must use `depositByNativeToken` on `MultiVaultFacetDeposit` contract and attach the desired amount of the native coin to the tx:

     > NOTE : in `MultiVault` the native coin will be converted to its wrapped version and then rest of the operation will be resumed.

   ```solidity
   function depositByNativeToken(DepositNativeTokenParams memory d) external payable override;
   ```

   ### Parameters

   ```solidity
   struct DepositNativeTokenParams {
       IEverscale.EverscaleAddress recipient;
       uint amount;
       uint expected_evers;
       bytes payload;
   }
   ```

   | param          | descrition                                                                     |
   | -------------- | ------------------------------------------------------------------------------ |
   | recipient      | ever address of the token receiver                                             |
   | amount         | amount of native coin                                                          |
   | expected_evers | see [expected_evers](./concepts.md#event-contract-deploy-value-expected_evers) |
   | payload        | operational payload, see [payloads](./concepts.md#payloads)                    |

   > Note: If our target token was an Alien token, this contract must be approved first (see [concepts.md](./concepts.md)).

2. Now it's time to deploy the event contract which has two ways:

   - 2.1: See {[EVM to Ever Transfer Mechanics Overview : 3.1](#31-if-the-user-at-the-time-of-deposit-accepted-to-pay-the-event-contract-deployment-fee-with-the-origin-evm-network-native-coin-the-relayers-will-automatically-swap-that-to-ever-which-is-the-everscale-native-coin-and-deploy-the-event-contract-themselves)}.
   - 2.2: In this case, we have to deploy the event contract ourselves by calling this function:

   ```solidity
   function deployEvent(IEthereumEverscaleEvent.EthereumEverscaleEventVoteData eventVoteData) external override;
   ```

   ### Parameters

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

   | param            | descrition       |
   | ---------------- | ---------------- |
   | eventTransaction | eventTransaction |
   | eventIndex       | eventIndex       |
   | eventData        | eventData        |
   | eventBlockNumber | eventBlockNumber |
   | eventBlock       | eventBlock       |

3. After this step, we must see our tokens in recipient EverWallet.
