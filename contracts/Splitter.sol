pragma solidity ^0.4.17;

contract Splitter {

    address owner;

    mapping(address=>uint) public balances;
    event LogEtherAdded(address  from, address  to, uint value);
    event LogEtherWithdrawed(address  receiver, uint value);

    function Splitter() public {
        owner = msg.sender;
    }

    function sendEther(address bob, address carol) public payable {

        require(carol != 0);
        require(bob != 0);
        uint value = msg.value/2;
        balances[bob] += value;
        LogEtherAdded(msg.sender, bob, value);
        balances[carol] += (msg.value - value);
        LogEtherAdded(msg.sender, carol, msg.value - value);
    }

    function withdrawAll() public {
        withdraw(balances[msg.sender]);
    }

    function withdraw(uint amount) public {
        require(amount!=0);
        require(amount <= balances[msg.sender]);
        balances[msg.sender] -= amount;
        LogEtherWithdrawed(msg.sender, amount);
        msg.sender.transfer(amount);
    }
}
