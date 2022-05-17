import Table from "react-bootstrap/Table";
import React, {useContext, useState} from "react";
import {AppContext} from "../App";

function DistributorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);
    const [distributorId, setDistributorId] = accountId;
    const validProductStates = ["Shipped", "DistRecieved"];

    React.useEffect(() => {
        const getProducts = async () => {
            let productsCount = await localContract.methods.productsCount().call();
            getDistributorProducts(productsCount)
                .then(function (localProducts) {
                    setProducts(localProducts);
                });

        };

        getProducts().catch(console.error);
    }, []);

    function isValidDistributorProduct(product) {
        return true;
        // return product.distributorID === accountId && validProductStates.includes(product.currentStatus);
    }

    async function getDistributorProducts(productsCount) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {
                let product = await localContract.methods.products(index).call();
                if (isValidDistributorProduct(product)) {
                    localProducts.push(product);
                }
            }
            return localProducts;
        };

        return new Promise((resolve, reject) => {
            resolve(loopThroughProducts());
        });
    }

    function getButtonNameBasedOnStatus(status) {
        if (status === "Shipped") {
            return "Acknowledge Shipment";
        } else if (status === "DistRecieved") {
            return "Send to Vendor";
        }
    }

    function handleAcknowledgeShipment() { //TODO: impl
        alert("Acknowledge shipment");
    }

    function handleVendorShipping() { //TODO: impl
        alert("Ship To Vendor");
    }

    function getOnClickHandler(status) {
        if (status === "Shipped") {
            return handleAcknowledgeShipment;
        } else if (status === "DistRecieved") {
            return handleVendorShipping;
        }
    }

    return (
        <>
            <h1>View products</h1>
            <br/>
            <Table>
                <thead>
                <tr>
                    <th>UUID</th>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Product Description</th>
                </tr>
                </thead>
                <tbody>
                {products.map(item => {
                    return (
                        <tr>
                            <td>{item.productID}</td>
                            <td>{item.sku}</td>
                            <td>{item.name}</td>
                            <td>{item.desc}</td>
                            <td>
                                <button
                                    onClick={getOnClickHandler(item.currentStatus)}>{getButtonNameBasedOnStatus(item.currentStatus)}</button>
                            </td>
                        </tr>
                    );
                })
                }
                </tbody>
            </Table>
        </>
    );
}

export default DistributorViewOrders;