import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import {Row, Col, Button} from "react-bootstrap";
import DistributorChangeProductStatus from './ChangeProductStatus';
import StateEnum from "../StateEnum"
import Card from 'react-bootstrap/Card'
import boba from '../../static/img/uciboba.jpeg'

function DistributorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);

    const [localWeb3, setLocalWeb3] = web3;
    const [localContract, setLocalContract] = contract;

    const [products, setProducts] = useState([]);
    const [distributorId, setDistributorId] = accountId;
    const validProductStates = ["2", "3", "4"];

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);
    const[shouldRender, setShouldRender] = useState(false);


    React.useEffect(() => {

        const getProducts = async () => {
            if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
                const accounts = await localWeb3.eth.getAccounts();
                setDistributorId(accounts[0]);
            }

            if (localContract !== undefined && localContract.methods !== undefined) {
                let productsCount = await localContract.methods.productsCount().call();
            getDistributorProducts(productsCount)
                .then(function (localProducts) {
                    setProducts(localProducts);
                });
            }
        };

        setShouldRender(false)

        getProducts().catch(console.error);
    }, [shouldRender]);


    function productStateName(productState) {
        return StateEnum[productState];
    }

    function isValidDistributorProduct(product) {
        if(product === null || distributorId === null) return false;
        
        return product.distributorID === distributorId && validProductStates.includes(product.currentStatus);
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
        } else if (status === "4") {
            return "No Action";
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
        } else if (status === "4") {
            return "btn btn-secondary btn-sm";
        }
    }

    return (
        <div style={{marginTop: '20px'}}>
            <div style={{ minHeight: "390px", position: "relative", backgroundColor: "lightblue" }}>
                <Button className="view-btn btn-success" onClick={() => setShouldRender(true)}>
                    View Products
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
                                                width: "60%", textAlign: "center", fontSize: '15px'
                                            }}>
                                                {productStateName(item.currentStatus)}
                                            </b>

                                        </div>
                                    </Card.Text>

                                    {modalIsOpen && index === stateIndex &&
                                <DistributorChangeProductStatus
                                    currentState={item.currentStatus}
                                    productID={item.productID}
                                    parentCallback={setModalIsOpenToFalse}
                                    index={index}/>}

<div style={{textAlign: "center", border: "1px"}}>
<button
                                        style={{marginTop: '22px', marginRight: '50px'}}
                                        className={getClassName(item.currentStatus)}
                                        onClick={getOnClickHandler(item.currentStatus, index)}>
                                            {getButtonNameBasedOnStatus(item.currentStatus)}
                                    </button>
</div>

                                    

                                    {/* <div style={{ marginRight: '20%' }}>
                                        <Button
                                            disabled={item.currentStatus == 2}
                                            id={index}
                                            className={item.currentStatus == 2 ? "Update-State-Btn btn-secondary" : "Update-State-Btn btn-success"}
                                            onClick={() => setModalIsOpenToTrue(index)}> Update State
                                        </Button>

                                    </div> */}

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default DistributorViewOrders;