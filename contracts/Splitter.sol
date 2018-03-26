pragma solidity ^0.4.17;

contract Splitter {

    mapping(address => uint256) public balances;

    event FundsWithdrawed(address, uint);
    event FundsAdded(address, uint);

    function Splitter() public {
        owner = msg.sender;
    }

    function send(address first, address second) public payable {
        require(first != 0);
        require(second != 0);

        uint value = msg.value / 2;
        balances[first] += value;
        LogEtherAdded(msg.sender, first, value);

        balances[second] += msg.value - value;
        LogEtherAdded(msg.sender, second, msg.value - value);
    }

    function withdrawing(uint quantity) public {
        require(quantity != 0);
        require(quantity <= balances[msg.sender]);

        balances[msg.sender] -= quantity;

        LogEtherWithdrawed(msg.sender, quantity);
        msg.sender.transfer(quantity);
    }

    function withdrawingAll() public {
        withdraw(balances[msg.sender]);
    }
}
