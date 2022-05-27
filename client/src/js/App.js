import React, {useState} from "react";

import './../css/App.css'
import RouterComponent from "./RouterComponent";
import {Container} from 'react-bootstrap';
import getWeb3 from "./getWeb3";
import ProductTrackingContract from "../contracts/ProductTracking.json";
import { tsParticles } from "tsparticles-engine";
import Particles from "../Particles";

export const AppContext = React.createContext(null);


function App() {

    const styles = {
        root: {
            fontFamily: "sans-serif",
            textAlign: "center",
            height: "100%",
            background: "#222",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    };

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

    tsParticles
        .loadJSON("particles", "../presets/particlesjs-config.json")
        .then((container) => {
            console.log("callback - tsparticles config loaded");
        })
        .catch((error) => {
            console.error(error);
        });
    const particles = tsParticles.domItem(0);
    particles.play();

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

    return (
        <div style={styles.root} className="bg-image">
            <Container style={{maxWidth: "100%", padding: '0px'}}>
                <div className="" style={{}}>
                    <AppProvider>
                        <RouterComponent/>
                    </AppProvider>
                </div>
            </Container>
            <Particles />
        </div>
    );
}

export default App;
