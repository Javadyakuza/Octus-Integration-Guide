# ever to evm tranfer mechanics overview

1 - first we have to depoist and lock our target token in everscale network.

2 - through previous transaction the event contract is deployed on everscale.

3 - now its time to release the target coin on target evm network which there is two scenarios :

- 3.1 : if we have chosen to pay the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever, our ever is automatically swaped to its native coin and will be payed automatically, so all we can do at this point is to wait.

- 3.2 : if have chosen to pay the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with its native coin, its time to release the token by calliing either `saveWithdrawNative` or `saveWithdrawAlien` functions on `MultiVaultFacetWithdraw` contract. for defenition of the those two functions see [concepts](./concepts.md)

4 - at this point we have to see the desired amount of target token is deposited to recepient address.

# evm to ever transfer integration step by step

1 - in terms of locking assets in everscale to make a cross-chain trannsfer we have three scenarios :

### Transfering EVER

- 1 - we call the `wrap` method on the `Vault` contract :

```solidity
    function wrap(
        uint128 tokens,
        address owner_address,
        address gas_back_address,
        TvmCell payload
    ) external;
```

| param            | descritption                                                 |
| ---------------- | ------------------------------------------------------------ |
| tokens           | amount of the target transferable token                      |
| owner_addres     | Token wallet owner address                                   |
| gas_back_address | addresse to send the change back                             |
| payload          | operational payload, see [concepts](./concepts.md#Payloads). |

> NOTE : gas_back_address will be the our address if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever and will be the event closer [address](./addresses.md)

### > NOTE : if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever the next step is not needed, this is determined in payload.

> ### NOTE : with attaching proper payload to `wrap` function it deploys the event contract automatically.

- 2 - releasing `WEVER` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |

### Transfering [native token](./concepts.md#native-tokens)

> ## `BRIDGE` is used in this example.

1 - we have to transfer the the target token to `ProxyMultiVaultNative`'s `TokenWallet` contract by calling the `transfer` function on our target `TokenWallet` contract :

```solidity
    function transfer(
        uint128 amount,
        address recipient,
        uint128 deployWalletValue,
        address remainingGasTo,
        bool notify,
        TvmCell payload2
    ) external;
```

| param             | descritption                                                  |
| ----------------- | ------------------------------------------------------------- |
| amount            | amount of the target transferable token                       |
| recipient         | Tokens recipient address                                      |
| deployWalletValue | How much EVERs to attach to token wallet deploy               |
| remainingGasTo    | Remaining gas receiver                                        |
| notify            | Notify receiver on incoming transfer                          |
| payload           | Notification payload, see [concepts](./concepts.md#Payloads). |

### > NOTE : if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever the next step is not needed, this is determined in payload.

> ### NOTE : with attaching proper payload to `transfer` function it deploys the event contract automatically.

- 2 - releasing `BRIDGE` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |

### Transfering alien token

> ## `WBNB` is used in this example.

1 - first we have to burn the token by calling the `burn` function on our `tokenWallet` contract :

```solidity
    function burn(
        uint128 amount,
        address remainingGasTo,
        address callbackTo,
        TvmCell payload
    ) external;
```

| param          | descritption                                                  |
| -------------- | ------------------------------------------------------------- |
| amount         | amount of the target transferable token                       |
| callBackTo     | callback Recivier contract                                    |
| remainingGasTo | Remaining gas receiver                                        |
| payload        | Notification payload, see [concepts](./concepts.md#Payloads). |

### > NOTE : if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever the next step is not needed, this is determined in payload.

> ### NOTE : with attaching proper payload to `burn` function it deploys the event contract automatically.

- 2 - releasing `BNB` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |
