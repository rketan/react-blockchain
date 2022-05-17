import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import Table from "react-bootstrap/Table";
import VendorChangeProductStatus from "./ChangeProductStatus";

function VendorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);
    const [distributorId, setDistributorId] = accountId;
    const validProductStates = ["4", "5", "6"];
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);


    function isValidVendorProduct(product) {
        return product.vendorID === accountId[0] && validProductStates.includes(product.currentStatus);
    }

    async function getVendorProducts(productsCount) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {
                let product = await localContract.methods.products(index).call();
                if (isValidVendorProduct(product)) {
                    localProducts.push(product);
                }
            }
            return localProducts;
        };

        return new Promise((resolve, reject) => {
            resolve(loopThroughProducts());
        });
    }

    React.useEffect(() => {
        const getProducts = async () => {
            let productsCount = await localContract.methods.productsCount().call();
            getVendorProducts(productsCount)
                .then(function (localProducts) {
                    setProducts(localProducts);
                });

        };

        getProducts().catch(console.error);
    }, []);

    function getButtonNameBasedOnStatus(status) {
        if (status === "4") {
            return "Acknowledge Shipment";
        } else if (status === "5") {
            return "Record Customer Purchase";
        } else {
            return"Customer Purchased";
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

        function handleAcknowledgeShipment() {
            setModalIsOpenToTrue(index);
        }

        function handleCustomerPurchase() {
            setModalIsOpenToTrue(index)
        }

        if (status === "4") {
            return handleAcknowledgeShipment;
        } else if (status === "5") {
            return handleCustomerPurchase;
        }
    }

    function getClassName(status) {
        if (status === "4") {
            return "btn btn-primary btn-sm";
        } else if (status === "5") {
            return "btn btn-warning btn-sm";
        } else {
            return "btn btn-success btn-sm"
        }
    }

    return (
        <>
            <h1>View Vendor's orders</h1>
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
                                <VendorChangeProductStatus
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
        </>
    );
}

export default VendorViewOrders;
