# SUKU Token
ERC20 Token with 1404 Restrictions

## Use Case
The SUKU token is an ERC20 compatible token with transfer restrictions added that follow the ERC1404 standard.  1404 Restrictions will use whitelists to segregate groups of accounts so they are only allowed to transfer to designated destination addresses.  At some point in the future, the transfer restrictions will need to be lifted and let any transfers to succeed to/from any accounts.

## Token
All token features will be determined at deploy time, locking them in place.

 - Name
 - Symbol
 - Total Supply
 - Decimals

On deployment, all tokens will be transferred to the account that deployed the token.

There will be **NO** functionality for minting/burning tokens after the initial creation of the contract.

## Users
There will be a few different actors in the eco-system.

 - Issuer: This is SUKU who will have ultimate control of any changes in behavior.
 - Administrator: The Issuer will have the ability to delegate admin permissions to other accounts.
 - Owner: The Owners are the users who would like to hold and transfer tokens.

## Administrators

The Issuer account can add and remove other account addresses to a list of Administrators.  Only the Issuer should have the ability to do this.

Once and account has been added to the Administrators list, the administrator can add/remove accounts to/from any of the whitelists.  Only Administrators should have the ability to do this.

## White Lists
Before tokens can be transferred to a new address, the destination address must validated that the source is allowed to send to that address.  If this is not done in advance, the transfer functionality will fail and the transaction will revert.

While it is enabled, the only exception to the whitelist logic is the owner account.  They will have the ability to transfer tokens to any address.

Any address can only be a member of one white list at any point in time.  If an administrator adds any address to a new whitelist, it will no longer be a member of the previous whitelist it was on.  Adding an address to a whitelist of ID 0 will remove it from all whitelists, as whitelist ID 0 is invalid.

Any whitelist can be configured to have multiple Outbound Whitelists.  When a transfer is initiated, the restriction logic will first determine the sourece/destination address's whitelists.  Then it will determine if the source whitelist is configured to allow transactions to the destination whitelist.  The transfer will be restricted if the source whitelist is not configured to send to the destination whitelist.

Example
- Whitelist A is only allowed to send to iteself.
- Whitelist B is allowed to send to itself and whitelist A.
- Whitelist C is allowed to send to itself and whitelists A and B.
- Whitelist D is not allowed to transfer to any whitelist, including itself.

A total of 255 whitelists can be created, each with the ability to restrict transfers to all other whitelists.

By default, any whitelist will be allowed to transfer between source and destination addresses within the same whitelist.  Only the Issuer will have the ability modify a whitelist beyond the default configuration to add or remove outbound whitelists.

## Restrictions

If a transfer is restricted, the code will follow the ERC1404 spec and revert the transaction.  Any wallets interacting with an ERC1404 token contract should first query the contract to determine if the transfer is allowed, and if not, show the appropriate error to the user (including the reason code/text from the contract).

## Lifting Restrictions

At some point in the future, the Issuer can turn off the transfer restriction functionality.  Only the Issuer should have the ability to do this.  This is a one-time and permanent change that cannot be undone.  Once resitrctions are disabled, all transfers to and from any address are allowed.

# Testing
You should be able to install dependencies and then run tests:
```
$ yarn
$ yarn test
```

For unit test code coverage metrics:
```
$ yarn coverage
```