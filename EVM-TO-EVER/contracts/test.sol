pragma solidity ^0.8.18;

contract test {
    uint public globalNumber;

    function getNumber() public view returns (uint) {
        return globalNumber;
    }

    function setNumber(uint _newNumber) public {
        globalNumber = _newNumber;
    }
}
