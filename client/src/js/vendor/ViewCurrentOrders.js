import React from "react";
import Table from 'react-bootstrap/Table'
import {Form, Button} from 'react-bootstrap'

function ViewCurrentOrders() {
    return (
        <>
        <h1>View Current Orders</h1>
        <br/>
        <Table>
            <tr>
                <th>UUID</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Product Description</th>
                <th>Current State</th>
            </tr>
            <tr>
                <td>0001</td>
                <td>15</td>
                <td>Shoes</td>
                <td>Product Description</td>
                <td>With_Distributor</td>
            </tr>
            <tr>
                <td>0002</td>
                <td>17</td>
                <td>Different Product</td>
                <td>Product Description</td>
                <td>With_Vendor</td>
            </tr>
        </Table>
    </>
        )
}

export default ViewCurrentOrders;