import React, {useState} from "react";

import './../css/App.css'
import RouterComponent from "./RouterComponent";
import {Container} from 'react-bootstrap';
import logo from '../static/img/blockchain.jpg'
import getWeb3 from "./getWeb3";
import ProductTrackingContract from "../contracts/ProductTracking.json";
import RolesTrackingContract from "../contracts/Roles.json";


export const AppContext = React.createContext(null);

function App() {

    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [rolesContract, setRolesContract] = useState(null);

    const [accountId, setAccountId] = useState(null);

    React.useEffect(() => {
        // Get network provider and web3 instance.
        const fetchWeb3 = async () => {
            const web3 = await getWeb3();
            setWeb3(web3);
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            let deployedNetwork = ProductTrackingContract.networks[networkId];
            const rolesTrackingInstance = new web3.eth.Contract(
                RolesTrackingContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            const productTrackingInstance = new web3.eth.Contract(
                ProductTrackingContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            setContract(productTrackingInstance);
            setRolesContract(rolesTrackingInstance);
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
                    accountId: [accountId, setAccountId],
                    rolesContract : [rolesContract, setRolesContract]
                }}>
                {props.children}
            </AppContext.Provider>
        );
    };

    return (
        <div className="bg-image">
            <h1 style={{position: 'fixed', top: 30, left: 30}}>
                <img src={logo} alt='logo' width='150'
                     style={{height: "180px", width: "200px", borderRadius: "50%"}}/>
            </h1>

            <h1 style={{position: 'fixed', top: 30, left: 900}}>
                ZotChain
            </h1>
            <Container
                className="d-flex align-items-center justify-container-center"
                style={{minHeight: "100vh", position: "relative"}}>
                <div className="w-100 signup-container" style={{maxWidth: "400px"}}>
                    <AppProvider>
                        <RouterComponent/>
                    </AppProvider>
                </div>
            </Container>
        </div>
    );
}

export default App;
