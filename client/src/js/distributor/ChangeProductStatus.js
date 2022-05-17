import React, {useContext, useState} from "react";
import {AppContext} from '../App'
import {Button, Modal} from 'react-bootstrap';

function DistributorChangeProductStatus(props) {
    const [stateValue, setStateValue] = useState(0);
    const [nextValue, setNextValue] = useState(0);
    const [productID, setProductID] = useState(0);

    const {web3, contract, accountId} = useContext(AppContext);
    const [localContract, setLocalContract] = contract;
    const [acc, setAcc] = accountId;
    const [localWeb3, setLocalWeb3] = web3;

    React.useEffect(() => {
        setStateValue(props.currentState)
        const nextVal = props.currentState + 1;
        setNextValue(nextVal)

        setProductID(props.productID)
    }, []);

    async function callback() {
        // Declare and Initialize a variable for event
        let eventEmitted = false;
        // Watch the emitted event OrderPlaced()
        localContract.events.OrderPlaced(() => {
            eventEmitted = true;
            console.log("rketan: WOHOOOO", eventEmitted)
        });

        // update the state to the backend
        if (localContract.methods !== undefined) {
            if (stateValue === 3) {
                console.log("rketan: place order")

                let p1 = await localContract.methods.products(1).call();
                console.log("rketan: p1 state", p1.currentStatus)

                console.log("rketan: accid", acc)

                const accounts = await localWeb3.eth.getAccounts();

                if (props.productID !== undefined) {
                    let event = await localContract.methods.recieveAsDistributor(props.productID).send({from: accounts[0]});
                    console.log("rketan: response", event)
                }


                let p2 = await localContract.methods.products(1).call();
                console.log("rketan: p2 state", p2.currentStatus)

            } else if (stateValue == 4) {
                console.log("rketan: ship to vendor") //TOdO: prompt for vendor id
                const response1 = await localContract.methods.shipToVendor(props.prodID, "0x128C691a6A26848E4A7Ed5EbcbC480f55B611Ba8").call();
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

export default DistributorChangeProductStatus;