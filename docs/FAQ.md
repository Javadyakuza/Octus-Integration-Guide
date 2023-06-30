## how to set expected_evers ?

Expected evers are set and used when the user wants to transfer a token from and EVM network to Everscale.\
if user set's this parameter to a Event initial balance and attaches enough evm native coin to tx, the event will be deployed by the credit backend's automatically and user doesnt have to do any thing but waiting.

On other hand if user sets the expected evers to a value less than event initial balance or zero, or attaches not enough evm native coin to the tx, the event will not be deployed and requires manual deploying.

Credit backends have wallets at all networks and equalize balances. Therefore, if payment is made with an attached EVM native coin of the required size (`eventInitialBalance`) for the transaction, the credit backend will deploy the event contract.

This parameter is needed when we are using `deposit` funnction on Multivault Contract.
