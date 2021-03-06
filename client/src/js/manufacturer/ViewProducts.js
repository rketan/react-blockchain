import React, {useContext, useState} from 'react';
import {AppContext} from '../App'
import ChangeStatus from './ChangeStatus';
import "../../css/ViewProducts.css"
import StateEnum from "../StateEnum"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import AddProduct from './AddProducts';
import boba from '../../static/img/uciboba.jpeg'

function ViewProducts(props) {
    const {web3, contract, accountId} = useContext(AppContext);
    const localContract = contract[0];
    const [acc, setAcc] = accountId;
    const localWeb3 = web3[0];
    const userName = props.userName === "" ? localStorage.getItem("USER_NAME") : props.userName;
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

                console.log("rketan: man products", productsCount)
            }
        };

        setShouldRender(false)

        getProducts().catch(console.error);
    }, [shouldRender]);

    async function fetchProducts(productsCount) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {
                let product = await localContract.methods.getProduct(acc, index).call();
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

    const getBgColor = (currentState) => {
        return currentState == 0 ? "#f67c87" : currentState == 1 ? "#7c9af6" : "#eab335";
    }

    return (
        <>
            <div style={{minHeight: "390px", position: "relative", backgroundColor: "lightblue"}}>
                <Button className="view-btn btn-success" onClick={() => setShouldRender(true)}>
                    View Products
                </Button>
                <Button className="view-btn btn-primary" style={{marginLeft: "100px"}}
                        onClick={() => setAddProductModalToTrue()}>
                    Add Product
                </Button>
                <img src={boba}
                     style={{
                         borderRadius: "50%",
                         width: "250px",
                         height: "250px",
                         marginTop: "120px",
                         marginLeft: "50px"
                     }}>
                </img>
            </div>

            {addProductModal &&
                <AddProduct
                    userName = {userName}
                    parentCallback={setAddProductModalToFalse}
                />}

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
                                            <b>Description: </b> {item.desc} 
                                        </div>
                                        <div>
                                            <b style={{float: "left"}}>
                                                Current State:
                                            </b>

                                            <b style={{
                                                float: "right", 
                                                backgroundColor: getBgColor(item.currentStatus),
                                                width: "60%", 
                                                textAlign: "center", 
                                                fontSize: '18px',
                                                marginRight: '18px'
                                            }}>
                                                {productStateName(item.currentStatus)}
                                            </b>

                                        </div>
                                    </Card.Text>

                                    <div style={{marginRight: '20%'}}>
                                        <Button
                                            disabled={item.currentStatus == 2}
                                            id={index}
                                            className={item.currentStatus == 2 ? "Update-State-Btn btn-secondary" : "Update-State-Btn btn-primary"}
                                            onClick={() => setModalIsOpenToTrue(index)}> Update State
                                        </Button>

                                    </div>

                                    {modalIsOpen && index === stateIndex &&
                                        <ChangeStatus
                                            userName = {userName}
                                            getBgColor={getBgColor}
                                            currentState={item.currentStatus}
                                            productID={item.productID}
                                            parentCallback={setModalIsOpenToFalse}
                                            index={index}/>
                                    }
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