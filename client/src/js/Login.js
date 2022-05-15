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

    const {web3, contract, accountId, rolesContract} = useContext(AppContext);

    const [localRolesContract, setLocalRolesContract] = rolesContract;


    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [userEthereumId, setUserEthereumId] = useState("");


    function validateForm() {
        return userName.length > 0 && userEthereumId.length > 0;
    }

    async function getUserType() {
        const roleName = await localRolesContract.methods.getRole(userEthereumId).call();
        if (roleName !== undefined) {
            setUserType(roleName);
            return roleName;
        }
        throw new Error("User not exists");
    }

    function routeUser() {
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

    function handleLogin(event) {
        event.preventDefault();
        const fetchAccounts = async () => {
            if (web3 !== undefined) {
                const accounts = await web3.eth.getAccounts();
                if (!accounts.includes(userEthereumId) || accountId !== userEthereumId) {
                    throw new Error("Invalid Account id");
                }
            }

        };
        fetchAccounts().then(getUserType).then(routeUser).catch(console.error);
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