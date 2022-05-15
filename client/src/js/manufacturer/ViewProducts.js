import React, { useContext, useState } from 'react';
import { AppContext } from '../App'
import Table from 'react-bootstrap/Table'

function ViewProducts() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [products, setProducts] = useState([]);

    React.useEffect(() => {
        const getProducts = async () => {
            let productsCount = await localContract.methods.productsCount().call();
            fetchProducts(productsCount)
                .then(function (localProducts) {
                setProducts(localProducts);
            }.bind(this));

        };

        getProducts().catch(console.error);
    }, []);

    async function fetchProducts(productsCount) {
        let localProducts = [];
        const loopThroughProducts = async _ => {
            for (let index = 1; index <= productsCount; index++) {
                let product = await localContract.methods.products(index).call();
                localProducts.push(product);
            }
            return localProducts;
        };

        return new Promise((resolve, reject) => {
            resolve(loopThroughProducts());
        });
    }

    return (
        <>
            <h1>View products</h1>
            <br />
            <Table>
                <thead>
                    <tr>
                        <th>UUID</th>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Product Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(item => {
                        return (
                            <tr>
                                <td>{item.productID}</td>
                                <td>{item.sku}</td>
                                <td>{item.name}</td>
                                <td>{item.desc}</td>
                            </tr>
                        );


                    })
                    }
                </tbody>
            </Table>
        </>
    );
}

export default ViewProducts;