pragma solidity >=0.4.25 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
This contract allows a restrictions to be enabled or disabled.  Only the owner of the contract
can turn off or on the restrictions.  All restrictions start off in an enabled state.
 */
contract Restrictable is Ownable {
    // State variable to track whether restrictions are enabled.  Defaults to true.
    bool private _restrictionsEnabled = true;

    // Event emitted when enabled flag is updated
    event RestrictionEnabledUpdated(bool indexed enabled, address indexed owner);

    /**
    View function to determine if restrictions are enabled
     */
    function isRestrictionEnabled() public view returns (bool) {
        return _restrictionsEnabled;
    }

    /**
    Function to update the enabled flag on restrictions.  Only the owner should be able to call.
     */
    function setRestrictionEnabled(bool enabled) public onlyOwner {
        // Set the flag
        _restrictionsEnabled = enabled;

        // Trigger the event
        emit RestrictionEnabledUpdated(enabled, msg.sender);
    }
}