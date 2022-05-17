import React, {useContext, useState} from "react";
import {AppContext} from '../App'
import {Button, Modal} from 'react-bootstrap';

function VendorChangeProductStatus(props) {
    const [stateValue, setStateValue] = useState(0);
    const [nextValue, setNextValue] = useState(0);
    const [productID, setProductID] = useState(0);

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

    async function callback() { //TODO: graceful open, close on success/failure/close button of modal
        // Declare and Initialize a variable for event
        let eventEmitted = false;
        // Watch the emitted event OrderPlaced()
        localContract.events.OrderPlaced(() => {
            eventEmitted = true;
            console.log("rketan: WOHOOOO", eventEmitted)
        });

        // update the state to the backend
        if (localContract.methods !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            if (stateValue === 4) {
                if (props.productID !== undefined) {
                    let event = await localContract.methods.recieveAsVendor(props.productID).send({from: accounts[0]});
                }

            } else if (stateValue === 5) {
                await localContract.methods.sellProduct(props.productID).send({from: accounts[0]});
            }
        }
        props.parentCallback()
    }

    return (
        <>
            <Modal style={{backgroundColor: 'rgb(0, 0, 0, 0.5) !important'}}
                   show={true} onHide={props.parentCallback} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update State Dialog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Current State : {stateValue}
                        <br></br>
                        Next State: {nextValue}
                        {/*//TODO: replace with enum*/}
                        <br></br>
                        Product ID: {props.productID}
                        <br></br>
                        Index: {props.index}
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

export default VendorChangeProductStatus;