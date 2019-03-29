pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
This contract allows a restrictions to be enabled or disabled.  Only the owner of the contract
can turn off or on the restrictions.  All restrictions start off in an enabled state.
 */
contract Restrictable is Ownable {
    // State variable to track whether restrictions are enabled.  Defaults to true.
    bool private _restrictionsEnabled = true;

    // Event emitted when flag is disabled
    event RestrictionsDisabled(address indexed owner);

    /**
    View function to determine if restrictions are enabled
     */
    function isRestrictionEnabled() public view returns (bool) {
        return _restrictionsEnabled;
    }

    /**
    Function to update the enabled flag on restrictions to disabled.  Only the owner should be able to call.
    This is a permanent change that cannot be undone
     */
    function disableRestrictions() public onlyOwner {
        require(_restrictionsEnabled, "Restrictions are already disabled.");
        
        // Set the flag
        _restrictionsEnabled = false;

        // Trigger the event
        emit RestrictionsDisabled(msg.sender);
    }
}