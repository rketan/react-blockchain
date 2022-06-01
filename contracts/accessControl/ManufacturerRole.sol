pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ManufacturerRole' to manage this role - add, remove, check
contract ManufacturerRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event ManufacturerAdded(address indexed account);
  event ManufacturerRemoved(address indexed account);
  event DistributorRemembered(address indexed account);

  // Define a struct 'Manufacturers' by inheriting from 'Roles' library, struct Role
  Roles.Role private manufacturers;

  // In the constructor make the address that deploys this contract the 1st Manufacturer
  constructor() public {
    // The first Manufacturer will be the person deploying this contract
//    _addManufacturer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyManufacturer() {
      require(manufacturers.has(msg.sender), "This account has no Manufacturer Role");
    _;
  }

  // Define a function 'isManufacturer' to check this role
  function isManufacturer(address account) public view returns (bool) {
       return manufacturers.has(account);
  }

  function isManufacturerViaName(string memory userName) public view returns (bool) {
    return manufacturers.nameToAccountAndPasswordMapping[userName].isUserVerified == true;
  }

  // Define a function 'addManufacturer' that adds this role
  function addManufacturer(address account, string memory name, string memory password) public {
      _addManufacturer(account, name, password);
  }

  function addDistAddress(address name, address dist) public {
    _addDistAddress(name, dist);
  }

  function getDistAddresses(address name) public view returns (address[] memory) {
    return _getDistAddresses(name);
  }

  function loginManufacturer(string memory userName, string memory password) public view returns (address){
    return manufacturers.login(userName, password);
  }
  // Define a function 'renounceManufacturer' to renounce this role
  function renounceManufacturer() public {
    _removeManufacturer(msg.sender);
  }

  // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
  function _addManufacturer(address account, string memory name, string memory password) internal {
    manufacturers.add(account, name, password);
    emit ManufacturerAdded(account);
  }

  // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
  function _removeManufacturer(address account) internal {
    manufacturers.remove(account);
    emit ManufacturerRemoved(account);
  }

  function _addDistAddress(address name, address dist) internal {
    manufacturers.addNewAddress(name, dist);
    emit DistributorRemembered(name);
  }

  function _getDistAddresses(address name) internal view returns (address[] memory) {
    return manufacturers.getAddress(name);
  }
}