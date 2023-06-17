# <center> <span style="color:red"> EVM </span> to <span style="color:green"> EVER </span> Concepts</center>

# Alien Tokens

Tokens that are not originally from Everscale are referred to as "alien" tokens. Examples include ETH, BTC, USDT, DOGE and others.

- #### Approving Alien ERC-20 Tokens:

If the target token being transferred from EVM to Everscale is an ERC-20 token, it is necessary to approve the "Multivault" contract first in order to transfer the token target amount to itself. If the transferable token is the EVM network's native coin, we have to prompt the user.

# Native Tokens

Tokens that are originally from Everscale are known as "native" tokens. Examples include EVER, WEVER, bridgeToken and others.

# Event Contract Deploy Value (Expected_Evers)

In order for a transfer to be confirmed in the Everscale bridge, an event contract containing the data of the transfer event on the EVM network must be deployed in the Everscale blockchain. The deploy value of that contract must be paid by the user either in EVER or the origin EVM network native coin. For example, BSC requires BNB, Polygon requires Matic, and so on. If the user chooses to pay...

# Operational Differences Between Alien Tokens and Native Tokens in Everscale

Whether in `EVM -> EVER` or `EVER -> EVM` directions, when we are transferring an [alien token](#alien-tokens) , it will be frozen/locked in MultiVault or released in the sender network. This is because the bridge does not have access to minting or burning any amount of that token. However, in the opposite situation where the bridge has access to its native tokens like `BRIDGE`, `EVER`, `WEVER`, it will mint and burn the tokens alternately to freeze and release in the previous example.

### [EVM-to-EVER ⏎](./EVM-to-EVER.md)

# <center> <span style="color:green"> EVER </span> to <span style="color:red"> EVM </span> Concepts</center>

### [EVER-to-EVM ⏎](./EVER-to-EVM.md)
