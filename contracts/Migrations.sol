pragma solidity ^0.4.17;

contract Migrations {
    address public owner;

    uint public lastCompletedMigration;

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function Migrations() public {
        owner = msg.sender;
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(lastCompletedMigration);
    }

    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }
}
