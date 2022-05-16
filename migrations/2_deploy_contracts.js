var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProductTracking = artifacts.require("./ProductTracking.sol");
var ManufacturerTracking = artifacts.require("./ManufacturerRole.sol")
var VendorTracking = artifacts.require("./VendorRole.sol")
var DistributorTracking = artifacts.require("./DistributorRole.sol")
module.exports = function (deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(ProductTracking);
    deployer.deploy(ManufacturerTracking);
    deployer.deploy(DistributorTracking);
    deployer.deploy(VendorTracking);

};
