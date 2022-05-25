pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract VendorRole {

    using Roles for Roles.Role;

    event VendorAdded(address indexed account);
    event VendorRemoved(address indexed account);

    Roles.Role private vendors;

    constructor() public {
        //    _addVendor(msg.sender);
    }

    modifier onlyVendor() {
        require(vendors.has(msg.sender), "This account has no Vendor Role");
        _;
    }

    function getVendorId(string memory name) public view returns (address) {
        return vendors.nameToAccountAndPasswordMapping[name].id;
    }

    function isVendor(address account) public view returns (bool) {
        return vendors.has(account);
    }

    function isVendorViaName(string memory userName) public view returns (bool) {
        return vendors.nameToAccountAndPasswordMapping[userName].isUserVerified == true;
    }

    function addVendor(address account, string memory name, string memory password) public {
        _addVendor(account, name, password);
    }

    function renounceVendor() public {
        _removeVendor(msg.sender);
    }

    function _addVendor(address account, string memory name, string memory password) internal {
        vendors.add(account, name, password);
        emit VendorAdded(account);
    }

    function loginVendor(string memory userName, string memory password) public view returns (address){
        return vendors.login(userName, password);
    }

    function _removeVendor(address account) internal {
        vendors.remove(account);
        emit VendorRemoved(account);
    }
}