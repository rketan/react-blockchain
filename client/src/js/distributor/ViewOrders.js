import Table from "react-bootstrap/Table";
import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import {Modal, Button} from "react-bootstrap";
import DistributorChangeProductStatus from './ChangeProductStatus';

function DistributorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);
    const [distributorId, setDistributorId] = accountId;
    const validProductStates = ["2", "3"];
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);

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
        if (status === "2") {
            return "Acknowledge Shipment";
        } else if (status === "3") {
            return "Send to Vendor";
        }
    }

    const setModalIsOpenToTrue = (index) => {
        setModalIsOpen(true)
        setStateIndex(index)
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }


    function getOnClickHandler(status, index) {
        var localIndex = index;

        function handleAcknowledgeShipment() { //TODO: impl
            alert("Acknowledge shipment" + localIndex);
            setModalIsOpenToTrue(index);
        }

        function handleVendorShipping() { //TODO: impl
            alert("Ship To Vendor" + localIndex);
            setModalIsOpenToTrue(index)
        }

        if (status === "2") {
            return handleAcknowledgeShipment;
        } else if (status === "3") {
            return handleVendorShipping;
        }
    }

    function getClassName(status) {
        if (status === "2") {
            return "btn btn-primary btn-sm";
        } else if (status === "3") {
            return "btn btn-success btn-sm";
        }

    }

    async function receiveAsDistributor(productUUID) {
        productUUID = prompt("enter product id");
        let response = await localContract.methods
            .recieveAsDistributor(productUUID)
            .send({from: distributorId});

    }

    return (
        <>
            <h1>View products</h1>
            <br/>
            <Table class="table">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">UUID</th>
                    <th scope="col">SKU</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Product Description</th>
                </tr>
                </thead>
                <tbody>
                {products.map((item, index) => {
                    return (
                        <tr>
                            <td>{item.productID}</td>
                            <td>{item.sku}</td>
                            <td>{item.name}</td>
                            <td>{item.desc}</td>

                            {modalIsOpen && index === stateIndex &&
                                <DistributorChangeProductStatus
                                    currentState={item.currentStatus}
                                    productID={item.productID}
                                    parentCallback={setModalIsOpenToFalse}
                                    index={index}/>}
                            <td>
                                <button className={getClassName(item.currentStatus)}
                                        onClick={getOnClickHandler(item.currentStatus, index)}>{getButtonNameBasedOnStatus(item.currentStatus)}</button>
                            </td>
                        </tr>
                    );
                })
                }
                </tbody>
            </Table>
            <Button className="w-100 mt-3" onClick={receiveAsDistributor}>
                Ship To Distributor</Button>

        </>
    );
}

export default DistributorViewOrders;