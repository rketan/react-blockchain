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
    // Model a Product
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

    // Track the journey
    mapping(uint256 => string[]) productsHistory;

    // Read/write products
    mapping(uint256 => Product) public products;

    // Store Products Count
    uint256 public productsCount;

    // Define enum 'State' with the following values:
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

    // Define a modifer that verifies the Caller
    modifier verifyCaller(address payable _address) {
        require(
            msg.sender == _address,
            "This account is not the owner of this item"
        ); //NEW CHANGE. address is now address payable, and msg.sender is casted as payable
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Manufactured
    modifier manufactured(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Manufactured,
            "The Item is not in Manufactured state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is OrderPlaced
    modifier orderPlaced(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.OrderPlaced,
            "The Item is not in OrderPlaced state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Shipped
    modifier shipped(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Shipped,
            "The Item is not in Shipped state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is DistRecieved
    modifier distRecieved(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.DistRecieved,
            "The Item is not in DistRecieved state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is InTransit
    modifier inTransit(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.InTransit,
            "The Item is not in InTransit state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is VendorRecieved
    modifier vendorRecieved(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.VendorRecieved,
            "The Item is not in VendorRecieved state!"
        );
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Purchased
    modifier purchased(uint256 _upc) {
        require(
            products[_upc].currentStatus == State.Purchased,
            "The Item is not in Purchased state!"
        );
        _;
    }

    // Define a function 'manufactureProduct' that allows a manufacturer to mark an item 'Manufactured'
    function manufactureProduct(
        uint256 _upc,
        string memory name,
        uint256 _sku,
        string memory desc,
        address payable _originManufacturerID
    ) public onlyManufacturer {
        // Add the new item as part of Harvest
        Product memory newItem;
        newItem.ownerID = _originManufacturerID;
        newItem.manufacturerID = _originManufacturerID; //NEW ADDITION
        newItem.productID = _upc;
        newItem.name = name;
        newItem.sku = _sku;
        newItem.desc = desc;

        productsCount = productsCount + 1;

        // Setting state
        newItem.currentStatus = State.Manufactured; //NEW CHANGE. Used to be State.Shipped

        // Adding new Item to map
        products[_upc] = newItem;

        // Emit the appropriate event
        emit Manufactured(_upc);
    }

    // Define a function 'placeOrder' that allows the manufacturer to mark an item 'OrderPlaced'
    function placeOrder(uint256 _upc)
        public
        onlyManufacturer
        manufactured(_upc)
        verifyCaller(products[_upc].manufacturerID)
    {
        //Retrieve product
        Product storage existingItem = products[_upc];
        //Update state
        existingItem.currentStatus = State.OrderPlaced;
        // Emit the appropriate event
        emit OrderPlaced(_upc);
    }

    // Define a function 'shipToDistributor' that allows the manufacturer to mark an item 'Shipped'
    function shipToDistributor(uint256 _upc, address payable distID)
        public
        onlyManufacturer
        orderPlaced(_upc)
        verifyCaller(products[_upc].manufacturerID)
    {
        //Retrieve product
        Product storage existingItem = products[_upc];
        //Update state
        existingItem.currentStatus = State.Shipped;

        existingItem.distributorID = distID;
        // Emit the appropriate event
        emit Shipped(_upc);
    }

    // Define a function 'recieveAsDistributor' that allows a disributor to mark an item 'DistRecieved'
    function recieveAsDistributor(uint256 _upc)
        public
        onlyDistributor
        shipped(_upc)
    {
        //Retrieve product and update new owner
        Product storage existingItem = products[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.distributorID = msg.sender;
        //Update state
        existingItem.currentStatus = State.DistRecieved;
        // emit the appropriate event
        emit DistRecieved(_upc);
    }

    // Define a function 'shipToVendor' that allows the distributor to mark an item 'InTransit'
    function shipToVendor(uint256 _upc)
        public
        onlyDistributor
        distRecieved(_upc)
        verifyCaller(products[_upc].distributorID)
    {
        //Retrieve product
        Product storage existingItem = products[_upc];
        //Update state
        existingItem.currentStatus = State.InTransit;
        // Emit the appropriate event
        emit InTransit(_upc);
    }

    // Define a function 'recieveAsVendor' that allows a disributor to mark an item 'VendorRecieved'
    function recieveAsVendor(uint256 _upc) public onlyVendor inTransit(_upc) {
        //Retrieve product and update new owner
        Product storage existingItem = products[_upc];
        existingItem.ownerID = msg.sender;
        existingItem.vendorID = msg.sender;
        //Update state
        existingItem.currentStatus = State.VendorRecieved;
        // emit the appropriate event
        emit VendorRecieved(_upc);
    }

    // Define a function 'shipToVendor' that allows the distributor to mark an item 'Purchased'
    function sellProduct(uint256 _upc)
        public
        onlyVendor
        vendorRecieved(_upc)
        verifyCaller(products[_upc].vendorID)
    {
        //Retrieve product
        Product storage existingItem = products[_upc];
        //Update state
        existingItem.currentStatus = State.Purchased;
        // Emit the appropriate event
        emit Purchased(_upc);
    }
    //IMPORTANT, can add 'address payable customerName' to parameters and then set owner id to that of customerName. I didn't do it, because I didn't find it important for the item's history.
    //But we can easily add it in and make use of that. It is up to everyone to agree on
    //Just know that without that, the owner role is practically useless

    // function compareStrings (string memory a, string memory b) public view returns (bool) {
    //     return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }
}
