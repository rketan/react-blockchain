var ProductTracking = artifacts.require("./ProductTracking.sol");

module.exports = function(deployer) {
  deployer.deploy(ProductTracking);
};
