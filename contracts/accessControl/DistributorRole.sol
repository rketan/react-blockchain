pragma solidity >=0.4.22 <0.9.0;

import "./Roles.sol";

contract DistributorRole {

  using Roles for Roles.Role;

  event DistributorAdded(address indexed account);
  event DistributorRemoved(address indexed account);

  Roles.Role private distributors;

  constructor() public {
//    _addDistributor(msg.sender);
  }

  modifier onlyDistributor() {
      require(distributors.has(msg.sender), "This account has no Distributor Role");
    _;
  }

  function isDistributor(address account) public view returns (bool) {
       return distributors.has(account);
  }

  function isDistributorViaName(string memory userName) public view returns (bool) {
    return distributors.nameToAccountAndPasswordMapping[userName].isUserVerified == true;
  }

  function addDistributor(address account, string memory name, string memory password) public {
      _addDistributor(account, name, password);
  }

  function renounceDistributor() public {
    _removeDistributor(msg.sender);
  }

  function _addDistributor(address account, string memory name, string memory password) internal {
    distributors.add(account, name, password);
    emit DistributorAdded(account);
  }

  function loginDistributor(string memory userName, string memory password) public view returns (address){
    return distributors.login(userName, password);
  }
  function _removeDistributor(address account) internal {
    distributors.remove(account);
    emit DistributorRemoved(account);
  }
}