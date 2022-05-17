import Table from "react-bootstrap/Table";
import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import {Modal, Button} from "react-bootstrap";
import DistributorChangeProductStatus from './ChangeProductStatus';
import StateEnum from "../StateEnum"

function DistributorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);
    const localWeb3 = web3;
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);
    const [distributorId, setDistributorId] = accountId;
    const validProductStates = ["2", "3"];
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);
    const[shouldRender, setShouldRender] = useState(false);


    React.useEffect(() => {

        const getProducts = async () => {

            if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
                const accounts = await localWeb3.eth.getAccounts();
                setDistributorId(accounts[0]);
            }
            let productsCount = await localContract.methods.productsCount().call();
            getDistributorProducts(productsCount)
                .then(function (localProducts) {
                    setProducts(localProducts);
                });

        };
        setShouldRender(false)

        getProducts().catch(console.error);
    }, [shouldRender]);

    function productStateName(productState) {
        return StateEnum[productState];
    }

    function isValidDistributorProduct(product) {
        return product.distributorID === accountId[0] && validProductStates.includes(product.currentStatus);
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
        setModalIsOpen(true);
        setStateIndex(index);
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
        setShouldRender(true);

    }


    function getOnClickHandler(status, index) {

        function handleAcknowledgeShipment() {
            setModalIsOpenToTrue(index);
        }

        function handleVendorShipping() {
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

    return (
        <>
            <h1>View Distributor's orders</h1>
            <br/>
            <Table class="table">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">UUID</th>
                    <th scope="col">SKU</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Product Description</th>
                    <th scope="col">Current Order status</th>
                    <th scope="col">Take action</th>
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
                            <td>{productStateName(item.currentStatus)}</td>

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
        </>
    );
}

export default DistributorViewOrders;