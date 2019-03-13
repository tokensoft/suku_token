pragma solidity >=0.4.25 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
This contract allows an owner of the contract to revoke tokens from any address back into
their own account.  This is for edge cases related to security tokens where possibly something
went out of compliance or other error scenarios.  The owner should be able to give
up this ability permanently if they no longer want this functionality.
 */
contract Revocable is Ownable, ERC20 {
    // State variable to track whether revocations are enabled.  Defaults to true.
    bool private _revocationsEnabled = true;

    // Event emitted when revocation flag is updated
    event RevocationDisabled(address indexed owner);

    // Event when a revocation is executed
    event RevocationExecuted(address indexed account, uint256 value);

    /**
    Revoke tokens from an account back into the owners account.
    This should only be allowed if revocations are enabled.
    This should only be allowed by the owner of the contract.    
     */
    function revokeTokens(address account, uint256 value) public onlyOwner {

        // Verify revocations are enabled
        require(_revocationsEnabled, "Revocations are not enabled");

        // Transfer the tokens from the specified account into the owners account
        _transfer(account, msg.sender, value);

        // Emit the event for the revocation
        emit RevocationExecuted(account, value);
    }

    /**
    View function to determine if restrictions are enabled
     */
    function isRevocationEnabled() public view returns (bool) {
        return _revocationsEnabled;
    }

    /**
    Function to remove ability to perform future revocations.
    This is PERMANENT and cannot be undone.
    This should only be allowed by the owner of the contract.
     */
    function disableRevocations() public onlyOwner {
        // Set the flag
        _revocationsEnabled = false;

        // Trigger the event
        emit RevocationDisabled(msg.sender);
    }
}