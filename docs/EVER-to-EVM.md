# EVER to EVM tranfer mechanics overview

1 - First thing is locking target token in everscale if everscale native token and burning it if ever alien token. see [everscale token types](./concepts.md#everscale-token-types).

2 - through previous transaction the event contract is deployed on everscale and after few second the relayers will confirm it by voting to the event contract.

3.1 : if paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with ever, the [credit backend](./concepts.md#credit-backend) will equalizes balances on both sides and mints token if evm native token or release it if evm alien token, so all we can do at this point is to wait.

3.2 : if paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin, its time to mint tokens if evm native token by calling `saveWithdrawNative` or release it by calling `saveWithdrawAlien` on `MultiVaultFacetWithdraw` contract.

4 - at this point the desired amount of target token most be deposited to recepient EVM address.

# EVER to EVM transfer integration step by step

### Transfering EVER

- 1 - we call the `wrap` method on the [`Vault`](./addresses.md#everscale-smart-contracts) contract and lock our newly minted WEVER in eversale:

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
| owner_addres     | [Compounder](./addresses.md#everscale-smart-contracts)                              |
| gas_back_address | addresse to send the change back                                                    |
| payload          | operational payload, see [wrap payload](./concepts.md#transfer-ever--wrap-payload). |

> NOTE : gas_back_address will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#everscale-smart-contracts) if paying with ever.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - releasing `WEVER` in the evm network by calling the `saveWithdrawNative` :

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transfering [native token](./concepts.md#native-tokens)

> ## `BRIDGE` is used in this example.

1 - we have to lock the the target token to `ProxyMultiVaultNative`'s `TokenWallet` contract by calling the `transfer` function on our `TokenWallet` contract :

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

| param             | descritption                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| amount            | amount of the target transferable token                                                             |
| recipient         | recipient address which is [proxyMVnative](./addresses.md#everscale-smart-contracts)                |
| deployWalletValue | Token Wallet deploy value if not deployed before                                                    |
| remainingGasTo    | Remaining gas receiver                                                                              |
| notify            | Notify receiver on incoming transfer                                                                |
| payload           | Notification payload, see [transfer payload](./concepts.md#transfer-native-token--transer-payload). |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#everscale-smart-contracts) if paying with ever.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - releasing `BRIDGE` in the evm network by calling the `saveWithdrawNative` :

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transfering Alien Token

> ## `USDT` is used in this example.

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

| param          | descritption                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------ |
| amount         | amount of the target token token                                                                 |
| callBackTo     | callback Recivier contract.[MergePoolV_4](./addresses.md#everscale-smart-contracts) in this case |
| remainingGasTo | Remaining gas receiver                                                                           |
| payload        | operational payload, see [burn payload](./concepts.md#transfer-alien-token--burn-payload).       |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#everscale-smart-contracts) if paying with ever.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - releasing `USDT` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transfering Alien Token

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

| param          | descritption                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------- |
| amount         | amount of the target transferable token                                                             |
| callBackTo     | callback Recivier contract.[ProxyMVAlienV_7](./addresses.md#everscale-smart-contracts) in this case |
| remainingGasTo | Remaining gas receiver                                                                              |
| payload        | operational payload, see [burn payload](./concepts.md#transfer-alien-token--burn-payload).          |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#everscale-smart-contracts) if paying with ever.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - minting `BNB` in the evm network by calling the `saveWithdrawAlien` :

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | descritption                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

> # All of the scripts related to examples above can be found [here](../EVER-TO-EVM/scripts/)
