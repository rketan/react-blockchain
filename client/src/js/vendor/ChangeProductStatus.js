import React from "react";
import Table from 'react-bootstrap/Table'
import {Form, Button} from 'react-bootstrap'

function VendorChangeProductStatus() {
    return (<>
    <h1>Change Product Status</h1>
    <Form>
    <Table>
        <thead>
            <tr>
                <th>Order Number</th>
                <th>Product UUID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Order Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0001</td>
                <td>0001</td>
                <td>Shoes</td>
                <td>1</td>
                <td>Shipped</td>
                <td><Button>Update Status</Button></td>
            </tr>
            <tr>
                <td>0002</td>
                <td>0001</td>
                <td>Shoes</td>
                <td>1</td>
                <td>Ordered</td>
                <td><Button>Update Status</Button></td>
            </tr>
        </tbody>
    </Table>
    </Form>
    </>)
}

export default VendorChangeProductStatus;