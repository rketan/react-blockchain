import React, { useContext, useState } from 'react';
import { AppContext } from '../App'
import Table from 'react-bootstrap/Table'
import ChangeStatus from './ChangeStatus';
import "../../css/ViewProducts.css"
import StateEnum from "../StateEnum"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import AddProduct from './AddProducts';
import boba from '../../static/img/uciboba.jpeg'

function ViewProducts() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    const [products, setProducts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addProductModal, setAddProductModal] = useState(false);

    const [stateIndex, setStateIndex] = useState(-1);

    const [shouldRender, setShouldRender] = useState(false);

    const validProductStates = ["0", "1", "2"];

    React.useEffect(() => {
        const getProducts = async () => {
            if (localWeb3 !== undefined && localWeb3.eth !== undefined) {
                const accounts = await localWeb3.eth.getAccounts();
                setAcc(accounts[0]);
            }

            if (localContract !== undefined && localContract.methods !== undefined) {
                let productsCount = await localContract.methods.productsCount().call();
                fetchProducts(productsCount)
                    .then(function (localProducts) {
                        setProducts(localProducts);
                    }.bind(this));
            }
        };

        setShouldRender(false)

        getProducts().catch(console.error);
    }, [shouldRender]);

    async function fetchProducts(productsCount) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {
                let product = await localContract.methods.products(index).call();
                if (isValidManufacturerProduct(product)) {
                    localProducts.push(product);
                }
            }
            return localProducts;
        };

        return new Promise((resolve, reject) => {
            resolve(loopThroughProducts());
        });
    }

    function isValidManufacturerProduct(product) {
        return product.manufacturerID === acc && validProductStates.includes(product.currentStatus);
    }

    function productStateName(productState) {
        return StateEnum[productState];
    }


    const setModalIsOpenToTrue = (index) => {
        setModalIsOpen(true)
        setStateIndex(index)
    }

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
        setShouldRender(true)
    }

    const setAddProductModalToTrue = () => {
        setAddProductModal(true)
    }

    const setAddProductModalToFalse = () => {
        setAddProductModal(false)
        console.log("rketan: ", shouldRender)
        setShouldRender(true)
    }

    return (
        <>
            <div style={{ minHeight: "390px", position: "relative", backgroundColor: "lightblue" }}>
                <Button className="view-btn btn-success" onClick={() => setShouldRender(true)}>
                    View Products
                </Button>
                <Button className="view-btn btn-primary" style={{ marginLeft: "100px" }}
                    onClick={() => setAddProductModalToTrue()}>
                    Add Product
                </Button>
                <img src={boba}
                    style={{ borderRadius: "50%", width: "250px", height: "250px", marginTop: "120px", marginLeft: "50px" }}>
                </img>
            </div>

            {addProductModal &&
                <AddProduct
                    parentCallback={setAddProductModalToFalse}
                />}

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
                                                {productStateName(item.currentStatus)}
                                            </b>

                                        </div>
                                    </Card.Text>

                                    {modalIsOpen && index === stateIndex &&
                                        <ChangeStatus
                                            currentState={item.currentStatus}
                                            productID={item.productID}
                                            parentCallback={setModalIsOpenToFalse}
                                            index={index} />}

                                    <div style={{ marginRight: '20%' }}>
                                        <Button
                                            disabled={item.currentStatus == 2}
                                            id={index}
                                            className={item.currentStatus == 2 ? "Update-State-Btn btn-secondary" : "Update-State-Btn btn-success"}
                                            onClick={() => setModalIsOpenToTrue(index)}> Update State
                                        </Button>

                                    </div>

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>

        </>
    );

}

export default ViewProducts;