pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract ManufacturerRole {

    using Roles for Roles.Role;

    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    Roles.Role private manufacturers;

    constructor() public {
        //    _addManufacturer(msg.sender);
    }

    modifier onlyManufacturer() {
        require(manufacturers.has(msg.sender), "This account has no Manufacturer Role");
        _;
    }

    function getManufacturerId(string memory name) public view returns (address) {
        return manufacturers.nameToAccountAndPasswordMapping[name].id;
    }

    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    function isManufacturerViaName(string memory userName) public view returns (bool) {
        return manufacturers.nameToAccountAndPasswordMapping[userName].isUserVerified == true;
    }

    function addManufacturer(address account, string memory name, string memory password) public {
        _addManufacturer(account, name, password);
    }


    function loginManufacturer(string memory userName, string memory password) public view returns (address){
        return manufacturers.login(userName, password);
    }

    function renounceManufacturer() public {
        _removeManufacturer(msg.sender);
    }

    function _addManufacturer(address account, string memory name, string memory password) internal {
        manufacturers.add(account, name, password);
        emit ManufacturerAdded(account);
    }

    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account);
    }
}