// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BuilderPassportRegistry {
    mapping(address => bool) public hasPassport;
    address public admin;

    constructor(){
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function setPassport(address user, bool status) public onlyAdmin {
        hasPassport[user] = status;
    }

    function checkPassport(address user) public view returns (bool) {
        return hasPassport[user];
    }

    function transferAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
    }
}
