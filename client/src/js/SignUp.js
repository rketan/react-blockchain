import React, {useContext, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import {useNavigate} from "react-router";
import {AppContext} from './App'
import logo from '../static/img/blockchain.jpg'

function SignUp() {
    const {web3, contract, accountId} = useContext(AppContext);
    const localWeb3 = web3[0];
    const localContract = contract[0];
    const setAccount = accountId[1];

    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [userEthereumId, setUserEthereumId] = useState("");
    const [password, setPassword] = useState("");


    const VENDOR = "vendor";
    const MANUFACTURER = "manufacturer";
    const DISTRIBUTOR = "distributor";
    const CUSTOMER = "customer";


    function validateForm() {
        return userName.length > 0 && userType.length > 0 && userEthereumId.length > 0 && password.length > 5;
    }

    async function validateAccountIdSameAsMetamask(ethId) {
        const fetchAccounts = async () => {
            if (localWeb3 !== undefined) {
                const accounts = await localWeb3.eth.requestAccounts();
                return accounts[0];
            }
        };
        await fetchAccounts().then(accId => {
            if (accId !== ethId) {
                alert("Please input the Ethereum id currently active with metamask");
                throw new Error("Invalid user Ethereum Id");
            }
        })
    }

    async function assignRole(ethId, userName, password, role) {

        await validateAccountIdSameAsMetamask(ethId);
        if (localContract !== undefined || localContract.methods !== undefined) {
            if (role === MANUFACTURER) {
                const isManufacturer = await localContract.methods.isManufacturer(ethId).call();
                console.log(isManufacturer);
                console.log(await localContract.methods.isManufacturerViaName(userName).call());
                console.log(await localContract.methods.isManufacturerViaName("xx").call())

                if (!isManufacturer) {
                    await localContract.methods.addManufacturer(ethId, userName, password).send({from: ethId});
                    localStorage.setItem("USER_NAME", userName);
                } else {
                    alert("User already registered, please login");
                    navigate("/login");
                    window.location.reload(false);
                }
            } else if (role === DISTRIBUTOR) {
                const isDistributor = await localContract.methods.isDistributor(ethId).call();
                if (!isDistributor) {
                    await localContract.methods.addDistributor(ethId, userName, password).send({from: ethId});
                    localStorage.setItem("USER_NAME", userName);
                } else {
                    alert("User already registered, please login");
                    navigate("/login");
                    window.location.reload(false);
                }

            } else if (role === VENDOR) {
                const isVendor = await localContract.methods.isVendor(ethId).call();
                if (!isVendor) {
                    await localContract.methods.addVendor(ethId, userName, password).send({from: ethId});
                    localStorage.setItem("USER_NAME", userName);
                } else {
                    alert("User already registered, please login");
                    navigate("/login");
                    window.location.reload(false)
                }
            } else {
                alert("error, invalid role")
            }
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setAccount(userEthereumId);
        switch (userType) {
            case VENDOR:
                assignRole(userEthereumId, userName, password, VENDOR);
                navigate("/vendor", {state: {"userName": userName}});
                break;
            case MANUFACTURER:
                assignRole(userEthereumId, userName, password, MANUFACTURER);
                navigate("/manufacturer", {state: {"userName": userName}});
                break;
            case DISTRIBUTOR:
                assignRole(userEthereumId, userName, password, DISTRIBUTOR);
                navigate("/distributor", {state: {"userName": userName}});
                break;
            default:
                console.log("Invalid user type");
        }
    }

    return (
        <div className="Login">
            
            <img
          alt=""
          src={logo}
          width="200"
          height="200"
          className="d-inline-block align-top"
          style={{ borderRadius: "50%", marginTop:'2%', marginLeft:'3%'}}
        />

        <h1 style={{textAlign: "center", alignSelf: "center", top:'70px', position:'fixed', left:'800px', fontSize:'78px'}}> ZotChain
            </h1>
            <Form onSubmit={handleSubmit} className="card p-4 bg-light">
                <Form.Group size="lg" controlId="userName">
                    <h3 style={{color: "black", textAlign: "center", alignSelf: "center"}}>Signup</h3>
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

                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        autoFocus
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    </Form.Select>
                </Form.Group>
                <br/>
                <Button class="btn btn-primary" block size="lg" type="submit" disabled={!validateForm()}>
                    Sign up
                </Button>
            </Form>
        </div>
    );
}

export default SignUp;