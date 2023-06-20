# <center> <span style="color:red"> EVM </span> to <span style="color:green"> EVER </span> Concepts</center>

# Alien Tokens

Tokens that are not originally from Everscale are known as "alien" tokens. Examples include [WETH](./addresses.md#weth), [WBTC](./addresses.md#wbtc), [USDT](./addresses.md#usdt) and etc.

- #### Approving Alien ERC-20 Tokens

If the target token being transferred from EVM to Everscale is an ERC-20 token, it is necessary to approve the "Multivault" contract at the first in order to transfer the token target amount to itself. If the transferable token is the EVM network's native coin, we must attach the desired amount of native coin to tx which calls the `depositbyNativeCcoin`.

# Native Tokens

Tokens that are originally from Everscale are known as "native" tokens. Examples include [WEVER](./addresses.md#wever). [BRIDGE](./addresses.md#bridge) and [QUBE](./addresses.md#qube).

# Event Contract Deploy Value (Expected_Evers)

is amount of ever which we expect to see after deploying the event contract and confirming it.

> ### this parameter is needed when we are using `deposit` funnction which is for transfering alien token to everscale.

In order for a transfer to be confirmed in the Everscale bridge, an event contract containing the data of the transfer event on the EVM network must be deployed in the Everscale network. The deploy value of that contract must be paid by the user in ever.

- 1 - users can deploy the event contract themselves in case of paying with ever directly.
- 2 - event contracat will be deployed by credit backend in case of paying with evm native coin, credit backends have wallets in all networks and equalizes balances.

# Operational Differences Between Alien Tokens and Native Tokens in Everscale

- EVER -> EVM : WHEN we transfer a ever native token, it will be locked/frozen on ever and released on evm network and when we want to transfer an alien token it will be burnt on ever and released on alien evm token and minted if evm native token on evm network.

- EVM -> EVER : WHEN we transfer a evm native token, it will be burnt on evm network and minted on ever network and when we want to transfer an alien token it will be locked/frozen on evm and released if ever native token and minted if ever alien token on ever network.

# EVER Network operations

at the EVM to EVER direction the operation's on the EVM network are as follows :

- deploying the event contract referring to token deposit on evm network.

- releasing token if ever native token and minting if evm alien token.

# credit backend

- Credit backends are a set of backend scripts that, in addition to their other responsibilities, are responsible for deploying event contracts and manually equalizing balances between associated networks during a transaction.

### [EVM-to-EVER ⏎](./EVM-to-EVER.md)

# <center> <span style="color:green"> EVER </span> to <span style="color:red"> EVM </span> Concepts</center>

# EVM Network operations

at the EVER to EVM direction the operation's on the EVM network are as follows :

- minting if evm native token and releasing if alien token.

### [EVER-to-EVM ⏎](./EVER-to-EVM.md)

# PAYLOADS

- ### Payload for wrapping :
- ### Payload for savingWithdrawAlien :
- ### Payload for savingWithdrawNative :
- ### payload for burning :
- ### payload for NT transfer :
  🔳 ivan, [6/20/23 1:35 AM]
  evm-tvm: locked(alien)/burned(native) -> minted(alien)/released(native)

🔳 ivan, [6/20/23 1:35 AM]
tvm-evm: locked(native)/burned(alien) -> minted(native)/released(alien)
