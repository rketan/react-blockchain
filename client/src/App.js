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

    this.fetchProducts(productTrackingContract, productsCount).then(function(localProducts) {
      console.log("debug main func::: ", localProducts);
      this.setState({storageValue: response, products: localProducts}, this.traverseProducts);
    }.bind(this));

  };

  addProduct() {
    alert('Add product api called!');
    const response1 = this.state.contract.methods.addProduct("rutvi").call();
    console.log("add product called");
  };

  traverseProducts() {
    this.state.products.map(item => {
      console.log("product : ", item);
    })
  }

  fetchProducts(productTrackingContract, productsCount) {
    let localProducts = [];
    
    const forLoop = async _ => {
      console.log("Start");
      
    for(let index = 1; index <= productsCount; index++) {
      let product = await this.state.contract.methods.products(index).call();
      console.log("inside loop : ", product);
      localProducts.push(product);
    }

   // _callback(localProducts);
     console.log("End");
      return localProducts;
     };

     ;

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
                return <div>{item[0]} : {item[1]} : {item[2]} </div>
              })
            }
          </ul>
        </div>
        <button onclick={this.addProduct}>Add Product</button>
      </div>
    );
  }
}

export default App;
