var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProductTracking = artifacts.require("./ProductTracking.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProductTracking);
};
