pragma solidity >=0.4.22 <0.9.0;

import "./accessControl/DistributorRole.sol";
import "./accessControl/ManufacturerRole.sol";
import "./accessControl/VendorRole.sol";
import "./core/Ownable.sol";

contract ProductTracking is
    Ownable,
    ManufacturerRole,
    DistributorRole,
    VendorRole
{
    struct Product {
        uint256 sku;
        uint256 productID;
        string name;
        string desc;
        address payable ownerID;
        State currentStatus;
        address payable distributorID;
        address payable manufacturerID;
        address payable vendorID;
    }

    //TODO: Track the journey
    mapping(uint256 => string[]) productsHistory;

    mapping(uint256 => Product) public products;

    uint256 public productsCount;

    enum State {
        Manufactured, // 0
        OrderPlaced, // 1
        Shipped, // 2
        DistRecieved, // 3
        InTransit, // 4
        VendorRecieved, // 5
        Purchased // 6
    }

    State constant defaultState = State.Manufactured;

    // Define 7 events with the same 8 state values and accept 'upc' as input argument
    event Manufactured(uint256 upc);
    event OrderPlaced(uint256 upc);
    event Shipped(uint256 upc);
    event DistRecieved(uint256 upc);
    event InTransit(uint256 upc);
    event VendorRecieved(uint256 upc);
    event Purchased(uint256 upc);

    constructor() public {
        //TODO
    }

    //upon retrieval, check 2nd and 3rd to see if same as previous, if so, hasn't gone that far
    function obtainHistory(uint256 _upc) public view returns (address payable[3] memory) {
        Product storage existingItem = products[_upc];
        if (existingItem.ownerID == existingItem.manufacturerID)
            return [existingItem.manufacturerID, existingItem.manufacturerID, existingItem.manufacturerID];
        else if (existingItem.ownerID == existingItem.distributorID)
            return [existingItem.manufacturerID, existingItem.distributorID, existingItem.distributorID];
        else
            return [existingItem.manufacturerID, existingItem.distributorID, existingItem.vendorID];
    }

    function obtainHistory2(uint256 _upc) public view returns (address[4] memory) {
        Product storage existingItem = products[_upc];
        if (existingItem.ownerID == address(0))
            return [address(0), address(0), address(0), address(0)];
        else if (existingItem.ownerID == existingItem.manufacturerID)
            return [existingItem.manufacturerID, address(0), address(0), address(0)];
        else if (existingItem.ownerID == existingItem.distributorID)
            return [existingItem.manufacturerID, existingItem.distributorID, address(0), address(0)];
        else
            return [existingItem.manufacturerID, existingItem.distributorID, existingItem.vendorID, address(0)];
    }


    function getRole(address payable _address) public view returns (string memory) {
        if (super.isManufacturer(_address)) {
            return "manufacturer";
        } else if (super.isVendor(_address)) {
            return "vendor";
        } else if (super.isDistributor(_address)) {
            return "distributor";
        }
        return "";

    }

    modifier verifyCaller(address payable _address) {
        require(
            msg.sender == _address,
            "This account is not the owner of this item"
        );
        _;
    }

    modifier manufactured(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Manufactured,
            "The Item is not in Manufactured state!"
        );
        _;
    }

    modifier orderPlaced(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.OrderPlaced,
            "The Item is not in OrderPlaced state!"
        );
        _;
    }

    modifier shipped(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Shipped,
            "The Item is not in Shipped state!"
        );
        _;
    }

    modifier distRecieved(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.DistRecieved,
            "The Item is not in DistRecieved state!"
        );
        _;
    }

    modifier inTransit(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.InTransit,
            "The Item is not in InTransit state!"
        );
        _;
    }

    modifier vendorRecieved(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.VendorRecieved,
            "The Item is not in VendorRecieved state!"
        );
        _;
    }

    modifier purchased(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Purchased,
            "The Item is not in Purchased state!"
        );
        _;
    }

    function manufactureProduct(
        uint256 _upc,
        string memory name,
        uint256 _sku,
        string memory desc,
        address payable _originManufacturerID
    ) public onlyManufacturer {
        Product memory newItem;
        newItem.ownerID = _originManufacturerID;
        newItem.manufacturerID = _originManufacturerID;
        newItem.productID = _upc;
        newItem.name = name;
        newItem.sku = _sku;
        newItem.desc = desc;

        productsCount = productsCount + 1;

        newItem.currentStatus = defaultState;
        products[_upc] = newItem;

        emit Manufactured(_upc);
    }

    function placeOrder(uint256 _upc)
        public
        onlyManufacturer
        manufactured(_upc)
        verifyCaller(products[_upc].manufacturerID)
    {
        Product storage existingItem = products[_upc];
        existingItem.currentStatus = State.OrderPlaced;
        emit OrderPlaced(_upc);
    }

    function shipToDistributor(uint256 _upc, address payable distID)
        public
        onlyManufacturer
        orderPlaced(_upc)
        verifyCaller(products[_upc].manufacturerID)
    {
        Product storage existingItem = products[_upc];
        existingItem.currentStatus = State.Shipped;

        existingItem.distributorID = distID;
        emit Shipped(_upc);
    }

    function recieveAsDistributor(uint256 _upc)
        public
        onlyDistributor
        shipped(_upc)
    {
        Product storage existingItem = products[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.currentStatus = State.DistRecieved;
        emit DistRecieved(_upc);
    }

    function shipToVendor(uint256 _upc, address payable vendorId)
    public onlyDistributor
    distRecieved(_upc)
    verifyCaller(products[_upc].distributorID)
    {
        Product storage existingItem = products[_upc];
        existingItem.currentStatus = State.InTransit;
        existingItem.vendorID = vendorId;
        emit InTransit(_upc);
    }

    function recieveAsVendor(uint256 _upc) public onlyVendor inTransit(_upc) {
        Product storage existingItem = products[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.currentStatus = State.VendorRecieved;
        emit VendorRecieved(_upc);
    }

    function sellProduct(uint256 _upc)
        public
        onlyVendor
        vendorRecieved(_upc)
        verifyCaller(products[_upc].vendorID)
    {
        Product storage existingItem = products[_upc];
        existingItem.currentStatus = State.Purchased;
        emit Purchased(_upc);
    }
    //IMPORTANT, can add 'address payable customerName' to parameters and then set owner id to that of customerName. I didn't do it, because I didn't find it important for the item's history.
    //But we can easily add it in and make use of that. It is up to everyone to agree on
    //Just know that without that, the owner role is practically useless

    // function compareStrings (string memory a, string memory b) public view returns (bool) {
    //     return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }
}
