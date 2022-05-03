pragma solidity >=0.4.22 <0.9.0;

contract ProductTracking {
    // Model a Product
    struct Product {
        uint id;
        string name;
        string currentStatus;
    }

    event votedEvent (
        uint indexed _productId
    );

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Read/write products
    mapping(uint => Product) public products;
    // Store Products Count
    uint public productsCount;

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
    // require that they haven't voted before
        // TODO: recheck how to handle this
        //require(!voters[msg.sender]);

        // require a valid product
        require(_productId > 0 && _productId <= productsCount);

        // record that product has been updated
        voters[msg.sender] = true;

        // update product status
        if(compareStrings(products[_productId].currentStatus, "IN-WAREHOUSE")) {
            products[_productId].currentStatus = 'IN-TRANSIT';
        }else if(compareStrings(products[_productId].currentStatus, "IN-TRANSIT")) {
            products[_productId].currentStatus = 'DISPATCHED';
        }

        // trigger update event
        emit votedEvent(_productId);
    }
    
    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}