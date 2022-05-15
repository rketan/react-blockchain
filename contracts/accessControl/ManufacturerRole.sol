pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole is Roles {

    constructor() public {
        super.setRole("manufacturer");
//        _addManufacturer(msg.sender);
    }
    // Define 2 events, one for Adding, and other for Removing
    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyManufacturer() {
        require(super.has(msg.sender), "This account has no Manufacturer Role");
        _;
    }

    // Define a function 'isManufacturer' to check this role
    function isManufacturer(address account) public view returns (bool) {
        return super.has(account);
    }

    // Define a function 'addManufacturer' that adds this role
    function addManufacturer(address account) public onlyManufacturer {
        _addManufacturer(account);
    }

    // Define a function 'renounceManufacturer' to renounce this role
    function renounceManufacturer() public {
        _removeManufacturer(msg.sender);
    }

    // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
    function _addManufacturer(address account) internal {
        super.add(account);
        emit ManufacturerAdded(account);
    }

    // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
    function _removeManufacturer(address account) internal {
        super.remove(account);
        emit ManufacturerRemoved(account);
    }
}