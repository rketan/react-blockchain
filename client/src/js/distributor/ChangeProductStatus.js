import React, {useContext, useState} from "react";
import {AppContext} from '../App'
import {Button, Modal} from 'react-bootstrap';
import StateEnum from "../StateEnum";

function DistributorChangeProductStatus(props) {
    const [stateValue, setStateValue] = useState(0);
    const [nextValue, setNextValue] = useState(0);
    const [productID, setProductID] = useState(0);

    const [vendorId, setVendorId] = useState(null);


    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    React.useEffect(() => {
        setStateValue(parseInt(props.currentState));
        const nextVal = parseInt(props.currentState) + 1;
        setNextValue(nextVal)

        setProductID(parseInt(props.productID))
    }, []);

    const handleStateUpdate = () => {
        setStateValue(props.currentState)
    }

    async function callback() { //TODO: graceful open, close on success/failure/close button of modal
        // update the state to the backend
        if (localContract.methods !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            if (stateValue === 2) {

                if (props.productID !== undefined) {
                    await localContract.methods.recieveAsDistributor(props.productID, Date.now()).send({from: accounts[0]});
                }


            } else if (stateValue === 3) {
                await localContract.methods.shipToVendor(props.productID, vendorId, Date.now()).send({from: accounts[0]});
            }
        }
        props.parentCallback()
    }

    return (
        <>
            <Modal style={{backgroundColor: 'rgb(0, 0, 0, 0.5) !important'}}
                   show={true}
                   onEnter={handleStateUpdate}
                   onHide={props.parentCallback}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{marginLeft: '120px'}}>
                            Update State Dialog
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Current State : {StateEnum[stateValue]}
                        <br></br>
                        Next State: {StateEnum[nextValue]}
                        {/*//TODO: replace with enum*/}
                        <br></br>
                        Product ID: {props.productID}
                        <br></br>

                        {stateValue === 3 &&
                            <div style={{marginTop: '5%'}}>
                                <h5> Enter Vendor ID to ship to the vendor </h5>
                                <input
                                    style={{width: '100%', lineHeight: '40px'}}
                                    type="text"
                                    value={vendorId}
                                    placeholder="Vendor ID"
                                    onChange={e => setVendorId(e.target.value)}
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

export default DistributorChangeProductStatus;