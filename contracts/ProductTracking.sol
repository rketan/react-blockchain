pragma solidity >=0.4.22 <0.9.0;

import './accessControl/DistributorRole.sol';
import './accessControl/ManufacturerRole.sol';
import './accessControl/VendorRole.sol';
import './core/Ownable.sol';

contract ProductTracking is Ownable, ManufacturerRole, DistributorRole, VendorRole {
    // Model a Product
    struct Product {
        uint id;
        string name;
        string currentStatus;
    }

    // Track the journey
    mapping (uint => string[]) productsHistory;
    // Read/write products
    mapping(uint => Product) public products;
    // Store Products Count
    uint public productsCount;

    // Define enum 'State' with the following values:
    enum State
    {
        Manufactured,  // 0
        OrderPlaced,  // 1
        Shipped,     // 2
        DistRecieved,    // 3
        InTransit,       // 4
        VendorRecieved,    // 5
        Purchased   // 6
    }

    State constant defaultState = State.Manufactured;

    constructor() public {
        addProduct("Product 1");
        addProduct("Product 2");
        addProduct("Product 3");
        addProduct("Product 4");
        addProduct("Product 5");
        addProduct("Product 6");
    }

    function addProduct (string memory _name) public {
        productsCount ++;
        products[productsCount] = Product(productsCount, _name, "IN-WAREHOUSE");
    }

    function vote (uint _productId) public {
        // require a valid product
        require(_productId > 0 && _productId <= productsCount);

        // update product status
        if(compareStrings(products[_productId].currentStatus, "IN-WAREHOUSE")) {
            products[_productId].currentStatus = 'IN-TRANSIT';
        }else if(compareStrings(products[_productId].currentStatus, "IN-TRANSIT")) {
            products[_productId].currentStatus = 'DISPATCHED';
        }
    }
    
    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}