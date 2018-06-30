//ERC20 Token
pragma solidity ^0.4.15;

import './BurnableToken.sol';
import './Ownable.sol';

contract USHToken is BurnableToken {

    string public constant name = "USH Token";
    string public constant symbol = "USH";
    uint public constant decimals = 18;
    uint256 public constant initialSupply =  698396562013061000000000+10**18;

    // Constructor
    constructor() public {
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply; // Send all tokens to owner
    }
}
