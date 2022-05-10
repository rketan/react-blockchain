pragma solidity >=0.4.22 <0.9.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'VendorRole' to manage this role - add, remove, check
contract VendorRole {

  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event VendorAdded(address indexed account);
  event VendorRemoved(address indexed account);

  // Define a struct 'Vendors' by inheriting from 'Roles' library, struct Role
  Roles.Role private vendors;

  // In the constructor make the address that deploys this contract the 1st Vendor
  constructor() public {
    // The first Vendor will be the person deploying this contract
    _addVendor(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyVendor() {
      require(vendors.has(msg.sender), "This account has no Vendor Role");
    _;
  }

  // Define a function 'isVendor' to check this role
  function isVendor(address account) public view returns (bool) {
       return vendors.has(account);
  }

  // Define a function 'addVendor' that adds this role
  function addVendor(address account) public onlyVendor {
      _addVendor(account);
  }

  // Define a function 'renounceVendor' to renounce this role
  function renounceVendor() public {
    _removeVendor(msg.sender);
  }

  // Define an internal function '_addVendor' to add this role, called by 'addVendor'
  function _addVendor(address account) internal {
    vendors.add(account);
    emit VendorAdded(account);
  }

  // Define an internal function '_removeVendor' to remove this role, called by 'removeVendor'
  function _removeVendor(address account) internal {
    vendors.remove(account);
    emit VendorRemoved(account);
  }
}