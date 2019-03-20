# SUKU Token
ERC20 Token with 1404 Restrictions

## Use Case
The SUKU token is an ERC20 compatible token with transfer restrictions added that follow the ERC1404 standard.  1404 Restrictions will use whitelists to segregate groups of accounts so they are only allowed to transfer between each other.  At some point in the future, the transfer restrictions will need to be lifted and let any transfers to succeed to/from any accounts.

## Token
All token features will be determined at deploy time, locking them in place.

 - Name
 - Symbol
 - Total Supply
 - Decimals

On deployment, all tokens will be transferred to the account that deployed the token.

## Users
There will be a few different actors in the eco-system.

 - Issuer: This is SUKU who will have ultimate control of any changes in behavior.
 - Administrator: The Issuer will have the ability to delegate admin permissions to other accounts.
 - Owner: The Owners are the users who would like to hold and transfer tokens.

## Administrators

The Issuer account can add and remove other account addresses to a list of Administrators.  Only the Issuer should have the ability to do this.

Once and account has been added to the Administrators list, the administrator can add/remove accounts to/from any of the whitelists.  Only Administrators should have the ability to do this.

## White Lists
Before tokens can be transferred to a new address, the destination address must be added to the same white list that the sender belongs to.  If this is not done in advance, the transfer functionality will fail and the transaction will revert.

While it is enabled, the only exception to the whitelist logic is the owner account.  They will have the ability to transfer tokens to any address.

Notes
 - Any address can only be a member of one white list at a time.
 - Any number of whitelists can exist allowing groups of addresses to transfer among that list.
 - No transfers will be allowed across whitelists.

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