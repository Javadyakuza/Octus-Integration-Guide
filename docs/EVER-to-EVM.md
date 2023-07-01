# EVER to EVM tranfer mechanics overview

1 - First we have to lock our token in everscale if ever native token and burning it if ever alien token. see [everscale token types](./concepts.md#everscale-token-types).

2 - through previous transaction the event contract is deployed on everscale and after few second the relayers will confirm it by voting to the event contract.

3.1 : if we desire to pay the [operations](./concepts.md#evm-operations) gas fees in target evm network with ever, the [credit backend](./concepts.md#credit-backend) will equalizes balances on both sides and mints token if evm native token or release it if evm alien token, so all we can do at this point is to wait.

3.2 : if we desire to pay the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin, its time to mint tokens if evm native token by calling `saveWithdrawNative` or release it by calling `saveWithdrawAlien` on `MultiVaultFacetWithdraw` contract.

4 - at this point we have to see the desired amount of target token is deposited to recepient address.

# EVER to EVM transfer integration step by step

### Transfering EVER

- 1 - we call the `wrap` method on the [`Vault`](./addresses.md#this-table-contains-foregoing-smart-contracts-in-ever-to-evmmd-and-evm-to-evermd-files) contract and lock our newly minted WEVER in eversale:

```solidity
    function wrap(
        uint128 tokens,
        address owner_address,
        address gas_back_address,
        TvmCell payload
    ) external;
```

### Parameters

| param            | descritption                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| tokens           | amount of the target transferable token                                             |
| owner_addres     | Token wallet owner address                                                          |
| gas_back_address | addresse to send the change back                                                    |
| payload          | operational payload, see [wrap payload](./concepts.md#transfer-ever--wrap-payload). |

> NOTE : gas_back_address will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - releasing `WEVER` in the evm network by calling the `saveWithdrawNative` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |

### Transfering [native token](./concepts.md#native-tokens)

> ## `BRIDGE` is used in this example.

1 - we have to lock the the target token to `ProxyMultiVaultNative`'s `TokenWallet` contract by calling the `transfer` function on our target `TokenWallet` contract :

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

### Parameters

| param             | descritption                                                  |
| ----------------- | ------------------------------------------------------------- |
| amount            | amount of the target transferable token                       |
| recipient         | Tokens recipient address                                      |
| deployWalletValue | How much EVERs to attach to token wallet deploy               |
| remainingGasTo    | Remaining gas receiver                                        |
| notify            | Notify receiver on incoming transfer                          |
| payload           | Notification payload, see [concepts](./concepts.md#Payloads). |

### > NOTE : if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever the next step is not needed, this is determined in payload.

- 2 - releasing `BRIDGE` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |

### Transfering alien token

> ## `WBNB` is used in this example.

1 - first we have to burn the token on everscale network by calling the `burn` function on our `tokenWallet` contract :

```solidity
    function burn(
        uint128 amount,
        address remainingGasTo,
        address callbackTo,
        TvmCell payload
    ) external;
```

### Parameters

| param          | descritption                                                  |
| -------------- | ------------------------------------------------------------- |
| amount         | amount of the target transferable token                       |
| callBackTo     | callback Recivier contract                                    |
| remainingGasTo | Remaining gas receiver                                        |
| payload        | Notification payload, see [concepts](./concepts.md#Payloads). |

### > NOTE : if we were paying the [operations](./concepts.md#evm-network-operations) gas fees in target evm network with ever the next step is not needed, this is determined in payload.

- 2 - minting `BNB` in the evm network by calling the `saveWithdrawNative` :

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                   |
| ---------- | ------------------------------------------------------------------------------ |
| payload    | operational payload, see [concepts](./concepts.md#Payloads).                   |
| signatures | signaturre with the relayers publickey see [concepts](./concepts.md#Payloads). |
