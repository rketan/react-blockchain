import React, {useContext, useState} from "react";
import {AppContext} from '../App'
import {Button, Modal} from 'react-bootstrap';
import StateEnum from "../StateEnum";

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
    }, [stateValue]);

    const handleStateUpdate = () => {
        setStateValue(props.currentState)
    }

    async function callback() {
        if(localWeb3 !== undefined && localWeb3.eth !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            setAcc(accounts[0]);
        }
        if (localContract.methods !== undefined) {
            if (stateValue === 4) {
                if (props.productID !== undefined) {
                    await localContract.methods.recieveAsVendor(props.productID, Date.now()).send({from: acc});
                }

            } else if (stateValue === 5) {
                await localContract.methods.sellProduct(props.productID, Date.now()).send({from: acc});
            }
        }
        props.parentCallback()
    }

    return (
        <>
            <Modal style={{backgroundColor: 'rgb(0, 0, 0, 0.5) !important'}}
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