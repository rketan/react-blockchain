import React, { useContext, useState } from 'react';
import { AppContext } from '../App'
import Table from 'react-bootstrap/Table'
import ChangeStatus from './ChangeStatus';
import "../../css/ViewProducts.css"
import StateEnum from "../StateEnum"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

function ViewProducts() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    const [products, setProducts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [stateIndex, setStateIndex] = useState(-1);

    const[shouldRender, setShouldRender] = useState(false);

    const validProductStates = ["0", "1", "2"];

    React.useEffect(() => {
        const getProducts = async () => {
            if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
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
                if(isValidManufacturerProduct(product)) {
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

    return (
        <>
            <h1>View products</h1>
            <br />
            <Table className="table">
                <thead>
                    <tr>
                        <th>UUID</th>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Product Description</th>
                        <th>Product State</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => {
                        return (
                            <>
                                <tr>
                                    <td>{item.productID}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.name}</td>
                                    <td>{item.desc}</td>
                                    <td>{productStateName(item.currentStatus)}</td>

                                    {modalIsOpen && index === stateIndex &&
                                        <ChangeStatus
                                        currentState={item.currentStatus}
                                        productID={10}
                                        parentCallback={setModalIsOpenToFalse}
                                        index={index} />}

                                    {<Button
                                        id={index}
                                        className="historybutton"
                                        onClick={() => setModalIsOpenToTrue(index)}>
                                        Show History
                                    </Button>}

                                    {modalIsOpen && index === stateIndex &&
                                        <ChangeStatus
                                        currentState={item.currentStatus}
                                        productID={item.productID}
                                        parentCallback={setModalIsOpenToFalse}
                                        index={index} />}

                                    {item.currentStatus < 2 && <Button
                                        id={index}
                                        className="Update-State-Btn"
                                        onClick={() => setModalIsOpenToTrue(index)}>
                                        Update State
                                    </Button>}

                                </tr>
                            </>
                        );
                    })
                    }
                </tbody>
            </Table>
        </>
    );
}

export default ViewProducts;