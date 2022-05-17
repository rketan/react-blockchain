import React from "react";
import Table from 'react-bootstrap/Table'
import {Form, Button} from 'react-bootstrap'

function PlaceOrder() {
    return (<>
    <h1>Place an Order</h1>
    <Form>
    <Table>
        <thead>
            <tr>
                <th>Product UUID</th>
                <th>Product Name</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0001</td>
                <td>Shoes</td>
                <td>
                    <Form.Group id="Shoe Quantity">
                        <Form.Control/>
                    </Form.Group>
                </td>
                <td><Button>Place Order</Button></td>
                
            </tr>
            <tr>
                <td>0002</td>
                <td>Pants</td>
                <td>
                    <Form.Group id="Shoe Quantity">
                        <Form.Control/>
                    </Form.Group>
                </td>
                <td><Button>Place Order</Button></td>
            </tr>
        </tbody>
    </Table>
    
    </Form>
    </>)
}

export default PlaceOrder;