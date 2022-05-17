import React, {useContext, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {AppContext} from "./App";
import {useNavigate} from "react-router";


function Login() {

    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";

    const {web3, contract, accountId} = useContext(AppContext);
    const [localWeb3, setLocalWeb3] = web3;
    const [localAccount, setAccount] = accountId;
    const [localContract, setLocalContract] = contract;


    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEthereumId, setUserEthereumId] = useState("");


    function validateForm() {
        return userName.length > 0 && userEthereumId.length > 0;
    }

    async function getUserType(accounts) {

        const roleName = await localContract.methods.getRole(userEthereumId).call();
        console.log(roleName);
        if (roleName !== undefined && roleName !== '') {
            return roleName;
        }
        throw new Error("User not exists");
    }

    async function routeUser(userType) {
        console.log(userType)
        setAccount(userEthereumId);
        switch (userType) {
            case VENDOR:
                navigate("/vendor", {state: {"userName": userName}});
                break;
            case MANUFACTURER:
                navigate("/manufacturer", {state: {"userName": userName}});
                break;
            case DISTRIBUTOR:
                navigate("/distributor", {state: {"userName": userName}});
                break;
            case CUSTOMER:
                navigate("/customer", {state: {"userName": userName}});
                break;
            default:
                console.log("Invalid user type");
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        const fetchAccounts = async () => {
            if (localWeb3 !== undefined) {
                // const accounts =  await localWeb3.eth.getAccounts();
                const accounts =  await localWeb3.eth.requestAccounts();

                if (accounts[0] !== userEthereumId) {
                    throw new Error("User ethereum id not linked with metamask");
                }
                return accounts[0];
            }
        };
        await fetchAccounts().then(getUserType).then(routeUser).catch(console.error);
    }

    return (

        <div className="Login">
            <Form onSubmit={handleLogin}>
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
                <Button class="btn btn-primary" block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
            <br/>

            <span>New user?
                <Button class="btn btn-primary" block size="lg" onClick={() => navigate("/signup")}>
                    Signup
                </Button>
            </span>

        </div>
    );
}

export default Login;