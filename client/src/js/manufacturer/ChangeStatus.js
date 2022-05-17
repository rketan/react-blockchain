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

    const { web3, contract, accountId } = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    React.useEffect(() => {
        const nextVal = Number(stateValue) + 1;
        setNextValue(nextVal)

        setProductID(props.productID)
    }, [stateValue]);

    const handleStateUpdate = () => {
        setStateValue(props.currentState)
    }

    async function callback() {
        if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            setAcc(accounts[0]);
        }

        // update the state to the backend
        if (localContract !== undefined && localContract.methods !== undefined) {
            if (stateValue == 0) {
                if (productID !== undefined) {
                    var event = await localContract.methods.placeOrder(productID).send({ from: acc });
                }
            } else if (stateValue == 1) {
                if (distID !== null) {
                    var event = await localContract.methods.shipToDistributor(productID, distID).send({ from: acc });
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
                        <div style={{marginLeft:'120px'}}> 
                        Update State Dialog 
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h4> Current State : {StateEnum[stateValue]} </h4>
                        <br></br>
                        <h4> Next State: {StateEnum[nextValue]} </h4>
                        <br></br>
                        <h4> Product ID: {props.productID} </h4>
                        <br></br>

                        {stateValue === "1" &&
                            <div style={{marginTop:'5%'}}>
                                <h5> Enter Distributor ID to ship to the distributor </h5>
                                <input
                                    style={{width: '100%', lineHeight:'40px'}}
                                    type="text"
                                    value={distID}
                                    placeholder="Distributor ID"
                                    onChange={e => setDistID(e.target.value)}
                                />
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                        onClick={() => callback()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default ChangeStatus;