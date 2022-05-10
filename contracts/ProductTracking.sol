pragma solidity >=0.4.22 <0.9.0;

import './accessControl/DistributorRole.sol';
import './accessControl/ManufacturerRole.sol';
import './accessControl/VendorRole.sol';
import './core/Ownable.sol';

contract ProductTracking is Ownable, ManufacturerRole, DistributorRole, VendorRole {
    // Model a Product
    struct Product {
        uint productID;
        string name;
        address payable ownerID;
        State   currentStatus;
        address payable distributorID;
        address payable manufacturerID;
        address payable vendorID;
    }

    // Track the journey
    mapping (uint => string[]) productsHistory;

    // Read/write products
    mapping(uint => Product) public products;

    // Store Products Count
    uint public productsCount;

    // Define enum 'State' with the following values:
    enum State {
        Manufactured,  // 0
        OrderPlaced,  // 1
        Shipped,     // 2
        DistRecieved,    // 3
        InTransit,       // 4
        VendorRecieved,    // 5
        Purchased   // 6
    }

    State constant defaultState = State.Manufactured;

    // Define 7 events with the same 8 state values and accept 'upc' as input argument
    event Manufactured(uint upc);
    event OrderPlaced(uint upc);
    event Shipped(uint upc);
    event DistRecieved(uint upc);
    event InTransit(uint upc);
    event VendorRecieved(uint upc);
    event Purchased(uint upc);

    constructor() public {
        //TODO
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "This account is not the owner of this item");
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Manufactured
    modifier manufactured(uint _upc) {
        require(products[_upc].currentStatus == State.Manufactured, "The Item is not in Manufactured state!");
        _;
    }

    // Define a modifier that checks if an item.state of a upc is OrderPlaced
    modifier orderPlaced(uint _upc) {
        require(products[_upc].currentStatus == State.OrderPlaced, "The Item is not in OrderPlaced state!");
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Shipped
    modifier shipped(uint _upc) {
        require(products[_upc].currentStatus == State.Shipped, "The Item is not in Shipped state!");
        _;
    }

    // Define a function 'manufactureProduct' that allows a farmer to mark an item 'Manufactured'
    function manufactureProduct(
    uint _upc,
    string memory name,
    address payable _originManufacturerID) public

    onlyManufacturer
    {
        // Add the new item as part of Harvest
        Product memory newItem;
        newItem.ownerID = _originManufacturerID;
        newItem.productID = _upc;
        newItem.name = name;

        productsCount = productsCount + 1;

        // Setting state
        newItem.currentStatus = State.Shipped;

        // Adding new Item to map
        products[_upc] = newItem;

        // Emit the appropriate event
        emit Manufactured(_upc);
    }
    
    // function compareStrings (string memory a, string memory b) public view returns (bool) {
    //     return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }
}