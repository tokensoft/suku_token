pragma solidity >=0.4.25 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./Administratable.sol";

/**
Keeps track of whitelists and can check if sender and reciever are both in the same whitelist.
Only administrators can update the whitelists.
Any address can only be a member of one whitelist at a time.
 */
contract Whitelistable is Administratable {
    // Zero is reserved for indicating it is not on a whitelist
    uint8 constant NO_WHITELIST = 0;

    // The mapping to keep track of which whitelist any address belongs to.
    // 0 is reserved for no whitelsit.
    mapping (address => uint8) public addressWhitelists;

    // Events to allow tracking add/remove.
    event AddressAddedToWhitelist(address indexed addedAddress, uint8 indexed whitelist);
    event AddressRemovedFromWhitelist(address indexed removedAddress, uint8 indexed whitelist);

    /**
    Sets an address's white list ID.  Only administrators should be allowed to update this.
    If an address is on an existing whitelist, it will just get updated.
     */
    function addToWhitelist(address addressToAdd, uint8 whitelist) public onlyAdministrator {
        // Save off the previous white list
        uint8 previousWhitelist = addressWhitelists[addressToAdd];

        // If the previous whitelist existed then we want to indicate it has been removed
        if(previousWhitelist != NO_WHITELIST) {
            // Emit the event for tracking
            emit AddressRemovedFromWhitelist(addressToAdd, previousWhitelist);
        }

        // Set the address's white list ID
        addressWhitelists[addressToAdd] = whitelist;

        // Emit the event for tracking
        emit AddressAddedToWhitelist(addressToAdd, whitelist);
    }

    /**
    Clears out an address's white list ID.  Only administrators should be allowed to update this.
     */
    function removeFromWhitelist(address addressToRemove) public onlyAdministrator {
        // Save off the previous white list
        uint8 previousWhitelist = addressWhitelists[addressToRemove];

        // Zero out the previous white list
        addressWhitelists[addressToRemove] = NO_WHITELIST;

        // Emit the event for tracking
        emit AddressRemovedFromWhitelist(addressToRemove, previousWhitelist);
    }

    /**
    Determine if the a sender and receiver are both on the same whitelist.
     */
    function checkSameWhitelist(address sender, address receiver) public view returns (bool) {
        // First get each address white list
        uint8 senderWhiteList = addressWhitelists[sender];
        uint8 receiverWhiteList = addressWhitelists[receiver];

        // If either address is not on a white list then the check should fail
        if(senderWhiteList == NO_WHITELIST || receiverWhiteList == NO_WHITELIST){
            return false;
        }

        // Determine if the whitelists match
        return senderWhiteList == receiverWhiteList;
    }
}