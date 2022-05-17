import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ProductTrackingContract from "./contracts/ProductTracking.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, products: [] };
    this.traverseProducts = this.traverseProducts.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = SimpleStorageContract.networks[networkId];
      const storageInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      deployedNetwork = ProductTrackingContract.networks[networkId];
      const productTrackingInstance = new web3.eth.Contract(
        ProductTrackingContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log("Account 0 address : ", accounts[0]);
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, storageContract: storageInstance, contract: productTrackingInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, storageContract, productTrackingContract } = this.state;

    // Stores a given value, 5 by default.
    await storageContract.methods.set(9).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await storageContract.methods.get().call();

    let productsCount = await this.state.contract.methods.productsCount().call();
    console.log("debug:::: ", productsCount);

    // get man list and check if this account is assigned the correct role
    const isMan = await this.state.contract.methods.isManufacturer(accounts[0]).call();
    console.log("Debug : isMan : ", isMan);

    if(!isMan) {
      // assign manufacturer role to this account
      const assignMan = await this.state.contract.methods.addManufacturer(accounts[0]).call();
    }

    this.fetchProducts(productsCount).then(function(localProducts) {
      console.log("debug fetch product callback func ::: ", localProducts);
      this.setState({storageValue: response, products: localProducts}, this.traverseProducts);
    }.bind(this));

  };

  addProduct = async () => {
    console.log('Add product api called!');

    let response = await this.state.contract.methods.manufactureProduct(1, "Air Jordans", this.state.accounts[0])
    .send({from: this.state.accounts[0]});

    response = await this.state.contract.methods.manufactureProduct(2, "Organic Honey", this.state.accounts[0])
    .send({from: this.state.accounts[0]});

    response = await this.state.contract.methods.manufactureProduct(3, "Matcha Tea", this.state.accounts[0])
    .send({from: this.state.accounts[0]});

    let productsCount = await this.state.contract.methods.productsCount().call();
    console.log("product count :::: ", productsCount);

    this.fetchProducts(productsCount).then(function(localProducts) {
      console.log("debug fetch product callback func ::: ", localProducts);
      this.setState({products: localProducts}, this.traverseProducts);
    }.bind(this));

    console.log("Add product call ended!");
  };

  traverseProducts() {
    this.state.products.map(item => {
      console.log("product : ", item);
    })
  }

  fetchProducts(productsCount) {
    let localProducts = [];
    
    const forLoop = async _ => {
      console.log("Start");
      
      for(let index = 1; index <= productsCount; index++) {
        let product = await this.state.contract.methods.products(index).call();
        console.log("inside loop : ", product);
        localProducts.push(product);
      }
     
      console.log("End");
      return localProducts;
    };

    return new Promise((resolve, reject) => {
      resolve(forLoop());
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <div>
          === Products Array ====
          <div>Product Num : Product Name : Status </div>
          <ul>
            {
              this.state.products.map(item => {
                return <div>{item[0]} : {item[1]} </div>
              })
            }
          </ul>
        </div>
        <button onClick={() => {this.addProduct();}}> 
        Add Product</button>
      </div>
    );
  }
}

export default App;
