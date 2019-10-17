pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./Whitelistable.sol";
import "./Restrictable.sol";
import "./ERC1404.sol";

contract SukuToken is ERC1404, ERC20, ERC20Detailed, Whitelistable, Restrictable {

    // Token Details
    string constant TOKEN_NAME = "SUKU";
    string constant TOKEN_SYMBOL = "SUKU";
    uint8 constant TOKEN_DECIMALS = 18;

    // Token supply - 1.5 Billion Tokens, with 18 decimal precision
    uint256 constant HUNDRED_MILLION = 100000000;
    uint256 constant TOKEN_SUPPLY = 15 * HUNDRED_MILLION * (10 ** uint256(TOKEN_DECIMALS));

    // ERC1404 Error codes and messages
    uint8 public constant SUCCESS_CODE = 0;
    uint8 public constant FAILURE_NON_WHITELIST = 1;
    string public constant SUCCESS_MESSAGE = "SUCCESS";
    string public constant FAILURE_NON_WHITELIST_MESSAGE = "The transfer was restricted due to white list configuration.";
    string public constant UNKNOWN_ERROR = "Unknown Error Code";


    /**
    Constructor for the token to set readable details and mint all tokens
    to the contract creator.
     */
    constructor(address owner) public 
        ERC20Detailed(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS)
    {		
        _transferOwnership(owner);
        _mint(owner, TOKEN_SUPPLY);
    }

    /**
    This function detects whether a transfer should be restricted and not allowed.
    If the function returns SUCCESS_CODE (0) then it should be allowed.
     */
    function detectTransferRestriction (address from, address to, uint256)
        public
        view
        returns (uint8)
    {               
        // If the restrictions have been disabled by the owner, then just return success
        // Logic defined in Restrictable parent class
        if(!isRestrictionEnabled()) {
            return SUCCESS_CODE;
        }

        // If the contract owner is transferring, then ignore reistrictions        
        if(from == owner()) {
            return SUCCESS_CODE;
        }

        // Restrictions are enabled, so verify the whitelist config allows the transfer.
        // Logic defined in Whitelistable parent class
        if(!checkWhitelistAllowed(from, to)) {
            return FAILURE_NON_WHITELIST;
        }

        // If no restrictions were triggered return success
        return SUCCESS_CODE;
    }
    
    /**
    This function allows a wallet or other client to get a human readable string to show
    a user if a transfer was restricted.  It should return enough information for the user
    to know why it failed.
     */
    function messageForTransferRestriction (uint8 restrictionCode)
        public
        view
        returns (string memory)
    {
        if (restrictionCode == SUCCESS_CODE) {
            return SUCCESS_MESSAGE;
        }

        if (restrictionCode == FAILURE_NON_WHITELIST) {
            return FAILURE_NON_WHITELIST_MESSAGE;
        }

        // An unknown error code was passed in.
        return UNKNOWN_ERROR;
    }

    /**
    Evaluates whether a transfer should be allowed or not.
     */
    modifier notRestricted (address from, address to, uint256 value) {        
        uint8 restrictionCode = detectTransferRestriction(from, to, value);
        require(restrictionCode == SUCCESS_CODE, messageForTransferRestriction(restrictionCode));
        _;
    }

    /**
    Overrides the parent class token transfer function to enforce restrictions.
     */
    function transfer (address to, uint256 value)
        public
        notRestricted(msg.sender, to, value)
        returns (bool success)
    {
        success = super.transfer(to, value);
    }

    /**
    Overrides the parent class token transferFrom function to enforce restrictions.
     */
    function transferFrom (address from, address to, uint256 value)
        public
        notRestricted(from, to, value)
        returns (bool success)
    {
        success = super.transferFrom(from, to, value);
    }
}
