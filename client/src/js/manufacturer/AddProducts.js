import React, {useContext, useState} from "react";
import {AppContext} from '../App'
import {Button, Form, Modal} from 'react-bootstrap'

function AddProduct(props) {
    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [account, setAccount] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    const addProduct = async () => {
        if (localWeb3 !== undefined && localWeb3.eth !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            setAccount(accounts[0]);
        }

        if (localContract !== undefined && localContract.methods !== undefined) {
            await localContract.methods
                .manufactureProduct(productUUID, productName, productSKU, productDesc, account, Date.now())
                .send({from: account});

            setProductName("");
            setProductUUID("");
            setProductSKU("");
            setProductDesc("");
        }
    };


    const [productName, setProductName] = useState("");
    const [productUUID, setProductUUID] = useState("");
    const [productSKU, setProductSKU] = useState("");
    const [productDesc, setProductDesc] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        addProduct().then(() => props.parentCallback()).catch(console.error);
    }


    return (
    <>
            <Modal style={{ backgroundColor: 'rgb(0, 0, 0, 0.5) !important' }}
                show={true}
                onHide={props.parentCallback} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{marginLeft:'120px'}}> 
                        Add Product Dialog 
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="product-name">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            required
                            autoFocus
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group id="product-uuid">
                        <Form.Label>UUID</Form.Label>
                        <Form.Control
                            required
                            autoFocus
                            type="text"
                            value={productUUID}
                            onChange={(e) => setProductUUID(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group id="product-sku">
                        <Form.Label>SKU</Form.Label>
                        <Form.Control
                            required
                            autoFocus
                            type="text"
                            value={productSKU}
                            onChange={(e) => setProductSKU(e.target.value)}/>
                    </Form.Group>

                    <Form.Group id="product-desc">
                        <Form.Label>Product Description</Form.Label>
                        <Form.Control
                            required
                            autoFocus
                            type="text"
                            value={productDesc}
                            onChange={(e) => setProductDesc(e.target.value)}
                        />
                    </Form.Group>
                    <Button className="w-100 mt-3" type="submit">Submit New Product</Button>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button variant="primary"
                        onClick={() => callback()}>
                        Save Changes
                    </Button> */}
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default AddProduct;