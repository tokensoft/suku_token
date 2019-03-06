pragma solidity >=0.4.25 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "./Whitelistable.sol";

contract SukuToken is ERC20, ERC20Detailed, Whitelistable {

    // Token Details
    string constant TOKEN_NAME = "SUKU";
    string constant TOKEN_SYMBOL = "SUKU";
    uint8 constant TOKEN_DECIMALS = 18;

    // Token supply - 50 Billion Tokens, with 18 decimal precision
    uint256 constant BILLION = 1000000000;
    uint256 constant TOKEN_SUPPLY = 50 * BILLION * (10 ** uint256(TOKEN_DECIMALS));


    /**
    Constructor for the token to set readable details and mint all tokens
    to the contract creator.
     */
    constructor() public 
        ERC20Detailed(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS)
    {		
        _mint(msg.sender, TOKEN_SUPPLY);
    }
}
