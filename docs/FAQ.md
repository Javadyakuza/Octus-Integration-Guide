## how to set expected_evers ?

In order to a transfer get confirmed in the Everscale bridge, an event contract containing the data of the transfer event on sender network must be deployed in the Everscale
network, which can be done in two ways

- 1 - users can deploy the event contract themselves in case of paying with ever directly and have to attach `eventInitialBalance` to the event deployment tx.
- 2 - Credit backends have wallets at all networks and equalize balances. Therefore, if payment is made with an attached EVM native coin of the required size (`eventInitialBalance`) for the transaction, the credit backend will deploy the event contract.

This parameter is needed when we are using `deposit` funnction on Multivault Contract.
