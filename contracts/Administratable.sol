pragma solidity >=0.4.25 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
This contract allows a list of administrators to be tracked.  This list can then be enforced
on functions with administrative permissions.  Only the owner of the contract should be allowed
to modify the administrator list.
 */
contract Administratable is Ownable {

    // The mapping to track administrator accounts - true is reserved for admin addresses.
    mapping (address => bool) public administrators;

    // Events to allow tracking add/remove.
    event AdminAdded(address indexed addedAdmin);
    event AdminRemoved(address indexed removedAdmin);

    /**
    Function modifier to enforce administrative permissions.
     */
    modifier onlyAdministrator() {
        require(isAdministrator(msg.sender), "Calling account is not an administrator.");
        _;
    }

    /**
    Determine if the message sender is in the administrators list.
     */
    function isAdministrator(address addressToTest) public view returns (bool) {
        return administrators[addressToTest];
    }

    /**
    Add an admin to the list.  This should only be callable by the owner of the contract.
     */
    function addAdmin(address adminToAdd) public onlyOwner {
        // Set the address mapping to true to indicate it is an administrator account.
        administrators[adminToAdd] = true;

        // Emit the event for any watchers.
        emit AdminAdded(adminToAdd);
    }

    /**
    Remove an admin from the list.  This should only be callable by the owner of the contract.
     */
    function removeAdmin(address adminToRemove) public onlyOwner {
        // Set the address mapping to false to indicate it is NOT an administrator account.  
        administrators[adminToRemove] = false;

        // Emit the event for any watchers.
        emit AdminRemoved(adminToRemove);
    }


}