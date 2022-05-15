import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import { useNavigate } from "react-router";
import { AppContext } from './App'

function LandingPage() {
    const { web3, contract, accountId } = useContext(AppContext);
    const [localWeb3, setLocalWeb3] = web3;
    const [localContract, setLocalContract] = contract;
    const [account, setAccount] = accountId;

    React.useEffect(() => {
        const fetchAccounts = async () => {
            if (localWeb3 !== undefined || localWeb3 !== null) {
                // Use web3 to get the user's accounts.
                //const accounts = await localWeb3.eth.getAccounts();
            }

        };
        fetchAccounts().catch(console.error);
    }, []);


    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [userEthereumId, setUserEthereumId] = useState("");

    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";


    function validateForm() {
        return userName.length > 0 && userType.length > 0 && userEthereumId;
    }

    async function assignRole(ethId) {
        // Get manufacturer list and check if this account is assigned the correct role
        if (localContract !== undefined || localContract.methods !== undefined) {
            const isManufacturer = await localContract.methods.isManufacturer(ethId).call();
            if (!isManufacturer) {
                // assign manufacturer role to this account
                const assignMan = await localContract.methods.addManufacturer(ethId).send({from: ethId});
            }
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        switch (userType) {
            case VENDOR:
                navigate("/vendor", { state: { "userName": userName } });
                break;
            case MANUFACTURER:
                assignRole(userEthereumId);
                setAccount(userEthereumId);
                navigate("/manufacturer", { state: { "userName": userName } });
                break;
            case DISTRIBUTOR:
                navigate("/distributor", { state: { "userName": userName } });
                break;
            case CUSTOMER:
                navigate("/customer", { state: { "userName": userName } });
                break;
            default:
                console.log("Invalid user type");
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="userName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group size="lg" controlId="user-ethereum-id">
                    <Form.Label>User Ethereum ID</Form.Label>
                    <Form.Control
                        autoFocus
                        type="text"
                        value={userEthereumId}
                        onChange={(e) => setUserEthereumId(e.target.value)}
                    />
                </Form.Group>

                <Form.Group size="lg" controlId="user-type">
                    <Form.Label>User Type</Form.Label>
                    <Form.Select aria-label="Default select example" value={userType}
                        onChange={(e) => setUserType(e.target.value)}>
                        <option>User type</option>
                        <option value="vendor">Vendor</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="customer">Customer</option>
                    </Form.Select>
                </Form.Group>
                <Button class="btn btn-primary" block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default LandingPage;