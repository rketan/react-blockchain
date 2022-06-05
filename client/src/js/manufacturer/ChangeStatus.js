import React, {useContext, useState} from "react";
import StateEnum from "../StateEnum"
import {Button, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppContext} from '../App'


function ChangeStatus(props) {
    const [stateValue, setStateValue] = useState("-1");
    const [nextValue, setNextValue] = useState(0);
    const [productID, setProductID] = useState(0);
    const [distName, setDistName] = useState(null);

    const {web3, contract, accountId} = useContext(AppContext);
    const localContract = contract[0];
    const [acc, setAcc] = accountId;
    const localWeb3 = web3[0];

    React.useEffect(() => {
        const stateVal = Number(stateValue);
        let nextVal;
        if (stateVal === 1) {
            nextVal = 7;
        } else if (stateVal === 7) {
         nextVal = 2;
        }
        setNextValue(nextVal)

        setProductID(props.productID)
    }, [stateValue]);

    const handleStateUpdate = () => {
        setStateValue(props.currentState)
    }

    async function callback() {
        if (localWeb3 !== undefined && localWeb3.eth !== undefined) {
            const accounts = await localWeb3.eth.getAccounts();
            setAcc(accounts[0]);
        }

        if (localContract !== undefined && localContract.methods !== undefined) {
            if (stateValue === "1") {
                if (productID !== undefined) {
                    await localContract.methods.orderAccepted(productID, Date.now()).send({from: acc});
                }
            } else if (stateValue === "7") {
                if (distName !== null) {
                    await localContract.methods.shipToDistributor(productID, distName, Date.now()).send({from: acc});
                }
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


                        {stateValue === "7" &&
                            <div style={{marginTop:'10%'}}>
                                <b style={{fontSize: '18px'}}> Enter Distributor Username to ship to the Distributor </b>
                                <input
                                    style={{width: '100%', lineHeight:'40px', marginTop:'2%'}}
                                    type="text"
                                    value={distName}
                                    placeholder="Distributor Name"
                                    onChange={e => setDistName(e.target.value)}
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