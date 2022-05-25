let ProductTracking = artifacts.require("./ProductTracking.sol");
var StringUtils = artifacts.require("./StringUtils.sol");
var Roles = artifacts.require("./Roles.sol");

module.exports = function(deployer) {
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, Roles);
  deployer.deploy(Roles);
  deployer.link(StringUtils, ProductTracking);
  deployer.deploy(ProductTracking);
};
