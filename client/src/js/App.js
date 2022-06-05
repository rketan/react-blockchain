import React, { useState } from "react";

import './../css/App.css'
import RouterComponent from "./RouterComponent";
import { Container } from 'react-bootstrap';
import logo from '../static/img/blockchain.jpg'
import getWeb3 from "./getWeb3";
import ProductTrackingContract from "../contracts/ProductTracking.json";

export const AppContext = React.createContext(null);

function App() {

    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accountId, setAccountId] = useState(null);

    React.useEffect(() => {

        // Get network provider and web3 instance.
        const fetchWeb3 = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            let deployedNetwork = ProductTrackingContract.networks[networkId];
            const productTrackingInstance = new web3.eth.Contract(
                ProductTrackingContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            setContract(productTrackingInstance);
        };

        // func call
        fetchWeb3().catch(console.error);

    }, []);

    const AppProvider = props => {
        return (
            <AppContext.Provider
                value={{
                    web3: [web3, setWeb3],
                    contract: [contract, setContract],
                    accountId: [accountId, setAccountId]
                }}>
                {props.children}
            </AppContext.Provider>
        );
    };
    //style={{height: '100%', backgroundColor: "lightblue", textAlign: "center", alignSelf: "center"}}

    return (
        <div className="bg-image" >
            <Container style={{ maxWidth:"100%", padding:'0px' }}>
                <div className="" style={{  }}>
                    <AppProvider>
                        <RouterComponent />
                    </AppProvider>
                </div>
            </Container>
        </div>
    );
}

export default App;
