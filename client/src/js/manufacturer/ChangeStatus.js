import React, { useState, useContext } from "react";
import StateEnum from "../StateEnum"
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContext } from '../App'


function ChangeStatus(props) {
    const [stateValue, setStateValue] = useState(0);
    const [nextValue, setNextValue] = useState(0);
    const [productID, setProductID] = useState(0);
    const [distID, setDistID] = useState(null);
    const [knownDists, setKnownDists] = useState([]);

    const { web3, contract, accountId } = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    React.useEffect(() => {
        const nextVal = Number(stateValue) + 1;
        setNextValue(nextVal)
        setProductID(props.productID)

        const getDists = async () => {
            fetchAccount().then(function(accounts) {
                console.log("account", accounts[0]);
                setAcc(accounts[0]);
                if (accounts !== null) {
                    fetchDists().then(function (kd) {
                        console.log("knowndists: ", kd);
                        setKnownDists(kd);
                    }.bind(this));
                }
            }.bind(this));
        }
        getDists().catch(console.error);
        
    }, [stateValue]);

    async function fetchAccount() {
        let accounts = null;
        if(localWeb3 !== undefined && localWeb3.eth !== undefined)
            accounts = await localWeb3.eth.getAccounts();
        return accounts;
    }

    async function fetchDists() {
        if (localContract !== undefined && localContract.methods !== undefined && acc != null) {
            let dists = await localContract.methods.getDistAddresses(acc).call();
            console.log("dists", dists);
            return dists;
        }
    }

    const handleStateUpdate = () => {
        setStateValue(props.currentState)
    }

    /*async function validateDist() {
        return await localContract.methods.isDistributor(distID).call();
    }*/

    async function callback() {
        if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            setAcc(accounts[0]);
        }

        // update the state to the backend
        if (localContract !== undefined && localContract.methods !== undefined) {
            if (stateValue == 0) {
                if (productID !== undefined) {
                    console.log("rketan : placeOrder : ", Date.now())
                    var event = await localContract.methods.placeOrder(productID, Date.now()).send({ from: acc });
                }
            } else if (stateValue == 1) {
                if (distID !== null) {
                    console.log("rketan : shipToDistributor : ", Date.now())
                    var event = await localContract.methods.shipToDistributor(productID, distID, Date.now()).send({ from: acc });
                }
            }
        }
        props.parentCallback()
    }

    return (
        <>
            <Modal style={{ backgroundColor: 'rgb(0, 0, 0, 0.5) !important' }}
                show={true}
                onEnter={handleStateUpdate}
                onHide={props.parentCallback} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{marginLeft:'90px'}}> 
                        Update State for Product {props.productID}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <b style={{ float: "left", fontSize: '18px' }}>
                                Current State :
                            </b>
                            <b style={{
                                float: "right",
                                backgroundColor: props.getBgColor(stateValue),
                                width: "70%",
                                textAlign: "center",
                                fontSize: '18px'
                            }}>
                                {StateEnum[stateValue]}
                            </b>
                        </div>

                        <br></br>
                        <br></br>

                        <div style={{ paddingBlock: '10px' }}>
                            <b style={{ float: "left", fontSize: '18px' }}>
                                Next State :
                            </b>
                            <b style={{
                                float: "right",
                                backgroundColor: props.getBgColor(nextValue),
                                width: "70%",
                                textAlign: "center",
                                fontSize: '18px'
                            }}>
                                {StateEnum[nextValue]}
                            </b>
                        </div>

                        {stateValue === "1" &&
                            <div style={{marginTop:'10%'}}>
                                <b style={{fontSize: '18px'}}> Enter Distributor Username to ship to the Distributor </b>
                                <input
                                    style={{width: '100%', lineHeight:'40px', marginTop:'2%'}}
                                    type="text"
                                    value={distID}
                                    placeholder="Distributor Username"
                                    onChange={e => setDistID(e.target.value)}
                                />
                                <select onChange={e => setDistID(e.target.value)}>
                                    <option>
                                        
                                    </option>
                                    {knownDists.map((dist) => (
                                    <option>
                                        {dist}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" //disabled={!validateDist()}
                        onClick={() => callback()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default ChangeStatus;