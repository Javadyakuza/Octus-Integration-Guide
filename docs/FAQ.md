## How to Set `expected_evers`?

Expected evers play a crucial role when transferring a token from an EVM network to Everscale. The user can configure this parameter to determine the behavior of the transaction.

If the user sets `expected_evers` to match the event's initial balance and attaches sufficient EVM native coins to the transaction, the event will be automatically deployed by the credit backend. In such cases, the user simply needs to wait for the deployment process to complete.

On the other hand, if the user sets `expected_evers` to a value lower than the event's initial balance or zero, or fails to attach enough EVM native coins to the transaction, the event will not be deployed automatically. Instead, it will require manual deployment.

Credit backends possess wallets across all networks and ensure balance equality. Consequently, if payment is made with the appropriate amount of attached EVM native coins (matching the `eventInitialBalance`), the credit backend will proceed with deploying the event contract.
