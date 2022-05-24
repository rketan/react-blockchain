import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import VendorChangeProductStatus from "./ChangeProductStatus";
import StateEnum from "../StateEnum";
import {Row, Col, Button} from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import boba from '../../static/img/uciboba.jpeg'

function VendorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);

    const [localWeb3, setLocalWeb3] = web3;
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);

    const [vendorID, setVendorID] = accountId;

    const validProductStates = ["4", "5", "6"];
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);
    const[shouldRender, setShouldRender] = useState(false);

    React.useEffect(() => {
        const getProducts = async () => {
            if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
                const accounts = await localWeb3.eth.getAccounts();
                setVendorID(accounts[0]);
            }

            if (localContract !== undefined && localContract.methods !== undefined) {
            let productsCount = await localContract.methods.productsCount().call();
            getVendorProducts(productsCount)
                .then(function (localProducts) {
                    setProducts(localProducts);
                });
            }

        };
        setShouldRender(false);
        getProducts().catch(console.error);
    }, [shouldRender]);

    function isValidVendorProduct(product) {
        return product.vendorID === vendorID && validProductStates.includes(product.currentStatus);
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

        function handleCustomerPurchase() {
            setModalIsOpenToTrue(index);
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
            return "btn btn-success btn-sm";
        }
    }

    return (
        <div style={{marginTop: '20px'}}>

<div style={{ minHeight: "390px", position: "relative", backgroundColor: "lightblue" }}>
                <Button className="view-btn btn-success" onClick={() => setShouldRender(true)}>
                    View Products
                </Button>
                <Button className="view-btn btn-primary" style={{ marginLeft: "100px" }}>
                    Place Order
                </Button>
                <img src={boba}
                    style={{ borderRadius: "50%", width: "250px", height: "250px", marginTop: "120px", marginLeft: "50px" }}>
                </img>
            </div>

<Row xs={2} md={4} className="g-4" style={{ marginTop: '20px', marginLeft: '40px' }}>
                {products.map((item, index) => (
                    <Col>
                        <div style={{ marginTop: '20px' }}>
                            <Card style={{ width: '20rem', height: '200px' }}>
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        <b> UUID : </b> {item.productID}
                                        <b style={{ marginLeft: '20px' }}> SKU : </b> {item.sku}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        <div>
                                            <b>Description: </b> {item.desc} </div>
                                        <div>
                                            <b style={{ float: "left" }}>
                                                Current State:
                                            </b>

                                            <b style={{
                                                float: "right", backgroundColor: "lightblue",
                                                width: "60%", textAlign: "center", fontSize: '18px'
                                            }}>
                                                {StateEnum[item.currentStatus]}
                                            </b>

                                        </div>
                                    </Card.Text>

                                    {modalIsOpen && index === stateIndex &&
                                        <VendorChangeProductStatus
                                            currentState={item.currentStatus}
                                            productID={item.productID}
                                            parentCallback={setModalIsOpenToFalse}
                                            index={index} />}

                                    <div style={{ marginRight: '10%', marginTop:'16%', marginLeft:'20%' }}>
                                    <button className={getClassName(item.currentStatus)}
                            onClick={getOnClickHandler(item.currentStatus, index)}>
                                {getButtonNameBasedOnStatus(item.currentStatus)}
                                </button>

                                    </div>

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>
            
        </div>
    );
}

export default VendorViewOrders;
