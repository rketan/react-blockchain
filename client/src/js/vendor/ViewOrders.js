import React, {useContext, useState} from "react";
import {AppContext} from "../App";
import VendorChangeProductStatus from "./ChangeProductStatus";
import StateEnum from "../StateEnum";
import {Button, Col, Row} from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import boba from '../../static/img/uciboba.jpeg'
import ProductHistory from "./ProductHistory";

function VendorViewOrders() {

    const {web3, contract, accountId} = useContext(AppContext);

    const localWeb3 = web3[0];
    const localContract = contract[0];
    const [products, setProducts] = useState([]);
    const [purchaseEligibleProduct, setPurchaseEligibleProducts] = useState([]);

    const [vendorID, setVendorID] = accountId;

    const validProductStates = ["4", "5", "6"];
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);

    const [shouldRenderViewOrders, setShouldRenderViewOrders] = useState(true);
    const [shouldRenderPlaceOrder, setShouldRenderPlaceOrder] = useState(false);

    const [renderProductHistory, setRenderProductHistory] = useState(false);

    const [product, setProduct] = useState(null);

    React.useEffect(() => {
        const getProducts = async () => {
            if (localWeb3 !== undefined && localWeb3.eth !== undefined) {
                const accounts = await localWeb3.eth.getAccounts();
                setVendorID(accounts[0]);
            }

            if (localContract !== undefined && localContract.methods !== undefined) {
                let productsCount = await localContract.methods.productsCount().call();
                getVendorProducts(productsCount, "viewOrder")
                    .then(function (localProducts) {
                        setProducts(localProducts);
                });

                getVendorProducts(productsCount, "placeOrder")
                    .then(function (localProducts) {
                        setPurchaseEligibleProducts(localProducts);
                    });
            }

        };
        if (shouldRenderViewOrders) {
            setShouldRenderViewOrders(true);
        } else {
            setShouldRenderViewOrders(false);
        }

        if (renderProductHistory) {
            setRenderProductHistory(true);
        } else {
            setRenderProductHistory(false);
        }

        if (shouldRenderPlaceOrder) {
            setShouldRenderPlaceOrder(true);
        } else {
            setShouldRenderPlaceOrder(false);
        }

        getProducts().catch(console.error);

    }, [shouldRenderViewOrders, renderProductHistory, shouldRenderPlaceOrder]);

    function isValidVendorProduct(product) {
        return product.vendorID === vendorID && validProductStates.includes(product.currentStatus);
    }

    function isValidPlaceOrderProduct(product) {
        return product.currentStatus === "0";
    }

    async function getVendorProducts(productsCount, operation) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {

                let product = await localContract.methods.getProduct(vendorID, index).call();
                if (product.name === "") {
                    continue;
                }
                if (operation === "viewOrder" && isValidVendorProduct(product)) {
                    localProducts.push(product);
                } else if (operation === "placeOrder" && isValidPlaceOrderProduct(product)) {
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
            return "View Product History";
        }
    }

    const setModalIsOpenToTrue = (index) => {
        setModalIsOpen(true);
        setStateIndex(index);
        setRenderProductHistory(false)
        setShouldRenderViewOrders(true);
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
        setShouldRenderViewOrders(true);
        setRenderProductHistory(false)
    }

    function placeOrder(productId, manufacturerID) {

        async function placeOrderInternal() {
            console.log("placing order: " + productId + " " + manufacturerID);
            await localContract.methods.placeOrderRequest(productId, Date.now()).send({from: vendorID});
            alert("Order Placed Successfully");
            setShouldRenderViewOrders(false);
            setShouldRenderPlaceOrder(true);
        }

        return placeOrderInternal;
    }

    function getOnClickHandler(status, index, product) {

        if (status === "4") {
            setModalIsOpenToTrue(index);
        } else if (status === "5") {
            setModalIsOpenToTrue(index);
        } else if (status === "6") {
            setShouldRenderViewOrders(false);
            setRenderProductHistory(true)
            setShouldRenderPlaceOrder(false);
            setProduct(product);
        }
    }

    function getClassName(status) {
        if (status === "4" || status === "5") {
            return "btn-primary";
        } else {
            return "btn-success";
        }
    }

    const getBgColor = (currentState) => {
        return currentState == 4 ? "rgb(255 164 114)" : currentState == 5 ? "rgb(144 108 158)" : "#55c083";
    }

    function viewProductClicked() {
        setRenderProductHistory(false);
        setShouldRenderViewOrders(true);
        setShouldRenderPlaceOrder(false);
    }

    return (
        <div style={{marginTop: '20px'}}>

            <div style={{minHeight: "390px", position: "relative", backgroundColor: "lightblue"}}>
                <Button className="view-btn btn-success" onClick={viewProductClicked}>
                    View Products
                </Button>

                <Button className="view-btn btn-primary" style={{marginLeft: "60px"}} onClick={() => {
                    setShouldRenderViewOrders(false);
                    setShouldRenderPlaceOrder(true);
                    setRenderProductHistory(false);
                }}>
                    Place Order
                </Button>
                <img src={boba}
                     style={{
                         borderRadius: "50%",
                         width: "250px",
                         height: "250px",
                         marginTop: "120px",
                         marginLeft: "50px"
                     }} alt="ZotChain">
                </img>
            </div>


            {shouldRenderViewOrders &&
                <Row xs={2} md={4} className="g-4" style={{marginTop: '20px', marginLeft: '40px'}}>
                    {products.map((item, index) => (
                        <Col>
                            <div style={{marginTop: '20px'}}>
                                <Card style={{width: '100%', height: '245px', backgroundColor: 'antiquewhite',
                                borderColor: 'black'}}>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <b> UUID : </b> {item.productID}
                                            <b style={{marginLeft: '20px'}}> SKU : </b> {item.sku}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <div style={{ overflowY: "scroll", marginBottom: '3%', height:"50px" }}>
                                                <b>Description: </b> {item.desc} </div>
                                            <div>
                                                <b style={{float: "left"}}>
                                                    Current State:
                                                </b>

                                                <b style={{
                                                    float: "right", backgroundColor: getBgColor(item.currentStatus),
                                                    width: "60%", textAlign: "center", fontSize: '18px', marginRight:'18px'
                                                }}>
                                                    {StateEnum[item.currentStatus]}
                                                </b>

                                            </div>
                                        </Card.Text>

                                        {modalIsOpen && index === stateIndex &&
                                            <VendorChangeProductStatus
                                                getBgColor={getBgColor}
                                                currentState={item.currentStatus}
                                                productID={item.productID}
                                                parentCallback={setModalIsOpenToFalse}
                                                index={index}/>}

                                        <div style={{marginRight: '10%', marginTop: '18%', marginLeft: '20%'}}>
                                            <Button 
                                                className={getClassName(item.currentStatus)}
                                                onClick={() => getOnClickHandler(item.currentStatus, index, item)}>
                                                {getButtonNameBasedOnStatus(item.currentStatus)}
                                            </Button>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>}

            {shouldRenderPlaceOrder &&
                <Row xs={2} md={4} className="g-4" style={{marginTop: '20px', marginLeft: '40px'}}>
                    {purchaseEligibleProduct.map(item => (
                        <Col>
                            <div style={{marginTop: '20px'}}>
                                <Card style={{width: '100%', height: '100%', backgroundColor: 'antiquewhite',
                                    borderColor: 'black'}}>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <b> UUID : </b> {item.productID}
                                            <b style={{marginLeft: '20px'}}> SKU : </b> {item.sku}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <div style={{overflowY: "scroll"}}>
                                                <b>Description: </b> {item.desc}
                                            </div>
                                            <div>
                                                <b> Manufacturer Name : </b> {item.entityNames.manufacturerName}
                                            </div>
                                        </Card.Text>

                                        <div style={{marginRight: '10%', marginLeft: '20%'}}>
                                            <button className="btn-success btn-lg"
                                                    onClick={placeOrder(item.productID, item.manufacturerID)}>
                                                Place Order
                                            </button>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>
            }

            {renderProductHistory &&
                <ProductHistory
                    product={product}/>}
        </div>
    );
}

export default VendorViewOrders;
