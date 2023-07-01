# EVER to EVM transfer mechanics overview

1 - Locking the target token in EVERSCALE if EVERSCALE native token and burning it if EVERSCALE alien token. see [EVERSCALE token types](./concepts.md#EVERSCALE-token-types).

2 - Through previous transaction the event contract is deployed on EVERSCALE and after few second the relayers will confirm it by voting on the event contract.

3.1 : If paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with EVER, the [credit backend](./concepts.md#credit-backend) will equalizes balances on both sides and mints token if evm MultiVault token or release it if evm alien or native token, so all we can do at this point is to wait. \
Note that the native token will be released as its wrapped version.

3.2 : If paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin, its time to mint tokens if evm MultiVault token by calling `saveWithdrawNative` or release it by calling `saveWithdrawAlien` on `MultiVault` contract if the token was an alien or native evm token.

4 - At this point desired amount of target token most be deposited to recipient EVM address.

> NOTICE : All of the referenced contracts addresses can be found at [addresses.md](./addresses.md).

# EVER to EVM transfer integration step by step

### Transferring EVER

- 1 - Call the `wrap` method on the [`Vault`](./addresses.md#EVERSCALE-smart-contracts) contract and lock our newly minted WEVER in EVERSCALE:

### Function

```solidity
    function wrap(
        uint128 tokens,
        address owner_address,
        address gas_back_address,
        TvmCell payload
    ) external;
```

### Parameters

| param            | description                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| tokens           | amount of the target transferable token                                             |
| owner_address    | [Compounder](./addresses.md#EVERSCALE-smart-contracts)                              |
| gas_back_address | addresses to send the change back                                                   |
| payload          | operational payload, see [wrap payload](./concepts.md#transfer-ever--wrap-payload). |

> NOTE : gas_back_address will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#EVERSCALE-smart-contracts) if paying with ever.

### NOTE : Continue if paying the evm network operations with its native coin !!

- 2 - Mint `WEVER` in the evm network by calling the `saveWithdrawNative` :

### Function

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transferring [native token](./concepts.md#native-tokens)

> ## `BRIDGE` is used in this example.

1 - Lock the the target token to `ProxyMultiVaultNative`'s `TokenWallet` contract by calling the `transfer` function on our `TokenWallet` contract :

### Function

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

| param             | description                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| amount            | amount of the target transferable token                                                             |
| recipient         | recipient address which is [proxyMVnative](./addresses.md#EVERSCALE-smart-contracts)                |
| deployWalletValue | Token Wallet deploy value if not deployed before                                                    |
| remainingGasTo    | Remaining gas receiver                                                                              |
| notify            | Notify receiver on incoming transfer                                                                |
| payload           | Notification payload, see [transfer payload](./concepts.md#transfer-native-token--transer-payload). |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#EVERSCALE-smart-contracts) if paying with ever.

### NOTE : continue if paying the evm network operations with its native coin !!

- 2 - Mint `BRIDGE` in the evm network by calling the `saveWithdrawNative` :

### Function

```solidity
    function saveWithdrawNative(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transferring Alien Token

> ## `USDT` is used in this example.

1 - Burn the token on EVERSCALE network by calling the `burn` function on our `tokenWallet` contract :

### Function

```solidity
    function burn(
        uint128 amount,
        address remainingGasTo,
        address callbackTo,
        TvmCell payload
    ) external;
```

### Parameters

| param          | description                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| amount         | amount of the target token token                                                                 |
| callBackTo     | callback Receiver contract.[MergePoolV_4](./addresses.md#EVERSCALE-smart-contracts) in this case |
| remainingGasTo | Remaining gas receiver                                                                           |
| payload        | operational payload, see [burn payload](./concepts.md#transfer-alien-token--burn-payload).       |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#EVERSCALE-smart-contracts) if paying with ever.

### NOTE : Continue if paying the evm network operations with its native coin !!

- 2 - Release `USDT` in the evm network by calling the `saveWithdrawAlien` :

### Function

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

### Transferring Alien Token

> ## `WBNB` is used in this example.

1 - Burn the token on EVERSCALE network by calling the `burn` function on our `tokenWallet` contract :

### Function

```solidity
    function burn(
        uint128 amount,
        address remainingGasTo,
        address callbackTo,
        TvmCell payload
    ) external;
```

### Parameters

| param          | description                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------- |
| amount         | amount of the target transferable token                                                             |
| callBackTo     | callback Receiver contract.[ProxyMVAlienV_7](./addresses.md#EVERSCALE-smart-contracts) in this case |
| remainingGasTo | Remaining gas receiver                                                                              |
| payload        | operational payload, see [burn payload](./concepts.md#transfer-alien-token--burn-payload).          |

> NOTE : remainingGasTo will be our address if we were paying the [operations](./concepts.md#evm-operations) gas fees in target evm network with its native coin and will be [EventCloser](./addresses.md#EVERSCALE-smart-contracts) if paying with ever.

### NOTE : Continue if paying the evm network operations with its native coin !!

- 2 - Release `BNB` in its wrapped version in evm network by calling the `saveWithdrawAlien` :

### Function

```solidity
    function saveWithdrawAlien(
        bytes memory payload,
        bytes[] memory signatures
    ) external;
```

### Parameters

| param      | description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| payload    | operational payload, see [payload](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative).   |
| signatures | relayers signatures see [signatures](./concepts.md#payload-for-savewithdrawalien-and-savewithdrawnative). |

---

> # All of the scripts related to examples above can be found [here](../EVER-TO-EVM/scripts/)
